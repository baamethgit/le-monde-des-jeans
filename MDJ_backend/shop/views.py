from rest_framework.views import APIView
from . import  models
from . import serializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from accounts import models as accountModel
from rest_framework.generics import ListAPIView,RetrieveAPIView
from .serializers import ZoneSerializer,CommandeSerializer
from .models import ZoneLivraison,Commande
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination


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


class getDeliveryZones(ListAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer



class getDeliveryZoneByNum(RetrieveAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    lookup_field = 'numero'




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
    
class CommandeViewSet(viewsets.ModelViewSet):
    queryset = Commande.objects.all()
    serializer_class = CommandeSerializer

    def perform_create(self, serializer):
        # Générer un ref_code unique ici
        import uuid
        ref_code = uuid.uuid4().hex[:20].upper()
        serializer.save(client=self.request.user, ref_code=ref_code)

    @action(detail=True, methods=['post'])
    def changer_statut(self, request, pk=None):
        commande = self.get_object()
        nouveau_statut = request.data.get('statut')
        if nouveau_statut not in dict(Commande.STATUT_CHOICES):
            return Response({'erreur': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Appeler la méthode appropriée en fonction du nouveau statut
        statut_methods = {
            'PAYEE': commande.marquer_comme_payee,
            'EN_PREPARATION': commande.commencer_preparation,
            'EXPEDIEE': commande.marquer_comme_expediee,
            'LIVREE': commande.marquer_comme_livree,
            'ANNULEE': commande.annuler
        }
        
        method = statut_methods.get(nouveau_statut)
        if method:
            method()
            return Response({'statut': commande.statut})
        else:
            return Response({'erreur': 'Changement de statut non autorisé'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def total(self, request, pk=None):
        commande = self.get_object()
        return Response({'total': commande.get_total()})
    
    
