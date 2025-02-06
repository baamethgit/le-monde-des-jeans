from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from paiement.models import Payment


class PaiementSerializer(ModelSerializer):
    telephone_client = serializers.CharField(source='client.phone_number', read_only=True)
    nom_client = serializers.CharField(source='client.nom_complet', read_only=True)
    class Meta:
            model = Payment
            fields = ['id', 'client', 'ref_commande', 'montant', 'methode_paiement', 
                    'date_paiement', 'id_transaction', 'statut', 
                    'telephone_client', 'nom_client']