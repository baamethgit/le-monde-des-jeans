from .views import PasswordChangeView, RegisterView,UserDetailView, LoginView, UserView,VerifyOTPView,UserListView,UserCreateView
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user/', UserView.as_view()),
    path('admin_users_list/',UserListView.as_view()),
    path("creer-client/",UserCreateView.as_view()),
    path("client/<str:phone_number>/",UserDetailView.as_view()),  
]
