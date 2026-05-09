import React, { useState, useEffect } from 'react';
import { getFeed, likePost, unlikePost, getComments, addComment } from '../services/api';
import Post from '../components/Post';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            const response = await getFeed();
            setPosts(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await likePost(postId);
            loadFeed(); // Refresh feed
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async (postId) => {
        try {
            await unlikePost(postId);
            loadFeed();
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    if (loading) return <div className="loading">Loading feed...</div>;

    return (
        <div className="feed-container">
            <h2>Your Feed</h2>
            {posts.length === 0 ? (
                <p>Follow some users to see their posts!</p>
            ) : (
                posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onUnlike={handleUnlike}
                        onCommentAdded={loadFeed}
                    />
                ))
            )}
        </div>
    );
}

export default Feed;