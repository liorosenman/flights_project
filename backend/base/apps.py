import os
from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_migrate

# class BaseConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'base'

#     def ready(self):
#         from .models import Country

def create_countries(sender, **kwargs):
    from base.models import Country
    media_path = os.path.join(settings.MEDIA_ROOT, 'country_images')
    if not os.path.exists(media_path):
        return
    for file in os.listdir(media_path):
        file_path = os.path.join(media_path, file)
        if os.path.isfile(file_path) and file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            name = os.path.splitext(file)[0]
            image_path = f'country_images/{file}'
            if not Country.objects.filter(name=name).exists():
                Country.objects.create(name=name, image=image_path)


class YourAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'base'

    def ready(self):
        post_migrate.connect(create_countries, sender=self)