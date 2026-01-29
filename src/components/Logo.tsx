/**
 * Logo Component - Miraflores Plus
 * Versión: Sin dependencia de assets externos
 */

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {/* Logo Icon */}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" 
        style={{ backgroundColor: '#0477BF' }}
      >
        <span className="text-white font-bold text-xl">M+</span>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight" style={{ color: '#0477BF' }}>
          Miraflores Plus
        </span>
        <span className="text-xs text-gray-500 leading-tight">
          Sistema de Salud
        </span>
      </div>
    </div>
  );
}
