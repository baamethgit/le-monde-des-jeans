from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q,Sum
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from loguru import logger
from paiement.models import WaveCheckoutSession, Payment
from paiement.serializers import PaiementSerializer
from shop.models import Commande
import environ

from shop.serializers import CommandeSerializer

env = environ.Env()
environ.Env.read_env()

WAVE_API_KEY = env("WAVE_API_KEY")
FRONTEND_URL = env("FRONTEND_URL")

from rest_framework.views import APIView
import requests


class InitiateWavePaymentView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        logger.info(f"initiate wave payment request for commande {request.data['order_id']} by {request.user}.")
        try:
            order = Commande.objects.get(id=request.data['order_id'])
            order.date_expiration = order.date_expiration + timedelta(minutes=2)
            order.save()
        except:
            logger.error(f"initiation de payment par {request.user} échoué : la commande nest pas trouvé.", exc_info=True)
            return Response({"error": "Commande inexistante"}, status=status.HTTP_400_BAD_REQUEST)
        success_url = f'{FRONTEND_URL}/payment-success/{order.ref_code}'
        error_url = f'{FRONTEND_URL}/payment-error/{order.ref_code}'
        checkout_data = {
            'amount': str(order.montant),
            'currency': 'XOF',
            'client_reference': str(order.ref_code),
            'success_url': success_url,
            'error_url':error_url
        }
        headers = {
            'Authorization': f'Bearer {WAVE_API_KEY}',
            'Content-Type': 'application/json'
        }

        response = requests.post(
            'https://api.wave.com/v1/checkout/sessions',
            json=checkout_data,
            headers=headers
        )

        if response.status_code != 200:
            logger.error(f"erreur lors du paiement par wave.Réponse de wave : {response.status_code}", exc_info=True)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        existing_session = WaveCheckoutSession.objects.filter(
            order=order,
            status='pending'
        ).order_by('-created_at').first()

        if existing_session:
            if timezone.now() < existing_session.created_at + timedelta(minutes=10):
                logger.info(f"utilisation d'une session wave existante pour paiement.User ({request.user})")
                #Payment.objects.filter(client=order.client, statut='pending').delete()
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
        logger.info(f"wave launch url send successfully to {request.user}")

        return Response({'wave_launch_url': session.wave_launch_url})


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
                    logger.error(f'Session not found: {event["data"]["id"]}', exc_info=True)
                    return Response(
                        {'error': 'Session not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )


                if session.status == 'completed':
                    logger.error(f"tentative de paiement pour une commande déja payée.", exc_info=True)
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
                logger.info(f"paiement réussi pour la commande {session.order.ref_code}")
                return Response({'status': 'success'})

            else:
                logger.warning(f'Unhandled event type: {event["type"]}')
                return Response({'status': 'Ignored event type'})

        except Exception as e:
            logger.error(f'Error processing webhook: {str(e)}', exc_info=True)
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CheckPaymentStatusView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, order_ref):
        try:
            logger.info(f"Vérification du statut de paiement pour la commande {order_ref}")

            # Récupération de la commande
            order = get_object_or_404(Commande, ref_code=order_ref)

            # Si la commande est déjà marquée comme payée, pas besoin de vérifier plus loin
            if order.statut == 'PAYEE':
                return Response({
                    'commande': CommandeSerializer(order).data,
                    'status': 'succeeded',
                    'message': 'Commande déjà payée'
                }, status=status.HTTP_200_OK)

            payment_status = 'failed'

            # Vérification de la session Wave
            try:
                session = WaveCheckoutSession.objects.get(
                    order_id=order.id
                )

                # Vérification du statut auprès de l'API Wave seulement si on a une session
                response = requests.get(
                    f'https://api.wave.com/v1/checkout/sessions/{session.session_id}',
                    headers={'Authorization': f'Bearer {WAVE_API_KEY}'}
                )

                if response.status_code == 200:
                    wave_data = response.json()
                    if wave_data['payment_status'] == 'succeeded':
                        payment_status = 'succeeded'
                        session.status = 'completed'
                        session.save()

                        order.marquer_comme_payee()
                        order.save()

            except WaveCheckoutSession.DoesNotExist:
                logger.info(f"checkPaymentStatus : Aucune session trouvée ,Commande {order_ref} non payé ")
                return Response({
                    'commande': CommandeSerializer(order).data,
                    'status': 'failed',
                    'message': ''
                }, status=status.HTTP_200_OK)

            logger.info(
                f"Vérification du statut de paiement pour la commande {order_ref} : résultat = {payment_status}")

            return Response({
                'commande': CommandeSerializer(order).data,
                'status': payment_status,
                'message': 'Vérification effectuée avec succès'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Erreur lors de la vérification du paiement: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Une erreur est survenue lors de la vérification'
            }, status=status.HTTP_400_BAD_REQUEST)

class PaymentFilterView(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)

    def get(self, request):
        # Récupérer les paramètres de requête
        methode_paiement = request.query_params.get('methode_paiement', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        min_amount = request.query_params.get('min_amount', None)

        # Filtrer les paiements
        filters = Q()
        #filters &= Q(statut='completed')
        if methode_paiement:
            filters &= Q(methode_paiement=methode_paiement)
        if start_date:
            filters &= Q(date_paiement__date__gte=start_date)
        if end_date:
            filters &= Q(date_paiement__date__lte=end_date)
        if min_amount:
            filters &= Q(montant__gte=min_amount)

        payments = Payment.objects.filter(filters)

        # Sérialisation des résultats
        serializer = PaiementSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PaymentSummaryView(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self, request):
        # Récupération des filtres de la requête
        methode_paiement = request.query_params.get('methode_paiement')  # 'WAVE', 'ORANGE_MONEY', 'CC'
        start_date = request.query_params.get('start_date')  # Format attendu : 'YYYY-MM-DD'
        end_date = request.query_params.get('end_date')  # Format attendu : 'YYYY-MM-DD'
        min_montant = request.query_params.get('min_montant')  # Montant minimal (float)

        # Filtrage des paiements
        filters = Q()
        filters &= Q(statut='completed')

        if methode_paiement:
            filters &= Q(methode_paiement=methode_paiement)
        if start_date:
            filters &= Q(date_paiement__gte=start_date)
        if end_date:
            filters &= Q(date_paiement__lte=end_date)
        if min_montant:
            filters &= Q(montant__gte=min_montant)

        # Application des filtres
        filtered_payments = Payment.objects.filter(filters)

        # Calcul des totaux
        total_paiement = filtered_payments.aggregate(total=Sum('montant'))['total'] or 0
        paiement_par_wave = filtered_payments.filter(methode_paiement='WAVE').aggregate(total=Sum('montant'))['total'] or 0
        paiement_par_om = filtered_payments.filter(methode_paiement='ORANGE_MONEY').aggregate(total=Sum('montant'))[
                              'total'] or 0
        paiement_par_cb = filtered_payments.filter(methode_paiement='CC').aggregate(total=Sum('montant'))['total'] or 0

        # Construction de la réponse
        response_data = {
            'total_paiement': total_paiement,
            'paiement_par_wave': paiement_par_wave,
            'paiement_par_om': paiement_par_om,
            'paiement_par_cb': paiement_par_cb,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class InitierPaymentOM(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        logger.info(f"initiate OM payment request for commande {request.data['order_id']} by {request.user}.")
        try:
            order = Commande.objects.get(id=request.data['order_id'])
            order.date_expiration = order.date_expiration + timedelta(minutes=env.float("DUREE_ATTENTE_PAYMENT_OM"))
            order.save()
            logger.info(f"date d'expiration de la commande {order.ref_code} repoussé de {env.float("DUREE_ATTENTE_PAYMENT_OM")}.")
            return Response(status=status.HTTP_200_OK)
        except:
            logger.error(f"initiation de payment OM par {request.user} échoué : la commande nest pas trouvé.",
                         exc_info=True)
            return Response({"error": "Commande inexistante"}, status=status.HTTP_400_BAD_REQUEST)
