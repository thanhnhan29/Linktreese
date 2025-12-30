// src/app/App.tsx
// Main application component

import { useState, useEffect, useCallback } from 'react';
import { useAuth, LoginForm, SignupForm } from '@/features/auth';
import { CreateUsernameForm, Dashboard, bioPageService } from '@/features/bio-page';
import { LoadingScreen } from '@/shared/components';
import { isFirebaseConfigured } from '@/infrastructure/firebase';
import { toast } from 'sonner';

type Page = 'login' | 'signup' | 'create-username' | 'dashboard' | 'forgot-password';

export function App() {
  const { user, isLoading, isAuthenticated, login, signup, logout, checkUserPages } = useAuth();
  
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentBioPageUsername, setCurrentBioPageUsername] = useState<string>('');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isCheckingPages, setIsCheckingPages] = useState(false);

  // Check user's pages after authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const checkPages = async () => {
      setIsCheckingPages(true);
      try {
        const { hasPages, pages } = await checkUserPages();
        
        if (hasPages && pages.length > 0) {
          setCurrentBioPageUsername(pages[0].username);
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('create-username');
          setIsFirstTimeUser(true);
        }
      } catch (error) {
        console.error('Error checking user pages:', error);
        toast.error('Failed to load your data. Please try again.');
      } finally {
        setIsCheckingPages(false);
      }
    };

    checkPages();
  }, [isAuthenticated, user, checkUserPages]);

  // Handle login
  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await login(email, password);
    
    if (result.hasExistingPage && result.firstPageUsername) {
      setCurrentBioPageUsername(result.firstPageUsername);
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('create-username');
      setIsFirstTimeUser(true);
    }
  }, [login]);

  // Handle signup
  const handleSignup = useCallback(async (email: string, password: string) => {
    await signup(email, password);
    setIsFirstTimeUser(true);
    setCurrentPage('create-username');
  }, [signup]);

  // Handle username creation
  const handleCreateUsername = useCallback(async (username: string) => {
    if (!user) return;

    try {
      await bioPageService.createBioPage({
        userId: user.uid,
        username: username,
        bioDescription: '',
      });

      setCurrentBioPageUsername(username);
      setIsFirstTimeUser(false);
      setCurrentPage('dashboard');
      toast.success('Your page has been created!');
    } catch (error) {
      console.error('Failed to create bio page:', error);
      throw error;
    }
  }, [user]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    await logout();
    setCurrentBioPageUsername('');
    setCurrentPage('login');
    toast.success('You have been logged out');
  }, [logout]);

  // Show loading screen while checking auth state
  if (isLoading || isCheckingPages) {
    return <LoadingScreen />;
  }

  // Show configuration warning if Firebase is not configured
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#8129d9] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">Firebase Not Configured</h1>
          <p className="text-[#676b5f] mb-6">
            To use this application, you need to configure Firebase credentials.
          </p>
          <div className="bg-[#f6f7f5] rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-black font-medium mb-2">Setup Instructions:</p>
            <ol className="text-sm text-[#676b5f] space-y-2 list-decimal list-inside">
              <li>Copy <code className="bg-gray-200 px-1 rounded">env.sample</code> to <code className="bg-gray-200 px-1 rounded">.env</code></li>
              <li>Add your Firebase project credentials</li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <p className="text-sm text-[#676b5f]">
            See <code className="bg-gray-200 px-1 rounded">README.md</code> for detailed setup instructions.
          </p>
        </div>
      </div>
    );
  }

  // Login page
  if (currentPage === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentPage('signup')}
        onSwitchToForgotPassword={() => setCurrentPage('forgot-password')}
      />
    );
  }

  // Signup page
  if (currentPage === 'signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentPage('login')}
      />
    );
  }

  // Create username page
  if (currentPage === 'create-username' && user) {
    return (
      <CreateUsernameForm
        userEmail={user.email}
        onCreateUsername={handleCreateUsername}
        isFirstTime={isFirstTimeUser}
      />
    );
  }

  // Dashboard
  if (currentPage === 'dashboard' && user && currentBioPageUsername) {
    return (
      <Dashboard
        userEmail={user.email}
        userId={user.uid}
        currentBioPageUsername={currentBioPageUsername}
        onSwitchBioPage={(username) => setCurrentBioPageUsername(username)}
        onCreateNewBioPage={() => {
          setIsFirstTimeUser(false);
          setCurrentPage('create-username');
        }}
        onLogout={handleLogout}
      />
    );
  }

  // Forgot password placeholder
  if (currentPage === 'forgot-password') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Forgot Password</h1>
          <p className="text-[#676b5f] mb-8">
            Password reset functionality is available in the complete application.
          </p>
          <button
            onClick={() => setCurrentPage('login')}
            className="px-6 py-3 bg-[#8129d9] text-white rounded-full hover:bg-[#7020c0] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return <LoadingScreen />;
}

