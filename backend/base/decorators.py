import datetime
import logging
import re
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from functools import wraps
from django.core.exceptions import ObjectDoesNotExist
from base.models import AirportUser, Customer, Flight, Ticket, UserRole
from base.serializer import AirportUserSerializer
from rest_framework_simplejwt.tokens import AccessToken
from django.utils.timezone import now
from django.db.models import Q
from django.utils import timezone
from django.utils.timezone import localtime, now
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from dateutil import parser
import pytz

logger = logging.getLogger('report_actions')

def conditions_for_booking_a_flight():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            customer = get_object_or_404(Customer, airport_user_id = request.user.id)
            if not request.user.is_active:
                return Response({"error": "This client is not active."}, status=status.HTTP_403_FORBIDDEN)
            flight_id = request.data.get('flight_id')
            flight = get_object_or_404(Flight, id= flight_id)
            # if not flight.is_active:
            if not flight.status == 'active':
                return Response({"error": "Canceled or already took off flight."}, status=status.HTTP_400_BAD_REQUEST)
            # ticket = get_object_or_404(Ticket, flight_id=flight_id, customer_id=customer.id, is_active=True)

            ticket = Ticket.objects.filter(flight_id=flight_id, customer_id=customer.id, status='active').first()
            if ticket:
                return Response({"error": "This customer already has a ticket for this flight."}, status=status.HTTP_409_CONFLICT)
            if flight.remaining_tickets <= 0:
                return Response({"error": "Sold-Out!"}, status=status.HTTP_410_GONE)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


