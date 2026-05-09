import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';

function CreatePost() {
    const navigate = useNavigate();

    const handlePostCreated = () => {
        // Navigate back to feed after 1 second
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="create-post-container">
            <div className="create-post-card">
                <PostForm 
                    onPostCreated={handlePostCreated}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}

export default CreatePost;