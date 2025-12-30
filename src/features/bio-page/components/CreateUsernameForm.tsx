// src/features/bio-page/components/CreateUsernameForm.tsx
// Form for creating a new bio page with username

import { useState, useEffect } from 'react';
import { validateUsername } from '@/shared/lib/validation';
import { bioPageService } from '../services/bioPageService';
import { getErrorMessage } from '@/shared/lib/errors';
import svgPaths from '@/imports/svg-du8004kdwc';

interface CreateUsernameFormProps {
  userEmail: string;
  onCreateUsername: (username: string) => Promise<void>;
  isFirstTime?: boolean;
}

export function CreateUsernameForm({
  userEmail,
  onCreateUsername,
  isFirstTime = false,
}: CreateUsernameFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced username availability check
  useEffect(() => {
    if (!username) {
      setIsAvailable(null);
      setError('');
      return;
    }

    // Validate format first
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setError(validation.error!);
      setIsAvailable(null);
      return;
    }

    setError('');
    setIsChecking(true);

    const timeoutId = setTimeout(async () => {
      try {
        const available = await bioPageService.isUsernameAvailable(username);
        setIsAvailable(available);
        if (!available) {
          setError('This username is already taken');
        }
      } catch {
        setError('Could not check username availability');
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleUsernameChange = (value: string) => {
    // Only allow valid characters
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      setError('Username is required');
      return;
    }

    const validation = validateUsername(username);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    if (!isAvailable) {
      setError('This username is already taken');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateUsername(username);
    } catch (err) {
      setError(getErrorMessage(err));
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

      {/* Form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">
          {isFirstTime ? 'Create your Linktree' : 'Create another Linktree'}
        </h1>
        <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
          Choose a username for your page. You can change this later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <div 
              className={`flex items-center bg-[#f6f7f5] rounded-[8px] px-4 py-4 ${
                error ? 'border-2 border-red-500' : isAvailable ? 'border-2 border-green-500' : 'border-2 border-transparent'
              }`}
            >
              <span className="text-[#676b5f] whitespace-nowrap select-none">
                vielink.vn/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="username"
                disabled={isSubmitting}
                className="flex-1 bg-transparent text-black placeholder:text-[#676b5f] outline-none disabled:opacity-50"
              />
              {/* Status indicator */}
              <div className="ml-2 flex-shrink-0">
                {isChecking && (
                  <div className="w-5 h-5 border-2 border-[#8129d9] border-t-transparent rounded-full animate-spin" />
                )}
                {!isChecking && isAvailable === true && (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {!isChecking && isAvailable === false && (
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            {error && (
              <p className="text-red-500 mt-2 text-[14px]">{error}</p>
            )}
            {!error && isAvailable && (
              <p className="text-green-500 mt-2 text-[14px]">Username is available!</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isAvailable || !!error}
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Continue'}
          </button>

          <p className="text-center text-[#676b5f] text-sm">
            Signed in as {userEmail}
          </p>
        </form>
      </div>
    </div>
  );
}

