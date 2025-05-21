from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from base.models import UserRole
import logging

logger = logging.getLogger('report_actions')

def role_required(required_role):
    def decorator(func):
        @wraps(func) 
        def wrapper(request, *args, **kwargs):
            print(request)
            if not request.user.is_authenticated:
                logger.warning(f"Function '{func.__name__}' is being called by a guest.")
                return Response({"message":"No authenticated user."}, status=status.HTTP_401_UNAUTHORIZED)
            if not hasattr(request.user, 'role_name'):
                return Response({"message":'No attribute role_name provided'}, status=status.HTTP_400_BAD_REQUEST)
            current_role_name_id = request.user.role_name.id
            if (required_role != current_role_name_id):
                user_username = request.user.username
                user_role_name = request.user.role_name.role_name
                permitted_user_role = UserRole.objects.get(id = required_role).role_name
                logger.warning(f"Function '{func.__name__}' is being called by the {user_role_name} {user_username}")
                return Response({"message": f"Permission denied. Only {permitted_user_role}s are permitted."}, 
                                status=status.HTTP_403_FORBIDDEN)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


def authorize_admin_and_customer(): # Authorization for the end point 'get_customer_by_username'.
    def decorator(func):
        @wraps(func)
        def wrapper(request, username, *args, **kwargs):
            if not request.user.is_authenticated:
                logger.warning(f"Function '{func.__name__}' is being called by a guest.")
                return Response({"error":"No authenticated user."}, status=status.HTTP_401_UNAUTHORIZED)
            if not hasattr(request.user, 'role_name'):
                return Response({"error":'No attribute role_name provided'}, status=status.HTTP_400_BAD_REQUEST)
            current_role_name_id = request.user.role_name.id
            is_authorized = current_role_name_id == 1 or (current_role_name_id == 2 and request.user.username == username)
            if not is_authorized:
                logger.warning(f"A user that is not an admin nor the customer {username}, tries to fetch these details.")
                return Response({"error":"Only admin and matching customer are authorized."}, status=status.HTTP_401_UNAUTHORIZED)
            return func(request, username, *args, **kwargs)
        return wrapper
    return decorator
    

