// src/infrastructure/repositories/linkRepository.ts
// Link data access layer (subcollection of bio_pages)

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
import type { Link } from '@/shared/types';

export interface CreateLinkDTO {
  title: string;
  url: string;
  type?: 'social' | 'custom';
  platform?: string;
  isActive?: boolean;
  data?: Record<string, unknown>;
}

export interface UpdateLinkDTO {
  title?: string;
  url?: string;
  type?: 'social' | 'custom';
  platform?: string;
  isActive?: boolean;
  data?: Record<string, unknown>;
}

class LinkRepository {
  private getLinksCollection(bioPageId: string) {
    return collection(db, 'bio_pages', bioPageId, 'links');
  }

  private getLinkDoc(bioPageId: string, linkId: string) {
    return doc(db, 'bio_pages', bioPageId, 'links', linkId);
  }

  /**
   * Find link by ID
   */
  async findById(bioPageId: string, linkId: string): Promise<Link | null> {
    const docRef = this.getLinkDoc(bioPageId, linkId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? this.mapToModel(snapshot) : null;
  }

  /**
   * Get all links for a bio page (ordered by order field)
   */
  async findAll(bioPageId: string): Promise<Link[]> {
    const q = query(this.getLinksCollection(bioPageId), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToModel(doc));
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(bioPageId: string, callback: (links: Link[]) => void): Unsubscribe {
    const q = query(this.getLinksCollection(bioPageId), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const links = snapshot.docs.map(doc => this.mapToModel(doc));
      callback(links);
    });
  }

  /**
   * Create new link
   */
  async create(bioPageId: string, data: CreateLinkDTO): Promise<Link> {
    // Check if unified order was passed via data
    let order: number;
    const dataWithoutOrder = { ...data.data };
    
    if (dataWithoutOrder && typeof dataWithoutOrder._unifiedOrder === 'number') {
      order = dataWithoutOrder._unifiedOrder;
      delete dataWithoutOrder._unifiedOrder;
    } else {
      // Fallback: Get current max order from links only
      const existingLinks = await this.findAll(bioPageId);
      const maxOrder = existingLinks.reduce((max, link) => Math.max(max, link.order), -1);
      order = maxOrder + 1;
    }

    const payload = {
      title: data.title,
      url: data.url,
      type: data.type || 'custom',
      platform: data.platform || null,
      isActive: data.isActive ?? true,
      order,
      clickCount: 0,
      data: dataWithoutOrder || {},
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.getLinksCollection(bioPageId), payload);
    
    const created = await this.findById(bioPageId, docRef.id);
    if (!created) {
      throw new Error('Failed to create link');
    }
    return created;
  }

  /**
   * Update link
   */
  async update(bioPageId: string, linkId: string, data: UpdateLinkDTO): Promise<Link> {
    const docRef = this.getLinkDoc(bioPageId, linkId);

    const payload: Record<string, unknown> = {};

    if (data.title !== undefined) payload.title = data.title;
    if (data.url !== undefined) payload.url = data.url;
    if (data.type !== undefined) payload.type = data.type;
    if (data.platform !== undefined) payload.platform = data.platform;
    if (data.isActive !== undefined) payload.isActive = data.isActive;
    if (data.data !== undefined) payload.data = data.data;

    await updateDoc(docRef, payload);

    const updated = await this.findById(bioPageId, linkId);
    if (!updated) {
      throw new Error('Failed to update link');
    }
    return updated;
  }

  /**
   * Toggle link active state
   */
  async toggle(bioPageId: string, linkId: string): Promise<Link> {
    const link = await this.findById(bioPageId, linkId);
    if (!link) {
      throw new Error('Link not found');
    }

    return this.update(bioPageId, linkId, { isActive: !link.isActive });
  }

  /**
   * Delete link
   */
  async delete(bioPageId: string, linkId: string): Promise<void> {
    const docRef = this.getLinkDoc(bioPageId, linkId);
    await deleteDoc(docRef);
  }

  /**
   * Move link up or down
   */
  async move(bioPageId: string, linkId: string, direction: 'up' | 'down'): Promise<void> {
    const links = await this.findAll(bioPageId);
    const index = links.findIndex(l => l.id === linkId);
    
    if (index === -1) {
      throw new Error('Link not found');
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) {
      return; // Can't move beyond boundaries
    }

    const currentLink = links[index];
    const targetLink = links[targetIndex];

    // Swap orders using batch write
    const batch = writeBatch(db);
    batch.update(this.getLinkDoc(bioPageId, currentLink.id), { order: targetLink.order });
    batch.update(this.getLinkDoc(bioPageId, targetLink.id), { order: currentLink.order });

    await batch.commit();
  }

  /**
   * Reorder all links (useful for drag and drop)
   */
  async reorder(bioPageId: string, orderedLinkIds: string[]): Promise<void> {
    const batch = writeBatch(db);

    orderedLinkIds.forEach((linkId, index) => {
      batch.update(this.getLinkDoc(bioPageId, linkId), { order: index });
    });

    await batch.commit();
  }

  /**
   * Increment click count
   */
  async incrementClickCount(bioPageId: string, linkId: string): Promise<void> {
    const link = await this.findById(bioPageId, linkId);
    if (!link) return;

    const docRef = this.getLinkDoc(bioPageId, linkId);
    await updateDoc(docRef, { clickCount: link.clickCount + 1 });
  }

  /**
   * Map Firestore document to Link model
   */
  private mapToModel(snapshot: DocumentSnapshot): Link {
    const data = snapshot.data()!;
    return {
      id: snapshot.id,
      title: data.title || '',
      url: data.url || '',
      type: data.type || 'custom',
      platform: data.platform || undefined,
      icon: data.icon || undefined,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      clickCount: data.clickCount || 0,
      data: data.data || {},
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }
}

export const linkRepository = new LinkRepository();

