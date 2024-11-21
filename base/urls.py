from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('', views.index),
    path('create_new_admin/', views.admin_register),
    path('create_new_customer/', views.customer_register),
    path('login/', TokenObtainPairView.as_view()),
    path('logout/', views.logout_user, name='logout'),
    # path('create_countries/', views.)
    # path('create_prime_user/', views.admin_register),
    # path('create_constant_user_roles/', views.create_all_user_roles),
    # path('create_prime_admin/', views.create_prime_admin),
    # path('change_role_to_num/', views.change_role_to_num)
]
