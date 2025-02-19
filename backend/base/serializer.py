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
        'password': {'write_only': True},  # Hide password in responses
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = AirportUser.objects.create(**validated_data)
        user.set_password(password) # Hash the password
        user.save()
        return user
        
    # @action(detail=False, methods=['POST'])
    # def create(self, validated_data):
    #     validated_data['password'] = make_password(validated_data['password'])
    #     return super().create(validated_data)

    def validate_email(self, value):
        if '@' not in value:
            raise serializers.ValidationError("Email must include an '@' symbol.")
        return value
    
    # def is_valid(self, raise_exception=False):
    #     valid = super().is_valid(raise_exception=raise_exception)
    #     return valid


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

    # @action(detail=False, methods=['POST'])
    # def create(self, validated_data):
    #     airport_user_data = validated_data.pop('airport_user')
    #     airport_user = AirportUser.objects.create(**airport_user_data)
    #     admin = Admin.objects.create(airport_user=airport_user, **validated_data)
    #     return admin

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        
    def create(self, validated_data):
        airport_user_data = validated_data.pop('airport_user')
        airport_user = AirportUserSerializer.create(AirportUserSerializer(), validated_data=airport_user_data) # use nested serializer create method
        customer = Customer.objects.create(airport_user=airport_user, **validated_data)
        return customer

class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    departure_time = serializers.DateTimeField(format="%d-%m-%Y %H:%M", input_formats=["%d-%m-%Y %H:%M"])
    landing_time = serializers.DateTimeField(format="%d-%m-%Y %H:%M", input_formats=["%d-%m-%Y %H:%M"])
    
    class Meta:
        model = Flight
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


    




