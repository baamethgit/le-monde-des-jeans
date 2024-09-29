from .views import getDeliveryZones
from django.urls import path


urlpatterns = [
    path('zones/', getDeliveryZones.as_view(), name="delivery-zones"),
]
