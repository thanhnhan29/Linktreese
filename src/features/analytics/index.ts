// src/features/analytics/index.ts
// Analytics feature public API

// Services
export { analyticsService } from "./services/analyticsService";

// Hooks
export {
  usePageAnalytics,
  useTrackPageView,
  useTrackLinkClick,
  useTrackBlockClick,
} from "./hooks/useAnalytics";

// Types
export type {
  AnalyticsEvent,
  AnalyticsEventType,
  DailyAnalytics,
  LinkAnalytics,
  BlockAnalytics,
  PageAnalyticsSummary,
  TrafficSource,
  TrackPageViewInput,
  TrackClickInput,
} from "@/shared/types/analytics";
