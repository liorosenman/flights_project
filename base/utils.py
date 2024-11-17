from requests import request
from base.models import RolesEnum, UserRole, Admin
from base.serializer import CreateAirportUserSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status


def create_airport_user(data):
    details = {
        'username': data['username'], 
        'password': data['password'],
        'email': data['email'],
        'user_role': data['user_role']
        }
      
    serializer = CreateAirportUserSerializer(data = details)
    airport_user = serializer.save()
    return airport_user

def create_default_airport_user():
    details = {
        'username': "adminp",  
        'password': "123",
        'email': "ad@ad.com",
        'role_name': "administrator"
        }
    serializer = CreateAirportUserSerializer(data = details)
    if serializer.is_valid():
        airport_user = serializer.save()
        return Response({"message": "Admin prime was created successfully."}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
def create_all_user_roles():
    roles_to_create = [
        UserRole(role_name=role.value) for role in RolesEnum
    ]
    UserRole.objects.bulk_create(roles_to_create, ignore_conflicts=True)
    return Response({"message": "User roles created!!!"}, status=status.HTTP_201_CREATED)

def create_prime_admin():
    details = {
        'first_name': 'primeadmin',
        'last_name': 'pad'
    }
    new_admin = Admin.objects.create(
        first_name=details['first_name'],
        last_name=details['last_name']
    )
    return Response({"message": "Prime admin created!!!"}, status=status.HTTP_201_CREATED)



