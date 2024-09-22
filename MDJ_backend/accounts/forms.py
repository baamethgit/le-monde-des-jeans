# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    phone_number = PhoneNumberField(region='SN')  # Région Sénégal

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('nom_complet','phone_number',)

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if not str(phone_number).startswith('+221'):
            phone_number = '+221' + str(phone_number)  # Ajouter l'identifiant SN si manquant
        return phone_number