# from django.db import models
# from .models import Commande


# class Payment(models.Model):
#     PAYMENT_METHODS = (
#         ('ORANGE_MONEY', 'Orange Money'),
#         ('WAVE', 'Wave'),
#     )
#     commande = models.OneToOneField(Commande, on_delete=models.CASCADE)
#     amount = models.DecimalField(max_digits=10, decimal_places=2)
#     currency = models.CharField(max_length=3)
#     status = models.CharField(max_length=20)
#     payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.payment_method} payment for Order {self.order.id}"

# class WavePayment(models.Model):
#     payment = models.OneToOneField(Payment, on_delete=models.CASCADE, primary_key=True)
#     wave_session_id = models.CharField(max_length=100)
#     client_reference = models.CharField(max_length=100)
#     wave_launch_url = models.URLField()

#     def __str__(self):
#         return f"Wave payment for Order {self.payment.order.id}"

# class OrangeMoneyPayment(models.Model):
#     payment = models.OneToOneField(Payment, on_delete=models.CASCADE, primary_key=True)
#     orange_transaction_id = models.CharField(max_length=100)
#     phone_number = models.CharField(max_length=20)

#     def __str__(self):
#         return f"Orange Money payment for Order {self.payment.order.id}"

# # class Payment(models.Model):
# #     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# #     amount = models.DecimalField(max_digits=10, decimal_places=2)
# #     currency = models.CharField(max_length=3)
# #     status = models.CharField(max_length=20)
# #     created_at = models.DateTimeField(auto_now_add=True)
# #     updated_at = models.DateTimeField(auto_now=True)

# #     class Meta:
# #         abstract = True

# # class WavePayment(Payment):
# #     wave_session_id = models.CharField(max_length=100)
# #     client_reference = models.CharField(max_length=100)
# #     wave_launch_url = models.URLField()

# # class OrangeMoneyPayment(Payment):
# #     orange_transaction_id = models.CharField(max_length=100)
# #     phone_number = models.CharField(max_length=20)
    