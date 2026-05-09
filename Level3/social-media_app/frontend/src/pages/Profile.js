import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, getUserPosts, deletePost, likePost, unlikePost } from '../services/api';
import FollowButton from '../components/FollowButton';
import Post from '../components/Post';

function Profile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const currentUserId = localStorage.getItem('userId');
    const isOwnProfile = currentUserId === userId;

    useEffect(() => {
        loadProfile();
        loadUserPosts();
    }, [userId]);

    const loadProfile = async () => {
        try {
            const response = await getProfile(userId);
            setProfile(response.data);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const loadUserPosts = async () => {
        try {
            const response = await getUserPosts();
            // Filter posts for this specific user (if viewing other's profile)
            let userPosts = response.data;
            if (!isOwnProfile) {
                userPosts = response.data.filter(post => post.user?.id == userId);
            }
            setPosts(userPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        try {
            await deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const handleLike = async (postId) => {
        try {
            await likePost(postId);
            await loadUserPosts();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async (postId) => {
        try {
            await unlikePost(postId);
            await loadUserPosts();
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;
    if (!profile) return <div className="error">User not found</div>;

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {profile.profile_picture ? (
                        <img src={profile.profile_picture} alt={profile.username} />
                    ) : (
                        <div className="avatar-large">
                            {profile.username?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
                
                <div className="profile-info">
                    <div className="profile-username-section">
                        <h2>{profile.username}</h2>
                        {!isOwnProfile && (
                            <FollowButton userId={userId} onFollowChange={loadProfile} />
                        )}
                    </div>
                    
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-number">{posts.length}</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{profile.followers_count || 0}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{profile.following_count || 0}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                    
                    {profile.bio && (
                        <div className="profile-bio">
                            <p>{profile.bio}</p>
                        </div>
                    )}
                    
                    <div className="profile-email">
                        📧 {profile.email}
                    </div>
                    
                    <div className="profile-joined">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="profile-tabs">
                <button 
                    className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    📝 Posts
                </button>
                {isOwnProfile && (
                    <button 
                        className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('drafts')}
                    >
                        💾 Saved
                    </button>
                )}
            </div>
            
            {/* Posts Grid */}
            <div className="profile-posts">
                {activeTab === 'posts' && (
                    <>
                        {posts.length === 0 ? (
                            <div className="no-posts">
                                <p>No posts yet</p>
                                {isOwnProfile && (
                                    <button onClick={() => window.location.href = '/create'}>
                                        Create your first post
                                    </button>
                                )}
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="profile-post-item">
                                    <Post
                                        post={post}
                                        onLike={handleLike}
                                        onUnlike={handleUnlike}
                                        onCommentAdded={loadUserPosts}
                                    />
                                    {isOwnProfile && (
                                        <button 
                                            className="delete-post-btn"
                                            onClick={() => handleDeletePost(post.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                )}
                
                {activeTab === 'drafts' && isOwnProfile && (
                    <div className="drafts-section">
                        <p>Coming soon: Save posts feature</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;