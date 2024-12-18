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
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', views.logout_user, name='logout'),
    path('create_country/', country.create_country),
    path('get_all_countries/', views.get_all_countries),
    path('get_country_by_id/<int:id>/', views.get_country_by_id),
    path('get_all_airlines/', views.get_all_airlines),
    path('get_airline_by_id/<int:id>/', views.get_airline_by_id),
    path('create_flight/', airline.add_flight),
    path('get_airline_by_username/<str:username>/', views.get_airline_by_username, name='get_airline_by_username'),
    path('create_ticket/', customer.add_ticket),
    path('remove_ticket/<int:id>/', customer.remove_ticket),
    path('get_my_tickets/', customer.get_my_tickets),
    path('get_customer_by_username/<str:username>/', views.get_customer_by_username),
    path('remove_airline/<int:id>/', views.remove_airline),
    path('remove_customer/<int:id>/', views.remove_customer),
    path('remove_admin/<int:id>/', views.remove_admin),
    path('update_customer/<int:id>/', customer.update_customer)

    
    # path('change_allrolenames_to_two/', views.change_rolename_to_admin),
    # path('create_countries/', views.)
    # path('create_prime_user/', views.admin_register),
    # path('create_constant_user_roles/', views.create_all_user_roles),
    # path('create_prime_admin/', views.create_prime_admin),
    # path('change_role_to_num/', views.change_role_to_num)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
