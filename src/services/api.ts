/**
 * API Services para Miraflores Plus
 * Cada servicio se conecta con el backend correspondiente
 */

import apiClient, { ApiResponse, PaginatedResponse } from './httpClient';
import type { User, Affiliate, Appointment, Payment, FELInvoice } from '../store/types';

/**
 * Auth Service
 */
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiClient.post('/auth/login', { email, password });
  },

  logout: async (): Promise<ApiResponse> => {
    return apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post('/auth/refresh');
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    return apiClient.put('/auth/password', { currentPassword, newPassword });
  },
};

/**
 * Affiliates Service
 */
export const affiliatesService = {
  getAll: async (params?: { 
    page?: number; 
    pageSize?: number; 
    status?: string;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Affiliate>>> => {
    return apiClient.get('/affiliates', params);
  },

  getById: async (id: string): Promise<ApiResponse<Affiliate>> => {
    return apiClient.get(`/affiliates/${id}`);
  },

  create: async (data: Partial<Affiliate>): Promise<ApiResponse<Affiliate>> => {
    return apiClient.post('/affiliates', data);
  },

  update: async (id: string, data: Partial<Affiliate>): Promise<ApiResponse<Affiliate>> => {
    return apiClient.put(`/affiliates/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/affiliates/${id}`);
  },

  addDependent: async (affiliateId: string, dependentData: any): Promise<ApiResponse> => {
    return apiClient.post(`/affiliates/${affiliateId}/dependents`, dependentData);
  },

  uploadDocument: async (affiliateId: string, file: File, documentType: string): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return apiClient.upload(`/affiliates/${affiliateId}/documents`, formData);
  },
};

/**
 * Appointments Service
 */
export const appointmentsService = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    doctorId?: string;
    patientId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResponse<Appointment>>> => {
    return apiClient.get('/appointments', params);
  },

  getById: async (id: string): Promise<ApiResponse<Appointment>> => {
    return apiClient.get(`/appointments/${id}`);
  },

  getToday: async (): Promise<ApiResponse<Appointment[]>> => {
    return apiClient.get('/appointments/today');
  },

  create: async (data: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    return apiClient.post('/appointments', data);
  },

  update: async (id: string, data: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
    return apiClient.put(`/appointments/${id}`, data);
  },

  cancel: async (id: string, reason?: string): Promise<ApiResponse> => {
    return apiClient.post(`/appointments/${id}/cancel`, { reason });
  },

  confirm: async (id: string): Promise<ApiResponse> => {
    return apiClient.post(`/appointments/${id}/confirm`);
  },

  checkIn: async (id: string): Promise<ApiResponse> => {
    return apiClient.post(`/appointments/${id}/check-in`);
  },

  complete: async (id: string, notes?: string): Promise<ApiResponse> => {
    return apiClient.post(`/appointments/${id}/complete`, { notes });
  },
};

/**
 * Payments Service
 */
export const paymentsService = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    affiliateId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
    return apiClient.get('/payments', params);
  },

  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    return apiClient.get(`/payments/${id}`);
  },

  create: async (data: {
    affiliateId: string;
    amount: number;
    method: string;
    description?: string;
  }): Promise<ApiResponse<Payment>> => {
    return apiClient.post('/payments', data);
  },

  processPayment: async (paymentId: string, paymentData: any): Promise<ApiResponse> => {
    return apiClient.post(`/payments/${paymentId}/process`, paymentData);
  },

  getPending: async (affiliateId?: string): Promise<ApiResponse<Payment[]>> => {
    return apiClient.get('/payments/pending', affiliateId ? { affiliateId } : undefined);
  },

  getOverdue: async (): Promise<ApiResponse<Payment[]>> => {
    return apiClient.get('/payments/overdue');
  },
};

/**
 * FEL Invoice Service (SAT Guatemala)
 */
