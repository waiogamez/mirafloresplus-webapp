/**
 * Rate Limiter - Miraflores Plus
 * 
 * Frontend rate limiting to prevent abuse and excessive API calls
 */

import { logger } from './logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  requests: number[];
  blockedUntil?: number;
}

/**
 * Rate Limiter Class
 * Implements a sliding window rate limiting algorithm
 */
class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  /**
   * Configure rate limit for a specific key
   */
  configure(key: string, config: RateLimitConfig) {
    this.configs.set(key, config);
    logger.debug('Rate limit configured', { key, config });
  }

  /**
   * Check if a request can be made
   */
  canMakeRequest(key: string, customConfig?: RateLimitConfig): boolean {
    const config = customConfig || this.configs.get(key);

    if (!config) {
      logger.warn('No rate limit config found for key', { key });
      return true;
    }

    const now = Date.now();
    const entry = this.limits.get(key) || { requests: [] };

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      const remainingMs = entry.blockedUntil - now;
      logger.warn('Request blocked by rate limiter', {
        key,
        remainingMs,
        remainingSeconds: Math.ceil(remainingMs / 1000),
      });
      return false;
    }

    // Remove old requests outside the window
    const windowStart = now - config.windowMs;
    const validRequests = entry.requests.filter((time) => time > windowStart);

    // Check if limit exceeded
    if (validRequests.length >= config.maxRequests) {
      // Block for configured duration
      if (config.blockDurationMs) {
        entry.blockedUntil = now + config.blockDurationMs;
      }

      this.limits.set(key, { ...entry, requests: validRequests });

      logger.warn('Rate limit exceeded', {
        key,
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
        currentRequests: validRequests.length,
      });

      return false;
    }

    // Add current request
    validRequests.push(now);
    this.limits.set(key, { ...entry, requests: validRequests });

    return true;
  }

  /**
   * Record a request (without checking limit)
   */
  recordRequest(key: string) {
    const now = Date.now();
    const entry = this.limits.get(key) || { requests: [] };
    entry.requests.push(now);
    this.limits.set(key, entry);
  }

  /**
   * Get remaining requests for a key
   */
  getRemainingRequests(key: string): number {
    const config = this.configs.get(key);
    if (!config) return Infinity;

    const entry = this.limits.get(key);
    if (!entry) return config.maxRequests;

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const validRequests = entry.requests.filter((time) => time > windowStart);

    return Math.max(0, config.maxRequests - validRequests.length);
  }

  /**
   * Get time until next request is allowed (in ms)
   */
  getTimeUntilReset(key: string): number {
    const entry = this.limits.get(key);
    if (!entry || entry.requests.length === 0) return 0;

    const config = this.configs.get(key);
    if (!config) return 0;

    // If blocked, return time until unblocked
    const now = Date.now();
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return entry.blockedUntil - now;
    }

    // Otherwise, return time until oldest request expires
    const oldestRequest = Math.min(...entry.requests);
    const resetTime = oldestRequest + config.windowMs;
    return Math.max(0, resetTime - now);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string) {
    this.limits.delete(key);
    logger.debug('Rate limit reset', { key });
  }

  /**
   * Reset all rate limits
   */
  resetAll() {
    this.limits.clear();
    logger.debug('All rate limits reset');
  }

  /**
   * Get rate limit status
   */
  getStatus(key: string) {
    const config = this.configs.get(key);
    const entry = this.limits.get(key);
    const now = Date.now();

    return {
      configured: !!config,
      maxRequests: config?.maxRequests || 0,
      windowMs: config?.windowMs || 0,
      currentRequests: entry?.requests?.length || 0,
      remainingRequests: this.getRemainingRequests(key),
      timeUntilReset: this.getTimeUntilReset(key),
      isBlocked: entry?.blockedUntil ? now < entry.blockedUntil : false,
    };
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Configure common rate limits
rateLimiter.configure('search', {
  maxRequests: 10,
  windowMs: 60000, // 10 requests per minute
});

rateLimiter.configure('api', {
  maxRequests: 30,
  windowMs: 60000, // 30 requests per minute
  blockDurationMs: 30000, // Block for 30 seconds
});

rateLimiter.configure('login', {
  maxRequests: 5,
  windowMs: 300000, // 5 attempts per 5 minutes
  blockDurationMs: 300000, // Block for 5 minutes
});

rateLimiter.configure('form-submit', {
  maxRequests: 20,
  windowMs: 60000, // 20 submissions per minute
});

/**
 * React hook for rate limiting
 */
export function useRateLimit(key: string, config?: RateLimitConfig) {
  return {
    canMakeRequest: () => rateLimiter.canMakeRequest(key, config),
    getRemainingRequests: () => rateLimiter.getRemainingRequests(key),
    getTimeUntilReset: () => rateLimiter.getTimeUntilReset(key),
    getStatus: () => rateLimiter.getStatus(key),
    reset: () => rateLimiter.reset(key),
  };
}

/**
 * Decorator for rate-limited functions
 */
export function withRateLimit<T extends (...args: any[]) => any>(
  key: string,
  fn: T,
  config?: RateLimitConfig
): T {
  return ((...args: any[]) => {
    if (!rateLimiter.canMakeRequest(key, config)) {
      const status = rateLimiter.getStatus(key);
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(status.timeUntilReset / 1000)} seconds.`
      );
    }
    return fn(...args);
  }) as T;
}
