import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser, getProfile } from '../services/api';

function FollowButton({ userId, onFollowChange }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        checkFollowStatus();
    }, [userId]);

    const checkFollowStatus = async () => {
        if (currentUserId === userId.toString()) return;
        
        try {
            const response = await getProfile(userId);
            // Check if current user is in followers list
            // Note: You might need to modify backend to include this info
            // For now, we'll just get the follower count
            setFollowerCount(response.data.followers_count || 0);
            
            // Try to get follow status from API
            // If your backend doesn't provide it, you can track locally
            const storedStatus = localStorage.getItem(`follow_${userId}`);
            if (storedStatus) {
                setIsFollowing(storedStatus === 'true');
            }
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            await followUser(userId);
            setIsFollowing(true);
            setFollowerCount(prev => prev + 1);
            localStorage.setItem(`follow_${userId}`, 'true');
            if (onFollowChange) onFollowChange(true);
        } catch (error) {
            console.error('Error following user:', error);
            alert('Failed to follow user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setIsLoading(true);
        try {
            await unfollowUser(userId);
            setIsFollowing(false);
            setFollowerCount(prev => Math.max(0, prev - 1));
            localStorage.setItem(`follow_${userId}`, 'false');
            if (onFollowChange) onFollowChange(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
            alert('Failed to unfollow user');
        } finally {
            setIsLoading(false);
        }
    };

    // Don't show follow button for current user
    if (currentUserId === userId.toString()) {
        return null;
    }

    return (
        <div className="follow-button-container">
            <button
                className={`follow-btn ${isFollowing ? 'following' : 'not-following'}`}
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={isLoading}
            >
                {isLoading ? (
                    '...'
                ) : isFollowing ? (
                    'Following ✓'
                ) : (
                    'Follow +'
                )}
            </button>
            {followerCount > 0 && (
                <span className="follower-count">{followerCount} followers</span>
            )}
        </div>
    );
}

export default FollowButton;