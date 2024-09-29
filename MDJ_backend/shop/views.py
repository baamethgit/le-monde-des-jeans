from django.shortcuts import render
from .serializers import ZoneSerializer
from .models import ZoneLivraison

# Create your views here.
from rest_framework.generics import ListAPIView

class getDeliveryZones(ListAPIView):
    queryset = ZoneLivraison.objects.all()
    serializer_class = ZoneSerializer