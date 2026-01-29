/**
 * Utilidad para copiar texto al portapapeles con fallback
 * para navegadores que bloquean el Clipboard API
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Intentar primero con el API moderno del portapapeles
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API falló, usando método alternativo:', err);
    }
  }

  // Fallback: método tradicional usando textarea oculto
  return fallbackCopyToClipboard(text);
}

function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Crear elemento temporal
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Hacer el textarea invisible pero accesible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // Seleccionar el texto
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    
    // Intentar copiar
    const successful = document.execCommand('copy');
    
    // Limpiar
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}

/**
 * Verifica si el API del portapapeles está disponible
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}
