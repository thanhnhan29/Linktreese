// src/features/bio-page/hooks/useBlocks.ts
// Hook for managing blocks state and actions

import { useState, useEffect, useCallback } from 'react';
import { blockService } from '../services/blockService';
import type { Block, BlockType } from '@/shared/types';
import { toast } from 'sonner';

interface UseBlocksReturn {
  blocks: Block[];
  loading: boolean;
  error: string | null;
  addBlock: (type: BlockType, title: string, data: Record<string, unknown>) => Promise<void>;
  updateBlock: (id: string, title?: string, data?: Record<string, unknown>) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  toggleBlock: (id: string) => Promise<void>;
}

export function useBlocks(bioPageId: string | null): UseBlocksReturn {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);

  // Subscribe to real-time block updates
  useEffect(() => {
    if (!bioPageId) {
      setBlocks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = blockService.subscribeToBlocks(bioPageId, (updatedBlocks) => {
      setBlocks(updatedBlocks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bioPageId]);

  const addBlock = useCallback(async (type: BlockType, title: string, data: Record<string, unknown>) => {
    if (!bioPageId) return;

    try {
      await blockService.createBlock(bioPageId, { type, title, data });
      toast.success('Block added successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add block');
      throw err;
    }
  }, [bioPageId]);

  const updateBlock = useCallback(async (id: string, title?: string, data?: Record<string, unknown>) => {
    if (!bioPageId) return;

    try {
      await blockService.updateBlock(bioPageId, id, { title, data });
      toast.success('Block updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update block');
      throw err;
    }
  }, [bioPageId]);

  const deleteBlock = useCallback(async (id: string) => {
    if (!bioPageId) return;

    try {
      await blockService.deleteBlock(bioPageId, id);
      toast.success('Block deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete block');
      throw err;
    }
  }, [bioPageId]);

  const toggleBlock = useCallback(async (id: string) => {
    if (!bioPageId) return;

    try {
      await blockService.toggleBlock(bioPageId, id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle block');
      throw err;
    }
  }, [bioPageId]);

  return {
    blocks,
    loading,
    error,
    addBlock,
    updateBlock,
    deleteBlock,
    toggleBlock,
  };
}

