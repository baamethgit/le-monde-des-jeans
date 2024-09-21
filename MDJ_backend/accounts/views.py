from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from accounts.models import CustomUser
import jwt
from .utils import verifier_user
from rest_framework.exceptions import ValidationError
from MDJ_backend.settings import SECRET_KEY


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Nouveau client créé"})


class LoginView(APIView):
    def post(self, request):
        phone_number = request.data['phone_number']
        password = request.data['password']

        user = CustomUser.objects.filter(phone_number=phone_number).first()

        if user is None:
            raise AuthenticationFailed('Identifiants incorrect')
        if not user.check_password(password):
            raise AuthenticationFailed('Identifiants incorrect')

        payload = {
            'id': user.id,
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        response = Response()
        response.data = {
            'jwt': token
        }
        return response

class UserView(APIView):
    def get(self, request):
        user = verifier_user(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = verifier_user(request)
        serializer = UserSerializer(instance = user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class PasswordChangeView(APIView):
    def post(self,request):
        user = verifier_user(request)
        mdp_actuel = request.data['mdp_actuel']
        new_mdp = request.data['nouveau_mdp']
        if user.check_password(mdp_actuel):
            user.set_password(new_mdp)
            user.save()
            return Response({'message': 'Mot de passe modifié avec succès.'})
        else:
            raise ValidationError('mot de passe actuel incorrect')