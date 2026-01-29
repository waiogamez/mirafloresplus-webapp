import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  Video, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  Timer,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { useAttendedAppointmentsStore } from '../store/useAttendedAppointmentsStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  notifyAppointmentStarted,
  notifyAppointmentCompleted,
  notifyVideocallStarted,
  notifyVideocallEnded,
  notifyPresencialStarted,
  notifyPresencialCompleted,
  notifyAppointmentCancelled,
  formatDuration,
} from '../utils/notificationHelpers';
import { toast } from 'sonner@2.0.3';
import { AddAppointmentDialog } from './AddAppointmentDialog';

interface DoctorAppointmentManagementProps {
  appointmentId?: string;
}

export function DoctorAppointmentManagement({ appointmentId }: DoctorAppointmentManagementProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  
  // Debug: Log estado del diálogo
  console.log('showAddDialog state:', showAddDialog);
  
  const user = useAuthStore(state => state.user);
  const allAppointments = useAppointmentStore(state => state.appointments);
  const attendedAppointments = useAttendedAppointmentsStore(state => state.attendedAppointments);
  
  // Filter today's appointments using useMemo to prevent infinite loops
  const appointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allAppointments.filter((apt) => apt.date === today);
  }, [allAppointments]);
  
  // Filter in-progress appointments using useMemo
  const inProgressAppointments = useMemo(() => {
    return attendedAppointments.filter(apt => apt.status === 'En curso');
  }, [attendedAppointments]);
  
  const startAppointment = useAttendedAppointmentsStore(state => state.startAppointment);
  const completeAppointment = useAttendedAppointmentsStore(state => state.completeAppointment);
  const cancelAppointmentStore = useAttendedAppointmentsStore(state => state.cancelAppointment);
  
  // Manejar inicio de cita
  const handleStartAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowStartDialog(true);
  };
  
  const confirmStartAppointment = () => {
    if (!selectedAppointment || !user) return;
    
    setIsProcessing(true);
    
    const appointmentType = 'Presencial'; // Default to presencial for now
    
    // Registrar inicio de atención
    const attendedId = startAppointment({
      appointmentId: selectedAppointment.id,
      patientId: selectedAppointment.affiliateId || 'AF-TEMP',
      patientName: selectedAppointment.affiliateName,
      doctorId: user.id || 'DOC-001',
      doctorName: `${user.firstName} ${user.lastName}`,
      specialty: user.specialty || 'Medicina General',
      date: new Date().toISOString().split('T')[0],
      time: selectedAppointment.time,
      type: appointmentType,
      duration: 0,
      createdBy: user.id || 'DOC-001',
      branch: selectedAppointment.hospital,
    });
    
    setStartTime(new Date());
    
    // Enviar notificación
    notifyPresencialStarted({
      doctorName: `${user.firstName} ${user.lastName}`,
      patientName: selectedAppointment.affiliateName,
      branch: selectedAppointment.hospital || 'Hospital Miraflores Zona 10',
      specialty: user.specialty || 'Medicina General',
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowStartDialog(false);
      toast.success('Cita iniciada exitosamente', {
        description: 'Administración y Recepción han sido notificados',
      });
    }, 1000);
  };
  
  // Manejar completar cita
  const handleCompleteAppointment = (attendedId: string) => {
    const attended = inProgressAppointments.find(apt => apt.id === attendedId);
    if (attended) {
      setSelectedAppointment(attended);
      setShowCompleteDialog(true);
    }
  };
  
  const confirmCompleteAppointment = () => {
    if (!selectedAppointment || !startTime || !user) return;
    
    setIsProcessing(true);
    
    // Calcular duración
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - new Date(selectedAppointment.attendedAt).getTime()) / 60000);
    
    // Honorarios
    const fee = selectedAppointment.type === 'Videollamada' ? 100 : 150;
    
    // Completar cita
    completeAppointment(selectedAppointment.id, consultationNotes);
    
    // Enviar notificaciones
    if (selectedAppointment.type === 'Videollamada') {
      notifyVideocallEnded({
        doctorName: `${user.firstName} ${user.lastName}`,
        patientName: selectedAppointment.patientName,
        duration: durationMinutes,
        fee,
      });
    } else {
      notifyPresencialCompleted({
        doctorName: `${user.firstName} ${user.lastName}`,
        patientName: selectedAppointment.patientName,
        branch: selectedAppointment.branch || 'Hospital Miraflores Zona 10',
        duration: durationMinutes,
        fee,
      });
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowCompleteDialog(false);
      setConsultationNotes('');
      setStartTime(null);
      toast.success('Cita completada exitosamente', {
        description: `Honorario registrado: Q${fee.toFixed(2)} - Finanzas notificado`,
      });
    }, 1000);
  };
  
  // Manejar cancelar cita
  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };
  
  const confirmCancelAppointment = () => {
    if (!selectedAppointment || !user) return;
    
    setIsProcessing(true);
    
    // Si es una cita en curso, cancelarla en el store
    if (selectedAppointment.id?.startsWith('ATT-')) {
      cancelAppointmentStore(selectedAppointment.id, cancelReason);
    }
    
    // Notificar
    notifyAppointmentCancelled({
      doctorName: `${user.firstName} ${user.lastName}`,
      patientName: selectedAppointment.patientName,
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowCancelDialog(false);
      setCancelReason('');
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      {/* Citas en Curso */}
      {inProgressAppointments.length > 0 && (
        <Card className="p-6 border-2 border-[#2BB9D9] bg-gradient-to-r from-[#2BB9D9]/5 to-transparent">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-[#0477BF]">
              Citas en Curso ({inProgressAppointments.length})
            </h3>
          </div>
          <div className="space-y-3">
            {inProgressAppointments.map((apt) => {
              const duration = Math.round((new Date().getTime() - new Date(apt.attendedAt).getTime()) / 60000);
              return (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-[#2BB9D9]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-[#2BB9D9] text-white">
                        {apt.type === 'Videollamada' ? '🎥 Videollamada' : '🏥 Presencial'}
                      </Badge>
                      <p className="font-semibold text-gray-900">{apt.patientName}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {duration} min en curso
                      </span>
                      {apt.branch && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {apt.branch}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-[#62BF04] hover:bg-[#52a003] text-white"
                      onClick={() => handleCompleteAppointment(apt.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => handleCancelAppointment(apt)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {/* Próximas Citas */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#0477BF]">
            Próximas Citas de Hoy ({appointments.length})
          </h3>
          <Button
            size="sm"
            className="bg-[#0477BF] hover:bg-[#0366a3] text-white"
            onClick={() => {
              console.log('Botón Nueva Cita clickeado');
              setShowAddDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tienes citas programadas para hoy
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">
                      {apt.time}
                    </Badge>
                    <p className="font-semibold text-gray-900">{apt.affiliateName}</p>
                    <Badge 
                      variant="outline"
                      className="border-[#0477BF] text-[#0477BF] bg-[#0477BF]/5"
                    >
                      <MapPin className="w-3 h-3 mr-1 inline" />
                      {apt.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {apt.notes || 'Sin notas'}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#0477BF] hover:bg-[#0366a3] text-white"
                  onClick={() => handleStartAppointment(apt)}
                >
                  Iniciar Consulta
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {/* Dialog: Iniciar Cita */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Consulta</DialogTitle>
            <DialogDescription>
              ¿Deseas iniciar la consulta con {selectedAppointment?.affiliateName}?
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                {selectedAppointment.type === 'Videollamada' ? (
                  <Video className="w-5 h-5 text-[#2BB9D9]" />
                ) : (
                  <MapPin className="w-5 h-5 text-[#0477BF]" />
                )}
                <div>
                  <p className="font-semibold">{selectedAppointment.affiliateName}</p>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment.type || 'Presencial'} • {selectedAppointment.time}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-900">
                  <strong>Se notificará a:</strong> Administración, Recepción
                </p>
                <p className="text-blue-700 mt-1">
                  El sistema registrará automáticamente el inicio de la consulta
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowStartDialog(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-[#0477BF] hover:bg-[#0366a3]"
              onClick={confirmStartAppointment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Iniciando...' : 'Iniciar Consulta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog: Completar Cita */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completar Consulta</DialogTitle>
            <DialogDescription>
              Finaliza la consulta con {selectedAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedAppointment && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Tipo</p>
                    <p className="font-semibold">{selectedAppointment.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Honorario</p>
                    <p className="font-semibold text-[#62BF04]">
                      Q{selectedAppointment.fee?.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notas de la Consulta (Opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Diagnóstico, tratamiento, observaciones..."
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <p className="text-green-900">
                    <strong>Se notificará a:</strong> Administración, Recepción, Finanzas
                  </p>
                  <p className="text-green-700 mt-1">
                    El honorario será registrado automáticamente para el pago mensual
                  </p>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCompleteDialog(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-[#62BF04] hover:bg-[#52a003]"
              onClick={confirmCompleteAppointment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Completando...' : 'Completar Consulta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alert Dialog: Cancelar Cita */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar Consulta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción notificará a administración y recepción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="cancel-reason">Motivo de Cancelación</Label>
            <Textarea
              id="cancel-reason"
              placeholder="Ejemplo: Paciente no se presentó, emergencia médica..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              No, Volver
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmCancelAppointment}
              disabled={isProcessing || !cancelReason.trim()}
            >
              {isProcessing ? 'Cancelando...' : 'Sí, Cancelar Consulta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog: Agregar Cita */}
      <AddAppointmentDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onAppointmentAdded={() => {
          toast.success('Cita agendada exitosamente', {
            description: 'La cita ha sido agregada a tu agenda',
          });
        }}
      />
    </div>
  );
}