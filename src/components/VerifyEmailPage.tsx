import { useEffect, useState } from 'react';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';
import { userRepository } from '@/infrastructure/repositories';
import svgPaths from "../imports/svg-du8004kdwc";

interface VerifyEmailPageProps {
  onVerificationComplete: () => void;
}

export default function VerifyEmailPage({ onVerificationComplete }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Get oobCode from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const oobCode = urlParams.get('oobCode');

      if (!oobCode) {
        setStatus('failed');
        setErrorMessage('Invalid verification link');
        return;
      }

      setStatus('verifying');

      try {
        // Apply the verification code (marks email as verified on Firebase server)
        await applyActionCode(auth, oobCode);

        // If user is signed in, update Firestore users doc
        if (auth.currentUser) {
          await auth.currentUser.reload();
          try {
            await userRepository.update(auth.currentUser.uid, { emailVerified: true });
          } catch (err) {
            console.error('Failed to update Firestore user doc:', err);
            // Continue anyway - Firebase Auth verification is what matters
          }
        }

        setStatus('success');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onVerificationComplete();
        }, 2000);
      } catch (error: any) {
        setStatus('failed');
        if (error.code === 'auth/invalid-action-code') {
          setErrorMessage('This verification link is invalid or has already been used.');
        } else if (error.code === 'auth/expired-action-code') {
          setErrorMessage('This verification link has expired. Please request a new one.');
        } else {
          setErrorMessage('Verification failed. Please try again.');
        }
        console.error('Email verification error:', error);
      }
    };

    verifyEmail();
  }, [onVerificationComplete]);

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

      {/* Verification Status */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        {status === 'verifying' && (
          <div className="text-center">
            <div className="mb-6 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#8129d9] border-r-transparent"></div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Verifying your email...
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f]">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Email verified successfully!
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-8">
              Your email has been confirmed. Redirecting you to sign in...
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Verification failed
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-8">
              {errorMessage}
            </p>
            <button
              onClick={onVerificationComplete}
              className="bg-[#8129d9] text-white rounded-[64px] px-8 py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
