from requests import Response, request
from base.serializer import CreateAirportUserSerializer
from rest_framework.exceptions import ValidationError
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
    print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
    details = {
        'username': "adminp",  
        'password': "123",
        'email': "ad@ad.com",
        'role_name': "administrator"
        }
    serializer = CreateAirportUserSerializer(data = details)
    if serializer.is_valid():
        airport_user = serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
