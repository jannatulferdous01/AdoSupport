from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class AuthMixin:
    """
    Authentication mixin for protected views
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class AdminOnlyMixin:
    """
    Admin-only mixin for admin views
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def check_permissions(self, request):
        super().check_permissions(request)
        if not request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Admin access required")
