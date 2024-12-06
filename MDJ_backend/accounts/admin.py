from django.contrib import admin

from .models import CustomUser, Avis
# Register your models here.
admin.site.register([CustomUser,Avis])
from .models import CodeOTP,CodeOTPResetPassword
admin.site.register(CodeOTP)
admin.site.register(CodeOTPResetPassword)
