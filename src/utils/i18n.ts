/**
 * Internationalization (i18n) - Miraflores Plus
 * Sistema de internacionalización para multi-idioma
 */

import { logger } from './logger';
import { trackEvent } from './analytics';

// Idiomas soportados
export type SupportedLocale = 'es' | 'en';

// Traducciones
const translations: Record<SupportedLocale, Record<string, string>> = {
  es: {
    // General
    'app.name': 'Miraflores Plus',
    'app.tagline': '¡Tu salud, a un clic de distancia!',
    'app.loading': 'Cargando...',
    'app.error': 'Error',
    'app.success': 'Éxito',
    
    // Navegación
    'nav.dashboard': 'Tablero',
    'nav.appointments': 'Citas',
    'nav.affiliates': 'Afiliados',
    'nav.patients': 'Pacientes',
    'nav.payments': 'Pagos',
    'nav.billing': 'Facturación',
    'nav.reports': 'Reportes',
    'nav.settings': 'Configuración',
    'nav.admin': 'Administración',
    'nav.security': 'Seguridad',
    'nav.help': 'Ayuda',
    'nav.logout': 'Cerrar Sesión',
    
    // Acciones
    'action.save': 'Guardar',
    'action.cancel': 'Cancelar',
    'action.delete': 'Eliminar',
    'action.edit': 'Editar',
    'action.add': 'Agregar',
    'action.search': 'Buscar',
    'action.filter': 'Filtrar',
    'action.export': 'Exportar',
    'action.print': 'Imprimir',
    'action.refresh': 'Refrescar',
    'action.close': 'Cerrar',
    'action.back': 'Volver',
    'action.next': 'Siguiente',
    'action.previous': 'Anterior',
    'action.submit': 'Enviar',
    'action.reset': 'Restablecer',
    
    // Formularios
    'form.required': 'Campo requerido',
    'form.invalid': 'Formato inválido',
    'form.email.invalid': 'Email inválido',
    'form.phone.invalid': 'Teléfono inválido',
    'form.date.invalid': 'Fecha inválida',
    'form.dpi.invalid': 'DPI inválido (13 dígitos)',
    
    // Citas
    'appointments.title': 'Citas Médicas',
    'appointments.new': 'Nueva Cita',
    'appointments.date': 'Fecha',
    'appointments.time': 'Hora',
    'appointments.doctor': 'Doctor',
    'appointments.patient': 'Paciente',
    'appointments.reason': 'Motivo',
    'appointments.status': 'Estado',
    'appointments.cancel': 'Cancelar Cita',
    'appointments.reschedule': 'Reprogramar',
    
    // Afiliados
    'affiliates.title': 'Gestión de Afiliados',
    'affiliates.new': 'Nuevo Afiliado',
    'affiliates.name': 'Nombre',
    'affiliates.dpi': 'DPI',
    'affiliates.email': 'Correo Electrónico',
    'affiliates.phone': 'Teléfono',
    'affiliates.address': 'Dirección',
    'affiliates.status': 'Estado',
    
    // Pagos
    'payments.title': 'Pagos',
    'payments.amount': 'Monto',
    'payments.method': 'Método de Pago',
    'payments.date': 'Fecha de Pago',
    'payments.status': 'Estado',
    'payments.receipt': 'Recibo',
    
    // Estados
    'status.pending': 'Pendiente',
    'status.approved': 'Aprobado',
    'status.rejected': 'Rechazado',
    'status.active': 'Activo',
    'status.inactive': 'Inactivo',
    'status.completed': 'Completado',
    'status.cancelled': 'Cancelado',
    
    // Mensajes
    'message.save.success': 'Guardado exitosamente',
    'message.save.error': 'Error al guardar',
    'message.delete.success': 'Eliminado exitosamente',
    'message.delete.error': 'Error al eliminar',
    'message.delete.confirm': '¿Está seguro de eliminar?',
    
    // Fechas
    'date.today': 'Hoy',
    'date.yesterday': 'Ayer',
    'date.tomorrow': 'Mañana',
    'date.week': 'Semana',
    'date.month': 'Mes',
    'date.year': 'Año',
    
    // Días de la semana
    'day.monday': 'Lunes',
    'day.tuesday': 'Martes',
    'day.wednesday': 'Miércoles',
    'day.thursday': 'Jueves',
    'day.friday': 'Viernes',
    'day.saturday': 'Sábado',
    'day.sunday': 'Domingo',
    
    // Meses
    'month.january': 'Enero',
    'month.february': 'Febrero',
    'month.march': 'Marzo',
    'month.april': 'Abril',
    'month.may': 'Mayo',
    'month.june': 'Junio',
    'month.july': 'Julio',
    'month.august': 'Agosto',
    'month.september': 'Septiembre',
    'month.october': 'Octubre',
    'month.november': 'Noviembre',
    'month.december': 'Diciembre',
  },
  en: {
    // General
    'app.name': 'Miraflores Plus',
    'app.tagline': 'Your health, just a click away!',
    'app.loading': 'Loading...',
    'app.error': 'Error',
    'app.success': 'Success',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.appointments': 'Appointments',
    'nav.affiliates': 'Members',
    'nav.patients': 'Patients',
    'nav.payments': 'Payments',
    'nav.billing': 'Billing',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.admin': 'Administration',
    'nav.security': 'Security',
    'nav.help': 'Help',
    'nav.logout': 'Logout',
    
    // Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.add': 'Add',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.export': 'Export',
    'action.print': 'Print',
    'action.refresh': 'Refresh',
    'action.close': 'Close',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.submit': 'Submit',
    'action.reset': 'Reset',
    
    // Forms
    'form.required': 'Required field',
    'form.invalid': 'Invalid format',
    'form.email.invalid': 'Invalid email',
    'form.phone.invalid': 'Invalid phone',
    'form.date.invalid': 'Invalid date',
    'form.dpi.invalid': 'Invalid ID (13 digits)',
    
    // Appointments
    'appointments.title': 'Medical Appointments',
    'appointments.new': 'New Appointment',
    'appointments.date': 'Date',
    'appointments.time': 'Time',
    'appointments.doctor': 'Doctor',
    'appointments.patient': 'Patient',
    'appointments.reason': 'Reason',
    'appointments.status': 'Status',
    'appointments.cancel': 'Cancel Appointment',
    'appointments.reschedule': 'Reschedule',
    
    // Affiliates
    'affiliates.title': 'Members Management',
    'affiliates.new': 'New Member',
    'affiliates.name': 'Name',
    'affiliates.dpi': 'ID',
    'affiliates.email': 'Email',
    'affiliates.phone': 'Phone',
    'affiliates.address': 'Address',
    'affiliates.status': 'Status',
    
    // Payments
    'payments.title': 'Payments',
    'payments.amount': 'Amount',
    'payments.method': 'Payment Method',
    'payments.date': 'Payment Date',
    'payments.status': 'Status',
    'payments.receipt': 'Receipt',
    
    // Status
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    
    // Messages
    'message.save.success': 'Saved successfully',
    'message.save.error': 'Error saving',
    'message.delete.success': 'Deleted successfully',
    'message.delete.error': 'Error deleting',
    'message.delete.confirm': 'Are you sure you want to delete?',
    
    // Dates
    'date.today': 'Today',
    'date.yesterday': 'Yesterday',
    'date.tomorrow': 'Tomorrow',
    'date.week': 'Week',
    'date.month': 'Month',
    'date.year': 'Year',
    
    // Days of week
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
    'day.thursday': 'Thursday',
    'day.friday': 'Friday',
    'day.saturday': 'Saturday',
    'day.sunday': 'Sunday',
    
    // Months
    'month.january': 'January',
    'month.february': 'February',
    'month.march': 'March',
    'month.april': 'April',
    'month.may': 'May',
    'month.june': 'June',
    'month.july': 'July',
    'month.august': 'August',
    'month.september': 'September',
    'month.october': 'October',
    'month.november': 'November',
    'month.december': 'December',
  },
};

