// src/infrastructure/repositories/blockRepository.ts
// Block data access layer (subcollection of bio_pages)

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
  DocumentSnapshot,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Block, BlockType } from '@/shared/types';

export interface CreateBlockDTO {
  type: BlockType;
  title: string;
  isVisible?: boolean;
  data: Record<string, unknown>;
}

export interface UpdateBlockDTO {
  title?: string;
  isVisible?: boolean;
  data?: Record<string, unknown>;
}

class BlockRepository {
  private getBlocksCollection(bioPageId: string) {
    return collection(db, 'bio_pages', bioPageId, 'blocks');
  }

  private getBlockDoc(bioPageId: string, blockId: string) {
    return doc(db, 'bio_pages', bioPageId, 'blocks', blockId);
  }

  /**
   * Find block by ID
   */
  async findById(bioPageId: string, blockId: string): Promise<Block | null> {
    const docRef = this.getBlockDoc(bioPageId, blockId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? this.mapToModel(snapshot) : null;
  }

  /**
   * Get all blocks for a bio page (ordered by sortOrder)
   */
  async findAll(bioPageId: string): Promise<Block[]> {
    const q = query(this.getBlocksCollection(bioPageId), orderBy('sortOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToModel(doc));
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(bioPageId: string, callback: (blocks: Block[]) => void): Unsubscribe {
    const q = query(this.getBlocksCollection(bioPageId), orderBy('sortOrder', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const blocks = snapshot.docs.map(doc => this.mapToModel(doc));
      callback(blocks);
    });
  }

  /**
   * Create new block
   */
  async create(bioPageId: string, data: CreateBlockDTO): Promise<Block> {
    // Get current max sortOrder
    const existingBlocks = await this.findAll(bioPageId);
    const maxOrder = existingBlocks.reduce((max, block) => Math.max(max, block.sortOrder), -1);

    const payload = {
      type: data.type,
      title: data.title,
      isVisible: data.isVisible ?? true,
      sortOrder: maxOrder + 1,
      clickCount: 0,
      data: data.data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.getBlocksCollection(bioPageId), payload);

    const created = await this.findById(bioPageId, docRef.id);
    if (!created) {
      throw new Error('Failed to create block');
    }
    return created;
  }

  /**
   * Update block
   */
  async update(bioPageId: string, blockId: string, data: UpdateBlockDTO): Promise<Block> {
    const docRef = this.getBlockDoc(bioPageId, blockId);

    const payload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (data.title !== undefined) payload.title = data.title;
    if (data.isVisible !== undefined) payload.isVisible = data.isVisible;
    if (data.data !== undefined) payload.data = data.data;

    await updateDoc(docRef, payload);

    const updated = await this.findById(bioPageId, blockId);
    if (!updated) {
      throw new Error('Failed to update block');
    }
    return updated;
  }

  /**
   * Toggle block visibility
   */
  async toggle(bioPageId: string, blockId: string): Promise<Block> {
    const block = await this.findById(bioPageId, blockId);
    if (!block) {
      throw new Error('Block not found');
    }

    return this.update(bioPageId, blockId, { isVisible: !block.isVisible });
  }

  /**
   * Delete block
   */
  async delete(bioPageId: string, blockId: string): Promise<void> {
    const docRef = this.getBlockDoc(bioPageId, blockId);
    await deleteDoc(docRef);
  }

  /**
   * Reorder blocks
   */
  async reorder(bioPageId: string, orderedBlockIds: string[]): Promise<void> {
    const batch = writeBatch(db);

    orderedBlockIds.forEach((blockId, index) => {
      batch.update(this.getBlockDoc(bioPageId, blockId), { sortOrder: index });
    });

    await batch.commit();
  }

  /**
   * Increment click count
   */
  async incrementClickCount(bioPageId: string, blockId: string): Promise<void> {
    const block = await this.findById(bioPageId, blockId);
    if (!block) return;

    const docRef = this.getBlockDoc(bioPageId, blockId);
    await updateDoc(docRef, { clickCount: block.clickCount + 1 });
  }

  /**
   * Map Firestore document to Block model
   */
  private mapToModel(snapshot: DocumentSnapshot): Block {
    const data = snapshot.data()!;
    return {
      id: snapshot.id,
      type: data.type,
      title: data.title || '',
      isVisible: data.isVisible ?? true,
      sortOrder: data.sortOrder ?? 0,
      clickCount: data.clickCount || 0,
      data: data.data || {},
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || undefined,
    };
  }
}

export const blockRepository = new BlockRepository();

