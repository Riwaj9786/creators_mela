from rest_framework import permissions
from users.models import RegisteredSession

class IsAdminOrSessionOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Allow access if the request user is the owner of the object
        return obj.user.user == request.user
    

class IsOwner(permissions.BasePermission):
    """
    Custom permission to allow only the authenticated user to update their own profile.
    """

    def has_permission(self, request, view):
        # Ensure the user is authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # For object-level checks (if needed)
        return obj == request.user