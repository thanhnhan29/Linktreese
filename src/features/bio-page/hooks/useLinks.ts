// src/features/bio-page/hooks/useLinks.ts
// Hook for managing links state and actions

import { useState, useEffect, useCallback } from 'react';
import { linkService } from '../services/linkService';
import type { Link } from '@/shared/types';
import { toast } from 'sonner';

interface UseLinksReturn {
  links: Link[];
  loading: boolean;
  error: string | null;
  addLink: (title: string, url: string, type?: string, platform?: string, data?: Record<string, unknown>) => Promise<void>;
  updateLink: (id: string, title: string, url: string, type?: string, platform?: string, data?: Record<string, unknown>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  toggleLink: (id: string) => Promise<void>;
  moveLink: (id: string, direction: 'up' | 'down') => Promise<void>;
}

export function useLinks(bioPageId: string | null): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);

  // Subscribe to real-time link updates
  useEffect(() => {
    if (!bioPageId) {
      setLinks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = linkService.subscribeToLinks(bioPageId, (updatedLinks) => {
      setLinks(updatedLinks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bioPageId]);

  const addLink = useCallback(async (
    title: string, 
    url: string, 
    type?: string, 
    platform?: string, 
    data?: Record<string, unknown>
  ) => {
    if (!bioPageId) return;

    try {
      await linkService.createLink(bioPageId, {
        title,
        url,
        type: type as 'social' | 'custom',
        platform,
        data,
      });
      toast.success('Link added successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add link');
      throw err;
    }
  }, [bioPageId]);

  const updateLink = useCallback(async (
    id: string,
    title: string,
    url: string,
    type?: string,
    platform?: string,
    data?: Record<string, unknown>
  ) => {
    if (!bioPageId) return;

    try {
      await linkService.updateLink(bioPageId, id, {
        title,
        url,
        type: type as 'social' | 'custom',
        platform,
        data,
      });
      toast.success('Link updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update link');
      throw err;
    }
  }, [bioPageId]);

  const deleteLink = useCallback(async (id: string) => {
    if (!bioPageId) return;

    try {
      await linkService.deleteLink(bioPageId, id);
      toast.success('Link deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete link');
      throw err;
    }
  }, [bioPageId]);

  const toggleLink = useCallback(async (id: string) => {
    if (!bioPageId) return;

    try {
      await linkService.toggleLink(bioPageId, id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle link');
      throw err;
    }
  }, [bioPageId]);

  const moveLink = useCallback(async (id: string, direction: 'up' | 'down') => {
    if (!bioPageId) return;

    try {
      await linkService.moveLink(bioPageId, id, direction);
    } catch (err: any) {
      toast.error(err.message || 'Failed to move link');
      throw err;
    }
  }, [bioPageId]);

  return {
    links,
    loading,
    error,
    addLink,
    updateLink,
    deleteLink,
    toggleLink,
    moveLink,
  };
}

