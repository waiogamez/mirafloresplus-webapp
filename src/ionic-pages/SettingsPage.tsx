import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/react';
import { notifications, language, moon, shield, helpCircle } from 'ionicons/icons';
import { useState } from 'react';

export function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          {/* Notificaciones */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={notifications} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Notificaciones
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                <IonItem>
                  <IonLabel>
                    <h3>Notificaciones Push</h3>
                    <p>Recibir alertas de citas y recordatorios</p>
                  </IonLabel>
                  <IonToggle 
                    checked={notificationsEnabled} 
                    onIonChange={e => setNotificationsEnabled(e.detail.checked)}
                    slot="end"
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Apariencia */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={moon} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Apariencia
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                <IonItem>
                  <IonLabel>
                    <h3>Modo Oscuro</h3>
                    <p>Cambiar a tema oscuro</p>
                  </IonLabel>
                  <IonToggle 
                    checked={darkMode} 
                    onIonChange={e => setDarkMode(e.detail.checked)}
                    slot="end"
                  />
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Idioma */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={language} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Idioma
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                <IonItem>
                  <IonLabel>Idioma de la aplicación</IonLabel>
                  <IonSelect value={selectedLanguage} onIonChange={e => setSelectedLanguage(e.detail.value)}>
                    <IonSelectOption value="es">Español</IonSelectOption>
                    <IonSelectOption value="en">English</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Privacidad */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={shield} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Privacidad y Seguridad
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                <IonItem button detail>
                  <IonLabel>
                    <h3>Cambiar Contraseña</h3>
                  </IonLabel>
                </IonItem>
                <IonItem button detail>
                  <IonLabel>
                    <h3>Privacidad de Datos</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Ayuda */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={helpCircle} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Ayuda y Soporte
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                <IonItem button detail>
                  <IonLabel>
                    <h3>Centro de Ayuda</h3>
                  </IonLabel>
                </IonItem>
                <IonItem button detail>
                  <IonLabel>
                    <h3>Términos y Condiciones</h3>
                  </IonLabel>
                </IonItem>
                <IonItem button detail>
                  <IonLabel>
                    <h3>Política de Privacidad</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
