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
    
# class UserDetail(RetrieveAPIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = UserSerializer
#     lookup_field = 'phone_number'
    
# class CreateUserView(CreateAPIView):
#     queryset = CustomUser.objects.all()
#     serializer_class = UserSerializer
    


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
