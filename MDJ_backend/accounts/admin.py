from django.contrib import admin

from .models import CustomUser, Avis, InformationsGenerales
# Register your models here.
admin.site.register([CustomUser,Avis,InformationsGenerales])

