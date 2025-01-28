from django.core.management.base import BaseCommand
from django.utils import timezone
from shop.models import Commande
from loguru import logger

class Command(BaseCommand):
    help = 'Supprime les commandes en attente expirées'

    def handle(self, *args, **kwargs):

        commandes_expirees = Commande.objects.filter(
            statut='EN_ATTENTE',
            date_expiration__lt=timezone.now()
        )

        count = commandes_expirees.count()
        commandes_expirees.delete()
        logger.info(f'[CRONJOB] : {count} commandes en attente expirées supprimées.')
        self.stdout.write(self.style.SUCCESS(f'{count} commandes en attente expirées supprimées.'))