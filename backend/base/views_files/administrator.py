from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
# from base.decorators import role_required
from base.decorators import create_airport_user
from base.models import Admin, Airline, AirportUser, Country, Customer, Flight, Roles, RolesEnum, Ticket, UserRole
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from base.serializer import CustomerSerializer
from ..permission import role_required
from django.db.models import Q
from ..decorators import *
from base import decorators

#Create a new admin (user_role_num = 1)

@api_view(['POST']) 
# @role_required(Roles.ADMINISTRATOR.value)
@user_details_input_validation
@admin_details_input_validation
@create_airport_user(Roles.ADMINISTRATOR.value)
def admin_register(request): #Create a new admin
    username = request.data['username']
    airport_user = AirportUser.objects.get(username = username)
    first_name = request.data['first_name']
    last_name = request.data['last_name']
    admin = Admin.objects.create(first_name=first_name, last_name=last_name, airport_user=airport_user)
    admin.save()
    return Response({"message": "Admin registered successfully."}, status=status.HTTP_201_CREATED)


# Create a new airline (user_role_num = 2)
@api_view(['POST']) 
@role_required(Roles.ADMINISTRATOR.value)
@user_details_input_validation
@airline_details_input_validation
@create_airport_user(Roles.AIRLINE.value)
def airline_register(request):
    username = request.data['username']
    airport_user = AirportUser.objects.get(username = username)
    # airport_user = AirportUser.objects.last()
    country = Country.objects.get(id = request.data['country_id'])
    name = request.data['name']
    airline = Airline.objects.create(name = name, country_id=country, airport_user = airport_user)
    airline.save()
    return Response({"message": "Airline registered successfully."}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_user_by_username(request, username):
    try:
        with connection.cursor() as cursor:
             cursor.execute("SELECT * FROM get_user_by_username(%s)", [username])
             result = cursor.fetchone()
             if result:
                columns = [col[0] for col in cursor.description]
                user = dict(zip(columns,result))
                if 'is_active' in user:
                    user['is_active'] = 'active' if user['is_active'] else 'inactive'
                return Response({
                    "status": "success",
                    "message": "User retrieved successfully",
                    "user": user
                }, status=200)
             else:
                return Response({
                    "status": "error",
                    "message": "No user found"
                }, status=404)
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=400)
    
@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_all_customers(request):
        customers = Customer.objects.all()
        if not customers.exists():
            return Response({"message": "There are no customers"}, status=status.HTTP_200_OK)
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_customer_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_customer_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                customer_details = dict(zip(columns,result))
                return Response({
                    "status": "success",
                    "message": "Customer retrieved successfully.",
                    "data": customer_details
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                "status": "not_found",
                "message": "No customer found for the given username."
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"An error occurred while retrieving the customer: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@role_required(Roles.ADMINISTRATOR.value)
@decorators.update_flights_status()
def remove_airline(request, id):
    airline = get_object_or_404(Airline, id = id)
    airport_user = AirportUser.objects.get(id = airline.airport_user_id)
    if not airport_user.is_active:
        return Response({
            "status": "warning",
            "message": "This airline is already inactive."
        }, status=status.HTTP_200_OK)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_active_airline_tickets(%s)", [id])
            results = cursor.fetchall()
            if not results:
                # airline = Airline.objects.get(id=id)
                AirportUser.objects.filter(id = airline.airport_user_id).update(is_active = False)
                return Response({
                    "status": "success",
                    "message": "Airline was removed successfully."
                }, status=status.HTTP_200_OK)
            return Response({
                "status": "error",
                "message": "There are active tickets. Airline removal is forbidden."
            }, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"An unexpected error occurred: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@role_required(Roles.ADMINISTRATOR.value)
@decorators.update_flights_status()
def remove_customer(request, id):
    customer = get_object_or_404(Customer, id = id)
    airport_user = AirportUser.objects.get(id = customer.airport_user_id)
    if not airport_user.is_active:
        return Response({
            "status": "warning",
            "message": "This customer is already inactive."
        }, status=status.HTTP_200_OK)
    tickets = Ticket.objects.filter(customer_id_id = id, status__in=["active", "tookoff"])
    if not tickets.exists():
        airport_user.is_active = False
        airport_user.save()
        return Response({
            "status": "success",
            "message": "The customer was removed successfully."
        }, status=status.HTTP_200_OK)
    return Response({
        "status": "error",
        "message": "There are active tickets. Customer removal is forbidden."
    }, status=status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
@role_required(Roles.ADMINISTRATOR.value)
def remove_admin(request, id):
    if (id == 1):
          return Response({
            "status": "error",
            "message": "Prime admin must not be removed!"
        }, status=status.HTTP_403_FORBIDDEN)
    admin = get_object_or_404(Admin, id = id)
    airport_user = AirportUser.objects.get(id = admin.airport_user_id)
    if not admin.is_active:
          return Response({
            "status": "warning",
            "message": "This admin is already inactive."
        }, status=status.HTTP_200_OK)
    airport_user.is_active = False
    airport_user.save()
    return Response({
        "status": "success",
        "message": "The admin was deactivated successfully."
    }, status=status.HTTP_200_OK)
    

