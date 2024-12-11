from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to allow only admins or the owner of the object to access it.
    """

    def has_permission(self, request, view):
        # Allow if the user is an admin
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Allow access if the request user is the owner of the object
        return obj.user == request.user