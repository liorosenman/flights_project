# Generated by Django 5.1.3 on 2024-11-28 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0020_alter_flight_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flight',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
