# Generated by Django 5.0.7 on 2024-11-27 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0016_alter_flight_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flight',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]