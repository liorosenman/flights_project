from argparse import Action
from django.http import JsonResponse
from django.shortcuts import render
from base.models import Admin, AirportUser, UserRole
from base.serializer import CreateAirportUserSerializer
from rest_framework.decorators import action
from rest_framework import status, viewsets
from base import utils
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password

def index(req):
    return JsonResponse('hello', safe=False)


@api_view(['POST'])
def admin_register(request):
    print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    print(request.data['email'])
    role = UserRole.objects.get(role_name=request.data['role_name'])
    airport_user = AirportUser.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
            email=request.data['email'],
            role_name= role
        )
    airport_user.save()
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    admin = Admin.objects.create(first_name=first_name, last_name=last_name, airport_user=airport_user)
    admin.save()
    return Response({"message": "Admin registered successfully."}, status=status.HTTP_201_CREATED)

#############################################################################################################


# @api_view(['POST'])
# def create_all_user_roles(request):
#     response = utils.create_all_user_roles()
#     return response

# @api_view(['POST'])
# def create_prime_admin(request):
#     response = utils.create_prime_admin()
#     return response

# @api_view(['PUT'])
# def change_role_to_num(request):
#     response = utils.change_user_role_to_num()
#     return response