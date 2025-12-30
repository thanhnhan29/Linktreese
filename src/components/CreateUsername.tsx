import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import svgPaths from "../imports/svg-du8004kdwc";
import imgFrame from "figma:asset/a3d78743adbd2d2160e019486919a6bb2862cbcd.png";

interface CreateUsernameProps {
  userEmail: string;
  onCreateUsername: (username: string) => void;
  isFirstTime?: boolean;
}

export default function CreateUsername({ userEmail: _userEmail, onCreateUsername, isFirstTime = true }: CreateUsernameProps) {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [checkTimer, setCheckTimer] = useState<NodeJS.Timeout | null>(null);

  const checkUsernameAvailability = (value: string) => {
    // Get all existing usernames from localStorage
    const existingUsernames: string[] = [];
    
    // Check all bio pages across all users
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('bioPages_')) {
        const bioPages = JSON.parse(localStorage.getItem(key) || '[]');
        bioPages.forEach((page: any) => {
          existingUsernames.push(page.username.toLowerCase());
        });
      }
    }

    // Also check the demo username
    existingUsernames.push('ntk_harry');

    return !existingUsernames.includes(value.toLowerCase());
  };

  const validateUsername = (value: string) => {
    // Username rules:
    // - 3-30 characters
    // - Only alphanumeric, underscore, and dash
    // - Cannot start or end with underscore or dash
    // - No consecutive underscores or dashes
    
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    
    if (value.length > 30) {
      return 'Username must be less than 30 characters';
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return 'Username can only contain letters, numbers, underscores, and dashes';
    }
    
    if (/^[_-]|[_-]$/.test(value)) {
      return 'Username cannot start or end with underscore or dash';
    }
    
    if (/[_-]{2,}/.test(value)) {
      return 'Username cannot have consecutive underscores or dashes';
    }
    
    // Check for reserved/inappropriate words
    const reserved = ['admin', 'root', 'api', 'www', 'help', 'support', 'linktree'];
    if (reserved.some(word => value.toLowerCase().includes(word))) {
      return 'This username is not allowed';
    }
    
    return '';
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setError('');
    setIsAvailable(null);

    // Clear previous timer
    if (checkTimer) {
      clearTimeout(checkTimer);
    }

    // Validate format first
    const validationError = validateUsername(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check availability with debounce
    setIsChecking(true);
    const timer = setTimeout(() => {
      const available = checkUsernameAvailability(value);
      setIsAvailable(available);
      setIsChecking(false);
      
      if (!available) {
        setError('This username is already taken');
      }
    }, 500);

    setCheckTimer(timer);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      setError('Username is required');
      return;
    }

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isAvailable) {
      setError('This username is not available');
      return;
    }

    onCreateUsername(username);
  };

  const canSubmit = username && isAvailable && !error && !isChecking;

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

      {/* Create Username Form */}
      <div className="absolute left-[174px] top-[144px] w-[592px]">
        <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">
          {isFirstTime ? 'Create your Linktree' : 'Create a new bio page'}
        </h1>
        <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
          {isFirstTime 
            ? 'Choose a unique username for your bio link page' 
            : 'Add another bio page to your account'
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="yourusername"
                className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 pr-12 text-black placeholder:text-[#676b5f] ${
                  error ? 'border-2 border-red-500' : 
                  isAvailable ? 'border-2 border-green-500' : ''
                }`}
                autoFocus
              />
              {/* Status Icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {isChecking && (
                  <Loader2 className="w-5 h-5 text-[#676b5f] animate-spin" />
                )}
                {!isChecking && isAvailable && !error && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
                {!isChecking && error && (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 mt-2 text-[14px] flex items-center gap-1">
                <X className="w-4 h-4" />
                {error}
              </p>
            )}

            {/* Success Message */}
            {isAvailable && !error && username && (
              <p className="text-green-600 mt-2 text-[14px] flex items-center gap-1">
                <Check className="w-4 h-4" />
                This username is available!
              </p>
            )}

            {/* URL Preview */}
            {username && !error && (
              <div className="mt-4 bg-[#f6f7f5] rounded-lg p-4">
                <p className="text-[#676b5f] text-sm mb-2">Your Linktree URL will be:</p>
                <code className="text-[#8129d9] text-[16px]">
                  linktr.ee/{username}
                </code>
              </div>
            )}
          </div>

          {/* Username Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-black mb-2">Username guidelines:</p>
            <ul className="text-[#676b5f] text-sm space-y-1">
              <li>• 3-30 characters</li>
              <li>• Only letters, numbers, underscores, and dashes</li>
              <li>• Cannot start or end with _ or -</li>
              <li>• No consecutive special characters</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-[16px] text-center mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFirstTime ? 'Create my Linktree' : 'Create bio page'}
          </Button>
        </form>
      </div>
    </div>
  );
}
