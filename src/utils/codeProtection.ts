/**
 * Code Protection - Miraflores Plus
 * 
 * Protección contra copia de código, inspección y sabotaje
 * ⚠️ ADVERTENCIA: Estas técnicas reducen usabilidad. Usar solo en producción.
 */

import { logger } from './logger';
import { isDevelopment } from './env';

/**
 * Configuración de protección
 */
interface ProtectionConfig {
  disableDevTools?: boolean;
  disableRightClick?: boolean;
  disableCopy?: boolean;
  disableViewSource?: boolean;
  detectIframe?: boolean;
  domainLock?: string[];
  obfuscateConsole?: boolean;
  detectDebugger?: boolean;
  watermarkDOM?: boolean;
}

const DEFAULT_CONFIG: ProtectionConfig = {
  disableDevTools: true,
  disableRightClick: true,
  disableCopy: true,
  disableViewSource: true,
  detectIframe: true,
  domainLock: [
    'mirafloresplus.com',
    'www.mirafloresplus.com',
    'localhost',
    '127.0.0.1',
    'figma.site', // Figma preview domains
    'figmaiframepreview.figma.site', // Figma iframe preview
  ],
  obfuscateConsole: true,
  detectDebugger: true,
  watermarkDOM: true,
};

/**
 * Code Protection Manager
 */
class CodeProtection {
  private config: ProtectionConfig;
  private devToolsOpen = false;
  private checkInterval: number | null = null;
  private isProtectionActive = false;

  constructor(config?: ProtectionConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Inicializar todas las protecciones
   */
  initialize() {
    const currentDomain = window.location.hostname;
    
    // NO activar protecciones en desarrollo, localhost, o Figma preview
    if (
      isDevelopment() ||
      currentDomain === 'localhost' ||
      currentDomain === '127.0.0.1' ||
      currentDomain.includes('figma') ||
      currentDomain.includes('localhost')
    ) {
      logger.warn('Protección de código deshabilitada en desarrollo/preview');
      return;
    }

    logger.info('Inicializando protección de código...');

    if (this.config.domainLock) {
      this.checkDomainLock();
    }

    if (this.config.detectIframe) {
      this.detectIframeEmbedding();
    }

    if (this.config.disableDevTools) {
      this.setupDevToolsDetection();
    }

    if (this.config.disableRightClick) {
      this.disableRightClick();
    }

    if (this.config.disableCopy) {
      this.disableCopyPaste();
    }

    if (this.config.disableViewSource) {
      this.disableViewSource();
    }

    if (this.config.obfuscateConsole) {
      this.obfuscateConsole();
    }

    if (this.config.detectDebugger) {
      this.detectDebuggerLoop();
    }

    if (this.config.watermarkDOM) {
      this.addDOMWatermark();
    }

    // Protecciones adicionales
    this.disableScreenshot();
    this.protectSourceCode();
    this.detectAutomation();

    this.isProtectionActive = true;
    logger.info('✅ Protección de código activada');
  }

  /**
   * Domain Lock - Solo funciona en dominios autorizados
   */
  private checkDomainLock() {
    const currentDomain = window.location.hostname;
    
    // Siempre permitir en desarrollo o localhost
    if (isDevelopment() || currentDomain === 'localhost' || currentDomain === '127.0.0.1' || currentDomain.includes('figma')) {
      logger.info('✅ Modo desarrollo o preview - Domain lock deshabilitado');
      return;
    }
    
    const isAllowed = this.config.domainLock?.some((domain) => {
      return currentDomain === domain || currentDomain.endsWith('.' + domain);
    });

    if (!isAllowed && this.config.domainLock?.length) {
      logger.error('❌ Dominio no autorizado:', currentDomain);
      
      // Bloquear toda la aplicación
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #0477BF;
          color: white;
          font-family: system-ui;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1 style="font-size: 48px; margin-bottom: 20px;">🔒</h1>
            <h2>Acceso No Autorizado</h2>
            <p>Esta aplicación solo puede ejecutarse en dominios autorizados.</p>
            <p style="opacity: 0.7; font-size: 14px; margin-top: 20px;">
              Código: DOMAIN_LOCK_${btoa(currentDomain)}
            </p>
          </div>
        </div>
      `;

      // Deshabilitar JavaScript
      throw new Error('DOMAIN_LOCK_VIOLATION');
    }

    logger.info('✅ Dominio autorizado:', currentDomain);
  }

  /**
   * Detectar si la app está en un iframe (scraping)
   */
  private detectIframeEmbedding() {
    // Permitir iframes en Figma preview
    const currentDomain = window.location.hostname;
    if (currentDomain.includes('figma') || currentDomain.includes('preview')) {
      logger.info('Iframe permitido en preview de Figma');
      return;
    }
    
    if (window.self !== window.top) {
      logger.error('❌ Aplicación embebida en iframe detectada');

      // Intentar romper el iframe
      try {
        window.top!.location.href = window.self.location.href;
      } catch (e) {
        // Si no puede, bloquear la app
        document.body.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #dc2626;
            color: white;
            font-family: system-ui;
            text-align: center;
          ">
            <div>
              <h1>⚠️ Embedding No Permitido</h1>
              <p>Esta aplicación no puede ser embebida en otros sitios.</p>
            </div>
          </div>
        `;
      }

      throw new Error('IFRAME_EMBEDDING_DETECTED');
    }
  }

