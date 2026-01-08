// src/features/analytics/services/analyticsService.ts
// Analytics business logic service

import { analyticsRepository } from "@/infrastructure/repositories/analyticsRepository";
import { linkRepository } from "@/infrastructure/repositories/linkRepository";
import { blockRepository } from "@/infrastructure/repositories/blockRepository";
import type {
  TrackPageViewInput,
  TrackClickInput,
  PageAnalyticsSummary,
  DailyAnalytics,
  LinkAnalytics,
  BlockAnalytics,
  TrafficSource,
  DeviceType,
  AnalyticsEvent,
} from "@/shared/types/analytics";

class AnalyticsService {
  /**
   * Track a page view
   */
  async trackPageView(input: TrackPageViewInput): Promise<void> {
    const {
      pageId,
      referrer,
      userAgent,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    } = input;

    // Parse referrer domain
    const referrerDomain = referrer ? this.extractDomain(referrer) : undefined;

    // Detect device type
    const deviceType = userAgent ? this.detectDeviceType(userAgent) : undefined;

    // Create event record with UTM parameters
    await analyticsRepository.createEvent({
      pageId,
      eventType: "page_view",
      referrer,
      referrerDomain,
      userAgent,
      deviceType,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    });

    // Increment cached counter
    await analyticsRepository.incrementPageViewCount(pageId);
  }

  /**
   * Track a link click
   */
  async trackLinkClick(input: TrackClickInput): Promise<void> {
    const { pageId, linkId, referrer, userAgent } = input;

    if (!linkId) {
      throw new Error("linkId is required for link click tracking");
    }

    const referrerDomain = referrer ? this.extractDomain(referrer) : undefined;
    const deviceType = userAgent ? this.detectDeviceType(userAgent) : undefined;

    // Create event record
    await analyticsRepository.createEvent({
      pageId,
      eventType: "link_click",
      linkId,
      referrer,
      referrerDomain,
      userAgent,
      deviceType,
    });

    // Increment cached counter
    await analyticsRepository.incrementLinkClickCount(pageId, linkId);
  }

  /**
   * Track a block click
   */
  async trackBlockClick(input: TrackClickInput): Promise<void> {
    const { pageId, blockId, referrer, userAgent } = input;

    if (!blockId) {
      throw new Error("blockId is required for block click tracking");
    }

    const referrerDomain = referrer ? this.extractDomain(referrer) : undefined;
    const deviceType = userAgent ? this.detectDeviceType(userAgent) : undefined;

    // Create event record
    await analyticsRepository.createEvent({
      pageId,
      eventType: "block_click",
      blockId,
      referrer,
      referrerDomain,
      userAgent,
      deviceType,
    });

    // Increment cached counter
    await analyticsRepository.incrementBlockClickCount(pageId, blockId);
  }

  /**
   * Get analytics summary for a page
   */
  async getPageAnalytics(
    pageId: string,
    days: number = 7
  ): Promise<PageAnalyticsSummary> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all events for the period
    const [allEvents, links, blocks] = await Promise.all([
      analyticsRepository.getEventsByPageId(pageId, startDate, endDate),
      linkRepository.findAll(pageId),
      blockRepository.findAll(pageId),
    ]);

    // Separate events by type
    const pageViews = allEvents.filter((e) => e.eventType === "page_view");
    const clicks = allEvents.filter(
      (e) => e.eventType === "link_click" || e.eventType === "block_click"
    );

    // Calculate daily analytics
    const dailyData = this.calculateDailyAnalytics(pageViews, clicks, days);

    // Calculate totals
    const totalViews = pageViews.length;
    const totalClicks = clicks.length;
    const averageCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    // Calculate link stats
    const linkStats = this.calculateLinkStats(allEvents, links);

    // Calculate block stats
    const blockStats = this.calculateBlockStats(allEvents, blocks);

    // Calculate traffic sources
    const trafficSources = this.calculateTrafficSources(pageViews);

