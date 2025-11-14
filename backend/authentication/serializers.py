from rest_framework import serializers
from .models import User, UserProfile

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


class UserMinimalSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'role']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Get user profile for avatar if available
        try:
            profile = instance.profile
            data['name'] = f"{profile.first_name} {profile.last_name}".strip(
            ) or instance.username
            data['avatar'] = profile.profile_picture.url if profile.profile_picture else None
        except:
            data['name'] = instance.username
            data['avatar'] = None

        # Remove username from response, keep only id, name, avatar, role
        data.pop('username', None)
        return data
