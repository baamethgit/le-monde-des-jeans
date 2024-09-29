from rest_framework.serializers import ModelSerializer
# from rest_framework import serializers
from .models import ZoneLivraison

class ZoneSerializer(ModelSerializer):
    class Meta:
        model = ZoneLivraison
        fields = "__all__"
