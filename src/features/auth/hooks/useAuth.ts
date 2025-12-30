// src/features/auth/hooks/useAuth.ts
// Main auth hook for accessing auth state and actions

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import { clearAppLocalStorage } from '@/shared/lib/utils';
import type { AuthUser, AuthState } from '../types';
import type { BioPage } from '@/shared/types';

interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<{ hasExistingPage: boolean; firstPageUsername?: string }>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserPages: () => Promise<{ hasPages: boolean; pages: BioPage[] }>;
}

export function useAuthProvider(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear old localStorage data
    clearAppLocalStorage();

    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    return {
      hasExistingPage: result.hasExistingPage,
      firstPageUsername: result.firstPageUsername,
    };
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await authService.signup(email, password);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const checkUserPages = useCallback(async () => {
    if (!user) {
      return { hasPages: false, pages: [] };
    }
    return authService.checkUserHasBioPages(user.uid);
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkUserPages,
  };
}

// Auth context for providing auth state to the app
export const AuthContext = createContext<UseAuthReturn | null>(null);

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

