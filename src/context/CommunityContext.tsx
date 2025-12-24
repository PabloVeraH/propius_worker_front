'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { Community, CommunityContextType } from '@/types/community';
import { useAuth } from './AuthContext';

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [activeCommunityId, setActiveCommunityIdState] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCommunities([]);
      setIsLoading(false);
      return;
    }

    // Combine admin and worker communities
    const userCommunities = [
      ...(user.adminCommunities || []),
      ...(user.workerCommunities || [])
    ];

    // Deduplicate by ID
    const uniqueCommunities = Array.from(new Map(userCommunities.map((c: any) => [c.id, c])).values()) as Community[];

    setCommunities(uniqueCommunities);

    // Restore active community from cookie or default to first
    const savedId = Cookies.get('activeCommunityId');
    if (savedId && uniqueCommunities.find(c => c.id === savedId)) {
      setActiveCommunityIdState(savedId);
    } else if (uniqueCommunities.length > 0) {
      // If no cookie or invalid cookie, set first community if available
      // But we generally rely on the login flow to set the cookie/redirect
      if (!activeCommunityId) {
        setActiveCommunityId(uniqueCommunities[0].id);
      }
    }

    setIsLoading(false);
  }, [isAuthenticated, user]);

  const setActiveCommunityId = (id: string | null) => {
    setActiveCommunityIdState(id);
    if (id) {
      Cookies.set('activeCommunityId', id);
    } else {
      Cookies.remove('activeCommunityId');
    }
  };

  return (
    <CommunityContext.Provider value={{ activeCommunityId, setActiveCommunityId, communities, isLoading }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
