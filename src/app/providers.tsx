'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CommunityProvider } from '@/context/CommunityContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CommunityProvider>
            {children}
            <Toaster position="top-right" />
          </CommunityProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
