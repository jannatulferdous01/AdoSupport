from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductAdminSerializer, CartSerializer, AddToCartSerializer,
    UpdateCartItemSerializer, OrderListSerializer, OrderDetailSerializer,
    CreateOrderSerializer, OrderAdminSerializer, UpdateOrderStatusSerializer,
    ReviewSerializer, CreateReviewSerializer, UpdateReviewSerializer, AdminLoginSerializer, AdminProfileSerializer
)
from .models import (
    Category, Product, ProductImage, Cart, CartItem,
    Order, OrderItem, Review
)
from rest_framework.permissions import IsAdminUser
from decimal import Decimal
from django.utils import timezone
from django.db.models import Q, Avg, Count, Sum, F
from collections import defaultdict
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotAuthenticated
from django.db import IntegrityError
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
import google.generativeai as genai
from django.http import StreamingHttpResponse
import re
from django.utils.html import escape
import json
from django.db.models import Count, OuterRef, Subquery, Q, F, Value, TextField, CharField
from django.db import models

from .utils import success_response, error_response, api_error, api_ok
from .models import User, UserProfile, ChatHistory, ChatSession, ChatMessage, Comment, CommentLike, Post, PostReaction, PostReport, PostImage, SavedPost, Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Review
from .serializers import UserProfileSerializer, ChatSessionSerializers, ChatMessageSerializer, PostListSerializer, PostImageSerializer, PostCreateUpdateSerializer, PostDetailSerializer, PostReactionSerializer, PostReportSerializer, CategorySerializer, ProductListSerializer, ProductDetailSerializer, ProductAdminSerializer, CartSerializer, AddToCartSerializer, UpdateCartItemSerializer, OrderListSerializer, OrderDetailSerializer, CreateOrderSerializer, OrderAdminSerializer, UpdateOrderStatusSerializer, ReviewSerializer, CreateReviewSerializer, UpdateReviewSerializer


class AuthMixin:
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

# ======================================= login, register ======================================


