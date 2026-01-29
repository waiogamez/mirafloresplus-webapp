import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
  showCustom?: boolean;
  onCustomRangeChange?: (from: Date | undefined, to: Date | undefined) => void;
}

export function DateRangeFilter({ value, onChange, showCustom = true, onCustomRangeChange }: DateRangeFilterProps) {
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleCustomApply = () => {
    if (customFrom && customTo && onCustomRangeChange) {
      onCustomRangeChange(customFrom, customTo);
      onChange("custom");
      setShowCustomPicker(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="w-4 h-4 text-gray-500" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-white border-gray-200">
          <SelectValue placeholder="Seleccionar rango" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoy</SelectItem>
          <SelectItem value="yesterday">Ayer</SelectItem>
          <SelectItem value="7days">Últimos 7 días</SelectItem>
          <SelectItem value="30days">Últimos 30 días</SelectItem>
          <SelectItem value="thismonth">Este mes</SelectItem>
          <SelectItem value="lastmonth">Mes anterior</SelectItem>
          <SelectItem value="3months">Últimos 3 meses</SelectItem>
          <SelectItem value="6months">Últimos 6 meses</SelectItem>
          <SelectItem value="thisyear">Este año</SelectItem>
          <SelectItem value="lastyear">Año anterior</SelectItem>
          {showCustom && <SelectItem value="custom">Personalizado</SelectItem>}
        </SelectContent>
      </Select>
      
      {showCustom && value === "custom" && (
        <Popover open={showCustomPicker} onOpenChange={setShowCustomPicker}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Seleccionar fechas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Fecha Inicial</Label>
                <Calendar
                  mode="single"
                  selected={customFrom}
                  onSelect={setCustomFrom}
                  disabled={(date) =>
                    date > new Date() || (customTo ? date > customTo : false)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Final</Label>
                <Calendar
                  mode="single"
                  selected={customTo}
                  onSelect={setCustomTo}
                  disabled={(date) =>
                    date > new Date() || (customFrom ? date < customFrom : false)
                  }
                />
              </div>
              <Button
                onClick={handleCustomApply}
                disabled={!customFrom || !customTo}
                className="w-full text-white"
                style={{ backgroundColor: "#0477BF" }}
              >
                Aplicar Rango
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
