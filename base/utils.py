from requests import request
from base.serializer import CreateAirportUserSerializer
from rest_framework.exceptions import ValidationError

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
        'user_role': "administrator"
        }
    serializer = CreateAirportUserSerializer(data = details)
    airport_user = serializer.save()
    