// Manager de i18n
class I18nManager {
  private currentLocale: SupportedLocale = 'es';
  private listeners: ((locale: SupportedLocale) => void)[] = [];

  constructor() {
    // Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0];
    const storedLang = localStorage.getItem('locale') as SupportedLocale;
    
    this.currentLocale = storedLang || (browserLang === 'en' ? 'en' : 'es');
    
    logger.info('i18n', 'Initialized', { locale: this.currentLocale });
  }

  // Obtener idioma actual
  getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  // Cambiar idioma
  setLocale(locale: SupportedLocale): void {
    if (locale !== this.currentLocale) {
      this.currentLocale = locale;
      localStorage.setItem('locale', locale);
      
      logger.info('i18n', 'Locale changed', { locale });
      trackEvent('locale_changed', { locale });
      
      // Notificar a listeners
      this.listeners.forEach(listener => listener(locale));
    }
  }

  // Traducir key
  t(key: string, params?: Record<string, string | number>): string {
    let translation = translations[this.currentLocale][key];
    
    if (!translation) {
      logger.warn('i18n', 'Missing translation', { key, locale: this.currentLocale });
      translation = key;
    }

    // Reemplazar parámetros
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value));
      });
    }

    return translation;
  }

  // Suscribirse a cambios
  subscribe(listener: (locale: SupportedLocale) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Formatear fecha según locale
  formatDate(date: Date, format: 'short' | 'long' | 'full' = 'short'): string {
    const options: Intl.DateTimeFormatOptions = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    }[format];

    return new Intl.DateTimeFormat(this.getFullLocale(), options).format(date);
  }

  // Formatear número según locale
  formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.getFullLocale(), options).format(num);
  }

  // Formatear moneda
  formatCurrency(amount: number, currency: string = 'GTQ'): string {
    return new Intl.NumberFormat(this.getFullLocale(), {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Obtener locale completo (es-GT, en-US)
  private getFullLocale(): string {
    return this.currentLocale === 'es' ? 'es-GT' : 'en-US';
  }

  // Pluralización simple
  plural(count: number, singular: string, plural: string): string {
    return count === 1 ? singular : plural;
  }
}

// Exportar instancia singleton
export const i18n = new I18nManager();

// Hook para React
import { useState, useEffect } from 'react';

export function useTranslation() {
  const [locale, setLocale] = useState(i18n.getLocale());

  useEffect(() => {
    const unsubscribe = i18n.subscribe(setLocale);
    return unsubscribe;
  }, []);

  return {
    t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
    locale,
    setLocale: (newLocale: SupportedLocale) => i18n.setLocale(newLocale),
    formatDate: (date: Date, format?: 'short' | 'long' | 'full') => i18n.formatDate(date, format),
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => i18n.formatNumber(num, options),
    formatCurrency: (amount: number, currency?: string) => i18n.formatCurrency(amount, currency),
  };
}

// Helper para formatear fecha relativa
export function formatRelativeTime(date: Date, locale: SupportedLocale = 'es'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (locale === 'es') {
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return i18n.formatDate(date, 'short');
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return i18n.formatDate(date, 'short');
  }
}
