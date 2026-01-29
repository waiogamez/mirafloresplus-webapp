/**
 * PWA Install Prompt - Miraflores Plus
 * Componente para promover la instalación de la PWA
 */

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { logger } from '../utils/logger';
import { analytics } from '../utils/analytics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      logger.info('PWA', 'App already installed');
      return;
    }

    // Verificar si ya se instaló previamente
    const hasBeenInstalled = localStorage.getItem('pwa-installed');
    if (hasBeenInstalled) {
      setIsInstalled(true);
      return;
    }

    // Verificar si el usuario ya rechazó la instalación
    const dismissedDate = localStorage.getItem('pwa-install-dismissed');
    if (dismissedDate) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        // No mostrar de nuevo si fue rechazado hace menos de 7 días
        return;
      }
    }

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt después de 30 segundos de uso
      setTimeout(() => {
        setShowPrompt(true);
        analytics.trackEvent('pwa_prompt_shown', 'pwa', 'prompt_shown', {
          properties: { timestamp: Date.now() }
        });
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Detectar cuando se instala
    window.addEventListener('appinstalled', () => {
      logger.info('PWA', 'App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
      analytics.trackEvent('pwa_installed', 'pwa', 'install', {
        properties: { timestamp: Date.now() }
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Mostrar prompt de instalación
    deferredPrompt.prompt();

    // Esperar respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    logger.info('PWA', `User choice: ${outcome}`);
    analytics.trackEvent('pwa_prompt_response', 'pwa', 'prompt_response', {
      properties: { outcome }
    });

    if (outcome === 'accepted') {
      setShowPrompt(false);
    } else {
      // Guardar que el usuario rechazó
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    analytics.trackEvent('pwa_prompt_dismissed', 'pwa', 'prompt_dismissed', {
      properties: { timestamp: Date.now() }
    });
  };

  // No mostrar si ya está instalado o no hay prompt
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:w-96 animate-in slide-in-from-bottom duration-300">
      <Card className="shadow-2xl border-2 border-[#0477BF]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0477BF] rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Instalar Miraflores Plus</CardTitle>
                <CardDescription>Accede más rápido desde tu inicio</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0477BF]" />
              Acceso instantáneo sin abrir el navegador
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0477BF]" />
              Funciona sin conexión
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0477BF]" />
              Notificaciones de citas y recordatorios
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0477BF]" />
              Ocupa menos espacio que una app nativa
            </li>
          </ul>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-[#0477BF] hover:bg-[#0466A6]"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar Ahora
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Más Tarde
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Instalación segura y gratuita • Sin requerir Play Store
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para detectar si la PWA está instalada
export function usePWAInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        localStorage.getItem('pwa-installed') === 'true'
      );
    };

    setIsInstalled(checkInstalled());

    // Escuchar evento de instalación
    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return isInstalled;
}

// Componente para mostrar badge de "Instalado"
export function PWAInstalledBadge() {
  const isInstalled = usePWAInstalled();

  if (!isInstalled) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
        <Smartphone className="w-3 h-3" />
        App Instalada
      </div>
    </div>
  );
}
