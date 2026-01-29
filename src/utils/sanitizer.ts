/**
 * Input Sanitization - Miraflores Plus
 * 
 * XSS protection through input sanitization
 * Uses DOMPurify-like approach without external dependency
 */

import { logger } from './logger';

/**
 * HTML sanitization config
 */
interface SanitizeConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
  stripScripts?: boolean;
  stripStyles?: boolean;
}

const DEFAULT_CONFIG: SanitizeConfig = {
  allowedTags: [
    'b',
    'i',
    'em',
    'strong',
    'u',
    'p',
    'br',
    'span',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target'],
    span: ['class'],
    div: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  stripScripts: true,
  stripStyles: true,
};

/**
 * Sanitize HTML string
 */
export function sanitizeHtml(dirty: string, config?: SanitizeConfig): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Create temporary element
    const temp = document.createElement('div');
    temp.innerHTML = dirty;

    // Remove script tags
    if (finalConfig.stripScripts) {
      const scripts = temp.querySelectorAll('script');
      scripts.forEach((script) => script.remove());
    }

    // Remove style tags
    if (finalConfig.stripStyles) {
      const styles = temp.querySelectorAll('style');
      styles.forEach((style) => style.remove());
    }

    // Remove event handlers
    const allElements = temp.querySelectorAll('*');
    allElements.forEach((element) => {
      // Remove event handler attributes (onclick, onerror, etc.)
      const attributes = Array.from(element.attributes);
      attributes.forEach((attr) => {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      });

      // Remove javascript: URLs
      if (element.hasAttribute('href')) {
        const href = element.getAttribute('href') || '';
        if (href.toLowerCase().startsWith('javascript:')) {
          element.removeAttribute('href');
        }
      }

      if (element.hasAttribute('src')) {
        const src = element.getAttribute('src') || '';
        if (src.toLowerCase().startsWith('javascript:')) {
          element.removeAttribute('src');
        }
      }

      // Check if tag is allowed
      if (
        finalConfig.allowedTags &&
        !finalConfig.allowedTags.includes(element.tagName.toLowerCase())
      ) {
        // Replace disallowed tag with its content
        const content = element.innerHTML;
        const textNode = document.createTextNode(content);
        element.parentNode?.replaceChild(textNode, element);
        return;
      }

      // Check if attributes are allowed
      if (finalConfig.allowedAttributes) {
        const allowedForTag =
          finalConfig.allowedAttributes[element.tagName.toLowerCase()] || [];
        const attrs = Array.from(element.attributes);

        attrs.forEach((attr) => {
          if (!allowedForTag.includes(attr.name)) {
            element.removeAttribute(attr.name);
          }
        });
      }
    });

    const sanitized = temp.innerHTML;

    // Log if content was modified
    if (sanitized !== dirty) {
      logger.warn('Content sanitized', {
        original: dirty.substring(0, 100),
        sanitized: sanitized.substring(0, 100),
      });
    }

    return sanitized;
  } catch (error) {
    logger.error('Error sanitizing HTML', { error });
    // Return empty string on error for safety
    return '';
  }
}

/**
 * Sanitize plain text (remove all HTML)
 */
export function sanitizeText(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  try {
    const temp = document.createElement('div');
    temp.textContent = dirty;
    return temp.innerHTML;
  } catch (error) {
    logger.error('Error sanitizing text', { error });
    return '';
  }
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string, allowedSchemes?: string[]): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const schemes = allowedSchemes || DEFAULT_CONFIG.allowedSchemes || [];

  try {
    // Remove javascript: and data: URLs by default
    const lowerUrl = url.toLowerCase().trim();

    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
      logger.warn('Blocked dangerous URL', { url: url.substring(0, 50) });
      return '';
    }

    // If URL has a scheme, check if it's allowed
    if (lowerUrl.includes(':')) {
      const scheme = lowerUrl.split(':')[0];
      if (!schemes.includes(scheme)) {
        logger.warn('Blocked URL with disallowed scheme', { scheme, url: url.substring(0, 50) });
        return '';
      }
    }

    return url;
  } catch (error) {
    logger.error('Error sanitizing URL', { error });
    return '';
  }
}

/**
 * Sanitize object keys and values
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  sanitizeValues = true
): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key
    const sanitizedKey = sanitizeText(key);

    // Sanitize value if it's a string
    if (sanitizeValues && typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[sanitizedKey] = sanitizeObject(value, sanitizeValues);
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitize SQL input (basic protection)
 */
export function sanitizeSql(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove common SQL injection patterns
  const dangerous = [
    /(\-\-|;|\/\*|\*\/|xp_|sp_|exec|execute|insert|update|delete|drop|create|alter|union|select)/gi,
  ];

  let sanitized = input;
  dangerous.forEach((pattern) => {
    if (pattern.test(sanitized)) {
      logger.warn('Blocked potential SQL injection', {
        input: input.substring(0, 50),
      });
      sanitized = sanitized.replace(pattern, '');
    }
  });

  return sanitized;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remove whitespace
  const trimmed = email.trim().toLowerCase();

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    logger.warn('Invalid email format', { email: trimmed });
    return '';
  }

  return trimmed;
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+\-\s()]/g, '');

  // Guatemala phone format: +502 1234-5678 or 1234-5678
  return cleaned.trim();
}

/**
 * Sanitize DPI (Guatemala ID)
 */
export function sanitizeDPI(dpi: string): string {
  if (!dpi || typeof dpi !== 'string') {
    return '';
  }

  // Remove all non-digit characters
  const cleaned = dpi.replace(/\D/g, '');

  // DPI should be 13 digits
  if (cleaned.length !== 13) {
    logger.warn('Invalid DPI length', { dpi: cleaned });
  }

  return cleaned;
}

/**
 * Sanitize form data
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Special handling for specific fields
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('phone')) {
        sanitized[key] = sanitizePhone(value);
      } else if (key.toLowerCase().includes('dpi')) {
        sanitized[key] = sanitizeDPI(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
        sanitized[key] = sanitizeUrl(value);
      } else {
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * React component to safely render HTML
 */
export function SafeHtml({
  html,
  config,
  className,
}: {
  html: string;
  config?: SanitizeConfig;
  className?: string;
}) {
  const sanitized = sanitizeHtml(html, config);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
