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
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import authenticate


class RegisterView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        password = request.data.get("password")
        nom_complet = request.data.get("nom_complet")

        # Vérifier si l'utilisateur existe déjà
        if CustomUser.objects.filter(phone_number=phone_number).exists():
            return Response({"error": "Un compte avec ce numéro de téléphone existe déjà"}, status=status.HTTP_400_BAD_REQUEST)

        # Générer un code OTP
        otp_code = random.randint(100000, 999999)

        # Envoyer le code OTP par SMS
        send_otp_via_sms(phone_number, otp_code)

        # Stocker temporairement les informations d'inscription
        request.session['phone_number'] = phone_number
        request.session['password'] = password
        request.session['nom_complet'] = nom_complet
        request.session['otp_code'] = str(otp_code)

        return Response({"message": "Code OTP envoyé"}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    def post(self, request):
        phone_number = request.session.get('phone_number')
        stored_otp = request.session.get('otp_code')
        password = request.session.get("password")
        nom_complet = request.session.get("nom_complet")
        submitted_otp = request.data.get("otp_code")

        if not all([phone_number, stored_otp, password, nom_complet, submitted_otp]):
            return Response({"error": "Informations d'inscription incomplètes"}, status=status.HTTP_400_BAD_REQUEST)

        if submitted_otp != stored_otp:
            return Response({"error": "Code OTP invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier à nouveau si l'utilisateur n'existe pas déjà
        if CustomUser.objects.filter(phone_number=phone_number).exists():
            return Response({"error": "Un compte avec ce numéro de téléphone existe déjà"}, status=status.HTTP_400_BAD_REQUEST)

        # Créer l'utilisateur
        user_data = {
            'phone_number': phone_number,
            'nom_complet': nom_complet,
            'password': password
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            # Nettoyer les données de session
            for key in ['phone_number', 'password', 'nom_complet', 'otp_code']:
                if key in request.session:
                    del request.session[key]
            return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(APIView):
#     def post(self, request):
#         phone_number = request.data['phone_number']
#         password = request.data['password']

#         user = CustomUser.objects.filter(phone_number=phone_number).first()

#         if user is None:
#             raise AuthenticationFailed('Identifiants incorrect')
#         if not user.check_password(password):
#             raise AuthenticationFailed('Identifiants incorrect')

#         payload = {
#             'id': user.id,
#         }

#         token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
#         response = Response()
#         response.data = {
#             'jwt': token
#         }
#         return response


class LoginView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        user = authenticate(phone_number=phone_number, password=password)
        
        if user is not None:
            
            refresh = RefreshToken.for_user(user)
            
            response = Response({
                "message": "Connexion réussie",
                "user": {
                    "phone_number": str(user.phone_number),
                    "nom_complet": user.nom_complet,
                    # Ajoutez d'autres champs utilisateur si nécessaire
                }
            }, status=status.HTTP_200_OK)
            
            # # Configurer les cookies
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=str(refresh.access_token),
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=str(refresh),
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            
            return response
            
        
        return Response({"error": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        return response
    
class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"authenticated": True})
    
class UserView(APIView):
    def get(self, request):
        # user = verifier_user(request)
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

class UserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class UserCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get_object(self, phone_number):
        try:
            return CustomUser.objects.get(phone_number=phone_number)
        except CustomUser.DoesNotExist:
            return None

    def get(self, request, phone_number):
        user = self.get_object(phone_number)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, phone_number):
        user = self.get_object(phone_number)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, phone_number):
        user = self.get_object(phone_number)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
