/**
 * Tipos TypeScript para respuestas y peticiones de la API
 * 
 * Estos tipos definen la estructura de datos que viaja entre
 * el frontend y el backend.
 * 
 * @module store/apiTypes
 */

// ============================================================================
// TIPOS GENÉRICOS DE RESPUESTAS
// ============================================================================

/**
 * Respuesta exitosa genérica
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Respuesta de error
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: any;
  };
}

/**
 * Respuesta paginada
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
  message?: string;
}

/**
 * Códigos de error comunes
 */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Error de validación individual
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// ============================================================================
// AUTENTICACIÓN
// ============================================================================

/**
 * Payload para login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Respuesta de login exitoso
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    hospital?: string;
    permissions: string[];
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Payload para refresh token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Respuesta de refresh token
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // Opcional: algunos backends rotan el refresh token
}

// ============================================================================
// CITAS (APPOINTMENTS)
// ============================================================================

/**
 * Datos para crear una cita
 */
export interface CreateAppointmentRequest {
  affiliateId: string;
  doctorId: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  type: 'Consulta General' | 'Especialista' | 'Urgencia' | 'Seguimiento';
  status?: 'Programada' | 'Confirmada';
  hospital: 'Hospital Miraflores Roosevelt' | 'Hospital Miraflores Zona 10';
  notes?: string;
}

/**
 * Datos para actualizar una cita
 */
export interface UpdateAppointmentRequest {
  date?: string;
  time?: string;
  type?: 'Consulta General' | 'Especialista' | 'Urgencia' | 'Seguimiento';
  status?: 'Programada' | 'Confirmada' | 'En Progreso' | 'Completada' | 'Cancelada' | 'No Asistió';
  hospital?: 'Hospital Miraflores Roosevelt' | 'Hospital Miraflores Zona 10';
  notes?: string;
  cancellationReason?: string;
}

/**
 * Respuesta de cita individual
 */
export interface AppointmentResponse {
  id: string;
  affiliateId: string;
  affiliateName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  hospital: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// ============================================================================
// AFILIADOS (AFFILIATES)
// ============================================================================

/**
 * Datos para crear un afiliado
 */
export interface CreateAffiliateRequest {
  firstName: string;
  lastName: string;
  dpi: string;
  email: string;
  phone: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  gender: 'Masculino' | 'Femenino' | 'Otro';
  address: string;
  city: string;
  department: string;
  planType: 'Básico' | 'Premium' | 'Elite';
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

/**
 * Datos para actualizar un afiliado
 */
export interface UpdateAffiliateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  planType?: 'Básico' | 'Premium' | 'Elite';
  status?: 'Activo' | 'Inactivo' | 'Suspendido' | 'Pendiente';
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

/**
 * Respuesta de afiliado individual
 */
export interface AffiliateResponse {
  id: string;
  firstName: string;
  lastName: string;
  dpi: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  department: string;
  planType: string;
  status: string;
  memberSince: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dependents?: DependentResponse[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * Respuesta de dependiente
 */
export interface DependentResponse {
  id: string;
  affiliateId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string;
  gender: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// PAGOS (PAYMENTS)
// ============================================================================

/**
 * Datos para crear un pago
 */
export interface CreatePaymentRequest {
  affiliateId: string;
  amount: number;
  date: string;
  dueDate?: string;
  method: 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia' | 'Efectivo';
  concept: string;
  reference?: string;
  notes?: string;
}

/**
 * Datos para actualizar un pago
 */
export interface UpdatePaymentRequest {
  status?: 'Pagado' | 'Pendiente' | 'Atrasado' | 'Cancelado';
  amount?: number;
  reference?: string;
  notes?: string;
}

/**
 * Respuesta de pago individual
 */
export interface PaymentResponse {
  id: string;
  affiliateId: string;
  amount: number;
  date: string;
  dueDate?: string;
  method: string;
  status: string;
  concept: string;
  reference?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// FACTURAS (INVOICES)
// ============================================================================

/**
 * Datos para crear una factura (cuenta por pagar)
 */
export interface CreateInvoiceRequest {
  supplier: string;
  amount: number;
  date: string;
  dueDate: string;
  category: string;
  description?: string;
  notes?: string;
}

/**
 * Datos para actualizar una factura
 */
export interface UpdateInvoiceRequest {
  amount?: number;
  dueDate?: string;
  category?: string;
  description?: string;
  notes?: string;
}

/**
 * Datos para aprobar una factura
 */
export interface ApproveInvoiceRequest {
  notes?: string;
}

/**
 * Datos para rechazar una factura
 */
export interface RejectInvoiceRequest {
  reason: string;
}

/**
 * Respuesta de factura individual
 */
export interface InvoiceResponse {
  id: string;
  supplier: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Pagada';
  category: string;
  description?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// NOTIFICACIONES (NOTIFICATIONS)
// ============================================================================

/**
 * Datos para crear una notificación (solo admin)
 */
export interface CreateNotificationRequest {
  userId?: string; // Si no se especifica, se envía a todos
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Respuesta de notificación individual
 */
export interface NotificationResponse {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

// ============================================================================
// PARÁMETROS DE QUERY
// ============================================================================

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Parámetros de ordenamiento
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Parámetros de filtro de fechas
 */
export interface DateFilterParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Parámetros de búsqueda
 */
export interface SearchParams {
  q?: string;
}

/**
 * Parámetros combinados para consultas complejas
 */
export interface QueryParams
  extends PaginationParams,
    SortParams,
    DateFilterParams,
    SearchParams {
  [key: string]: any;
}

// ============================================================================
// MÉTRICAS Y ESTADÍSTICAS
// ============================================================================

/**
 * Estadísticas del dashboard
 */
export interface DashboardStatsResponse {
  totalAffiliates: number;
  activeAffiliates: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  pendingPayments: number;
  overduePayments: number;
  pendingInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

/**
 * Métricas de rendimiento
 */
export interface PerformanceMetricsResponse {
  avgResponseTime: number;
  uptime: number;
  errorRate: number;
  activeUsers: number;
}

// ============================================================================
// HELPERS DE TRANSFORMACIÓN
// ============================================================================

/**
 * Convierte respuesta de backend (snake_case) a frontend (camelCase)
 * Usa esto si tu backend retorna snake_case
 */
export type BackendToFrontend<T> = {
  [K in keyof T as K extends string
    ? CamelCase<K>
    : K]: T[K] extends object
    ? BackendToFrontend<T[K]>
    : T[K];
};

/**
 * Helper type para convertir snake_case a camelCase
 */
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>;

// ============================================================================
// EXPORTACIONES
// ============================================================================

export type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
  ValidationError,
};

/**
 * Uso:
 * 
 * // En un store:
 * import { get, post } from '@/utils/api';
 * import type { 
 *   ApiResponse, 
 *   AppointmentResponse, 
 *   CreateAppointmentRequest 
 * } from '@/store/apiTypes';
 * 
 * // Hacer petición con tipos:
 * const appointments = await get<ApiResponse<AppointmentResponse[]>>('/appointments');
 * 
 * const newAppointment = await post<ApiResponse<AppointmentResponse>>(
 *   '/appointments',
 *   createData as CreateAppointmentRequest
 * );
 */
