import React, { useState } from 'react';
import { createPost } from '../services/api';

function PostForm({ onPostCreated, onCancel }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const MAX_CHARS = 1000;

    const handleContentChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setContent(text);
            setCharCount(text.length);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim() && !image) {
            alert('Please add some content or an image');
            return;
        }

        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            await createPost(formData);
            setContent('');
            setImage(null);
            setImagePreview(null);
            setCharCount(0);
            if (onPostCreated) onPostCreated();
            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <div className="post-form-header">
                <h3>Create New Post</h3>
            </div>
            
            <textarea
                className="post-form-textarea"
                placeholder="What's on your mind? 🤔"
                value={content}
                onChange={handleContentChange}
                rows="4"
            />
            
            <div className="post-form-char-counter">
                {charCount}/{MAX_CHARS} characters
            </div>
            
            {imagePreview && (
                <div className="post-form-image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" onClick={removeImage} className="remove-image-btn">
                        ✕
                    </button>
                </div>
            )}
            
            <div className="post-form-actions">
                <label className="image-upload-label">
                    📸 Add Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </label>
                
                <div className="post-form-buttons">
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                    <button type="submit" disabled={isLoading} className="submit-btn">
                        {isLoading ? 'Posting...' : '📤 Post'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default PostForm;