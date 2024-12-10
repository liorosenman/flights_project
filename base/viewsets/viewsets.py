from requests import Response, request
from rest_framework import viewsets
from ..models import Admin, Airline, AirportUser, Country, Customer, Flight, Ticket
from ..serializer import AdminSerializer, AirlineSerializer, AirportUserSerializer, CountrySerializer, CustomerSerializer, FlightSerializer, TicketSerializer
from rest_framework.decorators import api_view, action
from rest_framework import status

class AirlineViewSet(viewsets.ModelViewSet):
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class AirportUserViewSet(viewsets.ModelViewSet):
    queryset = AirportUser.objects.all()
    serializer_class = AirportUserSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

    def create(self, request, *args, **kwargs):
        user_serializer = AirportUserSerializer(data=request.data.get('airport_user'))
        if user_serializer.is_valid():
            airport_user = user_serializer.save() 
        else:
            Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        admin_data = request.data.get('admin', {})
        admin = Admin.objects.create(airport_user=airport_user, **admin_data)
        admin_serializer = AdminSerializer(admin)
        return Response(admin_serializer.data, status=status.HTTP_201_CREATED)
        # admin = Admin.objects.create(airport_user=airport_user, data=request.data)
        # return admin
    



    # airport_user_data = validated_data.pop('airport_user')
        # airport_user = AirportUser.objects.create(**airport_user_data)
        # admin = Admin.objects.create(airport_user=airport_user, **validated_data)
        # return admin


        





