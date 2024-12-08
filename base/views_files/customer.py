from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Airline, Customer, Flight, Ticket
from ..serializer import AirlineSerializer, FlightSerializer
from base import decorators


@api_view(['POST'])
@decorators.role_required(2)
@decorators.conditions_for_booking_a_flight()
def add_ticket(request):
    flight_id = request.data.get('flight_id')
    flight = Flight.objects.get(id=flight_id)
    # flight = Flight.objects.get(id = request.data.flight_id)
    flight.remaining_tickets -= 1
    flight.save()
    customer = Customer.objects.get(airport_user_id = request.user.id)
    ticket = Ticket.objects.create(
            flight_id=flight,
            customer_id=customer,
            is_active=True
    )
    return Response(
        {"message": "Ticket successfully created", "remaining_tickets": flight.remaining_tickets},
        status=status.HTTP_200_OK
        )


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

@api_view(['PUT'])
@decorators.role_required(2)
@decorators.conditions_for_booking_a_flight()
def remove_ticket(request):
    ticket_id = request.data.get('ticket_id')
    ticket = Ticket.objects.get(id = ticket_id)
    ticket.is_active = False
    ticket.save()
    return Response({"msg": "Ticket removed", "ticket_id": ticket_id}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def get_my_tickets(request):
    pass
    
