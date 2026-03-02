import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    const activeCommunityId = Cookies.get('activeCommunityId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeCommunityId) {
      config.headers['x-active-community-id'] = activeCommunityId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear all session data
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('activeCommunityId');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        // Only redirect if not already on the login page to avoid loops
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
