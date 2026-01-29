/**
 * Offline Indicator - Miraflores Plus
 * Indicador de estado de conexión a internet
 */

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, Cloud, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      setShowNotification(true);

      // Ocultar notificación de reconexión después de 3 segundos
      setTimeout(() => {
        setShowNotification(false);
        setJustReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // No mostrar nada si está online y no es una reconexión reciente
  if (isOnline && !showNotification) {
    return null;
  }

  return (
    <>
      {/* Banner persistente cuando está offline */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-yellow-500 text-white py-2 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">Sin conexión a internet</span>
            <span className="hidden sm:inline text-sm opacity-90">
              - Algunas funciones pueden no estar disponibles
            </span>
          </div>
        </div>
      )}

      {/* Toast de reconexión */}
      {justReconnected && showNotification && (
        <div className="fixed bottom-4 right-4 z-[9999] animate-in slide-in-from-bottom duration-300">
          <Alert className="bg-green-500 text-white border-green-600 shadow-lg min-w-[300px]">
            <Wifi className="h-5 w-5" />
            <AlertDescription className="ml-2">
              Conexión restablecida
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}

// Hook para verificar estado de conexión
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Hook para verificar velocidad de conexión
export function useNetworkSpeed() {
  const [speed, setSpeed] = useState<'slow' | 'fast' | 'offline'>('fast');

  useEffect(() => {
    // @ts-ignore - NetworkInformation API experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) {
      return;
    }

    const updateSpeed = () => {
      if (!navigator.onLine) {
        setSpeed('offline');
        return;
      }

      // effectiveType puede ser: 'slow-2g', '2g', '3g', '4g'
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setSpeed('slow');
      } else {
        setSpeed('fast');
      }
    };

    updateSpeed();
    connection.addEventListener('change', updateSpeed);

    return () => {
      connection.removeEventListener('change', updateSpeed);
    };
  }, []);

  return speed;
}

// Componente de aviso de conexión lenta
export function SlowConnectionWarning() {
  const speed = useNetworkSpeed();

  if (speed !== 'slow') {
    return null;
  }

  return (
    <Alert className="mb-4 bg-orange-50 border-orange-200">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="ml-2 text-orange-800">
        Tu conexión es lenta. La carga puede tardar más de lo habitual.
      </AlertDescription>
    </Alert>
  );
}

// Componente de estado de sincronización (para cuando se usa offline)
interface SyncStatusProps {
  pendingChanges?: number;
}

export function SyncStatus({ pendingChanges = 0 }: SyncStatusProps) {
  const isOnline = useOnlineStatus();

  if (pendingChanges === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Alert className={`${isOnline ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <Cloud className={`h-4 w-4 ${isOnline ? 'text-blue-600 animate-pulse' : 'text-yellow-600'}`} />
        <AlertDescription className="ml-2">
          {isOnline ? (
            <>Sincronizando {pendingChanges} cambio{pendingChanges > 1 ? 's' : ''}...</>
          ) : (
            <>
              {pendingChanges} cambio{pendingChanges > 1 ? 's' : ''} pendiente{pendingChanges > 1 ? 's' : ''} de sincronizar
            </>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
