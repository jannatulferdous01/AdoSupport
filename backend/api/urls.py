from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterUserView, LoginUserView, AdolescentView, ParentView, UserProfileView, ChangePasswordView, Chatbot, ChatSessionListView, ChatSessionDeleteView, ChatSessionMessageView

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserView.as_view(), name="user-registration"),
    path("login/", LoginUserView.as_view(), name="user-login"),
    path("adolescent/", AdolescentView.as_view(), name='adolescent'),
    path("parent/", ParentView.as_view(), name='parent'),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("chatbot/", Chatbot.as_view(), name="chatbot"),
    path("chat/sessions/", ChatSessionListView.as_view(), name="chat-session"),
    path("chat/sessions/<uuid:chat_id>/messages/", ChatSessionMessageView.as_view(), name="chat-message"),
    path("chat/sessions/<uuid:chat_id>/", ChatSessionDeleteView.as_view(), name="chat-delete"),
]
