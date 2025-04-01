from django.db import connection
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from base.decorators import *
from base.models import Admin, AirportUser, Customer, RolesEnum, Ticket, UserRole, Airline, Country, Flight
from base.serializer import AirlineSerializer, AirportUserSerializer, CountrySerializer, CustomerSerializer, FlightSerializer
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
from .models import Roles, UserRole
from rest_framework.permissions import IsAuthenticated
from django.db.models import F
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger('report_actions')

def index(req):
    return JsonResponse('hello', safe=False)

# Create a new customer(user_role_num = 2)
# Before creating a new airport_user and a new customer, validate the details of the input.
@api_view(['POST']) 
@user_details_input_validation
@customer_details_input_validation
@create_airport_user(Roles.CUSTOMER.value)
def customer_register(request):
    username = request.data['username']
    airport_user = AirportUser.objects.get(username = username)
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    address = request.data['address']
    phone_no = request.data['phone_no']
    credit_card_no = request.data['credit_card_no']
    customer = Customer.objects.create(first_name=first_name, last_name=last_name,
                                  address=address, phone_no=phone_no, credit_card_no=credit_card_no,airport_user=airport_user)
    customer.save()
    return Response({"message": "Customer registered successfully."}, status=status.HTTP_201_CREATED)    

# Login method, setting the token.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, airport_user):
        if not airport_user.role_name:
            raise ValueError("Role name is missing for the user.")
        token = super().get_token(airport_user)
        token['username'] = airport_user.username
        token['id'] = airport_user.id
        token['role_name'] = airport_user.role_name.role_name
        token['role_id'] = airport_user.role_name.id
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_active:
            raise AuthenticationFailed("Your account is inactive.")
        return data
    
    def authenticate(self, **kwargs):
        # Call the parent authenticate method to get the user
        user = super().authenticate(**kwargs)

        # If the user is inactive, raise the custom exception
        if user and not user.is_active:
            raise AuthenticationFailed(
                detail="This account is inactive.",
                code="account_inactive"
            )
        
        return user
    
class MyTokenObtainPairView(TokenObtainPairView): 
    serializer_class = MyTokenObtainPairSerializer
   
