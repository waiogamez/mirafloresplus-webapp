import { Card } from "./ui/card";
import { Database, HardDrive, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

const systemMetrics = [
  {
    name: "Estado de Base de Datos",
    status: "Operacional",
    icon: Database,
    isHealthy: true,
    lastCheck: "Hace 2 min"
  },
  {
    name: "Sistema de Respaldo",
    status: "Operacional",
    icon: HardDrive,
    isHealthy: true,
    lastCheck: "Hace 5 min"
  },
  {
    name: "Puerta de Enlace API",
    status: "Operacional",
    icon: CheckCircle2,
    isHealthy: true,
    lastCheck: "Hace 1 min"
  },
  {
    name: "Servicio de Correo",
    status: "Degradado",
    icon: AlertCircle,
    isHealthy: false,
    lastCheck: "Ahora mismo"
  }
];

export function SystemHealthCard() {
  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#0477BF] mb-1">Salud del Sistema</h3>
          <p className="text-sm text-gray-500">Monitoreo de infraestructura en tiempo real</p>
        </div>
        <Badge 
          variant="outline" 
          className="border-[#62BF04] text-[#62BF04]"
        >
          Todos los Sistemas Operativos
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.name}
              className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    metric.isHealthy ? 'bg-[#62BF04]/10' : 'bg-orange-100'
                  }`}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: metric.isHealthy ? '#62BF04' : '#f97316' }}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-1">{metric.name}</p>
                  <p className={`text-xs mb-1 ${metric.isHealthy ? 'text-[#62BF04]' : 'text-orange-600'}`}>
                    {metric.status}
                  </p>
                  <p className="text-xs text-gray-500">{metric.lastCheck}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
