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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  Clock,
  Mail,
  FileSpreadsheet,
  FileBarChart,
  TrendingUp,
  Users,
  Activity,
  Building,
  Stethoscope,
  DollarSign,
  PieChart,
  BarChart3,
  Eye,
  Plus,
  CheckCircle2,
  Send,
  History,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for report previews
const financialData = [
  { month: "Jul", ingresos: 172000, gastos: 115000 },
  { month: "Ago", ingresos: 168000, gastos: 118000 },
  { month: "Sep", ingresos: 175000, gastos: 120000 },
  { month: "Oct", ingresos: 182000, gastos: 125000 },
];

// Predictive data for next 3 months
const predictiveData = [
  { month: "Oct", ingresos: 182000, gastos: 125000, tipo: "real" },
  { month: "Nov", ingresos: 188000, gastos: 128000, tipo: "proyectado" },
  { month: "Dic", ingresos: 195000, gastos: 132000, tipo: "proyectado" },
  { month: "Ene", ingresos: 201000, gastos: 135000, tipo: "proyectado" },
];

const affiliateData = [
  { tipo: "Premium", cantidad: 542, color: "#0477BF" },
  { tipo: "Basic", cantidad: 458, color: "#2BB9D9" },
  { tipo: "Corporativo", cantidad: 247, color: "#62BF04" },
];

const branchPerformance = [
  { sucursal: "Hospital Miraflores Zona 10", ingresos: 98500, citas: 842, satisfaccion: 4.7 },
  { sucursal: "Hospital Miraflores Roosevelt", ingresos: 75300, citas: 628, satisfaccion: 4.8 },
];

// KPI tracking data
const kpiData = [
  { kpi: "Satisfacción del Paciente", actual: 4.7, objetivo: 4.5, progreso: 104 },
  { kpi: "Tasa de Ocupación", actual: 87, objetivo: 85, progreso: 102 },
  { kpi: "Tiempo Promedio de Espera", actual: 12, objetivo: 15, progreso: 120 }, // lower is better
  { kpi: "NPS (Net Promoter Score)", actual: 68, objetivo: 65, progreso: 105 },
];

// Report templates
const reportTemplates = [
  {
    id: "financial",
    name: "Reporte Financiero Ejecutivo",
    description: "Ingresos, gastos, rentabilidad y flujo de efectivo",
    icon: DollarSign,
    color: "#0477BF",
    category: "Financiero",
  },
  {
    id: "affiliates",
    name: "Reporte de Afiliados y Membresías",
    description: "Análisis de afiliados activos, tipos y crecimiento",
    icon: Users,
    color: "#2BB9D9",
    category: "Operacional",
  },
  {
    id: "operations",
    name: "Reporte Operacional",
    description: "Citas, ocupación, eficiencia y tiempos de espera",
    icon: Activity,
    color: "#62BF04",
    category: "Operacional",
  },
  {
    id: "clinical",
    name: "Reporte Clínico",
    description: "Especialidades, diagnósticos y satisfacción pacientes",
    icon: Stethoscope,
    color: "#9DD973",
    category: "Clínico",
  },
  {
    id: "branches",
    name: "Rendimiento por Sucursal",
    description: "Comparativa de desempeño entre sucursales",
    icon: Building,
    color: "#FFA500",
    category: "Estratégico",
  },
  {
    id: "kpis",
    name: "KPIs y Objetivos Estratégicos",
    description: "Indicadores clave y progreso hacia metas",
    icon: TrendingUp,
    color: "#8B5CF6",
    category: "Estratégico",
  },
  {
    id: "predictive",
    name: "Análisis Predictivo",
    description: "Proyecciones y tendencias para los próximos 3 meses",
    icon: BarChart3,
    color: "#EC4899",
    category: "Estratégico",
  },
];

