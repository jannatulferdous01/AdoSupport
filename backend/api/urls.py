from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterUserView, LoginUserView, AdolescentView, ParentView,
    UserProfileView, ProfileAvatarView, ChangePasswordView, Chatbot, ChatSessionListView,
    ChatSessionDeleteView, ChatSessionMessageView, PostDetailView,
    PostReactionView, PostListCreateView, CommentCreateView,
    CommentDeleteView, CommentLikeView, CommentReplyView,
    PostReportView, PostSaveView,
    ProductListView, ProductDetailView, CategoryListView,
    CartView, CartItemView, CartItemDetailView,
    OrderListView, OrderDetailView,
    ProductReviewListView, ReviewDetailView,
    AdminProductListView, AdminProductDetailView,
    AdminOrderListView, AdminOrderDetailView, AdminStatisticsView, AdminLoginView, AdminProfileView, AdminLogoutView, AdminTokenRefreshView, UploadAvatarView, DeleteAvatarView
)

urlpatterns = [
    # ========================== Authentication ==========================
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserView.as_view(), name="user-registration"),
    path("login/", LoginUserView.as_view(), name="user-login"),

    # ========================== Admin Authentication ==========================
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin/logout/", AdminLogoutView.as_view(), name="admin-logout"),
    path("admin/profile/", AdminProfileView.as_view(), name="admin-profile"),
    path("admin/token/refresh/", AdminTokenRefreshView.as_view(),
         name="admin-token-refresh"),

    # ========================== User Profile ==========================
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/avatar/", ProfileAvatarView.as_view(), name="profile-avatar"),
    path("profile/avatar/upload/", UploadAvatarView.as_view(), name="upload-avatar"),
    path("profile/avatar/delete/", DeleteAvatarView.as_view(), name="delete-avatar"),
    path("profile/password/change/", ChangePasswordView.as_view(), name="change-password"),
    # Legacy endpoint support
    path("change-password/", ChangePasswordView.as_view(), name="change-password-legacy"),

    # ========================== RBA ==========================
    path("adolescent/", AdolescentView.as_view(), name='adolescent'),
    path("parent/", ParentView.as_view(), name='parent'),

    # ========================== Chatbot ==========================
    path("chatbot/", Chatbot.as_view(), name="chatbot"),
    path("chat/sessions/", ChatSessionListView.as_view(), name="chat-session"),
    path("chat/sessions/<int:chat_id>/messages/",
         ChatSessionMessageView.as_view(), name="chat-message"),
    path("chat/sessions/<int:chat_id>/",
         ChatSessionDeleteView.as_view(), name="chat-delete"),

    # ========================== Community - Posts ==========================
    path('community/posts/', PostListCreateView.as_view(), name='community-posts'),
    path('community/posts', PostListCreateView.as_view(),
         name='community-posts-no-slash'),

    path('community/posts/<int:post_id>/',
         PostDetailView.as_view(), name='post-detail'),
    path('community/posts/<int:post_id>',
         PostDetailView.as_view(), name='post-detail-no-slash'),

    # ========================== Community - Post Interactions ==========================
    path('community/posts/<int:post_id>/reactions/',
         PostReactionView.as_view(), name='post-reactions'),
    path('community/posts/<int:post_id>/reactions',
         PostReactionView.as_view(), name='post-reactions-no-slash'),

    path('community/posts/<int:post_id>/save/',
         PostSaveView.as_view(), name='post-save'),
    path('community/posts/<int:post_id>/save',
         PostSaveView.as_view(), name='post-save-no-slash'),

    path('community/posts/<int:post_id>/report/',
         PostReportView.as_view(), name='post-report'),
    path('community/posts/<int:post_id>/report',
         PostReportView.as_view(), name='post-report-no-slash'),

    # ========================== Community - Comments ==========================
    path('community/posts/<int:post_id>/comments/',
         CommentCreateView.as_view(), name='post-comments'),
    path('community/posts/<int:post_id>/comments',
         CommentCreateView.as_view(), name='post-comments-no-slash'),

    path('community/comments/<int:comment_id>/replies/',
         CommentReplyView.as_view(), name='comment-replies'),
    path('community/comments/<int:comment_id>/replies',
         CommentReplyView.as_view(), name='comment-replies-no-slash'),

    path('community/comments/<int:comment_id>/like/',
         CommentLikeView.as_view(), name='comment-like'),
    path('community/comments/<int:comment_id>/like',
         CommentLikeView.as_view(), name='comment-like-no-slash'),

    path('community/comments/<int:comment_id>/',
         CommentDeleteView.as_view(), name='comment-delete'),
    path('community/comments/<int:comment_id>',
         CommentDeleteView.as_view(), name='comment-delete-no-slash'),

    # ========================== Store - Products ==========================
    path('store/products/', ProductListView.as_view(), name='product-list'),
    path('store/products', ProductListView.as_view(),
         name='product-list-no-slash'),

    path('store/products/<int:product_id>/',
         ProductDetailView.as_view(), name='product-detail'),
    path('store/products/<int:product_id>',
         ProductDetailView.as_view(), name='product-detail-no-slash'),

    # ========================== Store - Categories ==========================
    path('store/categories/', CategoryListView.as_view(), name='category-list'),
    path('store/categories', CategoryListView.as_view(),
         name='category-list-no-slash'),

    # ========================== Store - Cart ==========================
    path('store/cart/', CartView.as_view(), name='cart'),
    path('store/cart', CartView.as_view(), name='cart-no-slash'),

    path('store/cart/items/', CartItemView.as_view(), name='cart-items'),
    path('store/cart/items', CartItemView.as_view(), name='cart-items-no-slash'),

    path('store/cart/items/<int:item_id>/',
         CartItemDetailView.as_view(), name='cart-item-detail'),
    path('store/cart/items/<int:item_id>', CartItemDetailView.as_view(),
         name='cart-item-detail-no-slash'),

    # ========================== Store - Orders ==========================
    path('store/orders/', OrderListView.as_view(), name='order-list'),
    path('store/orders', OrderListView.as_view(), name='order-list-no-slash'),

    path('store/orders/<int:order_id>/',
         OrderDetailView.as_view(), name='order-detail'),
    path('store/orders/<int:order_id>',
         OrderDetailView.as_view(), name='order-detail-no-slash'),

    # ========================== Store - Reviews ==========================
    path('store/products/<int:product_id>/reviews/',
         ProductReviewListView.as_view(), name='product-reviews'),
    path('store/products/<int:product_id>/reviews',
         ProductReviewListView.as_view(), name='product-reviews-no-slash'),

    path('store/reviews/<int:review_id>/',
         ReviewDetailView.as_view(), name='review-detail'),
    path('store/reviews/<int:review_id>',
         ReviewDetailView.as_view(), name='review-detail-no-slash'),

    # ========================== Store - Admin ==========================
    path('store/admin/products/', AdminProductListView.as_view(),
         name='admin-product-list'),
    path('store/admin/products', AdminProductListView.as_view(),
         name='admin-product-list-no-slash'),

    path('store/admin/products/<int:product_id>/',
         AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('store/admin/products/<int:product_id>',
         AdminProductDetailView.as_view(), name='admin-product-detail-no-slash'),

    path('store/admin/orders/', AdminOrderListView.as_view(),
         name='admin-order-list'),
    path('store/admin/orders', AdminOrderListView.as_view(),
         name='admin-order-list-no-slash'),

    path('store/admin/orders/<int:order_id>/',
         AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('store/admin/orders/<int:order_id>',
         AdminOrderDetailView.as_view(), name='admin-order-detail-no-slash'),

    path('store/admin/statistics/',
         AdminStatisticsView.as_view(), name='admin-statistics'),
    path('store/admin/statistics', AdminStatisticsView.as_view(),
         name='admin-statistics-no-slash'),
]
