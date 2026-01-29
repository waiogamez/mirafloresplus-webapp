import { useState, useEffect } from "react";
import { Bell, ShieldCheck, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { useFocusTrap, announceToScreenReader } from "./FocusTrap";
import { useNavigate } from "react-router";

interface Notification {
  id: number;
  type: "approval_pending" | "invoice_approved" | "invoice_rejected" | "payment_overdue" | "general" | "quote_approved" | "membership_payment";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionLink?: string; // Ruta a la que navegar cuando se hace clic
}

interface NotificationCenterProps {
  userRole?: "Recepción" | "Doctor" | "Finanzas" | "Junta Directiva" | "Afiliado" | "Super Admin";
  pendingApprovals?: number;
}

export function NotificationCenter({ userRole, pendingApprovals = 0 }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Focus trap for accessibility
  const popoverRef = useFocusTrap<HTMLDivElement>(isOpen);

  // Mock notifications based on role
  const getMockNotifications = (): Notification[] => {
    const baseNotifications: Notification[] = [
      {
        id: 1,
        type: "general",
        title: "Sistema actualizado",
        message: "Nueva versión de Miraflores Plus disponible",
        timestamp: "Hace 2 horas",
        isRead: true,
        priority: "low",
      },
    ];

    if (userRole === "Finanzas" || userRole === "Junta Directiva") {
      return [
        {
          id: 2,
          type: "approval_pending",
          title: `${pendingApprovals} facturas pendientes de aprobación`,
          message: "Revisa las facturas de proveedores que requieren aprobación",
          timestamp: "Hace 15 min",
          isRead: false,
          priority: "high",
        },
        {
          id: 3,
          type: "payment_overdue",
          title: "Facturas vencidas detectadas",
          message: "3 facturas aprobadas están vencidas y requieren pago urgente",
          timestamp: "Hace 1 hora",
          isRead: false,
          priority: "high",
        },
        ...baseNotifications,
      ];
    }

    if (userRole === "Recepción") {
      return [
        {
          id: 4,
          type: "invoice_approved",
          title: "Factura FACT-2025-002 aprobada",
          message: "La factura ha sido aprobada por Finanzas. Puedes proceder con el pago.",
          timestamp: "Hace 30 min",
          isRead: false,
          priority: "medium",
        },
        {
          id: 5,
          type: "invoice_rejected",
          title: "Factura FACT-2025-007 rechazada",
          message: 'Motivo: "Proveedor no está en el registro autorizado"',
          timestamp: "Hace 2 horas",
          isRead: false,
          priority: "medium",
        },
        ...baseNotifications,
      ];
    }

    return baseNotifications;
  };

  const [notifications, setNotifications] = useState<Notification[]>(getMockNotifications());

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "approval_pending":
        return <ShieldCheck className="w-5 h-5 text-orange-500" />;
      case "invoice_approved":
        return <CheckCircle2 className="w-5 h-5 text-[#62BF04]" />;
      case "invoice_rejected":
        return <X className="w-5 h-5 text-red-500" />;
      case "payment_overdue":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-[#0477BF]" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-orange-500 bg-orange-50";
      default:
        return "border-l-4 border-gray-300 bg-white";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    announceToScreenReader('Notificación marcada como leída', 'polite');
  };

  const markAllAsRead = () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    announceToScreenReader(`${unreadCount} notificaciones marcadas como leídas`, 'polite');
  };

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    announceToScreenReader('Notificación eliminada', 'polite');
  };

  // Announce when notifications open
  useEffect(() => {
    if (isOpen) {
      announceToScreenReader(`Centro de notificaciones abierto. ${unreadCount} notificaciones sin leer`, 'polite');
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label={`Notificaciones. ${unreadCount} sin leer`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Bell className="w-5 h-5 text-gray-600" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
              style={{ backgroundColor: "#0477BF" }}
              aria-label={`${unreadCount} notificaciones sin leer`}
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        role="dialog"
        aria-label="Centro de notificaciones"
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200" ref={popoverRef}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-[#0477BF]" id="notifications-title">Notificaciones</h3>
              <p className="text-xs text-gray-500 mt-0.5" aria-live="polite" aria-atomic="true">
                {unreadCount} sin leer
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-[#0477BF]"
                aria-label={`Marcar ${unreadCount} notificaciones como leídas`}
              >
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[400px]" aria-live="polite">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status">
                <Bell className="w-12 h-12 text-gray-300 mb-3" aria-hidden="true" />
                <p className="text-gray-500 text-sm">No tienes notificaciones</p>
                <p className="text-gray-400 text-xs mt-1">
                  Te avisaremos cuando haya novedades
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100" role="list" aria-label="Lista de notificaciones">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    role="listitem"
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? getPriorityColor(notification.priority) : "bg-white"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        markAsRead(notification.id);
                      }
                    }}
                    aria-label={`${notification.title}. ${notification.message}. ${notification.timestamp}. ${!notification.isRead ? 'No leída' : 'Leída'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1" aria-hidden="true">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              !notification.isRead
                                ? "text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                            aria-label={`Eliminar notificación: ${notification.title}`}
                          >
                            <X className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0" aria-label="No leída">
                          <div className="w-2 h-2 rounded-full bg-[#0477BF]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 text-center">
              <button 
                className="text-sm text-[#0477BF] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0477BF] focus:ring-offset-2 rounded"
                aria-label="Ver todas las notificaciones en página completa"
                onClick={() => navigate('/notifications')}
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}