/**
 * Error Tracking System - Miraflores Plus
 * 
 * Mock implementation of error tracking (Sentry-like)
 * In production, replace with real Sentry SDK
 */

import { isDevelopment, isProduction } from './env';

export interface ErrorEvent {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  level: 'info' | 'warning' | 'error' | 'fatal';
  context: {
    user?: {
      id: string;
      email: string;
      role: string;
    };
    page: string;
    url: string;
    userAgent: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

class ErrorTracker {
  private errors: ErrorEvent[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory
  private enabled = true;

  /**
   * Initialize error tracking
   */
  init(options?: { enabled?: boolean; maxErrors?: number }) {
    this.enabled = options?.enabled ?? true;
    this.maxErrors = options?.maxErrors ?? 100;

    if (this.enabled) {
      this.setupGlobalHandlers();
      console.log('[ErrorTracker] Initialized');
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      // Don't block the app - just log
      try {
        this.captureError(event.error || new Error(event.message), {
          level: 'error',
          tags: { type: 'uncaught-error' },
          extra: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      } catch (err) {
        console.warn('Error tracking failed:', err);
      }
      
      // Prevent default error behavior in preview
      const currentDomain = window.location.hostname;
      if (currentDomain.includes('figma') || currentDomain.includes('preview')) {
        event.preventDefault();
      }
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'),
        {
          level: 'error',
          tags: { type: 'unhandled-rejection' },
          extra: { reason: event.reason },
        }
      );
    });

    // Catch console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.captureMessage(args.join(' '), { level: 'error' });
      originalConsoleError.apply(console, args);
    };
  }

  /**
   * Capture an error
   */
  captureError(
    error: Error,
    options?: {
      level?: ErrorEvent['level'];
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ) {
    if (!this.enabled) return;

    const errorEvent: ErrorEvent = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      level: options?.level || 'error',
      context: this.getContext(),
      tags: options?.tags,
      extra: options?.extra,
    };

    this.errors.push(errorEvent);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (isDevelopment()) {
      console.group(`[ErrorTracker] ${errorEvent.level.toUpperCase()}`);
      console.error(error);
      console.log('Context:', errorEvent.context);
      if (errorEvent.tags) console.log('Tags:', errorEvent.tags);
      if (errorEvent.extra) console.log('Extra:', errorEvent.extra);
      console.groupEnd();
    }

    // In production, send to Sentry or similar service
    this.sendToBackend(errorEvent);
  }

  /**
   * Capture a message (no error object)
   */
  captureMessage(
    message: string,
    options?: {
      level?: ErrorEvent['level'];
      tags?: Record<string, string>;
      extra?: Record<string, any>;
    }
  ) {
    if (!this.enabled) return;

    const errorEvent: ErrorEvent = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      message,
      level: options?.level || 'info',
      context: this.getContext(),
      tags: options?.tags,
      extra: options?.extra,
    };

    this.errors.push(errorEvent);

    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    if (isDevelopment() && errorEvent.level !== 'info') {
      console.log(`[ErrorTracker] ${errorEvent.level.toUpperCase()}: ${message}`);
    }

    this.sendToBackend(errorEvent);
  }

  /**
   * Get current context
   */
  private getContext(): ErrorEvent['context'] {
    // Get user from localStorage (from auth store)
    let user;
    try {
      const authData = localStorage.getItem('miraflores-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.state?.user) {
          user = {
            id: parsed.state.user.id,
            email: parsed.state.user.email,
            role: parsed.state.user.role,
          };
        }
      }
    } catch (e) {
      // Ignore
    }

    return {
      user,
      page: document.title,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  /**
   * Send error to backend (mock)
   */
  private sendToBackend(errorEvent: ErrorEvent) {
    // In production, send to Sentry/backend
    // For now, just store locally
    
    // Mock API call
    if (isProduction()) {
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorEvent),
      // });
    }
  }

  /**
   * Get all captured errors
   */
  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  /**
   * Get errors by level
   */
  getErrorsByLevel(level: ErrorEvent['level']): ErrorEvent[] {
    return this.errors.filter((e) => e.level === level);
  }

  /**
   * Get error counts
   */
  getErrorCounts() {
    return {
      total: this.errors.length,
      fatal: this.errors.filter((e) => e.level === 'fatal').length,
      error: this.errors.filter((e) => e.level === 'error').length,
      warning: this.errors.filter((e) => e.level === 'warning').length,
      info: this.errors.filter((e) => e.level === 'info').length,
    };
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Disable error tracking
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Enable error tracking
   */
  enable() {
    this.enabled = true;
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

/**
 * React Error Boundary helper
 */
export function logErrorBoundary(error: Error, errorInfo: { componentStack: string }) {
  errorTracker.captureError(error, {
    level: 'error',
    tags: { type: 'react-error-boundary' },
    extra: { componentStack: errorInfo.componentStack },
  });
}

/**
 * Utility to wrap async functions with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { tags?: Record<string, string>; extra?: Record<string, any> }
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTracker.captureError(error as Error, {
        level: 'error',
        tags: options?.tags,
        extra: options?.extra,
      });
      throw error;
    }
  }) as T;
}
