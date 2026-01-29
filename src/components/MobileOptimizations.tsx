/**
 * Mobile Optimizations - Miraflores Plus
 * Componentes y utilidades para experiencia móvil optimizada
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';

// Pull to Refresh Component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  resistance?: number;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  resistance = 2.5,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setCanPull(true);
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!canPull || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance / resistance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setCanPull(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canPull, isRefreshing, pullDistance]);

  return (
    <div ref={containerRef} className="relative overflow-auto h-full">
      {/* Pull Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <RefreshCw
          className={`w-6 h-6 text-[#0477BF] ${
            isRefreshing ? 'animate-spin' : pullDistance >= threshold ? 'scale-110' : ''
          }`}
        />
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Bottom Sheet Component (ya existe Sheet, pero optimizado para mobile)
interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  snapPoints?: number[];
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  snapPoints = [0.5, 0.9],
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(snapPoints[0]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl"
        style={{
          maxHeight: `${currentSnap * 100}vh`,
        }}
      >
        {/* Drag Handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="mt-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Touch Gesture Hook
interface TouchGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
}

export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  threshold = 50,
}: TouchGestureHandlers) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe) {
      if (deltaX > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      if (deltaY > threshold && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < -threshold && onSwipeUp) {
        onSwipeUp();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// Mobile-Optimized Table
interface MobileTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => ReactNode;
  }[];
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
}

export function MobileTable<T>({
  data,
  columns,
  onRowClick,
  keyExtractor,
}: MobileTableProps<T>) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={keyExtractor(item)}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 active:bg-gray-50 transition-colors"
          onClick={() => onRowClick?.(item)}
        >
          {columns.map((column) => (
            <div key={String(column.key)} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-600 text-sm">{column.label}</span>
              <span className="text-gray-900 font-medium text-sm text-right">
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Responsive Container Hook
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  return { isMobile, isTablet, isDesktop };
}

// Touch-Friendly Button Group
interface TouchButtonGroupProps {
  buttons: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'default' | 'primary' | 'danger';
  }[];
}

export function TouchButtonGroup({ buttons }: TouchButtonGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          className={`h-14 flex flex-col items-center justify-center gap-1 ${
            button.variant === 'primary'
              ? 'bg-[#0477BF] hover:bg-[#0466A6]'
              : button.variant === 'danger'
              ? 'bg-red-500 hover:bg-red-600'
              : ''
          }`}
        >
          {button.icon}
          <span className="text-xs">{button.label}</span>
        </Button>
      ))}
    </div>
  );
}

// Floating Action Button (FAB)
interface FABProps {
  icon: ReactNode;
  onClick: () => void;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function FAB({
  icon,
  onClick,
  label,
  position = 'bottom-right',
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} z-50 bg-[#0477BF] text-white rounded-full shadow-lg hover:bg-[#0466A6] active:scale-95 transition-all duration-200 ${
        label ? 'px-6 py-4 flex items-center gap-2' : 'w-14 h-14 flex items-center justify-center'
      }`}
      aria-label={label || 'Acción flotante'}
    >
      {icon}
      {label && <span className="font-medium">{label}</span>}
    </button>
  );
}

// Mobile-Optimized Form Field
interface MobileFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function MobileFormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  error,
}: MobileFormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0477BF] focus:border-transparent"
        required={required}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Haptic Feedback (solo en dispositivos compatibles)
export const haptics = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },
};
