from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Sum, Count, Avg
from .models import (
    User, UserProfile, ChatHistory, ChatSession, ChatMessage,
    Post, PostImage, PostReaction, SavedPost, Comment, CommentLike, PostReport,
    Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Review
)

# ================================ USER MANAGEMENT ================================


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "username", "role", "is_staff",
                    "is_superuser", "date_joined")
    search_fields = ("email", "username")
    list_filter = ("role", "is_superuser", "is_staff", "date_joined")
    ordering = ("-date_joined",)
    readonly_fields = ("date_joined", "last_login")

    fieldsets = (
        ('User Information', {
            'fields': ('email', 'username', 'role')
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('date_joined', 'last_login')
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related()


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user_email", "user_username",
                    "user_role", "name", "dob", "created_at")
    search_fields = ("name", "user__email", "user__username")
    list_filter = ("user__role", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "profile_picture_preview")

    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Profile Information', {
            'fields': ('name', 'dob', 'profile_pic', 'profile_picture_preview')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

    @admin.display(description="Email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Username")
    def user_username(self, obj):
        return obj.user.username

    @admin.display(description="Role")
    def user_role(self, obj):
        return obj.user.role

    @admin.display(description="Profile Picture")
    def profile_picture_preview(self, obj):
        if obj.profile_pic:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover; border-radius: 50%;" />', obj.profile_pic.url)
        return "No Image"


# ================================ CHAT MANAGEMENT ================================

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user_email", "query_preview",
                    "response_preview", "timestamp")
    search_fields = ("user__email", "query", "response")
    list_filter = ("timestamp",)
    ordering = ("-timestamp",)
    readonly_fields = ("timestamp",)

    @admin.display(description="User Email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Query")
    def query_preview(self, obj):
        return obj.query[:50] + "..." if len(obj.query) > 50 else obj.query

    @admin.display(description="Response")
    def response_preview(self, obj):
        return obj.response[:50] + "..." if len(obj.response) > 50 else obj.response


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user_link", "title",
                    "message_count", "create_at", "updated_at")
    search_fields = ("user__email", "title")
    list_filter = ("create_at", "updated_at")
    ordering = ("-updated_at",)
    readonly_fields = ("create_at", "updated_at")

    fieldsets = (
        ('Session Information', {
            'fields': ('user', 'title')
        }),
        ('Timestamps', {
            'fields': ('create_at', 'updated_at')
        }),
    )

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)

    @admin.display(description="Messages")
    def message_count(self, obj):
        return obj.messages.count()


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "session_link", "role",
                    "content_preview", "timestamps")
    search_fields = ("sessions__title", "content")
    list_filter = ("role", "timestamps")
    ordering = ("-timestamps",)
    readonly_fields = ("timestamps",)

    @admin.display(description="Session")
    def session_link(self, obj):
        url = reverse("admin:api_chatsession_change", args=[obj.sessions.id])
        return format_html('<a href="{}">{}</a>', url, obj.sessions.title)

    @admin.display(description="Content")
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content


# ================================ COMMUNITY - POSTS ================================

