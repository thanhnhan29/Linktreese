// src/infrastructure/repositories/analyticsRepository.ts
// Analytics data access layer

import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  AnalyticsEvent,
  AnalyticsEventType,
  DeviceType,
} from "@/shared/types/analytics";

export interface CreateAnalyticsEventDTO {
  pageId: string;
  eventType: AnalyticsEventType;
  linkId?: string;
  blockId?: string;
  referrer?: string;
  referrerDomain?: string;
  userAgent?: string;
  deviceType?: DeviceType;
  // UTM tracking parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

class AnalyticsRepository {
  private collectionName = "analytics_events";

  /**
   * Create a new analytics event
   */
  async createEvent(data: CreateAnalyticsEventDTO): Promise<string> {
    const payload = {
      pageId: data.pageId,
      eventType: data.eventType,
      linkId: data.linkId || null,
      blockId: data.blockId || null,
      referrer: data.referrer || null,
      referrerDomain: data.referrerDomain || null,
      userAgent: data.userAgent || null,
      deviceType: data.deviceType || null,
      // UTM tracking parameters
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, this.collectionName), payload);
    return docRef.id;
  }

  /**
   * Get events for a page within a date range
   */
  async getEventsByPageId(
    pageId: string,
    startDate: Date,
    endDate: Date,
    eventType?: AnalyticsEventType
  ): Promise<AnalyticsEvent[]> {
    let q = query(
      collection(db, this.collectionName),
      where("pageId", "==", pageId),
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      where("timestamp", "<=", Timestamp.fromDate(endDate)),
      orderBy("timestamp", "desc")
    );

    if (eventType) {
      q = query(
        collection(db, this.collectionName),
        where("pageId", "==", pageId),
        where("eventType", "==", eventType),
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<=", Timestamp.fromDate(endDate)),
        orderBy("timestamp", "desc")
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapToModel(doc));
  }

  /**
   * Get all page view events for a page
   */
  async getPageViews(
    pageId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsEvent[]> {
    return this.getEventsByPageId(pageId, startDate, endDate, "page_view");
  }

  /**
   * Get all click events for a page
   */
  async getClicks(
    pageId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsEvent[]> {
    const q = query(
      collection(db, this.collectionName),
      where("pageId", "==", pageId),
      where("eventType", "in", ["link_click", "block_click"]),
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      where("timestamp", "<=", Timestamp.fromDate(endDate)),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.mapToModel(doc));
  }

  /**
   * Increment view count on bio page
   */
  async incrementPageViewCount(pageId: string): Promise<void> {
    const docRef = doc(db, "bio_pages", pageId);
    await updateDoc(docRef, { viewCount: increment(1) });
  }

  /**
   * Increment click count on a link
   */
  async incrementLinkClickCount(pageId: string, linkId: string): Promise<void> {
    const docRef = doc(db, "bio_pages", pageId, "links", linkId);
    await updateDoc(docRef, { clickCount: increment(1) });
  }

  /**
   * Increment click count on a block
   */
  async incrementBlockClickCount(
    pageId: string,
    blockId: string
  ): Promise<void> {
    const docRef = doc(db, "bio_pages", pageId, "blocks", blockId);
    await updateDoc(docRef, { clickCount: increment(1) });
  }

  /**
   * Get current view count for a page
   */
  async getPageViewCount(pageId: string): Promise<number> {
    const docRef = doc(db, "bio_pages", pageId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return 0;
    return snapshot.data()?.viewCount || 0;
  }

  /**
   * Map Firestore document to AnalyticsEvent model
   */
  private mapToModel(snapshot: any): AnalyticsEvent {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      pageId: data.pageId,
      eventType: data.eventType,
      linkId: data.linkId || undefined,
      blockId: data.blockId || undefined,
      referrer: data.referrer || undefined,
      referrerDomain: data.referrerDomain || undefined,
      userAgent: data.userAgent || undefined,
      deviceType: data.deviceType || undefined,
      // UTM tracking parameters
      utmSource: data.utmSource || undefined,
      utmMedium: data.utmMedium || undefined,
      utmCampaign: data.utmCampaign || undefined,
      utmTerm: data.utmTerm || undefined,
      utmContent: data.utmContent || undefined,
      timestamp: data.timestamp?.toDate() || new Date(),
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();
