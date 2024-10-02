from rest_framework.serializers import ModelSerializer
# from rest_framework import serializers
from .models import ZoneLivraison,Commande

class ZoneSerializer(ModelSerializer):
    class Meta:
        model = ZoneLivraison
        fields = "__all__"


class CommandeSerializer(ModelSerializer):
    class Meta:
        model = Commande
        fields = '__all__'
        read_only_fields = ['ref_code', 'client']