class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1
    readonly_fields = ("image_preview", "created_at")
    fields = ("image", "image_preview", "created_at")

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover;" />', obj.image.url)
        return "No Image"


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author_link", "category",
                    "stats_display", "created_at", "is_deleted")
    search_fields = ("title", "content", "author__email", "author__username")
    list_filter = ("category", "is_deleted", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at",
                       "views_count", "stats_detail")
    inlines = [PostImageInline]

    fieldsets = (
        ('Post Information', {
            'fields': ('title', 'content', 'category', 'tags', 'author')
        }),
        ('Statistics', {
            'fields': ('views_count', 'stats_detail')
        }),
        ('Status', {
            'fields': ('is_deleted',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    @admin.display(description="Author")
    def author_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.author.id])
        return format_html('<a href="{}">{}</a>', url, obj.author.email)

    @admin.display(description="Stats")
    def stats_display(self, obj):
        reactions = obj.reactions.count()
        comments = obj.comments.filter(is_deleted=False).count()
        return f"👁 {obj.views_count} | ❤ {reactions} | 💬 {comments}"

    @admin.display(description="Detailed Statistics")
    def stats_detail(self, obj):
        reactions = obj.reactions.all()
        likes = reactions.filter(reaction_type='like').count()
        loves = reactions.filter(reaction_type='love').count()
        supports = reactions.filter(reaction_type='support').count()
        celebrates = reactions.filter(reaction_type='celebrate').count()
        comments = obj.comments.filter(is_deleted=False).count()
        saved = obj.saved_by.count()
        reports = obj.reports.count()

        return format_html(
            '<strong>Views:</strong> {} | '
            '<strong>Reactions:</strong> 👍 {} | ❤️ {} | 🤝 {} | 🎉 {} | '
            '<strong>Comments:</strong> {} | '
            '<strong>Saved:</strong> {} | '
            '<strong>Reports:</strong> {}',
            obj.views_count, likes, loves, supports, celebrates, comments, saved, reports
        )


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ("id", "post_link", "image_preview", "created_at")
    search_fields = ("post__title",)
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "image_preview_large")

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:api_post_change", args=[obj.post.id])
        return format_html('<a href="{}">{}</a>', url, obj.post.title)

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return "No Image"

    @admin.display(description="Image")
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="300" style="max-width: 100%;" />', obj.image.url)
        return "No Image"


@admin.register(PostReaction)
class PostReactionAdmin(admin.ModelAdmin):
    list_display = ("id", "post_link", "user_link",
                    "reaction_type", "created_at")
    search_fields = ("post__title", "user__email")
    list_filter = ("reaction_type", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:api_post_change", args=[obj.post.id])
        return format_html('<a href="{}">{}</a>', url, obj.post.title[:50])

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)


@admin.register(SavedPost)
class SavedPostAdmin(admin.ModelAdmin):
    list_display = ("id", "post_link", "user_link", "saved_at")
    search_fields = ("post__title", "user__email")
    list_filter = ("saved_at",)
    ordering = ("-saved_at",)
    readonly_fields = ("saved_at",)

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:api_post_change", args=[obj.post.id])
        return format_html('<a href="{}">{}</a>', url, obj.post.title[:50])

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)


