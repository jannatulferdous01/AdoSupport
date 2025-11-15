from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.db import models
from .utils import generate_ai_session_title
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
import os
from django.utils import timezone
import uuid
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary.models import CloudinaryField


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
        extra_fields.setdefault("role", "admin")

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
        ("admin", "Admin"),
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
    """User profile with Cloudinary storage"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')

    name = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    profile_pic = CloudinaryField(
        'image',
        folder='adosupport/profiles',
        blank=True,
        null=True,
        transformation={
            'width': 400,
            'height': 400,
            'crop': 'fill',
            'quality': 'auto',
            'gravity': 'face'
        }
    )

    interests = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.email}'s profile"

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
    # Remove UUID field - use default AutoField (integer)
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

    # Remove UUID field - use default AutoField (integer)
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


class Post(models.Model):
    CATEGORY_CHOICES = [
        ('questions', 'Questions'),
        ('experiences', 'Experiences'),
        ('resources', 'Resources'),
        ('general', 'General'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    tags = models.JSONField(default=list, blank=True)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='posts')
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['category']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return f"{self.title} by {self.author.username}"

    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])


def post_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{timezone.now().strftime('%Y%m%d_%H%M%S')}_{instance.post.id}_{filename}"
    return os.path.join('community/posts', str(instance.post.id), filename)


class PostImage(models.Model):
    """Post images with Cloudinary storage"""
    post = models.ForeignKey(
        'Post', on_delete=models.CASCADE, related_name='images')

    image = CloudinaryField(
        'image',
        folder='adosupport/posts',
        transformation={
            'width': 1200,
            'height': 900,
            'crop': 'limit',
            'quality': 'auto'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'post_images'
        verbose_name = 'Post Image'
        verbose_name_plural = 'Post Images'

    def __str__(self):
        return f"Image for {self.post.content[:30]}"


class PostReaction(models.Model):
    REACTION_CHOICES = [
        ('like', 'Like'),
        ('love', 'Love'),
        ('support', 'Support'),
        ('celebrate', 'Celebrate'),
    ]

    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='post_reactions')
    reaction_type = models.CharField(max_length=20, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')
        indexes = [
            models.Index(fields=['post', 'user']),
            models.Index(fields=['post', 'reaction_type']),
        ]

    def __str__(self):
        return f"{self.user.username} {self.reaction_type}d {self.post.title}"


class SavedPost(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='saved_by')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='saved_posts')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} saved {self.post.title}"


class Comment(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', null=True, blank=True,
                               on_delete=models.CASCADE, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', 'parent']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class CommentLike(models.Model):
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comment_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('comment', 'user')

    def __str__(self):
        return f"{self.user.username} liked comment by {self.comment.author.username}"


class PostReport(models.Model):
    REASON_CHOICES = [
        ('inappropriate_content', 'Inappropriate_content'),
        ('spam', 'Spam'),
        ('harassment', 'Harassment'),
        ('misinformation', 'Misinformation'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]

    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='reports')
    reporter = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='post_reports')
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name='resolved_reports')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['post']),
        ]

    def __str__(self):
        return f"Report on {self.post.title} by {self.reporter.username}"

# ====================================== Store ==========================================


class Category(models.Model):
    """Product category model"""

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    description = models.TextField()
    image = models.ImageField(
        upload_to='store/categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def products_count(self):
        """Get count of products in this category"""
        return self.products.filter(in_stock=True).count()


def product_image_upload_path(instance, filename):
    """Generate upload path for product images"""
    import os
    from django.utils import timezone

    ext = filename.split('.')[-1]
    filename = f"{timezone.now().strftime('%Y%m%d_%H%M%S')}_{instance.product.id}_{filename}"
    return os.path.join('store/products', str(instance.product.id), filename)


class Product(models.Model):
    """Product model"""

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products')
    tags = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)

    is_new = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.IntegerField(
        default=0, validators=[MinValueValidator(0)])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['category']),
            models.Index(fields=['is_bestseller']),
            models.Index(fields=['in_stock']),
        ]

    def __str__(self):
        return self.name

    @property
    def rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.all()
        if reviews.exists():
            return round(reviews.aggregate(models.Avg('rating'))['rating__avg'], 1)
        return 0.0

    @property
    def review_count(self):
        """Get count of reviews"""
        return self.reviews.count()

    @property
    def total_sold(self):
        """Get total quantity sold"""
        return OrderItem.objects.filter(product=self).aggregate(
            total=models.Sum('quantity')
        )['total'] or 0

    def reduce_stock(self, quantity):
        """Reduce stock quantity"""
        if self.stock_quantity >= quantity:
            self.stock_quantity -= quantity
            if self.stock_quantity == 0:
                self.in_stock = False
            self.save()
            return True
        return False

    def increase_stock(self, quantity):
        """Increase stock quantity"""
        self.stock_quantity += quantity
        if self.stock_quantity > 0:
            self.in_stock = True
        self.save()


class ProductImage(models.Model):
    """Product images with Cloudinary storage"""
    product = models.ForeignKey(
        'Product', on_delete=models.CASCADE, related_name='images')

    # CHANGE: Replace ImageField with CloudinaryField
    image = CloudinaryField(
        'image',
        folder='adosupport/products',
        transformation={
            'width': 800,
            'height': 800,
            'crop': 'pad',
            'quality': 'auto',
            'background': 'white'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_images'
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return f"Image for {self.product.name}"


class Cart(models.Model):
    """Shopping cart model"""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    @property
    def subtotal(self):
        """Calculate cart subtotal"""
        return sum(item.subtotal for item in self.items.all())

    @property
    def tax(self):
        """Calculate tax (10% of subtotal)"""
        return round(self.subtotal * Decimal('0.10'), 2)

    @property
    def shipping(self):
        """Calculate shipping cost"""
        if self.subtotal > 50:
            return Decimal('0.00')  # Free shipping over $50
        return Decimal('5.00')

    @property
    def total(self):
        """Calculate cart total"""
        return self.subtotal + self.tax + self.shipping

    @property
    def items_count(self):
        """Get total items count"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Cart item model"""

    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(
        default=1, validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

    @property
    def subtotal(self):
        """Calculate item subtotal"""
        price = self.product.discount_price if self.product.discount_price else self.product.price
        return price * self.quantity


class Order(models.Model):
    """Order model"""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')

    # Address
    shipping_full_name = models.CharField(max_length=255)
    shipping_address_line1 = models.CharField(max_length=255)
    shipping_address_line2 = models.CharField(max_length=255, blank=True)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_zipcode = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100)
    shipping_phone = models.CharField(max_length=20)

    # Payment
    payment_method = models.CharField(max_length=50)

    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    # Tracking
    tracking_number = models.CharField(max_length=100, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['order_number']),
        ]

    def __str__(self):
        return f"Order {self.order_number}"

    @property
    def items_count(self):
        """Get total items count"""
        return sum(item.quantity for item in self.items.all())

    def generate_order_number(self):
        """Generate unique order number"""
        from django.utils import timezone
        date_str = timezone.now().strftime('%Y%m%d')

        # Get last order number for today
        last_order = Order.objects.filter(
            order_number__startswith=f'ORD-{date_str}'
        ).order_by('-order_number').first()

        if last_order:
            last_num = int(last_order.order_number.split('-')[-1])
            new_num = last_num + 1
        else:
            new_num = 1

        return f'ORD-{date_str}-{new_num:06d}'

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Order item model"""

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    # Store name in case product is deleted
    product_name = models.CharField(max_length=255)
    product_image = models.CharField(
        max_length=500, blank=True)  # Store image URL
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    # Price at time of purchase
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"

    @property
    def subtotal(self):
        """Calculate item subtotal"""
        return self.price * self.quantity


class Review(models.Model):
    """Product review model"""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=255)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}/5)"
