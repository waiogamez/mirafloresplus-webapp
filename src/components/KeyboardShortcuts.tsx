import { useEffect } from 'react';
import { toast } from 'sonner';

interface KeyboardShortcutsProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  onNewAppointment?: () => void;
  onNewAffiliate?: () => void;
  onShowHelp?: () => void;
  onNavigate?: (page: string) => void;
}

export function useKeyboardShortcuts({
  onToggleSidebar,
  onOpenSearch,
  onNewAppointment,
  onNewAffiliate,
  onShowHelp,
  onNavigate,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape key to blur inputs
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      // Ctrl/Cmd + K: Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (onOpenSearch) {
          onOpenSearch();
        } else {
          const searchInput = document.getElementById('global-search');
          searchInput?.focus();
        }
        return;
      }

      // Ctrl/Cmd + B: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar?.();
        toast.success('Barra lateral alternada');
        return;
      }

      // Alt + N: Nueva cita
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        onNewAppointment?.();
        return;
      }

      // Alt + A: Nuevo afiliado
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        onNewAffiliate?.();
        return;
      }

      // Alt + 1-9: Navigate to different sections
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const pages = ['dashboard', 'appointments', 'affiliates', 'payments', 'billing', 'reports', 'payables', 'catalogs', 'settings'];
        const pageIndex = parseInt(e.key) - 1;
        if (pageIndex < pages.length && onNavigate) {
          onNavigate(pages[pageIndex]);
          toast.success(`Navegado a ${pages[pageIndex]}`);
        }
        return;
      }

      // ?: Show help/shortcuts
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        onShowHelp?.();
        return;
      }

      // Escape: Close modals/dropdowns
      if (e.key === 'Escape') {
        // Let React components handle their own Escape logic
        // This is here for documentation purposes
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggleSidebar, onOpenSearch, onNewAppointment, onNewAffiliate, onShowHelp, onNavigate]);
}

// Component to display keyboard shortcuts
export function KeyboardShortcutsHelp({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const shortcuts = [
    { keys: ['Ctrl', 'K'], action: 'Abrir búsqueda global', mac: ['⌘', 'K'] },
    { keys: ['Ctrl', 'B'], action: 'Alternar barra lateral', mac: ['⌘', 'B'] },
    { keys: ['Alt', 'N'], action: 'Nueva cita médica', mac: ['⌥', 'N'] },
    { keys: ['Alt', 'A'], action: 'Nuevo afiliado', mac: ['⌥', 'A'] },
    { keys: ['Alt', '1-9'], action: 'Navegar a secciones', mac: ['⌥', '1-9'] },
    { keys: ['?'], action: 'Mostrar atajos de teclado', mac: ['?'] },
    { keys: ['Esc'], action: 'Cerrar modales', mac: ['Esc'] },
    { keys: ['Tab'], action: 'Navegar entre elementos', mac: ['Tab'] },
    { keys: ['Shift', 'Tab'], action: 'Navegar hacia atrás', mac: ['⇧', 'Tab'] },
    { keys: ['Enter'], action: 'Activar elemento enfocado', mac: ['Enter'] },
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="shortcuts-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 id="shortcuts-title" className="text-[#0477BF]">
            Atajos de Teclado
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0477BF] rounded"
            aria-label="Cerrar diálogo de atajos"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-700">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {(isMac ? shortcut.mac : shortcut.keys).map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 rounded shadow-sm text-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            💡 Tip: Presiona <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">?</kbd> en cualquier momento para ver estos atajos.
          </p>
        </div>
      </div>
    </div>
  );
}
