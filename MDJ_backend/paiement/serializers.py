from rest_framework.serializers import ModelSerializer

from paiement.models import Payment


class PaiementSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"