import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

// Add token to all requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Auth endpoints
export const register = (userData) => API.post('accounts/register/', userData);
export const login = (userData) => API.post('accounts/login/', userData);

// User endpoints
export const getProfile = (userId) => API.get(`accounts/profile/${userId}/`);
export const followUser = (userId) => API.post(`accounts/follow/${userId}/`);
export const unfollowUser = (userId) => API.post(`accounts/unfollow/${userId}/`);

// Post endpoints
export const getFeed = () => API.get('posts/feed/');
export const getUserPosts = () => API.get('posts/');
export const createPost = (postData) => API.post('posts/', postData);
export const deletePost = (postId) => API.delete(`posts/${postId}/`);

// Interaction endpoints
export const likePost = (postId) => API.post(`interactions/like/${postId}/`);
export const unlikePost = (postId) => API.delete(`interactions/unlike/${postId}/`);
export const getComments = (postId) => API.get(`interactions/comments/${postId}/`);
export const addComment = (postId, content) => API.post(`interactions/comments/${postId}/`, { content });
export const deleteComment = (commentId) => API.delete(`interactions/comments/delete/${commentId}/`);

export default API;