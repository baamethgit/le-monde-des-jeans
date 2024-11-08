from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
import logging

from your_app.models import Panier, Commande  # Ajustez selon vos noms de modèles

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Nettoie les paniers et commandes expirés (>10 minutes)'

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                # Définir le seuil d'expiration
                expire_time = timezone.now() - timedelta(minutes=10)
                
                # Nettoyer les paniers expirés
                paniers_expires = Panier.objects.filter(
                    created_at__lt=expire_time
                )
                nb_paniers = paniers_expires.count()
                paniers_expires.delete()
                
                # Nettoyer les commandes en attente expirées
                commandes_expirees = Commande.objects.filter(
                    status='en_attente',
                    created_at__lt=expire_time
                )
                nb_commandes = commandes_expirees.count()
                commandes_expirees.update(status='expiree')
                
                # Log les résultats
                logger.info(f"Nettoyage effectué : {nb_paniers} paniers, {nb_commandes} commandes")
                self.stdout.write(
                    self.style.SUCCESS(f"Nettoyage réussi : {nb_paniers} paniers, {nb_commandes} commandes")
                )
                
        except Exception as e:
            logger.error(f"Erreur pendant le nettoyage : {str(e)}")
            self.stdout.write(
                self.style.ERROR(f"Erreur : {str(e)}")
            )