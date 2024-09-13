from django.contrib import admin
from .models import Client,Produit,Paiement,Commande,ZoneLivraison,ImageProduit,Categorie,Panier,PanierProduit

# Register your models here.
admin.site.register(Client)
admin.site.register(Paiement)
admin.site.register(Produit)
admin.site.register(Commande)
admin.site.register(ZoneLivraison)
admin.site.register(ImageProduit)
admin.site.register(Categorie)
admin.site.register(PanierProduit)
admin.site.register(Panier)
