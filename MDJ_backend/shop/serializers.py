from rest_framework.serializers import ModelSerializer,FloatField,IntegerField
# from rest_framework import serializers
from .models import ZoneLivraison,Commande,Panier
from .serializer import ProductSerializer
from accounts.serializers import UserSerializer


class ZoneSerializer(ModelSerializer):
    class Meta:
        model = ZoneLivraison
        fields = "__all__"

class PanierSerializer(ModelSerializer):
    client = UserSerializer()
    produits = ProductSerializer(many=True)
    montant = FloatField()
    quantitePanier = IntegerField()
    class Meta:
        model = Panier
        fields = ['id','client', 'produits', 'date_creation', 'montant','quantitePanier']
        read_only_fields = ['montant', 'quantitePanier']
    class Meta:
        model = Panier
        fields = '__all__'
        
class CommandeSerializer(ModelSerializer):
    class Meta:
        model = Commande
        fields = '__all__'
        read_only_fields = ['ref_code', 'client']