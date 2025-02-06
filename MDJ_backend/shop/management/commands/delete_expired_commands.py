from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from shop.models import Commande
from loguru import logger


class Command(BaseCommand):
    help = 'Supprime les commandes en attente expirées et restaure les stocks'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                commandes_expirees = Commande.objects.filter(
                    statut='EN_ATTENTE',
                    date_expiration__lt=timezone.now()
                )

                count = commandes_expirees.count()

                for commande in commandes_expirees:
                    for produit in commande.produits.all():
                        produit.QuantiteStock += 1
                        produit.save()

                    # Supprimer la commande
                    commande.delete()

                logger.info(f'[CRONJOB] : {count} commandes en attente expirées supprimées et stocks restaurés.')
                self.stdout.write(
                    self.style.SUCCESS(
                        f'{count} commandes en attente expirées supprimées et stocks restaurés.'
                    )
                )

        except Exception as e:
            logger.error(f'[CRONJOB] Erreur lors du traitement des commandes expirées: {str(e)}')
            self.stdout.write(
                self.style.ERROR(
                    f'Erreur lors du traitement des commandes expirées: {str(e)}'
                )
            )