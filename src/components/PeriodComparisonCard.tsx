import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PeriodData {
  label: string;
  value: number;
  subtext?: string;
}

interface PeriodComparisonCardProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  currentPeriod: PeriodData;
  previousPeriod: PeriodData;
  format?: "currency" | "number" | "percentage";
  inverse?: boolean; // For metrics where lower is better
}

export function PeriodComparisonCard({
  title,
  icon: Icon,
  color = "#0477BF",
  currentPeriod,
  previousPeriod,
  format = "number",
  inverse = false,
}: PeriodComparisonCardProps) {
  const formatValue = (value: number) => {
    switch (format) {
      case "currency":
        return `Q${value.toLocaleString()}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const calculateChange = () => {
    if (previousPeriod.value === 0) return 0;
    return ((currentPeriod.value - previousPeriod.value) / previousPeriod.value) * 100;
  };

  const change = calculateChange();
  const isPositive = inverse ? change < 0 : change > 0;
  const isNegative = inverse ? change > 0 : change < 0;
  const isNeutral = change === 0;

  const getChangeIcon = () => {
    if (isNeutral) return Minus;
    return isPositive ? TrendingUp : TrendingDown;
  };

  const getChangeColor = () => {
    if (isNeutral) return "text-gray-500";
    return isPositive ? "text-[#62BF04]" : "text-red-600";
  };

  const getChangeBgColor = () => {
    if (isNeutral) return "bg-gray-100";
    return isPositive ? "bg-[#62BF04]/10" : "bg-red-100";
  };

  const ChangeIcon = getChangeIcon();

  return (
    <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getChangeBgColor()}`}>
          <ChangeIcon className={`w-3 h-3 ${getChangeColor()}`} />
          <span className={`text-xs ${getChangeColor()}`}>
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
      </div>

      <h3 className="text-sm text-gray-600 mb-3">{title}</h3>

      <div className="space-y-3">
        {/* Current Period */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{currentPeriod.label}</span>
            <Badge className="text-xs" style={{ backgroundColor: `${color}20`, color: color }}>
              Actual
            </Badge>
          </div>
          <p className="text-gray-900" style={{ color: color }}>
            {formatValue(currentPeriod.value)}
          </p>
          {currentPeriod.subtext && (
            <p className="text-xs text-gray-500 mt-1">{currentPeriod.subtext}</p>
          )}
        </div>

        {/* Previous Period */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{previousPeriod.label}</span>
            <Badge variant="outline" className="text-xs">
              Anterior
            </Badge>
          </div>
          <p className="text-gray-700">
            {formatValue(previousPeriod.value)}
          </p>
          {previousPeriod.subtext && (
            <p className="text-xs text-gray-500 mt-1">{previousPeriod.subtext}</p>
          )}
        </div>
      </div>

      {/* Change Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Variación</span>
          <span className={getChangeColor()}>
            {isPositive ? "+" : isNegative ? "-" : ""}
            {formatValue(Math.abs(currentPeriod.value - previousPeriod.value))}
          </span>
        </div>
      </div>
    </Card>
  );
}
