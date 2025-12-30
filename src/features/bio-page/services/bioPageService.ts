// src/features/bio-page/services/bioPageService.ts
// Bio page business logic service

import { bioPageRepository } from '@/infrastructure/repositories';
import { validateUsername } from '@/shared/lib/validation';
import { ValidationError, ConflictError, NotFoundError } from '@/shared/lib/errors';
import type { BioPage, ThemeConfig } from '@/shared/types';

export interface CreateBioPageInput {
  userId: string;
  username: string;
  displayName?: string;
  bioDescription?: string;
}

export interface UpdateBioPageInput {
  displayName?: string;
  bioDescription?: string;
  avatarUrl?: string;
  themeConfig?: Partial<ThemeConfig>;
}

class BioPageService {
  /**
   * Create a new bio page with username validation
   */
  async createBioPage(input: CreateBioPageInput): Promise<BioPage> {
    // Validate username format
    const validation = validateUsername(input.username);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!);
    }

    // Check if username is already taken
    const isAvailable = await bioPageRepository.isUsernameAvailable(input.username);
    if (!isAvailable) {
      throw new ConflictError('This username is already taken');
    }

    // Create the bio page
    return bioPageRepository.create({
      userId: input.userId,
      username: input.username,
      displayName: input.displayName || input.username,
      bioDescription: input.bioDescription || '',
      published: true,
    });
  }

  /**
   * Get all bio pages for a user
   */
  async getBioPagesByUserId(userId: string): Promise<BioPage[]> {
    return bioPageRepository.findByUserId(userId);
  }

  /**
   * Get a bio page by username
   */
  async getBioPageByUsername(username: string): Promise<BioPage | null> {
    return bioPageRepository.findByUsername(username);
  }

  /**
   * Get a bio page by ID
   */
  async getBioPageById(id: string): Promise<BioPage | null> {
    return bioPageRepository.findById(id);
  }

  /**
   * Check if a username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    return bioPageRepository.isUsernameAvailable(username);
  }

  /**
   * Update a bio page
   */
  async updateBioPage(id: string, input: UpdateBioPageInput): Promise<BioPage> {
    const existing = await bioPageRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Bio page');
    }

    return bioPageRepository.update(id, input);
  }

  /**
   * Delete a bio page
   */
  async deleteBioPage(id: string): Promise<void> {
    const existing = await bioPageRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Bio page');
    }

    await bioPageRepository.delete(id);
  }
}

export const bioPageService = new BioPageService();

