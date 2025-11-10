from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterUserView, LoginUserView, AdolescentView, ParentView, UserProfileView, ChangePasswordView, Chatbot, ChatSessionListView, ChatSessionDeleteView, ChatSessionMessageView, PostDetailView, PostReactionView, PostListCreateView, CommentCreateView, CommentDeleteView, CommentLikeView, CommentReplyView, PostReportView, PostSaveView

urlpatterns = [
    # ========================== Authentication ==========================
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserView.as_view(), name="user-registration"),
    path("login/", LoginUserView.as_view(), name="user-login"),

    # ========================== User Profile ==========================
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),

    # ========================== RBA ==========================
    path("adolescent/", AdolescentView.as_view(), name='adolescent'),
    path("parent/", ParentView.as_view(), name='parent'),


    path("chatbot/", Chatbot.as_view(), name="chatbot"),
    path("chat/sessions/", ChatSessionListView.as_view(), name="chat-session"),
    path("chat/sessions/<int:chat_id>/messages/", ChatSessionMessageView.as_view(), name="chat-message"),
    path("chat/sessions/<int:chat_id>/", ChatSessionDeleteView.as_view(), name="chat-delete"),

    # ========================== Community ==========================
    path('community/posts/', PostListCreateView.as_view(), name='community-posts'),
    path('community/posts/<int:post_id>/', PostDetailView.as_view(), name='post-detail'),
    path('community/posts/<int:post_id>/reactions/', PostReactionView.as_view(), name='post-reactions'),
    path('community/posts/<int:post_id>/save/', PostSaveView.as_view(), name='post-save'),
    path('community/posts/<int:post_id>/report/', PostReportView.as_view(), name='post-report'),
    path('community/posts/<int:post_id>/comments/', CommentCreateView.as_view(), name='post-comments'),
    path('community/comments/<int:comment_id>/replies/', CommentReplyView.as_view(), name='comment-replies'),
    path('community/comments/<int:comment_id>/like/', CommentLikeView.as_view(), name='comment-like'),
    path('community/comments/<int:comment_id>/', CommentDeleteView.as_view(), name='comment-delete'),
]
