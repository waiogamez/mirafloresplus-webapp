import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MetricCard } from "./MetricCard";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  UserPlus,
  Phone,
  Mail,
  AlertCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { useUIStore } from "../store";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data for waiting room and recent registrations
// (todaySchedule will be obtained from store)

const waitingRoom = [
  { name: "Carlos Rodríguez", appointmentTime: "08:30", waitTime: "12 min", priority: "normal" },
  { name: "Pedro Morales", appointmentTime: "Sin cita", waitTime: "25 min", priority: "urgent" },
  { name: "Sofia Ramírez", appointmentTime: "09:15", waitTime: "5 min", priority: "normal" },
];

const recentRegistrations = [
  { id: "AF-2658", name: "Laura Méndez", plan: "Premium", date: "Hoy 10:30 AM" },
  { id: "AF-2657", name: "Diego Castro", plan: "Básico", date: "Hoy 09:15 AM" },
  { id: "AF-2656", name: "Patricia Ruiz", plan: "Premium", date: "Ayer 4:20 PM" },
];

export function ReceptionDashboard() {
  console.log('🏥 [ReceptionDashboard] Componente renderizado');
  
  // Obtener citas del store
  const getTodayAppointments = useAppointmentStore((state) => state.getTodayAppointments);
  const todaySchedule = getTodayAppointments();
  
  // Get navigation function from UI store
  const setCurrentPage = useUIStore((state) => state.setCurrentPage);
  
  console.log('📅 [ReceptionDashboard] Citas de hoy:', todaySchedule.length);
  
  // Mapear status del store al formato esperado por el UI
  const mapStatus = (status: string) => {
    switch (status) {
      case "En Progreso":
        return "checked-in";
      case "Confirmada":
        return "confirmed";
      case "Programada":
        return "pending";
      default:
        return "pending";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF] mb-2">Panel de Recepción</h1>
          <p className="text-gray-600">
            Gestión de citas y atención al paciente
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setCurrentPage('affiliates')}
          >
            <UserPlus className="w-4 h-4" />
            Nueva Afiliación
          </Button>
          <Button 
            className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white flex items-center gap-2"
            onClick={() => setCurrentPage('appointments')}
          >
            <Calendar className="w-4 h-4" />
            Agendar Cita
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Citas Hoy"
          value={todaySchedule.length.toString()}
          change="+8.3%"
          changeType="positive"
          icon={Calendar}
          color="#0477BF"
        />
        <MetricCard
          title="En Sala de Espera"
          value={waitingRoom.length.toString()}
          change="-15.2%"
          changeType="negative"
          icon={Users}
          color="#2BB9D9"
        />
        <MetricCard
          title="Tiempo Promedio Espera"
          value="14 min"
          change="-12.5%"
          changeType="negative"
          icon={Clock}
          color="#62BF04"
        />
        <MetricCard
          title="Afiliaciones Hoy"
          value="2"
          change="0%"
          changeType="neutral"
          icon={UserPlus}
          color="#9DD973"
        />
      </div>

      {/* Sala de Espera */}
      {waitingRoom.length > 0 && (
        <Card className="p-6 border-2 border-[#2BB9D9]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0477BF] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sala de Espera
            </h3>
            <Badge className="bg-[#2BB9D9] text-white">
              {waitingRoom.length} Pacientes
            </Badge>
          </div>
          <div className="space-y-3">
            {waitingRoom.map((patient, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  patient.priority === "urgent"
                    ? "bg-red-50 border-2 border-red-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {patient.priority === "urgent" && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      {patient.appointmentTime === "Sin cita" ? (
                        <Badge variant="outline" className="text-xs">Sin cita previa</Badge>
                      ) : (
                        `Cita: ${patient.appointmentTime}`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Esperando</p>
                    <p className="font-medium text-[#0477BF]">{patient.waitTime}</p>
                  </div>
                  <Button size="sm" className="bg-[#62BF04] hover:bg-[#62BF04]/90 text-white">
                    Llamar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda del Día */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0477BF] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda del Día
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline">
                Total: {todaySchedule.length}
              </Badge>
              <Badge variant="outline">
                Completadas: {todaySchedule.filter(a => a.status === "Completada").length}
              </Badge>
              <Badge variant="outline">
                Pendientes: {todaySchedule.filter(a => a.status === "Programada" || a.status === "Confirmada").length}
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaySchedule.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No hay citas agendadas para hoy. <br />
                      <span className="text-sm">Haz clic en "Agendar Cita" para crear una nueva.</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  todaySchedule.map((apt) => {
                    const mappedStatus = mapStatus(apt.status);
                    return (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.time}</TableCell>
                        <TableCell>{apt.affiliateName}</TableCell>
                        <TableCell>{apt.doctorName}</TableCell>
                        <TableCell>{apt.type}</TableCell>
                        <TableCell>
                          {apt.status === "En Progreso" && (
                            <Badge className="bg-green-500 text-white">En consulta</Badge>
                          )}
                          {apt.status === "Confirmada" && (
                            <Badge className="bg-gray-500 text-white">Confirmada</Badge>
                          )}
                          {apt.status === "Programada" && (
                            <Badge className="bg-yellow-500 text-white">Programada</Badge>
                          )}
                          {apt.status === "Completada" && (
                            <Badge className="bg-green-600 text-white">Completada</Badge>
                          )}
                          {apt.status === "Cancelada" && (
                            <Badge className="bg-red-500 text-white">Cancelada</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {apt.status === "Confirmada" && (
                              <Button size="sm" variant="outline" className="text-green-600">
                                Check-in
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              Ver
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Afiliaciones Recientes */}
          <Card className="p-6">
            <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5" />
              Afiliaciones Recientes
            </h3>
            <div className="space-y-3">
              {recentRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{reg.name}</span>
                    <Badge className="bg-[#62BF04] text-white text-xs">
                      {reg.id}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Plan {reg.plan}</span>
                    <span>{reg.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              Ver Todas
            </Button>
          </Card>

          {/* Acciones Rápidas */}
          <Card className="p-6">
            <h3 className="text-[#0477BF] mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Llamar a Paciente
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Enviar Recordatorio
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Reprogramar Cita
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar Asistencia
              </Button>
            </div>
          </Card>

          {/* Estadísticas del Día */}
          <Card className="p-6 bg-gradient-to-br from-[#0477BF]/10 to-[#2BB9D9]/10">
            <h3 className="text-[#0477BF] mb-3">Resumen del Día</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Citas programadas:</span>
                <span className="font-medium">{todaySchedule.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completadas:</span>
                <span className="font-medium text-green-600">
                  {todaySchedule.filter(a => a.status === "Completada").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Canceladas:</span>
                <span className="font-medium text-red-600">
                  {todaySchedule.filter(a => a.status === "Cancelada").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tasa de asistencia:</span>
                <span className="font-medium text-[#0477BF]">
                  {todaySchedule.length > 0 
                    ? Math.round((todaySchedule.filter(a => a.status === "Completada").length / todaySchedule.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}