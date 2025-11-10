from .models import Post, PostImage, PostReaction, SavedPost, Comment, CommentLike, PostReport
from rest_framework import serializers
from .models import User, UserProfile, ChatHistory, ChatMessage, ChatSession, Post, PostImage, SavedPost, Comment, CommentLike, PostReaction, PostReport
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
        # Note: timestamps not timestamp
        fields = ["id", "role", "content", "timestamps"]


class ChatSessionSerializers(serializers.ModelSerializer):
    message_count = serializers.IntegerField(read_only=True)
    last_message = serializers.CharField(read_only=True)
    last_message_role = serializers.CharField(read_only=True)

    class Meta:
        model = ChatSession
        fields = [
            "id",
            "title",
            "create_at",
            "updated_at",
            "message_count",
            "last_message",
            "last_message_role",
        ]


class UserMiniamlSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            profile = instance.profile
            data['name'] = f"{profile.first_name} {profile.last_name}".strip(
            ) or instance.username
            data['avatar'] = profile.profile_picture.url if profile.profile_picture else None
        except:
            data['name'] = instance.username
            data['avatar'] = None

        data.pop('username', None)
        return data


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


class PostImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostImage
        fields = ['id', 'image', 'uploaded_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Return full URL for image
        request = self.context.get('request')
        if request and instance.image:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data


class CommentLikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'created_at']


class CommentSerializer(serializers.ModelSerializer):

    author = UserMinimalSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
    user_interaction = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'author',
                  'stats', 'user_interaction', 'replies']
        read_only_fields = ['created_at']

    def get_replies(self, obj):
        if obj.parent is None:
            replies = obj.replies.filter(is_deleted=False)
            return CommentSerializer(replies, many=True, context=self.context).data
        return []

    def get_stats(self, obj):
        return {
            'likes_count': obj.likes.count(),
            'replies_count': obj.replies.filter(is_deleted=False).count() if obj.parent is None else 0
        }

    def get_user_interaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            is_liked = obj.likes.filter(user=request.user).exists()
            return {'is_liked': is_liked}
        return {'is_liked': False}


class PostReactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostReaction
        fields = ['id', 'reaction_type', 'created_at']
        read_only_fields = ['created_at']


class PostListSerializer(serializers.ModelSerializer):

    author = UserMinimalSerializer(read_only=True)
    images = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()
    user_interaction = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'category', 'images',
            'created_at', 'updated_at', 'author', 'stats',
            'user_interaction', 'tags'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_images(self, obj):
        request = self.context.get('request')
        images = obj.images.all()
        return PostImageSerializer(images, many=True, context={'request': request}).data

    def get_stats(self, obj):
        reactions = obj.reactions.all()
        likes_count = reactions.filter(reaction_type='like').count()
        loves_count = reactions.filter(reaction_type='love').count()
        supports_count = reactions.filter(reaction_type='support').count()
        celebrates_count = reactions.filter(reaction_type='celebrate').count()

        return {
            'likes_count': likes_count,
            'loves_count': loves_count,
            'supports_count': supports_count,
            'celebrates_count': celebrates_count,
            'total_reactions': reactions.count(),
            'comments_count': obj.comments.filter(is_deleted=False, parent=None).count(),
            'views_count': obj.views_count
        }

    def get_user_interaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            is_saved = obj.saved_by.filter(user=request.user).exists()

            return {
                'is_liked': reaction.reaction_type == 'like' if reaction else False,
                'is_loved': reaction.reaction_type == 'love' if reaction else False,
                'is_supported': reaction.reaction_type == 'support' if reaction else False,
                'is_celebrated': reaction.reaction_type == 'celebrate' if reaction else False,
                'reaction_type': reaction.reaction_type if reaction else None,
                'is_saved': is_saved
            }
        return {
            'is_liked': False,
            'is_loved': False,
            'is_supported': False,
            'is_celebrated': False,
            'reaction_type': None,
            'is_saved': False
        }


class PostDetailSerializer(PostListSerializer):
    comments = serializers.SerializerMethodField()

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ['comments']

    def get_comments(self, obj):
        """Get top-level comments with replies"""
        comments = obj.comments.filter(is_deleted=False, parent=None)
        return CommentSerializer(comments, many=True, context=self.context).data


class PostCreateUpdateSerializer(serializers.ModelSerializer):

    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        allow_empty=True,
        max_length=5
    )
    remove_images = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True
    )
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Post
        fields = ['title', 'content', 'category',
                  'tags', 'images', 'remove_images']

    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError(
                "Cannot upload more than 5 images")

        for image in value:
            if image.size > 5 * 1024 * 1024:  # 5MB
                raise serializers.ValidationError(
                    f"Image {image.name} exceeds 5MB limit")

            # Validate file extension
            ext = image.name.split('.')[-1].lower()
            if ext not in ['jpg', 'jpeg', 'png', 'gif']:
                raise serializers.ValidationError(
                    f"Invalid file type: {ext}. Allowed: jpg, jpeg, png, gif")

        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        validated_data.pop('remove_images', None)

        post = Post.objects.create(**validated_data)

        # Create images
        for image in images_data:
            PostImage.objects.create(post=post, image=image)

        return post

    def update(self, instance, validated_data):
        """Update post with images"""
        images_data = validated_data.pop('images', [])
        remove_images = validated_data.pop('remove_images', [])

        # Update post fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Remove specified images
        if remove_images:
            PostImage.objects.filter(
                id__in=remove_images, post=instance).delete()

        # Add new images
        for image in images_data:
            PostImage.objects.create(post=instance, image=image)

        return instance


class PostReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostReport
        fields = ['id', 'reason', 'description', 'created_at']
        read_only_fields = ['created_at']

    def validate(self, data):
        """Validate report data"""
        if data.get('reason') == 'other' and not data.get('description'):
            raise serializers.ValidationError({
                'description': 'Description is required when reason is "other"'
            })
        return data
