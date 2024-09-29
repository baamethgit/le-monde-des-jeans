from django.shortcuts import render
from rest_framework.views import APIView
from . import  models
from . import serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from accounts import models as accountModel
from rest_framework.generics import ListAPIView,RetrieveAPIView
from .serializers import ZoneSerializer
from .models import ZoneLivraison


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Categorie.objects.all()
    serializer_class = serializers.CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Produit.objects.all()
    serializer_class = serializers.ProductSerializer

    def retrieve(self, request, *args, **kwargs):
        # Récupérer le produit par le slug au lieu de l'id
        slug = kwargs.get('pk')  # 'pk' est l'argument par défaut utilisé pour l'identifiant
        produit = get_object_or_404(models.Produit, slug=slug)
        serializer = self.get_serializer(produit)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filtrer par slug de catégorie si "category_slug" est fourni dans les paramètres
        categorie = self.request.query_params.get('categorie', None)
        if categorie:
            print(f"Filtrage par catégorie: {categorie}")
            queryset = queryset.filter(categorie__slug=categorie)

        # Filtrer par taille si "size" est fourni
        size = self.request.query_params.get('size', None)
        if size:
            queryset = queryset.filter(taille=size)

        # Filtrer par couleur si "color" est fourni
        color = self.request.query_params.get('color', None)
        if color:
            queryset = queryset.filter(couleur=color)

        # Filtrer par composition si "compo" est fourni
        compo = self.request.query_params.get('compo', None)
        if compo:
            queryset = queryset.filter(composition=compo)

        return queryset


class AvisViewSet(viewsets.ModelViewSet):
    queryset=accountModel.Avis.objects.all()
    serializer_class=serializers.AvisSerializer


class getDeliveryZones(ListAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer


class PanierProduitViewSet(viewsets.ModelViewSet):
    queryset = models.PanierProduit.objects.all()
    serializer_class = serializers.PanierProduitSerializer

    def create(self, request, *args, **kwargs):
        # Custom logic to add a product to the cart
        produit_id = request.data.get('produit')
        panier_id = request.data.get('panier')
        panier = get_object_or_404(models.Panier, id=panier_id)
        produit = get_object_or_404(models.Produit, id=produit_id)
        
        # Call the `ajouter_produit` method from the Panier model
        success = panier.ajouter_produit(produit)

        if success:
            return Response({"detail": "Produit ajouté avec succès"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Le produit est déjà réservé ou dans un autre panier"}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        # Logique pour supprimer un produit du panier
        panier_produit_id = kwargs.get('pk')  # pk pour identifier l'instance à supprimer
        panier_produit = get_object_or_404(models.PanierProduit, id=panier_produit_id)

        produit = panier_produit.produit
        panier = panier_produit.panier

        # Suppression du produit du panier
        panier_produit.delete()

        # Libérer la réservation du produit
        produit.reserve = False
        produit.save()

        return Response({"detail": "Produit supprimé avec succès"}, status=status.HTTP_204_NO_CONTENT)

class PanierViewSet(viewsets.ModelViewSet):
    queryset = models.Panier.objects.all()
    serializer_class = serializers.PanierSerializer

    def retrieve(self, request, *args, **kwargs):
        # Récupérer le panier à partir du numéro de téléphone de l'utilisateur
        telephone = kwargs.get('pk')  # 'pk' sera utilisé ici pour passer le numéro de téléphone
        client = get_object_or_404(accountModel.CustomUser, phone_number=telephone)  # Supposons que 'User' est le modèle d'utilisateur qui contient le champ 'telephone'
        panier = get_object_or_404(models.Panier, client=client)
        print('client :', client)
        serializer = self.get_serializer(panier)
        return Response(serializer.data)

    def nettoyer_produits(self, request, pk=None):
        # Méthode personnalisée pour nettoyer les produits expirés dans un panier
        panier = get_object_or_404(models.Panier, id=pk)
        panier.nettoyer_produits_expires()
        return Response({"detail": "Produits expirés nettoyés"}, status=status.HTTP_200_OK)

class getDeliveryZoneByNum(RetrieveAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    lookup_field = 'numero'
