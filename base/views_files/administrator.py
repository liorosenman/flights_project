from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
# from base.decorators import role_required
from base.models import Admin, Airline, AirportUser, Country, Customer, Flight, RolesEnum, Ticket, UserRole
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from base.serializer import CustomerSerializer
from ..permission import role_required

@api_view(['POST'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def admin_register(request): #Create a new admin
    try:
        role = UserRole.objects.get(id=1)
    except ObjectDoesNotExist:
        return Response({"error": "Admin role does not exist."}, status=status.HTTP_400_BAD_REQUEST)
    airport_user = AirportUser.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
            email=request.data['email'],
            role_name= role
        )
    airport_user.save()
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    admin = Admin.objects.create(first_name=first_name, last_name=last_name, airport_user=airport_user)
    admin.save()
    return Response({"message": "Admin registered successfully."}, status=status.HTTP_201_CREATED)

@api_view(['POST']) #Create a new airline
@role_required(RolesEnum.ADMINISTRATOR.value)
def airline_register(request):
    customer_role = UserRole.objects.get(id=3)
    airport_user = AirportUser.objects.create(
        username=request.data['username'],
        password=make_password(request.data['password']),
        email=request.data['email'],
        role_name= customer_role
        )
    airport_user.save()
    country = Country.objects.get(id = request.data['country_id'])
    name = request.data['name']
    airline = Airline.objects.create(name = name, country_id=country, airport_user = airport_user)
    airline.save()
    return Response({"message": "Airline registered successfully."}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def get_user_by_username(request, username):
    try:
        with connection.cursor() as cursor:
             cursor.execute("SELECT * FROM get_user_by_username(%s)", [username])
             result = cursor.fetchone()
             if result:
                columns = [col[0] for col in cursor.description]
                user = dict(zip(columns,result))
                return Response({"The user is:":user}, status=200)
             else:
                return Response({"status": "error", "message": "No user found"}, status=404)
    except Exception as e:
         return Response({"status": "error", "message": str(e)}, status=400)
    
@api_view(['GET'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def get_all_customers():
        customers = Customer.objects.all()
        if not customers.exists():
            return Response({"message": "There are no customers"}, status=status.HTTP_200_OK)
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def get_customer_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_customer_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                customer_details = dict(zip(columns,result))
                return Response({"status": "success", "data": customer_details}, status=200)
            else:
                return Response({"status": "error", "message": "No customer found for the given username."}, status=404)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
    
@api_view(['PUT'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def remove_airline(request, id):
    airline = get_object_or_404(Airline, id = id)
    airport_user = AirportUser.objects.get(id = airline.airport_user_id)
    if not airport_user.is_active:
        return Response({"msg":"This airline is already inactive"})
    active_flights = Flight.objects.filter(airline_company_id = id, is_active=True)
    for flight in active_flights:
        ticket = Ticket.objects.filter(flight_id = flight.id, is_active = True)
        if ticket:
            return Response({"msg":"There is a passenger in one of the airline's flights"})
    # airline.is_active = False
    # airline.save()
    return Response({"msg":"Airline deactivated"})

@api_view(['PUT'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def remove_customer(request, id):
    customer = get_object_or_404(Customer, id = id)
    airport_user = AirportUser.objects.get(id = customer.airport_user_id)
    if not airport_user.is_active:
        return Response({"msg":"This customer is already inactive"})
    active_customer_tickets = Ticket.objects.filter(customer_id = id, is_active = True)
    for ticket in active_customer_tickets:
        flight_id = ticket.flight_id
        flight = Flight.objects.get(id = flight_id, is_active = True)
        if flight:
            return Response({"msg":"The customer has future flights"})
    return Response({"msg":"The customer is deactivated"})

@api_view(['PUT'])
@role_required(RolesEnum.ADMINISTRATOR.value)
def remove_admin(request, id):
    if (id == 1):
        return Response({"msg":"Prime admin must not be removed!"})
    admin = get_object_or_404(Admin, id = id)
    airport_user = AirportUser.objects.get(id = admin.airport_user_id)
    if not admin.is_active:
        return Response({"msg":"This admin is already inactive"})
    return Response({"msg":"The admin is deactivated"})
    

