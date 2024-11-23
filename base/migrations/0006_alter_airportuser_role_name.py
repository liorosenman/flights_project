# Generated by Django 5.0.7 on 2024-11-22 15:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_airportuser_role_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='airportuser',
            name='role_name',
            field=models.ForeignKey(default='customer', on_delete=django.db.models.deletion.PROTECT, to='base.userrole', to_field='role_name'),
        ),
    ]
