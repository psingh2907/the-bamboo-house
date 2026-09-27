/**
 * Analytics abstraction.
 *
 * `trackEvent` forwards to Google Analytics 4 (gtag) when NEXT_PUBLIC_GA_ID
 * is set, and logs to the console during development. CALL, WHATSAPP and
 * DIRECTIONS are the conversions that matter most for a restaurant — mark
 * them as key events in GA4.
 */

export type AnalyticsEvent =
  | "call_click"
  | "whatsapp_click"
  | "directions_click"
  | "menu_view"
  | "gallery_open"
  | "contact_submit"
  | "google_reviews_click"
  | "social_click"
  | "game_start"
  | "game_over"
  | "game_share";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
    if (process.env.NODE_ENV === "development") {
      console.info(`[analytics] ${event}`, params);
    }
  } catch {
    // Analytics must never break the page.
  }
}
