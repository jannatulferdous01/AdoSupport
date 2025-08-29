from collections import defaultdict
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
from .models import User, UserProfile, ChatHistory, ChatSession, ChatMessage
from .serializers import UserProfileSerializer, ChatSessionSerializers, ChatMessageSerializer


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
                email=email, username=username, password=password, role=role)
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
            import google.generativeai as genai
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
                        "session_id": str(chat_session.id)
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
