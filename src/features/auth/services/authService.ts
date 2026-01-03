// src/features/auth/services/authService.ts
// Authentication service with business logic

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/infrastructure/firebase';
import { userRepository } from '@/infrastructure/repositories';
import { bioPageRepository } from '@/infrastructure/repositories';
import { validateEmail, validatePassword } from '@/shared/lib/validation';
import { ValidationError, AuthenticationError } from '@/shared/lib/errors';
import type { AuthUser } from '../types';
import type { BioPage } from '@/shared/types';

export interface LoginResult {
  user: AuthUser;
  hasExistingPage: boolean;
  firstPageUsername?: string;
  isEmailVerified: boolean;
}

export interface SignupResult {
  user: AuthUser;
  emailSent: boolean;
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResult> {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new ValidationError(emailValidation.error!);
    }

    if (!password) {
      throw new ValidationError('Password is required');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Check if email is verified
      if (!firebaseUser.emailVerified) {
        // Sign out immediately - don't allow unverified users
        await signOut(auth);
        throw new ValidationError('Please verify your email before signing in. Check your inbox for the verification link.');
      }

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
      };

      // Update Firestore emailVerified status (in case it wasn't updated during verification)
      await userRepository.update(firebaseUser.uid, { emailVerified: true });

      // Check if user has existing bio pages
      const bioPages = await bioPageRepository.findByUserId(firebaseUser.uid);
      
      return {
        user: authUser,
        hasExistingPage: bioPages.length > 0,
        firstPageUsername: bioPages[0]?.username,
        isEmailVerified: firebaseUser.emailVerified,
      };
    } catch (error) {
      throw new AuthenticationError('Incorrect email or password');
    }
  }

  /**
   * Register new user with email and password
   */
  async signup(email: string, password: string): Promise<SignupResult> {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new ValidationError(emailValidation.error!);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.error!);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      await userRepository.create(firebaseUser.uid, {
        email: firebaseUser.email!,
        authProvider: 'email',
        emailVerified: false,
      });

      // Send email verification
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      console.log('Sending verification email with redirect URL:', currentOrigin);
      const actionCodeSettings = {
        url: `${currentOrigin}/?verified=true`,
        handleCodeInApp: false, // Let Firebase handle it and redirect back with oobCode
      };
      await sendEmailVerification(firebaseUser, actionCodeSettings);
      console.log('Verification email sent successfully');

      // Sign out immediately so user can't proceed until email is verified
      await signOut(auth);

      return {
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
        },
        emailSent: true,
      };
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new ValidationError('This email is already registered');
      }
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<LoginResult> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser.email) {
        throw new AuthenticationError('No email associated with this Google account');
      }

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      };

      // Check if user document exists in Firestore
      let firestoreUser = await userRepository.findById(firebaseUser.uid);
      
      if (!firestoreUser) {
        // Create user document for first-time Google sign-in
        await userRepository.create(firebaseUser.uid, {
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || undefined,
          avatarUrl: firebaseUser.photoURL || undefined,
          authProvider: 'google',
          emailVerified: true, // Google accounts are pre-verified
        });
      } else {
        // Update existing user to mark as verified (Google accounts are always verified)
        await userRepository.update(firebaseUser.uid, { 
          emailVerified: true,
          authProvider: 'google',
        });
      }

      // Check if user has existing bio pages
      const bioPages = await bioPageRepository.findByUserId(firebaseUser.uid);
      
      return {
        user: authUser,
        hasExistingPage: bioPages.length > 0,
        firstPageUsername: bioPages[0]?.username,
        isEmailVerified: true, // Google accounts are always verified
      };
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new ValidationError('Sign-in cancelled');
      }
      
      if (firebaseError.code === 'auth/popup-blocked') {
        throw new ValidationError('Pop-up blocked by browser. Please allow pop-ups and try again.');
      }
      
      throw new AuthenticationError('Failed to sign in with Google');
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      return null;
    }
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
    };
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      // Only treat the user as authenticated in the app when their email is verified.
      // This prevents transient authenticated state (e.g. immediately after signup
      // before the verification step completes) from allowing access or navigation.
      if (firebaseUser && firebaseUser.email && firebaseUser.emailVerified) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        // For unverified users or signed-out state, report null so the app treats
        // them as unauthenticated.
        callback(null);
      }
    });
  }

  /**
   * Check if user has any bio pages
   */
  async checkUserHasBioPages(userId: string): Promise<{ hasPages: boolean; pages: BioPage[] }> {
    const pages = await bioPageRepository.findByUserId(userId);
    return {
      hasPages: pages.length > 0,
      pages,
    };
  }
}

export const authService = new AuthService();

