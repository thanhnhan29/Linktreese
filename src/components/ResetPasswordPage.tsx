import { useState } from 'react';
import svgPaths from "../imports/svg-du8004kdwc";
import imgFrame from "figma:asset/a3d78743adbd2d2160e019486919a6bb2862cbcd.png";

interface ResetPasswordPageProps {
  onResetSuccess: () => void;
}

export default function ResetPasswordPage({ onResetSuccess }: ResetPasswordPageProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('one special character (!@#$%^&*)');
    }
    return errors;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value) {
      const errors = validatePassword(value);
      if (errors.length > 0) {
        setNewPasswordError(`Password must contain ${errors.join(', ')}`);
      } else {
        setNewPasswordError('');
      }
    } else {
      setNewPasswordError('');
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
    if (value && value !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else if (value) {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    let hasError = false;

    // Validate new password
    if (!newPassword) {
      setNewPasswordError('New password is required');
      hasError = true;
    } else {
      const errors = validatePassword(newPassword);
      if (errors.length > 0) {
        setNewPasswordError(`Password must contain ${errors.join(', ')}`);
        hasError = true;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // If validation passes, reset password
    alert('Password reset successful! Redirecting to login...');
    onResetSuccess();
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image Section */}
      <div className="absolute bg-[#254f1a] h-full right-0 top-0 w-[470px] overflow-hidden">
        <div className="absolute h-[158.84%] left-0 top-[-29.42%] w-full">
          <img alt="" className="h-full w-full object-cover" src={imgFrame} />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute left-12 top-12">
        <svg className="h-6 w-[113px]" fill="none" viewBox="0 0 113 24">
          <g>
            <path d={svgPaths.p3b866300} fill="black" />
            <path d={svgPaths.p895a00} fill="#43E660" />
          </g>
        </svg>
      </div>

      {/* Reset Password Form */}
      <div className="absolute left-[174px] top-[200px] w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">Create new password</h1>
        <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              placeholder="New password"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                newPasswordError ? 'border-2 border-red-500' : ''
              }`}
            />
            {newPasswordError && (
              <p className="text-red-500 mt-2 text-[14px]">{newPasswordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              placeholder="Confirm new password"
              className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] ${
                confirmPasswordError ? 'border-2 border-red-500' : ''
              }`}
            />
            {confirmPasswordError && (
              <p className="text-red-500 mt-2 text-[14px]">{confirmPasswordError}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-[#f6f7f5] p-4 rounded-[8px]">
            <p className="text-[14px] text-[#676b5f] mb-2">Password must contain:</p>
            <ul className="text-[14px] text-[#676b5f] space-y-1 list-disc list-inside">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (!@#$%^&*)</li>
            </ul>
          </div>

          <button
            type="submit"
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}
