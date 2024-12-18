from flask import Response
from rest_framework.decorators import api_view
from base.models import Admin, Airline, AirportUser, Country, Customer, UserRole
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def admin_register(request): #Create a new admin
    try:
        role = UserRole.objects.get(id=1)
    except ObjectDoesNotExist:
        return Response({"error": "Admin role does not exist."}, status=status.HTTP_400_BAD_REQUEST)
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

@api_view(['POST']) #Create a new airline
def airline_register(request):
    customer_role = UserRole.objects.get(id=3)
    airport_user = AirportUser.objects.create(
        username=request.data['username'],
        password=make_password(request.data['password']),
        email=request.data['email'],
        role_name= customer_role
        )
    airport_user.save()
    country = Country.objects.get(id = request.data['country_id'])
    name = request.data['name']
    airline = Airline.objects.create(name = name, country_id=country, airport_user = airport_user)
    airline.save()
    return Response({"message": "Airline registered successfully."}, status=status.HTTP_201_CREATED)
