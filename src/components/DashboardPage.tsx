import { useState, useEffect } from "react";
import { MetricCard } from "./MetricCard";
import { SystemHealthCard } from "./SystemHealthCard";
import { DateRangeFilter } from "./DateRangeFilter";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Users, Calendar, Banknote, CheckCircle, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Mock data for charts - with different ranges
const chartDataByRange: Record<string, any> = {
  "7days": {
    appointments: [
      { status: "Programadas", count: 23, fill: "#0477BF" },
      { status: "Completadas", count: 45, fill: "#62BF04" },
      { status: "Canceladas", count: 5, fill: "#F97316" },
      { status: "No asistió", count: 2, fill: "#EF4444" },
    ],
    affiliates: [
      { month: "Oct 10", affiliates: 2586 },
      { month: "Oct 11", affiliates: 2594 },
      { month: "Oct 12", affiliates: 2601 },
      { month: "Oct 13", affiliates: 2615 },
      { month: "Oct 14", affiliates: 2628 },
      { month: "Oct 15", affiliates: 2641 },
      { month: "Oct 16", affiliates: 2658 },
    ]
  },
  "30days": {
    appointments: [
      { status: "Programadas", count: 145, fill: "#0477BF" },
      { status: "Completadas", count: 289, fill: "#62BF04" },
      { status: "Canceladas", count: 34, fill: "#F97316" },
      { status: "No asistió", count: 12, fill: "#EF4444" },
    ],
    affiliates: [
      { month: "Semana 1", affiliates: 2340 },
      { month: "Semana 2", affiliates: 2420 },
      { month: "Semana 3", affiliates: 2510 },
      { month: "Semana 4", affiliates: 2586 },
    ]
  },
  "3months": {
    appointments: [
      { status: "Programadas", count: 432, fill: "#0477BF" },
      { status: "Completadas", count: 867, fill: "#62BF04" },
      { status: "Canceladas", count: 98, fill: "#F97316" },
      { status: "No asistió", count: 35, fill: "#EF4444" },
    ],
    affiliates: [
      { month: "Ago", affiliates: 2100 },
      { month: "Sep", affiliates: 2340 },
      { month: "Oct", affiliates: 2586 },
    ]
  },
  "6months": {
    appointments: [
      { status: "Programadas", count: 865, fill: "#0477BF" },
      { status: "Completadas", count: 1734, fill: "#62BF04" },
      { status: "Canceladas", count: 196, fill: "#F97316" },
      { status: "No asistió", count: 70, fill: "#EF4444" },
    ],
    affiliates: [
      { month: "May", affiliates: 1420 },
      { month: "Jun", affiliates: 1680 },
      { month: "Jul", affiliates: 1850 },
      { month: "Ago", affiliates: 2100 },
      { month: "Sep", affiliates: 2340 },
      { month: "Oct", affiliates: 2586 },
    ]
  },
  "1year": {
    appointments: [
      { status: "Programadas", count: 1730, fill: "#0477BF" },
      { status: "Completadas", count: 3468, fill: "#62BF04" },
      { status: "Canceladas", count: 392, fill: "#F97316" },
      { status: "No asistió", count: 140, fill: "#EF4444" },
    ],
    affiliates: [
      { month: "Oct '24", affiliates: 1250 },
      { month: "Dec '24", affiliates: 1420 },
      { month: "Feb '25", affiliates: 1680 },
      { month: "Apr '25", affiliates: 1850 },
      { month: "Jun '25", affiliates: 2100 },
      { month: "Aug '25", affiliates: 2340 },
      { month: "Oct '25", affiliates: 2586 },
    ]
  }
};

// Mock data for notifications table
const notifications = [
  {
    date: "2025-10-16",
    type: "Recordatorio de Cita",
    channel: "Email",
    status: "Enviado",
    recipient: "Juan Pérez"
  },
  {
    date: "2025-10-16",
    type: "Confirmación de Pago",
    channel: "SMS",
    status: "Entregado",
    recipient: "María González"
  },
  {
    date: "2025-10-15",
    type: "Resultados de Laboratorio",
    channel: "Email",
    status: "Enviado",
    recipient: "Carlos Rodríguez"
  },
  {
    date: "2025-10-15",
    type: "Recordatorio de Cita",
    channel: "WhatsApp",
    status: "Fallido",
    recipient: "Ana Martínez"
  },
  {
    date: "2025-10-14",
    type: "Actualización de Póliza",
    channel: "Email",
    status: "Enviado",
    recipient: "Pedro Sánchez"
  },
  {
    date: "2025-10-14",
    type: "Estado de Cuenta",
    channel: "Email",
    status: "Enviado",
    recipient: "Laura Díaz"
  },
];

export function DashboardPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [affiliatesCount, setAffiliatesCount] = useState(2586);
  const [appointmentsToday, setAppointmentsToday] = useState(47);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update metrics to simulate real-time changes
      setAffiliatesCount(prev => prev + Math.floor(Math.random() * 3));
      if (Math.random() > 0.7) {
        setAppointmentsToday(prev => prev + 1);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const currentData = chartDataByRange[dateRange];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Afiliados"
          value={affiliatesCount.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon={Users}
          color="#0477BF"
        />
        <MetricCard
          title="Citas de Hoy"
          value={appointmentsToday}
          change="+8.2%"
          changeType="positive"
          icon={Calendar}
          color="#2BB9D9"
        />
        <MetricCard
          title="Pagos Pendientes"
          value="Q12,450"
          change="-3.1%"
          changeType="negative"
          icon={Banknote}
          color="#F97316"
        />
        <MetricCard
          title="Pagos Completados"
          value="Q84,920"
          change="+18.7%"
          changeType="positive"
          icon={CheckCircle}
          color="#62BF04"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart - Appointments by Status */}
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#0477BF] mb-1">Citas por Estado</h3>
              <p className="text-sm text-gray-500">Vista general del período actual</p>
            </div>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData.appointments}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="status" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart - Affiliates per Month */}
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#0477BF] mb-1">Crecimiento de Afiliados</h3>
              <p className="text-sm text-gray-500">Análisis de tendencia de crecimiento</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#62BF04]/10 rounded-lg">
              <TrendingUp className="w-4 h-4" style={{ color: '#62BF04' }} />
              <span className="text-xs" style={{ color: '#62BF04' }}>+12.5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData.affiliates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="affiliates" 
                stroke="#0477BF" 
                strokeWidth={3}
                dot={{ fill: '#0477BF', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Notifications Table */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[#0477BF] mb-1">Notificaciones Recientes</h3>
            <p className="text-sm text-gray-500">Actividad de comunicación reciente</p>
          </div>
          <button 
            className="px-4 py-2 rounded-lg text-sm text-white transition-colors"
            style={{ backgroundColor: '#0477BF' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#035a8f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0477BF'}
          >
            Ver Todo
          </button>
        </div>
        
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">Fecha</TableHead>
                <TableHead className="text-[#0477BF]">Tipo</TableHead>
                <TableHead className="text-[#0477BF]">Canal</TableHead>
                <TableHead className="text-[#0477BF]">Estado</TableHead>
                <TableHead className="text-[#0477BF]">Destinatario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="text-gray-600">{notification.date}</TableCell>
                  <TableCell className="text-gray-900">{notification.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      {notification.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        notification.status === "Enviado" || notification.status === "Entregado"
                          ? "bg-[#62BF04]/10 text-[#62BF04] border-[#62BF04]/20"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                      variant="outline"
                    >
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900">{notification.recipient}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* System Health */}
      <SystemHealthCard />
    </div>
  );
}
