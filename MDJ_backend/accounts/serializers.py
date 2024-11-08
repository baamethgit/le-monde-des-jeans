from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from accounts.models import CustomUser,Avis
from phonenumber_field.serializerfields import PhoneNumberField


class UserSerializer(ModelSerializer):
    phone_number = PhoneNumberField(region="SN")
    class Meta:
        model = CustomUser
        fields = ["id","nom_complet","phone_number",'slug',"password"]

    # Pour crypter le password
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    def validate_phone(self, value):
        if self.instance is None:  # Si l'instance n'existe pas encore, c'est une création
            if CustomUser.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("Ce numéro est déjà utilisé.")
        else:  # Sinon, c'est une mise à jour
            if CustomUser.objects.exclude(pk=self.instance.pk).filter(phone_number=value).exists():
                raise serializers.ValidationError("Ce numéro est déjà utilisé.")
        return value
    
class AvisSerializer(serializers.ModelSerializer):
    Avis_author=UserSerializer()    
    class Meta:
        model=Avis
        fields='__all__'
        

class AvisCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Avis
        fields='__all__'