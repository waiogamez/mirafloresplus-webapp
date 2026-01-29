/**
 * Analytics System - Miraflores Plus
 * 
 * Mock implementation of analytics tracking (Google Analytics-like)
 * In production, replace with real GA4 or Plausible
 */

import { isDevelopment, isProduction } from './env';

export interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  user?: {
    id: string;
    role: string;
  };
  session: {
    id: string;
    page: string;
    referrer: string;
  };
}

export interface PageView {
  id: string;
  timestamp: Date;
  page: string;
  title: string;
  url: string;
  referrer: string;
  duration?: number;
  user?: {
    id: string;
    role: string;
  };
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private currentPageView: PageView | null = null;
  private sessionId: string;
  private enabled = true;
  private maxEvents = 500;

  constructor() {
    // Generate or restore session ID
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Initialize analytics
   */
  init(options?: { enabled?: boolean; maxEvents?: number }) {
    this.enabled = options?.enabled ?? true;
    this.maxEvents = options?.maxEvents ?? 500;

    if (this.enabled) {
      this.setupPageViewTracking();
      console.log('[Analytics] Initialized - Session:', this.sessionId);
    }
  }

  /**
   * Get or create session ID
   */
  private getOrCreateSessionId(): string {
    const stored = sessionStorage.getItem('miraflores-session-id');
    if (stored) return stored;

    const newId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('miraflores-session-id', newId);
    return newId;
  }

  /**
   * Setup automatic page view tracking
   */
  private setupPageViewTracking() {
    // Track initial page view
    this.trackPageView();

    // Track page unload (to calculate duration)
    window.addEventListener('beforeunload', () => {
      if (this.currentPageView) {
        const duration = Date.now() - this.currentPageView.timestamp.getTime();
        this.currentPageView.duration = duration;
      }
    });
  }

  /**
   * Track a page view
   */
  trackPageView(page?: string, title?: string) {
    if (!this.enabled) return;

    // End previous page view
    if (this.currentPageView) {
      const duration = Date.now() - this.currentPageView.timestamp.getTime();
      this.currentPageView.duration = duration;
    }

    // Create new page view
    const pageView: PageView = {
      id: `pv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      page: page || window.location.pathname,
      title: title || document.title,
      url: window.location.href,
      referrer: document.referrer,
      user: this.getUserInfo(),
    };

    this.pageViews.push(pageView);
    this.currentPageView = pageView;

    // Keep only last N page views
    if (this.pageViews.length > this.maxEvents) {
      this.pageViews = this.pageViews.slice(-this.maxEvents);
    }

    if (isDevelopment()) {
      console.log('[Analytics] Page View:', pageView.page);
    }

    this.sendToBackend('pageview', pageView);
  }

  /**
   * Track an event
   */
  trackEvent(
    name: string,
    category: string,
    action: string,
    options?: {
      label?: string;
      value?: number;
      properties?: Record<string, any>;
    }
  ) {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      name,
      category,
      action,
      label: options?.label,
      value: options?.value,
      properties: options?.properties,
      user: this.getUserInfo(),
      session: {
        id: this.sessionId,
        page: window.location.pathname,
        referrer: document.referrer,
      },
    };

    this.events.push(event);

    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    if (isDevelopment()) {
      console.log(`[Analytics] Event: ${category} - ${action}`, options?.properties);
    }

    this.sendToBackend('event', event);
  }

  /**
   * Get user info from auth store
   */
  private getUserInfo() {
    try {
      const authData = localStorage.getItem('miraflores-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.state?.user) {
          return {
            id: parsed.state.user.id,
            role: parsed.state.user.role,
          };
        }
      }
    } catch (e) {
      // Ignore
    }
    return undefined;
  }

  /**
   * Send to backend (mock)
   */
  private sendToBackend(type: 'pageview' | 'event', data: any) {
    // In production, send to Google Analytics or backend
    if (isProduction()) {
      // Example: Google Analytics 4
      // if (window.gtag) {
      //   if (type === 'pageview') {
      //     window.gtag('event', 'page_view', {
      //       page_path: data.page,
      //       page_title: data.title,
      //     });
      //   } else {
      //     window.gtag('event', data.action, {
      //       event_category: data.category,
      //       event_label: data.label,
      //       value: data.value,
      //       ...data.properties,
      //     });
      //   }
      // }
    }
  }

  /**
   * Get all events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Get all page views
   */
  getPageViews(): PageView[] {
    return [...this.pageViews];
  }

  /**
   * Get events by category
   */
  getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.events.filter((e) => e.category === category);
  }

  /**
   * Get event counts by category
   */
  getEventCountsByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });
    return counts;
  }

  /**
   * Get most visited pages
   */
  getMostVisitedPages(limit = 10): Array<{ page: string; count: number }> {
    const counts: Record<string, number> = {};
    this.pageViews.forEach((pv) => {
      counts[pv.page] = (counts[pv.page] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get average page duration
   */
  getAveragePageDuration(page?: string): number {
    const views = page
      ? this.pageViews.filter((pv) => pv.page === page)
      : this.pageViews;

    const durations = views.filter((pv) => pv.duration).map((pv) => pv.duration!);

    if (durations.length === 0) return 0;

    const sum = durations.reduce((acc, d) => acc + d, 0);
    return sum / durations.length;
  }

  /**
   * Get session stats
   */
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      sessionDuration: this.currentPageView
        ? Date.now() - this.pageViews[0]?.timestamp.getTime()
        : 0,
      currentPage: this.currentPageView?.page,
    };
  }

  /**
   * Clear all data
   */
  clearData() {
    this.events = [];
    this.pageViews = [];
    this.currentPageView = null;
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const analytics = new Analytics();

/**
 * Predefined event trackers for common actions
 */
export const trackAppointmentCreated = (appointmentId: string) => {
  analytics.trackEvent('appointment_created', 'appointments', 'create', {
    label: appointmentId,
    properties: { appointmentId },
  });
};

export const trackAffiliateRegistered = (affiliateId: string) => {
  analytics.trackEvent('affiliate_registered', 'affiliates', 'register', {
    label: affiliateId,
    properties: { affiliateId },
  });
};

export const trackPaymentProcessed = (amount: number, method: string) => {
  analytics.trackEvent('payment_processed', 'payments', 'process', {
    value: amount,
    properties: { method },
  });
};

export const trackInvoiceApproved = (invoiceId: string) => {
  analytics.trackEvent('invoice_approved', 'invoices', 'approve', {
    label: invoiceId,
    properties: { invoiceId },
  });
};

export const trackSearchPerformed = (query: string, category: string) => {
  analytics.trackEvent('search_performed', 'search', 'query', {
    label: query,
    properties: { category },
  });
};

export const trackFilterApplied = (filterType: string, value: string) => {
  analytics.trackEvent('filter_applied', 'filters', 'apply', {
    label: filterType,
    properties: { filterType, value },
  });
};

export const trackModalOpened = (modalId: string) => {
  analytics.trackEvent('modal_opened', 'ui', 'open_modal', {
    label: modalId,
    properties: { modalId },
  });
};

export const trackFeatureUsed = (featureName: string) => {
  analytics.trackEvent('feature_used', 'features', 'use', {
    label: featureName,
    properties: { featureName },
  });
};
