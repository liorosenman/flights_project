# Generated by Django 5.1.3 on 2024-12-08 10:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0022_auto_20241206_1841'),
    ]

    operations = [
        migrations.RunSQL(
            sql="DROP TABLE IF EXISTS base_ticket;",
            reverse_sql="CREATE TABLE base_ticket (...);"
        ),
    ]