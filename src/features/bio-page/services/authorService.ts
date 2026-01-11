// src/features/bio-page/services/authorService.ts
// Service for fetching author information and their bio pages

import { bioPageRepository } from "@/infrastructure/repositories";

/**
 * Summary of a bio page for display in author overview
 */
export interface BioPageSummary {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bioDescription?: string;
  viewCount: number;
}

/**
 * Author overview data including user info and their bio pages
 */
export interface AuthorOverview {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bioPages: BioPageSummary[];
  totalViews: number;
}

class AuthorService {
  /**
   * Get author overview by user ID
   * Fetches all published bio pages for this user
   * Avatar and displayName come from bio pages only (accounts only have email)
   */
  async getAuthorOverview(userId: string): Promise<AuthorOverview | null> {
    try {
      // Fetch all bio pages for this user
      const bioPages = await bioPageRepository.findByUserId(userId);

      // Filter only published pages for public view
      const publishedPages = bioPages.filter((page) => page.published);

      if (publishedPages.length === 0) {
        return null;
      }

      // Calculate total views across all pages
      const totalViews = publishedPages.reduce(
        (sum, page) => sum + (page.viewCount || 0),
        0
      );

      // Use the first page's display name/avatar as author info
      // Since user accounts only have email, we get avatar/name from bio pages
      const primaryPage = publishedPages[0];

      // Map bio pages to summary format
      const pageSummaries: BioPageSummary[] = publishedPages.map((page) => ({
        id: page.id,
        username: page.username,
        displayName: page.displayName,
        avatarUrl: page.avatarUrl,
        bioDescription: page.bioDescription,
        viewCount: page.viewCount || 0,
      }));

      return {
        userId,
        // Use primary bio page's displayName, fallback to username
        displayName: primaryPage.displayName || primaryPage.username,
        // Use primary bio page's avatar
        avatarUrl: primaryPage.avatarUrl,
        bioPages: pageSummaries,
        totalViews,
      };
    } catch (error) {
      console.error("Error fetching author overview:", error);
      return null;
    }
  }

  /**
   * Get author overview by username
   * First finds the bio page to get user ID, then fetches author info
   */
  async getAuthorOverviewByUsername(
    username: string
  ): Promise<AuthorOverview | null> {
    try {
      const bioPage = await bioPageRepository.findByUsername(username);
      if (!bioPage) {
        return null;
      }

      return this.getAuthorOverview(bioPage.userId);
    } catch (error) {
      console.error("Error fetching author overview by username:", error);
      return null;
    }
  }
}

export const authorService = new AuthorService();
