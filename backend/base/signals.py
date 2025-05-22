import enum
import os
from django.apps import apps
from django.db import connection, models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from datetime import datetime
from django.contrib.auth.models import BaseUserManager
from django.dispatch import receiver
from django.db.models.signals import post_migrate
from django.utils.timezone import now
from .models import Country, Roles, RolesEnum, UserRole
from myproj import settings
from django.contrib.auth.hashers import make_password


@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    if sender.name != "base":
        return

    if not all_required_tables_exist("base"):
        return
    
    if sender.name == "base":
        if not UserRole.objects.exists(): 
            for role in RolesEnum:
                UserRole.objects.get_or_create(role_name=role.value)
            print("Default roles created.")


@receiver(post_migrate)
def create_default_countries(sender, **kwargs):
    if sender.name != "base":
        return

    if not all_required_tables_exist("base"):
        return
    
    if sender.name == "base":
        if not Country.objects.exists():
            images_path = os.path.join(settings.MEDIA_ROOT, 'country_images')
            
            if os.path.exists(images_path):
                for filename in os.listdir(images_path):
                    name, ext = os.path.splitext(filename)
                    if ext.lower() in ['.jpg', '.jpeg', '.png', '.gif']:
                        Country.objects.get_or_create(
                            name=name,
                            defaults={'image': f'country_images/{filename}'}
                        )
                print("✅ Default countries created from images.")
            else:
                print(f"⚠️ Directory {images_path} does not exist.")


    
    from .models import Admin, AirportUser
    if Admin.objects.exists():
        return 
    user_role = UserRole.objects.get(id = Roles.ADMINISTRATOR.value)
    if not AirportUser.objects.filter(username='padmin').exists():
        airport_user = AirportUser.objects.create(
            username='padmin',
            email='padmin@admin.com',
            password=make_password('prime123'),
            is_staff=True,
            is_superuser=True,
            is_active=True,
            role_name = user_role
        )
        Admin.objects.create(
            first_name='primea',
            last_name='padmin',
            airport_user=airport_user
        )

def all_required_tables_exist(app_label):
    expected_tables = {
        model._meta.db_table
        for model in apps.get_app_config(app_label).get_models()
    }
    existing_tables = set(connection.introspection.table_names())
    return expected_tables.issubset(existing_tables)