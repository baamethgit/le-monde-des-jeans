from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Commande, Produit, Panier
from .serializers import CommandeSerializer, ProductSerializer
from accounts.utils import verifier_user


@api_view(['POST'])
def creer_commande(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commande_existante = Commande.objects.filter(client=user, statut='EN_ATTENTE').first()
    if commande_existante:
        return Response({"error": "Une commande en attente existe déjà", "commande_id": commande_existante.id}, status=status.HTTP_400_BAD_REQUEST)

    commande = Commande.objects.create(client=user, statut='EN_ATTENTE')
   
    if request.data.get('from_panier'):
        panier = Panier.objects.get(client=user)
        # je dw vérifier dabord s'il ya des produits pour ne pas créer un commande vide
        for panier_produit in panier.panierproduit_set.all():
            commande.produits.add(panier_produit.produit)
        panier.panierproduit_set.all().delete()  # Vider le panier
    
    elif request.data.get('produit_slug'):
        produit = get_object_or_404(Produit, slug=request.data['produit_slug'])
        commande.produits.add(produit)
    
    else:
        return Response({"error": "Données invalides pour créer une commande"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = CommandeSerializer(commande)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def detail_commande(request, commande_id):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commande = get_object_or_404(Commande, id=commande_id, client=user)
        
    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['GET'])
def detail_commande_courante(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commande = get_object_or_404(Commande,client=user,statut = 'EN_ATTENTE')
        
    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['GET'])
def liste_commandes(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commandes = Commande.objects.filter(client=user).order_by('-date_commande')
    serializer = CommandeSerializer(commandes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def valider_commande(request, commande_id):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commande = get_object_or_404(Commande, id=commande_id, client=user, statut='EN_ATTENTE')
    commande.marquer_comme_payee()
    
    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['POST'])
def annuler_commande(request, commande_id):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commande = get_object_or_404(Commande, id=commande_id, client=user)
    commande.annuler()
    
    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['delete'])
def deleteCommande(request,commande_id):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    commande = get_object_or_404(Commande, id=commande_id, client=user)
    for produit in commande.produits:
        produit.reserve = False
        produit.save()
    commande.delete()
    
    return Response({"message": f"La commande {commande.ref_code} est supprimé"}, status=status.HTTP_200_OK)
    
@api_view(['delete'])
def changerStatutCommande(request,commande_id):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)

    statut = request.data.get('nouveau_statut')
    commande = get_object_or_404(Commande, id=commande_id, client=user)
    commande.delete()
    
    return Response({"message": f"La commande {commande.ref_code} est supprimé"}, status=status.HTTP_200_OK)