# ================================ COMMUNITY - COMMENTS ================================

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post_link", "author_link", "content_preview",
                    "is_reply", "likes_count", "created_at", "is_deleted")
    search_fields = ("content", "author__email", "post__title")
    list_filter = ("is_deleted", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "likes_count")

    fieldsets = (
        ('Comment Information', {
            'fields': ('post', 'author', 'parent', 'content')
        }),
        ('Statistics', {
            'fields': ('likes_count',)
        }),
        ('Status', {
            'fields': ('is_deleted',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:api_post_change", args=[obj.post.id])
        return format_html('<a href="{}">{}</a>', url, obj.post.title[:40])

    @admin.display(description="Author")
    def author_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.author.id])
        return format_html('<a href="{}">{}</a>', url, obj.author.email)

    @admin.display(description="Content")
    def content_preview(self, obj):
        return obj.content[:80] + "..." if len(obj.content) > 80 else obj.content

    @admin.display(description="Is Reply", boolean=True)
    def is_reply(self, obj):
        return obj.parent is not None

    @admin.display(description="Likes")
    def likes_count(self, obj):
        return obj.likes.count()


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ("id", "comment_preview", "user_link", "created_at")
    search_fields = ("comment__content", "user__email")
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    @admin.display(description="Comment")
    def comment_preview(self, obj):
        url = reverse("admin:api_comment_change", args=[obj.comment.id])
        content = obj.comment.content[:50] + "..." if len(
            obj.comment.content) > 50 else obj.comment.content
        return format_html('<a href="{}">{}</a>', url, content)

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)


# ================================ COMMUNITY - REPORTS ================================

@admin.register(PostReport)
class PostReportAdmin(admin.ModelAdmin):
    list_display = ("id", "post_link", "reporter_link",
                    "reason", "status", "created_at")
    search_fields = ("post__title", "reporter__email", "description")
    list_filter = ("reason", "status", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    fieldsets = (
        ('Report Information', {
            'fields': ('post', 'reporter', 'reason', 'description')
        }),
        ('Status', {
            'fields': ('status', 'resolved_by', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

    list_filter = ("reason", "status", "created_at")

    actions = ['mark_as_reviewed', 'mark_as_resolved', 'mark_as_dismissed']

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:api_post_change", args=[obj.post.id])
        return format_html('<a href="{}">{}</a>', url, obj.post.title[:50])

    @admin.display(description="Reporter")
    def reporter_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.reporter.id])
        return format_html('<a href="{}">{}</a>', url, obj.reporter.email)

    @admin.action(description='Mark selected reports as reviewed')
    def mark_as_reviewed(self, request, queryset):
        queryset.update(status='reviewed')
        self.message_user(
            request, f"{queryset.count()} reports marked as reviewed.")

    @admin.action(description='Mark selected reports as resolved')
    def mark_as_resolved(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='resolved',
                        resolved_at=timezone.now(), resolved_by=request.user)
        self.message_user(
            request, f"{queryset.count()} reports marked as resolved.")

    @admin.action(description='Mark selected reports as dismissed')
    def mark_as_dismissed(self, request, queryset):
        queryset.update(status='dismissed')
        self.message_user(request, f"{queryset.count()} reports dismissed.")


# ================================ STORE - PRODUCTS ================================

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ("image_preview", "created_at")
    fields = ("image", "image_preview", "created_at")

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover;" />', obj.image.url)
        return "No Image"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "products_count", "image_preview", "created_at")
    search_fields = ("name", "description")
    list_filter = ("created_at",)
    ordering = ("name",)
    readonly_fields = ("created_at", "products_count", "image_preview_large")
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = (
        ('Category Information', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Image', {
            'fields': ('image', 'image_preview_large')
        }),
        ('Statistics', {
            'fields': ('products_count', 'created_at')
        }),
    )

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 8px;" />', obj.image.url)
        return "No Image"

    @admin.display(description="Image")
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="300" style="max-width: 100%; border-radius: 8px;" />', obj.image.url)
        return "No Image"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category_link", "price_display", 
                    "stock_display", "rating_display", "badges_display", "created_at")
    search_fields = ("name", "description", "tags")
    list_filter = ("category", "is_new", "is_bestseller", "in_stock", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "rating", "review_count", "total_sold", "stats_detail")
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'discount_price')
        }),
        ('Details', {
            'fields': ('tags', 'features', 'benefits')
        }),
        ('Inventory', {
            'fields': ('stock_quantity', 'in_stock')
        }),
        ('Badges', {
            'fields': ('is_new', 'is_bestseller')
        }),
        ('Statistics', {
            'fields': ('rating', 'review_count', 'total_sold', 'stats_detail')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    @admin.display(description="Category")
    def category_link(self, obj):
        url = reverse("admin:api_category_change", args=[obj.category.id])
        return format_html('<a href="{}">{}</a>', url, obj.category.name)

    @admin.display(description="Price")
    def price_display(self, obj):
        if obj.discount_price:
            return format_html(
                '<span style="text-decoration: line-through; color: #999;">${}</span> '
                '<span style="color: #d63031; font-weight: bold;">${}</span>',
                obj.price, obj.discount_price
            )
        return f"${obj.price}"

    @admin.display(description="Stock")
    def stock_display(self, obj):
        if obj.in_stock:
            if obj.stock_quantity > 50:
                color = "#00b894"  # Green
                status = "In Stock"
            elif obj.stock_quantity > 10:
                color = "#fdcb6e"  # Yellow
                status = "Low Stock"
            else:
                color = "#ff7675"  # Red
                status = "Very Low"
            return format_html(
                '<span style="color: {}; font-weight: bold;">{} ({})</span>',
                color, status, obj.stock_quantity
            )
        return format_html('<span style="color: #d63031; font-weight: bold;">Out of Stock</span>')

    @admin.display(description="Rating")
    def rating_display(self, obj):
        rating = obj.rating
        stars = "⭐" * int(rating)
        return f"{stars} {rating}/5 ({obj.review_count} reviews)"

    @admin.display(description="Badges")
    def badges_display(self, obj):
        badges = []
        if obj.is_new:
            badges.append('<span style="background: #0984e3; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">NEW</span>')
        if obj.is_bestseller:
            badges.append('<span style="background: #fdcb6e; color: #2d3436; padding: 2px 8px; border-radius: 4px; font-size: 11px;">BESTSELLER</span>')
        return format_html(" ".join(badges)) if badges else "-"

    @admin.display(description="Detailed Statistics")
    def stats_detail(self, obj):
        return format_html(
            '<strong>Average Rating:</strong> {}/5 | '
            '<strong>Total Reviews:</strong> {} | '
            '<strong>Total Sold:</strong> {} | '
            '<strong>Current Stock:</strong> {}',
            obj.rating, obj.review_count, obj.total_sold, obj.stock_quantity
        )

    actions = ['mark_as_new', 'mark_as_bestseller', 'mark_out_of_stock', 'mark_in_stock']

    @admin.action(description='Mark as NEW')
    def mark_as_new(self, request, queryset):
        queryset.update(is_new=True)
        self.message_user(request, f"{queryset.count()} products marked as NEW.")

    @admin.action(description='Mark as BESTSELLER')
    def mark_as_bestseller(self, request, queryset):
        queryset.update(is_bestseller=True)
        self.message_user(request, f"{queryset.count()} products marked as BESTSELLER.")

    @admin.action(description='Mark as Out of Stock')
    def mark_out_of_stock(self, request, queryset):
        queryset.update(in_stock=False)
        self.message_user(request, f"{queryset.count()} products marked as out of stock.")

    @admin.action(description='Mark as In Stock')
    def mark_in_stock(self, request, queryset):
        queryset.update(in_stock=True)
        self.message_user(request, f"{queryset.count()} products marked as in stock.")


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "product_link", "image_preview", "created_at")
    search_fields = ("product__name",)
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "image_preview_large")

    @admin.display(description="Product")
    def product_link(self, obj):
        url = reverse("admin:api_product_change", args=[obj.product.id])
        return format_html('<a href="{}">{}</a>', url, obj.product.name)

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return "No Image"

    @admin.display(description="Image")
    def image_preview_large(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="300" style="max-width: 100%;" />', obj.image.url)
        return "No Image"


# ================================ STORE - CART ================================

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ("product_link", "subtotal", "added_at")
    fields = ("product_link", "quantity", "subtotal", "added_at")

    @admin.display(description="Product")
    def product_link(self, obj):
        url = reverse("admin:api_product_change", args=[obj.product.id])
        return format_html('<a href="{}">{}</a>', url, obj.product.name)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user_link", "items_count", "subtotal_display", 
                    "total_display", "created_at", "updated_at")
    search_fields = ("user__email", "user__username")
    list_filter = ("created_at", "updated_at")
    ordering = ("-updated_at",)
    readonly_fields = ("created_at", "updated_at", "items_count", 
                       "subtotal", "tax", "shipping", "total")
    inlines = [CartItemInline]

    fieldsets = (
        ('Cart Information', {
            'fields': ('user',)
        }),
        ('Pricing', {
            'fields': ('subtotal', 'tax', 'shipping', 'total', 'items_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)

    @admin.display(description="Subtotal")
    def subtotal_display(self, obj):
        return f"${obj.subtotal}"

    @admin.display(description="Total")
    def total_display(self, obj):
        return format_html('<strong>${}</strong>', obj.total)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart_user_link", "product_link", "quantity", "subtotal_display", "added_at")
    search_fields = ("cart__user__email", "product__name")
    list_filter = ("added_at",)
    ordering = ("-added_at",)
    readonly_fields = ("added_at", "subtotal")

    @admin.display(description="User")
    def cart_user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.cart.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.cart.user.email)

    @admin.display(description="Product")
    def product_link(self, obj):
        url = reverse("admin:api_product_change", args=[obj.product.id])
        return format_html('<a href="{}">{}</a>', url, obj.product.name)

    @admin.display(description="Subtotal")
    def subtotal_display(self, obj):
        return f"${obj.subtotal}"


# ================================ STORE - ORDERS ================================

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_link", "product_name", "product_image_preview", "quantity", "price", "subtotal")
    fields = ("product_link", "product_name", "product_image_preview", "quantity", "price", "subtotal")

    @admin.display(description="Product")
    def product_link(self, obj):
        if obj.product:
            url = reverse("admin:api_product_change", args=[obj.product.id])
            return format_html('<a href="{}">{}</a>', url, obj.product.name)
        return obj.product_name

    @admin.display(description="Image")
    def product_image_preview(self, obj):
        if obj.product_image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.product_image)
        return "No Image"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "user_link", "status_display", "items_count", 
                    "total_display", "payment_method", "created_at")
    search_fields = ("order_number", "user__email", "user__username", "tracking_number")
    list_filter = ("status", "payment_method", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("order_number", "created_at", "updated_at", "items_count")
    inlines = [OrderItemInline]

    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'items_count')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_full_name', 
                'shipping_address_line1', 
                'shipping_address_line2',
                'shipping_city', 
                'shipping_state', 
                'shipping_zipcode', 
                'shipping_country',
                'shipping_phone'
            )
        }),
        ('Payment & Pricing', {
            'fields': ('payment_method', 'subtotal', 'tax', 'shipping_cost', 'total')
        }),
        ('Tracking', {
            'fields': ('tracking_number',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'delivered_at')
        }),
    )

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)

    @admin.display(description="Status")
    def status_display(self, obj):
        colors = {
            'pending': '#fdcb6e',
            'processing': '#74b9ff',
            'shipped': '#a29bfe',
            'delivered': '#00b894',
            'cancelled': '#ff7675'
        }
        color = colors.get(obj.status, '#dfe6e9')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )

    @admin.display(description="Total")
    def total_display(self, obj):
        return format_html('<strong>${}</strong>', obj.total)

    actions = ['mark_as_processing', 'mark_as_shipped', 'mark_as_delivered', 'mark_as_cancelled']

    @admin.action(description='Mark as Processing')
    def mark_as_processing(self, request, queryset):
        queryset.update(status='processing')
        self.message_user(request, f"{queryset.count()} orders marked as processing.")

    @admin.action(description='Mark as Shipped')
    def mark_as_shipped(self, request, queryset):
        queryset.update(status='shipped')
        self.message_user(request, f"{queryset.count()} orders marked as shipped.")

    @admin.action(description='Mark as Delivered')
    def mark_as_delivered(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='delivered', delivered_at=timezone.now())
        self.message_user(request, f"{queryset.count()} orders marked as delivered.")

    @admin.action(description='Mark as Cancelled')
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, f"{queryset.count()} orders cancelled.")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order_link", "product_name", "quantity", "price_display", "subtotal_display")
    search_fields = ("order__order_number", "product_name", "product__name")
    list_filter = ("order__created_at",)
    ordering = ("-order__created_at",)
    readonly_fields = ("subtotal",)

    @admin.display(description="Order")
    def order_link(self, obj):
        url = reverse("admin:api_order_change", args=[obj.order.id])
        return format_html('<a href="{}">{}</a>', url, obj.order.order_number)

    @admin.display(description="Price")
    def price_display(self, obj):
        return f"${obj.price}"

    @admin.display(description="Subtotal")
    def subtotal_display(self, obj):
        return f"${obj.subtotal}"


# ================================ STORE - REVIEWS ================================

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "product_link", "user_link", "rating_display", 
                    "title", "created_at")
    search_fields = ("product__name", "user__email", "title", "comment")
    list_filter = ("rating", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ('Review Information', {
            'fields': ('product', 'user', 'rating')
        }),
        ('Content', {
            'fields': ('title', 'comment')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    @admin.display(description="Product")
    def product_link(self, obj):
        url = reverse("admin:api_product_change", args=[obj.product.id])
        return format_html('<a href="{}">{}</a>', url, obj.product.name)

    @admin.display(description="User")
    def user_link(self, obj):
        url = reverse("admin:api_user_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)

    @admin.display(description="Rating")
    def rating_display(self, obj):
        stars = "⭐" * obj.rating
        return f"{stars} ({obj.rating}/5)"

    actions = ['delete_selected_reviews']

    @admin.action(description='Delete selected reviews')
    def delete_selected_reviews(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"{count} reviews deleted.")
