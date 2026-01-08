// src/shared/types/analytics.ts
// Analytics type definitions

export type AnalyticsEventType = "page_view" | "link_click" | "block_click";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface AnalyticsEvent {
  id: string;
  pageId: string;
  eventType: AnalyticsEventType;
  linkId?: string;
  blockId?: string;
  referrer?: string;
  referrerDomain?: string;
  userAgent?: string;
  deviceType?: DeviceType;
  country?: string;
  // UTM tracking parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  timestamp: Date;
}

export interface DailyAnalytics {
  date: string;
  totalViews: number;
  uniqueViews: number;
  totalClicks: number;
  uniqueClicks: number;
  ctr: number;
}

export interface LinkAnalytics {
  linkId: string;
  title: string;
  clicks: number;
  lastClickedAt?: Date;
}

export interface BlockAnalytics {
  blockId: string;
  title: string;
  type: string;
  clicks: number;
  lastClickedAt?: Date;
}

export interface PageAnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  averageCTR: number;
  dailyData: DailyAnalytics[];
  linkStats: LinkAnalytics[];
  blockStats: BlockAnalytics[];
  trafficSources: TrafficSource[];
}

export interface TrafficSource {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Input types for tracking
export interface TrackPageViewInput {
  pageId: string;
  referrer?: string;
  userAgent?: string;
  // UTM tracking parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface TrackClickInput {
  pageId: string;
  linkId?: string;
  blockId?: string;
  referrer?: string;
  userAgent?: string;
}
