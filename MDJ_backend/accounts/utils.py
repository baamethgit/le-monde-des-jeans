from rest_framework.exceptions import AuthenticationFailed
from accounts.models import CustomUser
import jwt
from MDJ_backend.settings import SECRET_KEY
from django.core.exceptions import ObjectDoesNotExist

def verifier_user(request):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            raise AuthenticationFailed('Unauthenticated! No auth header provided.')

        token = auth_header.split()[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid token.')
        except Exception as e:
            raise AuthenticationFailed(f'Error decoding token: {str(e)}')

        try:
            user = CustomUser.objects.get(id=payload['id'])
        except ObjectDoesNotExist:
            raise AuthenticationFailed('User not found.')
        return user