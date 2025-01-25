from django.core.management.base import BaseCommand
from shop.models import Panier  # Remplace `nom_de_ton_app` par le nom de ton app

class Command(BaseCommand):
    help = 'Nettoie les produits expirés dans tous les paniers'

    def handle(self, *args, **kwargs):
        paniers = Panier.objects.all()
        for panier in paniers:
            panier.nettoyer_produits_expires()

        self.stdout.write(self.style.SUCCESS('Produits expirés supprimés des paniers.'))