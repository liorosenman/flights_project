import enum
import os
from django.apps import apps
from django.db import connection, models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from datetime import datetime
from django.contrib.auth.models import BaseUserManager
from django.dispatch import receiver
from django.db.models.signals import post_migrate
from django.utils.timezone import now
from myproj import settings
from django.contrib.auth.hashers import make_password

class AirportUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field must be set")
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("last_login", now().isoformat())
        extra_fields.setdefault("date_joined", now().isoformat())
        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(username, password, **extra_fields)

class Roles(enum.Enum):
    ADMINISTRATOR = 1
    CUSTOMER = 2
    AIRLINE = 3

class RolesEnum(enum.Enum):
     ADMINISTRATOR = "administrator"
     CUSTOMER = "customer"
     AIRLINE = "airline"

USER_ROLE_CHOICES = [
    (RolesEnum.ADMINISTRATOR, 'administrator'),
    (RolesEnum.CUSTOMER, 'customer'),
    (RolesEnum.AIRLINE, 'airline'),
]

class FlightStatus(enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    TOOKOFF = "tookoff"
    LANDED = "landed"


FLIGHT_STATUS_CHOICES = [
    ('active', 'active'),      
    ('canceled', 'canceled'),  
    ('tookoff', 'tookoff'),  
    ('landed', 'landed')       
]

class UserRole(models.Model):
    id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, unique=True)

# class AirportUser(AbstractBaseUser):
class AirportUser(AbstractUser):
    role_name = models.ForeignKey(UserRole, on_delete=models.CASCADE)
   
    objects = AirportUserManager()
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        """Return True if user has a specific permission (for Django admin)."""
        return self.is_superuser

    
class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    phone_no = models.PositiveIntegerField()
    credit_card_no = models.BigIntegerField()
    airport_user = models.OneToOneField('AirportUser', on_delete=models.CASCADE, related_name='customers')


    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Admin(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    airport_user = models.OneToOneField('AirportUser', on_delete=models.CASCADE)
    
    def __str__(self):
        return f'I am admin {self.first_name} {self.last_name}'
    
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='country_images/')

    def __str__(self):
        return self.name


class Airline(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    country_id = models.ForeignKey('Country', on_delete=models.CASCADE, related_name='airlines')
    airport_user = models.OneToOneField('AirportUser', on_delete=models.CASCADE, related_name='airlines', default=2)
    # The 'default=2' should be removed.
    def __str__(self):
        return self.name
    

class Flight(models.Model):
    id = models.BigAutoField(primary_key=True)
    airline_company_id = models.ForeignKey('Airline', on_delete=models.CASCADE, related_name='flights')
    origin_country_id = models.ForeignKey('Country', on_delete=models.CASCADE, related_name='origin_flights')
    destination_country_id = models.ForeignKey('Country', on_delete=models.CASCADE, related_name='destination_flights')
    landing_time = models.DateTimeField()
    departure_time = models.DateTimeField()
    remaining_tickets = models.IntegerField()
    status = models.CharField(default=FlightStatus.ACTIVE.value, choices=FLIGHT_STATUS_CHOICES)


    def formatted_landing_time(self):
        return self.landing_time.strftime("%D-%m-%y %H:%M")

    def formatted_departure_time(self):
        return self.departure_time.strftime("%D-%m-%y %H:%M")
    
    def __str__(self):
        return f"Flight {self.id} - {self.airline_company_id}"
    
class Ticket(models.Model):
    id = models.BigAutoField(primary_key=True)
    flight_id = models.ForeignKey('Flight', on_delete=models.CASCADE, related_name='tickets')
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    status = models.CharField(default=FlightStatus.ACTIVE.value, choices=FLIGHT_STATUS_CHOICES)

    def __str__(self):
        return f"Ticket {self.id} for {self.customer.first_name} {self.customer.last_name} on Flight {self.flight.id}"









    

