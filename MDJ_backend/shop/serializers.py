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
        fields = '__all__' 


class ImageProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImageProduit
        fields = ['image']

# class ProductSerializer(serializers.ModelSerializer):
#     images = ImageProduitSerializer(many=True, read_only=True)  # Nested serializer
#     class Meta:
#         model = models.Produit
#         fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    categorie = serializers.PrimaryKeyRelatedField(queryset=models.Categorie.objects.all(), write_only=True)
    categorie_detail = CategorySerializer(source='categorie', read_only=True)  # Lecture only...
    images = ImageProduitSerializer(many=True, read_only=True)

    class Meta:
        model = models.Produit
        fields = ['id', 'nom', 'prix', 'taille', 'composition', 'couleur', 'slug', 'QuantiteStock', 'special', 'categorie', 'categorie_detail', 'images']
        # 'categorie' pour l'ID en écriture, 'categorie_detail' pour la lecture des détails


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
        fields = ['id', 'produit', 'date_ajout']

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
    class Meta:
        model = Commande
        fields = '__all__'
        read_only_fields = ['ref_code', 'client']

