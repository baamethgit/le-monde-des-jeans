from .views import PasswordChangeView, RegisterView, LoginView, UserView
from django.urls import path

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('change_password/',PasswordChangeView.as_view()),
]
