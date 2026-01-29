/**
 * Type definitions for Miraflores Plus State Management
 * Shared types across all stores
 */

// User Roles
export type UserRole = 'recepcion' | 'doctor' | 'finanzas' | 'junta' | 'affiliate' | 'superadmin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  hospital?: 'Hospital Miraflores Roosevelt' | 'Hospital Miraflores Zona 10';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
  // Plan de afiliación (solo para rol affiliate) - Solo existe el plan "Para Todos"
  planName?: 'Para Todos';
  numberOfDependents?: number; // 0-6 dependientes permitidos
  isActive?: boolean; // Estado de la membresía (activo/inactivo según pagos)
  membershipExpiryDate?: Date; // Fecha de vencimiento de la membresía
  // Honorarios médicos personalizados (solo para rol doctor)
  medicalFees?: {
    videollamada: number;  // Honorario por videoconsulta en Quetzales
    presencial: number;    // Honorario por consulta presencial en Quetzales
  };
  // Información adicional del médico
  specialty?: string;      // Especialidad médica
  licenseNumber?: string;  // Número de colegiado
}

// Appointments
export interface Appointment {
  id: string;
  affiliateId: string;
  affiliateName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Consulta General' | 'Especialista' | 'Urgencia' | 'Seguimiento';
  status: 'Programada' | 'Confirmada' | 'En Progreso' | 'Completada' | 'Cancelada' | 'No Asistió' | 'Pendiente Confirmación';
  hospital: 'Hospital Miraflores Roosevelt' | 'Hospital Miraflores Zona 10' | 'Telemedicina - Virtual';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  // Nuevos campos para reglas de negocio
  isVirtual?: boolean;  // true = videollamada, false = presencial
  specialty?: string;   // Especialidad médica (Medicina General, Cardiología, etc.)
  requiresConfirmation?: boolean; // true = necesita confirmación de asesor
}

// Affiliates
export interface Affiliate {
  id: string;
  firstName: string;
  lastName: string;
  dpi: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  address: string;
  city: string;
  department: string;
  planType: 'Básico' | 'Premium' | 'Elite';
  status: 'Activo' | 'Inactivo' | 'Suspendido' | 'Pendiente';
  memberSince: Date;
  dependents?: Dependent[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Dependent {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string;
  gender: 'Masculino' | 'Femenino' | 'Otro';
}

// Payments
export interface Payment {
  id: string;
  affiliateId: string;
  amount: number;
  date: string;
  method: 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'Transferencia' | 'Efectivo';
  status: 'Pagado' | 'Pendiente' | 'Atrasado' | 'Cancelado';
  concept: string;
  reference?: string;
}

// Payment Proofs (Comprobantes de Pago)
export interface PaymentProof {
  id: string;
  affiliateId: string;
  affiliateName: string;
  monthYear: string; // Formato: "Enero 2025"
  amount: number;
  numberOfDependents: number;
  proofImageUrl: string; // URL de la imagen del comprobante
  uploadedAt: Date;
  uploadedBy: string; // ID del usuario que subió (afiliado o recepción)
  uploadedByRole: 'affiliate' | 'recepcion';
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
  validatedBy?: string; // ID del usuario de recepción que validó
  validatedAt?: Date;
  rejectionReason?: string;
  notes?: string;
}

// Invoices
export interface Invoice {
  id: string;
  supplier: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Pagada';
  category: string;
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  notes?: string;
}

// Notifications
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// UI State
export interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

// Analytics
export interface Metric {
  label: string;
  value: number | string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

// System Health
export interface SystemStatus {
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  lastCheck: Date;
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
  }[];
}