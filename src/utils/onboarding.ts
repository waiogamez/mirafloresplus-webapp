/**
 * Onboarding Utilities - Miraflores Plus
 * 
 * Sistema para gestionar el estado de onboarding del usuario
 */

import { secureStorage } from './secureStorage';
import { logger } from './logger';

const ONBOARDING_KEY = 'miraflores_onboarding_state';
const HELP_SHOWN_KEY = 'miraflores_help_shown';

export interface OnboardingState {
  tourCompleted: boolean;
  tourCompletedAt?: string;
  tourSkipped: boolean;
  helpArticlesViewed: string[];
  tooltipsShown: string[];
  userRole?: string;
  firstVisit: boolean;
  lastVisit?: string;
}

/**
 * Onboarding Manager
 */
class OnboardingManager {
  private state: OnboardingState;

  constructor() {
    this.state = this.loadState();
  }

  /**
   * Cargar estado desde storage
   */
  private loadState(): OnboardingState {
    try {
      const saved = secureStorage.getItem(ONBOARDING_KEY);
      if (saved) {
        return {
          ...this.getDefaultState(),
          ...saved,
        };
      }
    } catch (error) {
      logger.warn('Error loading onboarding state:', error);
    }
    return this.getDefaultState();
  }

  /**
   * Estado por defecto
   */
  private getDefaultState(): OnboardingState {
    return {
      tourCompleted: false,
      tourSkipped: false,
      helpArticlesViewed: [],
      tooltipsShown: [],
      firstVisit: true,
    };
  }

  /**
   * Guardar estado
   */
  private saveState() {
    try {
      secureStorage.setItem(ONBOARDING_KEY, this.state);
      logger.info('Onboarding state saved');
    } catch (error) {
      logger.error('Error saving onboarding state:', error);
    }
  }

  /**
   * Verificar si debe mostrar el tour
   */
  shouldShowTour(userRole?: string): boolean {
    // Si ya completó o saltó el tour
    if (this.state.tourCompleted || this.state.tourSkipped) {
      return false;
    }

    // Si cambió de rol, mostrar tour específico del rol
    if (userRole && this.state.userRole && this.state.userRole !== userRole) {
      logger.info('Role changed, showing new tour:', { from: this.state.userRole, to: userRole });
      return true;
    }

    // Si es primera visita
    if (this.state.firstVisit) {
      return true;
    }

    return false;
  }

  /**
   * Marcar tour como completado
   */
  completeTour(userRole?: string) {
    this.state.tourCompleted = true;
    this.state.tourCompletedAt = new Date().toISOString();
    this.state.firstVisit = false;
    this.state.userRole = userRole;
    this.saveState();
    
    logger.info('Tour completed', { role: userRole });
  }

  /**
   * Marcar tour como saltado
   */
  skipTour() {
    this.state.tourSkipped = true;
    this.state.firstVisit = false;
    this.saveState();
    
    logger.info('Tour skipped');
  }

  /**
   * Resetear tour (para volver a mostrarlo)
   */
  resetTour() {
    this.state.tourCompleted = false;
    this.state.tourSkipped = false;
    this.state.tourCompletedAt = undefined;
    this.saveState();
    
    logger.info('Tour reset');
  }

  /**
   * Marcar artículo de ayuda como visto
   */
  markHelpArticleViewed(articleId: string) {
    if (!this.state.helpArticlesViewed.includes(articleId)) {
      this.state.helpArticlesViewed.push(articleId);
      this.saveState();
      
      logger.info('Help article viewed:', articleId);
    }
  }

  /**
   * Verificar si un artículo fue visto
   */
  hasViewedHelpArticle(articleId: string): boolean {
    return this.state.helpArticlesViewed.includes(articleId);
  }

  /**
   * Marcar tooltip como mostrado
   */
  markTooltipShown(tooltipId: string) {
    if (!this.state.tooltipsShown.includes(tooltipId)) {
      this.state.tooltipsShown.push(tooltipId);
      this.saveState();
    }
  }

  /**
   * Verificar si debe mostrar un tooltip
   */
  shouldShowTooltip(tooltipId: string, maxShows: number = 3): boolean {
    const count = this.state.tooltipsShown.filter(id => id === tooltipId).length;
    return count < maxShows;
  }

  /**
   * Actualizar última visita
   */
  updateLastVisit() {
    this.state.lastVisit = new Date().toISOString();
    this.state.firstVisit = false;
    this.saveState();
  }

