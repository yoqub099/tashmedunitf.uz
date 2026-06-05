/**
 * @tmtu/analytics — Tracking adapters
 *
 * TODO:
 *   - Extract Google Analytics gtag wrapper from apps/web/src/components/Analytics.tsx
 *   - Add Yandex Metrika adapter
 *   - Privacy-first: respect Do Not Track + cookie consent
 */

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export interface AnalyticsAdapter {
  init(): Promise<void> | void;
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name?: string): void;
}

export const noopAdapter: AnalyticsAdapter = {
  init: () => {},
  track: () => {},
  identify: () => {},
  page: () => {},
};
