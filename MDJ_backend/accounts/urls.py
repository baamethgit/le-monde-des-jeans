
from .views import PasswordChangeView, RegisterView,UserDetailView, LoginView, UserView,VerifyOTPView,UserListView,UserCreateView
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from shop import views as shopView

router = DefaultRouter()
# router.register(r'users', vie.UserViewSet)
router.register(r'Avis', shopView.AvisViewSet, basename='avis')


from .views import PasswordChangeView,deleteUserView,getUserBySlug, RegisterView,UserDetailView, LoginView,VerifyOTPView,UserListView,UserCreateView
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-user/', UserDetailView.as_view()),
    path('change_password/', PasswordChangeView.as_view()),
    path('admin_users_list/',UserListView.as_view()),
    path("creer-client/",UserCreateView.as_view()),
    path("client/<str:phone_number>/",UserDetailView.as_view()), 
    path("avisAPI/", include(router.urls)),
    path("client/",UserDetailView.as_view()),  
     path("user/<str:slug>/",getUserBySlug.as_view()),
     path("delete-user/<str:slug>/",deleteUserView.as_view()),
]
