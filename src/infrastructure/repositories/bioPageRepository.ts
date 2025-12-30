// src/infrastructure/repositories/bioPageRepository.ts
// Bio page data access layer

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { BioPage, ThemeConfig } from '@/shared/types';
import { DEFAULT_THEME_CONFIG } from '@/shared/types';

export interface CreateBioPageDTO {
  userId: string;
  username: string;
  displayName?: string;
  bioDescription?: string;
  avatarUrl?: string;
  themeConfig?: Partial<ThemeConfig>;
  published?: boolean;
}

export interface UpdateBioPageDTO {
  displayName?: string;
  bioDescription?: string;
  avatarUrl?: string;
  isLogoHidden?: boolean;
  published?: boolean;
  themeConfig?: Partial<ThemeConfig>;
}

class BioPageRepository {
  private collectionName = 'bio_pages';

  /**
   * Find bio page by ID
   */
  async findById(id: string): Promise<BioPage | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? this.mapToModel(snapshot) : null;
  }

  /**
   * Find bio page by username
   */
  async findByUsername(username: string): Promise<BioPage | null> {
    const q = query(
      collection(db, this.collectionName),
      where('username', '==', username.toLowerCase())
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    return this.mapToModel(snapshot.docs[0]);
  }

  /**
   * Find all bio pages for a user
   */
  async findByUserId(userId: string): Promise<BioPage[]> {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToModel(doc));
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const existing = await this.findByUsername(username);
    return existing === null;
  }

  /**
   * Create new bio page
   */
  async create(data: CreateBioPageDTO): Promise<BioPage> {
    const payload = {
      userId: data.userId,
      username: data.username.toLowerCase(),
      displayName: data.displayName || data.username,
      bioDescription: data.bioDescription || '',
      avatarUrl: data.avatarUrl || '',
      isLogoHidden: false,
      published: data.published ?? true,
      viewCount: 0,
      themeConfig: {
        ...DEFAULT_THEME_CONFIG,
        ...data.themeConfig,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, this.collectionName), payload);
    
    const created = await this.findById(docRef.id);
    if (!created) {
      throw new Error('Failed to create bio page');
    }
    return created;
  }

  /**
   * Update bio page
   */
  async update(id: string, data: UpdateBioPageDTO): Promise<BioPage> {
    const docRef = doc(db, this.collectionName, id);
    
    // Get current data for theme config merge
    const current = await this.findById(id);
    if (!current) {
      throw new Error('Bio page not found');
    }

    const payload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (data.displayName !== undefined) payload.displayName = data.displayName;
    if (data.bioDescription !== undefined) payload.bioDescription = data.bioDescription;
    if (data.avatarUrl !== undefined) payload.avatarUrl = data.avatarUrl;
    if (data.isLogoHidden !== undefined) payload.isLogoHidden = data.isLogoHidden;
    if (data.published !== undefined) payload.published = data.published;
    
    if (data.themeConfig) {
      payload.themeConfig = {
        ...current.themeConfig,
        ...data.themeConfig,
      };
    }

    await updateDoc(docRef, payload);
    
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update bio page');
    }
    return updated;
  }

  /**
   * Delete bio page
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  /**
   * Map Firestore document to BioPage model
   */
  private mapToModel(snapshot: DocumentSnapshot): BioPage {
    const data = snapshot.data()!;
    return {
      id: snapshot.id,
      userId: data.userId,
      username: data.username,
      displayName: data.displayName || undefined,
      bioDescription: data.bioDescription || undefined,
      avatarUrl: data.avatarUrl || undefined,
      isLogoHidden: data.isLogoHidden || false,
      published: data.published ?? true,
      viewCount: data.viewCount || 0,
      themeConfig: {
        ...DEFAULT_THEME_CONFIG,
        ...data.themeConfig,
      },
      settings: data.settings || undefined,
      customDomain: data.customDomain || undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || undefined,
    };
  }
}

export const bioPageRepository = new BioPageRepository();

