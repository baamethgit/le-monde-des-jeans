from django.db import models

from shop.models import Commande


# Create your models here.
class Payment(models.Model):
    METHODE_PAIEMENT_CHOICES = (
        ('ORANGE_MONEY', 'Orange Money'),
        ('WAVE', 'Wave'),
        ('CC', 'Carte de crédit'),
    )

    ref_commande = models.CharField(max_length=50, unique=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode_paiement = models.CharField(max_length=20, choices=METHODE_PAIEMENT_CHOICES)
    date_paiement = models.DateTimeField(auto_now_add=True)
    id_transaction = models.CharField(max_length=50)
    statut = models.CharField(max_length=50, default='pending')

    def __str__(self):
        return f"Paiement pour la commande {self.ref_commande} via {self.get_methode_paiement_display()}"

class WaveCheckoutSession(models.Model):
    order = models.ForeignKey(Commande, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=100)
    wave_launch_url = models.URLField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)