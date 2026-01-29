import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MetricCard } from "./MetricCard";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  TrendingUp,
  Activity
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const todayAppointments = [
  { id: 1, time: "08:00", patient: "María González", type: "Consulta General", status: "confirmed" },
  { id: 2, time: "08:30", patient: "Carlos Rodríguez", type: "Control", status: "in-progress" },
  { id: 3, time: "09:00", patient: "Ana Martínez", type: "Teleconsulta", status: "confirmed" },
  { id: 4, time: "09:30", patient: "Juan Pérez", type: "Consulta General", status: "pending" },
  { id: 5, time: "10:00", patient: "Luisa Hernández", type: "Control", status: "confirmed" },
];

const weeklyStats = [
  { day: "Lun", consultas: 12, teleconsultas: 3 },
  { day: "Mar", consultas: 15, teleconsultas: 5 },
  { day: "Mié", consultas: 14, teleconsultas: 4 },
  { day: "Jue", consultas: 13, teleconsultas: 6 },
  { day: "Vie", consultas: 11, teleconsultas: 4 },
];

const patientsByCondition = [
  { condition: "Diabetes", count: 23, fill: "#0477BF" },
  { condition: "Hipertensión", count: 18, fill: "#2BB9D9" },
  { condition: "Control Preventivo", count: 35, fill: "#62BF04" },
  { condition: "Otros", count: 12, fill: "#9DD973" },
];

export function DoctorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF] mb-2">Panel del Doctor</h1>
          <p className="text-gray-600">
            Bienvenido de nuevo, Dr. Roberto Morales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Iniciar Videollamada
          </Button>
          <Button className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Nueva Receta
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Consultas Hoy"
          value="8"
          change="+12.5%"
          changeType="positive"
          icon={Calendar}
          color="#0477BF"
        />
        <MetricCard
          title="Pacientes Activos"
          value="142"
          change="+5.2%"
          changeType="positive"
          icon={Users}
          color="#62BF04"
        />
        <MetricCard
          title="Tiempo Promedio"
          value="18 min"
          change="-8.3%"
          changeType="negative"
          icon={Clock}
          color="#2BB9D9"
        />
        <MetricCard
          title="Satisfacción"
          value="4.8/5"
          change="+3.1%"
          changeType="positive"
          icon={Activity}
          color="#9DD973"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citas de Hoy */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0477BF] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda de Hoy
            </h3>
            <Badge className="bg-[#62BF04] text-white">
              {todayAppointments.length} Citas
            </Badge>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-[#0477BF]">{apt.time}</div>
                  </div>
                  <div>
                    <p className="font-medium">{apt.patient}</p>
                    <p className="text-sm text-gray-600">{apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {apt.status === "confirmed" && (
                    <Badge className="bg-green-100 text-green-700">
                      Confirmada
                    </Badge>
                  )}
                  {apt.status === "in-progress" && (
                    <Badge className="bg-blue-100 text-blue-700">
                      En Curso
                    </Badge>
                  )}
                  {apt.status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      Pendiente
                    </Badge>
                  )}
                  {apt.type === "Teleconsulta" && (
                    <Button size="sm" className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white">
                      <Video className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resumen Semanal */}
        <Card className="p-6">
          <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            Resumen Semanal
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#0477BF]/10 to-[#2BB9D9]/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Consultas</span>
                <span className="text-2xl text-[#0477BF]">65</span>
              </div>
              <div className="text-sm text-gray-600">+12% vs semana anterior</div>
            </div>
            <div className="bg-gradient-to-r from-[#62BF04]/10 to-[#9DD973]/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Teleconsultas</span>
                <span className="text-2xl text-[#62BF04]">22</span>
              </div>
              <div className="text-sm text-gray-600">34% del total</div>
            </div>
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Recetas Emitidas</span>
                <span className="text-2xl text-orange-600">58</span>
              </div>
              <div className="text-sm text-gray-600">89% de las consultas</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Actividad Semanal */}
        <Card className="p-6">
          <h3 className="text-[#0477BF] mb-4">Actividad Semanal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consultas" fill="#0477BF" name="Consultas" />
              <Bar dataKey="teleconsultas" fill="#62BF04" name="Teleconsultas" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribución de Pacientes */}
        <Card className="p-6">
          <h3 className="text-[#0477BF] mb-4">Pacientes por Condición</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={patientsByCondition} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="condition" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#0477BF" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alertas y Pendientes */}
      <Card className="p-6">
        <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" />
          Recordatorios y Pendientes
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">3 Recetas pendientes de revisión</p>
              <p className="text-sm text-amber-700">Requieren aprobación antes de las 3:00 PM</p>
            </div>
            <Button size="sm" variant="outline">Ver</Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">5 Historias clínicas por completar</p>
              <p className="text-sm text-blue-700">Pacientes atendidos esta mañana</p>
            </div>
            <Button size="sm" variant="outline">Completar</Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900">2 Pacientes para seguimiento</p>
              <p className="text-sm text-green-700">Control post-tratamiento programado</p>
            </div>
            <Button size="sm" variant="outline">Agendar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