// Mock generated reports history
const generatedReports = [
  {
    id: 1,
    name: "Reporte Financiero Ejecutivo - Octubre 2025",
    type: "Financiero",
    date: "2025-10-28",
    format: "PDF",
    size: "2.4 MB",
    generatedBy: "Dr. Roberto Méndez",
  },
  {
    id: 2,
    name: "Análisis de Afiliados - Q3 2025",
    type: "Operacional",
    date: "2025-10-15",
    format: "Excel",
    size: "1.8 MB",
    generatedBy: "Admin Sistema",
  },
  {
    id: 3,
    name: "Reporte Operacional - Septiembre 2025",
    type: "Operacional",
    date: "2025-10-01",
    format: "PDF",
    size: "3.1 MB",
    generatedBy: "Lic. María González",
  },
  {
    id: 4,
    name: "KPIs y Objetivos Estratégicos - Q3 2025",
    type: "Estratégico",
    date: "2025-10-20",
    format: "PDF",
    size: "1.9 MB",
    generatedBy: "Dr. Roberto Méndez",
  },
  {
    id: 5,
    name: "Análisis Predictivo - Nov-Ene 2026",
    type: "Estratégico",
    date: "2025-10-25",
    format: "Excel",
    size: "2.1 MB",
    generatedBy: "Admin Sistema",
  },
  {
    id: 6,
    name: "Rendimiento por Sucursal - Octubre 2025",
    type: "Operacional",
    date: "2025-10-18",
    format: "PDF",
    size: "2.7 MB",
    generatedBy: "Lic. María González",
  },
  {
    id: 7,
    name: "Reporte Clínico - Septiembre 2025",
    type: "Clínico",
    date: "2025-10-05",
    format: "Excel",
    size: "3.5 MB",
    generatedBy: "Dr. Carlos Ruiz",
  },
];

