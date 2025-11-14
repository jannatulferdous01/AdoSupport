from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Q, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from api.models import (
    User, Post, Comment, PostReaction, ChatSession,
    ChatMessage, PostReport, SavedPost,
    # Store models
    Product, Order, OrderItem, Review, Category
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
        new_users_month = User.objects.filter(date_joined__gte=month_ago).count()

        # Community Statistics
        total_posts = Post.objects.filter(is_deleted=False).count()
        posts_week = Post.objects.filter(is_deleted=False, created_at__gte=week_ago).count()
        posts_month = Post.objects.filter(is_deleted=False, created_at__gte=month_ago).count()

        # Posts by category
        posts_by_category = Post.objects.filter(is_deleted=False).values('category').annotate(
            count=Count('id')
        ).order_by('-count')

        # Comment Statistics
        total_comments = Comment.objects.filter(is_deleted=False).count()
        comments_week = Comment.objects.filter(is_deleted=False, created_at__gte=week_ago).count()

        # Reaction Statistics
        total_reactions = PostReaction.objects.count()
        reactions_by_type = PostReaction.objects.values('reaction_type').annotate(
            count=Count('id')
        ).order_by('-count')

        # Chat Statistics
        total_chat_sessions = ChatSession.objects.count()
        total_messages = ChatMessage.objects.count()
        sessions_week = ChatSession.objects.filter(created_at__gte=week_ago).count()

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
            comment_count=Count('comments', filter=Q(comments__is_deleted=False))
        ).order_by('-reaction_count')[:5]

        # Recent reports
        recent_reports = PostReport.objects.select_related('post', 'reporter').order_by('-created_at')[:10]

        # Saved posts count
        total_saved_posts = SavedPost.objects.count()

        # ========================== STORE STATISTICS ==========================
        
        # Product Statistics
        total_products = Product.objects.count()
        in_stock_products = Product.objects.filter(in_stock=True).count()
        out_of_stock_products = Product.objects.filter(in_stock=False).count()
        new_products = Product.objects.filter(is_new=True).count()
        bestsellers = Product.objects.filter(is_bestseller=True).count()
        
        # Category Statistics
        total_categories = Category.objects.count()
        products_by_category = Category.objects.annotate(
            product_count=Count('products')
        ).order_by('-product_count')[:5]
        
        # Order Statistics
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        processing_orders = Order.objects.filter(status='processing').count()
        shipped_orders = Order.objects.filter(status='shipped').count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        cancelled_orders = Order.objects.filter(status='cancelled').count()
        
        orders_week = Order.objects.filter(created_at__gte=week_ago).count()
        orders_month = Order.objects.filter(created_at__gte=month_ago).count()
        
        # Revenue Statistics
        total_revenue = Order.objects.filter(
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        revenue_week = Order.objects.filter(
            created_at__gte=week_ago,
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        revenue_month = Order.objects.filter(
            created_at__gte=month_ago,
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(total=Sum('total'))['total'] or 0
        
        # Average order value
        avg_order_value = Order.objects.filter(
            status__in=['processing', 'shipped', 'delivered']
        ).aggregate(avg=Avg('total'))['avg'] or 0
        
        # Top selling products
        top_selling_products = Product.objects.annotate(
            total_sold=Sum('orderitem__quantity', filter=Q(orderitem__order__status__in=['delivered', 'shipped']))
        ).order_by('-total_sold')[:5]
        
        # Recent orders
        recent_orders = Order.objects.select_related('user').order_by('-created_at')[:10]
        
        # Review Statistics
        total_reviews = Review.objects.count()
        avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0
        reviews_week = Review.objects.filter(created_at__gte=week_ago).count()
        
        # Low stock alerts
        low_stock_products = Product.objects.filter(
            in_stock=True,
            stock_quantity__lte=10
        ).order_by('stock_quantity')[:10]

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
            
            # ========================== STORE STATS ==========================
            
            # Product Stats
            'total_products': total_products,
            'in_stock_products': in_stock_products,
            'out_of_stock_products': out_of_stock_products,
            'new_products': new_products,
            'bestsellers': bestsellers,
            'total_categories': total_categories,
            'products_by_category': products_by_category,
            'low_stock_products': low_stock_products,
            
            # Order Stats
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'processing_orders': processing_orders,
            'shipped_orders': shipped_orders,
            'delivered_orders': delivered_orders,
            'cancelled_orders': cancelled_orders,
            'orders_week': orders_week,
            'orders_month': orders_month,
            'recent_orders': recent_orders,
            
            # Revenue Stats
            'total_revenue': round(total_revenue, 2),
            'revenue_week': round(revenue_week, 2),
            'revenue_month': round(revenue_month, 2),
            'avg_order_value': round(avg_order_value, 2),
            
            # Product Stats
            'top_selling_products': top_selling_products,
            
            # Review Stats
            'total_reviews': total_reviews,
            'avg_rating': round(avg_rating, 2),
            'reviews_week': reviews_week,
        }

        return render(request, 'admin/dashboard.html', context)


# Create custom admin site instance
custom_admin_site = CustomAdminSite(name='custom_admin')
