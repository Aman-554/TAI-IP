from rest_framework import serializers
from .models import Post
from accounts.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='get_likes_count', read_only=True)
    comments_count = serializers.IntegerField(source='get_comments_count', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'created_at', 'updated_at', 
                  'likes_count', 'comments_count']

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'image']