'use client';

// TODO (B-06 — security): The token is currently stored in a js-cookie accessible
// from JavaScript, which means it is vulnerable to XSS.
// Long-term fix: migrate to HttpOnly cookies managed by Next.js Route Handlers
// (app/api/auth/login, app/api/auth/me, app/api/auth/logout) so the token is
// never accessible from client-side JS. See informe.txt B-06 for details.

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, AuthResponse } from '@/types/auth';
import { authService } from '@/services/auth.service';
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
          // Verify token against the server and get up-to-date user info
          const { data } = await authService.me();
          setUser(data);
        } catch (error) {
          // Token is invalid or expired — clear session and redirect
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          Cookies.remove('activeCommunityId');
          localStorage.removeItem('user');
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const rawData = response.data;

      // Handle potential nested data structure and snake_case properties
      const payload = rawData.data || rawData;

      const accessToken = payload.accessToken || payload.access_token;
      const refreshToken = payload.refreshToken || payload.refresh_token;
      const user = payload.user;

      if (!user || !accessToken) {
        throw new Error('Invalid response structure');
      }

      // Enforce Admin or Worker access
      if (!user.isAdmin && !user.isWorker && !user.isAdminCommunity) {
        toast.error('Acceso denegado: Solo administradores o trabajadores pueden ingresar.');
        return;
      }

      // Store token with security attributes
      Cookies.set('token', accessToken, { expires: 7, secure: true, sameSite: 'strict' });
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30, secure: true, sameSite: 'strict' });
      }

      // Roles are validated server-side via /auth/me — no need to persist user in localStorage
      setUser(user);

      toast.success('Inicio de sesión exitoso');

      // Determine redirection based on communities
      const communities = [
        ...(user.adminCommunities || []),
        ...(user.workerCommunities || [])
      ];
      const uniqueCommunities = Array.from(new Map(communities.map((c: any) => [c.id, c])).values());

      if (uniqueCommunities.length === 1) {
        Cookies.set('activeCommunityId', uniqueCommunities[0].id, { secure: true, sameSite: 'strict' });
        router.push('/dashboard');
      } else if (uniqueCommunities.length > 1) {
        router.push('/select-community');
      } else {
        toast.error('No tienes comunidades asignadas.');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('activeCommunityId');
    localStorage.removeItem('user'); // Clean up any legacy data
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
