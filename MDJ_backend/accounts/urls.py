from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import PasswordChangeView, ResetPasswordView, RegisterView, UserDetailView, deleteUserView, LoginView, \
    VerifyOTPView, UserListView, UserCreateView, VerifyOTPResetView, SendPasswordResetOTP, AvisView, Logout, \
    create_superuser, InformationsGeneralesView

VerifyOTPView, UserListView, UserCreateView, VerifyOTPResetView, SendPasswordResetOTP, AvisView, Logout, InformationsGeneralesView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()


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
    #path("user/<str:slug>/",getUserBySlug.as_view()),
    path("delete-user/<str:slug>/",deleteUserView.as_view()),
    path('avis/',AvisView.as_view()),
    path('avis/<int:id_avis>',AvisView.as_view()),
    path('create-superuser/', create_superuser, name='create_superuser'),
    path('InfosGen/', InformationsGeneralesView.as_view()),
    path('InfosGen/update', InformationsGeneralesView.as_view()),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout_view'),

]
