from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SuperUserCreateSerializer

from .serializers import UserSerializer, AvisSerializer,InformationsGeneralesSerializer
from accounts.models import CodeOTP,Avis, CodeOTPResetPassword, InformationsGenerales

from .utils import send_otp_via_email, send_verification_email
import random
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, logout
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

class RegisterView(APIView):
    def post(self, request):
        phone_number = request.data.get("phone_number")
        addresse_mail = request.data.get("addresse_mail")
        password = request.data.get("password")
        nom_complet = request.data.get("nom_complet")

        try:
            # Crée l'utilisateur en utilisant le CustomUserManager
            user = CustomUser.objects.create_user(
                phone_number=phone_number,
                addresse_mail=addresse_mail,
                nom_complet=nom_complet,
                password=password
            )
            send_verification_email(user)
            return Response(
                {
                    "message": "Utilisateur créé avec succès. Veuillez vérifier votre adresse e-mail pour activer votre compte."},
                status=status.HTTP_201_CREATED
            )

        except ValueError as e:
            # Gère les erreurs de validation (levées par le CustomUserManager)
            return Response(
                {"erreur_rencontre": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except IntegrityError as e:
            # Gère les erreurs d'unicité (numéro de téléphone ou adresse e-mail déjà utilisés)
            if 'phone_number' in str(e):
                return Response(
                    {"erreur_rencontre": "Ce numéro de téléphone est déjà utilisé."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif 'addresse_mail' in str(e):
                return Response(
                    {"erreur_rencontre": "Cette adresse e-mail est déjà utilisée."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {"erreur_rencontre": "Une erreur inattendue s'est produite."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            # Gère toutes les autres exceptions inattendues
            return Response(
                {"erreur_rencontre": "Une erreur inattendue s'est produite."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        user = authenticate(phone_number=phone_number, password=password)
        if not user:
            user_exists = CustomUser.objects.filter(phone_number=phone_number,is_active=False).exists()
            if user_exists:
                num_admin = InformationsGenerales.objects.first().telephone_site
                return Response(
                    {'error': f"Vérifier votre mail pour activer le compte,ou contacter l'admin sur {num_admin}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
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
    

from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser

class VerifyEmailView(APIView):
    def get(self, request):
        token = request.query_params.get('token')
        num_admin = InformationsGenerales.objects.first().telephone_site
        try:
            user = CustomUser.objects.get(verification_token=token, verification_token__isnull=False)
            if user.verification_token_expires > timezone.now():
                user.is_active = True
                user.verification_token = None
                user.verification_token_expires = None
                user.save()
                return Response({"message": "Adresse e-mail vérifiée avec succès."})
            else:
                return Response({"error": f"Le lien de vérification a expiré.Contacter l'admin sur {num_admin}"}, status=400)
        except CustomUser.DoesNotExist:
            return Response({"error": f"Token invalide.Contacter l'admin sur {num_admin}"}, status=400)

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
    def delete(self, request,id):
        user = get_object_or_404(CustomUser, id=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AvisView(APIView):
    pagination_class = CustomPagination
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        elif self.request.method == 'DELETE':
            return [IsAdminUser()]
        return []
    def get(self, request):
        list_avis = Avis.objects.all()
        
        # Appliquer la pagination
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(list_avis, request)
        
        if page is not None:
            serializer = AvisSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Si la pagination n'est pas appliquée, retourner tous les résultats
        serializer = AvisSerializer(list_avis, many=True)
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

class InformationsGeneralesView(APIView):
    
    def get_permissions(self):
        if self.request.method == 'PUT':
            return [IsAdminUser(), IsAuthenticated()]
        return []
    def get(self, request):
        informations_generales = InformationsGenerales.objects.first()
        serializer = InformationsGeneralesSerializer(informations_generales)
        return Response(serializer.data)

    def put(self, request):
        informations_generales = InformationsGenerales.objects.first()
        serializer = InformationsGeneralesSerializer(informations_generales, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientToAdmin(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def post(self,request,id_user):
        user = get_object_or_404(CustomUser, id=id_user)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return Response(status=status.HTTP_201_CREATED)

class AdminToClient(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def post(self,request,id_user):
        user = get_object_or_404(CustomUser, id=id_user)
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return Response(status=status.HTTP_201_CREATED)

class ActiveDesactiveClient(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def post(self,request,id_user):
        user = get_object_or_404(CustomUser, id=id_user)
        if user.is_active:
            user.is_active = False
        else:
            user.is_active = True
        user.save()
        return Response(status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_superuser(request):
    serializer = SuperUserCreateSerializer(data=request.data)
    if serializer.is_valid():
        if not settings.DEBUG and not request.user.is_superuser:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            serializer.save()
            return Response(
                {"message": "admin créé avec succès"},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )

    return Response(status=status.HTTP_400_BAD_REQUEST)