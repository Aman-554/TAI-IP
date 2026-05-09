from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='posts'),
    path('feed/', views.FeedView.as_view(), name='feed'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
]