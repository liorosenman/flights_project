from django.db import connection
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from base.models import Admin, AirportUser, Customer, RolesEnum, Ticket, UserRole, Airline, Country, Flight
from base.serializer import AirlineSerializer, AirportUserSerializer, CountrySerializer
from rest_framework.decorators import action
from rest_framework import status, viewsets
from base import decorators, utils
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.core.exceptions import ObjectDoesNotExist
from .models import UserRole
from rest_framework.permissions import IsAuthenticated


def index(req):
    return JsonResponse('hello', safe=False)

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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, airport_user):
        if not airport_user.role_name:
            raise ValueError("Role name is missing for the user.")
        token = super().get_token(airport_user)
        token['username'] = airport_user.username
        token['id'] = airport_user.id
        token['role_name'] = airport_user.role_name.role_name
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
def get_airline_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_airline_details_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                airline_details = dict(zip(columns,result))
                return Response({"status": "success", "data": airline_details}, status=200)
            else:
                return Response({"status": "error", "message": "No airline found for the given username."}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
@api_view(['GET'])
def get_customer_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_customer_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                customer_details = dict(zip(columns,result))
                return Response({"status": "success", "data": customer_details}, status=200)
            else:
                return Response({"status": "error", "message": "No customer found for the given username."}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
@api_view(['PUT'])
def remove_airline(request, id):
    airline = get_object_or_404(Airline, id = id)
    airport_user = AirportUser.objects.get(id = airline.airport_user_id)
    if not airport_user.is_active:
        return Response({"msg":"This airline is already inactive"})
    active_flights = Flight.objects.filter(airline_company_id = id, is_active=True)
    for flight in active_flights:
        ticket = Ticket.objects.filter(flight_id = flight.id, is_active = True)
        if ticket:
            return Response({"msg":"There is a passenger in one of the airline's flights"})
    # airline.is_active = False
    # airline.save()
    return Response({"msg":"Airline deactivated"})

@api_view(['PUT'])
def remove_customer(request, id):
    customer = get_object_or_404(Customer, id = id)
    airport_user = AirportUser.objects.get(id = customer.airport_user_id)
    if not airport_user.is_active:
        return Response({"msg":"This customer is already inactive"})
    active_customer_tickets = Ticket.objects.filter(customer_id = id, is_active = True)
    for ticket in active_customer_tickets:
        flight_id = ticket.flight_id
        flight = Flight.objects.get(id = flight_id, is_active = True)
        if flight:
            return Response({"msg":"The customer has future flights"})
    return Response({"msg":"The customer is deactivated"})
        
@api_view(['PUT'])
def remove_admin(request, id):
    if (id == 1):
        return Response({"msg":"Prime admin must not be removed!"})
    admin = get_object_or_404(Admin, id = id)
    airport_user = AirportUser.objects.get(id = admin.airport_user_id)
    if not admin.is_active:
        return Response({"msg":"This admin is already inactive"})
    return Response({"msg":"The admin is deactivated"})
    

@api_view(['GET'])
def get_flights_by_parameters(request):
    origin_country_id = request.data.get('origin_country_id')
    dest_country_id = request.data.get('dest_country_id')
    date = request.data.get('dep_date')
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_flights_by_parameters(%s, %s, %s)", [origin_country_id, dest_country_id, date])
            results = cursor.fetchall()
            if results:
                columns = [col[0] for col in cursor.description]
                flights = []
                for result in results:
                    flight_details = dict(zip(columns, result))
                    flights.append(flight_details)
                return Response({"Relevant flights are:":flights})
            else:
                return Response({"status": "error", "message": "No flight matches the parameters"}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
@api_view(['GET'])
def get_arrival_flights(request, id):
    try:
        with connection.cursor() as cursor:
             cursor.execute("SELECT * FROM get_arrival_flights_by_country(%s)", [id])
             results = cursor.fetchall()
             if results:
                columns = [col[0] for col in cursor.description]
                flights = []
                for result in results:
                    flight_details = dict(zip(columns, result))
                    flights.append(flight_details)
                return Response({"Relevant flights are:":flights})
             else:
                return Response({"status": "error", "message": "No flight found"}, status=404)
    except Exception as e:
         return Response({"status": "error", "message": str(e)}, status=400)
    
@api_view(['GET'])
def get_departure_flights(request, id):
    try:
        with connection.cursor() as cursor:
             cursor.execute("SELECT * FROM get_departure_flights_by_country(%s)", [id])
             results = cursor.fetchall()
             if results:
                columns = [col[0] for col in cursor.description]
                flights = []
                for result in results:
                    flight_details = dict(zip(columns, result))
                    flights.append(flight_details)
                return Response({"Relevant flights are:":flights})
             else:
                return Response({"status": "error", "message": "No flight found"}, status=404)
    except Exception as e:
         return Response({"status": "error", "message": str(e)}, status=400)
# -- #############################################################################################################

# @api_view(['PUT'])
# def change_rolename_to_admin(request):
#     utils.change_rolename_to_2()

@api_view(['POST'])
def create_all_user_roles(request):
    response = utils.create_all_user_roles()
    return response

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
