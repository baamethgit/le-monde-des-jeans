from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from accounts.models import CustomUser,Avis,InformationsGenerales
from phonenumber_field.serializerfields import PhoneNumberField

class UserLoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

class UserSerializer(ModelSerializer):
    phone_number = PhoneNumberField(region="SN")
    class Meta:
        model = CustomUser
        fields = ["id","nom_complet","phone_number",'addresse_mail',"password","is_staff","is_superuser","is_active"]
        read_only_fields = ["id", "is_staff", "is_superuser", "is_active"]

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


from django.contrib.auth import get_user_model


class SuperUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ['phone_number', 'nom_complet', 'addresse_mail', 'password']

    def create(self, validated_data):
        user = get_user_model().objects.create_superuser(
            phone_number=validated_data['phone_number'],
            nom_complet=validated_data['nom_complet'],
            addresse_mail=validated_data.get('addresse_mail', ''),
            password=validated_data['password']
        )
        return user

class InformationsGeneralesSerializer(serializers.ModelSerializer):
    class Meta:
        model=InformationsGenerales
        fields='__all__'