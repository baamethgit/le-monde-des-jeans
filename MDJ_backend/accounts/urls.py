from .views import PasswordChangeView, RegisterView,UserDetailView, LoginView, UserView,VerifyOTPView,UserListView,UserCreateView
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from shop import views as shopView

router = DefaultRouter()
# router.register(r'users', vie.UserViewSet)
router.register(r'Avis', shopView.AvisViewSet, basename='avis')


urlpatterns = [
    # path('register/', RegisterView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('login/', LoginView.as_view()),
    path('admin_users_list/',UserListView.as_view()),
    path("creer-client/",UserCreateView.as_view()),
    path("client/<str:phone_number>/",UserDetailView.as_view()), 
    path("avisAPI/", include(router.urls)),
]
