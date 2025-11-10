from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    User, UserProfile, ChatHistory, ChatSession, ChatMessage,
    Post, PostImage, PostReaction, SavedPost, Comment, CommentLike, PostReport
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
    readonly_fields = ("image_preview", "uploaded_at")
    fields = ("image", "image_preview", "uploaded_at")

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
    list_display = ("id", "post_link", "image_preview", "uploaded_at")
    search_fields = ("post__title",)
    list_filter = ("uploaded_at",)
    ordering = ("-uploaded_at",)
    readonly_fields = ("uploaded_at", "image_preview_large")

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
