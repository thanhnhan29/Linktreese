// src/features/auth/services/authService.ts
// Authentication service with business logic

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
}

export interface SignupResult {
  user: AuthUser;
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

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
      };

      // Check if user has existing bio pages
      const bioPages = await bioPageRepository.findByUserId(firebaseUser.uid);
      
      return {
        user: authUser,
        hasExistingPage: bioPages.length > 0,
        firstPageUsername: bioPages[0]?.username,
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
      });

      return {
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
        },
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
      if (firebaseUser && firebaseUser.email) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
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

