import { useState } from 'react';
import svgPaths from "../imports/svg-du8004kdwc";

interface SignupPageProps {
  onSignup: (email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const EXISTING_EMAILS = ['abc@gmail.com'];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('one number');
    }
    return errors;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else if (value && EXISTING_EMAILS.includes(value)) {
      setEmailError('This email is already registered');
    } else if (value) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      const errors = validatePassword(value);
      if (errors.length > 0) {
        setPasswordError(`Password must contain ${errors.join(', ')}`);
      } else {
        setPasswordError('');
      }
    }
    
    // Re-validate confirm password if it exists
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else if (confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else if (value) {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear all errors first
    let hasError = false;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else if (EXISTING_EMAILS.includes(email)) {
      setEmailError('This email is already registered');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else {
      const errors = validatePassword(password);
      if (errors.length > 0) {
        setPasswordError(`Password must contain ${errors.join(', ')}`);
        hasError = true;
      } else {
        setPasswordError('');
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) {
      return;
    }

    onSignup(email, password);
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth integration
    // In production, this would redirect to Google OAuth or open a popup
    alert('Google OAuth integration would happen here. This is a demo.');
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

      {/* Signup Form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">Tell us about yourself</h1>
        <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
          For a personalized Linktree experience
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Your email"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                emailError ? 'border-2 border-red-500' : ''
              }`}
            />
            {emailError && (
              <p className="text-red-500 mt-2 text-[14px]">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Create a password"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                passwordError ? 'border-2 border-red-500' : ''
              }`}
            />
            {passwordError && (
              <p className="text-red-500 mt-2 text-[14px]">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              placeholder="Confirm password"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                confirmPasswordError ? 'border-2 border-red-500' : ''
              }`}
            />
            {confirmPasswordError && (
              <p className="text-red-500 mt-2 text-[14px]">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-[16px] text-center mt-8"
          >
            Continue
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

          {/* Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-[#e0e2d9] rounded-[64px] hover:bg-[#f6f7f5] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8055 10.2292C19.8055 9.55139 19.75 8.86806 19.6278 8.20139H10.2V12.0486H15.6014C15.3778 13.2903 14.6569 14.3583 13.6139 15.0681V17.5764H16.825C18.7125 15.8347 19.8055 13.2681 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2 20C12.9 20 15.1722 19.1042 16.8278 17.5764L13.6167 15.0681C12.7361 15.6681 11.5972 16.0208 10.2028 16.0208C7.59167 16.0208 5.38056 14.2625 4.60556 11.9H1.28333V14.4903C2.96111 17.8486 6.41944 20 10.2 20Z" fill="#34A853"/>
              <path d="M4.60278 11.8986C4.17778 10.6569 4.17778 9.34028 4.60278 8.09861V5.50833H1.28333C-0.127778 8.31528 -0.127778 11.6819 1.28333 14.4889L4.60278 11.8986Z" fill="#FBBC04"/>
              <path d="M10.2 3.97917C11.6722 3.95694 13.0889 4.52361 14.1556 5.53472L17.0167 2.67361C15.0861 0.873611 12.5444 -0.0680556 10.2 -0.000277779C6.41944 -0.000277779 2.96111 2.15139 1.28333 5.50972L4.60278 8.1C5.37222 5.73472 7.58889 3.97917 10.2 3.97917Z" fill="#EA4335"/>
            </svg>
            <span className="text-black tracking-[-0.32px]">Sign up with Google</span>
          </button>

          <div className="text-center">
            <p className="text-[#676b5f]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#8129d9] hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}