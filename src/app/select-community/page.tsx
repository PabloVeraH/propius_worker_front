'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from '@/context/CommunityContext';
import { CommunitySummary } from '@/types/auth';
import { Building, ArrowRight } from 'lucide-react';

export default function SelectCommunityPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setActiveCommunityId } = useCommunity();
  const router = useRouter();
  const [availableCommunities, setAvailableCommunities] = useState<CommunitySummary[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      // Combine admin and worker communities, removing duplicates if any
      const communities = [
        ...(user.adminCommunities || []),
        ...(user.workerCommunities || [])
      ];

      // Deduplicate by ID
      const uniqueCommunities = Array.from(new Map(communities.map(c => [c.id, c])).values());

      setAvailableCommunities(uniqueCommunities);

      // If only 1 community, auto-select and redirect (safety check, though login should handle this)
      if (uniqueCommunities.length === 1) {
        handleSelectCommunity(uniqueCommunities[0].id);
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  const handleSelectCommunity = (communityId: string) => {
    setActiveCommunityId(communityId);
    router.push('/dashboard');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary-100 p-3">
            <Building className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Selecciona una Comunidad
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tienes acceso a las siguientes comunidades. Elige una para continuar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
          {availableCommunities.length > 0 ? (
            availableCommunities.map((community) => (
              <button
                key={community.id}
                onClick={() => handleSelectCommunity(community.id)}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white">
                    <Building className="h-5 w-5 text-gray-500 group-hover:text-primary-600" />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-sm font-medium text-gray-900">{community.name}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No tienes comunidades asignadas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
