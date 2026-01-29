import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to trap focus within a container element (e.g., modal, dialog)
 * Ensures keyboard navigation stays within the modal and restores focus on close
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean
): RefObject<T> {
  const previousFocus = useRef<HTMLElement | null>(null);
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) {
      // Restore focus when closing
      if (previousFocus.current) {
        previousFocus.current.focus();
        previousFocus.current = null;
      }
      return;
    }

    // Save the currently focused element
    previousFocus.current = document.activeElement as HTMLElement;

    // Find all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      if (!containerRef.current) return [];

      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];

      const elements = containerRef.current.querySelectorAll<HTMLElement>(
        focusableSelectors.join(',')
      );

      return Array.from(elements).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      );
    };

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        focusableElements[0]?.focus();
      }, 0);
    }

    // Handle Tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab: Move focus backwards
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move focus forwards
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return containerRef;
}

/**
 * Hook to manage focus within a specific element
 * Useful for dropdowns, menus, and other interactive components
 */
export function useFocusManagement(isOpen: boolean, autoFocus: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen && autoFocus && elementRef.current) {
      // Focus the element when opened
      const focusTimeout = setTimeout(() => {
        elementRef.current?.focus();
      }, 0);

      return () => clearTimeout(focusTimeout);
    }
  }, [isOpen, autoFocus]);

  return elementRef;
}

/**
 * Component wrapper that adds focus trap functionality
 */
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
  restoreFocus?: boolean;
}

export function FocusTrap({
  children,
  isActive,
  className = '',
  restoreFocus = true,
}: FocusTrapProps) {
  const containerRef = useFocusTrap(isActive);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Announce content to screen readers
 * Useful for dynamic content updates
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
