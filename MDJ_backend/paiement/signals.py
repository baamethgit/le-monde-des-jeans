from django.db.models.signals import post_save
from django.dispatch import receiver

from paiement.models import WaveCheckoutSession, Payment

@receiver(post_save, sender=WaveCheckoutSession)
def create_payment_for_wave_session(sender, instance, created, **kwargs):
    if created:
        Payment.objects.create(
            client=instance.order.client,
            ref_commande=instance.order.ref_code,
            montant=instance.order.montant,
            methode_paiement='WAVE',
            id_transaction=instance.session_id,
            statut='pending'
        )

@receiver(post_save, sender=WaveCheckoutSession)
def update_payment_status(sender, instance, **kwargs):
    try:
        payment = Payment.objects.get(ref_commande=instance.order.ref_code)
        if instance.status == 'completed':
            payment.statut = 'completed'
        elif instance.status == 'failed':
            payment.statut = 'failed'
        payment.save()
    except Payment.DoesNotExist:
        pass