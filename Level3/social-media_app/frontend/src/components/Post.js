import React, { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '../services/api';

function Post({ post, onLike, onUnlike, onCommentAdded }) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        if (showComments) {
            loadComments();
        }
    }, [showComments]);

    const loadComments = async () => {
        try {
            const response = await getComments(post.id);
            setComments(response.data);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await addComment(post.id, commentText);
            setCommentText('');
            await loadComments();
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            await loadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const isLiked = () => {
        // Check if current user liked this post (implement based on your API response)
        return false; // Placeholder
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <strong>{post.user?.username}</strong>
                <small>{new Date(post.created_at).toLocaleString()}</small>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post" className="post-image" />}
            </div>
            <div className="post-actions">
                <button onClick={() => isLiked() ? onUnlike(post.id) : onLike(post.id)}>
                    ❤️ {post.likes_count || 0} Likes
                </button>
                <button onClick={() => setShowComments(!showComments)}>
                    💬 {post.comments_count || 0} Comments
                </button>
            </div>
            
            {showComments && (
                <div className="comments-section">
                    <form onSubmit={handleAddComment}>
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <strong>{comment.user?.username}:</strong> {comment.content}
                            {(comment.user?.id == currentUserId || post.user?.id == currentUserId) && (
                                <button onClick={() => handleDeleteComment(comment.id)}>🗑️</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Post;