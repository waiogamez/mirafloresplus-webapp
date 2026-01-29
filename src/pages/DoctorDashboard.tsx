import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store/useAuthStore';
import { useAttendedAppointmentsStore } from '../store/useAttendedAppointmentsStore';
import { DoctorAppointmentManagement } from '../components/DoctorAppointmentManagement';
import { Calendar, Users, CheckCircle, Video, Clock, FileText, LogOut, TrendingUp } from 'lucide-react';
import { QuetzalIcon } from '../components/ui/quetzal-icon';
import { toast } from 'sonner@2.0.3';
import { Toaster } from '../components/ui/sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppointmentStore } from '../store/useAppointmentStore';

export function DoctorDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const getTodayAppointments = useAppointmentStore(state => state.getTodayAppointments);
  const todaySchedule = getTodayAppointments();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  // Obtener estadísticas de citas atendidas
  const getTodayAttended = useAttendedAppointmentsStore(state => state.getTodayAttended);
  const todayAttended = getTodayAttended();
  const completedToday = todayAttended.filter(apt => apt.status === 'Completada').length;
  const inProgressCount = todayAttended.filter(apt => apt.status === 'En curso').length;
  const videocallsToday = todayAttended.filter(apt => apt.type === 'Videollamada' && apt.status === 'Completada').length;

  const metrics = [
    { title: 'Consultas Hoy', value: todaySchedule.length, icon: Calendar, color: '#0477BF', action: () => navigate('/appointments') },
    { title: 'Atendidos Hoy', value: completedToday, icon: CheckCircle, color: '#62BF04', action: () => {} },
    { title: 'En Curso', value: inProgressCount, icon: Clock, color: '#F59E0B', action: () => {} },
    { title: 'Videollamadas', value: videocallsToday, icon: Video, color: '#2BB9D9', action: () => navigate('/videocall') },
  ];

  const handleViewSchedule = () => {
    setLoadingAction('schedule');
    setTimeout(() => {
      navigate('/appointments');
      toast.success('Cargando tu agenda del día');
      setLoadingAction(null);
    }, 500);
  };

  const handleStartVideoCall = () => {
    setLoadingAction('video');
    setTimeout(() => {
      navigate('/videocall');
      toast.success('Iniciando videoconsulta');
      setLoadingAction(null);
    }, 500);
  };

  const handleViewPatient = (patientName: string) => {
    toast.info(`Abriendo historial de ${patientName}`);
    navigate('/affiliates');
  };
  
  const handleViewFeesReport = () => {
    navigate('/doctor-fees-report');
    toast.info('Cargando reporte de honorarios');
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
            <h1 className="text-2xl font-bold mb-2">¡Bienvenido, Dr. {user?.firstName}!</h1>
            <p className="text-blue-100">Tus consultas y pacientes de hoy</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#0477BF] hover:bg-[#0366a3]"
            onClick={handleViewSchedule}
            disabled={loadingAction === 'schedule'}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {loadingAction === 'schedule' ? 'Cargando...' : 'Mi Agenda del Día'}
          </Button>
          <Button 
            variant="outline"
            className="border-[#2BB9D9] text-[#2BB9D9] hover:bg-[#2BB9D9]/10"
            onClick={handleStartVideoCall}
            disabled={loadingAction === 'video'}
          >
            <Video className="w-4 h-4 mr-2" />
            {loadingAction === 'video' ? 'Iniciando...' : 'Iniciar Videoconsulta'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/affiliates')}
          >
            <Users className="w-4 h-4 mr-2" />
            Ver Mis Pacientes
          </Button>
          <Button 
            variant="outline"
            className="border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10"
            onClick={handleViewFeesReport}
          >
            <QuetzalIcon className="w-4 h-4 mr-2" />
            Mis Honorarios
          </Button>
        </CardContent>
      </Card>

      {/* Métricas del Día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={idx} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={metric.action}
            >
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
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sistema de Gestión de Citas */}
      <DoctorAppointmentManagement />

      {/* Recordatorios y Notas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📋 Recordatorios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Actualizar recetas</p>
                  <p className="text-yellow-700">3 pacientes pendientes de renovación</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Notificaciones Activas</p>
                  <p className="text-blue-700">Todas las citas notifican a Admin, Recepción y Finanzas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">📊 Resumen Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Consultas este mes</span>
                <span className="font-bold text-[#0477BF]">{todayAttended.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Honorarios acumulados</span>
                <span className="font-bold text-[#62BF04]">
                  Q{todayAttended.filter(a => a.status === 'Completada').reduce((sum, a) => sum + a.fee, 0).toFixed(2)}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={handleViewFeesReport}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Reporte Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}