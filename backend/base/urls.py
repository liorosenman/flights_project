from django.contrib import admin
from django.db import router
from django.urls import include, path
from base.views_files import airline, country, customer, administrator
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from base import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    # path('', views.index),
    path('admin/', admin.site.urls),
    path('create_new_admin/', administrator.admin_register),
    path('create_new_customer/', views.customer_register),
    path('create_new_airline/', administrator.airline_register),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', views.logout_user, name='logout'),
    path('create_country/', country.create_country),
    path('get_all_countries/', views.get_all_countries),
    path('get_country_by_id/<int:id>/', views.get_country_by_id),
    path('get_airline_by_id/<int:id>/', views.get_airline_by_id),
    path('create_flight/', airline.add_flight),
    path('get_airline_by_username/<str:username>/', views.get_airline_by_username, name='get_airline_by_username'),
    path('create_ticket/', customer.add_ticket),
    path('remove_ticket/<int:id>/', customer.remove_ticket),
    path('get_my_tickets/', customer.get_my_tickets),
    path('get_customer_by_username/<str:username>/', administrator.get_customer_by_username),
    path('remove_airline/<int:id>/', administrator.remove_airline),
    path('remove_customer/<int:id>/', administrator.remove_customer),
    path('remove_admin/<int:id>/', administrator.remove_admin),
    path('update_customer/', customer.update_customer),
    path('update_flight/<int:id>/', airline.update_flight),
    path('remove_flight/<int:id>/', airline.remove_flight),
    path('get_my_flights/', airline.get_my_flights),
    path('get_my_tickets/<int:id>/', customer.get_my_tickets),
    path('get_all_flights/', views.get_all_flights),
    path('get_flights_by_parameters/', views.get_flights_by_parameters),
    path('get_arrival_flights/<int:id>/', views.get_arrival_flights),
    path('get_departure_flights/<int:id>/', views.get_departure_flights),
    path('get_all_customers/', administrator.get_customers_details),
    path('get_flight_by_id/<int:id>/', views.get_flight_by_id),
    path('get_flights_by_airline_id/<int:id>/', views.get_flights_by_airline_id),
    path('get_all_admins/', administrator.get_admins_details),
    path('remove_admin/<int:id>/', administrator.remove_admin),
    path('get_all_airlines/', administrator.get_airlines_details),
    path('get_admin_by_username/<str:username>/', administrator.get_admin_by_username),
    path('get_airline_by_username/<str:username>/', administrator.get_airline_by_username),
    path('get_customer_by_user_id/', customer.get_customer_by_user_id)

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
