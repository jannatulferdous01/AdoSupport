from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import uuid
from django.conf import settings
from django.db import models
from .utils import generate_ai_session_title


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, role="adolescent", **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")
        if not password:
            raise ValueError("Password is required")

        email = self.normalize_email(email)
        extra_fields.setdefault("role", role)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("role", "adolescent")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        return self.create_user(email, username, password, **extra_fields)

# ------------------------------------------- USER MODEL ----------------------------------------------------


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICE = [
        ("adolescent", "Adolescent"),
        ("parent", "Parent"),
    ]

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICE, default="adolescent")
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

# ------------------------------------ USER PROFILE -----------------------------------


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile")
    name = models.CharField(max_length=50, null=False, blank=False)
    dob = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    profile_pic = models.ImageField(
        upload_to="profile_pic/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


@login_required
def get_username(request):
    return JsonResponse({"username": request.user.username})

# ----------------------------------- Chatbot ---------------------------------------


class ChatHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chat_history")
    query = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat by {self.user.username} at {self.timestamp}"


class ChatSession(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chat_session")
    title = models.CharField(max_length=255, default="New Chat")
    create_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "-updated_at"]),
        ]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.title} ({self.id})"


class ChatMessage(models.Model):
    ROLE_CHOICE = (("user", "user"), ("assistant", "assistant"))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    sessions = models.ForeignKey(
        ChatSession, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=10, choices=ROLE_CHOICE)
    content = models.TextField()
    timestamps = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["sessions", "timestamps"]),
        ]
        ordering = ["timestamps"]

    def __str__(self):
        return f"{self.role}: {str(self.content)[:30]}..."


@receiver(post_save, sender=ChatMessage)
def auto_title_chat_session(sender, instance, created, **kwargs):
    if not created:
        return

    session = instance.sessions
    if session.title == "New Chat":
        message_count = session.messages.count()
        if message_count >= 2:
            first_user_msg = (
                session.messages.filter(
                    role="user").order_by("timestamps").first()
            )
            if first_user_msg:
                # Use AI-powered title generation with GPT-3.5-turbo
                new_title = generate_ai_session_title(first_user_msg.content)
                session.title = new_title
                session.save(update_fields=["title"])
