import logging
from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.permission import role_required
from ..models import Airline, Customer, Flight, RolesEnum, Ticket
from ..serializer import AirlineSerializer, CustomerSerializer, FlightSerializer
from base import decorators


logger = logging.getLogger('report_actions')
# logging.basicConfig(filename="../logs.log",
#                     level=logging.DEBUG,
#                     format='%(asctime)s - %(levelname)s - %(message)s',
#                     filemode='a')
# logger = logging.getLogger()
# logger.setLevel(logging.DEBUG)

@api_view(['POST'])
# @role_required(RolesEnum.CUSTOMER.value)
@decorators.conditions_for_booking_a_flight()
def add_ticket(request):
    flight_id = request.data.get('flight_id')
    # flight = get_my_tickets(Flight, id = flight_id)
    flight = get_object_or_404(Flight, id = flight_id)
    if not flight.is_active:
        return Response({"msg": "Chosen flight is not active"})
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
        status=status.HTTP_200_OK)
        


@api_view(['PUT'])
@decorators.conditions_for_cancel_a_ticket()
def remove_ticket(request, id):
    ticket = Ticket.objects.get(id = id)
    ticket.is_active = False
    flight = Flight.objects.get(id = ticket.flight_id_id)
    flight.remaining_tickets += 1
    flight.save()
    ticket.save()
    return Response({"msg": "Ticket removed", "ticket_id": id, "remaining_tickets" : flight.remaining_tickets}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_customer(request, id):
    customer = get_object_or_404(Customer, id = id)
    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view([('GET')])
def get_my_tickets(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_tickets_by_customer_id(%s)", [id])
            results = cursor.fetchall()
            if results:
                my_tickets = []
                for result in results:
                    ticket_details = {
                        "Ticket-ID": result[0],
                        "Flight-ID": result[1],
                        "From:": result[2],
                        "To": result[3],
                        "Leaves in:":result[4],
                         }
                    my_tickets.append(ticket_details)
                return Response({"My Tickets:":my_tickets})
            else:
                return Response({"status": "error", "message": "No customer found for the given ID."}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
