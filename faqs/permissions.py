from rest_framework.permissions import BasePermission
from rest_framework import permissions

class IsAdminUserOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user and request.user.is_staff