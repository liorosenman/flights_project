# Generated by Django 5.0.7 on 2024-11-22 10:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airportuser',
            name='role_name',
            field=models.ForeignKey(default='customer', on_delete=django.db.models.deletion.CASCADE, to='base.userrole', to_field='role_name'),
        ),
    ]