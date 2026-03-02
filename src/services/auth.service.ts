import { api } from '@/lib/api';
import { User, LoginCredentials } from '@/types/auth';

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<{ data?: { accessToken?: string; access_token?: string; refreshToken?: string; refresh_token?: string; user: User }; accessToken?: string; access_token?: string; refreshToken?: string; refresh_token?: string; user?: User }>('/auth/login', credentials),

  me: () =>
    api.get<User>('/auth/me'),
};
