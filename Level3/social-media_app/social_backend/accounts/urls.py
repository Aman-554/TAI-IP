from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('profile/<int:id>/', views.UserProfileView.as_view(), name='profile'),
    path('follow/<int:user_id>/', views.FollowUserView.as_view(), name='follow'),
    path('unfollow/<int:user_id>/', views.UnfollowUserView.as_view(), name='unfollow'),
]