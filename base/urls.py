from django.contrib import admin
from django.urls import path
from base.views_files import country
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from base import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index),
    path('create_new_admin/', views.admin_register),
    path('create_new_customer/', views.customer_register),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', views.logout_user, name='logout'),
    path('create_country/', country.create_country),
    path('get_all_countries/', country.get_all_countries),
    path('get_country_by_id/<int:id>/', country.get_country_by_id),
    path('create_new_airline/', views.airline_register)
    
    # path('change_allrolenames_to_two/', views.change_rolename_to_admin),
    # path('create_countries/', views.)
    # path('create_prime_user/', views.admin_register),
    # path('create_constant_user_roles/', views.create_all_user_roles),
    # path('create_prime_admin/', views.create_prime_admin),
    # path('change_role_to_num/', views.change_role_to_num)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
