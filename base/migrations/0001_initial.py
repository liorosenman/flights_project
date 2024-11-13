# Generated by Django 5.1.1 on 2024-11-13 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('role_name', models.CharField(choices=[('administrator', 'administrator'), ('customer', 'customer'), ('airline', 'airline')], max_length=20, unique=True)),
            ],
        ),
    ]
