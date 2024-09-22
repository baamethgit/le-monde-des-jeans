from .views import PasswordChangeView, RegisterView, LoginView, UserView,VerifyOTPView
from django.urls import path

urlpatterns = [
    # path('register/', RegisterView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('change_password/',PasswordChangeView.as_view()),
]
