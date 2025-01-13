from django.contrib import admin

from paiement.models import Payment, WaveCheckoutSession

# Register your models here.
admin.site.register(Payment)
admin.site.register(WaveCheckoutSession)