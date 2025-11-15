from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile, ChatHistory, ChatMessage, ChatSession, Post, PostImage, SavedPost, Comment, CommentLike, PostReaction, PostReport, Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Review


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
    """User profile serializer with Cloudinary URL"""
    profile_pic_url = serializers.SerializerMethodField()
    profile_pic_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['name', 'bio', 'dob', 'address', 'profile_pic',
                  'profile_pic_url', 'profile_pic_thumbnail',
                  'interests', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at',
                            'profile_pic_url', 'profile_pic_thumbnail']

    def get_profile_pic_url(self, obj):
        """Get full size Cloudinary URL"""
        if obj.profile_pic:
            return obj.profile_pic.url
        return None

    def get_profile_pic_thumbnail(self, obj):
        """Get thumbnail Cloudinary URL"""
        if obj.profile_pic:
            # Generate thumbnail on-the-fly
            return obj.profile_pic.build_url(width=150, height=150, crop='fill')
        return None


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
    """Post image serializer with Cloudinary URL"""
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ['id', 'image', 'image_url', 'thumbnail_url', 'created_at']
        read_only_fields = ['id', 'created_at', 'image_url', 'thumbnail_url']

    def get_image_url(self, obj):
        """Get full size image URL"""
        if obj.image:
            return obj.image.url
        return None

    def get_thumbnail_url(self, obj):
        """Get thumbnail URL"""
        if obj.image:
            return obj.image.build_url(width=300, height=300, crop='fill')
        return None


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

# ==================== Category Serializers ====================


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description',
            'image', 'products_count'
        ]


# ==================== Product Serializers ====================

class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer with Cloudinary URL"""
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'thumbnail_url', 'created_at']
        read_only_fields = ['id', 'created_at', 'image_url', 'thumbnail_url']

    def get_image_url(self, obj):
        """Get full size image URL"""
        if obj.image:
            return obj.image.url
        return None

    def get_thumbnail_url(self, obj):
        """Get thumbnail URL"""
        if obj.image:
            return obj.image.build_url(width=400, height=400, crop='pad', background='white')
        return None


class ProductListSerializer(serializers.ModelSerializer):
    """Product list serializer (for list view)"""
    category = serializers.CharField(source='category.slug')
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'rating', 'review_count', 'category', 'tags', 'images',
            'is_new', 'is_bestseller', 'in_stock', 'features', 'benefits'
        ]

    def get_images(self, obj):
        """Get product images"""
        request = self.context.get('request')
        images = obj.images.all()
        return ProductImageSerializer(images, many=True, context={'request': request}).data


class ProductDetailSerializer(serializers.ModelSerializer):
    """Product detail serializer (for single product view)"""
    category = serializers.CharField(source='category.slug')
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'rating', 'review_count', 'category', 'tags', 'images',
            'is_new', 'is_bestseller', 'in_stock', 'features', 'benefits'
        ]

    def get_images(self, obj):
        """Get product images"""
        request = self.context.get('request')
        images = obj.images.all()
        return ProductImageSerializer(images, many=True, context={'request': request}).data


class ProductAdminSerializer(serializers.ModelSerializer):
    """Product serializer for admin (includes stock info)"""
    category = serializers.CharField(source='category.slug')
    rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    total_sold = serializers.IntegerField(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_price',
            'rating', 'review_count', 'category', 'tags', 'images',
            'is_new', 'is_bestseller', 'in_stock', 'stock_quantity',
            'total_sold', 'features', 'benefits', 'created_at', 'updated_at'
        ]

    def get_images(self, obj):
        """Get product images"""
        request = self.context.get('request')
        images = obj.images.all()
        return ProductImageSerializer(images, many=True, context={'request': request}).data


# ==================== Cart Serializers ====================

class CartProductSerializer(serializers.ModelSerializer):
    """Simplified product serializer for cart items"""
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'discount_price', 'image', 'in_stock']

    def get_image(self, obj):
        """Get first product image"""
        request = self.context.get('request')
        first_image = obj.images.first()
        if first_image:
            return ProductImageSerializer(first_image, context={'request': request}).data.get('image')
        return None


class CartItemSerializer(serializers.ModelSerializer):
    """Cart item serializer"""
    product = CartProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    """Cart serializer"""
    items = CartItemSerializer(many=True, read_only=True)
    user_id = serializers.CharField(source='user.id', read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    tax = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    shipping = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    items_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user_id', 'items', 'subtotal',
                  'tax', 'shipping', 'total', 'items_count']


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)

    def validate_product_id(self, value):
        """Validate product exists and is in stock"""
        try:
            product = Product.objects.get(id=value)
            if not product.in_stock:
                raise serializers.ValidationError("Product is out of stock")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")

    def validate(self, data):
        """Validate quantity against stock"""
        product = Product.objects.get(id=data['product_id'])
        if data['quantity'] > product.stock_quantity:
            raise serializers.ValidationError({
                'quantity': f"Only {product.stock_quantity} items available in stock"
            })
        return data


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity"""
    quantity = serializers.IntegerField(min_value=1)

    def validate_quantity(self, value):
        """Validate quantity against stock"""
        cart_item = self.instance
        if cart_item and value > cart_item.product.stock_quantity:
            raise serializers.ValidationError(
                f"Only {cart_item.product.stock_quantity} items available in stock"
            )
        return value


