# models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from phonenumber_field.modelfields import PhoneNumberField
from django.template.defaultfilters import slugify

from accounts.validators import validate_phone_number_senegal


from django.core.exceptions import ValidationError
from django.contrib.auth.models import BaseUserManager
from .validators import validate_phone_number_senegal

from django.core.exceptions import ValidationError
import re

def validate_email_domain(email):
    # Liste des domaines de messagerie valides
    valid_domains = [
        'gmail.com', 'yahoo.com', 'yahoo.fr', 'hotmail.com', 
        'hotmail.fr', 'outlook.com', 'outlook.fr', 'live.com',
        'live.fr', 'orange.fr', 'wanadoo.fr', 'free.fr',
        'protonmail.com',
    ]
    
    # Vérification basique du format
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValidationError("Format d'adresse e-mail invalide.")
    
    # Extraction du domaine
    domain = email.split('@')[1].lower()
    
    # Vérification du domaine
    if domain not in valid_domains:
        raise ValidationError(f"Le domaine '{domain}' n'est pas accepté. Veuillez utiliser une adresse email valide.")
    
    # Vérifications supplémentaires
    if '..' in email:
        raise ValidationError("L'adresse e-mail ne peut pas contenir deux points consécutifs.")
    
    if email.count('@') != 1:
        raise ValidationError("L'adresse e-mail doit contenir exactement un '@'.")
class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        # Vérifie que le numéro de téléphone est fourni
        if not phone_number:
            raise ValueError('Le numéro de téléphone est obligatoire.')

        # Valide le numéro de téléphone
        try:
            validate_phone_number_senegal(phone_number)
        except ValidationError as e:
            raise ValueError(str(e))  # Relève une ValueError avec le message d'erreur

        # Vérifie que les champs obligatoires sont fournis
        if not extra_fields.get('nom_complet'):
            raise ValueError('Le nom complet est obligatoire.')

        if "<" in extra_fields.get('nom_complet') or ">" in extra_fields.get('nom_complet'):
            raise ValueError("Le nom d'utilisateur ne peut pas contenir de balises HTML.")
        """
        if not extra_fields.get('addresse_mail'):
            raise ValueError('L\'adresse e-mail est obligatoire.')

        # Validation de l'email
        try:
            validate_email_domain(extra_fields.get('addresse_mail'))
        except ValidationError as e:
            raise ValueError(str(e))
        # Normalise l'adresse e-mail
        addresse_mail = self.normalize_email(extra_fields.get('addresse_mail'))
        extra_fields['addresse_mail'] = addresse_mail
"""

        #extra_fields.setdefault('is_active', False)
        # Crée l'utilisateur
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        user.generate_verification_token()
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        # Définit les champs par défaut pour un superutilisateur
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        # Valide les champs spécifiques au superutilisateur
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')

        # Crée le superutilisateur
        return self.create_user(phone_number, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'Client'
    nom_complet = models.CharField(max_length=255)
    phone_number = PhoneNumberField(region='SN',unique=True,validators=[validate_phone_number_senegal])
    addresse_mail = models.EmailField(
        max_length=255, 
        #unique=True,
        #validators=[validate_email_domain],
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    verification_token = models.CharField(max_length=64, blank=True, null=True)
    verification_token_expires = models.DateTimeField(blank=True, null=True)
    reset_password_token = models.CharField(max_length=64, blank=True, null=True)
    reset_password_token_expires = models.DateTimeField(blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    slug = models.SlugField(unique=True,blank=True)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['nom_complet']

    objects = CustomUserManager()

    def generate_verification_token(self):
        self.verification_token = get_random_string(64)
        self.verification_token_expires = timezone.now() + timezone.timedelta(hours=10)
        self.save()

    def generate_resetpwd_token(self):
        self.reset_password_token = get_random_string(64)
        self.reset_password_token_expires = timezone.now() + timezone.timedelta(minutes=10)
        self.save()

    def save(self, *args, **kwargs):
        if self.slug != slugify(self.phone_number):
            self.slug = slugify(self.phone_number)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return str(self.phone_number)


class Avis(models.Model):
    class Meta:
        verbose_name_plural = 'Avis'
    Avis_author=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='avis')
    Texte_avis=models.TextField(max_length=2000)
    temoigne_le = models.DateField(auto_now_add=True)
    nbre_etoiles = models.PositiveIntegerField(default=1)

    def __str__(self):
        return str(self.Avis_author)
    
class InformationsGenerales(models.Model):
    class Meta:
        verbose_name_plural = 'Informations generales'
    addresse_mail_site = models.EmailField(max_length=255)
    telephone_site = PhoneNumberField(region='SN')
    addresse_site = models.CharField(max_length=255)
    Lien_facebook = models.URLField(null=True, blank=True)
    Lien_instagram = models.URLField(null=True, blank=True)
    Lien_Whatsapp = models.URLField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.pk and InformationsGenerales.objects.exists():
            raise ValueError("Il ne peut y avoir qu'un seul enregistrement pour InformationsGenerales.")
        super(InformationsGenerales, self).save(*args, **kwargs)
    def __str__(self):
        return str(self.addresse_mail_site)
