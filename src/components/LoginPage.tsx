import { useState } from 'react';
import svgPaths from "../imports/svg-du8004kdwc";

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export default function LoginPage({ onLogin, onSwitchToSignup, onSwitchToForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const VALID_EMAIL = 'abc@gmail.com';
  const VALID_PASSWORD = 'Hihi34@';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;

    // Validate if fields are empty
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    // If both fields are filled, check credentials
    if (!hasError) {
      if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
        // Show generic error on both fields
        setEmailError('Incorrect email or password');
        setPasswordError('Incorrect email or password');
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    // If validation passes, call onLogin
    onLogin(email, password);
  };

  const handleGoogleLogin = () => {
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

      {/* Login Form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">Welcome back</h1>
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
              placeholder="Password"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                passwordError ? 'border-2 border-red-500' : ''
              }`}
            />
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
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center"
          >
            Log in
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
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-[#e0e2d9] rounded-[64px] hover:bg-[#f6f7f5] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8055 10.2292C19.8055 9.55139 19.75 8.86806 19.6278 8.20139H10.2V12.0486H15.6014C15.3778 13.2903 14.6569 14.3583 13.6139 15.0681V17.5764H16.825C18.7125 15.8347 19.8055 13.2681 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2 20C12.9 20 15.1722 19.1042 16.8278 17.5764L13.6167 15.0681C12.7361 15.6681 11.5972 16.0208 10.2028 16.0208C7.59167 16.0208 5.38056 14.2625 4.60556 11.9H1.28333V14.4903C2.96111 17.8486 6.41944 20 10.2 20Z" fill="#34A853"/>
              <path d="M4.60278 11.8986C4.17778 10.6569 4.17778 9.34028 4.60278 8.09861V5.50833H1.28333C-0.127778 8.31528 -0.127778 11.6819 1.28333 14.4889L4.60278 11.8986Z" fill="#FBBC04"/>
              <path d="M10.2 3.97917C11.6722 3.95694 13.0889 4.52361 14.1556 5.53472L17.0167 2.67361C15.0861 0.873611 12.5444 -0.0680556 10.2 -0.000277779C6.41944 -0.000277779 2.96111 2.15139 1.28333 5.50972L4.60278 8.1C5.37222 5.73472 7.58889 3.97917 10.2 3.97917Z" fill="#EA4335"/>
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