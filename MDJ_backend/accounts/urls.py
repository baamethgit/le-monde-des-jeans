from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import PasswordChangeView, ResetPasswordView, RegisterView, UserDetailView, deleteUserView, LoginView, \
    create_superuser, VerifyEmailView, ClientToAdmin, ActiveDesactiveClient, AdminToClient, UserListView, AvisView, \
    Logout, InformationsGeneralesView, VerifyEmailCPWView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()


from django.urls import path

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user/', UserDetailView.as_view()),

    path('update_user_to_admin/<int:id_user>/', ClientToAdmin.as_view()),
    path('update_admin_to_client/<int:id_user>/', AdminToClient.as_view()),
    path('active_desactive_user/<int:id_user>/', ActiveDesactiveClient.as_view()),

    path('change_password/', PasswordChangeView.as_view()),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('init_reset-password/', ResetPasswordView.as_view()),
    path('reset-password/', VerifyEmailCPWView.as_view()),
    path('admin_users_list/',UserListView.as_view()),
    #path("creer-client/",UserCreateView.as_view()),
    path("client/",UserDetailView.as_view()),
    path("delete-user/<int:id>/",deleteUserView.as_view()),
    path('avis/',AvisView.as_view()),
    path('avis/<int:id_avis>',AvisView.as_view()),
    path('create-superuser/', create_superuser, name='create_superuser'),
    path('InfosGen/', InformationsGeneralesView.as_view()),
    path('InfosGen/update', InformationsGeneralesView.as_view()),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout_view'),

]
