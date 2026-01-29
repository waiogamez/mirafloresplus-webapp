import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MetricCard } from "./MetricCard";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Download
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import { useState } from "react";
import { NewReceiptModal } from "./NewReceiptModal";

const pendingInvoices = [
  { id: "INV-1234", provider: "Laboratorio Central", amount: 15420.00, dueDate: "2024-11-05", status: "pending" },
  { id: "INV-1235", provider: "Farmacia Vida", amount: 8350.50, dueDate: "2024-11-06", status: "pending" },
  { id: "INV-1236", provider: "Radiología Moderna", amount: 22100.00, dueDate: "2024-11-07", status: "urgent" },
  { id: "INV-1237", provider: "Proveedor Médico GT", amount: 5890.00, dueDate: "2024-11-08", status: "pending" },
];

const monthlyRevenue = [
  { month: "May", ingresos: 198500, egresos: 145200 },
  { month: "Jun", ingresos: 215300, egresos: 156800 },
  { month: "Jul", ingresos: 232100, egresos: 168400 },
  { month: "Ago", ingresos: 245600, egresos: 175900 },
  { month: "Sep", ingresos: 258900, egresos: 182300 },
  { month: "Oct", ingresos: 271500, egresos: 189700 },
];

const paymentMethods = [
  { name: "Transferencia", value: 45, fill: "#0477BF" },
  { name: "Tarjeta", value: 35, fill: "#2BB9D9" },
  { name: "Efectivo", value: 15, fill: "#62BF04" },
  { name: "Otros", value: 5, fill: "#9DD973" },
];

const expensesByCategory = [
  { category: "Proveedores", amount: 125400, fill: "#0477BF" },
  { category: "Salarios", amount: 89300, fill: "#2BB9D9" },
  { category: "Infraestructura", amount: 45200, fill: "#62BF04" },
  { category: "Marketing", amount: 23100, fill: "#9DD973" },
  { category: "Otros", amount: 12800, fill: "#F97316" },
];

export function FinanceDashboard() {
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExportReports = () => {
    toast.success("Exportando reportes financieros...", {
      description: "El archivo se descargará en unos momentos"
    });
    // Simular descarga de reporte
    setTimeout(() => {
      toast.success("Reporte exportado exitosamente");
    }, 1500);
  };

  const handleNewReceipt = () => {
    toast.info("Abriendo formulario de nuevo comprobante...");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF] mb-2">Panel de Finanzas</h1>
          <p className="text-gray-600">
            Gestión financiera y control de pagos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportReports}>
            <Download className="w-4 h-4" />
            Exportar Reportes
          </Button>
          <Button className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white flex items-center gap-2" onClick={handleNewReceipt}>
            <FileText className="w-4 h-4" />
            Nuevo Comprobante
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ingresos del Mes"
          value="Q271,500"
          change="+4.8%"
          changeType="positive"
          icon={TrendingUp}
          color="#62BF04"
        />
        <MetricCard
          title="Egresos del Mes"
          value="Q189,700"
          change="+3.2%"
          changeType="positive"
          icon={TrendingDown}
          color="#F97316"
        />
        <MetricCard
          title="Balance Neto"
          value="Q81,800"
          change="+8.5%"
          changeType="positive"
          icon={QuetzalIcon}
          color="#0477BF"
        />
        <MetricCard
          title="Pendientes Aprobación"
          value="14"
          change="-12.5%"
          changeType="negative"
          icon={Clock}
          color="#2BB9D9"
        />
      </div>

      {/* Alertas de Facturas Urgentes */}
      {pendingInvoices.some(inv => inv.status === "urgent") && (
        <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-900 mb-1">Facturas Urgentes Pendientes de Aprobación</h3>
              <p className="text-sm text-red-700">
                {pendingInvoices.filter(inv => inv.status === "urgent").length} factura(s) requieren aprobación inmediata para evitar retrasos en pagos.
              </p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Revisar Ahora
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Facturas Pendientes */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0477BF] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Facturas Pendientes de Aprobación
            </h3>
            <Badge className="bg-orange-500 text-white">
              Q{totalPending.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.provider}</TableCell>
                    <TableCell className="text-[#0477BF]">
                      Q{invoice.amount.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString('es-GT')}</TableCell>
                    <TableCell>
                      {invoice.status === "urgent" ? (
                        <Badge className="bg-red-500 text-white">Urgente</Badge>
                      ) : (
                        <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Resumen Financiero */}
        <Card className="p-6">
          <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
            <Banknote className="w-5 h-5" />
            Resumen Octubre 2024
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Ingresos</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl text-green-700">Q271,500</div>
              <div className="text-sm text-green-600 mt-1">+4.8% vs mes anterior</div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Egresos</span>
                <TrendingDown className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl text-orange-700">Q189,700</div>
              <div className="text-sm text-orange-600 mt-1">+3.2% vs mes anterior</div>
            </div>

            <div className="bg-gradient-to-r from-[#0477BF]/10 to-[#2BB9D9]/10 p-4 rounded-lg border border-[#0477BF]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Balance Neto</span>
                <CheckCircle className="w-5 h-5 text-[#0477BF]" />
              </div>
              <div className="text-2xl text-[#0477BF]">Q81,800</div>
              <div className="text-sm text-[#0477BF] mt-1">Margen: 30.1%</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Afiliados activos:</span>
                  <span className="font-medium">2,586</span>
                </div>
                <div className="flex justify-between">
                  <span>Ingreso promedio/afiliado:</span>
                  <span className="font-medium">Q105.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa de cobro:</span>
                  <span className="font-medium text-green-600">96.8%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de Ingresos y Egresos */}
        <Card className="p-6">
          <h3 className="text-[#0477BF] mb-4">Tendencia Financiera (6 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `Q${value.toLocaleString('es-GT')}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#62BF04"
                strokeWidth={2}
                name="Ingresos"
              />
              <Line
                type="monotone"
                dataKey="egresos"
                stroke="#F97316"
                strokeWidth={2}
                name="Egresos"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Métodos de Pago */}
        <Card className="p-6">
          <h3 className="text-[#0477BF] mb-4">Distribución por Método de Pago</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Egresos por Categoría */}
      <Card className="p-6">
        <h3 className="text-[#0477BF] mb-4">Egresos por Categoría (Octubre)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `Q${value.toLocaleString('es-GT')}`}
            />
            <Bar dataKey="amount" fill="#0477BF" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Modal para Nuevo Comprobante */}
      <NewReceiptModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}