    return {
      totalViews,
      totalClicks,
      averageCTR: parseFloat(averageCTR.toFixed(2)),
      dailyData,
      linkStats,
      blockStats,
      trafficSources,
    };
  }

  /**
   * Calculate daily analytics from events
   */
  private calculateDailyAnalytics(
    pageViews: AnalyticsEvent[],
    clicks: AnalyticsEvent[],
    days: number
  ): DailyAnalytics[] {
    const dailyData: DailyAnalytics[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // Filter events for this day
      const dayViews = pageViews.filter(
        (e) => e.timestamp >= date && e.timestamp < nextDate
      );
      const dayClicks = clicks.filter(
        (e) => e.timestamp >= date && e.timestamp < nextDate
      );

      // Count unique (by user agent as proxy)
      const uniqueViewAgents = new Set(
        dayViews.map((e) => e.userAgent || "unknown")
      );
      const uniqueClickAgents = new Set(
        dayClicks.map((e) => e.userAgent || "unknown")
      );

      const totalViews = dayViews.length;
      const totalClicks = dayClicks.length;
      const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      dailyData.push({
        date: this.formatDate(date),
        totalViews,
        uniqueViews: uniqueViewAgents.size,
        totalClicks,
        uniqueClicks: uniqueClickAgents.size,
        ctr: parseFloat(ctr.toFixed(2)),
      });
    }

    return dailyData;
  }

  /**
   * Calculate link statistics
   */
  private calculateLinkStats(
    events: AnalyticsEvent[],
    links: Array<{ id: string; title: string; clickCount: number }>
  ): LinkAnalytics[] {
    const linkClicks = events.filter(
      (e) => e.eventType === "link_click" && e.linkId
    );

    // Count clicks per link
    const clickCounts = new Map<string, { count: number; lastClick?: Date }>();
    linkClicks.forEach((event) => {
      if (event.linkId) {
        const existing = clickCounts.get(event.linkId) || { count: 0 };
        clickCounts.set(event.linkId, {
          count: existing.count + 1,
          lastClick: event.timestamp,
        });
      }
    });

    // Build link stats
    return links
      .map((link) => {
        const stats = clickCounts.get(link.id);
        return {
          linkId: link.id,
          title: link.title,
          clicks: stats?.count || link.clickCount || 0,
          lastClickedAt: stats?.lastClick,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);
  }

  /**
   * Calculate block statistics
   */
  private calculateBlockStats(
    events: AnalyticsEvent[],
    blocks: Array<{
      id: string;
      title: string;
      type: string;
      clickCount?: number;
    }>
  ): BlockAnalytics[] {
    const blockClicks = events.filter(
      (e) => e.eventType === "block_click" && e.blockId
    );

    // Count clicks per block
    const clickCounts = new Map<string, { count: number; lastClick?: Date }>();
    blockClicks.forEach((event) => {
      if (event.blockId) {
        const existing = clickCounts.get(event.blockId) || { count: 0 };
        clickCounts.set(event.blockId, {
          count: existing.count + 1,
          lastClick: event.timestamp,
        });
      }
    });

    // Build block stats
    return blocks
      .map((block) => {
        const stats = clickCounts.get(block.id);
        return {
          blockId: block.id,
          title: block.title,
          type: block.type,
          clicks: stats?.count || block.clickCount || 0,
          lastClickedAt: stats?.lastClick,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);
  }

  /**
   * Calculate traffic sources from page views
   * Prioritizes UTM source over referrer domain
   */
  private calculateTrafficSources(
    pageViews: AnalyticsEvent[]
  ): TrafficSource[] {
    if (pageViews.length === 0) {
      return [];
    }

    // Count by UTM source first, fallback to referrer domain
    const sourceCounts = new Map<string, number>();
    pageViews.forEach((event) => {
      // Priority: UTM source > referrer domain > direct
      let source: string;
      if (event.utmSource) {
        // Use UTM source with medium if available
        source = event.utmMedium
          ? `${event.utmSource} (${event.utmMedium})`
          : event.utmSource;
      } else if (event.referrerDomain) {
        source = event.referrerDomain;
      } else {
        source = "Truy cập trực tiếp";
      }
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    });

    // Define colors for known sources
    const sourceColors: Record<string, string> = {
      "facebook.com": "#1877f2",
      "fb.com": "#1877f2",
      "instagram.com": "#e4405f",
      "tiktok.com": "#000000",
      "zalo.me": "#0068ff",
      "twitter.com": "#1da1f2",
      "x.com": "#000000",
      "youtube.com": "#ff0000",
      "google.com": "#4285f4",
      "Truy cập trực tiếp": "#8bc34a",
      // UTM source colors
      facebook: "#1877f2",
      instagram: "#e4405f",
      tiktok: "#000000",
      zalo: "#0068ff",
      twitter: "#1da1f2",
      youtube: "#ff0000",
      google: "#4285f4",
      email: "#ff9800",
      newsletter: "#ff9800",
      linkedin: "#0077b5",
      pinterest: "#e60023",
    };

    const totalViews = pageViews.length;

    // Convert to array and calculate percentages
    const sources: TrafficSource[] = Array.from(sourceCounts.entries())
      .map(([name, value]) => ({
        name: this.formatSourceName(name),
        value,
        percentage: parseFloat(((value / totalViews) * 100).toFixed(1)),
        color: sourceColors[name] || "#9e9e9e",
      }))
      .sort((a, b) => b.value - a.value);

    // Group small sources into "Khác" if there are too many
    if (sources.length > 6) {
      const topSources = sources.slice(0, 5);
      const otherSources = sources.slice(5);
      const otherValue = otherSources.reduce((sum, s) => sum + s.value, 0);
      const otherPercentage = otherSources.reduce(
        (sum, s) => sum + s.percentage,
        0
      );

      topSources.push({
        name: "Khác",
        value: otherValue,
        percentage: parseFloat(otherPercentage.toFixed(1)),
        color: "#9e9e9e",
      });

      return topSources;
    }

    return sources;
  }

  /**
   * Format source name for display
   */
  private formatSourceName(domain: string): string {
    const nameMap: Record<string, string> = {
      "facebook.com": "Facebook",
      "fb.com": "Facebook",
      "instagram.com": "Instagram",
      "tiktok.com": "TikTok",
      "zalo.me": "Zalo",
      "twitter.com": "Twitter",
      "x.com": "X (Twitter)",
      "youtube.com": "YouTube",
      "google.com": "Google",
      "Truy cập trực tiếp": "Truy cập trực tiếp",
      // UTM source names (lowercase to match)
      facebook: "Facebook",
      instagram: "Instagram",
      tiktok: "TikTok",
      zalo: "Zalo",
      twitter: "Twitter",
      youtube: "YouTube",
      google: "Google",
      email: "Email",
      newsletter: "Newsletter",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
    };

    // Check for UTM source with medium format: "source (medium)"
    const utmMatch = domain.match(/^(\w+)\s*\((\w+)\)$/);
    if (utmMatch) {
      const source = nameMap[utmMatch[1].toLowerCase()] || utmMatch[1];
      const medium = utmMatch[2];
      return `${source} (${medium})`;
    }

    return nameMap[domain] || nameMap[domain.toLowerCase()] || domain;
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  }

  /**
   * Detect device type from user agent
   */
  private detectDeviceType(userAgent: string): DeviceType {
    const ua = userAgent.toLowerCase();

    if (/tablet|ipad|playbook|silk/.test(ua)) {
      return "tablet";
    }

    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua)) {
      return "mobile";
    }

    return "desktop";
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    const month = date.toLocaleString("en", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  }
}

export const analyticsService = new AnalyticsService();
