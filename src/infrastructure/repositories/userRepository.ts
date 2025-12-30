// src/infrastructure/repositories/userRepository.ts
// User data access layer

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from '@/shared/types';

export interface CreateUserDTO {
  email: string;
  fullName?: string;
  avatarUrl?: string;
  authProvider?: 'email' | 'google';
  proPurchase?: boolean;
}

export interface UpdateUserDTO {
  fullName?: string;
  avatarUrl?: string;
  proPurchase?: boolean;
  proExpiresAt?: Date;
}

class UserRepository {
  private collectionName = 'users';

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? this.mapToModel(snapshot) : null;
  }

  /**
   * Create new user
   */
  async create(id: string, data: CreateUserDTO): Promise<User> {
    const docRef = doc(db, this.collectionName, id);
    
    const payload = {
      email: data.email,
      fullName: data.fullName || '',
      avatarUrl: data.avatarUrl || '',
      authProvider: data.authProvider || 'email',
      proPurchase: data.proPurchase || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    
    // Return the created user
    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create user');
    }
    return created;
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const docRef = doc(db, this.collectionName, id);
    
    const payload: Record<string, unknown> = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
    
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update user');
    }
    return updated;
  }

  /**
   * Map Firestore document to User model
   */
  private mapToModel(snapshot: DocumentSnapshot): User {
    const data = snapshot.data()!;
    return {
      id: snapshot.id,
      email: data.email || '',
      fullName: data.fullName || undefined,
      avatarUrl: data.avatarUrl || undefined,
      authProvider: data.authProvider || 'email',
      proPurchase: data.proPurchase || false,
      proExpiresAt: data.proExpiresAt?.toDate() || undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const userRepository = new UserRepository();

