# Generated by Django 5.0.7 on 2024-11-22 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_alter_userrole_role_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrole',
            name='role_name',
            field=models.CharField(choices=[('administrator', 'administrator'), ('customer', 'customer'), ('airline', 'airline')], max_length=20, unique=True),
        ),
    ]
