import { useEffect, useRef, useState, useCallback } from 'react';
import { useJitsiScript } from '../../hooks/useJitsiScript';
import type { JitsiRole, JitsiMeetExternalAPI, JitsiEvent } from '../../types/jitsi';

interface JitsiMeetingEmbedProps {
  roomName: string;
  displayName: string;
  domain?: string;
  jwt?: string;
  role: JitsiRole;
  onEvent?: (type: string, payload: any) => void;
  onParticipantsChange?: (count: number) => void;
  onMeetingEnd?: () => void;
  className?: string;
}

export function JitsiMeetingEmbed({
  roomName,
  displayName,
  domain = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si',
  jwt,
  role,
  onEvent,
  onParticipantsChange,
  onMeetingEnd,
  className = '',
}: JitsiMeetingEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<JitsiMeetExternalAPI | null>(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loaded, error: scriptError } = useJitsiScript(domain);

  // Configuración específica para telemedicina clínica
  const getMeetingConfig = useCallback(() => {
    const baseConfig = {
      startWithAudioMuted: role === 'patient', // Pacientes empiezan con audio silenciado
      startWithVideoMuted: false,
      enableWelcomePage: false,
      enableClosePage: false,
      maxParticipants: 3, // Doctor + Paciente + 1 Familiar
      p2p: {
        enabled: true, // Habilitar P2P para mejor calidad 1:1
      },
      disableDeepLinking: true,
      disableInviteFunctions: role !== 'doctor', // Solo doctor puede invitar
      disableProfile: true,
      doNotStoreRoom: true, // No almacenar info de la sala por privacidad
      analytics: {
        disabled: true, // Deshabilitar analytics por privacidad médica
      },
    };

    return baseConfig;
  }, [role]);

  const getInterfaceConfig = useCallback(() => {
    // Configuración de interfaz según rol
    const doctorButtons = [
      'microphone',
      'camera',
      'desktop',
      'chat',
      'raisehand',
      'participants-pane',
      'tileview',
      'settings',
      'hangup',
      'invite',
    ];

    const patientButtons = [
      'microphone',
      'camera',
      'chat',
      'raisehand',
      'settings',
      'hangup',
    ];

    return {
      TOOLBAR_BUTTONS: role === 'doctor' ? doctorButtons : patientButtons,
      SETTINGS_SECTIONS: ['devices', 'language'],
      VERTICAL_FILMSTRIP: true,
      FILM_STRIP_MAX_HEIGHT: 120,
      MOBILE_APP_PROMO: false,
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: false,
      DISABLE_VIDEO_BACKGROUND: false,
      ENABLE_DIAL_OUT: false,
      ENABLE_FEEDBACK_ANIMATION: false,
    };
  }, [role]);

  // Inicializar Jitsi cuando el script esté cargado
  useEffect(() => {
    if (!loaded || !containerRef.current || jitsiApiRef.current) {
      return;
    }

    if (scriptError) {
      setError(`Error cargando Jitsi: ${scriptError.message}`);
      return;
    }

    const JitsiMeetExternalAPI = (window as any).JitsiMeetExternalAPI;

    if (!JitsiMeetExternalAPI) {
      setError('JitsiMeetExternalAPI no está disponible');
      return;
    }

    try {
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        configOverwrite: getMeetingConfig(),
        interfaceConfigOverwrite: getInterfaceConfig(),
        userInfo: {
          displayName: displayName,
        },
        ...(jwt && { jwt }),
      };

      const api = new JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Event Listeners
      api.addEventListener('videoConferenceJoined', (data: any) => {
        console.log('✅ Usuario unido a la videollamada:', data);
        setInCall(true);
        setParticipantsCount(1);
        onEvent?.('videoConferenceJoined', data);
      });

      api.addEventListener('participantJoined', (data: any) => {
        console.log('👤 Participante unido:', data);
        api.getParticipantsInfo().then((participants) => {
          const count = participants.length + 1; // +1 para incluir al usuario local
          setParticipantsCount(count);
          onParticipantsChange?.(count);
        });
        onEvent?.('participantJoined', data);
      });

      api.addEventListener('participantLeft', (data: any) => {
        console.log('👋 Participante salió:', data);
        api.getParticipantsInfo().then((participants) => {
          const count = participants.length + 1;
          setParticipantsCount(count);
          onParticipantsChange?.(count);
        });
        onEvent?.('participantLeft', data);
      });

      api.addEventListener('videoConferenceLeft', (data: any) => {
        console.log('❌ Usuario salió de la videollamada:', data);
        setInCall(false);
        onEvent?.('videoConferenceLeft', data);
        onMeetingEnd?.();
      });

      api.addEventListener('readyToClose', (data: any) => {
        console.log('🔴 Listo para cerrar:', data);
        onEvent?.('readyToClose', data);
        onMeetingEnd?.();
      });

      // Eventos adicionales de estado
      api.addEventListener('audioMuteStatusChanged', (data: any) => {
        onEvent?.('audioMuteStatusChanged', data);
      });

      api.addEventListener('videoMuteStatusChanged', (data: any) => {
        onEvent?.('videoMuteStatusChanged', data);
      });

    } catch (err) {
      console.error('❌ Error inicializando Jitsi:', err);
      setError(`Error inicializando videollamada: ${(err as Error).message}`);
    }

    // Cleanup
    return () => {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        } catch (err) {
          console.error('Error disposing Jitsi API:', err);
        }
      }
    };
  }, [loaded, scriptError, roomName, displayName, domain, jwt, role, getMeetingConfig, getInterfaceConfig, onEvent, onParticipantsChange, onMeetingEnd]);

  // Métodos públicos para controlar la reunión (opcional)
  useEffect(() => {
    // Exponer métodos útiles para el componente padre si es necesario
    // Por ejemplo: mutar audio, video, etc.
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-600 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error en la Videollamada</h3>
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-lg">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0477BF] mx-auto mb-4"></div>
          <p className="text-[#0477BF] font-semibold">Cargando videollamada...</p>
          <p className="text-sm text-gray-600 mt-2">Preparando la conexión segura</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Indicador de participantes (opcional) */}
      {inCall && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{participantsCount} {participantsCount === 1 ? 'participante' : 'participantes'}</span>
        </div>
      )}
    </div>
  );
}
