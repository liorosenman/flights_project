from functools import wraps
from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status


# @permission_classes([IsAuthenticated]) 
def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response({"msg":"No authenticated user."})
            if not hasattr(request.user, 'role_name'):
                return Response({'msg':'No attribute role_name provided'})
            current_role_name = request.user.role_name.role_name
            if (required_role != current_role_name):
                return Response({"msg": f"Permission denied. Only {required_role}s are permitted."}, 
                                status=status.HTTP_403_FORBIDDEN)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
    

