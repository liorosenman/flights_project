from datetime import datetime
import logging
from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..utils import convert_flight_times_to_israel_timezone
from base import decorators
from base.decorators import airline_flight_auth, authorize_airline, flight_details_input_validation
from base.permission import role_required
from ..models import Airline, Flight, Roles, Ticket
from ..serializer import FlightSerializer
from django.utils.timezone import now, make_aware, is_naive
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response

# logging.basicConfig(filename="./logs.log",
#                     format='%(asctime)s - %(levelname)s - %(message)s',
#                     filemode='a',
#                     level=logging.DEBUG)

logger = logging.getLogger('report_actions')

@api_view(['POST'])
@role_required(Roles.AIRLINE.value)
@flight_details_input_validation
def add_flight(request):
    logger.info(f"The airline {request.user.username} is requesting to create a flight.")
    try:
        airline_company = Airline.objects.get(airport_user_id=request.user.id)
        print(request.user.id)
    except Airline.DoesNotExist:
        return Response({'error': 'Airline company not found for the user'}, status=status.HTTP_404_NOT_FOUND)
    flight_data = request.data.copy()
    flight_data['airline_company_id'] = airline_company.id
    flight_data_as_list = convert_flight_times_to_israel_timezone([flight_data])[0]
    serializer = FlightSerializer(data=flight_data_as_list)
    if serializer.is_valid():
        flight = serializer.save() 
        logger.info(f"The airline {request.user.username} has successfully created the flight {flight.id}")
        logging.warning("Successful flight creation.")
        return Response({"message": "The flight was created successfully."}, status=status.HTTP_201_CREATED)   
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@role_required(Roles.AIRLINE.value)
@airline_flight_auth()
@decorators.update_flights_status()
def update_flight(request, id): # Setting a new departure_time and calculating the new landing_time.
    flight = get_object_or_404(Flight, id = id)
    logger.info(f"Airline {request.user.username} is requesting to update flight {id}")
    if not flight.status == 'active':
        return Response(
            {"message": "Only active flights can be updated."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    new_dep_time_str = request.data.get('new_dep_time')
    if not new_dep_time_str:
        return Response(
            {"message": "'new_dep_time' is required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        new_dep_time = datetime.fromisoformat(new_dep_time_str)
        if is_naive(new_dep_time):
            new_dep_time = make_aware(new_dep_time)
    except ValueError:
        return Response(
            {"message": "Invalid datetime format for 'new_dep_time'."},
            status=status.HTTP_400_BAD_REQUEST)

    current_time = now()
    if current_time > new_dep_time:
         return Response(
            {"message": "The new departure time must not be in the past."},
            status=status.HTTP_400_BAD_REQUEST
        )
    # Calculation of the flight's new landing time.
    old_dep_time = flight.departure_time
    old_land_time = flight.landing_time
    time_delta = new_dep_time - old_dep_time
    new_land_time = old_land_time + time_delta
    flight.departure_time = new_dep_time
    flight.landing_time = new_land_time
    flight.save()
    logger.info(f"Airline {request.user.username} has successfully updated the flight {id}")
    return Response(
        {"message": "The flight has been updated successfully."},
        status=status.HTTP_200_OK
    )

@api_view([('PUT')])
@role_required(Roles.AIRLINE.value)
@airline_flight_auth()
@decorators.update_flights_status()
def remove_flight(request, id): # Remove flight = deactivate manually a flight that is before takeoff, with no 'active' tickets.
   flight = get_object_or_404(Flight, id = id)
   logger.info(f"Airline {request.user.username} is requesting to remove the flight {id}")
   if not flight.status == 'active':
      return Response(
            {"error": "This flight cannot be deactivated because it is already inactive."},
            status=status.HTTP_400_BAD_REQUEST
        )
   active_tickets = Ticket.objects.filter(flight_id=id, status__in=['active', 'tookoff'])
   if active_tickets: # If there are active ticket in this to-be-deleted flight.
      return Response(
            {"error": "There are active or taken-off tickets associated with this flight."},
            status=status.HTTP_400_BAD_REQUEST
        )
   flight.status = 'canceled'
   flight.save()
   logger.info(f"Airline {request.user.username} has successfully canceled the flight {id}")
   return Response(
        {"message": "Flight has been successfully canceled."},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
@role_required(Roles.AIRLINE.value)
@decorators.update_flights_status()
def get_my_flights(request): # List of all flights of a specific airline.
    the_airline_id = Airline.objects.get(airport_user=request.user).id
    logger.info(f"Airline {request.user.username} is requesting to fetch the details of its flights.")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_flights_by_airline_id(%s)", [the_airline_id])
            columns = [col[0] for col in cursor.description]  # Extract column names
            flights = [dict(zip(columns, row)) for row in cursor.fetchall()]  # Create list of dicts
            flights = convert_flight_times_to_israel_timezone(flights)
        if not flights:
             return Response(
                    {"message": "No flights found for the given airline ID."},
                    status=status.HTTP_404_NOT_FOUND
                )
        logger.info(f"Airline {request.user.username} has successfully fetched its flights.")
        return Response(
                {"message": "Flights retrieved successfully.", "flights": flights},
                status=status.HTTP_200_OK
            )

    except Exception as e:
       return Response(
            {"error": "An error occurred while retrieving flights.", "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


    