# ==================== Order Serializers ====================

class OrderItemSerializer(serializers.ModelSerializer):
    """Order item serializer"""
    product = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'subtotal']

    def get_product(self, obj):
        """Get product info"""
        return {
            'id': str(obj.product.id) if obj.product else None,
            'name': obj.product_name,
            'image': obj.product_image
        }


class OrderListSerializer(serializers.ModelSerializer):
    """Order list serializer (for list view)"""
    items_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'total',
            'items_count', 'created_at', 'delivered_at'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Order detail serializer (for single order view)"""
    items = OrderItemSerializer(many=True, read_only=True)
    items_count = serializers.IntegerField(read_only=True)
    shipping_address = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'items', 'subtotal', 'tax',
            'shipping_cost', 'total', 'shipping_address', 'payment_method',
            'tracking_number', 'created_at', 'updated_at', 'delivered_at'
        ]

    def get_shipping_address(self, obj):
        """Get formatted shipping address"""
        return {
            'full_name': obj.shipping_full_name,
            'address_line1': obj.shipping_address_line1,
            'address_line2': obj.shipping_address_line2,
            'city': obj.shipping_city,
            'state': obj.shipping_state,
            'zipcode': obj.shipping_zipcode,
            'country': obj.shipping_country,
            'phone': obj.shipping_phone
        }


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating orders"""
    shipping_address = serializers.DictField()
    payment_method = serializers.CharField()

    def validate_shipping_address(self, value):
        """Validate shipping address has all required fields"""
        required_fields = [
            'full_name', 'address_line1', 'city', 'state',
            'zipcode', 'country', 'phone'
        ]

        missing_fields = [
            field for field in required_fields if field not in value]

        if missing_fields:
            raise serializers.ValidationError(
                f"Missing required fields: {', '.join(missing_fields)}"
            )

        return value

    def validate_payment_method(self, value):
        """Validate payment method"""
        valid_methods = ['credit_card', 'debit_card',
                         'paypal', 'cash_on_delivery']
        if value not in valid_methods:
            raise serializers.ValidationError(
                f"Invalid payment method. Must be one of: {', '.join(valid_methods)}"
            )
        return value


class OrderAdminSerializer(serializers.ModelSerializer):
    """Order serializer for admin"""
    user = serializers.SerializerMethodField()
    items_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'total',
            'items_count', 'created_at'
        ]

    def get_user(self, obj):
        """Get user info"""
        return {
            'id': str(obj.user.id),
            'name': obj.user.username,
            'email': obj.user.email
        }


