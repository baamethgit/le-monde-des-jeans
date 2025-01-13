from rest_framework.exceptions import AuthenticationFailed
from accounts.models import CustomUser
import jwt
from MDJ_backend.settings import SECRET_KEY
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.conf import settings
"""
def verifier_user(request):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            raise AuthenticationFailed('Unauthenticated! No auth header provided.')

        try:
            token = auth_header.split()[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid token .')
        except Exception as e:
            raise AuthenticationFailed(f'Error decoding token: {str(e)}')

        try:
            user = CustomUser.objects.get(id=payload['id'])
        except ObjectDoesNotExist:
            raise AuthenticationFailed('User not found.')
        return user
"""
# utils.py
from twilio.rest import Client

def send_otp_via_sms(phone_number, otp_code):
    # Remplace ces valeurs par tes informations d'identification Twilio
    account_sid = 'AC71adcff5e84b892fa695ba07551dc425'
    auth_token = '63ef5cfb798fe2093d030fb834bc2566'
    twilio_number = '+1 870 725 5310'  # Remplace par ton numéro Twilio

    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body=f"Votre code de validation est : {otp_code}",
        from_=twilio_number,
        to=str(phone_number) 
    )

    return message.sid  

def send_otp_via_email(email, otp_code):
    subject = 'Votre code de validation'
    message = f'Votre code de validation est : {otp_code}'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    
    send_mail(subject, message, from_email, recipient_list)
