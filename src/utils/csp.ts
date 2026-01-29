/**
 * Content Security Policy - Miraflores Plus
 * 
 * CSP configuration and utilities
 */

import { logger } from './logger';
import { isDevelopment } from './env';

/**
 * CSP Directives
 */
export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'media-src'?: string[];
  'object-src'?: string[];
  'frame-src'?: string[];
  'worker-src'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'base-uri'?: string[];
  'manifest-src'?: string[];
}

/**
 * Get CSP directives for the application
 */
export function getCSPDirectives(): CSPDirectives {
  const directives: CSPDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      // Allow inline scripts in development
      ...(isDevelopment() ? ["'unsafe-inline'", "'unsafe-eval'"] : []),
      // Trusted CDNs
      'https://trusted-cdn.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind and inline styles
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:', // For data URIs
      'https:', // Allow HTTPS images
      'blob:', // For blob URLs
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      // Add your API endpoints
      'https://api.miraflores.com',
      'https://analytics.miraflores.com',
      ...(isDevelopment() ? ['http://localhost:*', 'ws://localhost:*'] : []),
    ],
    'media-src': ["'self'", 'https:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"], // Prevent clickjacking
    'base-uri': ["'self'"],
    'manifest-src': ["'self'"],
  };

  return directives;
}

/**
 * Convert CSP directives to string
 */
export function directivesToString(directives: CSPDirectives): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Get CSP meta tag content
 */
export function getCSPMetaContent(): string {
  const directives = getCSPDirectives();
  return directivesToString(directives);
}

/**
 * Apply CSP via meta tag (for static sites)
 */
export function applyCSPMetaTag(): void {
  if (typeof document === 'undefined') return;

  // Remove existing CSP meta tag
  const existing = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (existing) {
    existing.remove();
  }

  // Create new CSP meta tag
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = getCSPMetaContent();
  document.head.appendChild(meta);

  logger.info('CSP meta tag applied', { content: meta.content });
}

/**
 * Report CSP violations
 */
export function setupCSPReporting(): void {
  if (typeof document === 'undefined') return;

  // Listen for CSP violations
  document.addEventListener('securitypolicyviolation', (e) => {
    logger.error('CSP Violation', {
      violatedDirective: e.violatedDirective,
      blockedURI: e.blockedURI,
      sourceFile: e.sourceFile,
      lineNumber: e.lineNumber,
      columnNumber: e.columnNumber,
      originalPolicy: e.originalPolicy,
    });

    // In production, send to backend
    // fetch('/api/csp-report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     violatedDirective: e.violatedDirective,
    //     blockedURI: e.blockedURI,
    //     sourceFile: e.sourceFile,
    //     lineNumber: e.lineNumber,
    //   }),
    // });
  });

  logger.debug('CSP reporting initialized');
}

/**
 * Security Headers Configuration
 */
export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
}

/**
 * Get recommended security headers
 */
export function getSecurityHeaders(): SecurityHeaders {
  return {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // XSS Protection (legacy, but still good to have)
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy (formerly Feature-Policy)
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

    // Force HTTPS (only in production)
    'Strict-Transport-Security': isDevelopment()
      ? ''
      : 'max-age=31536000; includeSubDomains; preload',
  };
}

/**
 * Validate external resource URL
 */
export function isAllowedExternalResource(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const directives = getCSPDirectives();

    // Get all allowed sources
    const allowedSources = [
      ...(directives['default-src'] || []),
      ...(directives['script-src'] || []),
      ...(directives['style-src'] || []),
      ...(directives['img-src'] || []),
      ...(directives['connect-src'] || []),
    ];

    // Check if URL matches any allowed source
    return allowedSources.some((source) => {
      if (source === "'self'") {
        return urlObj.origin === window.location.origin;
      }
      if (source === 'https:') {
        return urlObj.protocol === 'https:';
      }
      if (source.endsWith('*')) {
        const pattern = source.slice(0, -1);
        return urlObj.href.startsWith(pattern);
      }
      return urlObj.href.startsWith(source);
    });
  } catch (error) {
    logger.error('Invalid URL in CSP check', { url, error });
    return false;
  }
}

/**
 * Nonce generator for inline scripts
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Initialize CSP
 */
export function initializeCSP(): void {
  // Skip CSP in development or Figma preview
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (
    isDevelopment() ||
    currentDomain.includes('figma') ||
    currentDomain.includes('localhost') ||
    currentDomain.includes('preview')
  ) {
    logger.warn('CSP deshabilitado en desarrollo/preview');
    return;
  }

  // Apply CSP meta tag
  applyCSPMetaTag();

  // Setup violation reporting
  setupCSPReporting();

  logger.info('CSP initialized');
}

/**
 * CSP utilities for React components
 */

/**
 * Check if inline script is safe (for CSP)
 */
export function isSafeInlineScript(script: string): boolean {
  // Check for dangerous patterns
  const dangerousPatterns = [
    /eval\(/i,
    /Function\(/i,
    /setTimeout\(/i,
    /setInterval\(/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(script));
}

/**
 * Sanitize inline script for CSP
 */
export function sanitizeInlineScript(script: string): string | null {
  if (!isSafeInlineScript(script)) {
    logger.warn('Blocked unsafe inline script', {
      script: script.substring(0, 100),
    });
    return null;
  }

  return script;
}

/**
 * CSP report endpoint types
 */
export interface CSPReport {
  'document-uri': string;
  referrer: string;
  'violated-directive': string;
  'effective-directive': string;
  'original-policy': string;
  disposition: string;
  'blocked-uri': string;
  'line-number': number;
  'column-number': number;
  'source-file': string;
  'status-code': number;
  'script-sample': string;
}

/**
 * Parse CSP report
 */
export function parseCSPReport(report: any): CSPReport | null {
  try {
    return report['csp-report'] as CSPReport;
  } catch (error) {
    logger.error('Failed to parse CSP report', { error });
    return null;
  }
}
