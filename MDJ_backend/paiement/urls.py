from paiement.views import WaveWebhookView, InitiateWavePaymentView, CheckPaymentStatusView, PaymentFilterView, \
    PaymentSummaryView
from django.urls import path

urlpatterns = [
    path('api/wave/webhook/', WaveWebhookView.as_view(), name='wave-webhook'),
    path('api/wave/check_status/<int:order_id>/', CheckPaymentStatusView.as_view(), name='check_payment_status'),
    path('api/wave/initiate/', InitiateWavePaymentView.as_view(), name='initiate-wave-paiement'),
    path('api/wave/kpi/', PaymentFilterView.as_view(), name='admin_panel_paiement'),
    path('api/wave/payment_summary/', PaymentSummaryView.as_view(), name='paiement_summary'),
]