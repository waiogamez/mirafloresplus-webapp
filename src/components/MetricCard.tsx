import { memo, useMemo } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

function MetricCardComponent({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  color,
  loading = false,
  trend,
  subtitle,
  className = '',
}: MetricCardProps) {
  // Memoize change color calculation
  const changeColor = useMemo(() => {
    return changeType === "positive" ? "text-green-600" : 
           changeType === "negative" ? "text-red-600" : 
           "text-gray-600";
  }, [changeType]);

  // Memoize background color style
  const iconBgStyle = useMemo(() => ({
    backgroundColor: `${color}15`
  }), [color]);

  const iconStyle = useMemo(() => ({ color }), [color]);

  if (loading) {
    return (
      <Card className={`p-6 border border-gray-200 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow border border-gray-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <h3 className="text-[#264653] mb-2">{value}</h3>
          <div className="flex items-center gap-1">
            <span className={`text-xs ${changeColor}`}>{change}</span>
            <span className="text-xs text-gray-500">vs mes anterior</span>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 text-xs">
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={iconBgStyle}
          aria-hidden="true"
        >
          <Icon className="w-6 h-6" style={iconStyle} strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const MetricCard = memo(MetricCardComponent);
