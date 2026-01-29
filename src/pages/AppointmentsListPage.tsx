import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';
import { AddAppointmentDialog } from '../components/AddAppointmentDialog';
import { toast } from 'sonner';

export function AppointmentsListPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const appointments = useAppointmentStore(state => state.appointments);
  const getTodayAppointments = useAppointmentStore(state => state.getTodayAppointments);
  const todayAppointments = getTodayAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada': return 'default';
      case 'En Progreso': return 'secondary';
      case 'Confirmada': return 'default';
      case 'Programada': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0477BF]">Gestión de Citas</h1>
        <Button className="bg-[#0477BF]" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-[#0477BF]" />
            <p className="text-sm text-gray-600">Hoy</p>
            <h3 className="text-2xl font-bold text-[#0477BF]">{todayAppointments.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-[#F59E0B]" />
            <p className="text-sm text-gray-600">En Progreso</p>
            <h3 className="text-2xl font-bold text-[#F59E0B]">
              {appointments.filter(a => a.status === 'En Progreso').length}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-[#62BF04]" />
            <p className="text-sm text-gray-600">Completadas</p>
            <h3 className="text-2xl font-bold text-[#62BF04]">
              {appointments.filter(a => a.status === 'Completada').length}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Citas ({appointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.slice(0, 15).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{apt.patientName}</p>
                  <p className="text-sm text-gray-600">
                    {apt.date} • {apt.time} • {apt.doctorName}
                  </p>
                  {apt.reason && (
                    <p className="text-xs text-gray-500 mt-1">{apt.reason}</p>
                  )}
                </div>
                <Badge variant={getStatusColor(apt.status) as any}>
                  {apt.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddAppointmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAppointmentAdded={() => {
          toast.success('Cita agendada exitosamente', {
            description: 'La cita ha sido agregada al sistema',
          });
        }}
      />
    </div>
  );
}