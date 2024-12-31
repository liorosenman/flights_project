import logging
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from functools import wraps
from django.core.exceptions import ObjectDoesNotExist
from base.models import Customer, Flight, Ticket, UserRole
from base.serializer import AirportUserSerializer
from rest_framework_simplejwt.tokens import AccessToken
from django.utils.timezone import now


# logging.basicConfig(filename="../../myproj/logs.log",
#                     level=logging.DEBUG,
#                     format='%(asctime)s - %(levelname)s - %(message)s',
#                     filemode='a')
# logger = logging.getLogger()
# logger.setLevel(logging.DEBUG)
# logging.debug("Test DEBUG log message")

logger = logging.getLogger('report_actions')
logger.debug("This is a debug message.")

def conditions_for_booking_a_flight():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            customer = get_object_or_404(Customer, airport_user_id = request.user.id)
            if not request.user.is_active:
                return Response({"Error":"This client is not active."})
            flight_id = request.data.get('flight_id')
            flight = get_object_or_404(Flight, id= flight_id)
            if not flight.is_active:
                return Response({"Error":"This flight is not active."})
            # ticket = get_object_or_404(Ticket, flight_id=flight_id, customer_id=customer.id, is_active=True)
            ticket = Ticket.objects.filter(flight_id=flight_id, customer_id=customer.id, is_active=True).first()
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
                logging.debug(f"User {current_customer_id} tried to remove a ticket of another user")
                return Response({'msg':'This is a ticket of another customer'})
            if not ticket.is_active:
                return Response({"msg": "Ticket is already inactive"}, status=status.HTTP_200_OK)
            return func(request, id, *args, **kwargs)
        return wrapper
    return decorator


def create_airport_user(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        airport_user_data = request.data.get('airport_user')
        if not airport_user_data:
            return JsonResponse({"error": "Airport user data is required."}, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = AirportUserSerializer(data=airport_user_data)
        if not user_serializer.is_valid():
            return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        airport_user = user_serializer.save()
