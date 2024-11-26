from base.models import Admin, AirportUser, Country, Customer
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

class UpdateEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportUser
        fields = ['email']

class AirportUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportUser
        fields = ['username', 'password', 'email', 'role_name']

    def create(self, data):
        if self.is_valid():
            user_role_id = data.role_name
        else:
            pass

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


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'image']

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['first_name', 'last_name']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['first_name', 'last_name', 'address', 'phone_no', 'credit_card_no', 'airport_user']

