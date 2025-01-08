from django.shortcuts import render

# Create your views here.
"""
@api_view(['POST'])
def creer_paiement(request):
    user = verifier_user(request)
    if not user:
        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)
    paiement = Paiement.objects.create()
    serializer = PaiementSerializer(paiement)
    commande_existante = Commande.objects.filter(client=user, statut='EN_ATTENTE').first()
    commande_existante.statut = 'EN_PREPARATION'
    return Response(serializer.data, status=status.HTTP_201_CREATED)
"""