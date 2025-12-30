// src/features/bio-page/services/blockService.ts
// Block business logic service

import { blockRepository } from '@/infrastructure/repositories';
import { ValidationError, NotFoundError } from '@/shared/lib/errors';
import type { Block, BlockType } from '@/shared/types';

export interface CreateBlockInput {
  type: BlockType;
  title: string;
  data: Record<string, unknown>;
}

export interface UpdateBlockInput {
  title?: string;
  isVisible?: boolean;
  data?: Record<string, unknown>;
}

class BlockService {
  /**
   * Create a new block
   */
  async createBlock(bioPageId: string, input: CreateBlockInput): Promise<Block> {
    if (!input.title.trim()) {
      throw new ValidationError('Block title is required');
    }

    return blockRepository.create(bioPageId, {
      type: input.type,
      title: input.title,
      data: input.data,
    });
  }

  /**
   * Get all blocks for a bio page
   */
  async getBlocks(bioPageId: string): Promise<Block[]> {
    return blockRepository.findAll(bioPageId);
  }

  /**
   * Subscribe to real-time block updates
   */
  subscribeToBlocks(bioPageId: string, callback: (blocks: Block[]) => void) {
    return blockRepository.subscribe(bioPageId, callback);
  }

  /**
   * Update a block
   */
  async updateBlock(bioPageId: string, blockId: string, input: UpdateBlockInput): Promise<Block> {
    const existing = await blockRepository.findById(bioPageId, blockId);
    if (!existing) {
      throw new NotFoundError('Block');
    }

    return blockRepository.update(bioPageId, blockId, input);
  }

  /**
   * Toggle block visibility
   */
  async toggleBlock(bioPageId: string, blockId: string): Promise<Block> {
    return blockRepository.toggle(bioPageId, blockId);
  }

  /**
   * Delete a block
   */
  async deleteBlock(bioPageId: string, blockId: string): Promise<void> {
    const existing = await blockRepository.findById(bioPageId, blockId);
    if (!existing) {
      throw new NotFoundError('Block');
    }

    await blockRepository.delete(bioPageId, blockId);
  }

  /**
   * Reorder blocks
   */
  async reorderBlocks(bioPageId: string, orderedBlockIds: string[]): Promise<void> {
    return blockRepository.reorder(bioPageId, orderedBlockIds);
  }

  /**
   * Track a block click
   */
  async trackClick(bioPageId: string, blockId: string): Promise<void> {
    return blockRepository.incrementClickCount(bioPageId, blockId);
  }
}

export const blockService = new BlockService();

