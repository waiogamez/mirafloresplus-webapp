import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { Calendar, Users, CheckCircle, UserPlus, Clock, Phone, LogOut } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AddAppointmentDialog } from '../components/AddAppointmentDialog';
import { AddAffiliateDialog } from '../components/AddAffiliateDialog';

export function ReceptionDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const getTodayAppointments = useAppointmentStore(state => state.getTodayAppointments);
  const todaySchedule = getTodayAppointments();
  
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showAffiliateDialog, setShowAffiliateDialog] = useState(false);

  const metrics = [
    { title: 'Citas Hoy', value: todaySchedule.length, icon: Calendar, color: '#0477BF' },
    { title: 'En Sala de Espera', value: 3, icon: Users, color: '#F59E0B' },
    { title: 'Atendidas', value: 12, icon: CheckCircle, color: '#62BF04' },
    { title: 'Nuevos Afiliados', value: 3, icon: UserPlus, color: '#9DD973' },
  ];

  const handleNewAppointment = () => {
    setShowAppointmentDialog(true);
  };

  const handleNewAffiliate = () => {
    setShowAffiliateDialog(true);
  };

  const handleViewAllAppointments = () => {
    navigate('/appointments');
    toast.success('Cargando lista de citas');
  };

  const handleViewAllAffiliates = () => {
    navigate('/affiliates');
    toast.success('Cargando lista de afiliados');
  };

  const handleCallPatient = (patientName: string, phone: string) => {
    toast.info(`Llamando a ${patientName} al ${phone}`);
    // Aquí se integraría con un sistema de telefonía
  };

  const handleCheckIn = (patientName: string) => {
    toast.success(`${patientName} ha sido registrado en sala de espera`);
    // Aquí se actualizaría el estado de la cita
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
            <h1 className="text-2xl font-bold mb-2">¡Bienvenida, {user?.firstName}!</h1>
            <p className="text-blue-100">Gestión de citas y atención al paciente</p>
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
            <Calendar className="w-5 h-5 text-[#0477BF]" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#0477BF] hover:bg-[#0366a3]"
            onClick={handleNewAppointment}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Nueva Cita
          </Button>
          <Button 
            variant="outline"
            className="border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10"
            onClick={handleNewAffiliate}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nueva Afiliación
          </Button>
          <Button 
            variant="outline"
            onClick={handleViewAllAffiliates}
          >
            <Users className="w-4 h-4 mr-2" />
            Ver Todos los Afiliados
          </Button>
        </CardContent>
      </Card>

      {/* Métricas del Día */}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Citas del Día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0477BF]" />
              Citas del Día ({todaySchedule.length})
            </span>
            {todaySchedule.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllAppointments}
              >
                Ver Todas las Citas
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaySchedule.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold mb-2">No hay citas programadas para hoy</p>
              <Button 
                className="mt-4 bg-[#0477BF]"
                onClick={handleNewAppointment}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Primera Cita
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.slice(0, 6).map(apt => (
                <div 
                  key={apt.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[#0477BF] transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {apt.time}
                      </Badge>
                      <p className="font-semibold text-gray-900">
                        {apt.patientName}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Dr. {apt.doctorName}
                      {apt.reason && ` • ${apt.reason}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={apt.status === 'Confirmada' ? 'default' : 'secondary'}>
                      {apt.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCallPatient(apt.patientName, '+502 5555-1234')}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Llamar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#62BF04] hover:bg-[#52a003] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCheckIn(apt.patientName)}
                    >
                      Check-in
                    </Button>
                  </div>
                </div>
              ))}
              {todaySchedule.length > 6 && (
                <div className="text-center pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleViewAllAppointments}
                  >
                    Ver {todaySchedule.length - 6} citas más →
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel Informativo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🎯 Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Confirmaciones pendientes</p>
                  <p className="text-yellow-700">5 citas para confirmar mañana</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <UserPlus className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Documentos pendientes</p>
                  <p className="text-blue-700">2 afiliaciones por completar</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">📞 Contactos Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ambulancia</span>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Phone className="w-3 h-3 mr-1" />
                  123
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Farmacia Aliada</span>
                <Button variant="ghost" size="sm" className="text-[#0477BF]">
                  <Phone className="w-3 h-3 mr-1" />
                  +502 2222-3333
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Soporte Técnico</span>
                <Button variant="ghost" size="sm" className="text-[#0477BF]">
                  <Phone className="w-3 h-3 mr-1" />
                  +502 4898-1003
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddAppointmentDialog 
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
      />
      
      <AddAffiliateDialog 
        open={showAffiliateDialog}
        onOpenChange={setShowAffiliateDialog}
      />
    </div>
  );
}