import { Skeleton } from "./ui/skeleton";

// Loading para tablas
export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

// Loading para tarjetas de métricas
export function LoadingMetricCard() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// Loading para formularios
export function LoadingForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

// Loading para listas
export function LoadingList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading genérico para páginas
export function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <LoadingMetricCard />
        <LoadingMetricCard />
        <LoadingMetricCard />
        <LoadingMetricCard />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

// Ultra-fast page loading state
export function PageLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2]">
      <div className="text-center">
        {/* Minimal loader */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#0477BF]/20 rounded-full" />
          <div 
            className="absolute top-0 left-0 w-full h-full border-4 border-[#0477BF] border-t-transparent rounded-full animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
        
        {/* Loading text */}
        <p className="text-gray-600">Cargando...</p>
        
        {/* Accessibility */}
        <span className="sr-only" role="status" aria-live="polite">
          Cargando contenido de la página
        </span>
      </div>
    </div>
  );
}

// Minimal loading spinner for inline use
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 border-[#0477BF]/20 rounded-full" />
      <div 
        className="absolute inset-0 border-[#0477BF] border-t-transparent rounded-full animate-spin"
        style={{ animationDuration: '0.8s' }}
      />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
