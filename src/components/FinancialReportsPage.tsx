import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Mail,
  MapPin,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Tipos
interface ReportFilters {
  startDate: string;
  endDate: string;
  branchId: string;
  reportType: string;
}

interface RevenueData {
  month: string;
  consultas: number;
  procedimientos: number;
  membresias: number;
  total: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
}

interface PaymentMethodData {
  method: string;
  count: number;
  total: number;
}

// Datos mock para gráficos
const revenueData: RevenueData[] = [
  { month: "Jul", consultas: 45000, procedimientos: 32000, membresias: 18000, total: 95000 },
  { month: "Ago", consultas: 52000, procedimientos: 38000, membresias: 19500, total: 109500 },
  { month: "Sep", consultas: 48000, procedimientos: 35000, membresias: 21000, total: 104000 },
  { month: "Oct", consultas: 61000, procedimientos: 42000, membresias: 22500, total: 125500 },
  { month: "Nov", consultas: 58000, procedimientos: 45000, membresias: 24000, total: 127000 },
  { month: "Dic", consultas: 64000, procedimientos: 48000, membresias: 25500, total: 137500 },
  { month: "Ene", consultas: 67000, procedimientos: 51000, membresias: 27000, total: 145000 },
];

const expenseData: ExpenseData[] = [
  { category: "Honorarios Médicos", amount: 85000, percentage: 42 },
  { category: "Proveedores", amount: 35000, percentage: 17 },
  { category: "Salarios", amount: 45000, percentage: 22 },
  { category: "Operaciones", amount: 25000, percentage: 12 },
  { category: "Marketing", amount: 14000, percentage: 7 },
];

const paymentMethodData: PaymentMethodData[] = [
  { method: "Efectivo", count: 234, total: 58500 },
  { method: "Tarjeta", count: 456, total: 114000 },
  { method: "Transferencia", count: 189, total: 94500 },
  { method: "Cheque", count: 45, total: 22500 },
];

const COLORS = ["#0477BF", "#2BB9D9", "#9DD973", "#62BF04", "#F59E0B", "#EF4444"];

