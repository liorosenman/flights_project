import enum
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from django.contrib.auth.models import BaseUserManager

class AirportUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field must be set")
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(username, email, password, **extra_fields)


class RolesEnum(enum.Enum):
     ADMINISTRATOR = "administrator"
     CUSTOMER = "customer"
     AIRLINE = "airline"

USER_ROLE_CHOICES = [
    (RolesEnum.ADMINISTRATOR.value, 'administrator'),
    (RolesEnum.CUSTOMER.value, 'customer'),
    (RolesEnum.AIRLINE.value, 'airline'),
]

class UserRole(models.Model):
    id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, unique=True)

class AirportUser(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(unique=True)
    role_name = models.ForeignKey(UserRole, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    # is_staff = models.BooleanField(default=False)
    # last_login = models.DateTimeField(null=True, blank=True)
    # is_superuser = models.BooleanField(default=False)

    objects = AirportUserManager()
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username
    
class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    phone_no = models.PositiveIntegerField(unique=True)
    credit_card_no = models.BigIntegerField(unique=True)
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
    country_id = models.OneToOneField('Country', on_delete=models.CASCADE, related_name='airlines')
    airport_user = models.OneToOneField('AirportUser', on_delete=models.CASCADE, related_name='airlines', default=2)

    def __str__(self):
        return self.name
    

class Flight(models.Model):
    id = models.BigAutoField(primary_key=True)
    airline_company_id = models.ForeignKey('Airline', on_delete=models.CASCADE, related_name='flights')
    origin_country_id = models.ForeignKey('Country', on_delete=models.CASCADE, related_name='origin_flights')
    destination_country_id = models.ForeignKey('Country', on_delete=models.CASCADE, related_name='destination_flights')
    departure_time = models.DateTimeField()
    landing_time = models.DateTimeField()
    remaining_tickets = models.IntegerField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Flight {self.id} - {self.airline_company_id}"
    
class Ticket(models.Model):
    id = models.BigAutoField(primary_key=True)
    flight_id = models.OneToOneField('Flight', on_delete=models.CASCADE, related_name='tickets')
    customer_id = models.OneToOneField('Customer', on_delete=models.CASCADE, related_name='tickets')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Ticket {self.id} for {self.customer.first_name} {self.customer.last_name} on Flight {self.flight.id}"


