from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from posts.models import Post
from .models import Like, Comment
from .serializers import CommentSerializer

class LikePostView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like, created = Like.objects.get_or_create(user=request.user, post=post)
            if created:
                return Response({'message': 'Post liked'})
            return Response({'message': 'Already liked'}, status=400)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)

class UnlikePostView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            Like.objects.filter(user=request.user, post=post).delete()
            return Response({'message': 'Post unliked'})
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)

class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user == request.user or comment.post.user == request.user:
            return self.destroy(request, *args, **kwargs)
        return Response({'error': 'You cannot delete this comment'}, status=403)