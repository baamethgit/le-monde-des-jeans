from django.shortcuts import render
from rest_framework.response import Response

from paiement.models import WaveCheckoutSession
from shop.models import Commande

WAVE_API_KEY = ""
FRONTEND_URL = "localhost:4200"
# Create your views here.
"""
@api_view(['POST'])
def creer_paiement(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)
    paiement = Paiement.objects.create()
    serializer = PaiementSerializer(paiement)
    commande_existante = Commande.objects.filter(client=user, statut='EN_ATTENTE').first()
    commande_existante.statut = 'EN_PREPARATION'
    return Response(serializer.data, status=status.HTTP_201_CREATED)
"""

from rest_framework.views import APIView
import requests


class InitiateWavePaymentView(APIView):
    def post(self, request):
        order = Commande.objects.get(id=request.data['order_id'])

        checkout_data = {
            'amount': order.total_amount,
            'currency': 'XOF',  # Ou votre devise
            'client_reference': str(order.ref_code),
            'success_url': f'{FRONTEND_URL}/payment-success/{order.id}',
            'error_url': f'{FRONTEND_URL}/payment-error/{order.id}'
        }

        response = requests.post(
            'https://api.wave.com/v1/checkout/sessions',
            json=checkout_data,
            headers={'Authorization': f'Bearer {WAVE_API_KEY}'}
        )

        session = WaveCheckoutSession.objects.create(
            order=order,
            session_id=response.json()['id'],
            wave_launch_url=response.json()['wave_launch_url']
        )

        return Response({'wave_launch_url': session.wave_launch_url})


class WaveWebhookView(APIView):
    def post(self, request):
        event = request.data

        if event['type'] == 'checkout.session.completed':
            session = WaveCheckoutSession.objects.get(
                session_id=event['data']['id']
            )

            if event['data']['payment_status'] == 'succeeded':
                session.status = 'completed'
                session.save()

                session.order.status = 'PAYEE'
                session.order.save()
            elif event['data']['payment_status'] == 'failed':
                session.status = 'failed'
                session.save()

        return Response({'status': 'success'})


class CheckPaymentStatusView(APIView):
    def get(self, request, order_id):
        session = WaveCheckoutSession.objects.get(order_id=order_id)

        if session.status != 'completed':
            response = requests.get(
                f'https://api.wave.com/v1/checkout/sessions/{session.session_id}',
                headers={'Authorization': f'Bearer {WAVE_API_KEY}'}
            )

            if response.json()['payment_status'] == 'succeeded':
                session.status = 'completed'
                session.save()

                session.order.status = 'PAYEE'
                session.order.save()

        return Response({'status': session.status})