import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PaymentReminderSystem } from "./PaymentReminderSystem";
import { MetricCard } from "./MetricCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Banknote,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const recentPayments = [
  { id: "PAY-1234", affiliate: "María González (AF-2586)", amount: 115.00, date: "2024-11-01", status: "completed", method: "Transferencia" },
  { id: "PAY-1233", affiliate: "Carlos Rodríguez (AF-2585)", amount: 75.00, date: "2024-11-01", status: "completed", method: "Tarjeta" },
  { id: "PAY-1232", affiliate: "Ana Martínez (AF-2584)", amount: 195.00, date: "2024-10-31", status: "completed", method: "Efectivo" },
  { id: "PAY-1231", affiliate: "Roberto Gómez (AF-2582)", amount: 155.00, date: "2024-10-31", status: "completed", method: "Transferencia" },
  { id: "PAY-1230", affiliate: "Laura Méndez (AF-2580)", amount: 75.00, date: "2024-10-30", status: "completed", method: "Tarjeta" },
];

const pendingPayments = [
  { id: "PEN-456", affiliate: "Juan Pérez (AF-2583)", amount: 75.00, dueDate: "2024-11-02", daysOverdue: 1, status: "overdue" },
  { id: "PEN-455", affiliate: "Sofia Ramírez (AF-2579)", amount: 115.00, dueDate: "2024-11-05", daysUntilDue: 2, status: "due-soon" },
  { id: "PEN-454", affiliate: "Diego Castro (AF-2578)", amount: 75.00, dueDate: "2024-11-06", daysUntilDue: 3, status: "due-soon" },
];

export function PaymentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF] mb-2">Gestión de Pagos</h1>
          <p className="text-gray-600">
            Control de pagos mensuales y recordatorios automatizados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Registrar Pago
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cobrado Este Mes"
          value="Q218,450"
          change="+8.5%"
          changeType="positive"
          icon={Banknote}
          color="#62BF04"
        />
        <MetricCard
          title="Pagos Pendientes"
          value="Q15,240"
          change="-12.3%"
          changeType="negative"
          icon={AlertCircle}
          color="#F97316"
        />
        <MetricCard
          title="Tasa de Cobro"
          value="96.8%"
          change="+2.1%"
          changeType="positive"
          icon={TrendingUp}
          color="#0477BF"
        />
        <MetricCard
          title="Pagos Hoy"
          value="24"
          change="+15.2%"
          changeType="positive"
          icon={CheckCircle}
          color="#2BB9D9"
        />
      </div>

      {/* Sistema de Recordatorios */}
      <PaymentReminderSystem />

      {/* Tabs de Pagos */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Pagos Recientes</TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes
            <Badge className="ml-2 bg-red-500 text-white">
              {pendingPayments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Pagos Recientes */}
        <TabsContent value="recent" className="space-y-4">
          <Card className="p-6">
            {/* Filtros */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, ID o número de pago..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="failed">Fallidos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Más Filtros
              </Button>
            </div>

            {/* Tabla de Pagos */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pago</TableHead>
                    <TableHead>Afiliado</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.affiliate}</TableCell>
                      <TableCell className="text-[#0477BF]">
                        Q{payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString('es-GT')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completado
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Ver</Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Pagos Pendientes */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0477BF] flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Pagos Pendientes y Vencidos
              </h3>
              <Button variant="outline" className="flex items-center gap-2">
                Enviar Recordatorios Masivos
              </Button>
            </div>

            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    payment.status === "overdue"
                      ? "bg-red-50 border-red-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {payment.status === "overdue" ? (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Calendar className="w-6 h-6 text-orange-600" />
                    )}
                    <div>
                      <p className="font-medium">{payment.affiliate}</p>
                      <p className="text-sm text-gray-600">
                        Vencimiento: {new Date(payment.dueDate).toLocaleDateString('es-GT')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl text-[#0477BF]">
                        Q{payment.amount.toFixed(2)}
                      </p>
                      <p className={`text-sm ${
                        payment.status === "overdue" ? "text-red-600" : "text-orange-600"
                      }`}>
                        {payment.status === "overdue"
                          ? `Vencido hace ${payment.daysOverdue} día(s)`
                          : `Vence en ${payment.daysUntilDue} día(s)`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#62BF04] hover:bg-[#62BF04]/90 text-white">
                        Registrar Pago
                      </Button>
                      <Button size="sm" variant="outline">
                        Contactar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Reportes */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-[#0477BF] mb-4">Reportes de Pagos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex-col">
                <Download className="w-6 h-6 mb-2" />
                Reporte Mensual de Cobros
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Download className="w-6 h-6 mb-2" />
                Reporte de Pagos Vencidos
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Download className="w-6 h-6 mb-2" />
                Reporte por Método de Pago
              </Button>
              <Button variant="outline" className="h-24 flex-col">
                <Download className="w-6 h-6 mb-2" />
                Proyección de Ingresos
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
