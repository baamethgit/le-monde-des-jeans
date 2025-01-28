from django.db.models.signals import post_save
from django.dispatch import receiver
from loguru import logger
from paiement.models import WaveCheckoutSession, Payment

@receiver(post_save, sender=WaveCheckoutSession)
def create_payment_for_wave_session(sender, instance, created, **kwargs):
    if created:
        logger.info(f"création d'un objet paiement pour la session")
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
            logger.info(f"payment updated to completed for order : {instance.order.ref_code}")
        elif instance.status == 'failed':
            logger.warning(f"payment status updated to failed for order : {instance.order.ref_code}")
            payment.statut = 'failed'
        payment.save()
    except Payment.DoesNotExist:
        logger.warning("le paiement associé à la session n'existe pas . Création d'un nouveau objet payment")
        payment = Payment.objects.create(
            client=instance.order.client,
            ref_commande=instance.order.ref_code,
            montant=instance.order.montant,
            methode_paiement='WAVE',
            id_transaction=instance.session_id
        )
        if instance.status == 'completed':
            payment.statut = 'completed'
            logger.info(f"payment created as completed for order : {instance.order.ref_code}")
        elif instance.status == 'failed':
            payment.statut = 'failed'
            logger.warning(f"payment created with status failed for order : {instance.order.ref_code}")

        payment.save()

