// src/app/providers/AuthProvider.tsx
// Authentication context provider

import { ReactNode } from 'react';
import { AuthContext, useAuthProvider } from '@/features/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

