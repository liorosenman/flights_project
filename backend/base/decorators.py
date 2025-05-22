import datetime
import logging
import re
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from functools import wraps
from base.models import Airline, AirportUser, Customer, Flight, Ticket, UserRole
from django.utils import timezone
from datetime import datetime, timedelta
from dateutil import parser
from django.utils.timezone import make_aware, is_naive
import pytz

logger = logging.getLogger('report_actions')

def conditions_for_booking_a_flight(): # A ticket can be created under these conditions.
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            customer = get_object_or_404(Customer, airport_user_id = request.user.id)
            if not request.user.is_active:
                return Response({"error": "This client is not active."}, status=status.HTTP_403_FORBIDDEN)
            flight_id = request.data.get('flight_id')
            flight = get_object_or_404(Flight, id= flight_id)
            if not flight.status == 'active':
                return Response({"error": "Canceled or already took off flight."}, status=status.HTTP_400_BAD_REQUEST)
            ticket = Ticket.objects.filter(flight_id=flight_id, customer_id=customer.id, status='active').first()
            if ticket:
                return Response({"error": "This customer already has a ticket for this flight."}, status=status.HTTP_409_CONFLICT)
            if flight.remaining_tickets <= 0:
                return Response({"error": "Sold-Out!"}, status=status.HTTP_410_GONE)
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


def conditions_for_cancel_a_ticket(): # Ticket can be canceled under these conditions.
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            ticket = get_object_or_404(Ticket, id = id)
            current_customer = request.user.customers
            current_airport_user = AirportUser.objects.get(id = current_customer.airport_user_id)
            current_customer_id = current_customer.id
            current_customer_username = current_airport_user.username
            if ticket.customer_id_id != current_customer_id:
                logger.warning(f"User {current_customer_username} requested to remove the ticket {ticket.id} of another user")
                return Response(
                    {'message': 'This is a ticket of another customer.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            if not ticket.status == 'active':
                return Response({"message": "Canceled ticket or already tookoff flight"}
                    , status=status.HTTP_200_OK)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

def user_details_input_validation(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        data = request.data
        username = data.get('username', '')
        if username:
            if AirportUser.objects.filter(username=username).exists():
                return Response({'error': 'Username is already taken'}, status=status.HTTP_409_CONFLICT)
            if not re.match(r'^[a-zA-Z0-9]*$', username) or not any(char.isdigit() for char in username):
                return Response({'error': 'Username must be unique, contain at least one digit, and have no special characters'},
                                status=status.HTTP_400_BAD_REQUEST)
        if 'password' in data:  # Only validate if key exists, even if value is empty
            password = data['password']
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
        print("AAAAAAAAAAAAAAAAAAAAAAAAAA")        
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
        
        now = timezone.now()
        if is_naive(dep_time):
            dep_time = make_aware(dep_time)
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
        if is_naive(land_time):
            land_time = make_aware(land_time)

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
            rem_tickets = int(rem_tickets) 
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

def update_airport_user():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            user_to_update = AirportUser.objects.get(id = request.user.id)
            email = request.data.get('email')
            if 'password' in request.data:
                password = request.data.get('password')
                user_to_update.set_password(password)
            user_to_update.email = email
            user_to_update.save()
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


def authorize_customer(): # Customer is authorized for his details alone.
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


def authorize_airline(): # Airline is authorized on its flights alone.
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

def airline_flight_auth(): # Authorization of flight to its airline.
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            flight = get_object_or_404(Flight, id = id)
            flight_airline_id = flight.airline_company_id_id
            logged_airline = request.user.airlines
            logged_airline_id = logged_airline.id
            if flight_airline_id != logged_airline_id:
                target_airline = Airline.objects.get(id == flight_airline_id)
                target_airline_airportuser = AirportUser.objects.get(id == target_airline.airport_user_id)
                logger.warning(f"The airline {request.user.username} requests to execute '{func.__name__}' on the airline {target_airline_airportuser.username}")
                return Response(
                {"error": "Airline cannot update the details of another airline."}, 
                status=status.HTTP_403_FORBIDDEN)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

# def update_flights_status(): # From 'active' to 'took-off', for example.
#     def decorator(func):
#         @wraps(func)
#         def wrapper(*args, **kwargs):
#             israel_tz = pytz.timezone('Asia/Jerusalem')
#             current_time = timezone.localtime(timezone.now(), israel_tz)
#             # print(current_time)
#             # print(timezone.now)
#             # print(datetime.now())
#             flights_to_update = Flight.objects.exclude(status__in=['canceled', 'landed']) \
#                  .filter(departure_time__lt=current_time)
#             for flight in flights_to_update:
#                 possible_active_ticket = Ticket.objects.exclude(status='canceled').filter(flight_id=flight.id) # Change get to filter
#                 if not possible_active_ticket:
#                     flight.status = 'canceled'
#                 elif flight.departure_time.astimezone(pytz.UTC) <= current_time < flight.landing_time.astimezone(pytz.UTC):
#                     print(f"Updating flight {flight.id} to 'tookoff'")
#                     flight.status = 'tookoff'
#                     Ticket.objects.filter(flight_id=flight.id, status='active').update(status='tookoff')
#                 elif current_time >= flight.landing_time.astimezone(pytz.UTC):
#                     flight.status = 'landed'
#                     Ticket.objects.filter(flight_id=flight.id).exclude(status='canceled').update(status='landed')
#                 flight.save(update_fields=['status'])
#             return func(*args, **kwargs)
#         return wrapper
#     return decorator

def update_flights_status():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            israel_tz = pytz.timezone('Asia/Jerusalem')
            current_time = timezone.localtime(timezone.now(), israel_tz)
            print(current_time)
            flights_to_update = Flight.objects.exclude(status__in=['canceled', 'landed']) \
                                              .filter(departure_time__lt=current_time)

            for flight in flights_to_update:
                departure = flight.departure_time.astimezone(israel_tz)
                landing = flight.landing_time.astimezone(israel_tz)

                active_tickets_exist = Ticket.objects.exclude(status='canceled') \
                                                     .filter(flight_id=flight.id) \
                                                     .exists()
            
                if not active_tickets_exist:
                    flight.status = 'canceled'
                elif departure <= current_time < landing:
                    flight.status = 'tookoff'
                    Ticket.objects.filter(flight_id=flight.id, status='active') \
                                  .update(status='tookoff')
                elif current_time >= landing:
                    flight.status = 'landed'
                    Ticket.objects.filter(flight_id=flight.id) \
                                  .exclude(status='canceled') \
                                  .update(status='landed')

                flight.save(update_fields=['status'])

            return func(*args, **kwargs)
        return wrapper
    return decorator


