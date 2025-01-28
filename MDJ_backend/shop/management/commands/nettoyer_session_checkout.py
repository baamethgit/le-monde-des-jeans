from django.core.management.base import BaseCommand
from paiement.models import WaveCheckoutSession, Payment
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
from loguru import logger


class Command(BaseCommand):
    help = 'Nettoie les sessions wave expirées et les paiements expirés'

    def handle(self, *args, **kwargs):
        ten_min_ago = timezone.now() - timedelta(minutes=10)

        expired_sessions = WaveCheckoutSession.objects.filter(
            Q(created_at__lte=ten_min_ago) |
            Q(status='expired')
        )
        expired_sessions_count = expired_sessions.count()
        expired_sessions.delete()

        five_minutes_ago = timezone.now() - timedelta(minutes=5)

        expired_payments = Payment.objects.filter(date_paiement__lte=five_minutes_ago, statut='pending')
        expired_payments_count = expired_payments.count()
        expired_payments.delete()

        logger.info(f'[CRONJOB] : {expired_sessions_count} sessions expirées supprimées.')
        logger.info(f'[CRONJOB] : {expired_payments_count} paiements expirés supprimés.')

        self.stdout.write(self.style.SUCCESS(f'{expired_sessions_count} sessions expirées supprimées.'))
        self.stdout.write(self.style.SUCCESS(f'{expired_payments_count} paiements expirés supprimés.'))