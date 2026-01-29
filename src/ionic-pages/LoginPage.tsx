import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { logIn, alertCircle, mail, lockClosed } from 'ionicons/icons';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuthStore();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      
      // Redirect based on role
      const user = useAuthStore.getState().user;
      if (user) {
        switch (user.role) {
          case 'recepcion':
            history.replace('/dashboard/recepcion');
            break;
          case 'doctor':
            history.replace('/dashboard/doctor');
            break;
          case 'finanzas':
            history.replace('/dashboard/finanzas');
            break;
          case 'junta':
            history.replace('/dashboard/junta');
            break;
          case 'affiliate':
            history.replace('/dashboard/affiliate');
            break;
          case 'superadmin':
            history.replace('/dashboard/admin');
            break;
          default:
            history.replace('/dashboard');
        }
      }
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content" fullscreen>
        <IonGrid className="login-grid">
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '100vh' }}>
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              {/* Logo Section */}
              <div className="login-header">
                <div className="logo-container">
                  <div className="logo-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M24 4L4 14V34L24 44L44 34V14L24 4Z" fill="#0477BF"/>
                      <path d="M24 14L14 19V29L24 34L34 29V19L24 14Z" fill="#2BB9D9"/>
                      <circle cx="24" cy="24" r="4" fill="white"/>
                    </svg>
                  </div>
                  <h1 className="miraflores-logo">MIRAFLORES PLUS</h1>
                  <p className="miraflores-tagline">¡Tu salud, a un clic de distancia!</p>
                </div>
              </div>

              {/* Login Card */}
              <IonCard className="login-card">
                <IonCardHeader>
                  <IonCardTitle className="login-title">Iniciar Sesión</IonCardTitle>
                  <IonText color="medium">
                    <p className="login-subtitle">Ingresa tus credenciales para acceder</p>
                  </IonText>
                </IonCardHeader>

                <IonCardContent>
                  <form onSubmit={handleLogin}>
                    {/* Error Message */}
                    {error && (
                      <div className="error-message">
                        <IonIcon icon={alertCircle} color="danger" />
                        <IonText color="danger">
                          <p>{error}</p>
                        </IonText>
                      </div>
                    )}

                    {/* Email Input */}
                    <IonItem className="input-item" lines="none">
                      <IonIcon icon={mail} slot="start" color="primary" />
                      <IonLabel position="floating">Correo Electrónico</IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        placeholder="correo@ejemplo.com"
                        required
                        disabled={isLoading}
                      />
                    </IonItem>

                    {/* Password Input */}
                    <IonItem className="input-item" lines="none">
                      <IonIcon icon={lockClosed} slot="start" color="primary" />
                      <IonLabel position="floating">Contraseña</IonLabel>
                      <IonInput
                        type="password"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </IonItem>

                    {/* Submit Button */}
                    <IonButton
                      expand="block"
                      type="submit"
                      disabled={isLoading}
                      className="login-button"
                      size="large"
                    >
                      {isLoading ? (
                        <IonSpinner name="crescent" />
                      ) : (
                        <>
                          <IonIcon slot="start" icon={logIn} />
                          Iniciar Sesión
                        </>
                      )}
                    </IonButton>
                  </form>

                  {/* Demo Credentials */}
                  <IonCard className="credentials-card">
                    <IonCardContent>
                      <IonText color="medium">
                        <p className="credentials-title">🔐 Credenciales de Producción:</p>
                        <div className="credentials-grid">
                          <div className="credential-item">
                            <strong>Recepción:</strong> recepcion@mirafloresplus.com
                          </div>
                          <div className="credential-item">
                            <strong>Doctor:</strong> doctor@mirafloresplus.com
                          </div>
                          <div className="credential-item">
                            <strong>Finanzas:</strong> finanzas@mirafloresplus.com
                          </div>
                          <div className="credential-item">
                            <strong>Junta:</strong> junta@mirafloresplus.com
                          </div>
                          <div className="credential-item">
                            <strong>Afiliado:</strong> afiliado@gmail.com
                          </div>
                          <div className="credential-item">
                            <strong>Admin:</strong> admin@mirafloresplus.com
                          </div>
                          <div className="credential-password">
                            <strong>Contraseña:</strong> [rol]123 (ej: recepcion123)
                          </div>
                        </div>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCardContent>
              </IonCard>

              {/* Footer */}
              <div className="login-footer">
                <IonText color="light">
                  <p>© 2025 Miraflores Plus. Todos los derechos reservados.</p>
                  <p>Hospital Miraflores - Zona 10, Guatemala</p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
