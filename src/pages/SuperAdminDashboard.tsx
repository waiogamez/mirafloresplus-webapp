import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Users, Activity, Shield, Server, Settings, Database, 
  Lock, RefreshCw, AlertTriangle, CheckCircle, Clock, LogOut, Stethoscope
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [refreshing, setRefreshing] = useState(false);

  const metrics = [
    { title: 'Usuarios Totales', value: '2,158', icon: Users, color: '#0477BF', subtitle: '6 roles activos' },
    { title: 'Personal Médico', value: '45', icon: Activity, color: '#62BF04', subtitle: '12 especialidades' },
    { title: 'Salud del Sistema', value: '99.8%', icon: Server, color: '#9DD973', subtitle: 'Uptime este mes' },
    { title: 'Incidentes', value: '2', icon: Shield, color: '#EF4444', subtitle: 'Últimas 24h' },
  ];

  const systemsStatus = [
    { service: 'Base de Datos (AWS RDS)', status: 'Operativo', uptime: '99.9%', response: '12ms', color: 'green' },
    { service: 'API Backend (Node.js)', status: 'Operativo', uptime: '99.8%', response: '45ms', color: 'green' },
    { service: 'Facturación FEL (SAT)', status: 'Operativo', uptime: '99.5%', response: '120ms', color: 'green' },
    { service: 'Videoconsultas (Jitsi)', status: 'Operativo', uptime: '99.7%', response: '85ms', color: 'green' },
    { service: 'Pagos (BAC Credomatic)', status: 'Operativo', uptime: '99.7%', response: '85ms', color: 'green' },
    { service: 'Email (SendGrid)', status: 'Operativo', uptime: '100%', response: '35ms', color: 'green' },
    { service: 'SMS (Twilio)', status: 'Operativo', uptime: '99.9%', response: '50ms', color: 'green' },
  ];

  const recentActivity = [
    { user: 'admin@miraflores.com', action: 'Creó nuevo usuario', time: 'Hace 5 min', type: 'user' },
    { user: 'sistema', action: 'Backup automático completado', time: 'Hace 15 min', type: 'system' },
    { user: 'finanzas@miraflores.com', action: 'Exportó reporte financiero', time: 'Hace 1 hora', type: 'export' },
    { user: 'sistema', action: 'Actualización de seguridad aplicada', time: 'Hace 2 horas', type: 'security' },
  ];

  const handleManageUsers = () => {
    navigate('/admin-permissions');
    toast.success('Cargando gestión de usuarios');
  };
  
  const handleManageDoctors = () => {
    navigate('/doctor-management');
    toast.success('Cargando gestión de médicos');
  };

  const handleManageCatalogs = () => {
    navigate('/catalogs');
    toast.success('Cargando gestión de catálogos');
  };

  const handleSecuritySettings = () => {
    navigate('/security');
    toast.success('Cargando configuración de seguridad');
  };

  const handleSystemSettings = () => {
    navigate('/settings');
    toast.success('Cargando configuración del sistema');
  };

  const handleRefreshSystem = () => {
    setRefreshing(true);
    toast.info('Actualizando estado del sistema...');
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Sistema actualizado correctamente');
    }, 2000);
  };

  const handleViewLogs = () => {
    toast.info('Abriendo logs del sistema');
  };

  const handleBackup = () => {
    toast.success('Iniciando backup manual del sistema...');
    setTimeout(() => {
      toast.success('Backup completado exitosamente');
    }, 3000);
  };

  const handleRestartService = (serviceName: string) => {
    toast.info(`Reiniciando ${serviceName}...`);
    setTimeout(() => {
      toast.success(`${serviceName} reiniciado correctamente`);
    }, 2000);
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
            <p className="text-blue-100">Control total del sistema Miraflores Plus</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>Todos los sistemas operativos</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleString('es-GT')}</span>
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

      {/* Acciones de Administración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0477BF]" />
            Acciones de Administración
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#0477BF] hover:bg-[#0366a3]"
            onClick={handleManageUsers}
          >
            <Users className="w-4 h-4 mr-2" />
            Gestionar Usuarios
          </Button>
          <Button 
            variant="outline"
            className="border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10"
            onClick={handleManageDoctors}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Gestionar Médicos
          </Button>
          <Button 
            variant="outline"
            className="border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10"
            onClick={handleManageCatalogs}
          >
            <Database className="w-4 h-4 mr-2" />
            Gestionar Catálogos
          </Button>
          <Button 
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            onClick={handleSecuritySettings}
          >
            <Lock className="w-4 h-4 mr-2" />
            Seguridad
          </Button>
          <Button 
            variant="outline"
            onClick={handleSystemSettings}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
          <Button 
            variant="outline"
            onClick={handleRefreshSystem}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar Estado'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleBackup}
          >
            <Database className="w-4 h-4 mr-2" />
            Backup Manual
          </Button>
        </CardContent>
      </Card>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
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
                    <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estado de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#0477BF]" />
              Estado de Servicios y Microservicios
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewLogs}
            >
              Ver Logs Completos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemsStatus.map((service, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[#0477BF] transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900">
                      {service.service}
                    </p>
                    {service.color === 'green' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Uptime: {service.uptime}</span>
                    <span>•</span>
                    <span>Respuesta: {service.response}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={service.status === 'Operativo' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRestartService(service.service)}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Reiniciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente y Panel de Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📋 Actividad Reciente del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => {
                const getIcon = () => {
                  switch (activity.type) {
                    case 'user': return <Users className="w-4 h-4 text-[#0477BF]" />;
                    case 'system': return <Server className="w-4 h-4 text-[#62BF04]" />;
                    case 'export': return <Database className="w-4 h-4 text-[#9DD973]" />;
                    case 'security': return <Shield className="w-4 h-4 text-red-600" />;
                    default: return <Activity className="w-4 h-4" />;
                  }
                };

                return (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="mt-0.5">{getIcon()}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">⚙️ Panel de Control Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-sm">Backups Automáticos</p>
                  <p className="text-xs text-gray-600">Último: Hoy 03:00 AM</p>
                </div>
                <Badge className="bg-green-500">Activo</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-semibold text-sm">Certificado SSL</p>
                  <p className="text-xs text-gray-600">Expira: 15 Jun 2025</p>
                </div>
                <Badge className="bg-green-500">Válido</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-semibold text-sm">Actualizaciones</p>
                  <p className="text-xs text-gray-600">2 actualizaciones disponibles</p>
                </div>
                <Button size="sm" variant="outline">
                  Revisar
                </Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <p className="font-semibold text-sm">Uso de Almacenamiento</p>
                  <p className="text-xs text-gray-600">124 GB / 500 GB (24.8%)</p>
                </div>
                <Badge className="bg-purple-500">OK</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📊 Estadísticas de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Usuarios Activos Hoy</p>
              <p className="text-2xl font-bold text-[#0477BF]">1,247</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>+12% vs ayer</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Transacciones Hoy</p>
              <p className="text-2xl font-bold text-[#62BF04]">3,456</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>+8% vs ayer</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">API Calls (24h)</p>
              <p className="text-2xl font-bold text-purple-600">128.5k</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Normal</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">Errores (24h)</p>
              <p className="text-2xl font-bold text-orange-600">23</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                <AlertTriangle className="w-3 h-3" />
                <span>Bajo nivel</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Alertas y Notificaciones del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded border-l-4 border-green-500">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Sistema Saludable</p>
                <p className="text-green-700">Todos los servicios críticos operando correctamente</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Videoconsultas Degradado</p>
                <p className="text-yellow-700">Servicio de Zoom experimentando latencia. Monitorear.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <Server className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Mantenimiento Programado</p>
                <p className="text-blue-700">Actualización de base de datos programada para el 5 de Feb, 2:00 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}