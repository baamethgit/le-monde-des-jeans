from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, AvisSerializer,AvisCreationSerializer
from accounts.models import CustomUser,CodeOTP,Avis, CodeOTPResetPassword

import jwt
from .utils import send_otp_via_email
from rest_framework.exceptions import ValidationError
from MDJ_backend.settings import SECRET_KEY
import random
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, logout
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password

class RegisterView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        addresse_mail = request.data.get("addresse_mail")
        password = request.data.get("password")
        nom_complet = request.data.get("nom_complet")

        # Vérifier si l'utilisateur existe déjà
        if CustomUser.objects.filter(phone_number=phone_number).exists():
            return Response({"error": "Un compte avec ce numéro de téléphone existe déjà"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(addresse_mail=addresse_mail).exists():
            return Response({"error": "Un compte avec cet addresse mail existe déjà"}, status=status.HTTP_400_BAD_REQUEST)
        """
        # Générer un code OTP
        otp_code = random.randint(100000, 999999)

        # Envoyer le code OTP par email
        send_otp_via_email(addresse_mail, otp_code)

        expires_at = timezone.now() + timezone.timedelta(minutes=10)

        # Créer une instance de CodeOTP
        CodeOTP.objects.create(
            addresse_mail=addresse_mail,
            phone_number=phone_number,
            otp_code=str(otp_code),
            expires_at=expires_at,
            nom_complet=nom_complet,
            hashed_password=make_password(password)
        )
        return Response({"message": "Code OTP envoyé", "expires_in": 600}, status=status.HTTP_200_OK)
        
"""
        try:
            user = CustomUser(
                phone_number=phone_number,
                addresse_mail=addresse_mail,
                nom_complet=nom_complet
            )
            user.set_password(password)
            user.save()
            return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
 
class VerifyOTPView(APIView):
    def post(self, request):
        addresse_mail = request.data.get('addresse_mail')
        submitted_otp = request.data.get("otp_code")
        
        try:
            otp_record = CodeOTP.objects.get(addresse_mail=addresse_mail)
            print('OTP SEND : ', otp_record.otp_code)
        except CodeOTP.DoesNotExist:
            return Response({"error": "OTP non trouvé pour cet email"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si l'OTP est toujours valide
        if not otp_record.is_valid():
            otp_record.delete()
            return Response({"error": "Le code OTP a expiré"}, status=status.HTTP_400_BAD_REQUEST)

        if submitted_otp != otp_record.otp_code:
            otp_record.delete()
            return Response({"error": "Code OTP invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si l'utilisateur n'existe pas déjà
        if CustomUser.objects.filter(addresse_mail=addresse_mail).exists():
            otp_record.delete()
            return Response({"error": "Un compte avec cet email existe déjà"}, status=status.HTTP_400_BAD_REQUEST)

        # Créer l'utilisateur
        try:
            user = CustomUser(
                phone_number=otp_record.phone_number,
                addresse_mail=otp_record.addresse_mail,
                nom_complet=otp_record.nom_complet
            )
            user.save()
            user.password = otp_record.hashed_password
            user.save(update_fields=['password'])
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Supprimer le record OTP une fois l'utilisateur créé
        otp_record.delete()

        return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        user = authenticate(phone_number=phone_number, password=password)
        if not user:
            return Response(
                {'error': 'Identifiants invalides'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response_data = {
                'refresh': str(refresh),
                'access': str(access),
            }
            return Response(response_data, status=status.HTTP_200_OK)
    
    
class SendPasswordResetOTP(APIView):
    def post(self, request):
        addresse_mail = request.data.get('addresse_mail')

        if CustomUser.objects.filter(addresse_mail=addresse_mail).exists():
             # Générer un code OTP
            otp_code = random.randint(100000, 999999)

            # Envoyer le code OTP par email
            send_otp_via_email(addresse_mail, otp_code)

            expires_at = timezone.now() + timezone.timedelta(minutes=10)

            # Créer une instance de CodeOTP
            CodeOTPResetPassword.objects.create(
                addresse_mail=addresse_mail,
                otp_code=str(otp_code),
                expires_at=expires_at,
            )

            return Response({"message": "Code OTP envoyé", "expires_in": 600}, status=status.HTTP_200_OK)
        return Response({"error": "Ce compte n'existe pas !!"}, status=status.HTTP_400_BAD_REQUEST)
        
       

class VerifyOTPResetView(APIView):
    def post(self, request):
        addresse_mail = request.data.get('addresse_mail')
        submitted_otp = request.data.get("otp")
        
        try:
            otp_record = CodeOTPResetPassword.objects.get(addresse_mail=addresse_mail)
            print('OTP SEND : ', otp_record.otp_code)
        except CodeOTP.DoesNotExist:
            return Response({"error": "OTP non trouvé pour cet email"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si l'OTP est toujours valide
        if not otp_record.is_valid():
            otp_record.delete()
            return Response({"error": "Le code OTP a expiré"}, status=status.HTTP_400_BAD_REQUEST)

        if submitted_otp != otp_record.otp_code:
            otp_record.delete()
            return Response({"error": "Code OTP invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # # Vérifier si l'utilisateur n'existe pas déjà
        # if CustomUser.objects.filter(addresse_mail=addresse_mail).exists():
        #     user = CustomUser.objects.get(addresse_mail=addresse_mail)
        #     user.set_password(newMdp)
        #     otp_record.delete()
        #     return Response({"message": "Mot de passe changee avec succes"})


        return Response({"message": "otp valide"})

class ResetPasswordView(APIView):
    def post(self, request):
       addresse_mail = request.data['addresse_mail']
       password = request.data['newPassWord']
       user = CustomUser.objects.get(addresse_mail=addresse_mail)
       user.set_password(password)
       user.save()
       return Response({"message": "Mot de passe mise a jour !!"})

class PasswordChangeView(APIView):
    def post(self,request):
        user = request.user
        mdp_actuel = request.data['mdp_actuel']
        new_mdp = request.data['nouveau_mdp']
        if user.check_password(mdp_actuel):
            user.set_password(new_mdp)
            user.save()
            return Response({'message': 'Mot de passe modifié avec succès.'})
        else:
            raise ValidationError('mot de passe actuel incorrect')

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserListView(ListAPIView):
    serializer_class = UserSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated,IsAdminUser]
    def get_queryset(self):
        queryset = CustomUser.objects.all()
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(
                Q(phone_number__icontains=search_term) |
                Q(nom_complet__icontains=search_term) 
            )
        return queryset

class UserCreateView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    
class deleteUserView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    def delete(self, request,slug):
        user = get_object_or_404(CustomUser, slug=slug)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
"""
class getUserBySlug(RetrieveAPIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'slug'
"""

class AvisView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        list_avis = Avis.objects.all()
        serializer = AvisSerializer(list_avis,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        user = request.user
        data = request.data
        try:
            avis = Avis.objects.create(Avis_author=user)
            avis.Texte_avis = data['Texte_avis']
            avis.nbre_etoiles = data['nbre_etoiles']
            avis.save()
            return Response(AvisSerializer(avis).data, status=status.HTTP_201_CREATED)
        except:
            return Response({"error":"erreur rencontré lors de la création du témoignage"}, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request,id_avis):
        avis = get_object_or_404(Avis, pk=id_avis)
        avis.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Logout(APIView):

    def post(self, request):
        try:
            logout(request)
            return Response(
                {'message': 'Déconnexion réussie.'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'Erreur lors de la déconnexion.'},
                status=status.HTTP_400_BAD_REQUEST
            )