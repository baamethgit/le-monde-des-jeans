# validators.py
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_phone_number_senegal(value):
    """
    Valide que le numéro de téléphone est un numéro sénégalais valide.
    """
    # Vérifie que le numéro commence par +221 et a 9 chiffres après
    if not value.startswith('+221'):
        raise ValidationError(
            _('Le numéro de téléphone doit commencer par +221.'),
            code='invalid_prefix'
        )

    # Vérifie que le numéro a exactement 9 chiffres après +221
    if len(value) != 13 or not value[4:].isdigit():
        raise ValidationError(
            _('Le numéro de téléphone doit contenir 9 chiffres(+221 non inclus).'),
            code='invalid_length'
        )

    # Vérifie que le préfixe est valide (77, 78, 76, 70, etc.)
    prefix = value[4:6]  # Les deux premiers chiffres après +221
    valid_prefixes = ['77', '78', '76', '70', '75', '33', '30']
    if prefix not in valid_prefixes:
        raise ValidationError(
            _(f'Le préfixe {prefix} n\'est pas valide pour un numéro sénégalais.'),
            code='invalid_prefix'
        )