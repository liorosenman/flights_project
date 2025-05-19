from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.decorators import create_airport_user
from base.models import Admin, Airline, AirportUser, Country, Customer, Roles, Ticket
from rest_framework import status
from django.contrib.auth.hashers import make_password
from ..permission import authorize_admin_and_customer, role_required
from ..decorators import *
from base import decorators

#Create a new admin (user_role_num = 1)
@api_view(['POST']) 
@role_required(Roles.ADMINISTRATOR.value)
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
# @role_required(Roles.ADMINISTRATOR.value)
@user_details_input_validation
@airline_details_input_validation
@create_airport_user(Roles.AIRLINE.value)
def airline_register(request):
    username = request.data['username']
    airport_user = AirportUser.objects.get(username = username)
    country = Country.objects.get(id = request.data['country_id'])
    name = request.data['name']
    airline = Airline.objects.create(name = name, country_id=country, airport_user = airport_user)
    airline.save()
    return Response({"message": "Airline registered successfully."}, status=status.HTTP_201_CREATED)


    
@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_customers_details(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_customers_details()")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            customers = [dict(zip(columns, row)) for row in rows]
        return Response(customers, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Managing for admin, load details to update for customer.
@api_view(['GET'])
@authorize_admin_and_customer()
def get_customer_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_customer_data_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                customer_details = dict(zip(columns,result))
                return Response({
                    "customer": customer_details
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                "message": "No customer found for the given username."
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"An error occurred while retrieving the customer: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@role_required(Roles.ADMINISTRATOR.value)
@decorators.update_flights_status()
def remove_airline(request, id):
    airline = get_object_or_404(Airline, id = id)
    airport_user = AirportUser.objects.get(id = airline.airport_user_id)
    if not airport_user.is_active:
        return Response({
            "message": "This airline is already inactive."
        }, status=status.HTTP_200_OK)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_active_airline_tickets(%s)", [id])
            results = cursor.fetchall()
            if not results:
                # airline = Airline.objects.get(id=id)
                Flight.objects.filter(status = 'active').update(status = 'canceled')
                AirportUser.objects.filter(id = airline.airport_user_id).update(is_active = False)
                return Response({
                    "message": "Airline was removed successfully."
                }, status=status.HTTP_200_OK)
            return Response({
                "message": "There are active tickets. Airline removal is forbidden."
            }, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({
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
            "error": "This customer is already inactive."
        }, status=status.HTTP_400_BAD_REQUEST)
    tickets = Ticket.objects.filter(customer_id_id = id, status__in=["active", "tookoff"])
    if not tickets.exists():
        airport_user.is_active = False
        airport_user.save()
        return Response({
            "message": "The customer was removed successfully."
        }, status=status.HTTP_200_OK)
    return Response({
        "error": "There are active tickets. Customer removal is forbidden."
    }, status=status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
@role_required(Roles.ADMINISTRATOR.value)
def remove_admin(request, id):
    if (id == 1):
          return Response({
            "error": "Prime admin must not be removed!"
        }, status=status.HTTP_403_FORBIDDEN)
    admin = get_object_or_404(Admin, id = id)
    airport_user = AirportUser.objects.get(id = admin.airport_user_id)
    if not airport_user.is_active:
          return Response({
            "error": "This admin is already inactive."
        }, status = status.HTTP_400_BAD_REQUEST)
    airport_user.is_active = False
    airport_user.save()
    return Response({
        "message": "The admin was deactivated successfully."
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_admins_details(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_admins_details()")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            admins = [dict(zip(columns, row)) for row in rows]

        return Response(admins, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
# @role_required(Roles.ADMINISTRATOR.value)
def get_airlines_details(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_airlines_details()")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            airlines = [dict(zip(columns, row)) for row in rows]

        return Response(airlines, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_admin_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_admin_data_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                admin_details = dict(zip(columns,result))
                return Response({
                    "admin": admin_details
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                "message": "No admin found for the given username."
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"An error occurred while retrieving the admin: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@role_required(Roles.ADMINISTRATOR.value)
def get_airline_by_username(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_airline_data_by_username(%s)", [username])
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchone()
            if result:
                airline_details = dict(zip(columns,result))
                return Response({
                    "airline": airline_details
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                "message": "No airline found for the given username."
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"An error occurred while retrieving the airline: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)