def conditions_for_cancel_a_ticket():
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            ticket = get_object_or_404(Ticket, id = id)
            current_customer = request.user.customers
            current_customer_id = current_customer.id
            if ticket.customer_id_id != current_customer_id:
                # logging.debug(f"User {current_customer_id} tried to remove a ticket of another user")
                logger.warning(f"User {current_customer_id} tried to remove a ticket of another user")
                return Response(
                    {'msg': 'This is a ticket of another customer.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            if not ticket.status == 'active':
                return Response({"msg": "Canceled ticket or already tookoff flight"}, status=status.HTTP_200_OK)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

def user_details_input_validation(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            username = data.get('username', '')
            if AirportUser.objects.filter(username=username).exists():
                return Response({'error': 'Username is already taken'}, status=status.HTTP_409_CONFLICT)
            if not re.match(r'^[a-zA-Z0-9]*$', username) or not any(char.isdigit() for char in username):
                return Response({'error': 'Username must be unique, contain at least one digit, and have no special characters'},
                                status=status.HTTP_400_BAD_REQUEST)
            password = data.get('password', '')
            if not re.match(r'^[a-zA-Z0-9]*$', password) or len(password) < 4 or not any(char.isdigit() for char in password):
                return Response({'error': 'Password must include at least one digit, at least four characters, and have no special characters'},
                                status=status.HTTP_400_BAD_REQUEST)
            email = data.get('email', '')
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, email):
                return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)
            return func(request, *args, **kwargs)
        return wrapper
    

def customer_details_input_validation(func):
    # def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            first_name = data.get('first_name', '')
            if not first_name or not first_name.isalpha() or len(first_name) > 50:
                return Response(
                {"error": "First name is required, only letters, 50 characters max."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            last_name = data.get('last_name', '')
            if not last_name or not last_name.isalpha() or len(last_name) > 50:
                return Response(
                {"error": "Last name is required, only letters, 50 characters max."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            address = data.get('address', '')
            if not address or len(address) > 255 or not re.fullmatch(r'[A-Za-z0-9 ]+$', address) or len(re.findall(r'[A-Za-z]', address)) < 2:
                return Response(
                {"error": "Address is required, 255 characters max, only letters and numbers."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            phone_no = data.get('phone_no', '')
            if not phone_no or not re.fullmatch(r'\d{6}', phone_no):
                return Response(
                {"error": "Phone number must be 6 characters, digits only."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            credit_card_no = data.get('credit_card_no', '')
            if not credit_card_no or not re.fullmatch(r'\d{8}', credit_card_no):
                return Response(
                {"error": "Credit card number must be 8 characters, digits only."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            return func(request, *args, **kwargs)
        return wrapper
    # return decorator

def admin_details_input_validation(func):
    # def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            first_name = data.get('first_name', '')
            if not first_name or not first_name.isalpha() or len(first_name) > 50:
                 return Response(
                {"error": "First name is required, only letters, 50 characters max."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            last_name = data.get('last_name', '')
            if not last_name or not last_name.isalpha() or len(last_name) > 50:
                return Response(
                {"error": "Last name is required, only letters, 50 characters max."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            return func(request, *args, **kwargs)
        return wrapper
    # return decorator

def flight_details_input_validation(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        dep_time_str = request.data.get('departure_time') # The new departure time
        try:
            if not dep_time_str or not isinstance(dep_time_str, str):
                return Response(
                    {"error": "Departure time is required and must be a valid string."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            dep_time_str = dep_time_str.strip()
            dep_time = parser.parse(dep_time_str)
        except (ValueError, TypeError) as e:
                return Response(
                {"error": "Departure time is in an invalid datetime format."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        now = datetime.now()
        print(now)
        print(dep_time)
        if (now > dep_time):
               return Response(
                {"error": "The selected departure time is in the past."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not 'landing_time' in request.data:
            return Response(
                {"error": "No landing_time specified"}, 
                status=status.HTTP_400_BAD_REQUEST
)
        land_time = request.data.get('landing_time')
        land_time = parser.parse(land_time)
        
            # land_time_str = request.data.get('landing_time')
            # try:
            #     if not land_time_str or not isinstance(land_time_str, str):
            #         return Response(
            #             {"error": "Landing time is required and must be a valid string."},
            #             status=status.HTTP_400_BAD_REQUEST
            #         )
            #     land_time_str = land_time_str.strip()
            #     land_time = parser.parse(land_time_str)
            # except (ValueError, TypeError) as e:
            #      return Response(
            #         {"error": "Landing time is in an invalid datetime format."},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )

        if not land_time >= dep_time + timedelta(hours=1):
                return Response(
                    {"error": "Landing time must be at least one hour ahead of the departure time."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        rem_tickets = request.data.get('remaining_tickets')
        if not rem_tickets:
            return Response({"error":"Remaining tickets field is not specified"})
        try:
            if isinstance(rem_tickets, float) or (isinstance(rem_tickets, str) and '.' in rem_tickets):
                return Response(
                    {"error": "Remaining tickets must be an integer number (no decimals allowed)."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            rem_tickets = int(rem_tickets)  # Convert to integer

            if rem_tickets <= 0:
                return Response(
                    {"error": "Remaining tickets field must be a positive integer."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except ValueError:
            return Response(
                {"error": "Wrong input in remaining tickets field"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return func(request, *args, **kwargs)
    return wrapper
        


def create_airport_user(user_role_id):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            user_role = UserRole.objects.get(id=user_role_id)
            airport_user = AirportUser.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            role_name = user_role)
            airport_user.save()
            return func(request, *args, **kwargs)
        return wrapper
    return decorator



def airline_details_input_validation(func):
    # def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            name = data.get('name', '')
            if not name or len(name) > 100 or not name.isalpha():
                return Response({"error":"Airline name is required, letters only, 100 characters max."},
                                status=status.HTTP_400_BAD_REQUEST)
            return func(request, *args, **kwargs)
        return wrapper


def authorize_customer():
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            logged_customer = request.user.customers
            logged_customer_id = logged_customer.id
            if id != logged_customer_id:
                return Response(
                {"error": "Customer cannot update or access the details of another customer."}, 
                status=status.HTTP_403_FORBIDDEN)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator


def authorize_airline():
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            logged_airline = request.user.airlines
            logged_airline_id = logged_airline.id
            if id != logged_airline_id:
                return Response(
                {"error": "Airline cannot have access to the details of another airline's flight."}, 
                status=status.HTTP_403_FORBIDDEN)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

def airline_flight_auth():
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            flight = get_object_or_404(Flight, id = id)
            flight_airline_id = flight.airline_company_id_id
            logged_airline = request.user.airlines
            logged_airline_id = logged_airline.id
            if flight_airline_id != logged_airline_id:
                return Response(
                {"error": "Airline cannot update the details of another airline."}, 
                status=status.HTTP_403_FORBIDDEN)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

def update_flights_status():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_time = timezone.now() # Change from datetime.now() to timezone.now()
            flights_to_update = Flight.objects.exclude(status__in=['canceled', 'landed']) \
                 .filter(departure_time__lt=current_time)
            for flight in flights_to_update:
                possible_active_ticket = Ticket.objects.exclude(status='canceled').filter(flight_id=flight.id) # Change get to filter
                if not possible_active_ticket:
                    flight.status = 'canceled'
                elif flight.departure_time.astimezone(pytz.UTC) <= current_time < flight.landing_time.astimezone(pytz.UTC):
                    print(f"Updating flight {flight.id} to 'tookoff'")
                    flight.status = 'tookoff'
                    Ticket.objects.filter(flight_id=flight.id, status='active').update(status='tookoff')
                    # Ticket.objects.filter(Q(flight_id=flight.id) & Q(status='active')).update(status='tookoff')
                elif current_time >= flight.landing_time.astimezone(pytz.UTC):
                    flight.status = 'landed'
                    Ticket.objects.filter(flight_id=flight.id).exclude(status='canceled').update(status='landed')
                    # Ticket.objects.filter(Q(flight_id=flight.id) & ~Q(status = 'canceled')).update(status='landed')
                flight.save(update_fields=['status'])
            return func(*args, **kwargs)
        return wrapper
    return decorator

            






# def create_airport_user(func):
#     @wraps(func)
#     def wrapper(request, *args, **kwargs):
#         airport_user_data = request.data.get('airport_user')
#         if not airport_user_data:
#             return JsonResponse({"error": "Airport user data is required."}, status=status.HTTP_400_BAD_REQUEST)
#         user_serializer = AirportUserSerializer(data=airport_user_data)
#         if not user_serializer.is_valid():
#             return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         airport_user = user_serializer.save()


