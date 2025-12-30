// src/features/bio-page/services/linkService.ts
// Link business logic service

import { linkRepository } from '@/infrastructure/repositories';
import { ValidationError, NotFoundError } from '@/shared/lib/errors';
import type { Link } from '@/shared/types';

export interface CreateLinkInput {
  title: string;
  url: string;
  type?: 'social' | 'custom';
  platform?: string;
  data?: Record<string, unknown>;
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  type?: 'social' | 'custom';
  platform?: string;
  isActive?: boolean;
  data?: Record<string, unknown>;
}

// Auto-detect social platform from URL
const detectSocialPlatform = (url: string): string | null => {
  const lowercaseUrl = url.toLowerCase();

  if (lowercaseUrl.includes('instagram.com')) return 'instagram';
  if (lowercaseUrl.includes('tiktok.com')) return 'tiktok';
  if (lowercaseUrl.includes('facebook.com') || lowercaseUrl.includes('fb.com')) return 'facebook';
  if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'x';
  if (lowercaseUrl.includes('pinterest.com')) return 'pinterest';
  if (lowercaseUrl.includes('snapchat.com')) return 'snapchat';
  if (lowercaseUrl.includes('whatsapp.com') || lowercaseUrl.includes('wa.me')) return 'whatsapp';
  if (lowercaseUrl.includes('reddit.com')) return 'reddit';
  if (lowercaseUrl.includes('twitch.tv')) return 'twitch';
  if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) return 'youtube';
  if (lowercaseUrl.includes('linkedin.com')) return 'linkedin';
  if (lowercaseUrl.includes('github.com')) return 'github';
  if (lowercaseUrl.includes('telegram.org') || lowercaseUrl.includes('t.me')) return 'telegram';

  return null;
};

class LinkService {
  /**
   * Create a new link
   */
  async createLink(bioPageId: string, input: CreateLinkInput): Promise<Link> {
    if (!input.title.trim()) {
      throw new ValidationError('Link title is required');
    }

    if (!input.url.trim()) {
      throw new ValidationError('Link URL is required');
    }

    // Auto-detect platform if type is social
    let platform = input.platform;
    let type = input.type || 'custom';

    if (!platform && input.url) {
      const detectedPlatform = detectSocialPlatform(input.url);
      if (detectedPlatform) {
        platform = detectedPlatform;
        type = 'social';
      }
    }

    return linkRepository.create(bioPageId, {
      title: input.title,
      url: input.url,
      type,
      platform,
      data: input.data,
    });
  }

  /**
   * Get all links for a bio page
   */
  async getLinks(bioPageId: string): Promise<Link[]> {
    return linkRepository.findAll(bioPageId);
  }

  /**
   * Subscribe to real-time link updates
   */
  subscribeToLinks(bioPageId: string, callback: (links: Link[]) => void) {
    return linkRepository.subscribe(bioPageId, callback);
  }

  /**
   * Update a link
   */
  async updateLink(bioPageId: string, linkId: string, input: UpdateLinkInput): Promise<Link> {
    const existing = await linkRepository.findById(bioPageId, linkId);
    if (!existing) {
      throw new NotFoundError('Link');
    }

    return linkRepository.update(bioPageId, linkId, input);
  }

  /**
   * Toggle link active state
   */
  async toggleLink(bioPageId: string, linkId: string): Promise<Link> {
    return linkRepository.toggle(bioPageId, linkId);
  }

  /**
   * Delete a link
   */
  async deleteLink(bioPageId: string, linkId: string): Promise<void> {
    const existing = await linkRepository.findById(bioPageId, linkId);
    if (!existing) {
      throw new NotFoundError('Link');
    }

    await linkRepository.delete(bioPageId, linkId);
  }

  /**
   * Move a link up or down
   */
  async moveLink(bioPageId: string, linkId: string, direction: 'up' | 'down'): Promise<void> {
    return linkRepository.move(bioPageId, linkId, direction);
  }

  /**
   * Reorder all links
   */
  async reorderLinks(bioPageId: string, orderedLinkIds: string[]): Promise<void> {
    return linkRepository.reorder(bioPageId, orderedLinkIds);
  }

  /**
   * Track a link click
   */
  async trackClick(bioPageId: string, linkId: string): Promise<void> {
    return linkRepository.incrementClickCount(bioPageId, linkId);
  }
}

export const linkService = new LinkService();

