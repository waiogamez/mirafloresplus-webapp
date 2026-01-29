interface QuetzalIconProps {
  className?: string;
}

export function QuetzalIcon({ className = "" }: QuetzalIconProps) {
  const baseClasses = "inline-flex items-center justify-center font-bold";
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;
  
  return (
    <div 
      className={combinedClasses}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      Q
    </div>
  );
}
