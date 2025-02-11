from datetime import datetime, timezone
import logging
from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.permission import role_required
from ..models import Airline, Flight, RolesEnum, Ticket
from ..serializer import AirlineSerializer, FlightSerializer
from django.utils.timezone import now, make_aware

logging.basicConfig(filename="./logs.log",
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    filemode='a')


@api_view(['POST'])
@role_required(RolesEnum.AIRLINE.value)
def add_flight(request):
    # Get the logged-in user's airline company
    try:
        airline_company = Airline.objects.get(airport_user_id=request.user.id)
        print("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    except Airline.DoesNotExist:
        return Response({'error': 'Airline company not found for the user'}, status=status.HTTP_404_NOT_FOUND)

    # Add the airline company ID to the request data
    flight_data = request.data.copy()
    flight_data['airline_company_id'] = airline_company.id

    # Serialize and save the flight
    serializer = FlightSerializer(data=flight_data)
    if serializer.is_valid():
        flight = serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# @role_required(RolesEnum.AIRLINE.value)
# def add_flight(request):
#      serializer = FlightSerializer(data=request.data)
#      if serializer.is_valid():
#         flight = serializer.save() 
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
@role_required(RolesEnum.AIRLINE.value)
def update_flight(request, id):
    flight = get_object_or_404(Flight, id = id)
    if not flight.is_active:
        return Response({"msg":"This flight is inactive"})
    new_dep_time_str = request.data.get('new_dep_time')
    new_dep_time = datetime.fromisoformat(new_dep_time_str)
    try:
        new_dep_time = datetime.fromisoformat(new_dep_time_str)
    except ValueError:
        return Response({"msg": "Invalid datetime format for 'new_dep_time'"}, status=400)
    new_dep_time = make_aware(new_dep_time)
    current_time = now()
    if current_time > new_dep_time:
        return Response({"msg":"The new departure time set to the past"})
    old_dep_time = flight.departure_time
    old_land_time = flight.landing_time
    time_delta = new_dep_time - old_dep_time
    new_land_time = old_land_time + time_delta
    flight.departure_time = new_dep_time
    flight.landing_time = new_land_time
    flight.save()
    return Response({"msg":"The flight has been updated"})

@api_view([('PUT')])
@role_required(RolesEnum.AIRLINE.value)
def remove_flight(request, id):
   flight = get_object_or_404(Flight, id = id)
   if not flight.is_active:
      return Response({"msg":"This flight is already inactive"})
   active_tickets = Ticket.objects.filter(flight_id = id, is_active = True)
   if active_tickets: # If there are active ticket in this to-be-deleted flight.
      return Response({"msg":"There are active tickets in this flight"})
   flight.is_active = False
   flight.save()
   return Response({"msg":"Flight removed successfully"})

from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
@role_required(RolesEnum.AIRLINE.value)
def get_my_flights(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_flights_by_airline_id(%s)", [id])
            columns = [col[0] for col in cursor.description]  # Extract column names
            flights = [dict(zip(columns, row)) for row in cursor.fetchall()]  # Create list of dicts

        if not flights:
            return Response({"status": "error", "message": "No airline found for the given ID."}, status=404)

        return Response({"my_flights": flights})

    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)

# @api_view([('GET')])
# def get_my_flights(request, id):
#     try:
#         with connection.cursor() as cursor:
#             cursor.execute("SELECT * FROM get_flights_by_airline_id(%s)", [id])
#             results = cursor.fetchall()
#             if results:
#                 columns = [col[0] for col in cursor.description]
#                 flights = []
#                 for result in results:
#                     flight_details = dict(zip(columns, result))

#                         # "Airline": result[0],
#                         # "Origin": result[1],
#                         # "Destination": result[2],
#                         # "Take-Off": result[3],
#                         # "Landing":result[4],
#                         # "Tickets left:":result[5] }
#                     flights.append(flight_details)
#                 return Response({"My flights:": flights})
#             else:
#                 return Response({"status": "error", "message": "No airline found for the given username."}, status=404)
#     except Exception as e:
#         return Response({"status": "error", "message": str(e)}, status=400)
    




