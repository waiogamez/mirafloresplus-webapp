import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { videocam, videocamOff, mic, micOff, call } from 'ionicons/icons';
import { useState } from 'react';

export function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Videoconsulta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': '#000' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Video Area */}
          <div style={{ 
            flex: 1, 
            background: '#1a1a1a', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <IonIcon icon={videocam} style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }} />
              <p>Video en espera...</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>Esperando al doctor</p>
            </div>

            {/* Self Video Preview */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '120px',
              height: '160px',
              background: '#2a2a2a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0477BF'
            }}>
              <IonIcon icon={videocam} style={{ fontSize: '32px', color: '#fff', opacity: 0.5 }} />
            </div>
          </div>

          {/* Controls */}
          <div style={{ 
            padding: '24px', 
            background: '#1a1a1a',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <IonButton 
              shape="round" 
              color={isMuted ? 'danger' : 'dark'}
              onClick={() => setIsMuted(!isMuted)}
            >
              <IonIcon icon={isMuted ? micOff : mic} />
            </IonButton>

            <IonButton 
              shape="round" 
              color="danger"
              size="large"
            >
              <IonIcon icon={call} />
            </IonButton>

            <IonButton 
              shape="round" 
              color={isVideoOff ? 'danger' : 'dark'}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              <IonIcon icon={isVideoOff ? videocamOff : videocam} />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
