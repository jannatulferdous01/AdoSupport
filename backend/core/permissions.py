"""Custom permission classes"""
from rest_framework.permissions import BasePermission


class IsAdolescent(BasePermission):
    """Check if user role is adolescent"""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'adolescent'
        )


class IsParent(BasePermission):
    """Check if user role is parent"""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'parent'
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners to edit
    Read permissions are allowed to any request
    Write permissions are only allowed to the owner
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions (GET, HEAD, OPTIONS)
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Write permissions only to owner
        return obj.user == request.user


class IsAdminOrReadOnly(BasePermission):
    """
    Allow read access to anyone
    Write access only to admin users
    """

    def has_permission(self, request, view):
        # Read permissions for everyone
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Write permissions only for admin
        return request.user and request.user.is_staff
