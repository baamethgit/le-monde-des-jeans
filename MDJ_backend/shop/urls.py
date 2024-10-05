from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import getDeliveryZones,getDeliveryZoneByNum,CommandeListView
from .commande_views import cartView
from django.urls import path
 

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'categories', views.CategoryViewSet, basename='categories')
router.register(r'commandes', views.CommandeViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('zones/', getDeliveryZones.as_view(), name="delivery-zones"),
    path('list-commandes/', CommandeListView.as_view(), name="list-commandes"),
    path('zone/<int:numero>/', getDeliveryZoneByNum.as_view(), name="single-delivery-zone"),
    path('panier/', views.panier_detail, name='panier_detail'),
    path('panier/ajouter/', views.ajouter_produit, name='ajouter_produit'),
    path('panier/retirer/', views.retirer_produit, name='retirer_produit'),
    path('panier/contenu/', views.contenu_panier, name='contenu_panier'),
    path('panier/vider/', views.vider_panier, name='vider_panier'),
]
