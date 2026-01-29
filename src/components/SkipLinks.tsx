/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts to main content areas
 * Critical for accessibility - allows keyboard users to skip repetitive navigation
 */
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#0477BF] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0477BF]"
      >
        Saltar al contenido principal
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#0477BF] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0477BF]"
        style={{ top: '4.5rem' }}
      >
        Saltar a la navegación
      </a>
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#0477BF] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0477BF]"
        style={{ top: '9rem' }}
      >
        Saltar a la búsqueda
      </a>
    </div>
  );
}

// Screen reader only utility class
// This is already in Tailwind, but defining here for clarity
const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .focus\\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`;
