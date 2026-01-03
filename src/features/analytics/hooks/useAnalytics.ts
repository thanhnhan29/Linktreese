// src/features/analytics/hooks/useAnalytics.ts
// Analytics React hooks

import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";
import type { PageAnalyticsSummary } from "@/shared/types/analytics";

interface UsePageAnalyticsOptions {
  pageId: string;
  days?: number;
  enabled?: boolean;
}

interface UsePageAnalyticsReturn {
  analytics: PageAnalyticsSummary | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage page analytics data
 */
export function usePageAnalytics({
  pageId,
  days = 7,
  enabled = true,
}: UsePageAnalyticsOptions): UsePageAnalyticsReturn {
  const [analytics, setAnalytics] = useState<PageAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!pageId || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getPageAnalytics(pageId, days);
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch analytics")
      );
    } finally {
      setLoading(false);
    }
  }, [pageId, days, enabled]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

/**
 * Hook for tracking page views with deduplication
 */
export function useTrackPageView(pageId: string | undefined) {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (!pageId || tracked) return;

    // Deduplication: only track once per session for this page
    const viewKey = `viewed_${pageId}`;
    if (sessionStorage.getItem(viewKey)) {
      setTracked(true);
      return;
    }

    const trackView = async () => {
      try {
        await analyticsService.trackPageView({
          pageId,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        });
        sessionStorage.setItem(viewKey, "true");
        setTracked(true);
      } catch (err) {
        console.error("Error tracking page view:", err);
      }
    };

    trackView();
  }, [pageId, tracked]);

  return tracked;
}

/**
 * Hook for tracking link clicks
 */
export function useTrackLinkClick(pageId: string | undefined) {
  const trackClick = useCallback(
    async (linkId: string) => {
      if (!pageId || !linkId) return;

      try {
        await analyticsService.trackLinkClick({
          pageId,
          linkId,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        });
      } catch (err) {
        console.error("Error tracking link click:", err);
      }
    },
    [pageId]
  );

  return trackClick;
}

/**
 * Hook for tracking block clicks
 */
export function useTrackBlockClick(pageId: string | undefined) {
  const trackClick = useCallback(
    async (blockId: string) => {
      if (!pageId || !blockId) return;

      try {
        await analyticsService.trackBlockClick({
          pageId,
          blockId,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        });
      } catch (err) {
        console.error("Error tracking block click:", err);
      }
    },
    [pageId]
  );

  return trackClick;
}
