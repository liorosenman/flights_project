from argparse import Action
from django.http import JsonResponse
from django.shortcuts import render
from base.models import Admin
from base.serializer import CreateAirportUserSerializer
from rest_framework.decorators import action
from rest_framework import status, viewsets
from base import utils
from rest_framework.decorators import api_view
from rest_framework.response import Response

def index(req):
    return JsonResponse('hello', safe=False)

# @action(detail=False, methods=['post'], url_path='create_prime_user')
@api_view(['POST'])
def admin_register(request):
    print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    response = utils.create_default_airport_user()
    return response
    # airport_user = utils.create_airport_user(request)
    # first_name = request.data['first_name']
    # last_name = request.data['last_name']
    # admin = Admin.objects.create(first_name=first_name,last_name=last_name, airport_user=airport_user)
    # admin.save()
    # return Response({"message": "Admin registered successfully."}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_all_user_roles(request):
    response = utils.create_all_user_roles()
    return response

@api_view(['POST'])
def create_prime_admin(request):
    response = utils.create_prime_admin()
    return response