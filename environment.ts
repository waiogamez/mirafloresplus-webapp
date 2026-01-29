/**
 * Environment Configuration for Miraflores Plus
 * 
 * Para desarrollo local: usa localhost
 * Para producción: usa la URL de tu backend en AWS/servidor
 */

export const ENV = {
  // API Base URL
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // App Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD || false,
  IS_DEVELOPMENT: import.meta.env.DEV || true,
  
  // External Services
  BAC_CREDOMATIC_API: import.meta.env.VITE_BAC_API_URL || '',
  BAC_MERCHANT_ID: import.meta.env.VITE_BAC_MERCHANT_ID || '',
  
  SAT_FEL_API: import.meta.env.VITE_SAT_FEL_API_URL || '',
  SAT_NIT: import.meta.env.VITE_SAT_NIT || '',
  
  SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY || '',
  TWILIO_ACCOUNT_SID: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  
  ZOOM_API_KEY: import.meta.env.VITE_ZOOM_API_KEY || '',
  ZOOM_API_SECRET: import.meta.env.VITE_ZOOM_API_SECRET || '',
  
  // AWS S3
  AWS_S3_BUCKET: import.meta.env.VITE_AWS_S3_BUCKET || '',
  AWS_REGION: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  
  // App Config
  APP_NAME: 'Miraflores Plus',
  APP_VERSION: '1.0.0',
  APP_TAGLINE: '¡Tu salud, a un clic de distancia!',
  
  // Feature Flags
  ENABLE_VIDEOCALLS: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: true,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Validate required environment variables in production
if (ENV.IS_PRODUCTION) {
  const required = ['API_URL'];
  const missing = required.filter(key => !ENV[key as keyof typeof ENV]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
  }
}

export default ENV;
