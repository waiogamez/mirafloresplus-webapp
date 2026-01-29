import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell, X, CreditCard, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface PaymentReminder {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  status: "upcoming" | "due-soon" | "overdue";
  notified: boolean;
}

// Simulación de recordatorios de pago
const mockReminders: PaymentReminder[] = [
  {
    id: "REM-001",
    affiliateId: "AF-2586",
    affiliateName: "María González",
    amount: 115.00, // Titular + 1 dependiente
    dueDate: "2024-11-08",
    daysUntilDue: 5,
    status: "due-soon",
    notified: false,
  },
  {
    id: "REM-002",
    affiliateId: "AF-2585",
    affiliateName: "Carlos Rodríguez",
    amount: 75.00,
    dueDate: "2024-11-07",
    daysUntilDue: 4,
    status: "due-soon",
    notified: false,
  },
  {
    id: "REM-003",
    affiliateId: "AF-2584",
    affiliateName: "Ana Martínez",
    amount: 195.00, // Titular + 3 dependientes
    dueDate: "2024-11-05",
    daysUntilDue: 2,
    status: "due-soon",
    notified: false,
  },
  {
    id: "REM-004",
    affiliateId: "AF-2583",
    affiliateName: "Juan Pérez",
    amount: 75.00,
    dueDate: "2024-11-02",
    daysUntilDue: -1,
    status: "overdue",
    notified: false,
  },
];

export function PaymentReminderSystem() {
  const [reminders, setReminders] = useState<PaymentReminder[]>(mockReminders);
  const [showNotification, setShowNotification] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<PaymentReminder | null>(null);

  // Simular notificaciones automáticas cada 30 segundos (en producción sería basado en horarios reales)
  useEffect(() => {
    const checkReminders = () => {
      const unnotifiedReminders = reminders.filter(r => !r.notified);
      
      if (unnotifiedReminders.length > 0) {
        const reminderToShow = unnotifiedReminders[0];
        setCurrentReminder(reminderToShow);
        setShowNotification(true);
        
        // Marcar como notificado
        setReminders(prev => 
          prev.map(r => 
            r.id === reminderToShow.id ? { ...r, notified: true } : r
          )
        );

        // También mostrar toast
        showToastReminder(reminderToShow);
      }
    };

    // Ejecutar inmediatamente
    checkReminders();

    // Luego cada 30 segundos (en producción sería más espaciado)
    const interval = setInterval(checkReminders, 30000);

    return () => clearInterval(interval);
  }, [reminders]);

  const showToastReminder = (reminder: PaymentReminder) => {
    const getToastConfig = () => {
      if (reminder.status === "overdue") {
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          description: `Pago vencido hace ${Math.abs(reminder.daysUntilDue)} día(s)`,
          className: "border-red-500",
        };
      } else if (reminder.daysUntilDue <= 2) {
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
          description: `Vence en ${reminder.daysUntilDue} día(s)`,
          className: "border-orange-500",
        };
      } else {
        return {
          icon: <Calendar className="w-5 h-5 text-blue-500" />,
          description: `Vence en ${reminder.daysUntilDue} días`,
          className: "border-blue-500",
        };
      }
    };

    const config = getToastConfig();

    toast.custom(
      (t) => (
        <div className={`bg-white border-2 rounded-lg shadow-lg p-4 max-w-md ${config.className}`}>
          <div className="flex items-start gap-3">
            {config.icon}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Recordatorio de Pago - {reminder.affiliateName}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{config.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#0477BF]">
                  Q{reminder.amount.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.dismiss(t);
                      handleProcessPayment(reminder);
                    }}
                  >
                    Procesar Pago
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.dismiss(t)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-right",
      }
    );
  };

  const handleProcessPayment = (reminder: PaymentReminder) => {
    toast.success(`Procesando pago de Q${reminder.amount.toFixed(2)} para ${reminder.affiliateName}`);
    // Aquí iría la lógica para procesar el pago
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
    setCurrentReminder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-500";
      case "due-soon":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusText = (status: string, daysUntilDue: number) => {
    switch (status) {
      case "overdue":
        return `Vencido hace ${Math.abs(daysUntilDue)} día(s)`;
      case "due-soon":
        return `Vence en ${daysUntilDue} día(s)`;
      default:
        return `Vence en ${daysUntilDue} días`;
    }
  };

  return (
    <>
      {/* Panel de Recordatorios */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#0477BF] flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Sistema de Recordatorios de Pago
          </h3>
          <Badge className="bg-[#0477BF] text-white">
            {reminders.filter(r => r.status !== "overdue").length} Activos
          </Badge>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Próximos (5-10 días)</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-blue-900">
              {reminders.filter(r => r.daysUntilDue >= 5 && r.daysUntilDue <= 10).length}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-700">Vencen Pronto (1-4 días)</span>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl text-orange-900">
              {reminders.filter(r => r.daysUntilDue >= 1 && r.daysUntilDue <= 4).length}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-red-700">Vencidos</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl text-red-900">
              {reminders.filter(r => r.status === "overdue").length}
            </div>
          </div>
        </div>

        {/* Lista de Recordatorios */}
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                reminder.status === "overdue"
                  ? "bg-red-50 border-red-200"
                  : reminder.daysUntilDue <= 2
                  ? "bg-orange-50 border-orange-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getStatusColor(reminder.status)} text-white`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{reminder.affiliateName}</p>
                  <p className="text-sm text-gray-600">
                    {reminder.affiliateId} • Vence: {new Date(reminder.dueDate).toLocaleDateString('es-GT')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl text-[#0477BF]">
                    Q{reminder.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getStatusText(reminder.status, reminder.daysUntilDue)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentReminder(reminder);
                    setShowNotification(true);
                  }}
                  variant="outline"
                >
                  Enviar Recordatorio
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Configuración de Notificaciones */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Configuración de Recordatorios
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Recordatorio a 10 días: Notificación informativa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Recordatorio a 5 días: Email + Notificación push</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Recordatorio a 2 días: Email + SMS + Push</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Al vencimiento: Notificación urgente + Llamada</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notificación flotante animada */}
      <AnimatePresence>
        {showNotification && currentReminder && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 w-96"
          >
            <Card className={`p-4 shadow-2xl border-2 ${
              currentReminder.status === "overdue" 
                ? "border-red-500 bg-red-50" 
                : "border-orange-500 bg-orange-50"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className={`w-6 h-6 ${
                    currentReminder.status === "overdue" ? "text-red-600" : "text-orange-600"
                  } animate-pulse`} />
                  <h3 className="font-semibold text-gray-900">
                    Recordatorio de Pago
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismissNotification}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <p className="font-medium">{currentReminder.affiliateName}</p>
                <p className="text-sm text-gray-600">
                  {currentReminder.affiliateId}
                </p>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Monto a pagar:</span>
                  <span className="text-xl text-[#0477BF]">
                    Q{currentReminder.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Vencimiento: {new Date(currentReminder.dueDate).toLocaleDateString('es-GT')}
                </p>
                <p className={`text-sm font-medium ${
                  currentReminder.status === "overdue" ? "text-red-700" : "text-orange-700"
                }`}>
                  {getStatusText(currentReminder.status, currentReminder.daysUntilDue)}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1 bg-[#0477BF] hover:bg-[#0477BF]/90 text-white"
                  onClick={() => {
                    handleProcessPayment(currentReminder);
                    handleDismissNotification();
                  }}
                >
                  Procesar Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismissNotification}
                >
                  Más Tarde
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
