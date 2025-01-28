from django.core.mail import send_mail
from django.conf import settings


import environ

env = environ.Env()
environ.Env.read_env()


FRONTEND_URL = env("FRONTEND_URL")

def send_verification_email(user):
    verification_url = f"{FRONTEND_URL}/verify-email?token={user.verification_token}"
    subject = "Validation de la création de votre compte sur LeMondeDesJeans"
    message = f"Cliquez sur ce lien pour vérifier votre adresse e-mail et activer votre compte : {verification_url}  ."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.addresse_mail])


def send_resetpassword_email(user):
    verification_url = f"{FRONTEND_URL}/cpw-verify-email?token={user.reset_password_token}"
    subject = "Réinitialisation de mot de passe"
    message = f"Cliquez sur ce lien pour vérifier votre adresse e-mail et modifier votre mot de passe : {verification_url}  ."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.addresse_mail])