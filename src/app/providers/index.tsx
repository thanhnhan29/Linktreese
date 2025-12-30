// src/app/providers/index.tsx
// Root provider composition

import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { Toaster } from '@/shared/components/ui/sonner';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}

