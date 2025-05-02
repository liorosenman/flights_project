from functools import wraps
from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from base.models import UserRole


# def role_required(required_role):
#     def decorator(func):
#         @wraps(func)
#         def wrapper(request, *args, **kwargs):
#             if not request.user.is_authenticated:
#                 return Response({"msg":"No authenticated user."})
#             if not hasattr(request.user, 'role_name'):
#                 return Response({'msg':'No attribute role_name provided'})
#             current_role_name = request.user.role_name.role_name
#             print(current_role_name)
#             print(required_role)
#             if (required_role != current_role_name):
#                 return Response({"msg": f"Permission denied. Only {required_role}s are permitted."}, 
#                                 status=status.HTTP_403_FORBIDDEN)
#             return func(request, *args, **kwargs)
#         return wrapper
#     return decorator

def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response({"error":"No authenticated user."}, status=status.HTTP_401_UNAUTHORIZED)
            if not hasattr(request.user, 'role_name'):
                return Response({"error":'No attribute role_name provided'}, status=status.HTTP_400_BAD_REQUEST)
            current_role_name_id = request.user.role_name.id
            if (required_role != current_role_name_id):
                permitted_user_role = UserRole.objects.get(id = required_role).role_name
                return Response({"error": f"Permission denied. Only {permitted_user_role}s are permitted."}, 
                                status=status.HTTP_403_FORBIDDEN)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


def authorize_admin_and_customer():
    def decorator(func):
        @wraps(func)
        def wrapper(request, username, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response({"error":"No authenticated user."}, status=status.HTTP_401_UNAUTHORIZED)
            if not hasattr(request.user, 'role_name'):
                return Response({"error":'No attribute role_name provided'}, status=status.HTTP_400_BAD_REQUEST)
            current_role_name_id = request.user.role_name.id
            is_authorized = current_role_name_id == 1 or (current_role_name_id == 2 and request.user.username == username)
            if not is_authorized:
                return Response({"error":"Only admin and matching customer are authorized."}, status=status.HTTP_401_UNAUTHORIZED)
            return func(request, username, *args, **kwargs)
        return wrapper
    return decorator
    

