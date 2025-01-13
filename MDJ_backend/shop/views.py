from rest_framework.views import APIView
from . import  models
from . import serializers
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
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
from django.utils.dateparse import parse_date

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
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Toujours partiel
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if 'image' in request.FILES:
            # Gérer les mises à jour d'images comme avant
            instance.images.all().delete()
            images = request.FILES.getlist('image')
            for image in images:
                models.ImageProduit.objects.create(produit=instance, image=image)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
    
    def create(self, request, *args, **kwargs):
        produit_data = {
            'nom': request.data.get('nom'),
            'prix': request.data.get('prix'),
            'categorie': request.data.get('categorie'),
            'taille': request.data.get('taille'),
            'pointure':request.data.get('pointure'),
            'composition': request.data.get('composition'),
            'couleur': request.data.get('couleur'),
            'special':request.data.get('special'),
            'neuf':request.data.get('neuf'),
            'description':request.data.get('description'),
            'QuantiteStock':request.data.get('QuantiteStock')
        }
        produit_serializer = self.get_serializer(data=produit_data)
        if produit_serializer.is_valid():
            produit = produit_serializer.save()
            
            # Gérer les images
            images = request.FILES.getlist('image')
            for image in images:
                models.ImageProduit.objects.create(produit=produit, image=image)
            
            return Response(produit_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(produit_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        statut = self.request.query_params.get('statut')

        if statut:
            queryset = queryset.filter(statut=statut)

        if start_date:
            start_date = parse_date(start_date)
            queryset = queryset.filter(date_commande__gte=start_date)
        if end_date:
            end_date = parse_date(end_date)
            queryset = queryset.filter(date_commande__lte=end_date)
        
        if search_term:
            queryset = queryset.filter(
                Q(client__phone_number__icontains=search_term) |
                Q(client__nom_complet__icontains=search_term) | 
                Q(ref_code__icontains=search_term) 
            ).order_by('-date_commande')
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


def DashboardKpiView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        response_data = {

        }

    
