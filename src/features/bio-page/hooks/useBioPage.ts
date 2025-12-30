// src/features/bio-page/hooks/useBioPage.ts
// Hook for managing bio page state and actions

import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, doc, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase';
import { bioPageService } from '../services/bioPageService';
import type { BioPage, ThemeConfig, PageSettings } from '@/shared/types';
import { toast } from 'sonner';

interface UseBioPageReturn {
  bioPage: BioPage | null;
  bioPages: BioPage[];
  loading: boolean;
  error: string | null;
  updateProfile: (avatarUrl: string, bioDescription: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  updateTheme: (themeConfig: Partial<ThemeConfig>) => Promise<void>;
  updateSettings: (settings: Partial<PageSettings>) => Promise<void>;
  createBioPage: (username: string) => Promise<BioPage>;
  deleteBioPage: (id: string) => Promise<void>;
}

export function useBioPage(userId: string | undefined, currentUsername: string | null): UseBioPageReturn {
  const [bioPage, setBioPage] = useState<BioPage | null>(null);
  const [bioPages, setBioPages] = useState<BioPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to current bio page
  useEffect(() => {
    if (!currentUsername) {
      setBioPage(null);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bio_pages'),
      where('username', '==', currentUsername.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        setBioPage({
          id: docSnap.id,
          userId: data.userId,
          username: data.username,
          displayName: data.displayName,
          bioDescription: data.bioDescription,
          avatarUrl: data.avatarUrl,
          isLogoHidden: data.isLogoHidden || false,
          published: data.published ?? true,
          viewCount: data.viewCount || 0,
          themeConfig: data.themeConfig,
          settings: data.settings,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        });
      } else {
        setBioPage(null);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error subscribing to bio page:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUsername]);

  // Subscribe to all user's bio pages
  useEffect(() => {
    if (!userId) {
      setBioPages([]);
      return;
    }

    const q = query(
      collection(db, 'bio_pages'),
      where('userId', '==', userId),
      orderBy('username', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pages: BioPage[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          username: data.username,
          displayName: data.displayName,
          bioDescription: data.bioDescription,
          avatarUrl: data.avatarUrl,
          isLogoHidden: data.isLogoHidden || false,
          published: data.published ?? true,
          viewCount: data.viewCount || 0,
          themeConfig: data.themeConfig,
          settings: data.settings,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
      setBioPages(pages);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateProfile = useCallback(async (avatarUrl: string, bioDescription: string) => {
    if (!bioPage?.id) return;

    try {
      await bioPageService.updateBioPage(bioPage.id, { avatarUrl, bioDescription });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  }, [bioPage?.id]);

  const updateDisplayName = useCallback(async (displayName: string) => {
    if (!bioPage?.id) return;

    try {
      await bioPageService.updateBioPage(bioPage.id, { displayName });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update display name');
      throw err;
    }
  }, [bioPage?.id]);

  const updateTheme = useCallback(async (themeConfig: Partial<ThemeConfig>) => {
    if (!bioPage?.id) return;

    try {
      await bioPageService.updateBioPage(bioPage.id, { themeConfig });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update theme');
      throw err;
    }
  }, [bioPage?.id]);

  const updateSettings = useCallback(async (settings: Partial<PageSettings>) => {
    if (!bioPage?.id) return;

    try {
      // Update settings in Firestore
      const docRef = doc(db, 'bio_pages', bioPage.id);
      const { updateDoc, serverTimestamp } = await import('firebase/firestore');
      await updateDoc(docRef, {
        settings: { ...bioPage.settings, ...settings },
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
      throw err;
    }
  }, [bioPage?.id, bioPage?.settings]);

  const createBioPage = useCallback(async (username: string): Promise<BioPage> => {
    if (!userId) throw new Error('User not authenticated');

    try {
      const newPage = await bioPageService.createBioPage({
        userId,
        username,
      });
      toast.success('Bio page created successfully!');
      return newPage;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create bio page');
      throw err;
    }
  }, [userId]);

  const deleteBioPage = useCallback(async (id: string) => {
    try {
      await bioPageService.deleteBioPage(id);
      toast.success('Bio page deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete bio page');
      throw err;
    }
  }, []);

  return {
    bioPage,
    bioPages,
    loading,
    error,
    updateProfile,
    updateDisplayName,
    updateTheme,
    updateSettings,
    createBioPage,
    deleteBioPage,
  };
}

