# Generated by Django 5.0.7 on 2024-11-24 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_alter_airportuser_role_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='airportuser',
            name='is_staff',
        ),
        migrations.AlterField(
            model_name='airportuser',
            name='is_superuser',
            field=models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status'),
        ),
        migrations.AlterField(
            model_name='airportuser',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
    ]
