export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = [
  { id: 'MERN', label: 'MERN Stack', icon: '🚀' },
  { id: 'DSA', label: 'Data Structures', icon: '📊' },
  { id: 'AI/ML', label: 'AI & ML', icon: '🤖' },
  { id: 'Java', label: 'Java', icon: '☕' },
  { id: 'Python', label: 'Python', icon: '🐍' }
];

export const STREAK_BADGES = {
  7: '🔥 7 Day Streak',
  30: '⭐ 30 Day Streak',
  100: '🏆 100 Day Streak Legend'
};

export const DEFAULT_THUMBNAIL = 'https://via.placeholder.com/300x200';

export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

export const APP_NAME = 'LearnHub LMS';
export const APP_DESCRIPTION = 'Master tech skills with structured learning paths';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ROADMAP: '/roadmap/:id',
  LESSON: '/lesson/:id'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  ROADMAPS: '/roadmaps',
  LESSONS: '/lessons',
  ADMIN: {
    USERS: '/admin/users',
    ROADMAPS: '/admin/roadmaps',
    MODULES: '/admin/modules',
    LESSONS: '/admin/lessons'
  }
};