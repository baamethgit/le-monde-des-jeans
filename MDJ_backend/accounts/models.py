# models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from django.template.defaultfilters import slugify


class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('Le numéro de téléphone est obligatoire')
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superuser doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superuser doit avoir is_superuser=True.')

        return self.create_user(phone_number, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Meta:
        verbose_name = 'Client'
    nom_complet = models.CharField(max_length=255)
    phone_number = PhoneNumberField(region='SN',unique=True)
    addresse_mail = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    slug = models.SlugField(unique=True,blank=True)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['nom_complet']

    objects = CustomUserManager()


    def save(self, *args, **kwargs):
        if self.slug != slugify(self.phone_number):
            self.slug = slugify(self.phone_number)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return str(self.phone_number)

# class CodeOTP(models.Model):
#     client = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     code = models.CharField(max_length=6)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def is_valid(self):
#         expiration_time = self.created_at + timezone.timedelta(minutes=2)
#         return timezone.now() < expiration_time

class CodeOTP(models.Model):
    addresse_mail = models.EmailField(max_length=255, unique=True)
    phone_number = PhoneNumberField(region='SN', unique=True)
    otp_code = models.CharField(max_length=6) 
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    nom_complet = models.CharField(max_length=255) 
    hashed_password = models.CharField(max_length=255)  # Stocker le mot de passe haché

    def is_valid(self):
        """ Vérifier si l'OTP est toujours valide (non expiré) """
        return timezone.now() < self.expires_at

    def __str__(self):
        return f"OTP for {self.addresse_mail}"

class CodeOTPResetPassword(models.Model):
    addresse_mail = models.EmailField(max_length=255, unique=True)
    otp_code = models.CharField(max_length=6) 
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_valid(self):
        """ Vérifier si l'OTP est toujours valide (non expiré) """
        return timezone.now() < self.expires_at

    def __str__(self):
        return f"OTP for {self.addresse_mail}"


class Avis(models.Model):
    class Meta:
        verbose_name_plural = 'Avis'
    Avis_author=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='avis')
    Texte_avis=models.TextField(max_length=2000)
    temoigne_le = models.DateField(auto_now_add=True)
    nbre_etoiles = models.PositiveIntegerField(default=1)

    def __str__(self):
        return str(self.Avis_author)
