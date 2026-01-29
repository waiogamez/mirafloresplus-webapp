import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
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
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Video,
  FileText,
  Clock,
  CheckCircle,
  Download,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Search,
  AlertCircle,
  Shield,
  Send,
  Eye,
  FileSpreadsheet,
  ExternalLink,
  Mail
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import { toast } from "sonner@2.0.3";

// Revenue vs Expenses Data (Comparativo Mensual)
const revenueVsExpensesData = [
  { month: "Ene", revenue: 145000, expenses: 98000, profit: 47000 },
  { month: "Feb", revenue: 152000, expenses: 102000, profit: 50000 },
  { month: "Mar", revenue: 148000, expenses: 105000, profit: 43000 },
  { month: "Abr", revenue: 161000, expenses: 108000, profit: 53000 },
  { month: "May", revenue: 155000, expenses: 110000, profit: 45000 },
  { month: "Jun", revenue: 167000, expenses: 112000, profit: 55000 },
  { month: "Jul", revenue: 172000, expenses: 115000, profit: 57000 },
  { month: "Ago", revenue: 168000, expenses: 118000, profit: 50000 },
  { month: "Sep", revenue: 175000, expenses: 120000, profit: 55000 },
  { month: "Oct", revenue: 182000, expenses: 125000, profit: 57000 },
];

// Expense Category Breakdown
const expenseCategoryData = [
  { name: "Servicios Médicos", value: 45000, color: "#0477BF" },
  { name: "Laboratorios", value: 28000, color: "#2BB9D9" },
  { name: "Nómina", value: 32000, color: "#62BF04" },
  { name: "Suministros", value: 12000, color: "#9DD973" },
  { name: "Marketing", value: 5500, color: "#FFA500" },
  { name: "Otros", value: 2500, color: "#94A3B8" },
];

// Detailed Financial Transactions
const financialTransactions = [
  {
    id: 1,
    date: "2025-10-16",
    type: "Ingreso",
    category: "Consultas Médicas",
    description: "Ingresos por Consultas - Octubre S1",
    amount: 28500,
  },
  {
    id: 2,
    date: "2025-10-16",
    type: "Gasto",
    category: "Nómina",
    description: "Pago de Nómina - Personal Médico",
    amount: -45000,
  },
  {
    id: 3,
    date: "2025-10-15",
    type: "Ingreso",
    category: "Membresías",
    description: "Membresías Mensuales - Premium",
    amount: 52000,
  },
  {
    id: 4,
    date: "2025-10-15",
    type: "Gasto",
    category: "Mantenimiento",
    description: "Mantenimiento de Equipos Médicos",
    amount: -8500,
  },
  {
    id: 5,
    date: "2025-10-14",
    type: "Ingreso",
    category: "Laboratorio",
    description: "Servicios de Laboratorio",
    amount: 15200,
  },
  {
    id: 6,
    date: "2025-10-14",
    type: "Gasto",
    category: "Suministros",
    description: "Suministros Médicos",
    amount: -12000,
  },
  {
    id: 7,
    date: "2025-10-13",
    type: "Ingreso",
    category: "Teleconsultas",
    description: "Teleconsultas - Octubre",
    amount: 9800,
  },
  {
    id: 8,
    date: "2025-10-13",
    type: "Gasto",
    category: "Servicios",
    description: "Servicios Públicos y Alquiler",
    amount: -18000,
  },
  {
    id: 9,
    date: "2025-10-12",
    type: "Ingreso",
    category: "Cirugías",
    description: "Cirugías Programadas",
    amount: 35000,
  },
  {
    id: 10,
    date: "2025-10-12",
    type: "Gasto",
    category: "Capacitación",
    description: "Capacitación del Personal",
    amount: -5000,
  },
  {
    id: 11,
    date: "2025-10-11",
    type: "Ingreso",
    category: "Afiliaciones",
    description: "Nuevas Afiliaciones Corporativas",
    amount: 42000,
  },
  {
    id: 12,
    date: "2025-10-10",
    type: "Gasto",
    category: "Marketing",
    description: "Campaña Digital Octubre",
    amount: -5500,
  },
];

