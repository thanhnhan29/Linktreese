// src/features/auth/components/LoginForm.tsx
// Login form component (preserves original UI)

import { useState } from 'react';
import { getErrorMessage } from '@/shared/lib/errors';
import svgPaths from '@/imports/svg-du8004kdwc';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export function LoginForm({
  onLogin,
  onSwitchToSignup,
  onSwitchToForgotPassword
}: LoginFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login attempt limiting
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const getLoginAttempts = () => {
    const stored = localStorage.getItem('loginAttempts');
    if (!stored) return { count: 0, lockedUntil: null };
    return JSON.parse(stored);
  };

  const setLoginAttempts = (count: number, lockedUntil: number | null = null) => {
    localStorage.setItem('loginAttempts', JSON.stringify({ count, lockedUntil }));
  };

  const isLockedOut = () => {
    const { lockedUntil } = getLoginAttempts();
    if (!lockedUntil) return false;
    if (Date.now() > lockedUntil) {
      // Lockout expired, reset
      setLoginAttempts(0, null);
      return false;
    }
    return true;
  };

  const getRemainingLockTime = () => {
    const { lockedUntil } = getLoginAttempts();
    if (!lockedUntil) return 0;
    const remaining = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
    return Math.max(0, remaining);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError('');
    if (passwordError) setPasswordError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (emailError) setEmailError('');
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if locked out
    if (isLockedOut()) {
      setEmailError(`Too many failed attempts. Please try again in ${getRemainingLockTime()} minutes.`);
      return;
    }

    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    // Basic validation
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onLogin(email, password);
      // Success - reset attempts
      setLoginAttempts(0, null);
    } catch (error) {
      const message = getErrorMessage(error);

      // Increment failed attempts
      const { count } = getLoginAttempts();
      const newCount = count + 1;

      if (newCount >= MAX_ATTEMPTS) {
        // Lock the account
        const lockedUntil = Date.now() + LOCKOUT_DURATION;
        setLoginAttempts(newCount, lockedUntil);
        setEmailError(`Too many failed attempts. Please try again in 5 minutes.`);
        setPasswordError('');
      } else {
        setLoginAttempts(newCount, null);
        const remaining = MAX_ATTEMPTS - newCount;
        setEmailError(`${message}. ${remaining} attempt(s) remaining.`);
        setPasswordError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const result = await authService.signInWithGoogle();

      // Navigate based on whether user has pages
      if (result.hasExistingPage && result.firstPageUsername) {
        navigate(`/dashboard/${result.firstPageUsername}`);
      } else {
        navigate('/create-username');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setEmailError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Logo */}
      <div className="absolute left-12 top-12">
        <svg className="h-6 w-[113px]" fill="none" viewBox="0 0 113 24">
          <g>
            <path d={svgPaths.p3b866300} fill="black" />
            <path d={svgPaths.p895a00} fill="#43E660" />
          </g>
        </svg>
      </div>

      {/* Login Form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">
          Welcome back
        </h1>
        <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
          Log in to your Linktree account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Email"
              disabled={isSubmitting}
              maxLength={50}
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${emailError ? 'border-2 border-red-500' : ''
                } disabled:opacity-50`}
            />
            {emailError && (
              <p className="text-red-500 mt-2 text-[14px]">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Password"
                disabled={isSubmitting}
                maxLength={50}
                className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 pr-12 text-black placeholder:text-[#676b5f] ${passwordError ? 'border-2 border-red-500' : ''
                  } disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#676b5f] hover:text-black transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 mt-2 text-[14px]">{passwordError}</p>
            )}
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-[#8129d9] hover:underline text-[14px]"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e0e2d9]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[#676b5f]">or</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-[#e0e2d9] rounded-[64px] hover:bg-[#f6f7f5] transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8055 10.2292C19.8055 9.55139 19.75 8.86806 19.6278 8.20139H10.2V12.0486H15.6014C15.3778 13.2903 14.6569 14.3583 13.6139 15.0681V17.5764H16.825C18.7125 15.8347 19.8055 13.2681 19.8055 10.2292Z" fill="#4285F4" />
              <path d="M10.2 20C12.9 20 15.1722 19.1042 16.8278 17.5764L13.6167 15.0681C12.7361 15.6681 11.5972 16.0208 10.2028 16.0208C7.59167 16.0208 5.38056 14.2625 4.60556 11.9H1.28333V14.4903C2.96111 17.8486 6.41944 20 10.2 20Z" fill="#34A853" />
              <path d="M4.60278 11.8986C4.17778 10.6569 4.17778 9.34028 4.60278 8.09861V5.50833H1.28333C-0.127778 8.31528 -0.127778 11.6819 1.28333 14.4889L4.60278 11.8986Z" fill="#FBBC04" />
              <path d="M10.2 3.97917C11.6722 3.95694 13.0889 4.52361 14.1556 5.53472L17.0167 2.67361C15.0861 0.873611 12.5444 -0.0680556 10.2 -0.000277779C6.41944 -0.000277779 2.96111 2.15139 1.28333 5.50972L4.60278 8.1C5.37222 5.73472 7.58889 3.97917 10.2 3.97917Z" fill="#EA4335" />
            </svg>
            <span className="text-black tracking-[-0.32px]">Log in with Google</span>
          </button>

          <div className="text-center">
            <p className="text-[#676b5f]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-[#8129d9] hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

