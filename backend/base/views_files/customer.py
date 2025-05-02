import logging
from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.decorators import authorize_customer, customer_details_input_validation
from base.permission import role_required
from ..models import Airline, Customer, Flight, Roles, RolesEnum, Ticket
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
@role_required(Roles.CUSTOMER.value)
@decorators.update_flights_status()
@decorators.conditions_for_booking_a_flight()
def add_ticket(request):
    print("AAAAAAAAAAAAAAAAAAAAA")
    flight_id = request.data.get('flight_id')
    flight = get_object_or_404(Flight, id = flight_id)
    # if not flight.is_active:
    #     return Response({"msg": "Chosen flight is not active"})
    flight.remaining_tickets -= 1
    flight.save()
    customer = Customer.objects.get(airport_user_id = request.user.id)
    ticket = Ticket.objects.create(
            flight_id=flight,
            customer_id=customer,
            # is_active=True
    )
    return Response(
        {"message": "Ticket successfully created", "remaining_tickets": flight.remaining_tickets},
        status=status.HTTP_200_OK)


@api_view(['PUT'])
@role_required(Roles.CUSTOMER.value)
@decorators.update_flights_status()
@decorators.conditions_for_cancel_a_ticket()
def remove_ticket(request, id):
    # ticket = Ticket.objects.get(id = id)
    ticket = get_object_or_404(Ticket, id = id)
    ticket.status = 'canceled'
    flight = Flight.objects.get(id = ticket.flight_id_id)
    flight.remaining_tickets += 1
    flight.save()
    ticket.save()
    return Response({"message": "Ticket removed", "ticket_id": id, "remaining_tickets" : flight.remaining_tickets}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@role_required(Roles.CUSTOMER.value)
# @authorize_customer()
@customer_details_input_validation
def update_customer(request):
    the_customer_id = Customer.objects.get(airport_user=request.user).id
    customer = get_object_or_404(Customer, id = the_customer_id)
    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        # return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message":"The customer was updated successfully."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view([('GET')])
@role_required(Roles.CUSTOMER.value)
# @authorize_customer()
@decorators.update_flights_status()
def get_my_tickets(request):
    the_customer_id = Customer.objects.get(airport_user=request.user).id
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_tickets_by_customer_id(%s)", [the_customer_id])
            rows = cursor.fetchall()
            if not rows:
                  return Response(
                    {"message": "No tickets found for this customer."},
                    status=status.HTTP_404_NOT_FOUND
                )
            columns = [col[0] for col in cursor.description]
            my_tickets = [dict(zip(columns, row)) for row in rows]
            return Response(
                {"message": "Tickets retrieved successfully.", "tickets": my_tickets},
                status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response(
            {"message": "An error occurred while retrieving tickets.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