export const felService = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResponse<FELInvoice>>> => {
    return apiClient.get('/fel/invoices', params);
  },

  getById: async (id: string): Promise<ApiResponse<FELInvoice>> => {
    return apiClient.get(`/fel/invoices/${id}`);
  },

  create: async (data: {
    affiliateId: string;
    items: Array<{ description: string; quantity: number; unitPrice: number }>;
    total: number;
  }): Promise<ApiResponse<FELInvoice>> => {
    return apiClient.post('/fel/invoices', data);
  },

  certify: async (invoiceId: string): Promise<ApiResponse<{ uuid: string; certificationDate: string }>> => {
    return apiClient.post(`/fel/invoices/${invoiceId}/certify`);
  },

  cancel: async (invoiceId: string, reason: string): Promise<ApiResponse> => {
    return apiClient.post(`/fel/invoices/${invoiceId}/cancel`, { reason });
  },

  downloadPDF: async (invoiceId: string): Promise<Blob> => {
    const response = await fetch(`${apiClient['baseURL']}/fel/invoices/${invoiceId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });
    return response.blob();
  },

  downloadXML: async (invoiceId: string): Promise<Blob> => {
    const response = await fetch(`${apiClient['baseURL']}/fel/invoices/${invoiceId}/xml`, {
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });
    return response.blob();
  },
};

/**
 * Reports Service
 */
export const reportsService = {
  getFinancial: async (startDate: string, endDate: string): Promise<ApiResponse> => {
    return apiClient.get('/reports/financial', { startDate, endDate });
  },

  getAffiliates: async (): Promise<ApiResponse> => {
    return apiClient.get('/reports/affiliates');
  },

  getAppointments: async (startDate: string, endDate: string): Promise<ApiResponse> => {
    return apiClient.get('/reports/appointments', { startDate, endDate });
  },

  getExecutive: async (): Promise<ApiResponse> => {
    return apiClient.get('/reports/executive');
  },

  generateCustom: async (reportType: string, params: any): Promise<ApiResponse> => {
    return apiClient.post('/reports/custom', { reportType, ...params });
  },

  exportToPDF: async (reportId: string): Promise<Blob> => {
    const response = await fetch(`${apiClient['baseURL']}/reports/${reportId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });
    return response.blob();
  },

  exportToExcel: async (reportId: string): Promise<Blob> => {
    const response = await fetch(`${apiClient['baseURL']}/reports/${reportId}/excel`, {
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });
    return response.blob();
  },
};

/**
 * Videocall Service (Zoom)
 */
export const videocallService = {
  createMeeting: async (data: {
    topic: string;
    startTime: string;
    duration: number;
    attendees: string[];
  }): Promise<ApiResponse<{ meetingId: string; joinUrl: string; password: string }>> => {
    return apiClient.post('/videocalls/create', data);
  },

  getMeeting: async (meetingId: string): Promise<ApiResponse> => {
    return apiClient.get(`/videocalls/${meetingId}`);
  },

  endMeeting: async (meetingId: string): Promise<ApiResponse> => {
    return apiClient.post(`/videocalls/${meetingId}/end`);
  },
};

/**
 * Notifications Service
 */
export const notificationsService = {
  getAll: async (): Promise<ApiResponse> => {
    return apiClient.get('/notifications');
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse> => {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<ApiResponse> => {
    return apiClient.put('/notifications/read-all');
  },

  sendEmail: async (to: string, subject: string, body: string): Promise<ApiResponse> => {
    return apiClient.post('/notifications/email', { to, subject, body });
  },

  sendSMS: async (to: string, message: string): Promise<ApiResponse> => {
    return apiClient.post('/notifications/sms', { to, message });
  },
};

/**
 * Admin Service
 */
export const adminService = {
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiClient.get('/admin/users');
  },

  createUser: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.post('/admin/users', data);
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put(`/admin/users/${userId}`, data);
  },

  deleteUser: async (userId: string): Promise<ApiResponse> => {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  updatePermissions: async (userId: string, permissions: string[]): Promise<ApiResponse> => {
    return apiClient.put(`/admin/users/${userId}/permissions`, { permissions });
  },

  getSystemHealth: async (): Promise<ApiResponse> => {
    return apiClient.get('/admin/health');
  },

  getAuditLogs: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> => {
    return apiClient.get('/admin/audit-logs', params);
  },
};

// Export all services
export default {
  auth: authService,
  affiliates: affiliatesService,
  appointments: appointmentsService,
  payments: paymentsService,
  fel: felService,
  reports: reportsService,
  videocalls: videocallService,
  notifications: notificationsService,
  admin: adminService,
};
