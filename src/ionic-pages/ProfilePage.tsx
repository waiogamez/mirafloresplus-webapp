import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonChip
} from '@ionic/react';
import { person, mail, call, calendar, card, create } from 'ionicons/icons';
import { useAuthStore } from '../store/useAuthStore';

export function ProfilePage() {
  const user = useAuthStore(state => state.user);

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case 'recepcion': return 'Recepción';
      case 'doctor': return 'Doctor';
      case 'finanzas': return 'Finanzas';
      case 'junta': return 'Junta Directiva';
      case 'affiliate': return 'Afiliado';
      case 'superadmin': return 'Super Admin';
      default: return 'Usuario';
    }
  };

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case 'recepcion': return 'primary';
      case 'doctor': return 'success';
      case 'finanzas': return 'tertiary';
      case 'junta': return 'secondary';
      case 'affiliate': return 'warning';
      case 'superadmin': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          {/* Profile Card */}
          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <IonAvatar style={{ 
                  width: '100px', 
                  height: '100px', 
                  margin: '0 auto 16px auto' 
                }}>
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'var(--ion-color-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '40px',
                    fontWeight: 'bold'
                  }}>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </IonAvatar>

                <h2 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
                  {user?.firstName} {user?.lastName}
                </h2>

                <IonChip color={getRoleColor(user?.role)}>
                  <IonLabel>{getRoleLabel(user?.role)}</IonLabel>
                </IonChip>

                <IonButton fill="outline" size="small" style={{ marginTop: '16px' }}>
                  <IonIcon slot="start" icon={create} />
                  Editar Perfil
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Information */}
          <IonCard>
            <IonCardContent>
              <IonList lines="full">
                <IonItem>
                  <IonIcon icon={person} slot="start" color="primary" />
                  <IonLabel>
                    <p>Nombre Completo</p>
                    <h3>{user?.firstName} {user?.lastName}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={mail} slot="start" color="primary" />
                  <IonLabel>
                    <p>Correo Electrónico</p>
                    <h3>{user?.email}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={call} slot="start" color="primary" />
                  <IonLabel>
                    <p>Teléfono</p>
                    <h3>{user?.phone || 'No especificado'}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={card} slot="start" color="primary" />
                  <IonLabel>
                    <p>Hospital</p>
                    <h3>{user?.hospital || 'Miraflores Zona 10'}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={calendar} slot="start" color="primary" />
                  <IonLabel>
                    <p>Miembro Desde</p>
                    <h3>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-GT') : 'N/A'}</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Actions */}
          <IonCard>
            <IonCardContent>
              <IonButton expand="block" color="primary" fill="outline">
                Cambiar Contraseña
              </IonButton>
              <IonButton expand="block" color="danger" fill="clear" style={{ marginTop: '8px' }}>
                Cerrar Sesión
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
