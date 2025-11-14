from django.contrib import admin
from django.utils.html import format_html
from .models import User, UserProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'role', 'is_staff', 'date_joined')
    search_fields = ('email', 'username')
    list_filter = ('role', 'is_staff', 'is_superuser', 'date_joined')
    ordering = ('-date_joined',)

    fieldsets = (
        ('Account Info', {
            'fields': ('email', 'username', 'password')
        }),
        ('Personal Info', {
            'fields': ('role',)
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Important Dates', {
            'fields': ('date_joined',)
        }),
    )

    readonly_fields = ('date_joined',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'created_at')
    search_fields = ('user__email', 'user__username', 'name')
    list_filter = ('created_at',)
    ordering = ('-created_at',)

    def profile_pic_preview(self, obj):
        if obj.profile_pic:
            return format_html('<img src="{}" width="50" height="50" />', obj.profile_pic.url)
        return "No Image"
