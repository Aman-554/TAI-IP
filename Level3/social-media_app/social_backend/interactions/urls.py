from django.urls import path
from . import views

urlpatterns = [
    path('like/<int:post_id>/', views.LikePostView.as_view(), name='like'),
    path('unlike/<int:post_id>/', views.UnlikePostView.as_view(), name='unlike'),
    path('comments/<int:post_id>/', views.CommentListView.as_view(), name='comments'),
    path('comments/delete/<int:pk>/', views.CommentDeleteView.as_view(), name='comment-delete'),
]