from django.shortcuts import render
from rest_framework.views import APIView
from . import  models
from . import serializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from accounts import models as accountModel
# Create your views here.


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Categorie.objects.all()
    serializer_class = serializer.CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Produit.objects.all()
    serializer_class = serializer.ProductSerializer

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
    serializer_class=serializer.AvisSerializer






