import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { TrendingUp, Users, Activity, Download, FileText, BarChart3, PieChart, LogOut } from 'lucide-react';
import { QuetzalIcon } from '../components/ui/quetzal-icon';
import { toast } from 'sonner@2.0.3';
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
  ResponsiveContainer 
} from 'recharts';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function BoardDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const metrics = [
    { title: 'Ingresos Totales', value: 'Q 1.68M', icon: QuetzalIcon, color: '#62BF04', change: '+15.2%' },
    { title: 'Pacientes Activos', value: '2,158', icon: Users, color: '#0477BF', change: '+8.5%' },
    { title: 'Consultas Realizadas', value: '4,856', icon: Activity, color: '#9DD973', change: '+12.3%' },
    { title: 'Margen de Beneficio', value: '35.8%', icon: TrendingUp, color: '#2BB9D9', change: '+2.1%' },
  ];

  // Datos para gráfico de ingresos
  const revenueData = [
    { mes: 'Jul', ingresos: 245000, gastos: 158000 },
    { mes: 'Ago', ingresos: 268000, gastos: 162000 },
    { mes: 'Sep', ingresos: 252000, gastos: 155000 },
    { mes: 'Oct', ingresos: 278000, gastos: 168000 },
    { mes: 'Nov', ingresos: 295000, gastos: 172000 },
    { mes: 'Dic', ingresos: 312000, gastos: 178000 },
  ];

  // Datos para gráfico de crecimiento
  const growthData = [
    { mes: 'Jul', afiliados: 1850 },
    { mes: 'Ago', afiliados: 1920 },
    { mes: 'Sep', afiliados: 1985 },
    { mes: 'Oct', afiliados: 2040 },
    { mes: 'Nov', afiliados: 2105 },
    { mes: 'Dic', afiliados: 2158 },
  ];

  const kpis = [
    { label: 'Tasa de Retención', value: '94.5%', trend: '+2.1%', status: 'good' },
    { label: 'Satisfacción Pacientes', value: '4.7/5', trend: '+0.3', status: 'good' },
    { label: 'Tiempo Promedio Espera', value: '12 min', trend: '-3 min', status: 'good' },
    { label: 'Cancelaciones', value: '3.2%', trend: '-1.1%', status: 'good' },
  ];

  const handleExportReport = () => {
    toast.success('Generando reporte ejecutivo...');
    setTimeout(() => {
      toast.success('Reporte descargado exitosamente');
    }, 1500);
  };

  const handleViewDetailedReport = (type: string) => {
    toast.info(`Cargando reporte detallado: ${type}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sesión cerrada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida */}
      <div className="bg-gradient-to-r from-[#0477BF] to-[#2BB9D9] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">¡Bienvenido, {user?.firstName}!</h1>
            <p className="text-blue-100">Vista ejecutiva y análisis de rendimiento</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Período: {new Date().toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0477BF]" />
            Reportes y Análisis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#0477BF] hover:bg-[#0366a3]"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte Ejecutivo
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleViewDetailedReport('Financiero')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Análisis Financiero
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleViewDetailedReport('Operativo')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Métricas Operativas
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleViewDetailedReport('Pacientes')}
          >
            <Users className="w-4 h-4 mr-2" />
            Análisis de Pacientes
          </Button>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const isPositive = metric.change.startsWith('+');
          return (
            <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: metric.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <h3 className="text-2xl font-bold" style={{ color: metric.color }}>
                      {metric.value}
                    </h3>
                    <p className={`text-xs font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rendimiento Financiero</span>
              <div className="flex gap-2">
                {['month', 'quarter', 'year'].map((period) => (
                  <Button
                    key={period}
                    size="sm"
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period === 'month' ? 'Mes' : period === 'quarter' ? 'Trimestre' : 'Año'}
                  </Button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `Q ${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#62BF04" name="Ingresos" />
                <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Ingresos Promedio</p>
                <p className="font-bold text-[#62BF04]">Q 275k</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Gastos Promedio</p>
                <p className="font-bold text-red-600">Q 166k</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Utilidad Neta</p>
                <p className="font-bold text-[#0477BF]">Q 109k</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Afiliados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="afiliados" 
                  stroke="#0477BF" 
                  strokeWidth={3}
                  name="Afiliados Activos"
                  dot={{ fill: '#0477BF', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Crecimiento</p>
                <p className="font-bold text-[#62BF04]">+16.6%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Nuevos (mes)</p>
                <p className="font-bold text-[#0477BF]">+53</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Bajas (mes)</p>
                <p className="font-bold text-red-600">-8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs Operativos */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Clave de Desempeño (KPIs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-[#0477BF]">{kpi.value}</p>
                  <Badge className="bg-green-500">{kpi.trend}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📊 Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Ingresos Acumulados (6 meses)</span>
                <span className="font-bold text-[#62BF04]">Q 1,680,000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Gastos Operativos</span>
                <span className="font-bold text-red-600">Q 993,000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">EBITDA</span>
                <span className="font-bold text-[#0477BF]">Q 687,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Margen EBITDA</span>
                <span className="font-bold text-[#2BB9D9]">40.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🎯 Objetivos vs Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Afiliados (Meta: 2,200)</span>
                  <span className="font-semibold">2,158 (98%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0477BF] h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Ingresos (Meta: Q 1.8M)</span>
                  <span className="font-semibold">Q 1.68M (93%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#62BF04] h-2 rounded-full" style={{ width: '93%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Satisfacción (Meta: 4.5/5)</span>
                  <span className="font-semibold">4.7/5 (104%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#62BF04] h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">⚠️ Alertas y Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Crecimiento Sostenido</p>
                <p className="text-green-700">Los afiliados han crecido 8.5% este mes. ¡Excelente trabajo!</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Oportunidad de Expansión</p>
                <p className="text-blue-700">La demanda en Zona 10 ha aumentado. Considere abrir nueva clínica.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
              <QuetzalIcon className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Optimización de Costos</p>
                <p className="text-yellow-700">Los gastos operativos subieron 3%. Revisar proveedores.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}