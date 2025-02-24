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
from datetime import datetime
from django.core.exceptions import ValidationError

logger = logging.getLogger('report_actions')

def conditions_for_booking_a_flight():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            customer = get_object_or_404(Customer, airport_user_id = request.user.id)
            if not request.user.is_active:
                return Response({"Error":"This client is not active."})
            flight_id = request.data.get('flight_id')
            flight = get_object_or_404(Flight, id= flight_id)
            # if not flight.is_active:
            if not flight.status == 'active':
                return Response({"Error":"Canceled or already tookoff flight"})
            # ticket = get_object_or_404(Ticket, flight_id=flight_id, customer_id=customer.id, is_active=True)

            ticket = Ticket.objects.filter(flight_id=flight_id, customer_id=customer.id, status='active').first()
            if ticket:
                return Response({"This customer has already a ticket for this flight."})
            if flight.remaining_tickets <= 0:
                return Response({"Sold-Out!"})
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def deactivate_flights():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            flights = Flight.objects.filter(is_active=True, departure_time__lte=now())
            flights.update(is_active = False)
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
            if ticket.customer_id != current_customer_id:
                # logging.debug(f"User {current_customer_id} tried to remove a ticket of another user")
                logger.warning(f"User {current_customer_id} tried to remove a ticket of another user")
                return Response({'msg':'This is a ticket of another customer'})
            if not ticket.status == 'active':
                return Response({"msg": "Canceled ticket or already tookoff flight"}, status=status.HTTP_200_OK)
            # flight = Flight.objects.get(id = ticket.flight_id)
            # if not flight.is_active:
            #     return Response({'msg':'The flight is inactive'})
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

def user_details_input_validation(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            username = data.get('username', '')
            if AirportUser.objects.filter(username=username).exists():
                return Response({'error': 'Username is already taken'})
            if not re.match(r'^[a-zA-Z0-9]*$', username) or not any(char.isdigit() for char in username):
                return Response({'error': 'Username must be unique, contain at least one digit, and have no special characters'})
            password = data.get('password', '')
            if not re.match(r'^[a-zA-Z0-9]*$', password) or len(password) < 4 or not any(char.isdigit() for char in password):
                return Response({'error': 'Password must include at least one digit, at least four characters, and have no special characters'})
            email = data.get('email', '')
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            if not re.match(email_pattern, email):
                return Response({'error': 'Invalid email format'})
            return func(request, *args, **kwargs)
        return wrapper
    

def customer_details_input_validation(func):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            first_name = data.get('first_name', '')
            if not first_name or not first_name.isalpha() or len(first_name) > 50:
                ValidationError("First name is required, only letters, 50 characters max.")
            last_name = data.get('last_name', '')
            if not last_name or not last_name.isalpha() or len(last_name) > 50:
                ValidationError("Last name is required, only letters, 50 characters max.")
            address = data.get('address', '')
            if not address or len(address) > 255 or not re.fullmatch(r'[A-Za-z0-9]+', address) or len(re.findall(r'[A-Za-z]', address)) < 2:
                ValidationError("Address is required, 255 characters max, only letter and numbers.")
            phone_no = data.get('phone_no', '')
            if not phone_no or not re.fullmatch(r'\d{6}', phone_no):
                ValidationError("Phone number must be 6 characters, digits only")
            credit_card_no = data.get['credit_card_no']
            if not credit_card_no or not re.fullmatch(r'\d{6}', credit_card_no):
                ValidationError("Credit card number must be 8 characters, digits only")
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def admin_details_input_validation(func):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            data = request.data
            first_name = data.get('first_name', '')
            if not first_name or not first_name.isalpha() or len(first_name) > 50:
                ValidationError("First name is required, only letters, 50 characters max.")
            last_name = data.get('last_name', '')
            if not last_name or not last_name.isalpha() or len(last_name) > 50:
                ValidationError("Last name is required, only letters, 50 characters max.")
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def create_airport_user(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        data = request.data
        default_role = UserRole.objects.get(id=1)
        try:
            airport_user = AirportUser.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            role_name = default_role)

            airport_user.save()
        except IntegrityError as e:
            return Response({"msg":"Username already exists. Please choose a different username."})
        return func(request, *args, **kwargs)
    return wrapper
    


def airline_details_input_validation(func):
    # def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
            data = request.data
            name = data.get('name', '')
            if not name or len(name) > 100 or not name.isalpha():
                return Response({"Error":"Airline name is required, letters only, 100 characters max."})
            return func(request, *args, **kwargs)
        return wrapper


def authorize_customer():
    def decorator(func):
        @wraps(func)
        def wrapper(request, id, *args, **kwargs):
            logged_customer = request.user.customers
            logged_customer_id = logged_customer.id
            if id != logged_customer_id:
                return Response({"error" : "Customer cannot update or access the details of another customer"})
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
                return Response({"error" : "Airline cannot have access to the details of another airline's flight"})
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
                return Response({"error" : "Airline cannot update the details of another airline"})
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator

def update_flights_status():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # current_time = timezone.localtime(timezone.now())
            current_time = datetime.now()
            print("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
            print(current_time)
            flights_to_update = Flight.objects.exclude(status__in=['canceled', 'landed']) \
                 .filter(departure_time__lt=timezone.now())
            for flight in flights_to_update:
                possible_active_ticket = Ticket.objects.exclude(status='canceled').get(flight_id=flight.id)
                if not possible_active_ticket:
                    flight.status = 'canceled'
                if flight.departure_time <= current_time < flight.landing_time:
                    flight.status = 'tookoff'
                    Ticket.objects.filter(Q(flight_id=flight.id) & Q(status='active')).update(status='tookoff')
                if current_time >= flight.landing_time:
                    flight.status = 'landed'
                    Ticket.objects.filter(Q(flight_id=flight.id) & ~Q(status = 'canceled')).update(status='landed')
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


