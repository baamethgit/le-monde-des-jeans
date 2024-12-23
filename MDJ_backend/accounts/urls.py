

from .views import PasswordChangeView,ResetPasswordView, RegisterView,UserDetailView,deleteUserView, LoginView,VerifyOTPView,UserListView,UserCreateView,getUserBySlug, VerifyOTPResetView, SendPasswordResetOTP
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from shop import views as shopView

router = DefaultRouter()
# router.register(r'users', vie.UserViewSet)
router.register(r'Avis', shopView.AvisViewSet, basename='avis')
# router.register(r'panier-produits', shopView.PanierProduitViewSet)  # Ajout des routes pour PanierProduit
# router.register(r'paniers', shopView.PanierViewSet)  # Ajout des routes pour Panier


from django.urls import path

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user/', UserDetailView.as_view()),
    path('change_password/', PasswordChangeView.as_view()),
    path('send-otp/', SendPasswordResetOTP.as_view()),
    path('verify-reset-otp/', VerifyOTPResetView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
    path('admin_users_list/',UserListView.as_view()),
    path("creer-client/",UserCreateView.as_view()),
    path("client/",UserDetailView.as_view()),  
    path("user/<str:slug>/",getUserBySlug.as_view()),
    path("delete-user/<str:slug>/",deleteUserView.as_view()),
    path('avis/',AvisView.as_view()),
    path('avis/<int:id_avis>',AvisView.as_view()),
]
