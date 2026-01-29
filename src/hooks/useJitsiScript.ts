import { useEffect, useState } from 'react';

interface UseJitsiScriptReturn {
  loaded: boolean;
  error: Error | null;
}

/**
 * Hook para cargar el script externo de Jitsi Meet
 * Carga el script una sola vez y lo cachea para todas las instancias
 */
export function useJitsiScript(domain: string): UseJitsiScriptReturn {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Verificar si el script ya fue cargado
    const existingScript = document.querySelector(`script[src="https://${domain}/external_api.js"]`);
    
    if (existingScript) {
      // El script ya existe, verificar si ya está cargado
      if ((window as any).JitsiMeetExternalAPI) {
        setLoaded(true);
        return;
      }
      
      // El script existe pero aún no se ha cargado completamente
      existingScript.addEventListener('load', () => {
        setLoaded(true);
      });
      
      existingScript.addEventListener('error', (e) => {
        setError(new Error(`Failed to load Jitsi script from ${domain}`));
      });
      
      return;
    }

    // Crear nuevo script tag
    const script = document.createElement('script');
    script.src = `https://${domain}/external_api.js`;
    script.async = true;

    script.onload = () => {
      if ((window as any).JitsiMeetExternalAPI) {
        setLoaded(true);
      } else {
        setError(new Error('JitsiMeetExternalAPI not found after script load'));
      }
    };

    script.onerror = () => {
      setError(new Error(`Failed to load Jitsi script from ${domain}`));
    };

    // Agregar script al document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // No removemos el script intencionalmente para mantener el cache
      // Si se necesita cleanup completo, descomentar las siguientes líneas:
      // if (script.parentNode) {
      //   script.parentNode.removeChild(script);
      // }
    };
  }, [domain]);

  return { loaded, error };
}
