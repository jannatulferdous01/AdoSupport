from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterUserView,
    LoginUserView,
    UserProfileView,
    ChangePasswordView,
    ParentView,
    AdolescentView
)

app_name = 'authentication'

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),

    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    path('parent/', ParentView.as_view(), name='parent'),
    path('adolescent/', AdolescentView.as_view(), name='adolescent'),
]
