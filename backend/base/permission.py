from functools import wraps
from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from base.models import UserRole


def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response({"msg":"No authenticated user."})
            if not hasattr(request.user, 'role_name'):
                return Response({'msg':'No attribute role_name provided'})
            current_role_name = request.user.role_name.role_name
            print(current_role_name)
            print(required_role)
            if (required_role != current_role_name):
                return Response({"msg": f"Permission denied. Only {required_role}s are permitted."}, 
                                status=status.HTTP_403_FORBIDDEN)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def role_required_new(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response({"msg":"No authenticated user."})
            if not hasattr(request.user, 'role_name'):
                return Response({'msg':'No attribute role_name provided'})
            current_role_name_id = request.user.role_name.id
            print(current_role_name_id)
            print(required_role)
            if (required_role != current_role_name_id):
                permitted_user_role = UserRole.objects.get(id = required_role).role_name
                return Response({"msg": f"Permission denied. Only {permitted_user_role}s are permitted."}, 
                                status=status.HTTP_403_FORBIDDEN)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
    

