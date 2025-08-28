from rest_framework import serializers
from .models import User, UserProfile, ChatHistory, ChatMessage, ChatSession
from django.contrib.auth import authenticate

# ------------------------------------ User and User Profile ------------------------------


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at"]

        def update(self, instance, validated_data):
            validated_data.pop('email', None)
            validated_data.pop('gender', None)
            return super().update(instance, validated_data)


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "role", "content", "timestamps"]  # Note: timestamps not timestamp


class ChatSessionSerializers(serializers.ModelSerializer):
    message_count = serializers.IntegerField(read_only=True)
    last_message = serializers.CharField(read_only=True)
    last_message_role = serializers.CharField(read_only=True)

    class Meta:
        model = ChatSession
        fields = [
            "id",
            "title",
            "create_at",  # Note: create_at not created_at
            "updated_at",
            "message_count",
            "last_message",
            "last_message_role",
        ]
