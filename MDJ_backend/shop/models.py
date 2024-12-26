from django.db import models

from MDJ_backend.settings import AUTH_USER_MODEL
from django.template.defaultfilters import slugify
from django.utils import timezone
from datetime import timedelta

import itertools

from django.db import IntegrityError
import random
from django.db import transaction

# Utilisez select_related et prefetch_related dans vos vues pour optimiser les requêtes liées aux produits et commandes.

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

    nom = models.CharField(max_length=200)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name='produits')
    description=models.TextField(null=True, blank=True),
    taille = models.CharField(max_length=128, choices=TAILLES, blank=True, null=True)
    pointure=models.PositiveIntegerField(blank=True, null=True)
    composition = models.CharField(max_length=128, choices=COMPO, blank=True, null=True)
    couleur = models.CharField(max_length=128, choices=COULEUR, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    QuantiteStock = models.PositiveBigIntegerField(default=1, null=False, blank=False)
    reserve = models.BooleanField(default=False)
    special = models.BooleanField(default=False)
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
    



class PanierProduit(models.Model):
    """
    pour gérer la relation entre un produit et le panier
    """
    panier = models.ForeignKey('Panier', on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    date_ajout = models.DateTimeField(auto_now_add=True)
    quantite = models.PositiveIntegerField(default=1)

    def est_expire(self):
        return timezone.now() > self.date_ajout + timedelta(minutes=10)
    # penser à dynamiser le timing pour l'évolutivité
    
    # def __str__(self) -> str:
    #     return f"{self.produit} ajouté le {self.date_ajout}"

class Panier(models.Model):
    client = models.OneToOneField(AUTH_USER_MODEL,on_delete = models.CASCADE)
    produits = models.ManyToManyField(Produit, through=PanierProduit)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Panier de {self.client.nom_complet}"

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
        for panier_produit in self.panierproduit_set.all():
            if panier_produit.est_expire():
                produit = panier_produit.produit
                # produit.reserve = False
                produit.QuantiteStock += 1
                produit.save()
                panier_produit.delete()

    def ajouter_produit(self, produit : Produit):
        # if not produit.reserve:
        if produit.QuantiteStock:
            PanierProduit.objects.create(panier=self, produit=produit)
            # produit.reserve = True
            produit.QuantiteStock -= 1
            produit.save()
            return True
        return False



class ZoneLivraison(models.Model):
    numero = models.PositiveIntegerField(unique=True)
    nom = models.CharField(max_length=100)
    prix_livraison = models.DecimalField(max_digits=10, decimal_places=2)
    info = models.TextField(max_length=1000,blank=True,null=True) # plus d info
    
    def __str__(self):
        return self.nom
    
class Commande(models.Model):
    STATUT_CHOICES = (
        ('EN_ATTENTE', 'En attente de paiement'),
        ('PAYEE', 'Payée'),
        ('EN_COURS_LIVRAISON', 'En cours de Livraison'),
        ('LIVREE', 'Livrée'),
    )

    client = models.ForeignKey(AUTH_USER_MODEL,on_delete = models.CASCADE)
    ref_code = models.CharField(max_length=20, unique=True)
    produits = models.ManyToManyField(Produit)
    date_commande = models.DateTimeField(auto_now_add=True)
    date_livraison = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=STATUT_CHOICES, default='EN_ATTENTE')
    zone_livraison = models.ForeignKey(ZoneLivraison, on_delete=models.SET_NULL, null=True, blank=True)
    recupere_magasin = models.BooleanField(default=False)
    
    @classmethod
    def generate_ref_code(cls):
        timestamp = int(timezone.now().timestamp())
        random_num = random.randint(1000, 9999)  # Ajoute un nombre aléatoire
        return f"{timestamp:x}{random_num}"  # Combine le timestamp et un numéro aléatoire

    def save(self, *args, **kwargs):
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
        return (timezone.now() > self.date_commande + timedelta(minutes=5)) and self.statut == 'EN_ATTENTE'
    """
    def liberer_produits_apres_delais(self):
        if self.est_expire() and self.id:
            for produit in self.produits.all():
                # produit.reserve = False
                produit.QuantiteStock -= 1
                produit.save()
            self.delete()
"""
    def __str__(self):
        return f"Commande {self.ref_code} par {self.client.nom_complet}"
    
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
            self.statut = 'LIVREE'
            self.save()
    

class Payment(models.Model):
    METHODE_PAIEMENT_CHOICES = (
        ('ORANGE_MONEY', 'Orange Money'),
        ('WAVE', 'Wave'),
        ('CC', 'Carte de crédit'),
    )

    #commande = models.OneToOneField(Commande, on_delete=models.CASCADE)
    ref_commande = models.CharField(max_length=50,unique=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode_paiement = models.CharField(max_length=20, choices=METHODE_PAIEMENT_CHOICES)
    date_paiement = models.DateTimeField(auto_now_add=True)
    id_transaction = models.CharField(max_length=50)

    def __str__(self):
        return f"Paiement pour la commande {self.ref_commande} via {self.get_methode_paiement_display()}"
    
