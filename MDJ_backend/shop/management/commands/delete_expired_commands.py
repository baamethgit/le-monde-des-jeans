from django.core.management.base import BaseCommand
from django.utils import timezone
from shop.models import Commande

class Command(BaseCommand):
    help = 'Supprime les commandes en attente expirées'

    def handle(self, *args, **kwargs):

        commandes_expirees = Commande.objects.filter(
            statut='EN_ATTENTE',
            date_expiration__lt=timezone.now()
        )
        count = commandes_expirees.count()
        commandes_expirees.delete()

        self.stdout.write(self.style.SUCCESS(f'{count} commandes en attente expirées supprimées.'))