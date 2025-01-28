from django.db import models

from MDJ_backend.settings import AUTH_USER_MODEL
from django.template.defaultfilters import slugify
from django.utils import timezone
from datetime import timedelta
import environ
import os

env = environ.Env()
environ.Env.read_env()

import itertools

from django.db import IntegrityError
import random
from django.db import transaction

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, max_length=1000)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='images_categories/')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nom

    def delete(self, *args, **kwargs):
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

class Produit(models.Model):
    TAILLES = (
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL') 
    )
    COMPO = (
        ('coton', 'Coton'),
        ('nilon', 'Nilon'),
    )
    COULEUR = (
        ('BL', 'Bleu'),
        ('RD', 'Rouge'),
        ('GR', 'Vert'),
        ('YW', 'Jaune'),
        ('BK', 'Noir'),
        ('WH', 'Blanc'),
        ('OR', 'Orange'),
        ('PR', 'Pourpre'),
        ('PK', 'Rose'),
        ('GY', 'Gris'),
        ('BR', 'Marron'),
    )

    nom = models.CharField(max_length=200, null=True, blank=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, related_name='produits', db_index=True)
    description=models.CharField(null=True, blank=True,max_length=1500)
    taille = models.CharField(max_length=128, choices=TAILLES, blank=True, null=True)
    pointure=models.PositiveIntegerField(blank=True, null=True)
    composition = models.CharField(max_length=128, choices=COMPO, blank=True, null=True)
    couleur = models.CharField(max_length=128, choices=COULEUR, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True,db_index=True)
    QuantiteStock = models.PositiveBigIntegerField(default=1, null=False, blank=False)
    special = models.BooleanField(default=False)
    neuf = models.BooleanField(default=False)
    isDeletable=models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            max_length = Produit._meta.get_field('slug').max_length
            self.slug = orig = slugify(self.nom)[:max_length]
            
            for i in itertools.count(1):
                if not Produit.objects.filter(slug=self.slug).exists():
                    break
                # Tronquer le slug original dynamiquement pour faire de la place pour le suffixe
                self.slug = "{}-{}".format(orig[:max_length - len(str(i)) - 1], i)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nom
class ImageProduit(models.Model):
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='images_produits/',verbose_name='photo')

    def delete(self, *args, **kwargs):
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)
    


DUREE_ATTENTE_PANIER = env.float("DUREE_ATTENTE_PANIER",default=5)

class PanierProduit(models.Model):
    """
    pour gérer la relation entre un produit et le panier
    """
    panier = models.ForeignKey('Panier', on_delete=models.CASCADE, db_index=True)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, db_index=True)
    date_ajout = models.DateTimeField(auto_now_add=True)
    quantite = models.PositiveIntegerField(default=1)

    def est_expire(self):
        return timezone.now() > self.date_ajout + timedelta(minutes=DUREE_ATTENTE_PANIER)


class Panier(models.Model):
    client = models.OneToOneField(AUTH_USER_MODEL,on_delete = models.CASCADE)
    produits = models.ManyToManyField(Produit, through=PanierProduit)
    date_creation = models.DateTimeField(auto_now_add=True)
    verrouille = models.BooleanField(default=False)

    def __str__(self):
        return f"Panier de {self.client}"

    def get_montant(self):
        return sum(produit.prix for produit in self.produits.all())
    
    @property
    def montant(self):
        return self.get_montant()

    @property
    def quantitePanier(self):
        cartitems = self.produits.all()
        return cartitems.count()
    
    def nettoyer_produits_expires(self):
        if self.verrouille:
            return
        for panier_produit in self.panierproduit_set.all():
            if panier_produit.est_expire():
                produit = panier_produit.produit
                produit.QuantiteStock += panier_produit.quantite
                produit.save()
                panier_produit.delete()

    def ajouter_produit(self, produit : Produit):
        if produit.QuantiteStock:
            PanierProduit.objects.create(panier=self, produit=produit)
            produit.QuantiteStock -= 1
            produit.save()
            return True
        return False

class ZoneLivraison(models.Model):
    numero = models.PositiveIntegerField(unique=True)
    nom = models.CharField(max_length=100)
    prix_livraison = models.DecimalField(max_digits=10, decimal_places=2)
    info = models.TextField(max_length=1000,blank=True,null=True)
    
    def __str__(self):
        return self.nom

DUREE_ATTENTE_COMMANDE = env.float("DUREE_ATTENTE_COMMANDE",default=5)

class Commande(models.Model):
    STATUT_CHOICES = (
        ('EN_ATTENTE', 'En attente de paiement'),
        ('PAYEE', 'Payée'),
        ('EN_COURS_LIVRAISON', 'En cours de Livraison'),
        ('LIVREE', 'Livrée'),
    )

    client = models.ForeignKey(AUTH_USER_MODEL,on_delete = models.CASCADE)
    ref_code = models.CharField(max_length=20, unique=True, db_index=True)
    produits = models.ManyToManyField(Produit)
    date_commande = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField(null=True, blank=True)
    date_livraison = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=STATUT_CHOICES, default='EN_ATTENTE')
    zone_livraison = models.ForeignKey(ZoneLivraison, on_delete=models.SET_NULL, null=True, blank=True)
    recupere_magasin = models.BooleanField(default=False)
    
    @classmethod
    def generate_ref_code(cls):
        timestamp = int(timezone.now().timestamp())
        random_num = random.randint(1000, 9999)
        return f"{timestamp:x}{random_num}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_expiration = timezone.now() + timedelta(minutes=DUREE_ATTENTE_COMMANDE)
        if not self.ref_code:
            attempts = 0
            max_attempts = 3
            while attempts < max_attempts:
                self.ref_code = self.generate_ref_code()
                try:
                    with transaction.atomic():
                        super().save(*args, **kwargs)
                        break
                except IntegrityError:  # En cas de collision
                    attempts += 1
                    if attempts == max_attempts:
                        raise
        else:
            super().save(*args, **kwargs)

    def est_expire(self):
        return (timezone.now() > self.date_expiration) and self.statut == 'EN_ATTENTE'

    def __str__(self):
        return f"Commande {self.ref_code}"
    
    @property
    def montant(self):
        total = sum(prod.prix for prod in self.produits.all())
        if self.zone_livraison and not self.recupere_magasin:
            total += self.zone_livraison.prix_livraison
        return total
    
    def marquer_comme_payee(self):
        if self.statut == 'EN_ATTENTE':
            self.statut = 'PAYEE'
            self.save()

    def commencer_livraison(self):
        if self.statut == 'PAYEE':
            self.statut = 'EN_COURS_LIVRAISON'
            self.save()

    def marquer_comme_livree(self):
        if self.statut == 'PAYEE' or self.statut == 'EN_COURS_LIVRAISON':
            self.date_livraison = timezone.now()
            self.statut = 'LIVREE'
            self.save()


