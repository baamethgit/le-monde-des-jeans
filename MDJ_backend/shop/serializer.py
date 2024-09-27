from . import models
from accounts import models as accountModel
from accounts import serializers as accountserializer
from rest_framework import serializers


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