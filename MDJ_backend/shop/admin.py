from django.contrib import admin
from .models import Produit,Paiement,Commande,ZoneLivraison,ImageProduit,Categorie,Panier,PanierProduit

# Register your models here.

class CategorySlug(admin.ModelAdmin):
    prepopulated_fields={"slug":("nom",)}

# class ProduitSlug(admin.ModelAdmin):
#     prepopulated_fields={"slug":("nom","id")}

admin.site.register(Paiement)
admin.site.register(Produit)
admin.site.register(Commande)
admin.site.register(ZoneLivraison)
admin.site.register(ImageProduit)
admin.site.register(Categorie, CategorySlug)
admin.site.register(PanierProduit)
admin.site.register(Panier)
