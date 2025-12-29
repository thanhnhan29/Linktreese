import { useState, useEffect } from 'react';
import svgPaths from "../imports/svg-du8004kdwc";

interface ForgotPasswordPageProps {
  onSwitchToResetPassword: () => void;
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordPage({ onSwitchToResetPassword, onSwitchToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  const VALID_EMAIL = 'abc@gmail.com';

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError('');
  };

  const handleCaptchaChange = (value: string) => {
    setCaptcha(value);
    if (captchaError) setCaptchaError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    setCaptchaError('');
    
    let hasError = false;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else if (email !== VALID_EMAIL) {
      setEmailError('Email does not exist in our system');
      hasError = true;
    }

    // Validate captcha (for demo purposes - not real validation)
    if (!captcha) {
      setCaptchaError('Please enter the captcha');
      hasError = true;
    } else if (captcha !== generatedCaptcha) {
      setCaptchaError('Captcha is incorrect');
      generateCaptcha(); // Generate new captcha
      setCaptcha(''); // Clear captcha input
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // If validation passes, proceed to reset password page
    alert('Verification email sent! (Demo: Click OK to proceed to reset password)');
    onSwitchToResetPassword();
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

      {/* Forgot Password Form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">Reset your password</h1>
        <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
          Enter your email address and we'll send you a link to reset your password
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

          {/* Captcha Display */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="bg-[#e0e2d9] px-6 py-4 rounded-[8px] font-mono text-[20px] tracking-wider select-none flex-shrink-0">
                {generatedCaptcha}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-[#8129d9] hover:underline text-[14px]"
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              value={captcha}
              onChange={(e) => handleCaptchaChange(e.target.value)}
              placeholder="Enter captcha"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                captchaError ? 'border-2 border-red-500' : ''
              }`}
            />
            {captchaError && (
              <p className="text-red-500 mt-2 text-[14px]">{captchaError}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center"
          >
            Send reset link
          </button>

          <div className="text-center">
            <p className="text-[#676b5f]">
              Remember your password?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#8129d9] hover:underline"
              >
                Back to login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}