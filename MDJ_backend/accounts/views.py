from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, AvisSerializer,AvisCreationSerializer
from accounts.models import CustomUser,CodeOTP,Avis
import jwt
from .utils import verifier_user,send_otp_via_sms
from rest_framework.exceptions import ValidationError
from MDJ_backend.settings import SECRET_KEY
import random
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password

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

        expires_at = timezone.now() + timezone.timedelta(minutes=10)

        # Créer une instance de CodeOTP
        CodeOTP.objects.create(
            phone_number=phone_number,
            otp_code=str(otp_code),
            expires_at=expires_at,
            nom_complet=nom_complet,
            hashed_password=make_password(password)  # Hasher le mot de passe
        )

        return Response({"message": "Code OTP envoyé", "expires_in": 600}, status=status.HTTP_200_OK)
 
class VerifyOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        submitted_otp = request.data.get("otp_code")

        try:
            otp_record = CodeOTP.objects.get(phone_number=phone_number)
        except CodeOTP.DoesNotExist:
            return Response({"error": "OTP non trouvé pour ce numéro"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si l'OTP est toujours valide
        if not otp_record.is_valid():
            otp_record.delete()
            return Response({"error": "Le code OTP a expiré"}, status=status.HTTP_400_BAD_REQUEST)

        if submitted_otp != otp_record.otp_code:
            otp_record.delete()
            return Response({"error": "Code OTP invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si l'utilisateur n'existe pas déjà
        if CustomUser.objects.filter(phone_number=phone_number).exists():
            otp_record.delete()
            return Response({"error": "Un compte avec ce numéro de téléphone existe déjà"}, status=status.HTTP_400_BAD_REQUEST)

        # Créer l'utilisateur
        try:
            user = CustomUser(phone_number=otp_record.phone_number,nom_complet=otp_record.nom_complet)
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
        
        if user is not None:
            payload = {
                'id': user.id,
            }

            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
            response = Response(status=status.HTTP_200_OK)
            response.data = {
                'jwt': token
            }
            return response                    
        return Response({"error": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED)
    
    


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

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserListView(ListAPIView):
    serializer_class = UserSerializer
    pagination_class = CustomPagination

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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):

    def get(self, request):
        user = verifier_user(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = verifier_user(request)
        serializer = UserSerializer(user, data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    
class deleteUserView(APIView):
    def delete(self, request,slug):
        user = get_object_or_404(CustomUser, slug=slug)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class getUserBySlug(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'slug'
    
class AvisView(APIView):
    def get(self,request):
        list_avis = Avis.objects.all()
        serializer = AvisSerializer(list_avis,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        verifier_user(request)
        serializer = AvisCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request,id_avis):
        avis = get_object_or_404(Avis, pk=id_avis)
        avis.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)