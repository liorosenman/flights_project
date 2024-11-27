from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Airline
from ..serializer import AirlineSerializer, FlightSerializer

@api_view(['POST'])
def add_flight(request):
     serializer = FlightSerializer(data=request.data)
     if serializer.is_valid():
        flight = serializer.save() 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)