export function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["all"]);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: "Reporte Financiero Mensual",
      frequency: "Mensual",
      nextRun: "2025-11-01",
      recipients: "junta@miraflorplus.com",
      active: true,
    },
    {
      id: 2,
      name: "Resumen Semanal Operaciones",
      frequency: "Semanal",
      nextRun: "2025-11-04",
      recipients: "operaciones@miraflorplus.com",
      active: true,
    },
  ]);

  const handleGenerateReport = () => {
    const template = reportTemplates.find((t) => t.id === selectedTemplate);
    const formatLabel = selectedFormat === "pdf" ? "PDF" : selectedFormat === "excel" ? "Excel" : "CSV";
    const fileExtension = selectedFormat === "pdf" ? "pdf" : selectedFormat === "excel" ? "xlsx" : "csv";
    const fileName = `${template?.name.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    
    toast.success(`Generando ${template?.name}...`, {
      description: `Preparando reporte en formato ${formatLabel}`,
      icon: <FileText className="w-5 h-5" />,
    });
    
    // Simulate download with progress
    setTimeout(() => {
      toast.loading("Procesando datos...", {
        description: "Compilando información y generando gráficos",
      });
    }, 500);
    
    setTimeout(() => {
      toast.success("¡Reporte generado exitosamente!", {
        description: `📥 ${fileName}`,
        icon: <CheckCircle2 className="w-5 h-5" />,
        duration: 5000,
      });
    }, 2500);
  };

  const handleSendByEmail = () => {
    const template = reportTemplates.find((t) => t.id === selectedTemplate);
    
    toast.loading("Enviando reporte por correo...", {
      description: "Generando y adjuntando archivo",
      icon: <Mail className="w-5 h-5" />,
    });
    
    setTimeout(() => {
      toast.success("¡Reporte enviado exitosamente!", {
        description: `${template?.name} enviado a junta@miraflorplus.com`,
        icon: <CheckCircle2 className="w-5 h-5" />,
        duration: 5000,
      });
    }, 2000);
  };

  const handleScheduleReport = () => {
    toast.success("Reporte programado exitosamente", {
      description: "Se generará automáticamente según la configuración",
      icon: <Clock className="w-5 h-5" />,
    });
  };

  const handleNewReport = () => {
    // Reset all states for a fresh start
    setSelectedTemplate(null);
    setDateRange({ from: undefined, to: undefined });
    setSelectedBranches(["all"]);
    setSelectedFormat("pdf");
    setShowPreview(false);
    setActiveTab("generate");
    
    toast.success("Nuevo reporte iniciado", {
      description: "Selecciona una plantilla para comenzar",
      icon: <Plus className="w-5 h-5" />,
    });
  };

  const selectedTemplateData = reportTemplates.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#0477BF]">Centro de Reportes Ejecutivos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Genera, programa y gestiona reportes personalizados para la Junta Directiva
          </p>
        </div>
        <Button
          className="text-white"
          style={{ backgroundColor: "#0477BF" }}
          onClick={handleNewReport}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Reporte
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">
            <FileText className="w-4 h-4 mr-2" />
            Generar Reporte
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Clock className="w-4 h-4 mr-2" />
            Reportes Programados
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* Tab: Generate Report */}
        <TabsContent value="generate" className="space-y-6">
          {/* Step 1: Select Report Type */}
          <Card className="p-6 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-[#0477BF] mb-1">Paso 1: Selecciona el Tipo de Reporte</h3>
              <p className="text-sm text-gray-600">Elige una plantilla pre-configurada</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? "border-2 shadow-lg"
                      : "border border-gray-200"
                  }`}
                  style={{
                    borderColor: selectedTemplate === template.id ? template.color : undefined,
                  }}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: template.color }}
                    >
                      <template.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm text-gray-900 leading-tight">{template.name}</h4>
                        {selectedTemplate === template.id && (
                          <CheckCircle2 className="w-5 h-5 text-[#62BF04] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <Badge
                        className="text-xs"
                        style={{ backgroundColor: `${template.color}20`, color: template.color }}
                      >
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Step 2: Configure Filters */}
          {selectedTemplate && (
            <Card className="p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-[#0477BF] mb-1">Paso 2: Configura los Filtros</h3>
                <p className="text-sm text-gray-600">Personaliza el alcance del reporte</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Rango de Fechas</Label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta Semana</SelectItem>
                      <SelectItem value="month">Este Mes</SelectItem>
                      <SelectItem value="quarter">Este Trimestre</SelectItem>
                      <SelectItem value="year">Este Año</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Filter */}
                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las Sucursales</SelectItem>
                      <SelectItem value="zona10">Hospital Miraflores Zona 10</SelectItem>
                      <SelectItem value="roosevelt">Hospital Miraflores Roosevelt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Comparison */}
                <div className="space-y-2">
                  <Label>Comparar con</Label>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin comparación</SelectItem>
                      <SelectItem value="previous">Período anterior</SelectItem>
                      <SelectItem value="year">Año anterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Filters based on report type */}
                {selectedTemplate === "affiliates" && (
                  <div className="space-y-2">
                    <Label>Tipo de Afiliado</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los Tipos</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="corporate">Corporativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTemplate === "clinical" && (
                  <div className="space-y-2">
                    <Label>Especialidad</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las Especialidades</SelectItem>
                        <SelectItem value="cardiology">Cardiología</SelectItem>
                        <SelectItem value="pediatrics">Pediatría</SelectItem>
                        <SelectItem value="general">Medicina General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Step 3: Preview & Export */}
          {selectedTemplate && (
            <Card className="p-6 border border-gray-200">
              <div className="mb-6">
                <h3 className="text-[#0477BF] mb-1">Paso 3: Vista Previa y Exportación</h3>
                <p className="text-sm text-gray-600">Revisa el reporte antes de generar</p>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {selectedTemplateData && (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: selectedTemplateData.color }}
                      >
                        <selectedTemplateData.icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-gray-900">{selectedTemplateData?.name}</h4>
                      <p className="text-sm text-gray-600">
                        Este Mes • Todas las Sucursales • {new Date().toLocaleDateString("es-GT")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-[#0477BF] border-[#0477BF]"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Ocultar" : "Vista Previa"}
                  </Button>
                </div>

                {/* Preview Content */}
                {showPreview && (
                  <div className="bg-white rounded-lg p-6 space-y-6">
                    {/* Financial Report Preview */}
                    {selectedTemplate === "financial" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[#62BF04]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Ingresos Totales</p>
                            <p className="text-[#62BF04]">Q182,000</p>
                            <p className="text-xs text-[#62BF04] mt-1">+9.3% vs anterior</p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Gastos Totales</p>
                            <p className="text-orange-600">Q125,000</p>
                            <p className="text-xs text-orange-600 mt-1">+5.2% vs anterior</p>
                          </div>
                          <div className="bg-[#0477BF]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Ganancia Neta</p>
                            <p className="text-[#0477BF]">Q57,000</p>
                            <p className="text-xs text-[#0477BF] mt-1">31.3% margen</p>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="ingresos" fill="#62BF04" />
                            <Bar dataKey="gastos" fill="#F97316" />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    )}

                    {/* Affiliates Report Preview */}
                    {selectedTemplate === "affiliates" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[#0477BF]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Total Afiliados</p>
                            <p className="text-[#0477BF]">1,247</p>
                            <p className="text-xs text-[#62BF04] mt-1">+12.5% crecimiento</p>
                          </div>
                          <div className="bg-[#2BB9D9]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Nuevos Este Mes</p>
                            <p className="text-[#2BB9D9]">143</p>
                            <p className="text-xs text-gray-600 mt-1">11.5% del total</p>
                          </div>
                          <div className="bg-[#62BF04]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Tasa de Retención</p>
                            <p className="text-[#62BF04]">94.2%</p>
                            <p className="text-xs text-[#62BF04] mt-1">+2.1% vs anterior</p>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <RechartPieChart>
                            <Pie
                              data={affiliateData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="cantidad"
                              label={(entry) => entry.tipo}
                            >
                              {affiliateData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartPieChart>
                        </ResponsiveContainer>
                      </>
                    )}

                    {/* Branches Report Preview */}
                    {selectedTemplate === "branches" && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Sucursal</TableHead>
                              <TableHead className="text-right">Ingresos</TableHead>
                              <TableHead className="text-right">Citas</TableHead>
                              <TableHead className="text-right">Satisfacción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {branchPerformance.map((branch, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-gray-900">{branch.sucursal}</TableCell>
                                <TableCell className="text-right text-[#62BF04]">
                                  Q{branch.ingresos.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">{branch.citas}</TableCell>
                                <TableCell className="text-right">
                                  <Badge className="bg-[#62BF04]/10 text-[#62BF04]">
                                    {branch.satisfaccion} ⭐
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {/* KPIs Report Preview */}
                    {selectedTemplate === "kpis" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {kpiData.map((kpi, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm text-gray-900">{kpi.kpi}</h4>
                                <Badge 
                                  className={
                                    kpi.progreso >= 100 
                                      ? "bg-[#62BF04]/10 text-[#62BF04]" 
                                      : "bg-yellow-100 text-yellow-700"
                                  }
                                >
                                  {kpi.progreso}%
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Actual: <span className="text-[#0477BF]">{kpi.actual}</span></span>
                                <span className="text-gray-600">Objetivo: {kpi.objetivo}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-[#62BF04]"
                                  style={{ width: `${Math.min(kpi.progreso, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Predictive Report Preview */}
                    {selectedTemplate === "predictive" && (
                      <>
                        <div className="bg-[#EC4899]/5 rounded-lg p-4 mb-4 border border-[#EC4899]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-[#EC4899]" />
                            <h4 className="text-sm text-[#EC4899]">Análisis Predictivo - Próximos 3 Meses</h4>
                          </div>
                          <p className="text-xs text-gray-600">
                            Proyecciones basadas en tendencias históricas y patrones estacionales
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-[#62BF04]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Ingresos Proyectados (Nov-Ene)</p>
                            <p className="text-[#62BF04]">Q584,000</p>
                            <p className="text-xs text-[#62BF04] mt-1">+10.4% vs período anterior</p>
                          </div>
                          <div className="bg-[#0477BF]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Crecimiento Esperado</p>
                            <p className="text-[#0477BF]">+3.2%</p>
                            <p className="text-xs text-gray-600 mt-1">Promedio mensual</p>
                          </div>
                          <div className="bg-[#EC4899]/10 rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">Confianza del Modelo</p>
                            <p className="text-[#EC4899]">87%</p>
                            <p className="text-xs text-gray-600 mt-1">Basado en histórico</p>
                          </div>
                        </div>

                        <ResponsiveContainer width="100%" height={240}>
                          <LineChart data={predictiveData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
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
                              dataKey="gastos" 
                              stroke="#F97316" 
                              strokeWidth={2}
                              name="Gastos"
                            />
                          </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                          <p className="text-xs text-yellow-800">
                            <strong>Nota:</strong> Las proyecciones mostradas son estimaciones basadas en datos históricos. 
                            Los resultados reales pueden variar.
                          </p>
                        </div>
                      </>
                    )}

                    {/* Generic preview for other types */}
                    {!["financial", "affiliates", "branches", "kpis", "predictive"].includes(selectedTemplate) && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Vista previa del reporte aparecerá aquí</p>
                        <p className="text-sm">El reporte incluirá gráficos, tablas y métricas detalladas</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Formato de Exportación</Label>
                    <div className="grid grid-cols-3 gap-2">
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
                        <FileBarChart className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Destinatarios de Email (Opcional)</Label>
                    <Input placeholder="ejemplo@miraflorplus.com" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    className="flex-1 text-white"
                    style={{ backgroundColor: "#0477BF" }}
                    onClick={handleGenerateReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generar y Descargar Reporte
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-[#0477BF] border-[#0477BF]"
                    onClick={handleSendByEmail}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Generar y Enviar por Email
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-[#62BF04] border-[#62BF04]">
                        <Clock className="w-4 h-4 mr-2" />
                        Programar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Programar Reporte Automático</DialogTitle>
                        <DialogDescription>
                          Configura la generación automática de este reporte
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Frecuencia</Label>
                          <Select defaultValue="monthly">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diario</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensual</SelectItem>
                              <SelectItem value="quarterly">Trimestral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Día de Envío</Label>
                          <Select defaultValue="1">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Primer día del período</SelectItem>
                              <SelectItem value="last">Último día del período</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Destinatarios</Label>
                          <Input placeholder="emails@miraflorplus.com" />
                        </div>
                        <Button
                          className="w-full text-white"
                          style={{ backgroundColor: "#0477BF" }}
                          onClick={handleScheduleReport}
                        >
                          Programar Reporte
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          )}

          {/* Placeholder when no template selected */}
          {!selectedTemplate && (
            <Card className="p-12 border border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-gray-700 mb-2">Selecciona un Tipo de Reporte</h3>
                <p className="text-sm">
                  Elige una plantilla arriba para comenzar a configurar tu reporte
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Scheduled Reports */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card className="border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-[#0477BF] mb-1">Reportes Programados</h3>
              <p className="text-sm text-gray-600">
                Gestiona la generación automática de reportes
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[#0477BF]">Nombre del Reporte</TableHead>
                    <TableHead className="text-[#0477BF]">Frecuencia</TableHead>
                    <TableHead className="text-[#0477BF]">Próxima Ejecución</TableHead>
                    <TableHead className="text-[#0477BF]">Destinatarios</TableHead>
                    <TableHead className="text-[#0477BF]">Estado</TableHead>
                    <TableHead className="text-[#0477BF]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-900">{report.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#2BB9D9]/10 text-[#2BB9D9]">
                          {report.frequency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(report.nextRun).toLocaleDateString("es-GT")}
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">{report.recipients}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            report.active
                              ? "bg-[#62BF04]/10 text-[#62BF04]"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {report.active ? "Activo" : "Pausado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-[#0477BF]">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            Pausar
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

        {/* Tab: History */}
        <TabsContent value="history" className="space-y-6">
          <Card className="border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-[#0477BF] mb-1">Historial de Reportes Generados</h3>
                <p className="text-sm text-gray-600">Descarga reportes anteriores</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="financial">Financiero</SelectItem>
                    <SelectItem value="operational">Operacional</SelectItem>
                    <SelectItem value="strategic">Estratégico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[#0477BF]">Nombre del Reporte</TableHead>
                    <TableHead className="text-[#0477BF]">Tipo</TableHead>
                    <TableHead className="text-[#0477BF]">Fecha de Generación</TableHead>
                    <TableHead className="text-[#0477BF]">Formato</TableHead>
                    <TableHead className="text-[#0477BF]">Tamaño</TableHead>
                    <TableHead className="text-[#0477BF]">Generado por</TableHead>
                    <TableHead className="text-[#0477BF]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-900">{report.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#0477BF]/10 text-[#0477BF]">{report.type}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(report.date).toLocaleDateString("es-GT")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.format === "PDF" ? (
                            <FileText className="w-4 h-4 text-red-500" />
                          ) : (
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-gray-700">{report.format}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">{report.size}</TableCell>
                      <TableCell className="text-gray-700 text-sm">{report.generatedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#0477BF]"
                            onClick={() => {
                              toast.success("Descargando reporte...", {
                                description: report.name,
                              });
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#2BB9D9]"
                            onClick={() => {
                              toast.success("Compartiendo reporte...", {
                                description: "Enviando por email",
                              });
                            }}
                          >
                            <Send className="w-4 h-4" />
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
      </Tabs>
    </div>
  );
}
