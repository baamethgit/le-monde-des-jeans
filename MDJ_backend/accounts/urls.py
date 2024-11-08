
from .views import PasswordChangeView, RegisterView,UserDetailView,deleteUserView, LoginView,VerifyOTPView,UserListView,UserCreateView,getUserBySlug,AvisView
from django.urls import path

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user/', UserDetailView.as_view()),
    path('change_password/', PasswordChangeView.as_view()),
    path('admin_users_list/',UserListView.as_view()),
    path("creer-client/",UserCreateView.as_view()),
    path("client/",UserDetailView.as_view()),  
    path("user/<str:slug>/",getUserBySlug.as_view()),
    path("delete-user/<str:slug>/",deleteUserView.as_view()),
    path('avis/',AvisView.as_view()),
    path('avis/<int:id_avis>',AvisView.as_view()),
]
