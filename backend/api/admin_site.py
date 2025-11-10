from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from api.models import (
    User, Post, Comment, PostReaction, ChatSession,
    ChatMessage, PostReport, SavedPost
)


class CustomAdminSite(admin.AdminSite):
    site_header = "AdoSupport Admin Panel"
    site_title = "AdoSupport Admin"
    index_title = "Dashboard"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(self.dashboard_view), name='dashboard'),
        ]
        return custom_urls + urls

    def dashboard_view(self, request):
        """Custom dashboard with statistics"""

        # Calculate date ranges
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        # User Statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        adolescents = User.objects.filter(role='adolescent').count()
        parents = User.objects.filter(role='parent').count()
        new_users_week = User.objects.filter(date_joined__gte=week_ago).count()
        new_users_month = User.objects.filter(
            date_joined__gte=month_ago).count()

        # Community Statistics
        total_posts = Post.objects.filter(is_deleted=False).count()
        posts_week = Post.objects.filter(
            is_deleted=False, created_at__gte=week_ago).count()
        posts_month = Post.objects.filter(
            is_deleted=False, created_at__gte=month_ago).count()

        # Posts by category
        posts_by_category = Post.objects.filter(is_deleted=False).values('category').annotate(
            count=Count('id')
        ).order_by('-count')

        # Comment Statistics
        total_comments = Comment.objects.filter(is_deleted=False).count()
        comments_week = Comment.objects.filter(
            is_deleted=False, created_at__gte=week_ago).count()

        # Reaction Statistics
        total_reactions = PostReaction.objects.count()
        reactions_by_type = PostReaction.objects.values('reaction_type').annotate(
            count=Count('id')
        ).order_by('-count')

        # Chat Statistics
        total_chat_sessions = ChatSession.objects.count()
        total_messages = ChatMessage.objects.count()
        sessions_week = ChatSession.objects.filter(
            created_at__gte=week_ago).count()

        # Report Statistics
        total_reports = PostReport.objects.count()
        pending_reports = PostReport.objects.filter(status='pending').count()
        resolved_reports = PostReport.objects.filter(status='resolved').count()

        # Most active users (by posts)
        most_active_posters = User.objects.annotate(
            post_count=Count('posts', filter=Q(posts__is_deleted=False))
        ).order_by('-post_count')[:5]

        # Most popular posts (by reactions)
        most_popular_posts = Post.objects.filter(is_deleted=False).annotate(
            reaction_count=Count('reactions'),
            comment_count=Count('comments', filter=Q(
                comments__is_deleted=False))
        ).order_by('-reaction_count')[:5]

        # Recent reports
        recent_reports = PostReport.objects.select_related(
            'post', 'reporter').order_by('-created_at')[:10]

        # Saved posts count
        total_saved_posts = SavedPost.objects.count()

        context = {
            'title': 'Dashboard',
            'site_title': self.site_title,
            'site_header': self.site_header,

            # User Stats
            'total_users': total_users,
            'active_users': active_users,
            'adolescents': adolescents,
            'parents': parents,
            'new_users_week': new_users_week,
            'new_users_month': new_users_month,

            # Community Stats
            'total_posts': total_posts,
            'posts_week': posts_week,
            'posts_month': posts_month,
            'posts_by_category': posts_by_category,
            'total_comments': total_comments,
            'comments_week': comments_week,
            'total_reactions': total_reactions,
            'reactions_by_type': reactions_by_type,
            'total_saved_posts': total_saved_posts,

            # Chat Stats
            'total_chat_sessions': total_chat_sessions,
            'total_messages': total_messages,
            'sessions_week': sessions_week,

            # Report Stats
            'total_reports': total_reports,
            'pending_reports': pending_reports,
            'resolved_reports': resolved_reports,

            # Top Content
            'most_active_posters': most_active_posters,
            'most_popular_posts': most_popular_posts,
            'recent_reports': recent_reports,
        }

        return render(request, 'admin/dashboard.html', context)


# Create custom admin site instance
custom_admin_site = CustomAdminSite(name='custom_admin')
