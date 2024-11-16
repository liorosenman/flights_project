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

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)