import React, { useState } from 'react';
import { deleteComment } from '../services/api';

function Comment({ comment, postUserId, onCommentDeleted }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const currentUserId = localStorage.getItem('userId');

    // Check if current user can delete this comment
    const canDelete = currentUserId === comment.user?.id.toString() || 
                     currentUserId === postUserId.toString();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        setIsDeleting(true);
        try {
            await deleteComment(comment.id);
            if (onCommentDeleted) onCommentDeleted(comment.id);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="comment-item">
            <div className="comment-avatar">
                {comment.user?.profile_picture ? (
                    <img src={comment.user.profile_picture} alt={comment.user.username} />
                ) : (
                    <div className="avatar-placeholder">
                        {comment.user?.username?.[0]?.toUpperCase()}
                    </div>
                )}
            </div>
            <div className="comment-content">
                <div className="comment-header">
                    <span className="comment-username">{comment.user?.username}</span>
                    <span className="comment-time">{formatDate(comment.created_at)}</span>
                </div>
                <p className="comment-text">{comment.content}</p>
            </div>
            {canDelete && (
                <button 
                    className="comment-delete-btn" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? '...' : '🗑️'}
                </button>
            )}
        </div>
    );
}

export default Comment;