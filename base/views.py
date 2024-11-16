from argparse import Action
from django.http import JsonResponse
from django.shortcuts import render
from requests import Response
from base.models import Admin
from base.serializer import CreateAirportUserSerializer
from rest_framework.decorators import action
from rest_framework import status, viewsets
from base import utils
from rest_framework.decorators import api_view

def index(req):
    return JsonResponse('hello', safe=False)

# @action(detail=False, methods=['post'], url_path='create_prime_user')
@api_view(['POST'])
def admin_register(request):
    print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    utils.create_default_airport_user()
    # airport_user = utils.create_airport_user(request)
    # first_name = request.data['first_name']
    # last_name = request.data['last_name']
    # admin = Admin.objects.create(first_name=first_name,last_name=last_name, airport_user=airport_user)
    # admin.save()
    return Response({"message": "Admin registered successfully."}, status=status.HTTP_201_CREATED)
    
