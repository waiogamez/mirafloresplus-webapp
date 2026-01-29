import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Video, Clock, CheckCircle, AlertCircle, Loader2, PhoneOff } from 'lucide-react';
import { JitsiMeetingEmbed } from '../components/video/JitsiMeetingEmbed';
import { getConsultation, startConsultation, type Consultation } from '../services/consultationApi';
import { toast } from 'sonner@2.0.3';

type ConsultationStatus = 'waiting' | 'in_call' | 'ended';

export default function PatientCallView() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const role = searchParams.get('role') || 'patient';

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [status, setStatus] = useState<ConsultationStatus>('waiting');
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConsultation();
  }, [appointmentId]);

  const loadConsultation = async () => {
    if (!appointmentId) {
      setError('ID de cita no válido');
      setLoading(false);
      return;
    }

    // Validar token (en producción)
    if (!token) {
      setError('Token de acceso no válido');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getConsultation(appointmentId);
      setConsultation(data);
      setStatus(data.status);
      
      // Iniciar la consulta si aún está en waiting
      if (data.status === 'waiting') {
        await startConsultation(data.id);
      }
    } catch (err) {
      console.error('Error loading consultation:', err);
      setError('No se pudo cargar la información de la consulta');
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingJoined = () => {
    setStatus('in_call');
    toast.success('Conectado a la videoconsulta');
  };

  const handleMeetingEnd = () => {
    setStatus('ended');
    toast.info('La consulta ha finalizado');
    
    // Redirect después de 3 segundos
    setTimeout(() => {
      navigate('/affiliate/appointments');
    }, 3000);
  };

  const handleParticipantsChange = (count: number) => {
    setParticipantsCount(count);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#0477BF] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Preparando tu consulta médica
              </h2>
              <p className="text-gray-600">
                Conectando de forma segura...
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
                onClick={() => navigate('/affiliate/appointments')}
                className="bg-[#0477BF] hover:bg-[#0366a3]"
              >
                Volver a Mis Citas
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
                Gracias por utilizar Miraflores Plus
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  Recibirás un resumen de tu consulta por correo electrónico.
                  Las recetas médicas estarán disponibles en tu perfil.
                </p>
              </div>
              <Button
                onClick={() => navigate('/affiliate/appointments')}
                className="bg-[#0477BF] hover:bg-[#0366a3] w-full"
              >
                Ver Mis Citas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-[#0477BF]" />
            <div>
              <h1 className="font-bold text-gray-900">Consulta Médica</h1>
              <p className="text-xs text-gray-600">
                {consultation.specialty}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Estado de la llamada */}
          {status === 'waiting' && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-3 h-3 animate-pulse" />
              Esperando al médico
            </Badge>
          )}
          {status === 'in_call' && participantsCount >= 2 && (
            <Badge variant="default" className="bg-[#62BF04] flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              En consulta
            </Badge>
          )}
          {status === 'in_call' && participantsCount < 2 && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-3 h-3 animate-pulse" />
              Esperando al médico
            </Badge>
          )}

          {/* Salir */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleMeetingEnd}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 p-4">
        <div className="h-full rounded-lg overflow-hidden shadow-2xl">
          <JitsiMeetingEmbed
            roomName={consultation.roomName}
            displayName={role === 'family' ? 'Familiar' : consultation.patientName}
            role={role as any}
            onEvent={(type, data) => {
              console.log('Jitsi Event:', type, data);
              if (type === 'videoConferenceJoined') {
                handleMeetingJoined();
              }
            }}
            onParticipantsChange={handleParticipantsChange}
            onMeetingEnd={handleMeetingEnd}
          />
        </div>
      </div>

      {/* Footer Info */}
      {status === 'waiting' && (
        <div className="bg-white border-t px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-[#0477BF] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Esperando al médico
                </p>
                <p className="text-gray-600">
                  El Dr. {consultation.doctorName} se unirá en breve. 
                  Asegúrate de tener tu cámara y micrófono listos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
