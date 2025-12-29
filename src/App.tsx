import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import Dashboard from './components/Dashboard';
import CreateUsername from './components/CreateUsername';
import { Toaster } from './components/ui/sonner';

type Page = 'login' | 'signup' | 'dashboard' | 'forgot-password' | 'reset-password' | 'create-username';

interface User {
  email: string;
  password: string;
}

interface BioPage {
  username: string;
  profileImage: string;
  bio: string;
  displayName: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentBioPage, setCurrentBioPage] = useState<string>('');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Check if user has bio pages
      const bioPages = JSON.parse(localStorage.getItem(`bioPages_${userData.email}`) || '[]');
      
      if (bioPages.length === 0) {
        // First time user - need to create username
        setCurrentPage('create-username');
        setIsFirstTimeUser(true);
      } else {
        // Get current active bio page
        const activeBioPage = localStorage.getItem(`currentBioPage_${userData.email}`);
        setCurrentBioPage(activeBioPage || bioPages[0].username);
        setCurrentPage('dashboard');
      }
    }
  }, []);

  const handleLogin = (identifier: string, password: string) => {
    // Demo user - can login with username or email
    const DEMO_USERNAME = 'NTK_Harry';
    const DEMO_EMAIL = 'abc@gmail.com';
    const DEMO_PASSWORD = 'Hihi34@';
    
    if ((identifier === DEMO_USERNAME || identifier === DEMO_EMAIL) && password === DEMO_PASSWORD) {
      const user: User = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Check if demo user has bio pages
      const bioPages = JSON.parse(localStorage.getItem(`bioPages_${DEMO_EMAIL}`) || '[]');
      
      if (bioPages.length === 0) {
        // Create demo bio page for NTK_Harry
        const demoBioPage: BioPage = {
          username: DEMO_USERNAME,
          profileImage: '',
          bio: '',
          displayName: DEMO_USERNAME
        };
        localStorage.setItem(`bioPages_${DEMO_EMAIL}`, JSON.stringify([demoBioPage]));
        localStorage.setItem(`currentBioPage_${DEMO_EMAIL}`, DEMO_USERNAME);
        setCurrentBioPage(DEMO_USERNAME);
      } else {
        const activeBioPage = localStorage.getItem(`currentBioPage_${DEMO_EMAIL}`);
        setCurrentBioPage(activeBioPage || bioPages[0].username);
      }
      
      setCurrentPage('dashboard');
      return true;
    }
    
    // Check for other registered users
    const userKey = `user_${identifier}`;
    const savedUserData = localStorage.getItem(userKey);
    
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      if (userData.password === password) {
        const user: User = { email: userData.email, password: userData.password };
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Get bio pages
        const bioPages = JSON.parse(localStorage.getItem(`bioPages_${userData.email}`) || '[]');
        
        if (bioPages.length === 0) {
          setCurrentPage('create-username');
          setIsFirstTimeUser(true);
        } else {
          const activeBioPage = localStorage.getItem(`currentBioPage_${userData.email}`);
          setCurrentBioPage(activeBioPage || bioPages[0].username);
          setCurrentPage('dashboard');
        }
        
        return true;
      }
    }
    
    return false;
  };

  const handleSignup = (email: string, password: string) => {
    // Check if email already exists
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      return false;
    }

    const newUser: User = { email, password };
    
    // Save user credentials
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Initialize empty bio pages array
    localStorage.setItem(`bioPages_${email}`, JSON.stringify([]));
    
    setUser(newUser);
    setIsFirstTimeUser(true);
    setCurrentPage('create-username');
  };

  const handleCreateUsername = (username: string) => {
    if (!user) return;

    // Create new bio page
    const newBioPage: BioPage = {
      username,
      profileImage: '',
      bio: '',
      displayName: username
    };

    // Get existing bio pages
    const bioPages = JSON.parse(localStorage.getItem(`bioPages_${user.email}`) || '[]');
    
    // Add new bio page
    bioPages.push(newBioPage);
    localStorage.setItem(`bioPages_${user.email}`, JSON.stringify(bioPages));
    
    // Set as current bio page
    localStorage.setItem(`currentBioPage_${user.email}`, username);
    setCurrentBioPage(username);
    
    setIsFirstTimeUser(false);
    setCurrentPage('dashboard');
  };

  const handleSwitchBioPage = (username: string) => {
    if (!user) return;
    
    localStorage.setItem(`currentBioPage_${user.email}`, username);
    setCurrentBioPage(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentBioPage('');
    setCurrentPage('login');
  };

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentPage('signup')}
          onSwitchToForgotPassword={() => setCurrentPage('forgot-password')}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'signup') {
    return (
      <>
        <SignupPage 
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'create-username' && user) {
    return (
      <>
        <CreateUsername 
          userEmail={user.email}
          onCreateUsername={handleCreateUsername}
          isFirstTime={isFirstTimeUser}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'dashboard' && user && currentBioPage) {
    return (
      <>
        <Dashboard 
          userEmail={user.email}
          currentBioPageUsername={currentBioPage}
          onSwitchBioPage={handleSwitchBioPage}
          onCreateNewBioPage={() => {
            setIsFirstTimeUser(false);
            setCurrentPage('create-username');
          }}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <>
        <ForgotPasswordPage 
          onSwitchToLogin={() => setCurrentPage('login')}
          onSwitchToResetPassword={() => setCurrentPage('reset-password')}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'reset-password') {
    return (
      <>
        <ResetPasswordPage 
          onResetSuccess={() => setCurrentPage('login')}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Toaster />
    </>
  );
}