# Generated by Django 5.0.7 on 2024-11-22 15:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_customer_airport_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airportuser',
            name='role_name',
            field=models.OneToOneField(default='customer', on_delete=django.db.models.deletion.CASCADE, to='base.userrole', to_field='role_name'),
        ),
    ]
