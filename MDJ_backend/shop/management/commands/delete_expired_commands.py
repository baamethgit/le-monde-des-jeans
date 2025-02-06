from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from shop.models import Commande
from paiement.models import Payment, WaveCheckoutSession
from loguru import logger


class Command(BaseCommand):
    help = 'Supprime les commandes en attente expirées et leurs données associées'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                commandes_expirees = Commande.objects.filter(
                    statut='EN_ATTENTE',
                    date_expiration__lt=timezone.now()
                )

                count_commandes = commandes_expirees.count()
                count_payments = 0
                count_wave_sessions = 0

                for commande in commandes_expirees:
                    payments_supprimes = Payment.objects.filter(
                        ref_commande=commande.ref_code,
                        statut='pending'
                    ).delete()[0]
                    count_payments += payments_supprimes

                    wave_sessions_supprimees = WaveCheckoutSession.objects.filter(
                        order=commande,
                        status='pending'
                    ).delete()[0]
                    count_wave_sessions += wave_sessions_supprimees

                    for produit in commande.produits.all():
                        produit.QuantiteStock += 1
                        produit.save()


                    commande.delete()

                logger.info(
                    f'[CRONJOB] Nettoyage effectué :\n'
                    f'- {count_commandes} commandes expirées supprimées\n'
                    f'- {count_payments} paiements en attente supprimés\n'
                    f'- {count_wave_sessions} sessions Wave supprimées\n'
                    f'- Stocks restaurés'
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Nettoyage effectué : {count_commandes} commandes, '
                        f'{count_payments} paiements, {count_wave_sessions} sessions Wave'
                    )
                )

        except Exception as e:
            logger.error(f'[CRONJOB] Erreur lors du nettoyage des données : {str(e)}')
            self.stdout.write(
                self.style.ERROR(
                    f'Erreur lors du nettoyage des données : {str(e)}'
                )
            )