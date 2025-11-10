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
from .models import User, UserProfile, ChatHistory, ChatSession, ChatMessage, Comment, CommentLike, Post, PostReaction, PostReport, PostImage, SavedPost
from .serializers import UserProfileSerializer, ChatSessionSerializers, ChatMessageSerializer, PostListSerializer, PostImageSerializer, PostCreateUpdateSerializer, PostDetailSerializer, PostReactionSerializer, PostReportSerializer


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
            title = request.data.get('title')
            content = request.data.get('content')
            category = request.data.get('category')

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