export function BoardDashboardPage() {
  const [period, setPeriod] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [emailRecipient, setEmailRecipient] = useState("");

  const handleGenerateReport = () => {
    setShowReportDialog(true);
  };

  const handleDownloadReport = () => {
    const formatLabel = selectedFormat === "pdf" ? "PDF" : selectedFormat === "excel" ? "Excel" : "CSV";
    
    toast.success(`Generando reporte en ${formatLabel}...`, {
      description: "La descarga comenzará en unos momentos",
      icon: <Download className="w-5 h-5" />,
    });
    
    setTimeout(() => {
      toast.success("¡Reporte descargado exitosamente!", {
        description: `Reporte_Financiero_Ejecutivo_${new Date().toISOString().split('T')[0]}.${selectedFormat}`,
        icon: <CheckCircle className="w-5 h-5" />,
      });
      setShowReportDialog(false);
    }, 2000);
  };

  const handleShareReport = () => {
    if (!emailRecipient) {
      toast.error("Email requerido", {
        description: "Por favor ingresa un email de destinatario",
      });
      return;
    }
    
    toast.success("Enviando reporte por email...", {
      description: `Enviando a ${emailRecipient}`,
      icon: <Send className="w-5 h-5" />,
    });
    
    setTimeout(() => {
      toast.success("¡Reporte enviado exitosamente!", {
        description: `Email enviado a ${emailRecipient}`,
        icon: <CheckCircle className="w-5 h-5" />,
      });
      setShowReportDialog(false);
      setEmailRecipient("");
    }, 2000);
  };

  const handleExportCSV = () => {
    toast.success("Exportando datos...", {
      description: "El archivo CSV está siendo generado",
      icon: <Download className="w-5 h-5" />,
    });
  };

  // Calculate financial metrics
  const totalRevenue = financialTransactions
    .filter((t) => t.type === "Ingreso")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    financialTransactions
      .filter((t) => t.type === "Gasto")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netProfit = totalRevenue - totalExpenses;
  const activeAffiliates = 1247;
  const outstandingPayables = 15400;
  const invoicesGenerated = 342;

  // Calculate KPIs
  const ebitdaMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
  const liquidityRatio = 2.4; // Mock data
  const avgRevenuePerAffiliate = (totalRevenue / activeAffiliates).toFixed(0);
  const expenseEfficiency = ((totalExpenses / totalRevenue) * 100).toFixed(1);
  const billingGrowthRate = 9.3; // Mock data

  // Calculate running balance for table
  let runningBalance = 0;
  const transactionsWithBalance = financialTransactions.map((item) => {
    runningBalance += item.amount;
    return { ...item, balance: runningBalance };
  });

  // Filter transactions
  const filteredTransactions =
    categoryFilter === "all"
      ? transactionsWithBalance
      : transactionsWithBalance.filter((t) => t.category === categoryFilter);

  return (
    <div className="space-y-6 pb-16">
      {/* Header with Period Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#0477BF]">Resumen Financiero Ejecutivo</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vista global del desempeño financiero de Miraflores Plus
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateReport}
            className="text-white"
            style={{ backgroundColor: "#0477BF" }}
          >
            <Download className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Section 1: Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#62BF04]/5 to-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#62BF04" }}
            >
              <QuetzalIcon className="w-5 h-5 text-white" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#62BF04]" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Ingresos Totales</p>
          <p className="text-[#62BF04] mb-1">Q{totalRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#62BF04]" />
            <span className="text-xs text-[#62BF04]">+9.3%</span>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <ArrowDownRight className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Gastos Totales</p>
          <p className="text-orange-600 mb-1">Q{totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-orange-500">+5.2%</span>
          </div>
        </Card>

        {/* Net Profit/Loss */}
        <Card
          className={`p-4 border border-gray-200 bg-gradient-to-br ${
            netProfit >= 0 ? "from-[#0477BF]/5" : "from-red-50"
          } to-white hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                netProfit >= 0 ? "bg-[#0477BF]" : "bg-red-500"
              }`}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            {netProfit >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-[#0477BF]" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 mb-1">
            {netProfit >= 0 ? "Ganancia Neta" : "Pérdida Neta"}
          </p>
          <p
            className={`${netProfit >= 0 ? "text-[#0477BF]" : "text-red-600"} mb-1`}
          >
            Q{Math.abs(netProfit).toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              {ebitdaMargin}% margen
            </span>
          </div>
        </Card>

        {/* Active Affiliates */}
        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#2BB9D9]/5 to-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2BB9D9" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <Shield className="w-4 h-4 text-[#2BB9D9]" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Afiliados Activos</p>
          <p className="text-[#2BB9D9] mb-1">{activeAffiliates.toLocaleString()}</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#62BF04]" />
            <span className="text-xs text-[#62BF04]">+12.5%</span>
          </div>
        </Card>

        {/* Outstanding Payables */}
        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-yellow-50 to-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <Calendar className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Cuentas por Pagar</p>
          <p className="text-yellow-600 mb-1">
            Q{outstandingPayables.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">24 pendientes</span>
          </div>
        </Card>

        {/* Invoices Generated (FEL) */}
        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#9DD973]/10 to-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#9DD973" }}
            >
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <FileText className="w-4 h-4 text-[#62BF04]" />
          </div>
          <p className="text-xs text-gray-500 mb-1">Facturas FEL</p>
          <p className="text-[#62BF04] mb-1">{invoicesGenerated}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Este mes</span>
          </div>
        </Card>
      </div>

      {/* Section 2 & 3: Revenue vs Expenses + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart (2 columns) */}
        <Card className="p-6 border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#0477BF] mb-1">Ingresos vs Gastos</h3>
              <p className="text-sm text-gray-600">
                Comparativa mensual de flujo de efectivo
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#0477BF]" />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={revenueVsExpensesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickFormatter={(value) => `Q${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`Q${value.toLocaleString()}`, ""]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    revenue: "Ingresos",
                    expenses: "Gastos",
                    profit: "Ganancia",
                  };
                  return labels[value] || value;
                }}
              />
              <Bar dataKey="revenue" fill="#62BF04" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#F97316" radius={[8, 8, 0, 0]} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#0477BF"
                strokeWidth={3}
                dot={{ fill: "#0477BF", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown - Pie Chart (1 column) */}
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[#0477BF] mb-1">Gastos por Categoría</h3>
              <p className="text-sm text-gray-600">Distribución de costos</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-[#0477BF]" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`Q${value.toLocaleString()}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {expenseCategoryData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-gray-700 text-xs">{entry.name}</span>
                </div>
                <span className="text-gray-900 text-xs">
                  Q{entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 4: Profitability Indicators */}
      <Card className="p-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-[#0477BF] mb-1">Indicadores de Rentabilidad</h3>
          <p className="text-sm text-gray-600">
            KPIs financieros y métricas de desempeño
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* EBITDA Margin */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#0477BF" }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Margen EBITDA</p>
                <p className="text-[#0477BF]">{ebitdaMargin}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${ebitdaMargin}%`,
                  backgroundColor: "#0477BF",
                }}
              ></div>
            </div>
          </div>

          {/* Liquidity Ratio */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#2BB9D9" }}
              >
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ratio de Liquidez</p>
                <p className="text-[#2BB9D9]">{liquidityRatio.toFixed(1)}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${(liquidityRatio / 3) * 100}%`,
                  backgroundColor: "#2BB9D9",
                }}
              ></div>
            </div>
          </div>

          {/* Average Revenue per Affiliate */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#62BF04" }}
              >
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ingreso Promedio</p>
                <p className="text-[#62BF04]">Q{avgRevenuePerAffiliate}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Por afiliado</p>
          </div>

          {/* Expense Efficiency */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Eficiencia Gastos</p>
                <p className="text-orange-600">{expenseEfficiency}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full bg-orange-500"
                style={{ width: `${expenseEfficiency}%` }}
              ></div>
            </div>
          </div>

          {/* Billing Growth Rate */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#9DD973" }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Crecimiento</p>
                <p className="text-[#62BF04]">+{billingGrowthRate}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">MoM facturación</p>
          </div>
        </div>
      </Card>

      {/* Section 5: Detailed Financial Table */}
      <Card className="border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[#0477BF] mb-1">Detalle de Transacciones</h3>
            <p className="text-sm text-gray-600">
              Historial completo de ingresos y gastos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Consultas Médicas">Consultas</SelectItem>
                <SelectItem value="Membresías">Membresías</SelectItem>
                <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                <SelectItem value="Nómina">Nómina</SelectItem>
                <SelectItem value="Suministros">Suministros</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="text-[#0477BF] border-[#0477BF]"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">Fecha</TableHead>
                <TableHead className="text-[#0477BF]">Tipo</TableHead>
                <TableHead className="text-[#0477BF]">Categoría</TableHead>
                <TableHead className="text-[#0477BF]">Descripción</TableHead>
                <TableHead className="text-[#0477BF] text-right">Monto</TableHead>
                <TableHead className="text-[#0477BF] text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-900 text-sm">
                    {new Date(item.date).toLocaleDateString("es-GT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.type === "Ingreso"
                          ? "bg-[#62BF04]/10 text-[#62BF04] hover:bg-[#62BF04]/20"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      }
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm">
                    {item.category}
                  </TableCell>
                  <TableCell className="text-gray-900 text-sm">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.amount > 0 ? "text-[#62BF04]" : "text-orange-600"
                      }
                    >
                      {item.amount > 0 ? "+" : ""}Q
                      {Math.abs(item.amount).toLocaleString("es-GT")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.balance >= 0 ? "text-[#0477BF]" : "text-red-600"
                      }
                    >
                      Q{item.balance.toLocaleString("es-GT")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Section 6: Report & Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Cards */}
        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-[#0477BF]/5 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#0477BF" }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-[#0477BF]">Top 3 Fuentes de Ingreso</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Membresías Premium</span>
              <span className="text-[#62BF04]">Q52,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Afiliaciones Corp.</span>
              <span className="text-[#62BF04]">Q42,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Cirugías</span>
              <span className="text-[#62BF04]">Q35,000</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-orange-600">Categorías de Mayor Costo</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Nómina Personal</span>
              <span className="text-orange-600">Q45,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Servicios Públicos</span>
              <span className="text-orange-600">Q18,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Suministros</span>
              <span className="text-orange-600">Q12,000</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-[#2BB9D9]/5 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2BB9D9" }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-[#2BB9D9]">Proyección Próximo Trimestre</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Ingresos Esperados</span>
              <span className="text-[#62BF04]">Q520,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Gastos Proyectados</span>
              <span className="text-orange-600">Q345,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Ganancia Estimada</span>
              <span className="text-[#0477BF]">Q175,000</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={handleGenerateReport}
          size="lg"
          className="text-white w-full sm:w-auto"
          style={{ backgroundColor: "#0477BF" }}
        >
          <FileText className="w-5 h-5 mr-2" />
          Generar Reporte Ejecutivo (PDF)
        </Button>
        <Button
          onClick={handleShareReport}
          variant="outline"
          size="lg"
          className="text-[#0477BF] border-[#0477BF] w-full sm:w-auto hover:bg-[#0477BF]/10"
        >
          <Mail className="w-5 h-5 mr-2" />
          Compartir Resumen por Email
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Miraflores Plus – Financial Intelligence Module (v1.0)
        </p>
      </div>

      {/* Report Generation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generar Reporte Ejecutivo
            </DialogTitle>
            <DialogDescription>
              Vista previa y opciones de exportación del reporte financiero actual
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </TabsTrigger>
            </TabsList>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4 mt-4">
              <Card className="p-6 bg-gray-50">
                {/* Report Header */}
                <div className="text-center mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-[#0477BF] mb-2">MIRAFLORES PLUS</h2>
                  <p className="text-sm text-gray-600">Reporte Financiero Ejecutivo</p>
                  <p className="text-sm text-gray-500">
                    Período: {period === "month" ? "Octubre 2025" : period === "quarter" ? "Q3 2025" : "2025"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Generado el {new Date().toLocaleDateString("es-GT", { 
                      day: "2-digit", 
                      month: "long", 
                      year: "numeric" 
                    })}
                  </p>
                </div>

                {/* Summary Metrics */}
                <div className="mb-6">
                  <h3 className="text-sm text-[#0477BF] mb-3">Resumen Ejecutivo</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Ingresos Totales</p>
                      <p className="text-[#62BF04]">Q{totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-[#62BF04] mt-1">+9.3%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Gastos Totales</p>
                      <p className="text-orange-600">Q{totalExpenses.toLocaleString()}</p>
                      <p className="text-xs text-orange-600 mt-1">+5.2%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Ganancia Neta</p>
                      <p className="text-[#0477BF]">Q{netProfit.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">{ebitdaMargin}% margen</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Afiliados Activos</p>
                      <p className="text-[#2BB9D9]">{activeAffiliates.toLocaleString()}</p>
                      <p className="text-xs text-[#62BF04] mt-1">+12.5%</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* KPIs */}
                <div className="mb-6">
                  <h3 className="text-sm text-[#0477BF] mb-3">Indicadores Clave de Rendimiento</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500">Margen EBITDA</p>
                      <p className="text-[#0477BF]">{ebitdaMargin}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500">Ratio de Liquidez</p>
                      <p className="text-[#2BB9D9]">{liquidityRatio.toFixed(1)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500">Ingreso Promedio/Afiliado</p>
                      <p className="text-[#62BF04]">Q{avgRevenuePerAffiliate}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500">Eficiencia de Gastos</p>
                      <p className="text-orange-600">{expenseEfficiency}%</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Top Categories */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-[#0477BF] mb-3">Top Fuentes de Ingreso</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-700">Membresías Premium</span>
                        <span className="text-[#62BF04]">Q52,000</span>
                      </div>
                      <div className="flex justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-700">Afiliaciones Corp.</span>
                        <span className="text-[#62BF04]">Q42,000</span>
                      </div>
                      <div className="flex justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-700">Cirugías</span>
                        <span className="text-[#62BF04]">Q35,000</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-[#0477BF] mb-3">Mayor Costo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-700">Nómina Personal</span>
                        <span className="text-orange-600">Q45,000</span>
                      </div>
                      <div className="flex justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-700">Servicios Públicos</span>
                        <span className="text-orange-600">Q18,000</span>
                      </div>
                      <div className="flex justify-between text-xs bg-white p-2 rounded border border-gray-200">
                        <span className="text-gray-700">Suministros</span>
                        <span className="text-orange-600">Q12,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-400">
                    Este reporte es confidencial • Miraflores Plus © 2025
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6 mt-4">
              <Card className="p-6">
                <h3 className="text-[#0477BF] mb-4">Opciones de Exportación</h3>
                
                <div className="space-y-6">
                  {/* Format Selection */}
                  <div className="space-y-3">
                    <Label>Formato de Exportación</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={selectedFormat === "pdf" ? "default" : "outline"}
                        className={selectedFormat === "pdf" ? "text-white" : ""}
                        style={selectedFormat === "pdf" ? { backgroundColor: "#0477BF" } : {}}
                        onClick={() => setSelectedFormat("pdf")}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant={selectedFormat === "excel" ? "default" : "outline"}
                        className={selectedFormat === "excel" ? "text-white" : ""}
                        style={selectedFormat === "excel" ? { backgroundColor: "#0477BF" } : {}}
                        onClick={() => setSelectedFormat("excel")}
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                      <Button
                        variant={selectedFormat === "csv" ? "default" : "outline"}
                        className={selectedFormat === "csv" ? "text-white" : ""}
                        style={selectedFormat === "csv" ? { backgroundColor: "#0477BF" } : {}}
                        onClick={() => setSelectedFormat("csv")}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Email Option */}
                  <div className="space-y-3">
                    <Label htmlFor="email-recipient">Enviar por Email (Opcional)</Label>
                    <div className="flex gap-3">
                      <Input
                        id="email-recipient"
                        type="email"
                        placeholder="destinatario@miraflorplus.com"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleShareReport}
                        disabled={!emailRecipient}
                        className="text-white"
                        style={{ backgroundColor: "#2BB9D9" }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      El reporte será enviado al email especificado con la configuración actual
                    </p>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleDownloadReport}
                      className="flex-1 text-white"
                      style={{ backgroundColor: "#0477BF" }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Reporte ({selectedFormat.toUpperCase()})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowReportDialog(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>

                  {/* Link to Full Reports Page */}
                  <div className="bg-[#0477BF]/5 rounded-lg p-4 border border-[#0477BF]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#0477BF" }}>
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm text-[#0477BF] mb-1">¿Necesitas más opciones?</h4>
                        <p className="text-xs text-gray-600 mb-3">
                          Visita el Centro de Reportes completo para crear reportes personalizados,
                          programar envíos automáticos y acceder al historial completo.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#0477BF] border-[#0477BF]"
                          onClick={() => {
                            setShowReportDialog(false);
                            // This would navigate to reports page in a real app
                            toast.info("Navegando al Centro de Reportes...");
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ir al Centro de Reportes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}