  /**
   * Detectar DevTools abierto
   */
  private setupDevToolsDetection() {
    // Método 1: Diferencia de tamaño de ventana
    const threshold = 160;
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        if (!this.devToolsOpen) {
          this.devToolsOpen = true;
          this.onDevToolsOpen();
        }
      } else {
        this.devToolsOpen = false;
      }
    };

    // Método 2: Console timing
    let element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        this.devToolsOpen = true;
        this.onDevToolsOpen();
        return 'devtools-detector';
      },
    });

    setInterval(() => {
      console.clear();
      console.log(element);
    }, 1000);

    // Check cada 500ms
    this.checkInterval = window.setInterval(checkDevTools, 500);
  }

  /**
   * Acción cuando se detectan DevTools
   */
  private onDevToolsOpen() {
    logger.warn('🚨 DevTools detectado');

    // Opciones de respuesta:
    
    // 1. Ofuscar contenido
    this.obfuscateContent();

    // 2. Mostrar mensaje
    const overlay = document.createElement('div');
    overlay.id = 'devtools-warning';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: system-ui;
    `;
    overlay.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h1 style="font-size: 48px; margin-bottom: 20px;">⚠️</h1>
        <h2 style="margin-bottom: 10px;">Herramientas de Desarrollo Detectadas</h2>
        <p style="opacity: 0.8; margin-bottom: 20px;">
          Esta aplicación está protegida contra inspección no autorizada.
        </p>
        <p style="font-size: 14px; opacity: 0.6;">
          Si eres un desarrollador autorizado, contacta al administrador.
        </p>
      </div>
    `;

    if (!document.getElementById('devtools-warning')) {
      document.body.appendChild(overlay);
    }

    // 3. Limpiar localStorage/sessionStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Silent fail
    }

    // 4. Redirect o reload
    setTimeout(() => {
      // window.location.reload();
    }, 3000);
  }

  /**
   * Ofuscar contenido cuando DevTools está abierto
   */
  private obfuscateContent() {
    // Blur todo el contenido
    document.body.style.filter = 'blur(8px)';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
  }

  /**
   * Deshabilitar click derecho
   */
  private disableRightClick() {
    document.addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault();
        logger.warn('Click derecho bloqueado');
        return false;
      },
      { capture: true }
    );

    logger.info('✅ Click derecho deshabilitado');
  }

  /**
   * Deshabilitar copiar/pegar
   */
  private disableCopyPaste() {
    // Bloquear Ctrl+C, Ctrl+V, Ctrl+X
    document.addEventListener(
      'keydown',
      (e) => {
        // Ctrl/Cmd + C/V/X/A/S/U
        if (
          (e.ctrlKey || e.metaKey) &&
          ['c', 'v', 'x', 'a', 's', 'u'].includes(e.key.toLowerCase())
        ) {
          e.preventDefault();
          logger.warn('Atajo de teclado bloqueado:', e.key);
          return false;
        }

        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
          (e.ctrlKey && e.key.toLowerCase() === 'u')
        ) {
          e.preventDefault();
          logger.warn('Atajo DevTools bloqueado');
          return false;
        }
      },
      { capture: true }
    );

    // Bloquear eventos de selección
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('copy', (e) => {
      e.preventDefault();
      logger.warn('Intento de copia bloqueado');
      return false;
    });

    document.addEventListener('cut', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('paste', (e) => {
      e.preventDefault();
      return false;
    });

    // CSS adicional
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    logger.info('✅ Copy/Paste deshabilitado');
  }

  /**
   * Deshabilitar ver código fuente
   */
  private disableViewSource() {
    // Bloquear Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        logger.warn('Ver código fuente bloqueado');
        return false;
      }
    });

    logger.info('✅ Ver código fuente bloqueado');
  }

  /**
   * Ofuscar console
   */
  private obfuscateConsole() {
    // Guardar funciones originales
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    // Sobrescribir console
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};

    // Restaurar solo para logger interno
    (window as any).__originalConsole = {
      log: originalLog,
      warn: originalWarn,
      error: originalError,
    };

    logger.info('✅ Console ofuscado');
  }

  /**
   * Detectar debugger con loop infinito
   */
  private detectDebuggerLoop() {
    setInterval(() => {
      const start = performance.now();
      debugger; // Si debugger está abierto, aquí se detiene
      const end = performance.now();

      // Si tomó más de 100ms, debugger está abierto
      if (end - start > 100) {
        this.onDevToolsOpen();
      }
    }, 1000);
  }

  /**
   * Agregar watermark invisible al DOM
   */
  private addDOMWatermark() {
    // Timestamp único
    const watermark = btoa(`MIRAFLORES_PLUS_${Date.now()}_PROTECTED`);

    // Agregar al DOM
    const meta = document.createElement('meta');
    meta.name = 'application-watermark';
    meta.content = watermark;
    document.head.appendChild(meta);

    // Agregar comentarios invisibles
    const comment = document.createComment(
      `PROTECTED BY MIRAFLORES PLUS - ${watermark}`
    );
    document.body.appendChild(comment);

    logger.info('✅ Watermark agregado');
  }

  /**
   * Deshabilitar capturas de pantalla (limitado)
   */
  private disableScreenshot() {
    // CSS para ocultar contenido en screenshots
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Detectar Print Screen (muy limitado)
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        logger.warn('Print Screen detectado');
        // Nota: clipboard API puede estar bloqueado por políticas del navegador
        // Esta es una medida adicional que puede fallar silenciosamente
      }
    });
  }

  /**
   * Proteger código fuente
   */
  private protectSourceCode() {
    // Deshabilitar guardar página
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        logger.warn('Guardar página bloqueado');
        return false;
      }
    });

    // Detectar si intentan acceder al código
    Object.defineProperty(window, 'name', {
      get: () => {
        logger.warn('Intento de acceso a window.name');
        return '';
      },
      set: () => {
        logger.warn('Intento de modificar window.name');
      },
    });
  }

  /**
   * Detectar automatización (bots, scrapers)
   */
  private detectAutomation() {
    // Detectar Puppeteer/Playwright
    if (
      (navigator as any).webdriver ||
      (window as any).document.documentElement.getAttribute('webdriver') ||
      (window as any).__nightmare ||
      (window as any).__phantomas
    ) {
      logger.error('❌ Automatización detectada');
      
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #dc2626;
          color: white;
          font-family: system-ui;
        ">
          <div style="text-align: center;">
            <h1>🤖 Bot Detectado</h1>
            <p>Automatización no permitida</p>
          </div>
        </div>
      `;

      throw new Error('AUTOMATION_DETECTED');
    }

    // Detectar headless browsers
    if (!navigator.plugins || navigator.plugins.length === 0) {
      logger.warn('⚠️ Posible headless browser');
    }

    // Verificar características del navegador
    if (!window.chrome && (window as any).chrome) {
      logger.warn('⚠️ Navegador sospechoso');
    }
  }

  /**
   * Limpiar y deshabilitar protecciones
   */
  cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Remover overlay
    const overlay = document.getElementById('devtools-warning');
    if (overlay) {
      overlay.remove();
    }

    // Restaurar estilos
    document.body.style.filter = '';
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';

    this.isProtectionActive = false;
    logger.info('Protección de código deshabilitada');
  }

  /**
   * Verificar si la protección está activa
   */
  isActive(): boolean {
    return this.isProtectionActive;
  }

  /**
   * Actualizar configuración
   */
  updateConfig(config: Partial<ProtectionConfig>) {
    this.config = { ...this.config, ...config };
    logger.info('Configuración de protección actualizada');
  }
}

// Export singleton
export const codeProtection = new CodeProtection();

/**
 * Inicializar protección al cargar
 */
export function initializeCodeProtection(config?: ProtectionConfig) {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  
  // NO activar protecciones en desarrollo, localhost, o Figma preview
  if (
    isDevelopment() ||
    currentDomain === 'localhost' ||
    currentDomain === '127.0.0.1' ||
    currentDomain.includes('figma') ||
    currentDomain.includes('localhost') ||
    currentDomain.includes('preview')
  ) {
    logger.warn('⚠️ Protección de código deshabilitada en desarrollo/preview');
    logger.info('Dominio actual:', currentDomain);
    return;
  }

  try {
    const protection = new CodeProtection(config);
    protection.initialize();
    
    // Guardar en window para acceso global
    (window as any).__codeProtection = protection;
    
    return protection;
  } catch (error) {
    logger.error('Error al inicializar protección:', error);
  }
}

/**
 * Hook para React
 */
export function useCodeProtection(config?: ProtectionConfig) {
  const protectionRef = { current: codeProtection };

  return {
    initialize: () => codeProtection.initialize(),
    cleanup: () => codeProtection.cleanup(),
    isActive: () => codeProtection.isActive(),
    updateConfig: (cfg: Partial<ProtectionConfig>) => codeProtection.updateConfig(cfg),
  };
}

/**
 * Verificar integridad del código
 */
export function verifyCodeIntegrity(expectedHash?: string): boolean {
  // En producción, verificar que el código no haya sido modificado
  // Esto requeriría generar un hash del código en build time
  
  if (!expectedHash) return true;
  
  // Aquí iría la lógica de verificación
  // Por ahora, solo retornamos true
  
  return true;
}

/**
 * Generar fingerprint del dispositivo
 */
export function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return 'NO_CANVAS';
  
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('🔒', 2, 2);
  
  const fingerprint = canvas.toDataURL();
  return btoa(fingerprint).substring(0, 32);
}

/**
 * Registrar evento sospechoso
 */
export function reportSuspiciousActivity(activity: string, details?: any) {
  logger.error('🚨 Actividad sospechosa:', activity, details);
  
  // En producción, enviar al backend
  if (!isDevelopment()) {
    // fetch('/api/security/report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     activity,
    //     details,
    //     timestamp: Date.now(),
    //     fingerprint: generateDeviceFingerprint(),
    //   }),
    // });
  }
}