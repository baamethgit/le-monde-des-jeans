from rest_framework.serializers import ModelSerializer,FloatField,IntegerField
# from rest_framework import serializers

from .models import ZoneLivraison,Commande,Panier
from accounts.serializers import UserSerializer
from accounts import models as accountModel
from accounts import serializers as accountserializer
from rest_framework import serializers
from . import models


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Categorie
        fields = ['id', 'nom', 'slug', 'image'] # Tu peux ajouter d'autres champs si nécessaire


class ImageProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImageProduit
        fields = ['image']

class ProductSerializer(serializers.ModelSerializer):
    images = ImageProduitSerializer(many=True, read_only=True)  # Nested serializer
    categorie = CategorySerializer()
    class Meta:
        model = models.Produit
        fields = ['id', 'nom', 'prix', 'categorie', 'taille', 'composition', 'couleur', 'slug', 'QuantiteStock', 'reserve', 'special', 'images']

class AvisSerializer(serializers.ModelSerializer):

    Avis_author=accountserializer.UserSerializer()
    
    class Meta:
        model=accountModel.Avis
        fields=['Texte_avis', 'Avis_author']

class ZoneSerializer(ModelSerializer):
    class Meta:
        model = ZoneLivraison
        fields = "__all__"

class PanierProduitSerializer(serializers.ModelSerializer):
    produit = ProductSerializer(read_only=True) 

    class Meta:
        model = models.PanierProduit
        fields = ['id', 'produit', 'date_ajout','quantite']

class PanierSerializer(ModelSerializer):
    client = UserSerializer()
    produits = ProductSerializer(many=True)
    montant = FloatField()
    quantitePanier = IntegerField()
    class Meta:
        model = Panier
        fields = ['id','client', 'produits', 'date_creation', 'montant','quantitePanier']
        read_only_fields = ['montant', 'quantitePanier']
    # class Meta:
    #     model = Panier
    #     fields = '__all__'
        
class CommandeSerializer(ModelSerializer):
    client = UserSerializer()
    produits = ProductSerializer(many=True)
    zone_livraison = ZoneSerializer()
    class Meta:
        model = Commande
        fields = '__all__'
        read_only_fields = ['ref_code', 'client']

