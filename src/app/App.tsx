// src/app/App.tsx
// Main application component with routing

import { useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth, LoginForm, SignupForm } from "@/features/auth";
import {
  CreateUsernameForm,
  Dashboard,
  PublicBioPage,
  bioPageService,
} from "@/features/bio-page";
import { LoadingScreen, ProtectedRoute } from "@/shared/components";
import { isFirebaseConfigured } from "@/infrastructure/firebase";
import { toast } from "sonner";

export function App() {
  const {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkUserPages,
  } = useAuth();
  const navigate = useNavigate();

  // Handle login with navigation
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await login(email, password);

      // After login show dashboard selector — user picks page or creates new
      navigate("/dashboard");
    },
    [login, navigate]
  );

  // Handle signup with navigation
  const handleSignup = useCallback(
    async (email: string, password: string) => {
      await signup(email, password);
      navigate("/create-username");
    },
    [signup, navigate]
  );

  // Handle username creation with navigation
  const handleCreateUsername = useCallback(
    async (username: string) => {
      if (!user) return;

      try {
        await bioPageService.createBioPage({
          userId: user.uid,
          username: username,
          bioDescription: "",
        });

        navigate(`/dashboard/${username}`);
        toast.success("Your page has been created!");
      } catch (error) {
        console.error("Failed to create bio page:", error);
        throw error;
      }
    },
    [user, navigate]
  );

  // Handle logout with navigation
  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
    toast.success("You have been logged out");
  }, [logout, navigate]);

  // Auto-redirect authenticated users from login/signup pages
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      const currentPath = window.location.pathname;
      if (
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath === "/"
      ) {
        checkUserPages().then(({ hasPages, pages }) => {
          if (hasPages && pages.length > 0) {
            navigate(`/dashboard/${pages[0].username}`, { replace: true });
          } else {
            navigate("/create-username", { replace: true });
          }
        });
      }
    }
  }, [isAuthenticated, user, isLoading, checkUserPages, navigate]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show configuration warning if Firebase is not configured
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-[#8129d9] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">
            Firebase Not Configured
          </h1>
          <p className="text-[#676b5f] mb-6">
            To use this application, you need to configure Firebase credentials.
          </p>
          <div className="bg-[#f6f7f5] rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-black font-medium mb-2">
              Setup Instructions:
            </p>
            <ol className="text-sm text-[#676b5f] space-y-2 list-decimal list-inside">
              <li>
                Copy{" "}
                <code className="bg-gray-200 px-1 rounded">env.sample</code> to{" "}
                <code className="bg-gray-200 px-1 rounded">.env</code>
              </li>
              <li>Add your Firebase project credentials</li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <p className="text-sm text-[#676b5f]">
            See <code className="bg-gray-200 px-1 rounded">README.md</code> for
            detailed setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => navigate("/register")}
            onSwitchToForgotPassword={() => navigate("/forgot-password")}
          />
        }
      />

      <Route
        path="/register"
        element={
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => navigate("/login")}
          />
        }
      />

      <Route
        path="/forgot-password"
        element={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black mb-4">
                Forgot Password
              </h1>
              <p className="text-[#676b5f] mb-8">
                Password reset functionality is available in the complete
                application.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-[#8129d9] text-white rounded-full hover:bg-[#7020c0] transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        }
      />

      {/* Protected routes */}
      <Route
        path="/create-username"
        element={
          <ProtectedRoute>
            {user && (
              <CreateUsernameForm
                userEmail={user.email}
                onCreateUsername={handleCreateUsername}
                isFirstTime={true}
              />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/:username"
        element={
          <ProtectedRoute>
            <DashboardWrapper
              onLogout={handleLogout}
              onCreateNewBioPage={() => navigate("/create-username")}
            />
          </ProtectedRoute>
        }
      />

      {/* Public bio page view - must be last to avoid conflicts */}
      <Route path="/:username" element={<PublicBioPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Wrapper component to handle Dashboard with params
function DashboardWrapper({
  onLogout,
  onCreateNewBioPage,
}: {
  onLogout: () => void;
  onCreateNewBioPage: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const usernameFromUrl = window.location.pathname.split("/dashboard/")[1];

  if (!user || !usernameFromUrl) {
    return <LoadingScreen />;
  }

  return (
    <Dashboard
      userEmail={user.email}
      userId={user.uid}
      currentBioPageUsername={usernameFromUrl}
      onSwitchBioPage={(username) => navigate(`/dashboard/${username}`)}
      onCreateNewBioPage={onCreateNewBioPage}
      onLogout={onLogout}
    />
  );
}
