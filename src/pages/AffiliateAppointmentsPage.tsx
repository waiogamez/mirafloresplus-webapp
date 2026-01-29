import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, Video, Building, Clock, Search, Filter, CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { useAuthStore } from '../store/useAuthStore';
import { AffiliateAddAppointmentDialog } from '../components/AffiliateAddAppointmentDialog';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type AppointmentStatus = 'Programada' | 'Confirmada' | 'Completada' | 'Cancelada' | 'Pendiente Confirmación';
type FilterType = 'all' | 'upcoming' | 'completed' | 'cancelled' | 'pending';

export function AffiliateAppointmentsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const appointments = useAppointmentStore((state) => state.appointments);
  const updateAppointmentStatus = useAppointmentStore((state) => state.updateAppointmentStatus);
  const deleteAppointment = useAppointmentStore((state) => state.deleteAppointment);

  // Filtrar citas del afiliado actual
  const myAppointments = useMemo(() => {
    if (!user?.id) return [];
    
    return appointments.filter(apt => {
      // Filtrar por afiliado
      const isMyAppointment = apt.affiliateId === user.id || 
                              apt.affiliateName?.toLowerCase().includes(user.firstName?.toLowerCase() || '') ||
                              apt.createdBy === user.id;
      
      if (!isMyAppointment) return false;

      // Filtrar por búsqueda
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          apt.doctorName?.toLowerCase().includes(search) ||
          apt.notes?.toLowerCase().includes(search) ||
          apt.date.includes(search);
        
        if (!matchesSearch) return false;
      }

      // Filtrar por estado
      if (filterStatus === 'upcoming') {
        return apt.status === 'Programada' || apt.status === 'Confirmada';
      } else if (filterStatus === 'completed') {
        return apt.status === 'Completada';
      } else if (filterStatus === 'cancelled') {
        return apt.status === 'Cancelada';
      } else if (filterStatus === 'pending') {
        return apt.status === 'Pendiente Confirmación';
      }

      return true;
    }).sort((a, b) => {
      // Ordenar por fecha más reciente primero
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [appointments, user, searchTerm, filterStatus]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = myAppointments.length;
    const upcoming = myAppointments.filter(a => a.status === 'Programada' || a.status === 'Confirmada').length;
    const completed = myAppointments.filter(a => a.status === 'Completada').length;
    const virtual = myAppointments.filter(a => a.hospital?.toLowerCase().includes('virtual') || a.hospital?.toLowerCase().includes('telemedicina')).length;

    return { total, upcoming, completed, virtual };
  }, [myAppointments]);

  const handleConfirmAppointment = (appointmentId: string, doctorName: string) => {
    updateAppointmentStatus(appointmentId, 'Confirmada');
    toast.success(`Cita confirmada con ${doctorName}`, {
      description: 'Recibirás una notificación de recordatorio antes de tu cita'
    });
  };

  const handleCancelAppointment = (appointmentId: string, doctorName: string, date: string, time: string) => {
    if (window.confirm(`¿Estás seguro de cancelar la cita con ${doctorName} el ${date} a las ${time}?`)) {
      updateAppointmentStatus(appointmentId, 'Cancelada');
      toast.success(`Cita cancelada con ${doctorName}`, {
        description: 'Puedes agendar una nueva cita cuando lo necesites'
      });
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      'Programada': { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      'Confirmada': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      'Completada': { variant: 'outline' as const, icon: CheckCircle, color: 'text-gray-600' },
      'Cancelada': { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      'Pendiente Confirmación': { variant: 'warning' as const, icon: AlertCircle, color: 'text-amber-600' },
    };

    const config = statusConfig[status] || statusConfig['Programada'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const isVirtualAppointment = (hospital: string) => {
    return hospital?.toLowerCase().includes('virtual') || 
           hospital?.toLowerCase().includes('telemedicina');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Citas Médicas</h1>
          <p className="text-gray-600 mt-1">Gestiona tus consultas y videoconsultas</p>
        </div>
        <Button 
          className="bg-[#0477BF] hover:bg-[#0366a3]"
          onClick={() => setShowAddDialog(true)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Nueva Videoconsulta
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-[#0477BF]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Citas</p>
                <p className="text-2xl font-bold text-[#0477BF]">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-[#62BF04]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Próximas Citas</p>
                <p className="text-2xl font-bold text-[#62BF04]">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Video className="w-6 h-6 text-[#2BB9D9]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Videoconsultas</p>
                <p className="text-2xl font-bold text-[#2BB9D9]">{stats.virtual}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta sobre citas presenciales */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 mb-1">
                ¿Necesitas una cita presencial?
              </p>
              <p className="text-sm text-amber-700 mb-3">
                Para citas presenciales o de especialidad, contacta a nuestro equipo de atención al cliente. 
                Un asesor de Miraflores Plus confirmará tu cita en la fecha y horario que solicites.
                Como afiliado, puedes agendar videoconsultas de medicina general de manera inmediata desde esta plataforma.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
                onClick={() => setShowContactInfo(!showContactInfo)}
              >
                <Phone className="w-4 h-4 mr-2" />
                {showContactInfo ? 'Ocultar' : 'Ver'} Información de Contacto
              </Button>
              
              {showContactInfo && (
                <div className="mt-4 space-y-3 bg-white p-4 rounded-lg border border-[#62BF04]">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-[#0477BF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-[#0477BF] mb-1">
                        Atención al Cliente - Miraflores Plus
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        Llama para coordinar tu cita presencial o de especialidad:
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        📞 +502 4898-1003
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Un asesor confirmará tu cita en la fecha y horario que solicitaste
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por médico, motivo o fecha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={filterStatus} onValueChange={(value: FilterType) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Citas</SelectItem>
                  <SelectItem value="upcoming">Próximas Citas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="pending">Pendiente Confirmación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Citas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0477BF]" />
              Mis Citas ({myAppointments.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold mb-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No se encontraron citas con los filtros aplicados' 
                  : 'No tienes citas programadas'}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Agenda tu primera videoconsulta con nuestros especialistas
              </p>
              <Button 
                className="bg-[#0477BF]"
                onClick={() => setShowAddDialog(true)}
              >
                <Video className="w-4 h-4 mr-2" />
                Agendar Videoconsulta
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myAppointments.map((apt) => {
                const isVirtual = isVirtualAppointment(apt.hospital);
                const isPast = new Date(`${apt.date} ${apt.time}`) < new Date();
                const canCancel = apt.status !== 'Cancelada' && apt.status !== 'Completada' && !isPast;
                const canConfirm = apt.status === 'Programada' && !isPast;

                return (
                  <div 
                    key={apt.id} 
                    className={`p-5 rounded-lg border-2 transition-all hover:shadow-md ${
                      apt.status === 'Cancelada' 
                        ? 'bg-gray-50 border-gray-300 opacity-60' 
                        : isVirtual
                        ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 hover:border-[#2BB9D9]'
                        : 'bg-gradient-to-r from-blue-50 to-white border-blue-200 hover:border-[#0477BF]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-3 rounded-lg ${isVirtual ? 'bg-cyan-100' : 'bg-blue-100'}`}>
                            {isVirtual ? (
                              <Video className="w-6 h-6 text-[#2BB9D9]" />
                            ) : (
                              <Building className="w-6 h-6 text-[#0477BF]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-lg text-gray-900">
                                {apt.doctorName}
                              </p>
                              {getStatusBadge(apt.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {apt.type}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-700">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(parseISO(apt.date), "dd 'de' MMMM, yyyy", { locale: es })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {apt.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Modalidad */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          isVirtual 
                            ? 'bg-cyan-100 text-cyan-700 border border-cyan-300' 
                            : 'bg-blue-100 text-blue-700 border border-blue-300'
                        }`}>
                          {isVirtual ? (
                            <>
                              <Video className="w-4 h-4" />
                              Videoconsulta (Virtual)
                            </>
                          ) : (
                            <>
                              <Building className="w-4 h-4" />
                              Presencial - {apt.hospital}
                            </>
                          )}
                        </div>

                        {/* Notas */}
                        {apt.notes && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Motivo:</span> {apt.notes}
                            </p>
                          </div>
                        )}

                        {/* Info adicional para videoconsultas */}
                        {isVirtual && apt.status !== 'Cancelada' && apt.status !== 'Completada' && (
                          <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                            <p className="text-sm text-green-700 flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              <span className="font-semibold">Recibirás el enlace de videollamada por correo y SMS</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col gap-2">
                        {canConfirm && (
                          <Button
                            size="sm"
                            className="bg-[#62BF04] hover:bg-[#52a003] text-white"
                            onClick={() => handleConfirmAppointment(apt.id, apt.doctorName)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirmar
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 border-red-300"
                            onClick={() => handleCancelAppointment(apt.id, apt.doctorName, apt.date, apt.time)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Agendar Cita */}
      <AffiliateAddAppointmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAppointmentAdded={() => {
          toast.success('¡Videoconsulta agendada exitosamente!');
        }}
      />
    </div>
  );
}