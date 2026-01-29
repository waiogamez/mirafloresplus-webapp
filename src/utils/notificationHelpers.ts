import { useNotificationStore } from '../store/useNotificationStore';
import { toast } from 'sonner@2.0.3';

/**
 * Tipos de notificaciones del sistema
 */
export type SystemNotificationType = 
  | 'appointment_started'
  | 'appointment_completed'
  | 'videocall_started'
  | 'videocall_ended'
  | 'presencial_started'
  | 'presencial_completed'
  | 'appointment_cancelled';

/**
 * Roles que pueden recibir notificaciones
 */
export type NotificationRole = 
  | 'superadmin'
  | 'recepcion'
  | 'finanzas'
  | 'junta'
  | 'doctor'
  | 'affiliate';

/**
 * Configuración de roles que reciben cada tipo de notificación
 */
const NOTIFICATION_RECIPIENTS: Record<SystemNotificationType, NotificationRole[]> = {
  appointment_started: ['superadmin', 'recepcion'],
  appointment_completed: ['superadmin', 'recepcion', 'finanzas'],
  videocall_started: ['superadmin', 'recepcion'],
  videocall_ended: ['superadmin', 'recepcion', 'finanzas'],
  presencial_started: ['superadmin', 'recepcion'],
  presencial_completed: ['superadmin', 'recepcion', 'finanzas'],
  appointment_cancelled: ['superadmin', 'recepcion', 'finanzas'],
};

/**
 * Plantillas de mensajes de notificación
 */
const NOTIFICATION_TEMPLATES = {
  appointment_started: (data: NotificationData) => ({
    type: 'info' as const,
    title: '🏥 Cita Iniciada',
    message: `Dr. ${data.doctorName} está atendiendo a ${data.patientName}`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Detalles',
  }),
  appointment_completed: (data: NotificationData) => ({
    type: 'success' as const,
    title: '✅ Cita Completada',
    message: `${data.patientName} atendido por Dr. ${data.doctorName} - ${data.type}`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Registro',
  }),
  videocall_started: (data: NotificationData) => ({
    type: 'info' as const,
    title: '🎥 Videollamada en Curso',
    message: `Dr. ${data.doctorName} en videoconsulta con ${data.patientName}`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Detalles',
  }),
  videocall_ended: (data: NotificationData) => ({
    type: 'success' as const,
    title: '🎥 Videollamada Finalizada',
    message: `Videoconsulta completada: ${data.patientName} - Dr. ${data.doctorName} (${data.duration} min)`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Registro',
  }),
  presencial_started: (data: NotificationData) => ({
    type: 'info' as const,
    title: '🏥 Consulta Presencial Iniciada',
    message: `Dr. ${data.doctorName} atendiendo a ${data.patientName} en ${data.branch}`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Detalles',
  }),
  presencial_completed: (data: NotificationData) => ({
    type: 'success' as const,
    title: '✅ Consulta Presencial Completada',
    message: `${data.patientName} atendido en ${data.branch} - Dr. ${data.doctorName} (${data.duration} min)`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Registro',
  }),
  appointment_cancelled: (data: NotificationData) => ({
    type: 'warning' as const,
    title: '⚠️ Cita Cancelada',
    message: `Cita de ${data.patientName} con Dr. ${data.doctorName} cancelada`,
    actionUrl: '/appointments',
    actionLabel: 'Ver Detalles',
  }),
};

/**
 * Datos para generar notificaciones
 */
interface NotificationData {
  doctorName: string;
  patientName: string;
  type?: string;
  duration?: number;
  branch?: string;
  specialty?: string;
  fee?: number;
}

/**
 * Enviar notificación a múltiples roles
 * En producción, esto enviaría notificaciones reales a través de WebSockets/Push
 */