export function FinancialReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "2025-01-01",
    endDate: "2025-01-28",
    branchId: "all",
    reportType: "general",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Estadísticas generales
  const totalRevenue = 145000;
  const totalExpenses = 204000;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const totalInvoices = 924;
  const paidInvoices = 856;
  const pendingInvoices = 68;
  const collectionRate = ((paidInvoices / totalInvoices) * 100).toFixed(1);

  // Generar reporte
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Reporte generado exitosamente", {
        description: `Datos del ${filters.startDate} al ${filters.endDate}`,
      });
    }, 1500);
  };

  // Exportar reporte
  const handleExport = (format: "excel" | "pdf" | "csv") => {
    toast.success(`Exportando reporte en formato ${format.toUpperCase()}`, {
      description: "La descarga comenzará en breve",
    });
  };

  // Enviar por email
  const handleEmailReport = () => {
    toast.success("Reporte enviado por correo", {
      description: "El reporte ha sido enviado a tu correo electrónico",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-l-4 border-[#0477BF]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl text-[#0477BF] mb-1">
              <FileText className="inline-block w-6 h-6 mr-2 mb-1" />
              Reportes Financieros
            </h2>
            <p className="text-sm text-gray-600">
              Análisis detallado de ingresos, egresos y estadísticas financieras
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("excel")}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailReport}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-gray-600 border-gray-600 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#0477BF]" />
          <h3 className="text-[#0477BF]">Filtros de Reporte</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label>Fecha Inicio</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Fecha Fin</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Sucursal</Label>
            <Select value={filters.branchId} onValueChange={(value) => setFilters({ ...filters, branchId: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Sucursales</SelectItem>
                <SelectItem value="1">Zona 10</SelectItem>
                <SelectItem value="2">Zona 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de Reporte</Label>
            <Select value={filters.reportType} onValueChange={(value) => setFilters({ ...filters, reportType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="revenue">Ingresos</SelectItem>
                <SelectItem value="expenses">Egresos</SelectItem>
                <SelectItem value="profit">Utilidades</SelectItem>
                <SelectItem value="collections">Cobros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGenerateReport}
              className="w-full bg-[#0477BF] hover:bg-[#0369a1]"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generar
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-l-4 border-[#62BF04]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-[#62BF04]">
                Q{totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <p className="text-xs text-green-600">+12.5% vs mes anterior</p>
              </div>
            </div>
            <QuetzalIcon className="w-8 h-8 text-[#62BF04] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Egresos Totales</p>
              <p className="text-2xl font-bold text-red-600">
                Q{totalExpenses.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-red-600" />
                <p className="text-xs text-red-600">+8.2% vs mes anterior</p>
              </div>
            </div>
            <QuetzalIcon className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#0477BF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Utilidad Neta</p>
              <p className="text-2xl font-bold text-[#0477BF]">
                Q{Math.abs(netProfit).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-orange-600" />
                <p className="text-xs text-orange-600">Margen: {profitMargin}%</p>
              </div>
            </div>
            <QuetzalIcon className="w-8 h-8 text-[#0477BF] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Tasa de Cobro</p>
              <p className="text-2xl font-bold text-purple-600">
                {collectionRate}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3 text-purple-600" />
                <p className="text-xs text-purple-600">{paidInvoices}/{totalInvoices} facturas</p>
              </div>
            </div>
            <FileText className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Tabs de Reportes */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ingresos
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <TrendingDown className="w-4 h-4 mr-2" />
            Egresos
          </TabsTrigger>
          <TabsTrigger value="payments">
            <QuetzalIcon className="w-4 h-4 mr-2" />
            Métodos de Pago
          </TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Ingresos Mensuales */}
            <Card className="p-6">
              <h3 className="text-[#0477BF] mb-4">Evolución de Ingresos (Últimos 7 meses)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `Q${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="consultas" fill="#0477BF" name="Consultas" />
                  <Bar dataKey="procedimientos" fill="#2BB9D9" name="Procedimientos" />
                  <Bar dataKey="membresias" fill="#62BF04" name="Membresías" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico de Distribución de Gastos */}
            <Card className="p-6">
              <h3 className="text-[#0477BF] mb-4">Distribución de Gastos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Q${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Tabla de Resumen por Sucursal */}
          <Card className="p-6">
            <h3 className="text-[#0477BF] mb-4">Resumen por Sucursal</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Egresos</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                  <TableHead className="text-right">Facturas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0477BF]" />
                      <span className="font-medium">Zona 10</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    Q87,000
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    Q122,400
                  </TableCell>
                  <TableCell className="text-right text-orange-600 font-medium">
                    -Q35,400
                  </TableCell>
                  <TableCell className="text-right">-40.7%</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-blue-100 text-blue-700">554</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2BB9D9]" />
                      <span className="font-medium">Zona 11</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    Q58,000
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    Q81,600
                  </TableCell>
                  <TableCell className="text-right text-orange-600 font-medium">
                    -Q23,600
                  </TableCell>
                  <TableCell className="text-right">-40.7%</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-blue-100 text-blue-700">370</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right text-green-600">
                    Q145,000
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    Q204,000
                  </TableCell>
                  <TableCell className="text-right text-orange-600">
                    -Q59,000
                  </TableCell>
                  <TableCell className="text-right">-40.7%</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-blue-600 text-white">924</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab: Ingresos */}
        <TabsContent value="revenue" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-[#0477BF] mb-4">Tendencia de Ingresos</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `Q${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line type="monotone" dataKey="consultas" stroke="#0477BF" strokeWidth={2} name="Consultas" />
                <Line type="monotone" dataKey="procedimientos" stroke="#2BB9D9" strokeWidth={2} name="Procedimientos" />
                <Line type="monotone" dataKey="membresias" stroke="#62BF04" strokeWidth={2} name="Membresías" />
                <Line type="monotone" dataKey="total" stroke="#F59E0B" strokeWidth={3} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-[#0477BF] mb-4">Detalle de Ingresos por Categoría</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Promedio</TableHead>
                  <TableHead className="text-right">% del Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Consultas Médicas</TableCell>
                  <TableCell className="text-right">534</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">Q67,000</TableCell>
                  <TableCell className="text-right">Q125</TableCell>
                  <TableCell className="text-right">46.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Procedimientos</TableCell>
                  <TableCell className="text-right">204</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">Q51,000</TableCell>
                  <TableCell className="text-right">Q250</TableCell>
                  <TableCell className="text-right">35.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Membresías</TableCell>
                  <TableCell className="text-right">186</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">Q27,000</TableCell>
                  <TableCell className="text-right">Q145</TableCell>
                  <TableCell className="text-right">18.6%</TableCell>
                </TableRow>
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">924</TableCell>
                  <TableCell className="text-right text-green-600">Q145,000</TableCell>
                  <TableCell className="text-right">Q157</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab: Egresos */}
        <TabsContent value="expenses" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-[#0477BF] mb-4">Detalle de Egresos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">% del Total</TableHead>
                  <TableHead>Tendencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseData.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{expense.category}</TableCell>
                    <TableCell className="text-right">
                      {expense.category === "Honorarios Médicos" ? "24" :
                       expense.category === "Proveedores" ? "12" :
                       expense.category === "Salarios" ? "45" :
                       expense.category === "Operaciones" ? "156" : "8"}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      Q{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${expense.percentage}%` }}
                          ></div>
                        </div>
                        <span>{expense.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {index % 2 === 0 ? (
                        <Badge className="bg-red-100 text-red-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +5.2%
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          -2.8%
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">245</TableCell>
                  <TableCell className="text-right text-red-600">
                    Q204,000
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab: Métodos de Pago */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-[#0477BF] mb-4">Distribución por Método de Pago</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, count }) => `${method} (${count})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Q${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-[#0477BF] mb-4">Estadísticas por Método</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Transacciones</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethodData.map((method, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{method.method}</TableCell>
                      <TableCell className="text-right">{method.count}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        Q{method.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Q{Math.round(method.total / method.count).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {paymentMethodData.reduce((sum, m) => sum + m.count, 0)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      Q{paymentMethodData.reduce((sum, m) => sum + m.total, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      Q{Math.round(
                        paymentMethodData.reduce((sum, m) => sum + m.total, 0) /
                        paymentMethodData.reduce((sum, m) => sum + m.count, 0)
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
