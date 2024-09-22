from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from accounts.models import CustomUser,CodeOTP
import jwt
from .utils import verifier_user,send_otp_via_sms
from rest_framework.exceptions import ValidationError
from MDJ_backend.settings import SECRET_KEY
import random
from rest_framework import status
from rest_framework.response import Response

# Create your views here.
# class RegisterView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response({"message": "Nouveau client créé"})

class RegisterView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        password = request.data.get("password")

        # Générer un code OTP
        otp_code = random.randint(100000, 999999)

        # Envoyer le code OTP par SMS
        send_otp_via_sms(phone_number, otp_code)

        # Enregistrer le code OTP en base de données
        user = CustomUser.objects.get(phone_number=phone_number)
        CodeOTP.objects.create(client=user, code=otp_code)

        # Stocker temporairement le mot de passe
        request.session['phone_number'] = phone_number
        request.session['password'] = password

        return Response({"message": "Code OTP envoyé"}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        otp_code = request.data.get("otp_code")
        password = request.data.get("password")  # Assurez-vous que le mot de passe est envoyé ici

        try:
            user = CustomUser.objects.get(phone_number=phone_number)
            saved_otp = CodeOTP.objects.filter(client=user).last()

            if saved_otp.code == otp_code and saved_otp.is_valid():
                # Utilisation du sérialiseur pour créer l'utilisateur
                user_data = {
                    'phone_number': phone_number,
                    'nom_complet': user.nom_complet,  # Si tu as besoin d'autres champs
                    'password': password
                }
                serializer = UserSerializer(data=user_data)
                serializer.is_valid(raise_exception=True)
                serializer.save()

                return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Code OTP invalide ou expiré"}, status=status.HTTP_400_BAD_REQUEST)
        except (CustomUser.DoesNotExist, CodeOTP.DoesNotExist):
            return Response({"error": "Utilisateur ou code OTP non trouvé"}, status=status.HTTP_404_NOT_FOUND)


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