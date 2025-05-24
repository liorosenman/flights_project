import pytz
from base.models import Admin, Airline, AirportUser, Country, Customer, Flight, Ticket
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.decorators import api_view, action

class UpdateEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportUser
        fields = ['email']

class AirportUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportUser
        fields = '__all__'
        extra_kwargs = {
        'password': {'write_only': True}, 
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = AirportUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
        

    def validate_email(self, value):
        if '@' not in value:
            raise serializers.ValidationError("Email must include an '@' symbol.")
        return value


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'


from rest_framework import serializers
from .models import Customer, AirportUser

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    departure_time = serializers.DateTimeField(
        format="%d-%m-%Y %H:%M",
        input_formats=["%d-%m-%Y %H:%M", "%Y-%m-%dT%H:%M"],
        # default_timezone=pytz.timezone("Asia/Jerusalem")
    )
    landing_time = serializers.DateTimeField(
        format="%d-%m-%Y %H:%M",
        input_formats=["%d-%m-%Y %H:%M", "%Y-%m-%dT%H:%M"],
        # default_timezone=pytz.timezone("Asia/Jerusalem")
    )
    
    class Meta:
        model = Flight
        fields = '__all__'
    
    def to_representation(self, instance):
        """Convert UTC times to Israel timezone when sending to client"""
        representation = super().to_representation(instance)
        
        israel_tz = pytz.timezone("Asia/Jerusalem")
        
        # Convert departure_time to Israel timezone
        if instance.departure_time:
            representation['departure_time'] = instance.departure_time.astimezone(israel_tz).strftime("%d-%m-%Y %H:%M")
            
        # Convert landing_time to Israel timezone
        if instance.landing_time:
            representation['landing_time'] = instance.landing_time.astimezone(israel_tz).strftime("%d-%m-%Y %H:%M")
            
        return representation
        
    def create(self, validated_data):
        """Ensure timezone info is preserved when creating instances"""
        return super().create(validated_data)
        
    def update(self, instance, validated_data):
        """Ensure timezone info is preserved when updating instances"""
        return super().update(instance, validated_data)


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


    




