/**
 * Cliente HTTP centralizado para comunicación con el backend
 * 
 * Características:
 * - Configuración de axios con base URL
 * - Interceptores para JWT automático
 * - Interceptores para refresh token
 * - Transformación automática camelCase ↔ snake_case
 * - Manejo centralizado de errores
 * - Logs en desarrollo
 * 
 * @module utils/api
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

/**
 * URL base de la API
 * Configurable mediante variable de entorno VITE_API_URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Timeout para peticiones (en milisegundos)
 */
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

/**
 * Habilitar logs en desarrollo
 */
const ENABLE_LOGS = import.meta.env.DEV || import.meta.env.VITE_ENABLE_API_LOGS === 'true';

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Respuesta exitosa genérica de la API
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Configuración extendida de axios con retry
 */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// ============================================================================
// CLIENTE AXIOS
// ============================================================================

/**
 * Instancia de axios configurada con interceptores
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// INTERCEPTOR DE REQUEST
// ============================================================================

apiClient.interceptors.request.use(
  (config) => {
    // 1. Agregar JWT token si existe
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Transformar datos de camelCase a snake_case si es necesario
    // (puedes activar/desactivar según tu backend)
    if (config.data && shouldTransformRequest(config)) {
      config.data = toSnakeCase(config.data);
    }

    // 3. Log en desarrollo
    if (ENABLE_LOGS) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (ENABLE_LOGS) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// INTERCEPTOR DE RESPONSE
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 1. Transformar respuesta de snake_case a camelCase si es necesario
    if (response.data && shouldTransformResponse(response)) {
      response.data = toCamelCase(response.data);
    }

    // 2. Log en desarrollo
    if (ENABLE_LOGS) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }

    // 3. Si la respuesta está envuelta en { success, data }, extraer data
    // Ajusta esto según el formato de tu backend
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data; // Retorna { success, data, message }
    }

    // Si no está envuelta, retornar tal cual
    return response.data;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Log del error
    if (ENABLE_LOGS) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: originalRequest?.url,
        message: error.response?.data?.error?.message || error.message,
        data: error.response?.data,
      });
    }

    // ========================================================================
    // MANEJAR ERROR 401: Token expirado - Intentar refresh
    // ========================================================================
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        if (ENABLE_LOGS) {
          console.log('🔄 Attempting token refresh...');
        }

        // Intentar refresh token
        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        // Guardar nuevo(s) token(s)
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Actualizar el header de la petición original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        if (ENABLE_LOGS) {
          console.log('✅ Token refreshed successfully');
        }

        // Reintentar la petición original
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (ENABLE_LOGS) {
          console.error('❌ Token refresh failed:', refreshError);
        }

        // Si falla el refresh, limpiar tokens y redirigir a login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Redirigir a login
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // ========================================================================
    // MANEJAR OTROS ERRORES
    // ========================================================================

    // Extraer mensaje de error
    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Error desconocido en la solicitud';

    const errorCode = error.response?.data?.error?.code || 'UNKNOWN_ERROR';

    // Crear objeto de error estructurado
    const structuredError = {
      status: error.response?.status,
      code: errorCode,
      message: errorMessage,
      details: error.response?.data?.error?.details || error.response?.data,
      originalError: error,
    };

    return Promise.reject(structuredError);
  }
);

// ============================================================================
// FUNCIONES AUXILIARES - TRANSFORMACIÓN DE DATOS
// ============================================================================

/**
 * Determina si se debe transformar la request a snake_case
 * Ajusta según las necesidades de tu backend
 */
function shouldTransformRequest(config: AxiosRequestConfig): boolean {
  // Por defecto, transformar todo excepto FormData
  if (config.data instanceof FormData) {
    return false;
  }
  
  // Puedes agregar más condiciones aquí
  // Por ejemplo, solo transformar ciertos endpoints:
  // return config.url?.includes('/appointments') || config.url?.includes('/affiliates');
  
  return false; // Cambia a true si tu backend usa snake_case
}

/**
 * Determina si se debe transformar la response a camelCase
 */
function shouldTransformResponse(response: AxiosResponse): boolean {
  // Por defecto, transformar todo excepto blobs
  if (response.data instanceof Blob) {
    return false;
  }
  
  return false; // Cambia a true si tu backend retorna snake_case
}

/**
 * Convierte objeto de camelCase a snake_case recursivamente
 * Usado para enviar datos al backend
 */
export function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }

  return obj;
}

/**
 * Convierte objeto de snake_case a camelCase recursivamente
 * Usado para recibir datos del backend
 */
export function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }

  return obj;
}

// ============================================================================
// HELPERS PARA REQUESTS COMUNES
// ============================================================================

/**
 * Helper para GET requests con tipos
 */
export async function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response as unknown as T;
}

/**
 * Helper para POST requests con tipos
 */
export async function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response as unknown as T;
}

/**
 * Helper para PUT requests con tipos
 */
export async function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response as unknown as T;
}

/**
 * Helper para PATCH requests con tipos
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response as unknown as T;
}

/**
 * Helper para DELETE requests con tipos
 */
export async function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response as unknown as T;
}

// ============================================================================
// EXPORTACIONES
// ============================================================================

export default apiClient;

/**
 * Uso:
 * 
 * // Opción 1: Usar el cliente directamente
 * import { apiClient } from '@/utils/api';
 * const data = await apiClient.get('/appointments');
 * 
 * // Opción 2: Usar helpers con tipos
 * import { get, post } from '@/utils/api';
 * const appointments = await get<Appointment[]>('/appointments');
 * const newAppointment = await post<Appointment>('/appointments', appointmentData);
 * 
 * // Opción 3: Transformadores manuales
 * import { toSnakeCase, toCamelCase } from '@/utils/api';
 * const backendData = toSnakeCase({ firstName: 'Juan' }); // { first_name: 'Juan' }
 */
