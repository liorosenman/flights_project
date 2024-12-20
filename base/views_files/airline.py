from datetime import datetime, timezone
from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Airline, Flight, Ticket
from ..serializer import AirlineSerializer, FlightSerializer
from django.utils.timezone import now, make_aware

@api_view(['POST'])
def add_flight(request):
     serializer = FlightSerializer(data=request.data)
     if serializer.is_valid():
        flight = serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
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

@api_view([('GET')])
def get_my_flights(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_flights_by_airline_id(%s)", [id])
            results = cursor.fetchall()
            if results:
                my_flights = []
                for result in results:
                    flight_details = {
                        "Airline": result[0],
                        "Origin": result[1],
                        "Destination": result[2],
                        "Take-Off": result[3],
                        "Landing":result[4],
                        "Tickets left:":result[5] }
                    my_flights.append(flight_details)
                return Response({"My flights:":my_flights})
            else:
                return Response({"status": "error", "message": "No airline found for the given username."}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    




