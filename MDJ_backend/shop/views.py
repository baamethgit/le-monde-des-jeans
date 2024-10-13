from rest_framework.views import APIView
from . import  models
from . import serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from accounts import models as accountModel
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView, DestroyAPIView
from .serializers import ZoneSerializer,CommandeSerializer
from .models import ZoneLivraison,Commande
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Panier, Produit, PanierProduit
from .serializers import PanierSerializer, PanierProduitSerializer
from django.shortcuts import get_object_or_404
from accounts.utils import verifier_user

class getDeliveryZones(ListAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer

class getDeliveryZoneByNum(RetrieveAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    lookup_field = 'id'

class CreateZone(CreateAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    
class DeleteZoneView(DestroyAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    lookup_field = 'id'  
     
class UpdateZoneView(APIView):
    def put(self, request,id):
        zone = models.ZoneLivraison.objects.filter(pk = id).first()
        serializer = ZoneSerializer(instance = zone, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
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

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CommandeListView(ListAPIView):
    serializer_class = CommandeSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Commande.objects.all()
        search_term = self.request.query_params.get('search', None)
        
        
        if search_term:
            queryset = queryset.filter(
                Q(client__phone_number__icontains=search_term) |
                Q(client__nom_complet__icontains=search_term) | 
                Q(ref_code__icontains=search_term) 
            )
        
       
        return queryset

@api_view(['GET'])
def panier_detail(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    panier, _ = Panier.objects.get_or_create(client=user)
    # panier.nettoyer_produits_expires()
    serializer = PanierSerializer(panier)
    return Response(serializer.data)

@api_view(['POST'])
def ajouter_produit(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    panier, _ = Panier.objects.get_or_create(client=user)
    produit_slug = request.data.get('produit_slug')
    produit = get_object_or_404(Produit, slug=produit_slug)
    
    if panier.ajouter_produit(produit):
        return Response({"message": "Produit ajouté au panier"}, status=status.HTTP_200_OK)
    else:
        return Response({"message_erreur": "Le produit est déjà réservé"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def retirer_produit(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    panier = get_object_or_404(Panier, client=user)
    produit_slug = request.data.get('produit_slug')
    produit = get_object_or_404(Produit, slug=produit_slug)
    panier_produit = get_object_or_404(PanierProduit, panier=panier, produit=produit)

    produit.QuantiteStock += 1
    produit.save()
    panier_produit.delete()
    
    return Response({"message": "Produit retiré du panier"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def contenu_panier(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    panier = Panier.objects.get(client=user)
    panier.nettoyer_produits_expires()
    panier_produits = PanierProduit.objects.filter(panier=panier)
    serializer = PanierProduitSerializer(panier_produits, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def vider_panier(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    panier = Panier.objects.get(client=user)
    for panier_produit in PanierProduit.objects.filter(panier=panier):
        produit = panier_produit.produit
        # produit.reserve = False
        produit.QuantiteStock += 1
        produit.save()
        panier_produit.delete()
    return Response({"message": "Panier vidé"}, status=status.HTTP_200_OK)


    
