from paiement.views import WaveWebhookView, InitiateWavePaymentView
from django.urls import path

urlpatterns = [
    path('api/wave/webhook/', WaveWebhookView.as_view(), name='wave-webhook'),
    path('api/wave/initiate/', InitiateWavePaymentView.as_view(), name='initiate-wave-paiement'),
]