import { copyToClipboard } from "../utils/clipboard";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  PhoneOff, 
  FileText,
  Pill,
  Upload,
  User,
  Copy,
  Share2
} from 'lucide-react';
import { JitsiMeetingEmbed } from '../components/video/JitsiMeetingEmbed';
import { NotesPanel } from '../components/clinical/NotesPanel';
import { PrescriptionPanel } from '../components/clinical/PrescriptionPanel';
import { LabsPanel } from '../components/clinical/LabsPanel';
import { PatientSummary } from '../components/clinical/PatientSummary';
import { 
  getConsultation, 
  startConsultation, 
  endConsultation,
  type Consultation 
} from '../services/consultationApi';
import { toast } from 'sonner@2.0.3';
import { useAuthStore } from '../store/useAuthStore';

type ConsultationStatus = 'waiting' | 'in_call' | 'ended';

export default function DoctorConsultView() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [status, setStatus] = useState<ConsultationStatus>('waiting');
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEndingConsultation, setIsEndingConsultation] = useState(false);
  
  // Timer
  const [consultationStartTime, setConsultationStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadConsultation();
  }, [appointmentId]);

  // Timer effect
  useEffect(() => {
    if (!consultationStartTime || status !== 'in_call') return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - consultationStartTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [consultationStartTime, status]);

  const loadConsultation = async () => {
    if (!appointmentId) {
      setError('ID de cita no válido');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getConsultation(appointmentId);
      setConsultation(data);
      setStatus(data.status);
      
      if (data.startedAt) {
        setConsultationStartTime(new Date(data.startedAt));
      }
    } catch (err) {
      console.error('Error loading consultation:', err);
      setError('No se pudo cargar la información de la consulta');
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingJoined = async () => {
    if (!consultation) return;

    try {
      if (status === 'waiting') {
        await startConsultation(consultation.id);
        setConsultationStartTime(new Date());
      }
      setStatus('in_call');
      toast.success('Conectado a la videoconsulta');
    } catch (error) {
      console.error('Error starting consultation:', error);
    }
  };

  const handleEndConsultation = async () => {
    if (!consultation) return;

    const confirmEnd = window.confirm(
      '¿Está seguro de finalizar la consulta?\n\n' +
      'Asegúrese de haber completado:\n' +
      '• Notas médicas\n' +
      '• Recetas (si aplica)\n' +
      '• Archivos de laboratorio (si aplica)'
    );

    if (!confirmEnd) return;

    setIsEndingConsultation(true);

    try {
      await endConsultation(consultation.id);
      setStatus('ended');
      toast.success('Consulta finalizada correctamente');
      
      // Redirect después de 2 segundos
      setTimeout(() => {
        navigate('/doctor');
      }, 2000);
    } catch (error) {
      toast.error('Error al finalizar la consulta');
      console.error('Error ending consultation:', error);
    } finally {
      setIsEndingConsultation(false);
    }
  };

  const handleParticipantsChange = (count: number) => {
    setParticipantsCount(count);
  };

  const copyFamilyLink = async () => {
    if (!consultation) return;

    const familyLink = `${window.location.origin}/call/${appointmentId}?token=family-${Date.now()}&role=family`;
    
    const success = await copyToClipboard(familyLink);
    if (success) {
      toast.success('Link copiado al portapapeles', {
        description: 'Comparte este link con el familiar del paciente'
      });
    } else {
      toast.error('No se pudo copiar el link', {
        description: 'Por favor copia el link manualmente'
      });
    }
  };

  const formatElapsedTime = () => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#0477BF] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Cargando consulta médica
              </h2>
              <p className="text-gray-600">
                Preparando el espacio clínico...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Error al cargar la consulta
              </h2>
              <p className="text-gray-600 mb-4">
                {error || 'No se pudo cargar la información de la consulta'}
              </p>
              <Button
                onClick={() => navigate('/doctor')}
                className="bg-[#0477BF] hover:bg-[#0366a3]"
              >
                Volver al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-[#62BF04] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Consulta Finalizada
              </h2>
              <p className="text-gray-600 mb-4">
                La consulta se ha registrado correctamente
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Duración:</strong> {formatElapsedTime()}
                </p>
                <p className="text-sm text-gray-700">
                  El paciente recibirá un resumen de la consulta por correo electrónico.
                </p>
              </div>
              <Button
                onClick={() => navigate('/doctor')}
                className="bg-[#0477BF] hover:bg-[#0366a3] w-full"
              >
                Volver al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-[#0477BF]" />
            <div>
              <h1 className="font-bold text-gray-900">
                Consulta con {consultation.patientName}
              </h1>
              <p className="text-xs text-gray-600">
                {consultation.specialty}
              </p>
            </div>
          </div>

          {/* Timer */}
          {status === 'in_call' && consultationStartTime && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#62BF04] text-white rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatElapsedTime()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Estado */}
          {status === 'waiting' && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-3 h-3 animate-pulse" />
              Esperando al paciente
            </Badge>
          )}
          {status === 'in_call' && (
            <Badge variant="default" className="bg-[#62BF04] flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              En consulta • {participantsCount} {participantsCount === 1 ? 'participante' : 'participantes'}
            </Badge>
          )}

          {/* Invitar familiar */}
          <Button
            size="sm"
            variant="outline"
            onClick={copyFamilyLink}
            className="border-[#2BB9D9] text-[#2BB9D9] hover:bg-cyan-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Invitar Familiar
          </Button>

          {/* Finalizar Consulta */}
          <Button
            size="sm"
            onClick={handleEndConsultation}
            disabled={isEndingConsultation || status === 'waiting'}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isEndingConsultation ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <PhoneOff className="w-4 h-4 mr-2" />
                Finalizar Consulta
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Desktop: Split, Mobile: Tabs */}
      <div className="flex-1 p-4 overflow-hidden">
        {/* Desktop View: Split Screen */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4 h-full">
          {/* Left: Video */}
          <div className="h-full rounded-lg overflow-hidden shadow-2xl bg-gray-900">
            <JitsiMeetingEmbed
              roomName={consultation.roomName}
              displayName={user ? `Dr. ${user.firstName} ${user.lastName}` : consultation.doctorName}
              role="doctor"
              onEvent={(type, data) => {
                console.log('Jitsi Event:', type, data);
                if (type === 'videoConferenceJoined') {
                  handleMeetingJoined();
                }
              }}
              onParticipantsChange={handleParticipantsChange}
              onMeetingEnd={handleEndConsultation}
            />
          </div>

          {/* Right: Clinical Panel */}
          <div className="h-full overflow-auto">
            <Tabs defaultValue="notes" className="h-full flex flex-col">
              <TabsList className="w-full bg-white shadow-sm sticky top-0 z-10">
                <TabsTrigger value="notes" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Notas
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex-1">
                  <Pill className="w-4 h-4 mr-2" />
                  Recetas
                </TabsTrigger>
                <TabsTrigger value="labs" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Archivos
                </TabsTrigger>
                <TabsTrigger value="patient" className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  Paciente
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto pt-4">
                <TabsContent value="notes" className="mt-0 h-full">
                  <NotesPanel 
                    consultationId={consultation.id}
                    initialNotes={consultation.notes}
                  />
                </TabsContent>

                <TabsContent value="prescriptions" className="mt-0 h-full">
                  <PrescriptionPanel
                    consultationId={consultation.id}
                    prescriptions={consultation.prescriptions}
                    onUpdate={loadConsultation}
                  />
                </TabsContent>

                <TabsContent value="labs" className="mt-0 h-full">
                  <LabsPanel
                    consultationId={consultation.id}
                    files={consultation.files}
                    onUpdate={loadConsultation}
                  />
                </TabsContent>

                <TabsContent value="patient" className="mt-0 h-full">
                  <PatientSummary patientId={consultation.patientId} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Mobile View: Tabs */}
        <div className="lg:hidden h-full">
          <Tabs defaultValue="video" className="h-full flex flex-col">
            <TabsList className="w-full bg-white shadow-sm">
              <TabsTrigger value="video" className="flex-1">
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="panel" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Panel Clínico
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden pt-4">
              <TabsContent value="video" className="mt-0 h-full">
                <div className="h-full rounded-lg overflow-hidden shadow-2xl bg-gray-900">
                  <JitsiMeetingEmbed
                    roomName={consultation.roomName}
                    displayName={user ? `Dr. ${user.firstName} ${user.lastName}` : consultation.doctorName}
                    role="doctor"
                    onEvent={(type, data) => {
                      if (type === 'videoConferenceJoined') {
                        handleMeetingJoined();
                      }
                    }}
                    onParticipantsChange={handleParticipantsChange}
                    onMeetingEnd={handleEndConsultation}
                  />
                </div>
              </TabsContent>

              <TabsContent value="panel" className="mt-0 h-full overflow-auto">
                <Tabs defaultValue="notes" className="h-full">
                  <TabsList className="w-full bg-white">
                    <TabsTrigger value="notes"><FileText className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="prescriptions"><Pill className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="labs"><Upload className="w-4 h-4" /></TabsTrigger>
                    <TabsTrigger value="patient"><User className="w-4 h-4" /></TabsTrigger>
                  </TabsList>

                  <div className="pt-4">
                    <TabsContent value="notes">
                      <NotesPanel 
                        consultationId={consultation.id}
                        initialNotes={consultation.notes}
                      />
                    </TabsContent>
                    <TabsContent value="prescriptions">
                      <PrescriptionPanel
                        consultationId={consultation.id}
                        prescriptions={consultation.prescriptions}
                        onUpdate={loadConsultation}
                      />
                    </TabsContent>
                    <TabsContent value="labs">
                      <LabsPanel
                        consultationId={consultation.id}
                        files={consultation.files}
                        onUpdate={loadConsultation}
                      />
                    </TabsContent>
                    <TabsContent value="patient">
                      <PatientSummary patientId={consultation.patientId} />
                    </TabsContent>
                  </div>
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}