export function sendMultiRoleNotification(
  notificationType: SystemNotificationType,
  data: NotificationData
) {
  const addNotification = useNotificationStore.getState().addNotification;
  const recipients = NOTIFICATION_RECIPIENTS[notificationType];
  const template = NOTIFICATION_TEMPLATES[notificationType];
  
  if (!template) {
    console.error(`No template found for notification type: ${notificationType}`);
    return;
  }
  
  const notification = template(data);
  
  // En producción, aquí se enviaría la notificación a través de WebSockets
  // o un servicio de notificaciones push a cada rol específico
  
  // Por ahora, agregamos la notificación al store local
  // que será visible para todos los usuarios
  addNotification({
    ...notification,
    metadata: {
      recipients,
      notificationType,
      data,
    },
  });
  
  // Log para debugging
  console.log(`📢 Notificación enviada a:`, recipients, notification);
  
  return notification;
}

/**
 * Notificar inicio de cita
 */
export function notifyAppointmentStarted(data: NotificationData) {
  const notif = sendMultiRoleNotification('appointment_started', data);
  
  // Toast local para el doctor
  toast.info(`Cita iniciada con ${data.patientName}`, {
    description: 'Administración y Recepción han sido notificados',
  });
  
  return notif;
}

/**
 * Notificar cita completada
 */
export function notifyAppointmentCompleted(data: NotificationData) {
  const notif = sendMultiRoleNotification('appointment_completed', data);
  
  // Toast local para el doctor
  toast.success(`Cita completada exitosamente`, {
    description: `Honorario registrado: Q${data.fee?.toFixed(2)} - Finanzas notificado`,
  });
  
  return notif;
}

/**
 * Notificar inicio de videollamada
 */
export function notifyVideocallStarted(data: NotificationData) {
  const notif = sendMultiRoleNotification('videocall_started', data);
  
  // Toast local
  toast.info(`Videoconsulta iniciada con ${data.patientName}`, {
    description: 'Administración y Recepción han sido notificados',
  });
  
  return notif;
}

/**
 * Notificar fin de videollamada
 */
export function notifyVideocallEnded(data: NotificationData & { duration: number }) {
  const notif = sendMultiRoleNotification('videocall_ended', data);
  
  // Toast local
  toast.success(`Videoconsulta finalizada`, {
    description: `Duración: ${data.duration} min - Honorario: Q${data.fee?.toFixed(2)}`,
  });
  
  return notif;
}

/**
 * Notificar inicio de consulta presencial
 */
export function notifyPresencialStarted(data: NotificationData & { branch: string }) {
  const notif = sendMultiRoleNotification('presencial_started', data);
  
  // Toast local
  toast.info(`Consulta presencial iniciada`, {
    description: `${data.branch} - Administración notificada`,
  });
  
  return notif;
}

/**
 * Notificar consulta presencial completada
 */
export function notifyPresencialCompleted(data: NotificationData & { branch: string; duration: number }) {
  const notif = sendMultiRoleNotification('presencial_completed', data);
  
  // Toast local
  toast.success(`Consulta completada exitosamente`, {
    description: `Honorario: Q${data.fee?.toFixed(2)} - Finanzas notificado`,
  });
  
  return notif;
}

/**
 * Notificar cita cancelada
 */
export function notifyAppointmentCancelled(data: NotificationData) {
  const notif = sendMultiRoleNotification('appointment_cancelled', data);
  
  // Toast local
  toast.warning('Cita cancelada', {
    description: 'Administración y Recepción han sido notificados',
  });
  
  return notif;
}

/**
 * Formato de duración en horas y minutos
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} h`;
  return `${hours} h ${mins} min`;
}

/**
 * Obtener color por tipo de cita
 */
export function getAppointmentTypeColor(type: string): string {
  return type === 'Videollamada' ? '#2BB9D9' : '#0477BF';
}

/**
 * Obtener icono por tipo de cita
 */
export function getAppointmentTypeIcon(type: string): string {
  return type === 'Videollamada' ? '🎥' : '🏥';
}
