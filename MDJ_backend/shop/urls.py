from django.urls import path, include
from . import views,commande_views
from rest_framework.routers import DefaultRouter
from .views import getDeliveryZones,getDeliveryZoneByNum,CommandeListView,CreateZone,DeleteZoneView,UpdateZoneView
from django.urls import path
 

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'categories', views.CategoryViewSet, basename='categories')
# router.register(r'admin-commandes', views.CommandeViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('zones/', getDeliveryZones.as_view(), name="delivery-zones"),
    path('list-commandes/', CommandeListView.as_view(), name="list-commandes"),
    path('zone/<int:id>/delete/', DeleteZoneView.as_view(), name="single-delivery-zone"),
    path('zone/<int:id>/update/', UpdateZoneView.as_view(), name="single-delivery-zone"),
    path('zone/<int:id>/', getDeliveryZoneByNum.as_view(), name="single-delivery-zone"),
    path('creer-zone/', CreateZone.as_view(), name="create-zone"),
    path('panier/', views.panier_detail, name='panier_detail'),
    path('panier/ajouter/', views.ajouter_produit, name='ajouter_produit'),
    path('panier/retirer/', views.retirer_produit, name='retirer_produit'),
    path('panier/contenu/', views.contenu_panier, name='contenu_panier'),
    path('panier/vider/', views.vider_panier, name='vider_panier'),
    path('creer-commande/', commande_views.creer_commande, name='creer_commande'),
    path('detail-commande/<int:commande_id>/', commande_views.detail_commande, name='detail_commande'),
    path('detail-commande-ref/<str:ref_code>/', commande_views.detail_commande_by_refcode, name='detail_commande-by-refcode'),
    path('commandes-client/', commande_views.liste_commandes, name='liste_commandes'),
    path('commandes-en-attente/', commande_views.detail_commande_courante, name='commande_courante'),
    path('commandes/<int:commande_id>/valider/', commande_views.valider_commande, name='valider_commande'),
    path('commandes/<int:commande_id>/annuler/', commande_views.annuler_commande, name='annuler_commande'),
    path('commandes/<int:commande_id>/delete/', commande_views.deleteCommande, name='supprimer_commande'),
    path('commandes/<int:id_commande>/update/', commande_views.CommandeUpdateView.as_view(), name='update_commande'),
]
