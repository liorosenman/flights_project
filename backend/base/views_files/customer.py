import logging
from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.utils import convert_tickets_times_to_israel_timezone
from base.decorators import customer_details_input_validation, update_airport_user, user_details_input_validation
from base.permission import role_required
from ..models import Customer, Flight, Roles, Ticket
from ..serializer import CustomerSerializer
from base import decorators


logger = logging.getLogger('report_actions')


@api_view(['POST'])
@role_required(Roles.CUSTOMER.value)
@decorators.update_flights_status()
@decorators.conditions_for_booking_a_flight()
def add_ticket(request):
    flight_id = request.data.get('flight_id')
    flight = get_object_or_404(Flight, id = flight_id)
    flight.remaining_tickets -= 1
    flight.save()
    customer = Customer.objects.get(airport_user_id = request.user.id)
    ticket = Ticket.objects.create(
            flight_id=flight,
            customer_id=customer,
    )
    logger.info(f"The customer {request.user.username} successfully purchased a ticket to flight {flight_id}")
    return Response(
        {"message": "Ticket successfully created", "remaining_tickets": flight.remaining_tickets},
        status=status.HTTP_200_OK)


@api_view(['PUT'])
@role_required(Roles.CUSTOMER.value)
@decorators.update_flights_status()
@decorators.conditions_for_cancel_a_ticket()
def remove_ticket(request, id):
    ticket = get_object_or_404(Ticket, id = id)
    ticket.status = 'canceled'
    flight = Flight.objects.get(id = ticket.flight_id_id)
    flight.remaining_tickets += 1
    flight.save()
    ticket.save()
    logger.info(f"The customer {request.user.username} successfully canceled the ticket {ticket.id} to flight {flight.id}")
    return Response({"message": "Ticket removed", "ticket_id": id, "remaining_tickets" :
                      flight.remaining_tickets}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@role_required(Roles.CUSTOMER.value)
@user_details_input_validation
@customer_details_input_validation
@update_airport_user()
def update_customer(request):
    the_customer_id = Customer.objects.get(airport_user=request.user).id
    print(the_customer_id)
    customer = get_object_or_404(Customer, id = the_customer_id)
    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        logger.info(f"Customer {request.user.username} has successfully updated his personal details.")
        return Response({"message":"The customer was updated successfully."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view([('GET')])
@role_required(Roles.CUSTOMER.value)
@decorators.update_flights_status()
def get_my_tickets(request):
    logger.info(f"The customer {request.user.username} is requesting his bookings.")
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
            my_tickets = convert_tickets_times_to_israel_timezone(my_tickets)
            logger.info(f"The customer {request.user.username} has successfully fetched his bookings.")
            return Response(
                {"message": "Tickets retrieved successfully.", "tickets": my_tickets},
                status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response(
            {"message": "An error occurred while retrieving tickets.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@role_required(Roles.CUSTOMER.value)
def get_customer_by_user_id(request):
    # logger.info(f"The details of the customer {username} were requested.")
    try:
        target_id = request.user.id
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_customer_data_by_user_id(%s)", [target_id])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                customer_details = dict(zip(columns,result))
                return Response({
                    "customer": customer_details
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                "message": "No customer found for the given user ID."
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"An error occurred while retrieving the customer: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)