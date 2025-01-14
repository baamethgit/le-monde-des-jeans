from django.utils import timezone
from os import environ

from django.shortcuts import render
from rest_framework.response import Response

from paiement.models import WaveCheckoutSession
from shop.models import Commande
import environ

env = environ.Env()
environ.Env.read_env()

WAVE_API_KEY = env("WAVE_API_KEY")
FRONTEND_URL = env("FRONTEND_URL")

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
        try:
            order = Commande.objects.get(id=request.data['order_id'])
        except:
            return Response({"error": "Commande inexistante"}, status=status.HTTP_400_BAD_REQUEST)

        checkout_data = {
            'amount': str(order.montant),
            'currency': 'XOF',  # Ou votre devise
            'client_reference': str(order.ref_code),
            #'success_url': f'{FRONTEND_URL}/payment-success/{order.id}',
            'success_url': 'https://www.google.sn/',
            #'error_url': f'{FRONTEND_URL}/payment-error/{order.id}'
            'error_url': 'https://www.awwwards.com/awwwards/collections/404-error-page/'
        }

        # Dans ta vue
        """logger.debug(f"Headers envoyés : {headers}")
        logger.debug(f"URL appelée : {url}")
        logger.debug(f"Réponse : {response.text}")
"""
        headers = {
            'Authorization': f'Bearer {WAVE_API_KEY}',
            'Content-Type': 'application/json'
        }

        response = requests.post(
            'https://api.wave.com/v1/checkout/sessions',
            json=checkout_data,
            headers=headers
        )

        existing_session = WaveCheckoutSession.objects.filter(
            order=order,
            status='pending'
        ).first()

        if existing_session:
            if (timezone.now - existing_session.created_at).total_seconds() < 3600:
                return Response({'wave_launch_url': existing_session.wave_launch_url})
            else:
                existing_session.status = 'expired'
                existing_session.save()

        WaveCheckoutSession.objects.filter(
            order=order,
            status='pending'
        ).update(status='expired')

        session = WaveCheckoutSession.objects.create(
            order=order,
            session_id=response.json()['id'],
            wave_launch_url=response.json()['wave_launch_url']
        )

        return Response({'wave_launch_url': session.wave_launch_url})

"""
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
"""


from rest_framework import status
from django.db import transaction
import logging

logger = logging.getLogger(__name__)


class WaveWebhookView(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            event = request.data
            logger.info(f'Received Wave webhook: {event["type"]}')

            if event['type'] == 'checkout.session.completed':
                try:
                    session = WaveCheckoutSession.objects.select_for_update().get(
                        session_id=event['data']['id']
                    )
                except WaveCheckoutSession.DoesNotExist:
                    logger.error(f'Session not found: {event["data"]["id"]}')
                    return Response(
                        {'error': 'Session not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )


                if session.status == 'completed':
                    return Response({'status': 'Already processed'})

                payment_status = event['data']['payment_status']

                if payment_status == 'succeeded':
                    session.status = 'completed'
                    session.save()

                    order = session.order
                    order.marquer_comme_payee()
                    order.save()

                elif payment_status == 'failed':
                    session.status = 'failed'
                    session.save()

                return Response({'status': 'success'})

            else:
                logger.warning(f'Unhandled event type: {event["type"]}')
                return Response({'status': 'Ignored event type'})

        except Exception as e:
            logger.error(f'Error processing webhook: {str(e)}')
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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