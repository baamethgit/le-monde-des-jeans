from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView

from accounts.models import CustomUser
from paiement.models import Payment
from . import  models
from . import serializers
from rest_framework import viewsets
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView, DestroyAPIView
from .serializers import ZoneSerializer, CommandeSerializer, PanierSerializerSansProd
from .models import ZoneLivraison, Commande
from django.db.models import Q, Count, F,Sum
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Panier, Produit, PanierProduit
from .serializers import PanierSerializer, PanierProduitSerializer
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from datetime import timedelta
from django.utils.timezone import now
from loguru import logger
from django.db import transaction


class getDeliveryZones(ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer

class getDeliveryZoneByNum(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    lookup_field = 'id'

class CreateZone(CreateAPIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    
class DeleteZoneView(DestroyAPIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer
    lookup_field = 'id'  
     
class UpdateZoneView(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def put(self, request,id):
        zone = models.ZoneLivraison.objects.filter(pk = id).first()
        serializer = ZoneSerializer(instance = zone, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Categorie.objects.all()
    serializer_class = serializers.CategorySerializer
    
    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = []
        elif self.action in ['update', 'partial_update', 'create', 'destroy']:
            permission_classes = [IsAdminUser, IsAuthenticated]
        else:
            permission_classes = [IsAdminUser, IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Produit.objects.all()
    serializer_class = serializers.ProductSerializer
    pagination_class = CustomPagination

    def get_permissions(self):
        if self.action == 'retrieve' or self.action == 'list':
            permission_classes = []
        elif self.action in ['update', 'partial_update', 'create', 'destroy']:
            permission_classes = [IsAdminUser, IsAuthenticated]
        else:
            permission_classes = [IsAdminUser, IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        # Récupérer le produit par le slug au lieu de l'id
        slug = kwargs.get('pk')  
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
        
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            # Gestion du tri multiple (séparé par des virgules)
            order_fields = ordering.split(',')
            for field in order_fields:
                # Vérifier si le champ est valide pour éviter les injections SQL
                valid_fields = ['prix', '-prix', 'special','QuantiteStock', '-QuantiteStock','id', '-id']
                if field in valid_fields:
                    queryset = queryset.order_by(field)

        # Filtrer par slug de catégorie si "category_slug" est fourni dans les paramètres
        categorie = self.request.query_params.get('categorie', None)
        if categorie:
            queryset = queryset.filter(categorie__slug=categorie)
            
        special = self.request.query_params.get('special', None)
        if special:
            queryset = queryset.filter(special=special)

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
            
        available = self.request.query_params.get('available', None)
        if available:
            queryset = queryset.filter(QuantiteStock__gt=0)
            
        return queryset


class CommandeListView(ListAPIView):
    serializer_class = CommandeSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated,IsAdminUser]

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
@permission_classes([IsAuthenticated])
def panier_detail(request):
    user = request.user
    panier, _ = Panier.objects.get_or_create(client=user)
    serializer = PanierSerializerSansProd(panier)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ajouter_produit(request):
    user = request.user
    produit_slug = request.data.get('produit_slug')
    if not produit_slug:
        return Response(
            {"message_erreur": "Le slug du produit est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():

            produit = Produit.objects.select_for_update().get(slug=produit_slug)

            if produit.QuantiteStock <= 0:
                return Response(
                    {"message_erreur": "Le produit est en rupture de stock"},
                    status=status.HTTP_409_CONFLICT
                )

            panier, _ = Panier.objects.get_or_create(client=user)
            Produit.objects.filter(id=produit.id).update(
                QuantiteStock=F('QuantiteStock') - 1
            )

            PanierProduit.objects.create(
                panier=panier,
                produit=produit,
            )
            logger.info(f"produit {produit} ajouté au panier de {user}")
            return Response(
                {"message": "Produit ajouté au panier"},
                status=status.HTTP_200_OK
            )

    except Produit.DoesNotExist:
        logger.error(f"produit {produit} non trouvé pour l'ajout au panier", exc_info=True)
        return Response(
            {"message_erreur": "Produit non trouvé"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Erreur d'ajout du produit {produit} au panier de {request.user},{str(e)}", exc_info=True)
        return Response(
            {"message_erreur": "Une erreur est survenue"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def retirer_produit(request):
    with transaction.atomic():
        try:
            panier = get_object_or_404(Panier, client=request.user)
            produit_slug = request.data.get('produit_slug')
            if not produit_slug:
                return Response({"error": "Le slug du produit est requis."}, status=status.HTTP_400_BAD_REQUEST)
            produit = get_object_or_404(Produit, slug=produit_slug)
            panier_produit = get_object_or_404(PanierProduit, panier=panier, produit=produit)

            Produit.objects.filter(id=produit.id).update(QuantiteStock=F('QuantiteStock') + panier_produit.quantite)
            panier_produit.delete()
        except Exception as e:
            logger.error(f"erreur retrait produit : {str(e)}", exc_info=True)
            return Response(status=status.HTTP_409_CONFLICT)
    logger.info(f"quantité du produit {produit} incrémenté de {panier_produit.quantite}")
    logger.info(f"le produit {produit} est retiré du panier de {request.user}")
    return Response({"message": "Produit retiré du panier"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contenu_panier(request):
    user = request.user
    panier = get_object_or_404(Panier, client=user)

    #panier.nettoyer_produits_expires()
    panier_produits = PanierProduit.objects.filter(panier=panier)
    serializer = PanierProduitSerializer(panier_produits, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vider_panier(request):
    with transaction.atomic():
        panier = get_object_or_404(Panier, client=request.user)
        panier_produits = PanierProduit.objects.filter(panier=panier)

        for pp in panier_produits:
            Produit.objects.filter(id=pp.produit.id).update(
                QuantiteStock=F('QuantiteStock') + pp.quantite
            )

        panier_produits.delete()
    logger.info(f"Panier de {request.user} vidé")
    return Response({"message": "Panier vidé"}, status=status.HTTP_200_OK)



class DashboardKpiView(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self, request):
        nombre_produits = Produit.objects.all().count()
        nombre_produits_en_rupture_de_stock = Produit.objects.filter(QuantiteStock=0).count()

        nombre_clients = CustomUser.objects.all().count()
        today = now().date()
        start_of_week = today - timedelta(days=today.weekday())
        nombre_nouveau_clients = CustomUser.objects.filter(date_joined__date__gte=start_of_week).count()

        nombre_commandes = Commande.objects.all().count()
        nombre_nouvelles_commandes = Commande.objects.filter(date_commande__date__gte=start_of_week).count()

        ventes_totales = Payment.objects.filter(statut='completed').aggregate(total=Sum('montant'))['total'] or 0


        total_commandes = Commande.objects.count()
        commandes_par_statut = (
            Commande.objects
            .values('statut')
            .annotate(nombre=Count('id'))
        )
        # Préparer les données pour le frontend
        commandes_par_statut_list = []
        for item in commandes_par_statut:
            statut_label = item['statut']
            count = item['nombre']
            percentage = (count / total_commandes * 100) if total_commandes > 0 else 0

            commandes_par_statut_list.append({
                'label': statut_label,
                'count': count,
                'percentage': round(percentage, 2)  # arrondi à 2 décimales
            })

        response_data = {
            'nombre_produits':nombre_produits,
            'nombre_produits_en_rupture_de_stock':nombre_produits_en_rupture_de_stock,
            'nombre_clients':nombre_clients,
            'nombre_nouveau_clients':nombre_nouveau_clients,
            'nombre_commandes':nombre_commandes,
            'nombre_nouvelles_commandes':nombre_nouvelles_commandes,
            'ventes_totales': ventes_totales,
            "commandes_par_statut":commandes_par_statut_list
        }

        return Response(response_data, status=status.HTTP_200_OK)

    
