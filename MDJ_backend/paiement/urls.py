from paiement.views import WaveWebhookView, InitiateWavePaymentView, CheckPaymentStatusView
from django.urls import path

urlpatterns = [
    path('api/wave/webhook/', WaveWebhookView.as_view(), name='wave-webhook'),
    path('api/wave/check_status/<int:order_id>/', CheckPaymentStatusView.as_view(), name='check_payment_status'),
    path('api/wave/initiate/', InitiateWavePaymentView.as_view(), name='initiate-wave-paiement'),
]