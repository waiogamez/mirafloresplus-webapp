/**
 * Tipos e interfaces para la integración de Jitsi Meet
 */

export type JitsiRole = 'doctor' | 'patient' | 'family';

export interface JitsiEventType {
  videoConferenceJoined: 'videoConferenceJoined';
  videoConferenceLeft: 'videoConferenceLeft';
  participantJoined: 'participantJoined';
  participantLeft: 'participantLeft';
  readyToClose: 'readyToClose';
  recordingStatusChanged: 'recordingStatusChanged';
  audioMuteStatusChanged: 'audioMuteStatusChanged';
  videoMuteStatusChanged: 'videoMuteStatusChanged';
  screenShareStatusChanged: 'screenShareStatusChanged';
}

export interface JitsiParticipant {
  id: string;
  displayName: string;
  formattedDisplayName?: string;
}

export interface JitsiEvent {
  type: keyof JitsiEventType;
  data?: any;
}

export interface JitsiConfig {
  // Configuración de la reunión
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
  enableWelcomePage?: boolean;
  enableClosePage?: boolean;
  
  // Límites
  maxParticipants?: number;
  
  // Grabación
  fileRecordingsEnabled?: boolean;
  dropbox?: {
    appKey?: string;
  };
  
  // P2P
  p2p?: {
    enabled?: boolean;
    stunServers?: Array<{ urls: string }>;
  };
  
  // Configuración de resolución
  resolution?: number;
  constraints?: {
    video?: {
      height?: {
        ideal?: number;
        max?: number;
        min?: number;
      };
      width?: {
        ideal?: number;
        max?: number;
        min?: number;
      };
    };
  };
  
  // Deshabilitar funcionalidades
  disableDeepLinking?: boolean;
  disableInviteFunctions?: boolean;
  disableProfile?: boolean;
  doNotStoreRoom?: boolean;
  
  // Analytics
  analytics?: {
    disabled?: boolean;
  };
}

export interface JitsiInterfaceConfig {
  // Toolbar buttons a mostrar
  TOOLBAR_BUTTONS?: string[];
  
  // Configuración de video
  INITIAL_TOOLBAR_TIMEOUT?: number;
  TOOLBAR_TIMEOUT?: number;
  
  // Settings
  SETTINGS_SECTIONS?: string[];
  
  // Video layout
  VERTICAL_FILMSTRIP?: boolean;
  FILM_STRIP_MAX_HEIGHT?: number;
  
  // Mobile
  MOBILE_APP_PROMO?: boolean;
  
  // Branding
  SHOW_JITSI_WATERMARK?: boolean;
  SHOW_WATERMARK_FOR_GUESTS?: boolean;
  SHOW_BRAND_WATERMARK?: boolean;
  BRAND_WATERMARK_LINK?: string;
  
  // Funcionalidades
  DISABLE_VIDEO_BACKGROUND?: boolean;
  DISABLE_FOCUS_INDICATOR?: boolean;
  DISABLE_DOMINANT_SPEAKER_INDICATOR?: boolean;
  
  // Invitaciones
  ENABLE_DIAL_OUT?: boolean;
  ENABLE_FEEDBACK_ANIMATION?: boolean;
}

export interface JitsiMeetingOptions {
  roomName: string;
  width?: string | number;
  height?: string | number;
  parentNode?: HTMLElement;
  configOverwrite?: JitsiConfig;
  interfaceConfigOverwrite?: JitsiInterfaceConfig;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  jwt?: string;
  onload?: () => void;
}

// Definición del API externo de Jitsi
export interface JitsiMeetExternalAPI {
  new (domain: string, options: JitsiMeetingOptions): JitsiMeetExternalAPI;
  
  // Métodos de control
  dispose(): void;
  executeCommand(command: string, ...args: any[]): void;
  executeCommands(commands: { [command: string]: any }): void;
  
  // Eventos
  addEventListener(event: keyof JitsiEventType, listener: (data: any) => void): void;
  removeEventListener(event: keyof JitsiEventType, listener: (data: any) => void): void;
  
  // Información
  getParticipantsInfo(): Promise<JitsiParticipant[]>;
  getDisplayName(participantId?: string): Promise<string>;
  getEmail(participantId?: string): Promise<string>;
  getAvatarURL(participantId?: string): Promise<string>;
  
  // Estado
  isAudioMuted(): Promise<boolean>;
  isVideoMuted(): Promise<boolean>;
  isAudioAvailable(): Promise<boolean>;
  isVideoAvailable(): Promise<boolean>;
  
  // Control de audio/video
  setAudioInputDevice(deviceId: string, deviceLabel?: string): Promise<void>;
  setAudioOutputDevice(deviceId: string, deviceLabel?: string): Promise<void>;
  setVideoInputDevice(deviceId: string, deviceLabel?: string): Promise<void>;
  
  // Grabación
  startRecording(options: { mode: 'file' | 'stream', dropboxToken?: string }): void;
  stopRecording(mode: 'file' | 'stream'): void;
  
  // Utilidades
  captureLargeVideoScreenshot(): Promise<string>;
  getRoomsInfo(): Promise<any>;
  getContentSharingParticipants(): Promise<string[]>;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: typeof JitsiMeetExternalAPI;
  }
}