class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")

        if role not in ["adolescent", "parent"]:
            return Response({"error": "Invalid role selected. Choose either 'adolescent' or 'parent'."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "A user with this username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                email=email, username=username, password=password, role=role
            )
            refresh = RefreshToken.for_user(user)
            return Response(success_response(
                message="Registration successful",
                data={
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }
            ), status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"error": "Database integrity error: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials. Please try again."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken.for_user(user)
            return Response(success_response(
                message="Login successful",
                data={
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }
            ), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================ user profile =========================================
class UserProfileView(AuthMixin, APIView):
    serializer_class = UserProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        try:
            profile, created = UserProfile.objects.get_or_create(
                user=request.user)
            serializer = UserProfileSerializer(
                profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(success_response(
                    message="Profile updated successfully.",
                    data=serializer.data
                ), status=status.HTTP_200_OK)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except NotAuthenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==================================== Change Password =========================================


class ChangePasswordView(AuthMixin, APIView):

    def patch(self, request):
        email = request.data.get("email")
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not email or not current_password or not new_password:
            return Response(error_response(
                message="Email, current password, and new password are required.",
                error_type="ValidationError",
                status_code=400
            ), status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=current_password)
        if user is None:
            return Response(error_response(
                message="Invalid email or current password.",
                error_type="AuthenticationError",
                status_code=401
            ), status=status.HTTP_401_UNAUTHORIZED)

        if len(new_password) < 8:
            return Response(error_response(
                message="New password must be at least 8 characters long.",
                error_type="ValidationError",
                status_code=400
            ), status=status.HTTP_400_BAD_REQUEST)

        try:
            user.set_password(new_password)
            user.save()
            return Response(success_response(
                message="Password updated successfully.",
                data=None
            ), status=status.HTTP_200_OK)
        except Exception as e:
            return Response(error_response(
                message=f"An unexpected error occurred: {str(e)}",
                error_type="ServerError",
                status_code=500
            ), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParentView(AuthMixin, APIView):
    serializer_class = UserProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        try:
            if request.user.role != "parent":
                return Response({"error": "Only parents can access this view."}, status=status.HTTP_403_FORBIDDEN)

            profile, created = UserProfile.objects.get_or_create(
                user=request.user)
            serializer = UserProfileSerializer(
                profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except NotAuthenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            if request.user.role != "parent":
                return Response({"error": "Only parents can access this view."}, status=status.HTTP_403_FORBIDDEN)

            profile, created = UserProfile.objects.get_or_create(
                user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except NotAuthenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdolescentView(AuthMixin, APIView):
    serializer_class = UserProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        try:
            if request.user.role != "adolescent":
                return Response({"error": "Only adolescents can access this view."}, status=status.HTTP_403_FORBIDDEN)

            profile, created = UserProfile.objects.get_or_create(
                user=request.user)
            serializer = UserProfileSerializer(
                profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except NotAuthenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            if request.user.role != "adolescent":
                return Response({"error": "Only adolescents can access this view."}, status=status.HTTP_403_FORBIDDEN)

            profile, created = UserProfile.objects.get_or_create(
                user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except NotAuthenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==================================== chatbot =====================================


class Chatbot(AuthMixin, APIView):

    def post(self, request):
        user_ques = request.data.get("query")
        # Changed from session_id to chat_id
        chat_id = request.data.get("chat_id")

        if not user_ques:
            return Response(error_response("Query is required."), status=status.HTTP_400_BAD_REQUEST)

        try:
            if chat_id:
                try:
                    chat_session = ChatSession.objects.get(
                        id=chat_id, user=request.user)  # Using integer chat_id
                    print(f"Debug: Continuing existing session {chat_id}")
                except ChatSession.DoesNotExist:
                    return Response(error_response("Invalid chat ID."), status=status.HTTP_400_BAD_REQUEST)
            else:
                chat_session = ChatSession.objects.create(
                    user=request.user,
                    title="New Chat"
                )
                print(f"Debug: Created new session {chat_session.id}")

            # Configure AI
            genai.configure(api_key="AIzaSyCnXk7ecKigQtbYD7ZnbToXntGQW7FRycY")

            generation_config = {
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 1000,
            }

            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_ONLY_HIGH"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_ONLY_HIGH"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_ONLY_HIGH"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_ONLY_HIGH"
                }
            ]

            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config=generation_config,
                safety_settings=safety_settings,
            )

            # Enhanced system prompt for markdown formatting
            system_prompt = """You are a helpful mental health assistant for adolescents and parents.
            Provide supportive, empathetic, and helpful advice while encouraging professional help when needed.

            Please format your responses using markdown for better readability:
            - Use **bold** for important points
            - Use *italics* for emphasis
            - Use bullet points or numbered lists where appropriate
            - Use ## headings for different sections
            - Use > blockquotes for important advice or tips

            Keep responses structured, clear, and supportive."""

            # Get conversation context if continuing session
            context = ""
            if chat_id:  # Changed from session_id to chat_id
                # Get previous messages for context (last 10 messages)
                previous_messages = chat_session.messages.order_by(
                    "-timestamps")[:10]
                context_parts = []
                for msg in reversed(previous_messages):
                    context_parts.append(f"{msg.role}: {msg.content}")
                context = "Previous conversation:\n" + \
                    "\n".join(context_parts) + "\n\n"

            full_prompt = f"{system_prompt}\n\n{context}Current user question: {user_ques}"

            def generate_streaming_response():
                try:
                    # Save user message first
                    user_message = ChatMessage.objects.create(
                        sessions=chat_session,
                        role='user',
                        content=user_ques
                    )

                    # Generate streaming response
                    response_stream = model.generate_content(
                        full_prompt, stream=True)

                    full_response = ""

                    # Start streaming response
                    yield "data: " + json.dumps({
                        "type": "start",
                        "message": "Generating response...",
                        "chat_id": str(chat_session.id)
                    }) + "\n\n"

                    for chunk in response_stream:
                        if chunk.candidates and len(chunk.candidates) > 0:
                            candidate = chunk.candidates[0]

                            # Check for safety blocks
                            if candidate.finish_reason == 2:  # SAFETY
                                yield "data: " + json.dumps({
                                    "type": "error",
                                    "content": "I'm sorry, I can't provide a response to that question due to safety guidelines. Please ask a different question about mental health."
                                }) + "\n\n"
                                return

                            if candidate.content and candidate.content.parts:
                                for part in candidate.content.parts:
                                    if hasattr(part, 'text') and part.text:
                                        chunk_text = part.text
                                        full_response += chunk_text

                                        yield "data: " + json.dumps({
                                            "type": "chunk",
                                            "content": chunk_text
                                        }) + "\n\n"

                    # Save assistant response
                    if full_response.strip():
                        assistant_message = ChatMessage.objects.create(
                            sessions=chat_session,
                            role='assistant',
                            content=full_response.strip()
                        )

                        chat_session.save()

                        if chat_session.title == "New Chat":
                            first_user_msg = chat_session.messages.filter(
                                role="user").order_by("timestamps").first()
                            if first_user_msg:
                                from .utils import generate_ai_session_title
                                chat_session.title = generate_ai_session_title(
                                    first_user_msg.content)
                                # End streaming
                                chat_session.save(update_fields=["title"])
                    yield "data: " + json.dumps({
                        "type": "end",
                        "message": "Response completed",
                        "chat_id": chat_session.id
                    }) + "\n\n"

                except Exception as e:
                    yield "data: " + json.dumps({
                        "type": "error",
                        "content": f"An error occurred: {str(e)}"
                    }) + "\n\n"

            response = StreamingHttpResponse(
                generate_streaming_response(),
                content_type='text/event-stream'
            )

            response['Cache-Control'] = 'no-cache'
            response['X-Accel-Buffering'] = 'no'
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Headers'] = 'Cache-Control, Authorization, Content-Type'
            response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'

            return response

        except Exception as e:
            return Response(error_response(f"An error occurred: {str(e)}"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# chatbot session
class ChatSessionListView(AuthMixin, ListAPIView):
    serializer_class = ChatSessionSerializers

    def get_queryset(self):
        user = self.request.user
        print(f"Debug: Current user: {user} (ID: {user.id})")

        qs = ChatSession.objects.filter(user=user)

        # Add search functionality within sessions
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(messages__content__icontains=search)
            ).distinct()

        latest_msg_subq = ChatMessage.objects.filter(
            sessions=OuterRef("pk")).order_by("-timestamps")

        # annotate message count, last message and the last message role
        qs = qs.annotate(
            message_count=Count("messages", distinct=True),
            last_message=Coalesce(
                Subquery(latest_msg_subq.values("content")[:1]), Value(""), output_field=TextField()),
            last_message_role=Coalesce(
                Subquery(latest_msg_subq.values("role")[:1]), Value(""), output_field=CharField()),
        ).order_by("-updated_at")

        try:
            limit = int(self.request.query_params.get("limit", 50))
        except ValueError:
            limit = 50
        limit = max(1, min(limit, 100))

        final_qs = qs[:limit]
        print(f"Debug: Final queryset count: {final_qs.count()}")
        return final_qs

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        ser = self.get_serializer(queryset, many=True)
        return api_ok("Chat sessions retrieved successfully", ser.data)


class ChatSessionMessageView(AuthMixin, APIView):
    def get(self, request, chat_id):
        try:
            session = ChatSession.objects.get(id=chat_id, user=request.user)
        except ChatSession.DoesNotExist:
            return api_error("Specified chat session does not exist", code="CHAT_NOT_FOUND", status_code=status.HTTP_404_NOT_FOUND)

        # all messages using sessions
        messages = session.messages.all().order_by("timestamps")
        data = ChatMessageSerializer(messages, many=True).data
        return api_ok("Chat messages retrieved successfully", data)


class ChatSessionDeleteView(AuthMixin, APIView):
    def delete(self, request, chat_id):
        try:
            session = ChatSession.objects.get(id=chat_id, user=request.user)
        except ChatSession.DoesNotExist:
            return api_error("Specified chat session doesn't exist", code="CHAT_NOT_FOUND", status_code=status.HTTP_404_NOT_FOUND)

        delete_id = str(session.id)
        session.delete()
        return api_ok(
            "Chat session deleted successfully.",
            {"deleted_chat_id": delete_id},
        )

# ================================ COMMUNITY VIEWS ================================


class PostListCreateView(AuthMixin, APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        """Get all posts with filters"""
        try:
            # Get query parameters
            category = request.query_params.get('category', None)
            sort_by = request.query_params.get('sort', 'recent')
            search = request.query_params.get('search', None)
            limit = min(int(request.query_params.get('limit', 20)), 50)
            offset = int(request.query_params.get('offset', 0))

            # Base queryset
            posts = Post.objects.filter(
                is_deleted=False).select_related('author')

            # Apply category filter
            if category:
                valid_categories = ['questions',
                                    'experiences', 'resources', 'general']
                if category not in valid_categories:
                    return api_error(
                        "Invalid post category",
                        status_code=400,
                        code="INVALID_CATEGORY",
                        details={
                            'field': 'category',
                            'provided': category,
                            'allowed': valid_categories
                        }
                    )
                posts = posts.filter(category=category)

            # Apply search filter
            if search:
                posts = posts.filter(
                    Q(title__icontains=search) |
                    Q(content__icontains=search) |
                    Q(tags__icontains=search)
                )

            # Apply sorting
            if sort_by == 'recent':
                posts = posts.order_by('-created_at')
            elif sort_by == 'popular':
                posts = posts.annotate(
                    reaction_count=Count('reactions')
                ).order_by('-reaction_count', '-created_at')
            elif sort_by == 'most_liked':
                posts = posts.annotate(
                    like_count=Count('reactions', filter=Q(
                        reactions__reaction_type='like'))
                ).order_by('-like_count', '-created_at')
            else:
                posts = posts.order_by('-created_at')

            # Get total count before pagination
            total_count = posts.count()

            # Apply pagination
            posts = posts[offset:offset + limit]

            # Serialize data
            serializer = PostListSerializer(
                posts,
                many=True,
                context={'request': request}
            )

            # Calculate pagination metadata
            current_page = (offset // limit) + 1
            total_pages = (total_count + limit - 1) // limit

            return api_ok(
                "Posts retrieved successfully",
                {
                    'posts': serializer.data,
                    'meta': {
                        'total_count': total_count,
                        'current_page': current_page,
                        'total_pages': total_pages,
                        'has_next': offset + limit < total_count,
                        'has_previous': offset > 0
                    }
                }
            )

        except ValueError as e:
            return api_error(
                "Invalid query parameters",
                status_code=400,
                code="INVALID_REQUEST",
                details={'message': str(e)}
            )
        except Exception as e:
            return api_error(
                "Failed to retrieve posts",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def post(self, request):
        """Create a new post"""
        try:
            # Validate required fields
            title = request.data.get('title', '').strip()
            content = request.data.get('content', '').strip()
            category = request.data.get('category', '').strip()

            if not all([title, content, category]):
                missing_fields = []
                if not title:
                    missing_fields.append('title')
                if not content:
                    missing_fields.append('content')
                if not category:
                    missing_fields.append('category')

                return api_error(
                    "Missing required fields",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'missing_fields': missing_fields}
                )

            # Validate category
            valid_categories = ['questions',
                                'experiences', 'resources', 'general']
            if category not in valid_categories:
                return api_error(
                    "Invalid post category",
                    status_code=400,
                    code="INVALID_CATEGORY",
                    details={
                        'field': 'category',
                        'provided': category,
                        'allowed': valid_categories
                    }
                )

            # Process tags
            tags = request.data.get('tags', '')
            if isinstance(tags, str):
                tags = [tag.strip() for tag in tags.split(',') if tag.strip()]

            # Get images
            images = request.FILES.getlist('images', [])

            # Validate number of images
            if len(images) > 5:
                return api_error(
                    "Too many images",
                    status_code=400,
                    code="TOO_MANY_FILES",
                    details={'max_files': 5, 'provided': len(images)}
                )

            # Validate each image
            for image in images:
                # Check file size (5MB)
                if image.size > 5 * 1024 * 1024:
                    return api_error(
                        f"Image file too large: {image.name}",
                        status_code=400,
                        code="FILE_TOO_LARGE",
                        details={'max_size': '5MB', 'file': image.name}
                    )

                # Check file type
                ext = image.name.split('.')[-1].lower()
                if ext not in ['jpg', 'jpeg', 'png', 'gif']:
                    return api_error(
                        f"Invalid file type: {ext}",
                        status_code=400,
                        code="INVALID_FILE_TYPE",
                        details={'allowed': ['jpg', 'jpeg',
                                             'png', 'gif'], 'provided': ext}
                    )

            # Create post
            post = Post.objects.create(
                title=title,
                content=content,
                category=category,
                tags=tags,
                author=request.user
            )

            # Create images
            for image in images:
                PostImage.objects.create(post=post, image=image)

            return api_ok(
                "Post created successfully",
                data={
                    'id': str(post.id),
                    'created_at': post.created_at.isoformat()
                },
                status_code=status.HTTP_201_CREATED
            )

        except Exception as e:
            return api_error(
                "Failed to create post",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class PostDetailView(AuthMixin, APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, post_id):
        """Get single post with all details"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            # Increment view count
            post.increment_views()

            # Serialize post
            serializer = PostDetailSerializer(
                post, context={'request': request})

            return api_ok(
                "Post retrieved successfully",
                serializer.data
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND",
                details={'post_id': post_id}
            )
        except Exception as e:
            return api_error(
                "Failed to retrieve post",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def patch(self, request, post_id):
        """Update post"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            # Check if user is the author
            if post.author != request.user:
                return api_error(
                    "You don't have permission to edit this post",
                    status_code=403,
                    code="FORBIDDEN"
                )

            # If any field is provided but empty, return error
            empty_fields = []
            for key, val in request.data.items():
                if val is None:
                    empty_fields.append(key)
                elif isinstance(val, str) and val.strip() == "":
                    empty_fields.append(key)
                elif isinstance(val, (list, tuple)) and len(val) == 0:
                    empty_fields.append(key)
            if empty_fields:
                return api_error(
                    "One or more fields are empty",
                    status_code=400,
                    code="EMPTY_FIELDS",
                    details={'fields': empty_fields}
                )

            # Update fields if provided
            if 'title' in request.data:
                post.title = request.data['title']

            if 'content' in request.data:
                post.content = request.data['content']

            if 'category' in request.data:
                category = request.data['category']
                valid_categories = ['questions',
                                    'experiences', 'resources', 'general']
                if category not in valid_categories:
                    return api_error(
                        "Invalid post category",
                        status_code=400,
                        code="INVALID_CATEGORY",
                        details={'allowed': valid_categories}
                    )
                post.category = category

            if 'tags' in request.data:
                tags = request.data['tags']
                if isinstance(tags, str):
                    tags = [tag.strip()
                            for tag in tags.split(',') if tag.strip()]
                post.tags = tags

            # Handle image removal
            if 'remove_images' in request.data:
                remove_images = request.data['remove_images']
                if isinstance(remove_images, str):
                    remove_images = [
                        int(img_id.strip()) for img_id in remove_images.split(',') if img_id.strip()]
                PostImage.objects.filter(
                    id__in=remove_images, post=post).delete()

            # Handle new images
            images = request.FILES.getlist('images', [])
            if images:
                # Check total images after addition
                current_image_count = post.images.count()
                if current_image_count + len(images) > 5:
                    return api_error(
                        "Cannot exceed 5 images per post",
                        status_code=400,
                        code="TOO_MANY_FILES"
                    )

                # Validate and add images
                for image in images:
                    if image.size > 5 * 1024 * 1024:
                        return api_error(
                            f"Image file too large: {image.name}",
                            status_code=400,
                            code="FILE_TOO_LARGE"
                        )

                    ext = image.name.split('.')[-1].lower()
                    if ext not in ['jpg', 'jpeg', 'png', 'gif']:
                        return api_error(
                            f"Invalid file type: {ext}",
                            status_code=400,
                            code="INVALID_FILE_TYPE"
                        )

                    PostImage.objects.create(post=post, image=image)

            post.save()

            return api_ok(
                "Post updated successfully",
                {
                    'id': str(post.id),
                    'updated_at': post.updated_at.isoformat()
                }
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to update post",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def delete(self, request, post_id):
        """Delete post (soft delete)"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            # Check if user is the author or admin
            if post.author != request.user and not request.user.is_staff:
                return api_error(
                    "You don't have permission to delete this post",
                    status_code=403,
                    code="FORBIDDEN"
                )

            # Soft delete
            post.is_deleted = True
            post.save()

            return api_ok(
                "Post deleted successfully",
                {'deleted_post_id': str(post.id)}
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to delete post",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class PostReactionView(AuthMixin, APIView):

    def post(self, request, post_id):
        """Add or update reaction"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            reaction_type = request.data.get('reaction_type')

            # Validate reaction type
            valid_reactions = ['like', 'love', 'support', 'celebrate']
            if not reaction_type or reaction_type not in valid_reactions:
                return api_error(
                    "Invalid reaction type",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'allowed': valid_reactions}
                )

            # Check if user already reacted
            existing_reaction = PostReaction.objects.filter(
                post=post,
                user=request.user
            ).first()

            if existing_reaction:
                # Update existing reaction
                existing_reaction.reaction_type = reaction_type
                existing_reaction.save()
                message = "Reaction updated successfully"
            else:
                # Create new reaction
                PostReaction.objects.create(
                    post=post,
                    user=request.user,
                    reaction_type=reaction_type
                )
                message = "Reaction added successfully"

            # Get updated stats
            reactions = post.reactions.all()
            stats = {
                'likes_count': reactions.filter(reaction_type='like').count(),
                'loves_count': reactions.filter(reaction_type='love').count(),
                'supports_count': reactions.filter(reaction_type='support').count(),
                'celebrates_count': reactions.filter(reaction_type='celebrate').count(),
                'total_reactions': reactions.count(),
                'comments_count': post.comments.filter(is_deleted=False, parent=None).count(),
                'views_count': post.views_count
            }

            return api_ok(
                message,
                data={
                    'post_id': str(post.id),
                    'reaction_type': reaction_type,
                    'user_interaction': {
                        'is_liked': reaction_type == 'like',
                        'is_loved': reaction_type == 'love',
                        'is_supported': reaction_type == 'support',
                        'is_celebrated': reaction_type == 'celebrate',
                        'reaction_type': reaction_type
                    },
                    'stats': stats
                }
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to add reaction",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def delete(self, request, post_id):
        """Remove reaction"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            # Find and delete reaction
            reaction = PostReaction.objects.filter(
                post=post,
                user=request.user
            ).first()

            if not reaction:
                return api_error(
                    "No reaction found to remove",
                    status_code=404,
                    code="REACTION_NOT_FOUND"
                )

            reaction.delete()

            # Get updated stats after deletion
            reactions = post.reactions.all()
            stats = {
                'likes_count': reactions.filter(reaction_type='like').count(),
                'loves_count': reactions.filter(reaction_type='love').count(),
                'supports_count': reactions.filter(reaction_type='support').count(),
                'celebrates_count': reactions.filter(reaction_type='celebrate').count(),
                'total_reactions': reactions.count(),
                'comments_count': post.comments.filter(is_deleted=False, parent=None).count(),
                'views_count': post.views_count
            }

            return api_ok(
                "Reaction removed successfully",
                data={
                    'post_id': str(post.id),
                    'user_interaction': {
                        'is_liked': False,
                        'is_loved': False,
                        'is_supported': False,
                        'is_celebrated': False,
                        'reaction_type': None
                    },
                    'stats': stats
                }
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to remove reaction",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class PostSaveView(AuthMixin, APIView):

    def post(self, request, post_id):
        """Toggle save status"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            # Check if post is already saved
            saved_post = SavedPost.objects.filter(
                post=post,
                user=request.user
            ).first()

            if saved_post:
                # Unsave
                saved_post.delete()
                message = "Post unsaved successfully"
                is_saved = False
            else:
                # Save
                SavedPost.objects.create(
                    post=post,
                    user=request.user
                )
                message = "Post saved successfully"
                is_saved = True

            return api_ok(
                message,
                {
                    'post_id': str(post.id),
                    'is_saved': is_saved
                }
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to toggle save status",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class CommentCreateView(AuthMixin, APIView):

    def post(self, request, post_id):
        """Add comment to post"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            content = request.data.get('content', '').strip()

            if not content:
                return api_error(
                    "Comment content is required",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'field': 'content'}
                )

            # Create comment
            comment = Comment.objects.create(
                post=post,
                author=request.user,
                content=content
            )

            return api_ok(
                "Comment added successfully",
                data={
                    'id': str(comment.id),
                    'post_id': str(post.id),
                    'created_at': comment.created_at.isoformat()
                },
                status_code=status.HTTP_201_CREATED
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to add comment",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class CommentReplyView(AuthMixin, APIView):
    """
    POST: Reply to comment
    """

    def post(self, request, comment_id):
        """Reply to comment"""
        try:
            parent_comment = get_object_or_404(
                Comment,
                id=comment_id,
                is_deleted=False
            )

            content = request.data.get('content', '').strip()

            if not content:
                return api_error(
                    "Reply content is required",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'field': 'content'}
                )

            # Create reply
            reply = Comment.objects.create(
                post=parent_comment.post,
                author=request.user,
                parent=parent_comment,
                content=content
            )

            return api_ok(
                "Reply added successfully",
                data={
                    'id': str(reply.id),
                    'parent_comment_id': str(parent_comment.id),
                    'post_id': str(parent_comment.post.id),
                    'created_at': reply.created_at.isoformat()
                },
                status_code=status.HTTP_201_CREATED
            )

        except Comment.DoesNotExist:
            return api_error(
                "Comment not found",
                status_code=404,
                code="COMMENT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to add reply",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class CommentLikeView(AuthMixin, APIView):
    """
    POST: Toggle like/unlike comment
    """

    def post(self, request, comment_id):
        """Toggle comment like"""
        try:
            comment = get_object_or_404(
                Comment,
                id=comment_id,
                is_deleted=False
            )

            # Check if already liked
            like = CommentLike.objects.filter(
                comment=comment,
                user=request.user
            ).first()

            if like:
                # Unlike
                like.delete()
                message = "Comment unliked successfully"
                is_liked = False
            else:
                # Like
                CommentLike.objects.create(
                    comment=comment,
                    user=request.user
                )
                message = "Comment liked successfully"
                is_liked = True

            return api_ok(
                message,
                data={
                    'comment_id': str(comment.id),
                    'is_liked': is_liked,
                    'likes_count': comment.likes.count()
                }
            )

        except Comment.DoesNotExist:
            return api_error(
                "Comment not found",
                status_code=404,
                code="COMMENT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to toggle like",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class CommentDeleteView(AuthMixin, APIView):
    """
    DELETE: Delete comment
    """

    def delete(self, request, comment_id):
        """Delete comment"""
        try:
            comment = get_object_or_404(
                Comment,
                id=comment_id,
                is_deleted=False
            )

            # Check if user is the author or admin
            if comment.author != request.user and not request.user.is_staff:
                return api_error(
                    "You don't have permission to delete this comment",
                    status_code=403,
                    code="FORBIDDEN"
                )

            # Soft delete
            comment.is_deleted = True
            comment.save()

            return api_ok(
                "Comment deleted successfully",
                {'deleted_comment_id': str(comment.id)}
            )

        except Comment.DoesNotExist:
            return api_error(
                "Comment not found",
                status_code=404,
                code="COMMENT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to delete comment",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class PostReportView(AuthMixin, APIView):
    """
    POST: Report a post
    """

    def post(self, request, post_id):
        """Report post"""
        try:
            post = get_object_or_404(Post, id=post_id, is_deleted=False)

            reason = request.data.get('reason')
            description = request.data.get('description', '').strip()

            # Validate reason
            valid_reasons = ['inappropriate_content', 'spam',
                             'harassment', 'misinformation', 'other']
            if not reason or reason not in valid_reasons:
                return api_error(
                    "Invalid report reason",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'allowed': valid_reasons}
                )

            # Check if 'other' reason requires description
            if reason == 'other' and not description:
                return api_error(
                    "Description is required for 'other' reason",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'field': 'description'}
                )

            # Check if user already reported this post
            existing_report = PostReport.objects.filter(
                post=post,
                reporter=request.user
            ).first()

            if existing_report:
                return api_error(
                    "You have already reported this post",
                    status_code=409,
                    code="ALREADY_REPORTED"
                )

            # Create report
            report = PostReport.objects.create(
                post=post,
                reporter=request.user,
                reason=reason,
                description=description
            )

            return api_ok(
                "Post reported successfully",
                {
                    'report_id': str(report.id),
                    'post_id': str(post.id)
                }
            )

        except Post.DoesNotExist:
            return api_error(
                "Post not found",
                status_code=404,
                code="POST_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to report post",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

# ==================== Product Views ====================


class ProductListView(APIView):
    """
    GET: List all products with filtering and search
    """

    def get(self, request):
        """Get all products with filtering, searching, and sorting"""
        try:
            # Start with all products
            products = Product.objects.select_related(
                'category').prefetch_related('images', 'reviews')

            # ========== Filtering ==========

            # Filter by category
            category = request.GET.get('category')
            if category:
                products = products.filter(category__slug=category)

            # Filter by tags
            tags = request.GET.get('tags')
            if tags:
                tag_list = [tag.strip() for tag in tags.split(',')]
                for tag in tag_list:
                    products = products.filter(tags__contains=[tag])

            # Search in name and description
            search = request.GET.get('search')
            if search:
                products = products.filter(
                    Q(name__icontains=search) |
                    Q(description__icontains=search)
                )

            # Price range filtering
            min_price = request.GET.get('min_price')
            if min_price:
                try:
                    products = products.filter(price__gte=Decimal(min_price))
                except:
                    pass

            max_price = request.GET.get('max_price')
            if max_price:
                try:
                    products = products.filter(price__lte=Decimal(max_price))
                except:
                    pass

            # Boolean filters
            is_new = request.GET.get('is_new')
            if is_new and is_new.lower() == 'true':
                products = products.filter(is_new=True)

            is_bestseller = request.GET.get('is_bestseller')
            if is_bestseller and is_bestseller.lower() == 'true':
                products = products.filter(is_bestseller=True)

            in_stock = request.GET.get('in_stock')
            if in_stock and in_stock.lower() == 'true':
                products = products.filter(in_stock=True)

            # ========== Sorting ==========

            sort = request.GET.get('sort', 'newest')

            if sort == 'price_asc':
                products = products.order_by('price')
            elif sort == 'price_desc':
                products = products.order_by('-price')
            elif sort == 'newest':
                products = products.order_by('-created_at')
            elif sort == 'rating':
                products = products.annotate(
                    avg_rating=Avg('reviews__rating')
                ).order_by('-avg_rating')

            # ========== Pagination ==========

            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 20))

            # Limit max items per page
            if limit > 50:
                limit = 50

            total_count = products.count()
            total_pages = (total_count + limit - 1) // limit

            start = (page - 1) * limit
            end = start + limit

            products_page = products[start:end]

            # Serialize products
            serializer = ProductListSerializer(
                products_page,
                many=True,
                context={'request': request}
            )

            return api_ok(
                "Products retrieved successfully",
                data={
                    'products': serializer.data,
                    'meta': {
                        'total_count': total_count,
                        'current_page': page,
                        'total_pages': total_pages,
                        'has_next': page < total_pages,
                        'has_previous': page > 1
                    }
                }
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve products",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class ProductDetailView(APIView):
    """
    GET: Get single product details
    """

    def get(self, request, product_id):
        """Get single product"""
        try:
            product = Product.objects.select_related('category').prefetch_related(
                'images', 'reviews'
            ).get(id=product_id, in_stock=True)

            serializer = ProductDetailSerializer(
                product, context={'request': request})

            return api_ok(
                "Product retrieved successfully",
                data=serializer.data
            )

        except Product.DoesNotExist:
            return api_error(
                "Product not found",
                status_code=404,
                code="PRODUCT_NOT_FOUND",
                details={'product_id': product_id}
            )
        except Exception as e:
            return api_error(
                "Failed to retrieve product",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


# ==================== Category Views ====================

class CategoryListView(APIView):
    """
    GET: List all categories
    """

    def get(self, request):
        """Get all categories"""
        try:
            categories = Category.objects.all()
            serializer = CategorySerializer(
                categories, many=True, context={'request': request})

            return api_ok(
                "Categories retrieved successfully",
                data=serializer.data
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve categories",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


# ==================== Cart Views ====================

class CartView(AuthMixin, APIView):
    """
    GET: Get user's cart
    DELETE: Clear cart
    """

    def get(self, request):
        """Get user's shopping cart"""
        try:
            # Get or create cart for user
            cart, created = Cart.objects.get_or_create(user=request.user)

            serializer = CartSerializer(cart, context={'request': request})

            return api_ok(
                "Cart retrieved successfully",
                data=serializer.data
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve cart",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def delete(self, request):
        """Clear user's cart"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()

            return api_ok(
                "Cart cleared successfully",
                data={'cart_id': str(cart.id)}
            )

        except Cart.DoesNotExist:
            return api_error(
                "Cart not found",
                status_code=404,
                code="CART_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to clear cart",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class CartItemView(AuthMixin, APIView):
    """
    POST: Add item to cart
    """

    def post(self, request):
        """Add item to cart"""
        try:
            serializer = AddToCartSerializer(data=request.data)

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']

            # Get or create cart
            cart, created = Cart.objects.get_or_create(user=request.user)

            # Get product
            product = Product.objects.get(id=product_id)

            # Check if product already in cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )

            if not created:
                # Update quantity if item already exists
                new_quantity = cart_item.quantity + quantity

                if new_quantity > product.stock_quantity:
                    return api_error(
                        "Insufficient stock",
                        status_code=400,
                        code="INSUFFICIENT_STOCK",
                        details={
                            'available': product.stock_quantity,
                            'requested': new_quantity
                        }
                    )

                cart_item.quantity = new_quantity
                cart_item.save()

            return api_ok(
                "Item added to cart successfully",
                data={
                    'cart_id': str(cart.id),
                    'item_id': str(cart_item.id),
                    'product_id': str(product.id),
                    'quantity': cart_item.quantity,
                    'subtotal': float(cart_item.subtotal)
                },
                status_code=status.HTTP_201_CREATED
            )

        except Product.DoesNotExist:
            return api_error(
                "Product not found",
                status_code=404,
                code="PRODUCT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to add item to cart",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class CartItemDetailView(AuthMixin, APIView):
    """
    PATCH: Update cart item quantity
    DELETE: Remove item from cart
    """

    def patch(self, request, item_id):
        """Update cart item quantity"""
        try:
            cart_item = CartItem.objects.select_related('product').get(
                id=item_id,
                cart__user=request.user
            )

            serializer = UpdateCartItemSerializer(
                instance=cart_item,
                data=request.data
            )

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            quantity = serializer.validated_data['quantity']

            # Check stock
            if quantity > cart_item.product.stock_quantity:
                return api_error(
                    "Insufficient stock",
                    status_code=400,
                    code="INSUFFICIENT_STOCK",
                    details={
                        'available': cart_item.product.stock_quantity,
                        'requested': quantity
                    }
                )

            cart_item.quantity = quantity
            cart_item.save()

            return api_ok(
                "Cart item updated successfully",
                data={
                    'item_id': str(cart_item.id),
                    'quantity': cart_item.quantity,
                    'subtotal': float(cart_item.subtotal)
                }
            )

        except CartItem.DoesNotExist:
            return api_error(
                "Cart item not found",
                status_code=404,
                code="CART_ITEM_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to update cart item",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def delete(self, request, item_id):
        """Remove item from cart"""
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )

            cart_item.delete()

            return api_ok(
                "Item removed from cart successfully",
                data={'removed_item_id': str(item_id)}
            )

        except CartItem.DoesNotExist:
            return api_error(
                "Cart item not found",
                status_code=404,
                code="CART_ITEM_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to remove cart item",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


# ==================== Order Views ====================

class OrderListView(AuthMixin, APIView):
    """
    GET: Get user's orders
    POST: Create new order
    """

    def get(self, request):
        """Get user's orders"""
        try:
            orders = Order.objects.filter(
                user=request.user).prefetch_related('items')

            # Filter by status
            status_filter = request.GET.get('status')
            if status_filter:
                orders = orders.filter(status=status_filter)

            # Pagination
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 10))

            total_count = orders.count()
            total_pages = (total_count + limit - 1) // limit

            start = (page - 1) * limit
            end = start + limit

            orders_page = orders[start:end]

            serializer = OrderListSerializer(orders_page, many=True)

            return api_ok(
                "Orders retrieved successfully",
                data={
                    'orders': serializer.data,
                    'meta': {
                        'total_count': total_count,
                        'current_page': page,
                        'total_pages': total_pages,
                        'has_next': page < total_pages,
                        'has_previous': page > 1
                    }
                }
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve orders",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def post(self, request):
        """Create new order from cart"""
        try:
            serializer = CreateOrderSerializer(data=request.data)

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            # Get user's cart
            try:
                cart = Cart.objects.prefetch_related(
                    'items__product').get(user=request.user)
            except Cart.DoesNotExist:
                return api_error(
                    "Cart not found",
                    status_code=404,
                    code="CART_NOT_FOUND"
                )

            # Check if cart is empty
            if not cart.items.exists():
                return api_error(
                    "Cannot create order with empty cart",
                    status_code=400,
                    code="CART_EMPTY"
                )

            # Check stock availability for all items
            for item in cart.items.all():
                if item.quantity > item.product.stock_quantity:
                    return api_error(
                        f"Insufficient stock for {item.product.name}",
                        status_code=400,
                        code="INSUFFICIENT_STOCK",
                        details={
                            'product': item.product.name,
                            'available': item.product.stock_quantity,
                            'requested': item.quantity
                        }
                    )

            # Create order
            shipping_address = serializer.validated_data['shipping_address']
            payment_method = serializer.validated_data['payment_method']

            order = Order.objects.create(
                user=request.user,
                shipping_full_name=shipping_address['full_name'],
                shipping_address_line1=shipping_address['address_line1'],
                shipping_address_line2=shipping_address.get(
                    'address_line2', ''),
                shipping_city=shipping_address['city'],
                shipping_state=shipping_address['state'],
                shipping_zipcode=shipping_address['zipcode'],
                shipping_country=shipping_address['country'],
                shipping_phone=shipping_address['phone'],
                payment_method=payment_method,
                subtotal=cart.subtotal,
                tax=cart.tax,
                shipping_cost=cart.shipping,
                total=cart.total
            )

            # Create order items and reduce stock
            for item in cart.items.all():
                # Get product image URL
                first_image = item.product.images.first()
                image_url = ''
                if first_image:
                    image_url = request.build_absolute_uri(
                        first_image.image.url)

                # Get price (use discount price if available)
                price = item.product.discount_price if item.product.discount_price else item.product.price

                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    product_image=image_url,
                    quantity=item.quantity,
                    price=price
                )

                # Reduce stock
                item.product.reduce_stock(item.quantity)

            # Clear cart
            cart.items.all().delete()

            return api_ok(
                "Order created successfully",
                data={
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                    'total': float(order.total),
                    'status': order.status
                },
                status_code=status.HTTP_201_CREATED
            )

        except Exception as e:
            return api_error(
                "Failed to create order",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class OrderDetailView(AuthMixin, APIView):
    """
    GET: Get single order details
    """

    def get(self, request, order_id):
        """Get order details"""
        try:
            order = Order.objects.prefetch_related('items').get(
                id=order_id,
                user=request.user
            )

            serializer = OrderDetailSerializer(order)

            return api_ok(
                "Order retrieved successfully",
                data=serializer.data
            )

        except Order.DoesNotExist:
            return api_error(
                "Order not found",
                status_code=404,
                code="ORDER_NOT_FOUND",
                details={'order_id': order_id}
            )
        except Exception as e:
            return api_error(
                "Failed to retrieve order",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


# ==================== Review Views ====================

class ProductReviewListView(APIView):
    """
    GET: Get product reviews
    POST: Add product review (auth required)
    """

    def get(self, request, product_id):
        """Get product reviews"""
        try:
            # Check if product exists
            product = Product.objects.get(id=product_id)

            reviews = Review.objects.select_related('user', 'user__profile').filter(
                product=product
            )

            # Filter by rating
            rating_filter = request.GET.get('rating')
            if rating_filter:
                try:
                    reviews = reviews.filter(rating=int(rating_filter))
                except:
                    pass

            # Pagination
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 10))

            total_count = reviews.count()
            total_pages = (total_count + limit - 1) // limit

            start = (page - 1) * limit
            end = start + limit

            reviews_page = reviews[start:end]

            serializer = ReviewSerializer(
                reviews_page, many=True, context={'request': request})

            # Calculate rating distribution
            rating_distribution = {}
            for i in range(1, 6):
                rating_distribution[str(i)] = reviews.filter(rating=i).count()

            # Calculate average rating
            avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0

            return api_ok(
                "Reviews retrieved successfully",
                data={
                    'reviews': serializer.data,
                    'meta': {
                        'total_count': total_count,
                        'average_rating': round(avg_rating, 1),
                        'rating_distribution': rating_distribution,
                        'current_page': page,
                        'total_pages': total_pages,
                        'has_next': page < total_pages,
                        'has_previous': page > 1
                    }
                }
            )

        except Product.DoesNotExist:
            return api_error(
                "Product not found",
                status_code=404,
                code="PRODUCT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to retrieve reviews",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def post(self, request, product_id):
        """Add product review"""
        # Require authentication
        if not request.user.is_authenticated:
            return api_error(
                "Authentication required",
                status_code=401,
                code="UNAUTHORIZED"
            )

        try:
            product = Product.objects.get(id=product_id)

            serializer = CreateReviewSerializer(
                data=request.data,
                context={'user': request.user, 'product': product}
            )

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            # Create review
            review = Review.objects.create(
                product=product,
                user=request.user,
                rating=serializer.validated_data['rating'],
                title=serializer.validated_data['title'],
                comment=serializer.validated_data['comment']
            )

            return api_ok(
                "Review added successfully",
                data={
                    'review_id': str(review.id),
                    'product_id': str(product.id),
                    'rating': review.rating,
                    'created_at': review.created_at.isoformat()
                },
                status_code=status.HTTP_201_CREATED
            )

        except Product.DoesNotExist:
            return api_error(
                "Product not found",
                status_code=404,
                code="PRODUCT_NOT_FOUND"
            )
        except Exception as e:
            error_message = str(e)

            if "already reviewed" in error_message.lower():
                return api_error(
                    "You have already reviewed this product",
                    status_code=409,
                    code="ALREADY_REVIEWED"
                )
            elif "must purchase" in error_message.lower():
                return api_error(
                    "You must purchase this product before reviewing it",
                    status_code=403,
                    code="PURCHASE_REQUIRED"
                )

            return api_error(
                "Failed to add review",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': error_message}
            )


class ReviewDetailView(AuthMixin, APIView):
    """
    PATCH: Update review
    DELETE: Delete review
    """

    def patch(self, request, review_id):
        """Update review"""
        try:
            review = Review.objects.get(id=review_id, user=request.user)

            serializer = UpdateReviewSerializer(data=request.data)

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            # Update fields
            if 'rating' in serializer.validated_data:
                review.rating = serializer.validated_data['rating']
            if 'title' in serializer.validated_data:
                review.title = serializer.validated_data['title']
            if 'comment' in serializer.validated_data:
                review.comment = serializer.validated_data['comment']

            review.save()

            return api_ok(
                "Review updated successfully",
                data={
                    'review_id': str(review.id),
                    'updated_at': review.updated_at.isoformat()
                }
            )

        except Review.DoesNotExist:
            return api_error(
                "Review not found",
                status_code=404,
                code="REVIEW_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to update review",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def delete(self, request, review_id):
        """Delete review"""
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()

            return api_ok(
                "Review deleted successfully",
                data={'deleted_review_id': str(review_id)}
            )

        except Review.DoesNotExist:
            return api_error(
                "Review not found",
                status_code=404,
                code="REVIEW_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to delete review",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


# ==================== Admin Views ====================

class AdminProductListView(AuthMixin, APIView):
    """
    GET: Get all products (admin only)
    POST: Create new product (admin only)
    """
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        """Get all products for admin"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            products = Product.objects.select_related(
                'category').prefetch_related('images')

            # Filter by category
            category = request.GET.get('category')
            if category:
                products = products.filter(category__slug=category)

            # Filter by stock status
            in_stock = request.GET.get('in_stock')
            if in_stock:
                products = products.filter(in_stock=in_stock.lower() == 'true')

            # Pagination
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 20))

            total_count = products.count()
            total_pages = (total_count + limit - 1) // limit

            start = (page - 1) * limit
            end = start + limit

            products_page = products[start:end]

            serializer = ProductAdminSerializer(
                products_page, many=True, context={'request': request})

            return api_ok(
                "Products retrieved successfully",
                data={
                    'products': serializer.data,
                    'meta': {
                        'total_count': total_count,
                        'current_page': page,
                        'total_pages': total_pages,
                        'has_next': page < total_pages,
                        'has_previous': page > 1
                    }
                }
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve products",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def post(self, request):
        """Create new product (admin only)"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            # Validate required fields
            name = request.data.get('name')
            description = request.data.get('description')
            price = request.data.get('price')
            category_slug = request.data.get('category')

            if not all([name, description, price, category_slug]):
                missing_fields = []
                if not name:
                    missing_fields.append('name')
                if not description:
                    missing_fields.append('description')
                if not price:
                    missing_fields.append('price')
                if not category_slug:
                    missing_fields.append('category')

                return api_error(
                    "Missing required fields",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'missing_fields': missing_fields}
                )

            # Get category
            try:
                category = Category.objects.get(slug=category_slug)
            except Category.DoesNotExist:
                return api_error(
                    "Category not found",
                    status_code=404,
                    code="CATEGORY_NOT_FOUND",
                    details={'category': category_slug}
                )

            # Process optional fields
            discount_price = request.data.get('discount_price')
            tags = request.data.get('tags', '[]')
            features = request.data.get('features', '[]')
            benefits = request.data.get('benefits', '[]')

            # Parse JSON fields
            import json
            try:
                if isinstance(tags, str):
                    tags = json.loads(tags)
                if isinstance(features, str):
                    features = json.loads(features)
                if isinstance(benefits, str):
                    benefits = json.loads(benefits)
            except json.JSONDecodeError:
                return api_error(
                    "Invalid JSON format for tags, features, or benefits",
                    status_code=400,
                    code="INVALID_REQUEST"
                )

            # Create product
            product = Product.objects.create(
                name=name,
                description=description,
                price=Decimal(price),
                discount_price=Decimal(
                    discount_price) if discount_price else None,
                category=category,
                tags=tags,
                features=features,
                benefits=benefits,
                is_new=request.data.get('is_new', 'false').lower() == 'true',
                is_bestseller=request.data.get(
                    'is_bestseller', 'false').lower() == 'true',
                in_stock=request.data.get(
                    'in_stock', 'true').lower() == 'true',
                stock_quantity=int(request.data.get('stock_quantity', 0))
            )

            # Handle images
            images = request.FILES.getlist('images', [])

            if len(images) > 5:
                product.delete()
                return api_error(
                    "Too many images",
                    status_code=400,
                    code="TOO_MANY_FILES",
                    details={'max_files': 5, 'provided': len(images)}
                )

            for image in images:
                # Check file size (5MB)
                if image.size > 5 * 1024 * 1024:
                    product.delete()
                    return api_error(
                        f"Image file too large: {image.name}",
                        status_code=400,
                        code="FILE_TOO_LARGE",
                        details={'max_size': '5MB', 'file': image.name}
                    )

                # Check file type
                ext = image.name.split('.')[-1].lower()
                if ext not in ['jpg', 'jpeg', 'png', 'webp']:
                    product.delete()
                    return api_error(
                        f"Invalid file type: {ext}",
                        status_code=400,
                        code="INVALID_FILE_TYPE",
                        details={'allowed': ['jpg', 'jpeg',
                                             'png', 'webp'], 'provided': ext}
                    )

                ProductImage.objects.create(product=product, image=image)

            return api_ok(
                "Product created successfully",
                data={
                    'product_id': str(product.id),
                    'created_at': product.created_at.isoformat()
                },
                status_code=status.HTTP_201_CREATED
            )

        except Exception as e:
            return api_error(
                "Failed to create product",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminProductDetailView(AuthMixin, APIView):
    """
    PATCH: Update product (admin only)
    DELETE: Delete product (admin only)
    """
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, product_id):
        """Update product"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            product = Product.objects.get(id=product_id)

            # Update fields if provided
            if 'name' in request.data:
                product.name = request.data['name']
            if 'description' in request.data:
                product.description = request.data['description']
            if 'price' in request.data:
                product.price = Decimal(request.data['price'])
            if 'discount_price' in request.data:
                discount_price = request.data['discount_price']
                product.discount_price = Decimal(
                    discount_price) if discount_price else None

            if 'category' in request.data:
                try:
                    category = Category.objects.get(
                        slug=request.data['category'])
                    product.category = category
                except Category.DoesNotExist:
                    return api_error(
                        "Category not found",
                        status_code=404,
                        code="CATEGORY_NOT_FOUND"
                    )

            # Update JSON fields
            import json
            if 'tags' in request.data:
                tags = request.data['tags']
                if isinstance(tags, str):
                    product.tags = json.loads(tags)
                else:
                    product.tags = tags

            if 'features' in request.data:
                features = request.data['features']
                if isinstance(features, str):
                    product.features = json.loads(features)
                else:
                    product.features = features

            if 'benefits' in request.data:
                benefits = request.data['benefits']
                if isinstance(benefits, str):
                    product.benefits = json.loads(benefits)
                else:
                    product.benefits = benefits

            # Update boolean fields
            if 'is_new' in request.data:
                product.is_new = request.data['is_new'].lower() == 'true'
            if 'is_bestseller' in request.data:
                product.is_bestseller = request.data['is_bestseller'].lower(
                ) == 'true'
            if 'in_stock' in request.data:
                product.in_stock = request.data['in_stock'].lower() == 'true'
            if 'stock_quantity' in request.data:
                product.stock_quantity = int(request.data['stock_quantity'])

            product.save()

            # Handle new images
            images = request.FILES.getlist('images', [])
            if images:
                for image in images:
                    # Validate
                    if image.size > 5 * 1024 * 1024:
                        return api_error(
                            f"Image file too large: {image.name}",
                            status_code=400,
                            code="FILE_TOO_LARGE"
                        )

                    ProductImage.objects.create(product=product, image=image)

            return api_ok(
                "Product updated successfully",
                data={
                    'product_id': str(product.id),
                    'updated_at': product.updated_at.isoformat()
                }
            )

        except Product.DoesNotExist:
            return api_error(
                "Product not found",
                status_code=404,
                code="PRODUCT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to update product",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def delete(self, request, product_id):
        """Delete product"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            product = Product.objects.get(id=product_id)
            product.delete()

            return api_ok(
                "Product deleted successfully",
                data={'deleted_product_id': str(product_id)}
            )

        except Product.DoesNotExist:
            return api_error(
                "Product not found",
                status_code=404,
                code="PRODUCT_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to delete product",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminOrderListView(AuthMixin, APIView):
    """
    GET: Get all orders (admin only)
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get all orders for admin"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            orders = Order.objects.select_related(
                'user').prefetch_related('items')

            # Filter by status
            status_filter = request.GET.get('status')
            if status_filter:
                orders = orders.filter(status=status_filter)

            # Filter by user
            user_id = request.GET.get('user_id')
            if user_id:
                orders = orders.filter(user_id=user_id)

            # Filter by date range
            start_date = request.GET.get('start_date')
            if start_date:
                orders = orders.filter(created_at__date__gte=start_date)

            end_date = request.GET.get('end_date')
            if end_date:
                orders = orders.filter(created_at__date__lte=end_date)

            # Pagination
            page = int(request.GET.get('page', 1))
            limit = int(request.GET.get('limit', 20))

            total_count = orders.count()
            total_pages = (total_count + limit - 1) // limit

            # Calculate total revenue
            total_revenue = orders.aggregate(Sum('total'))['total__sum'] or 0

            start = (page - 1) * limit
            end = start + limit

            orders_page = orders[start:end]

            serializer = OrderAdminSerializer(orders_page, many=True)

            return api_ok(
                "Orders retrieved successfully",
                data={
                    'orders': serializer.data,
                    'meta': {
                        'total_count': total_count,
                        'total_revenue': float(total_revenue),
                        'current_page': page,
                        'total_pages': total_pages,
                        'has_next': page < total_pages,
                        'has_previous': page > 1
                    }
                }
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve orders",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminOrderDetailView(AuthMixin, APIView):
    """
    PATCH: Update order status (admin only)
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, order_id):
        """Update order status"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            order = Order.objects.get(id=order_id)

            serializer = UpdateOrderStatusSerializer(
                data=request.data,
                context={'order': order}
            )

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            # Update status
            new_status = serializer.validated_data['status']
            order.status = new_status

            # Update tracking number if provided
            if 'tracking_number' in serializer.validated_data:
                order.tracking_number = serializer.validated_data['tracking_number']

            # Set delivered_at timestamp if status is delivered
            if new_status == 'delivered' and not order.delivered_at:
                order.delivered_at = timezone.now()

            order.save()

            return api_ok(
                "Order status updated successfully",
                data={
                    'order_id': str(order.id),
                    'status': order.status,
                    'tracking_number': order.tracking_number,
                    'updated_at': order.updated_at.isoformat()
                }
            )

        except Order.DoesNotExist:
            return api_error(
                "Order not found",
                status_code=404,
                code="ORDER_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Failed to update order status",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminStatisticsView(AuthMixin, APIView):
    """
    GET: Get store statistics (admin only)
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get store statistics"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            from datetime import datetime, timedelta

            # Get date range
            period = request.GET.get('period', 'month')
            end_date = timezone.now()

            if period == 'today':
                start_date = end_date.replace(
                    hour=0, minute=0, second=0, microsecond=0)
            elif period == 'week':
                start_date = end_date - timedelta(days=7)
            elif period == 'month':
                start_date = end_date - timedelta(days=30)
            elif period == 'year':
                start_date = end_date - timedelta(days=365)
            else:
                # Custom date range
                start_date_str = request.GET.get('start_date')
                end_date_str = request.GET.get('end_date')

                if start_date_str:
                    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                else:
                    start_date = end_date - timedelta(days=30)

            # Filter orders by date range
            orders = Order.objects.filter(
                created_at__gte=start_date,
                created_at__lte=end_date
            )

            # Calculate overview statistics
            total_revenue = orders.aggregate(Sum('total'))['total__sum'] or 0
            total_orders = orders.count()
            total_products = Product.objects.count()
            total_customers = User.objects.filter(
                orders__isnull=False).distinct().count()
            average_order_value = total_revenue / total_orders if total_orders > 0 else 0

            # Get top selling products
            top_selling = OrderItem.objects.filter(
                order__created_at__gte=start_date,
                order__created_at__lte=end_date
            ).values(
                'product_id', 'product_name', 'product__category__name'
            ).annotate(
                total_sold=Sum('quantity'),
                revenue=Sum(F('price') * F('quantity'))
            ).order_by('-total_sold')[:5]

            # Format top selling products
            top_selling_products = [
                {
                    'product_id': str(item['product_id']),
                    'name': item['product_name'],
                    'category': item['product__category__name'],
                    'total_sold': item['total_sold'],
                    'revenue': float(item['revenue'])
                }
                for item in top_selling
            ]

            # Get recent orders
            recent_orders = Order.objects.select_related(
                'user').order_by('-created_at')[:10]
            recent_orders_data = [
                {
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                    'customer_name': order.user.username,
                    'total': float(order.total),
                    'status': order.status,
                    'created_at': order.created_at.isoformat()
                }
                for order in recent_orders
            ]

            # Generate revenue chart data
            revenue_chart = []
            current_date = start_date
            while current_date <= end_date:
                daily_orders = orders.filter(
                    created_at__date=current_date.date()
                )
                daily_revenue = daily_orders.aggregate(
                    Sum('total'))['total__sum'] or 0
                daily_count = daily_orders.count()

                revenue_chart.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'revenue': float(daily_revenue),
                    'orders': daily_count
                })

                current_date += timedelta(days=1)

            return api_ok(
                "Statistics retrieved successfully",
                data={
                    'overview': {
                        'total_revenue': float(total_revenue),
                        'total_orders': total_orders,
                        'total_products': total_products,
                        'total_customers': total_customers,
                        'average_order_value': float(average_order_value)
                    },
                    'top_selling_products': top_selling_products,
                    'recent_orders': recent_orders_data,
                    'revenue_chart': revenue_chart
                }
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve statistics",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


# ==================== Admin Authentication Views ====================

class AdminLoginView(APIView):
    """
    POST: Admin login
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Admin login"""
        try:
            serializer = AdminLoginSerializer(data=request.data)

            if not serializer.is_valid():
                return api_error(
                    "Invalid request data",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details=serializer.errors
                )

            user = serializer.validated_data['user']

            # Generate tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)

            # Get user profile data
            profile_serializer = AdminProfileSerializer(
                user, context={'request': request})

            return api_ok(
                "Admin login successful",
                data={
                    'user': profile_serializer.data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'expires_in': 3600  # 1 hour in seconds
                    }
                }
            )

        except Exception as e:
            return api_error(
                "Login failed",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminProfileView(AuthMixin, APIView):
    """
    GET: Get admin profile
    PATCH: Update admin profile
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get admin profile"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            serializer = AdminProfileSerializer(
                request.user, context={'request': request})

            return api_ok(
                "Profile retrieved successfully",
                data=serializer.data
            )

        except Exception as e:
            return api_error(
                "Failed to retrieve profile",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )

    def patch(self, request):
        """Update admin profile"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(
                user=request.user)

            # Update allowed fields
            if 'name' in request.data:
                profile.name = request.data['name']

            if 'dob' in request.data:
                profile.dob = request.data['dob']

            if 'address' in request.data:
                profile.address = request.data['address']

            if 'profile_pic' in request.FILES:
                profile.profile_pic = request.FILES['profile_pic']

            profile.save()

            # Return updated profile
            serializer = AdminProfileSerializer(
                request.user, context={'request': request})

            return api_ok(
                "Profile updated successfully",
                data=serializer.data
            )

        except Exception as e:
            return api_error(
                "Failed to update profile",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminLogoutView(AuthMixin, APIView):
    """
    POST: Admin logout (blacklist refresh token)
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Admin logout"""
        try:
            # Check if user is admin
            if not request.user.is_staff:
                return api_error(
                    "Admin access required",
                    status_code=403,
                    code="FORBIDDEN"
                )

            # Get refresh token from request
            refresh_token = request.data.get('refresh_token')

            if not refresh_token:
                return api_error(
                    "Refresh token is required",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'field': 'refresh_token'}
                )

            try:
                # Blacklist the refresh token
                from rest_framework_simplejwt.tokens import RefreshToken
                token = RefreshToken(refresh_token)
                token.blacklist()

                return api_ok(
                    "Logout successful",
                    data={'message': 'Admin logged out successfully'}
                )

            except Exception as token_error:
                return api_error(
                    "Invalid or expired token",
                    status_code=400,
                    code="INVALID_TOKEN",
                    details={'message': str(token_error)}
                )

        except Exception as e:
            return api_error(
                "Logout failed",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )


class AdminTokenRefreshView(APIView):
    """
    POST: Refresh admin access token
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Refresh access token"""
        try:
            refresh_token = request.data.get('refresh_token')

            if not refresh_token:
                return api_error(
                    "Refresh token is required",
                    status_code=400,
                    code="INVALID_REQUEST",
                    details={'field': 'refresh_token'}
                )

            try:
                from rest_framework_simplejwt.tokens import RefreshToken
                token = RefreshToken(refresh_token)

                # Get user from token
                user_id = token.payload.get('user_id')
                user = User.objects.get(id=user_id)

                # Verify user is still admin
                if not user.is_staff:
                    return api_error(
                        "Admin access required",
                        status_code=403,
                        code="FORBIDDEN"
                    )

                # Generate new access token
                new_access = str(token.access_token)

                return api_ok(
                    "Token refreshed successfully",
                    data={
                        'access': new_access,
                        'expires_in': 3600  # 1 hour
                    }
                )

            except Exception as token_error:
                return api_error(
                    "Invalid or expired refresh token",
                    status_code=401,
                    code="INVALID_TOKEN",
                    details={'message': str(token_error)}
                )

        except User.DoesNotExist:
            return api_error(
                "User not found",
                status_code=404,
                code="USER_NOT_FOUND"
            )
        except Exception as e:
            return api_error(
                "Token refresh failed",
                status_code=500,
                code="SERVER_ERROR",
                details={'message': str(e)}
            )
