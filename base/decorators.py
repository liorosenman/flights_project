from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from functools import wraps

from base.models import Customer, Flight, Ticket, UserRole

def role_required(role_id):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
            
            if request.user.role_name_id != role_id:
                permitted_role = UserRole.objects.get(id=role_id).role_name
                return Response({"error": f"Permission denied. Only {permitted_role}s are permitted."}, 
                                status=status.HTTP_403_FORBIDDEN)
                        
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def conditions_for_booking_a_flight():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            customer = get_object_or_404(Customer, airport_user_id = request.user.id)
            if not customer.is_active:
                return Response({"Error":"This client is not active."})
            flight_id = request.data.get('flight_id')
            flight = get_object_or_404(Flight, id= flight_id)
            if not flight.is_active:
                return Response({"Error":"This flight is not active."})
            ticket = Ticket.objects.get(flight_id=flight_id, customer_id=customer.id, is_active=True)
            if ticket:
                return Response({"This customer has already a ticket for this flight."})
            if flight.remaining_tickets <= 0:
                return Response({"Sold-Out!"})
            return func(request, *args, **kwargs)
        return wrapper
    return decorator