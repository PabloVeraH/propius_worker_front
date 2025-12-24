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

    // Handle 401 and refresh token logic here if needed
    // For now, just reject
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Redirect to login or refresh token
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
