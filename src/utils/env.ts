/**
 * Environment Utilities - Miraflores Plus
 * 
 * Safe environment detection utilities
 */

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  try {
    return typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;
  } catch {
    return false;
  }
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  try {
    return typeof import.meta !== 'undefined' && import.meta.env?.PROD === true;
  } catch {
    return true; // Default to production if unable to detect
  }
};

/**
 * Get environment mode
 */
export const getMode = (): 'development' | 'production' => {
  return isDevelopment() ? 'development' : 'production';
};
