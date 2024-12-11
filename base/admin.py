from django.contrib import admin
from .models import Admin

@admin.register(Admin)
class YourModelAdmin(admin.ModelAdmin):
    pass