# Log-out method - blacklist the token.
@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "User logged out successfully and token blacklisted."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# Show Airlines.
# Using a foreign key to Country and Airportuser.
@api_view(['GET'])
def get_all_airlines(request):
    airlines = Airline.objects.select_related('country_id', 'airport_user').annotate(
        country=F('country_id__name'),
        email=F('airport_user__email')
    ).values(
        'id', 
        'name', 
        'country',  
        'email'     
    )
    data = list(airlines)
    if not data:
        return Response(
            {"message": "No airlines found."},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(
        {"message": "Airlines retrieved successfully.", "airlines": data},
        status=status.HTTP_200_OK
    )

#Select an airline by ID.
@api_view(['GET'])
def get_airline_by_id(request, id):
    airline = get_object_or_404(
        Airline.objects.select_related('country_id', 'airport_user').annotate(
            country=F('country_id__name'),
            email=F('airport_user__email')
        ).values(
            'id', 
            'name', 
            'country',  
            'email'
        ),
        id=id
    )
    return Response(
        {"message": "Airline retrieved successfully.", "airline": airline},
        status=status.HTTP_200_OK
    )

# Show all countries.
@api_view(['GET'])
def get_all_countries(request):
    countries = Country.objects.all()

    if not countries.exists():
        return Response(
            {"message": "No countries found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = CountrySerializer(countries, many=True)
    return Response(
        {"message": "Countries retrieved successfully.", "countries": serializer.data},
        status=status.HTTP_200_OK
    )

# Pick a country by ID.
@api_view(['GET'])
def get_country_by_id(request, id):
    try:
        country = Country.objects.get(id=id)
    except Country.DoesNotExist:
        return Response(
            {"message": "Country not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CountrySerializer(country)
    return Response(
        {"message": "Country retrieved successfully.", "country": serializer.data},
        status=status.HTTP_200_OK
    )

# Pick an airline by its username.
@api_view(['GET'])
def get_airline_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_airline_data_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                airline_details = dict(zip(columns,result))
                return Response(
                    {"message": "Airline retrieved successfully.", "airline": airline_details},
                    status=status.HTTP_200_OK
                )
            else:
                 return Response(
                    {"message": "No airline found for the given username."},
                    status=status.HTTP_404_NOT_FOUND
                )
    except Exception as e:
           return Response(
            {"message": "An error occurred while retrieving airline data.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Get all flights. Updating flights' status in advance.
@api_view(['GET'])
@decorators.update_flights_status()
def get_all_flights(request): 
    logger.info("Shalom Shalom")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_all_flights()")
            rows = cursor.fetchall()
            if not rows:
                return Response(
                    {"message": "No flights found in the system."},
                    status=status.HTTP_404_NOT_FOUND
                )
            columns = [col[0] for col in cursor.description]
            flights = [dict(zip(columns, row)) for row in rows]
            return Response(
                {"message": "All flights retrieved successfully.", "flights": flights},
                status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response(
            {"message": "An error occurred while retrieving flights.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET']) # Picking a flight by ID. Updating flights' status in advance.
@decorators.update_flights_status()
def get_flight_by_id(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_all_flights() AS f WHERE f.flight_id=(%s)",[id])
            row = cursor.fetchone()
            if row is None:
                return Response(
                    {"message": "Flight with the given ID does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )
            columns = [col[0] for col in cursor.description]
            flight = dict(zip(columns, row))
            return Response(
                {"message": "Flight retrieved successfully.", "flight": flight},
                status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response(
            {"message": "An error occurred while retrieving the flight.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET']) # All active flights from a specific airline, that are before takeoff.
@decorators.update_flights_status()
def get_flights_by_airline_id(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_flights_by_airline_id(%s)",[id])
            rows = cursor.fetchall()
            if not rows:
                 return Response(
                    {"message": "No upcoming flights found for the specified airline."},
                    status=status.HTTP_404_NOT_FOUND
                )
            columns = [col[0] for col in cursor.description]
            flights = [dict(zip(columns, row)) for row in rows]
            return Response(
                {"message": "Upcoming flights retrieved successfully.", "flights": flights},
                status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response(
            {"message": "An error occurred while retrieving airline flights.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['GET'])
@decorators.update_flights_status()
def get_flights_by_parameters(request):
    origin_country_id = request.data.get('origin_country_id')
    dest_country_id = request.data.get('dest_country_id')
    date = request.data.get('dep_date')
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_flights_by_parameters(%s, %s, %s)", 
                           [origin_country_id, dest_country_id, date])
            rows = cursor.fetchall()
            if not rows:
                return Response(
                    {"message": "No flights match the given parameters."},
                    status=status.HTTP_404_NOT_FOUND
                )
            columns = [col[0] for col in cursor.description]
            flights = [dict(zip(columns, row)) for row in rows]
            return Response(
                {"message": "Relevant flights found", "flights": flights},
                status=status.HTTP_200_OK
            )
    except Exception as e:
          return Response(
            {"message": "An error occurred while retrieving flights", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@decorators.update_flights_status()
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
                return Response(
                    {"message": "Relevant arrival flights found", "flights": flights},
                    status=status.HTTP_200_OK
                )
             else:
                 return Response(
                    {"message": "No arrival flights found for the given country ID"},
                    status=status.HTTP_404_NOT_FOUND
                )
    except Exception as e:
         return Response(
            {"message": "An error occurred while retrieving arrival flights", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@decorators.update_flights_status()
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
                return Response(
                    {"message": "Relevant flights found", "flights": flights},
                    status=status.HTTP_200_OK
                )
             else:
                 return Response(
                    {"message": "No flights found for the given country ID"},
                    status=status.HTTP_404_NOT_FOUND
                )
    except Exception as e:
           return Response(
            {"message": "An error occurred while retrieving flights", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
# -- #############################################################################################################






# -- #############################################################################################################

@api_view(['POST'])
def create_all_user_roles(request):
    response = utils.create_all_user_roles()
    return response


