from django.contrib import admin
from .models import CustomUser,CodeOTP
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(CodeOTP)