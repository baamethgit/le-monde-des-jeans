from django.db import models

from MDJ_backend.settings import AUTH_USER_MODEL
from django.template.defaultfilters import slugify
from django.utils import timezone
from datetime import timedelta

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
    taille = models.CharField(max_length=128, choices=TAILLES, blank=True, null=True)
    composition = models.CharField(max_length=128, choices=COMPO, blank=True, null=True)
    couleur = models.CharField(max_length=128, choices=COULEUR, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    QuantiteStock = models.PositiveBigIntegerField(default=1, null=False, blank=False)
    reserve = models.BooleanField(default=False)
    special = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Si l'objet n'a pas encore d'ID, il est nécessaire de l'enregistrer une première fois
        # pour générer l'ID (nécessaire pour créer un slug unique)
        if not self.id:
            super().save(*args, **kwargs)

        # Générer le slug en utilisant le nom et l'ID si le slug est vide ou à recréer
        if not self.slug:
            self.slug = slugify(self.nom) + "-" + str(self.id)

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
        return 12
    
    def nettoyer_produits_expires(self):
        for panier_produit in self.panierproduit_set.all():
            if panier_produit.est_expire():
                produit = panier_produit.produit
                produit.reserve = False
                produit.save()
                panier_produit.delete()

    def ajouter_produit(self, produit):
        if not produit.reserve:
            PanierProduit.objects.create(panier=self, produit=produit)
            produit.reserve = True
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
        ('EN_PREPARATION', 'En préparation'),
        ('EXPEDIEE', 'Expédiée'),
        ('LIVREE', 'Livrée'),
        ('ANNULEE', 'Annulée'),
    )

    client = models.ForeignKey(AUTH_USER_MODEL,on_delete = models.CASCADE)
    ref_code = models.CharField(max_length=20, unique=True) # a générer
    produits = models.ManyToManyField(Produit)
    date_commande = models.DateTimeField(auto_now_add=True)
    date_livraison = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=30, choices=STATUT_CHOICES, default='EN_ATTENTE')
    zone_livraison = models.ForeignKey(ZoneLivraison, on_delete=models.SET_NULL, null=True, blank=True)
    recupere_magasin = models.BooleanField(default=False)
    achat_direct = models.BooleanField(default=False)
    
    def est_expire(self):
        return (timezone.now() > self.date_commande + timedelta(minutes=5)) and self.statut == 'EN_ATTENTE'
    
    def liberer_produits_apres_delais(self):
        if self.est_expire():
            for produit in self.produits.all():
                produit.reserve = False
                produit.save()
            self.delete()

    def __str__(self):
        return f"Commande {self.ref_code} par {self.client.nom_complet}"
    
    @property
    def get_total(self):
        total = sum(prod.prix for prod in self.produits.all())
        if self.zone_livraison and not self.recupere_magasin:
            total += self.zone_livraison.prix_livraison
        return total
    
    def marquer_comme_payee(self):
        if self.statut == 'EN_ATTENTE':
            self.statut = 'PAYEE'
            self.save()

    def commencer_preparation(self):
        if self.statut == 'PAYEE':
            self.statut = 'EN_PREPARATION'
            self.save()

    def marquer_comme_expediee(self):
        if self.statut == 'EN_PREPARATION':
            self.statut = 'EXPEDIEE'
            self.save()

    def marquer_comme_livree(self):
        if self.statut == 'EXPEDIEE':
            self.statut = 'LIVREE'
            self.save()

    def annuler(self):
        if self.statut != 'LIVREE':
            for produit in self.produits.all():
                produit.reserve = False
                produit.save()
            self.statut = 'ANNULEE'
            self.save()
    

class Paiement(models.Model):
    METHODE_PAIEMENT_CHOICES = (
        ('OM', 'Orange Money'),
        ('WV', 'Wave'),
        ('CC', 'Carte de crédit'),
    )

    commande = models.OneToOneField(Commande, on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode_paiement = models.CharField(max_length=2, choices=METHODE_PAIEMENT_CHOICES)
    date_paiement = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Paiement pour la commande {self.commande.ref_code} via {self.get_methode_paiement_display()}"
    
