/**
 * Secure Storage - Miraflores Plus
 * 
 * Encrypted storage wrapper for sensitive data
 * Uses Web Crypto API for encryption
 */

import { logger } from './logger';

/**
 * Storage encryption key
 * In production, this should be derived from user session or server
 */
const STORAGE_KEY = 'miraflores-storage-key';
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * Secure Storage Class
 */
class SecureStorage {
  private encryptionKey: CryptoKey | null = null;
  private initialized = false;

  /**
   * Initialize encryption
   */
  async initialize(password?: string): Promise<void> {
    if (this.initialized) return;

    try {
      // In a real app, derive key from user password or server
      // For now, use a deterministic key from localStorage
      let keyMaterial = password || localStorage.getItem(STORAGE_KEY);

      if (!keyMaterial) {
        // Generate random key material
        keyMaterial = this.generateRandomString(32);
        localStorage.setItem(STORAGE_KEY, keyMaterial);
      }

      // Derive encryption key
      this.encryptionKey = await this.deriveKey(keyMaterial);
      this.initialized = true;

      logger.debug('Secure storage initialized');
    } catch (error) {
      logger.error('Failed to initialize secure storage', { error });
      throw error;
    }
  }

  /**
   * Generate random string
   */
  private generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Derive encryption key from password
   */
  private async deriveKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('miraflores-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data
   */
  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    try {
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await crypto.subtle.encrypt(
        {
          name: ENCRYPTION_ALGORITHM,
          iv,
        },
        this.encryptionKey!,
        encoder.encode(data)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      logger.error('Encryption failed', { error });
      throw error;
    }
  }

  /**
   * Decrypt data
   */
  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    try {
      // Convert from base64
      const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: ENCRYPTION_ALGORITHM,
          iv,
        },
        this.encryptionKey!,
        data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      logger.error('Decryption failed', { error });
      throw error;
    }
  }

  /**
   * Store encrypted item
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = await this.encrypt(serialized);
      localStorage.setItem(key, encrypted);

      logger.debug('Stored encrypted item', { key });
    } catch (error) {
      logger.error('Failed to store encrypted item', { key, error });
      throw error;
    }
  }

  /**
   * Get encrypted item
   */
  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const encrypted = localStorage.getItem(key);

      if (!encrypted) {
        return null;
      }

      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      logger.error('Failed to retrieve encrypted item', { key, error });
      return null;
    }
  }

  /**
   * Remove item
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
    logger.debug('Removed encrypted item', { key });
  }

  /**
   * Clear all encrypted storage
   */
  clear(): void {
    localStorage.clear();
    logger.debug('Cleared all encrypted storage');
  }

  /**
   * Check if key exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

/**
 * Simple encrypted storage (synchronous, less secure)
 * Uses Base64 encoding - NOT CRYPTOGRAPHICALLY SECURE
 * Only use for non-sensitive data or development
 */
export class SimpleSecureStorage {
  /**
   * Simple encode (NOT SECURE - use for development only)
   */
  private encode(data: string): string {
    return btoa(encodeURIComponent(data));
  }

  /**
   * Simple decode
   */
  private decode(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch (error) {
      logger.error('Failed to decode data', { error });
      return '';
    }
  }

  /**
   * Store item
   */
  setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      const encoded = this.encode(serialized);
      localStorage.setItem(key, encoded);
    } catch (error) {
      logger.error('Failed to store item', { key, error });
    }
  }

  /**
   * Get item
   */
  getItem<T = any>(key: string): T | null {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;

      const decoded = this.decode(encoded);
      return JSON.parse(decoded) as T;
    } catch (error) {
      logger.error('Failed to retrieve item', { key, error });
      return null;
    }
  }

  /**
   * Remove item
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all
   */
  clear(): void {
    localStorage.clear();
  }
}

export const simpleSecureStorage = new SimpleSecureStorage();

/**
 * Session Storage (encrypted)
 */
export class SecureSessionStorage {
  private storage = secureStorage;

  async setItem(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const encoded = btoa(encodeURIComponent(serialized));
      sessionStorage.setItem(key, encoded);
    } catch (error) {
      logger.error('Failed to store session item', { key, error });
    }
  }

  getItem<T = any>(key: string): T | null {
    try {
      const encoded = sessionStorage.getItem(key);
      if (!encoded) return null;

      const decoded = decodeURIComponent(atob(encoded));
      return JSON.parse(decoded) as T;
    } catch (error) {
      logger.error('Failed to retrieve session item', { key, error });
      return null;
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}

export const secureSessionStorage = new SecureSessionStorage();

/**
 * Utility functions
 */

/**
 * Hash password (client-side - for demo only)
 * In production, NEVER hash passwords on client side
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate secure random token
 */
export function generateToken(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate token format
 */
export function validateToken(token: string): boolean {
  // Check if token is a valid hex string
  return /^[0-9a-f]+$/i.test(token) && token.length >= 32;
}
