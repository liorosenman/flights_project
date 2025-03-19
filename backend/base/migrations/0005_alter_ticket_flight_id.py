# Generated by Django 5.1.3 on 2025-03-19 10:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_remove_ticket_is_active_alter_ticket_customer_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='flight_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to='base.flight'),
        ),
    ]
