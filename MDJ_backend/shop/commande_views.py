from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Commande, Produit, Panier
from .serializers import CommandeSerializer, CommandeHistoriqueSerializer, CommandeUpdateSerializer
from loguru import logger
from django.db import transaction
from django.db.models import F


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creer_commande(request):
    user = request.user
    try:
        with transaction.atomic():

            commande_existante = Commande.objects.filter(client=user, statut='EN_ATTENTE').first()
            if commande_existante:
                logger.warning(f"tentative de commande sans valider l'existante .user = {request.user}")
                return Response({"message_erreur": "Vous avez déjà une commande en attente, validez-la d'abord."},
                                status=status.HTTP_400_BAD_REQUEST)

            commande = Commande.objects.create(client=user, statut='EN_ATTENTE')

            if request.data.get('from_panier'):
                logger.info(f"tentative de création d'une commande à partir du panier.user = {request.user}")
                panier = get_object_or_404(Panier, client=user)
                panier.verrouille = True
                panier.save()
                if not panier.panierproduit_set.exists():
                    logger.warning(f"Panier vidé pendant la création de la commande. user={request.user}")
                    return Response({"message": "Votre panier est vide"},
                                    status=status.HTTP_400_BAD_REQUEST)

                for panier_produit in panier.panierproduit_set.select_related('produit').all():
                    produit = Produit.objects.select_for_update().get(id=panier_produit.produit.id)
                    if produit.QuantiteStock < panier_produit.quantite:
                        logger.warning(f"Stock insuffisant pour {produit.nom} pour creer une commande.user={request.user}")
                        return Response({"message_erreur": f"Stock insuffisant pour {produit.nom}"},
                                        status=status.HTTP_400_BAD_REQUEST)

                    Produit.objects.filter(id=produit.id).update(
                        QuantiteStock=F('QuantiteStock') - panier_produit.quantite
                    )
                    logger.info(f"produit {produit} ajouté à la commande {commande.ref_code}")
                    commande.produits.add(produit)

                panier.panierproduit_set.all().delete()

            elif request.data.get('produit_slug'):
                produit = Produit.objects.select_for_update().get(slug=request.data['produit_slug'])
                if produit.QuantiteStock <= 0:
                    return Response({"error": "Produit en rupture de stock"},
                                    status=status.HTTP_400_BAD_REQUEST)

                Produit.objects.filter(id=produit.id).update(
                    QuantiteStock=F('QuantiteStock') - 1
                )
                commande.produits.add(produit)
                logger.info(f"produit {produit} ajouté à la commande {commande.ref_code}")
            else:
                logger.error(f"Données invalides pour créer une commande ,user={request.user}", exc_info=True)
                return Response({"error": "Données invalides pour créer une commande"},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = CommandeSerializer(commande)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Une erreur est survenue lors de la création de la commande:details: {str(e)}", exc_info=True)
        return Response({"error": "Une erreur est survenue lors de la création de la commande."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        if 'panier' in locals() and panier:
            panier.verrouille = False
            panier.save()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_commande(request, commande_id):
    user = request.user
    commande = get_object_or_404(Commande, id=commande_id, client=user)

    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_commande_by_refcode(request, ref_code):
    commande = get_object_or_404(Commande, ref_code=ref_code)
    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_commande_courante(request):
    commande = get_object_or_404(Commande,client=request.user,statut = 'EN_ATTENTE')
    serializer = CommandeSerializer(commande)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def liste_commandes(request):
    user = request.user
    if request.data.get('statut'):
        statut = request.data.get('statut')
        commandes = Commande.objects.filter(client=user,statut = statut).order_by('-date_commande')
    else:
        commandes = Commande.objects.filter(client=user).order_by('-date_commande')

    serializer = CommandeSerializer(commandes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def liste_commandes_en_cours(request):
    statuts = ['EN_ATTENTE','EN_COURS_LIVRAISON','PAYEE']
    commandes = Commande.objects.filter(client=request.user, statut__in=statuts).order_by('-date_commande')
    serializer = CommandeHistoriqueSerializer(commandes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def liste_commandes_historiques(request):
    statuts = ['LIVREE']
    commandes = Commande.objects.filter(client=request.user, statut__in=statuts).order_by('-date_commande')
    serializer = CommandeHistoriqueSerializer(commandes, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCommandeByClient(request, commande_id):
    with transaction.atomic():
        commande = get_object_or_404(Commande, id=commande_id, client=request.user)
        logger.info(f"tentative de suppression d'une commande par le client {request.user}")
        if commande.statut != 'EN_ATTENTE':
            return Response({"message": f"La commande {commande.ref_code} ne peut pas être supprimée"},
                            status=status.HTTP_400_BAD_REQUEST)

        for produit in commande.produits.select_for_update().all():
            Produit.objects.filter(id=produit.id).update(
                QuantiteStock=F('QuantiteStock') + 1
            )
        ref_commande = commande.ref_code
        commande.delete()
    logger.info(f"commande {ref_commande} supprimé avec succees")
    return Response({"message": f"La commande {commande.ref_code} a été supprimée"},
                    status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def deleteCommandeByAdmin(request, commande_id):
    with transaction.atomic():
        commande = get_object_or_404(Commande, id=commande_id)

        if commande.statut == 'LIVREE':
            commande.delete()
            logger.info(f"La commande {commande.ref_code} (livrée) est supprimé par le client {request.user}")

            return Response({"message": f"La commande {commande.ref_code} a été supprimée.statut = {commande.statut}"},
                            status=status.HTTP_204_NO_CONTENT)

        for produit in commande.produits.select_for_update().all():
            Produit.objects.filter(id=produit.id).update(
                QuantiteStock=F('QuantiteStock') + 1
            )

        commande.delete()

    logger.info(f"commande {commande.ref_code} supprimé par l'admin {request.user}")
    return Response({"message": f"La commande {commande.ref_code} a été supprimée"},
                    status=status.HTTP_200_OK)


class CommandeUpdateStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request,id_commande):
        user = request.user

        commande = get_object_or_404(Commande, id=id_commande, client=user)
        new_status = request.data.get('statut')
        if not new_status:
            return Response({"error":"aucun statut fourni"},status=status.HTTP_400_BAD_REQUEST)
        if new_status == 'PAYEE' and user.is_staff and user.is_superuser:
            commande.marquer_comme_payee()
        if new_status == 'LIVREE':
            commande.marquer_comme_livree()
        if new_status == 'EN_COURS_LIVRAISON' and user.is_staff and user.is_superuser:
            commande.commencer_livraison()

        return Response(status=status.HTTP_200_OK)

class CommandeUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request,id_commande):
        user = request.user
        commande = get_object_or_404(Commande, id=id_commande, client=user)
        serializer = CommandeUpdateSerializer(instance=commande,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data,status=status.HTTP_200_OK)
    

class StatsCommandes(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        total_commandes = Commande.objects.all().filter(client = user).count()
        commande_cours_livraison = Commande.objects.all().filter(client = user,statut='EN_COURS_LIVRAISON').count()
        commandes_livrees = Commande.objects.all().filter(client = user,statut='LIVREE').count()

        response_data = {
            'total_commandes': total_commandes,
            'commande_cours_livraison': commande_cours_livraison,
            'commandes_livrees': commandes_livrees,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
    