  /**
   * Obtener estadísticas de onboarding
   */
  getStats() {
    return {
      tourCompleted: this.state.tourCompleted,
      tourCompletedAt: this.state.tourCompletedAt,
      helpArticlesViewed: this.state.helpArticlesViewed.length,
      tooltipsShown: this.state.tooltipsShown.length,
      firstVisit: this.state.firstVisit,
      lastVisit: this.state.lastVisit,
      userRole: this.state.userRole,
    };
  }

  /**
   * Limpiar todo el estado de onboarding
   */
  clear() {
    this.state = this.getDefaultState();
    this.saveState();
    logger.info('Onboarding state cleared');
  }
}

// Export singleton
export const onboardingManager = new OnboardingManager();

/**
 * Hook para React
 */
export function useOnboarding(userRole?: string) {
  const shouldShowTour = onboardingManager.shouldShowTour(userRole);
  
  return {
    shouldShowTour,
    completeTour: () => onboardingManager.completeTour(userRole),
    skipTour: () => onboardingManager.skipTour(),
    resetTour: () => onboardingManager.resetTour(),
    markHelpArticleViewed: (id: string) => onboardingManager.markHelpArticleViewed(id),
    hasViewedHelpArticle: (id: string) => onboardingManager.hasViewedHelpArticle(id),
    markTooltipShown: (id: string) => onboardingManager.markTooltipShown(id),
    shouldShowTooltip: (id: string, max?: number) => onboardingManager.shouldShowTooltip(id, max),
    getStats: () => onboardingManager.getStats(),
  };
}

/**
 * Tours por rol
 */
export const ROLE_TOURS = {
  recepcion: [
    {
      target: '[data-tour="sidebar-appointments"]',
      title: '📅 Gestión de Citas',
      content: 'Aquí puedes ver, crear y administrar todas las citas médicas.',
    },
    {
      target: '[data-tour="sidebar-affiliates"]',
      title: '👥 Afiliados',
      content: 'Gestiona los afiliados y sus dependientes desde esta sección.',
    },
    {
      target: '[data-tour="new-appointment"]',
      title: '➕ Nueva Cita',
      content: 'Haz clic aquí para agendar una nueva cita rápidamente.',
    },
    {
      target: '[data-tour="search"]',
      title: '🔍 Búsqueda Global',
      content: 'Busca pacientes, citas o afiliados usando Ctrl+K o haciendo clic aquí.',
    },
  ],
  
  doctor: [
    {
      target: '[data-tour="sidebar-appointments"]',
      title: '📅 Mis Citas',
      content: 'Aquí verás todas las citas asignadas a ti.',
    },
    {
      target: '[data-tour="sidebar-patients"]',
      title: '🏥 Pacientes',
      content: 'Accede al historial médico de tus pacientes.',
    },
    {
      target: '[data-tour="video-call"]',
      title: '📹 Videollamadas',
      content: 'Realiza consultas médicas virtuales con tus pacientes.',
    },
  ],
  
  'junta-directiva': [
    {
      target: '[data-tour="sidebar-board"]',
      title: '📊 Dashboard Junta Directiva',
      content: 'Visualiza métricas estratégicas y KPIs del hospital.',
    },
    {
      target: '[data-tour="sidebar-analytics"]',
      title: '📈 Analytics',
      content: 'Análisis profundo de datos y reportes ejecutivos.',
    },
    {
      target: '[data-tour="sidebar-accounts"]',
      title: '💰 Cuentas por Pagar',
      content: 'Aprueba y revisa las cuentas por pagar del hospital.',
    },
  ],
  
  afiliado: [
    {
      target: '[data-tour="sidebar-appointments"]',
      title: '📅 Mis Citas',
      content: 'Aquí puedes ver tus citas programadas y agendar nuevas.',
    },
    {
      target: '[data-tour="sidebar-dependents"]',
      title: '👨‍👩‍👧‍👦 Dependientes',
      content: 'Gestiona las citas de tus familiares dependientes.',
    },
    {
      target: '[data-tour="sidebar-billing"]',
      title: '💳 Facturación',
      content: 'Consulta tus facturas y pagos.',
    },
  ],
  
  'super-admin': [
    {
      target: '[data-tour="sidebar-admin"]',
      title: '⚙️ Administración',
      content: 'Control total del sistema: usuarios, permisos y configuraciones.',
    },
    {
      target: '[data-tour="sidebar-catalog"]',
      title: '📋 Catálogos',
      content: 'Administra especialidades médicas, doctores y servicios.',
    },
    {
      target: '[data-tour="sidebar-security"]',
      title: '🔐 Seguridad',
      content: 'Monitorea la seguridad del sistema y gestiona protecciones.',
    },
  ],
  
  finanzas: [
    {
      target: '[data-tour="sidebar-billing"]',
      title: '💳 Facturación',
      content: 'Gestiona todas las facturas y pagos del sistema.',
    },
    {
      target: '[data-tour="sidebar-accounts"]',
      title: '💰 Cuentas por Pagar',
      content: 'Aprueba y procesa las cuentas por pagar del hospital.',
    },
    {
      target: '[data-tour="sidebar-reports"]',
      title: '📊 Reportes Financieros',
      content: 'Genera reportes financieros y análisis de ingresos.',
    },
  ],
};

