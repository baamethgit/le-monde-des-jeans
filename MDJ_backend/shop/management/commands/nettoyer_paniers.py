from django.core.management.base import BaseCommand
from shop.models import Panier  # Remplace `nom_de_ton_app` par le nom de ton app
from loguru import logger

class Command(BaseCommand):
    help = 'Nettoie les produits expirés dans tous les paniers'

    def handle(self, *args, **kwargs):
        paniers = Panier.objects.all()
        for panier in paniers:
            panier.nettoyer_produits_expires()
        logger.info(f'[CRONJOB] : Produits expirés supprimés des paniers.')

        self.stdout.write(self.style.SUCCESS('Produits expirés supprimés des paniers.'))