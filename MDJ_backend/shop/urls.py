from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import getDeliveryZones,getDeliveryZoneByNum,CommandeListView
from .commande_views import cartView
from django.urls import path
 

router = DefaultRouter()
# router.register(r'users', vie.UserViewSet)
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'categories', views.CategoryViewSet, basename='categories')
router.register(r'commandes', views.CommandeViewSet)



urlpatterns = [
    path("", include(router.urls)),
    path('zones/', getDeliveryZones.as_view(), name="delivery-zones"),
    path('list-commandes/', CommandeListView.as_view(), name="list-commandes"),
    path('zone/<int:numero>/', getDeliveryZoneByNum.as_view(), name="single-delivery-zone"),
    path("cart/",cartView.as_view()),
]