/**
 * Artículos de ayuda por categoría
 */
export const HELP_ARTICLES = [
  // Citas
  {
    id: 'appointments-create',
    category: 'Citas',
    title: '¿Cómo agendar una nueva cita?',
    content: 'Para agendar una cita: 1) Haz clic en "Nueva Cita" en el sidebar o presiona Alt+N. 2) Selecciona el paciente. 3) Elige la especialidad y doctor. 4) Selecciona fecha y hora disponibles. 5) Agrega notas si es necesario. 6) Confirma la cita.',
    tags: ['citas', 'agendar', 'nueva'],
  },
  {
    id: 'appointments-reschedule',
    category: 'Citas',
    title: '¿Cómo reprogramar una cita?',
    content: 'Para reprogramar: 1) Encuentra la cita en el calendario o lista. 2) Haz clic en los tres puntos (...). 3) Selecciona "Reprogramar". 4) Elige la nueva fecha y hora. 5) Confirma el cambio. Se enviará una notificación automática al paciente.',
    tags: ['citas', 'reprogramar', 'cambiar'],
  },
  {
    id: 'appointments-cancel',
    category: 'Citas',
    title: '¿Cómo cancelar una cita?',
    content: 'Para cancelar: 1) Localiza la cita. 2) Haz clic en los tres puntos (...). 3) Selecciona "Cancelar cita". 4) Indica el motivo de cancelación. 5) Confirma. El paciente recibirá una notificación.',
    tags: ['citas', 'cancelar'],
  },
  
  // Afiliados
  {
    id: 'affiliates-create',
    category: 'Afiliados',
    title: '¿Cómo registrar un nuevo afiliado?',
    content: 'Para crear un afiliado: 1) Ve a la sección Afiliados. 2) Haz clic en "Nuevo Afiliado" o presiona Alt+A. 3) Completa el formulario con: Nombre, DPI, Teléfono, Email, Dirección. 4) Sube una foto (opcional). 5) Guarda. El afiliado recibirá un email de bienvenida.',
    tags: ['afiliados', 'nuevo', 'registrar'],
  },
  {
    id: 'dependents-add',
    category: 'Afiliados',
    title: '¿Cómo agregar dependientes a un afiliado?',
    content: 'Para agregar dependientes: 1) Abre el perfil del afiliado. 2) Ve a la pestaña "Dependientes". 3) Haz clic en "Agregar Dependiente". 4) Completa: Nombre, Parentesco, Fecha de Nacimiento, DPI (si aplica). 5) Guarda. Los dependientes pueden usar los mismos beneficios del afiliado.',
    tags: ['dependientes', 'familiar', 'agregar'],
  },
  
  // Pagos
  {
    id: 'payments-process',
    category: 'Pagos',
    title: '¿Cómo procesar un pago?',
    content: 'Para procesar un pago: 1) Ve a la sección Facturación. 2) Selecciona la factura pendiente. 3) Haz clic en "Registrar Pago". 4) Ingresa el monto en Quetzales (Q). 5) Selecciona método de pago (Efectivo, Tarjeta, Transferencia). 6) Agrega número de referencia si aplica. 7) Confirma. Se genera un recibo automáticamente.',
    tags: ['pagos', 'factura', 'cobrar'],
  },
  {
    id: 'accounts-payable-approve',
    category: 'Finanzas',
    title: '¿Cómo aprobar cuentas por pagar?',
    content: 'Para aprobar: 1) Ve a "Cuentas por Pagar". 2) Revisa las facturas pendientes de aprobación. 3) Verifica: Proveedor, Monto, Fecha de Vencimiento, Documentos adjuntos. 4) Haz clic en "Aprobar" o "Rechazar". 5) Agrega comentarios si es necesario. Solo usuarios con rol Finanzas o Junta Directiva pueden aprobar.',
    tags: ['finanzas', 'aprobar', 'cuentas'],
  },
  
  // Sistema
  {
    id: 'shortcuts-keyboard',
    category: 'Sistema',
    title: 'Atajos de teclado disponibles',
    content: 'Atajos principales: Ctrl+K (Búsqueda), Ctrl+B (Toggle sidebar), Alt+N (Nueva cita), Alt+A (Nuevo afiliado), Esc (Cerrar modales), ? (Mostrar todos los atajos). Usa estos atajos para trabajar más rápido.',
    tags: ['atajos', 'teclado', 'shortcuts'],
  },
  {
    id: 'notifications-manage',
    category: 'Sistema',
    title: '¿Cómo funcionan las notificaciones?',
    content: 'Las notificaciones te alertan de: Nuevas citas, Cambios en citas, Aprobaciones pendientes, Pagos recibidos. Haz clic en el ícono de campana 🔔 para ver todas. Las notificaciones no leídas aparecen con un punto rojo. Puedes marcar como leídas o eliminarlas.',
    tags: ['notificaciones', 'alertas'],
  },
  {
    id: 'profile-update',
    category: 'Sistema',
    title: '¿Cómo actualizar mi perfil?',
    content: 'Para actualizar tu perfil: 1) Haz clic en tu foto de perfil (esquina superior derecha). 2) Selecciona "Mi Perfil". 3) Edita: Foto, Nombre, Email, Teléfono, Contraseña. 4) Guarda los cambios. La foto de perfil se actualiza instantáneamente en todo el sistema.',
    tags: ['perfil', 'configuración'],
  },
  
  // Videollamadas (Doctor)
  {
    id: 'video-call-start',
    category: 'Videollamadas',
    title: '¿Cómo iniciar una videollamada con un paciente?',
    content: 'Para iniciar videollamada: 1) Ve a "Mis Citas". 2) Encuentra la cita programada. 3) Haz clic en "Iniciar Videollamada" 📹. 4) Permite acceso a cámara y micrófono. 5) Espera a que el paciente se una. Durante la llamada puedes: Compartir pantalla, Tomar notas, Prescribir medicamentos.',
    tags: ['videollamada', 'consulta', 'virtual'],
  },
  
  // Reportes (Admin/Junta)
  {
    id: 'reports-generate',
    category: 'Reportes',
    title: '¿Cómo generar reportes?',
    content: 'Para generar reportes: 1) Ve a la sección Reportes. 2) Selecciona el tipo de reporte (Citas, Ingresos, Pacientes, Doctores). 3) Define el rango de fechas. 4) Aplica filtros adicionales (especialidad, sede, doctor). 5) Haz clic en "Generar Reporte". 6) Exporta en PDF o Excel.',
    tags: ['reportes', 'exportar', 'datos'],
  },
  
  // Seguridad
  {
    id: 'security-overview',
    category: 'Seguridad',
    title: 'Características de seguridad del sistema',
    content: 'El sistema incluye: Encriptación de datos sensibles, Protección contra XSS y ataques, Rate limiting para prevenir abuso, Content Security Policy, Protección de código fuente. Los datos se almacenan de forma segura y las sesiones expiran automáticamente. Nunca compartas tu contraseña.',
    tags: ['seguridad', 'protección'],
  },
];

/**
 * Obtener tour según rol
 */
export function getTourForRole(role: string) {
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '-');
  return ROLE_TOURS[normalizedRole as keyof typeof ROLE_TOURS] || ROLE_TOURS.afiliado;
}

/**
 * Buscar artículos de ayuda
 */
export function searchHelpArticles(query: string) {
  if (!query.trim()) return HELP_ARTICLES;
  
  const q = query.toLowerCase();
  return HELP_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(q) ||
    article.content.toLowerCase().includes(q) ||
    article.tags.some(tag => tag.includes(q)) ||
    article.category.toLowerCase().includes(q)
  );
}

/**
 * Obtener artículos por categoría
 */
export function getArticlesByCategory(category: string) {
  return HELP_ARTICLES.filter(article => article.category === category);
}

/**
 * Obtener categorías únicas
 */
export function getCategories() {
  return [...new Set(HELP_ARTICLES.map(article => article.category))];
}
