from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Country
from ..serializer import CountrySerializer

@api_view(['POST']) 
def create_country(request):
    serializer = CountrySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_countries(request):
    countries = Country.objects.all()
    serializer = CountrySerializer(countries, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_country_by_id(request, id):
    try:
        country = Country.objects.get(id=id)
    except Country.DoesNotExist:
        return Response({"error": "Country not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CountrySerializer(country)
    return Response(serializer.data)
