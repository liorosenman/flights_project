from base.models import AirportUser
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

class UpdateEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportUser
        fields = ['email']

class CreateAirportUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportUser
        fields = ['username', 'password', 'email', 'role_name']

    def validate_email(self, value):
        if '@' not in value:
            raise serializers.ValidationError("Email must include an '@' symbol.")
        return value
    
    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return valid

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)