'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, LoginCredentials, AuthResponse } from '@/types/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          // Verify token and get user info
          // const { data } = await api.get<User>('/auth/me');
          // setUser(data);

          // Mock user for now if API is not ready
          setUser({
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            isAdmin: true,
            isAdminCommunity: true,
            isWorker: false,
            isOwner: false,
            isTenant: false,
            role: 'ADMIN',
            adminCommunities: [],
            workerCommunities: [],
            communities: [],
            ownedProperties: [],
            rentedProperties: [],
          });
        } catch (error) {
          console.error('Auth check failed', error);
          Cookies.remove('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post<any>('/auth/login', credentials);
      const rawData = response.data;

      // Handle potential nested data structure and snake_case properties
      const payload = rawData.data || rawData;

      const accessToken = payload.accessToken || payload.access_token;
      const refreshToken = payload.refreshToken || payload.refresh_token;
      const user = payload.user;

      console.log('Processed auth payload:', {
        hasAccessToken: !!accessToken,
        hasUser: !!user,
        user
      });

      if (!user || !accessToken) {
        console.error('Invalid response structure:', payload);
        throw new Error('Invalid response structure');
      }

      // Enforce Admin or Worker access
      // Enforce Admin or Worker access
      if (!user.isAdmin && !user.isWorker && !user.isAdminCommunity) {
        console.warn('Login rejected: User is not Admin or Worker', user);
        toast.error('Acceso denegado: Solo administradores o trabajadores pueden ingresar.');
        return;
      }

      Cookies.set('token', accessToken, { expires: 7 });
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30 });
      }

      console.log('Setting user state:', user);
      setUser(user);

      toast.success('Inicio de sesión exitoso');

      // Determine redirection based on communities
      const communities = [
        ...(user.adminCommunities || []),
        ...(user.workerCommunities || [])
      ];
      const uniqueCommunities = Array.from(new Map(communities.map((c: any) => [c.id, c])).values());

      setTimeout(() => {
        if (uniqueCommunities.length === 1) {
          console.log('Single community found, redirecting to dashboard and setting active community');
          Cookies.set('activeCommunityId', uniqueCommunities[0].id);
          router.push('/dashboard');
        } else if (uniqueCommunities.length > 1) {
          console.log('Multiple communities found, redirecting to selection page');
          router.push('/select-community');
        } else {
          console.warn('No communities found for this user');
          toast.error('No tienes comunidades asignadas.');
        }
      }, 100);
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Error al iniciar sesión');
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('activeCommunityId');
    setUser(null);
    router.push('/login');
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