class UpdateOrderStatusSerializer(serializers.Serializer):
    """Serializer for updating order status"""
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    tracking_number = serializers.CharField(required=False, allow_blank=True)

    def validate_status(self, value):
        """Validate status transition"""
        order = self.context.get('order')
        if order:
            # Define allowed status transitions
            allowed_transitions = {
                'pending': ['processing', 'cancelled'],
                'processing': ['shipped', 'cancelled'],
                'shipped': ['delivered'],
                'delivered': [],
                'cancelled': []
            }

            if order.status in allowed_transitions:
                if value not in allowed_transitions[order.status]:
                    raise serializers.ValidationError(
                        f"Cannot change status from {order.status} to {value}"
                    )

        return value


# ==================== Review Serializers ====================

class ReviewSerializer(serializers.ModelSerializer):
    """Review serializer"""
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'title', 'comment', 'created_at']

    def get_user(self, obj):
        """Get user info"""
        request = self.context.get('request')
        try:
            profile = obj.user.profile
            avatar_url = None

            if profile.profile_pic:
                avatar_url = profile.profile_pic.url

            return {
                'id': str(obj.user.id),
                'name': obj.user.username,
                'avatar': avatar_url
            }
        except:
            return {
                'id': str(obj.user.id),
                'name': obj.user.username,
                'avatar': None
            }


class CreateReviewSerializer(serializers.Serializer):
    """Serializer for creating reviews"""
    rating = serializers.IntegerField(min_value=1, max_value=5)
    title = serializers.CharField(max_length=255)
    comment = serializers.CharField()

    def validate(self, data):
        """Validate user hasn't already reviewed this product"""
        user = self.context.get('user')
        product = self.context.get('product')

        if Review.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError(
                "You have already reviewed this product")

        # Check if user has purchased this product
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product=product,
            order__status='delivered'
        ).exists()

        if not has_purchased:
            raise serializers.ValidationError(
                "You must purchase this product before reviewing it"
            )

        return data


class UpdateReviewSerializer(serializers.Serializer):
    """Serializer for updating reviews"""
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False)
    title = serializers.CharField(max_length=255, required=False)
    comment = serializers.CharField(required=False)


# ==================== Admin Serializers ====================

class AdminLoginSerializer(serializers.Serializer):
    """Admin login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Validate admin credentials"""
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError({
                'message': 'Email and password are required'
            })

        # Authenticate user
        from django.contrib.auth import authenticate
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError({
                'message': 'Invalid credentials'
            })

        # Check if user is admin/staff
        if not user.is_staff:
            raise serializers.ValidationError({
                'message': 'Access denied. Admin privileges required.'
            })

        data['user'] = user
        return data


class AdminProfileSerializer(serializers.ModelSerializer):
    """Admin profile serializer"""
    profile = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'is_staff',
                  'is_superuser', 'date_joined', 'profile', 'permissions']
        read_only_fields = ['id', 'email',
                            'date_joined', 'is_staff', 'is_superuser']

    def get_profile(self, obj):
        """Get user profile info"""
        try:
            profile = obj.profile
            return {
                'name': profile.name if hasattr(profile, 'name') else obj.username,
                'dob': profile.dob.isoformat() if hasattr(profile, 'dob') and profile.dob else None,
                'address': profile.address if hasattr(profile, 'address') else None,
                'profile_pic': self.context.get('request').build_absolute_uri(profile.profile_pic.url) if hasattr(profile, 'profile_pic') and profile.profile_pic else None
            }
        except:
            return {
                'name': obj.username,
                'dob': None,
                'address': None,
                'profile_pic': None
            }

    def get_permissions(self, obj):
        """Get user permissions"""
        return {
            'can_manage_users': obj.is_staff or obj.is_superuser,
            'can_manage_posts': obj.is_staff or obj.is_superuser,
            'can_manage_products': obj.is_staff or obj.is_superuser,
            'can_manage_orders': obj.is_staff or obj.is_superuser,
            'can_view_reports': obj.is_staff or obj.is_superuser,
            'is_superuser': obj.is_superuser
        }
