from django.http import JsonResponse
from django.shortcuts import render
from base.models import Admin, AirportUser, Customer, RolesEnum, UserRole, Airline, Country
from base.serializer import AirlineSerializer, AirportUserSerializer, CountrySerializer
from rest_framework.decorators import action
from rest_framework import status, viewsets
from base import utils
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ObjectDoesNotExist

def index(req):
    return JsonResponse('hello', safe=False)


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

@api_view(['POST']) #Create a new customer
def customer_register(request):
    role = UserRole.objects.get(id=2)
    airport_user = AirportUser.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
            email=request.data['email'],
            role_name= role
        )
    airport_user.save()
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    address = request.data['address']
    phone_no = request.data['phone_no']
    credit_card_no = request.data['credit_card_no']
    customer = Customer.objects.create(first_name=first_name, last_name=last_name,
                                  address=address, phone_no=phone_no, credit_card_no=credit_card_no,airport_user=airport_user)
    customer.save()
    return Response({"message": "Customer registered successfully."}, status=status.HTTP_201_CREATED)

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
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, airport_user):
        if not airport_user.role_name:
            raise ValueError("Role name is missing for the user.")
        token = super().get_token(airport_user)
        token['username'] = airport_user.username
        token['id'] = airport_user.id
        token['role_name'] = airport_user.role_name.id
        print(token)
        return token

class MyTokenObtainPairView(TokenObtainPairView): 
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "User logged out successfully and token blacklisted."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
api_view(['POST'])
def sign_up(request):
    serializer = AirportUserSerializer(data=request.data)
    if serializer.is_valid():
        airport_user = serializer.save()
    role_id = request.data.role_id
    if role_id == 1:
        pass

@api_view(['GET'])
def get_all_airlines(request):
    airlines = Airline.objects.all()
    serializer = AirlineSerializer(airlines, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_airline_by_id(request, id):
    try:
        airline = Airline.objects.get(id=id)
    except Airline.DoesNotExist:
        return Response({"error": "Airline not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AirlineSerializer(airline)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_countries(request):
    countries = Country.objects.all()
    serializer = CountrySerializer(countries, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_country_by_id(request, id):
    try:
        country = Country.objects.get(id=id)
    except Country.DoesNotExist:
        return Response({"error": "Country not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CountrySerializer(country)
    return Response(serializer.data)

@api_view(['GET'])
def get_airline_by_username(request):
    pass

@api_view(['GET'])
def get_flights_by_parameters():
    pass


#############################################################################################################

# @api_view(['PUT'])
# def change_rolename_to_admin(request):
#     utils.change_rolename_to_2()

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

# @api_view(['POST'])
# def create_countries(request):
