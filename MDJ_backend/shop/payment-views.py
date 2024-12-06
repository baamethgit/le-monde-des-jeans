import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse,HttpResponse
from .models import Commande
import requests
from django.conf import settings
from django.http import JsonResponse


@csrf_exempt
def wave_webhook(request):
    # Vérifiez la signature du webhook (à implémenter pour la sécurité)
    payload = json.loads(request.body)
    if payload['type'] == 'checkout.session.completed':
        # Mettez à jour le statut de la commande
        order_ref = payload['data']['client_reference']
        order = Commande.objects.get(ref_code=order_ref)
        order.statut = 'PAYEE'
        order.save()
    return HttpResponse(status=200)



def create_wave_session(request,commande:Commande):
    headers = {
        'Authorization': f'Bearer {settings.WAVE_SECRET_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'amount': request.POST.get('amount'),
        'currency': 'XOF',  # ou la devise appropriée
        'client_reference': commande.ref_code,  # identifiant unique de la commande
        'success_url': 'https://votresite.com/paiement-reussi/',
        'error_url': 'https://votresite.com/paiement-echoue/'
    }
    response = requests.post(settings.WAVE_API_ENDPOINT, json=data, headers=headers)
    if response.status_code == 200:
        return JsonResponse(response.json())
    return JsonResponse({'error': 'Erreur lors de la création de la session'}, status=400)