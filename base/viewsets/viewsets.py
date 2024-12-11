from django.http import JsonResponse
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

    def create(self, request, *args, **kwargs):
        airport_user_data = request.data.get('airport_user')
        if not airport_user_data:
            return JsonResponse({"error": "Airport user data is required."}, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = AirportUserSerializer(data=airport_user_data)
        if not user_serializer.is_valid():
            return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        airport_user = user_serializer.save()
        request.data['airport_user'] = airport_user.id
        customer_serializer = self.get_serializer(data=request.data)
        if not customer_serializer.is_valid():
            airport_user.delete()
            return JsonResponse(customer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        customer = customer_serializer.save()
        return JsonResponse(customer_serializer.data, status=status.HTTP_201_CREATED)
     

class AirportUserViewSet(viewsets.ModelViewSet):
    queryset = AirportUser.objects.all()
    serializer_class = AirportUserSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

    def create(self, request, *args, **kwargs):
        user_serializer = AirportUserSerializer(data=request.data.get('airport_user'))
        if not user_serializer.is_valid():
             return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        airport_user = user_serializer.save()
        admin_data = request.data.get('admin', {})
        admin = Admin.objects.create(airport_user=airport_user, **admin_data)
        admin_serializer = AdminSerializer(admin)
        return Response(admin_serializer.data, status=status.HTTP_201_CREATED)


        





