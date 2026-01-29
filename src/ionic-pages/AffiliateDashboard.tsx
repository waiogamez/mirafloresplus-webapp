import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar
} from '@ionic/react';
import {
  calendar,
  documentText,
  card,
  people,
  videocam,
  medkit,
  person,
  time
} from 'ionicons/icons';
import { useAuthStore } from '../store/useAuthStore';

export function AffiliateDashboard() {
  const user = useAuthStore(state => state.user);

  const metrics = [
    { title: 'Próxima Cita', value: '15 Ene', icon: calendar, color: 'primary', subtitle: '10:30 AM con Dr. Hernández' },
    { title: 'Plan Actual', value: 'Premium', icon: card, color: 'success', subtitle: 'Renovación: 15 Feb 2025' },
    { title: 'Dependientes', value: '3', icon: people, color: 'tertiary', subtitle: 'Familia completa' },
    { title: 'Consultas', value: '12', icon: medkit, color: 'secondary', subtitle: 'Este año' }
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Carlos Hernández', specialty: 'Medicina General', date: '15 Ene 2025', time: '10:30 AM', type: 'Presencial' },
    { doctor: 'Dra. María López', specialty: 'Pediatría', date: '20 Ene 2025', time: '3:00 PM', type: 'Videoconsulta' },
  ];

  const dependents = [
    { name: 'Juan González', relationship: 'Hijo', age: '8 años', lastVisit: '10 Dic 2024' },
    { name: 'María González', relationship: 'Hija', age: '5 años', lastVisit: '05 Dic 2024' },
    { name: 'Pedro González', relationship: 'Cónyuge', age: '35 años', lastVisit: '28 Nov 2024' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mi Portal</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="welcome-section">
          <h2>¡Hola, {user?.firstName}!</h2>
          <p>Bienvenido a tu portal de salud</p>
        </div>

        <div className="page-content">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Acciones Rápidas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="quick-actions">
                <IonButton expand="block" routerLink="/appointments/new" color="primary">
                  <IonIcon slot="start" icon={calendar} />
                  Agendar Cita
                </IonButton>
                <IonButton expand="block" routerLink="/videocall" color="secondary">
                  <IonIcon slot="start" icon={videocam} />
                  Videoconsulta
                </IonButton>
                <IonButton expand="block" routerLink="/medical-history" fill="outline">
                  <IonIcon slot="start" icon={documentText} />
                  Mi Historial Médico
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="quick-stats-grid">
            {metrics.map((metric, index) => (
              <IonCard key={index} className="metric-card">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '32px', color: `var(--ion-color-${metric.color})` }}>
                      <IonIcon icon={metric.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="metric-title">{metric.title}</p>
                      <h3 className="metric-value" style={{ color: `var(--ion-color-${metric.color})` }}>
                        {metric.value}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                        {metric.subtitle}
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={calendar} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Próximas Citas
                </IonCardTitle>
                <IonBadge color="primary">{upcomingAppointments.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {upcomingAppointments.map((apt, index) => (
                  <IonItem key={index} button detail>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{apt.doctor}</h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>{apt.specialty}</p>
                        </IonLabel>
                        <IonBadge color={apt.type === 'Videoconsulta' ? 'secondary' : 'primary'}>
                          {apt.type}
                        </IonBadge>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                        <IonIcon icon={time} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {apt.date} • {apt.time}
                      </p>
                    </div>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/appointments">
                Ver todas mis citas
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={people} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Mis Dependientes
                </IonCardTitle>
                <IonBadge color="tertiary">{dependents.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {dependents.map((dep, index) => (
                  <IonItem key={index} button detail>
                    <IonAvatar slot="start">
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'var(--ion-color-tertiary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {dep.name.charAt(0)}
                      </div>
                    </IonAvatar>
                    <IonLabel>
                      <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{dep.name}</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {dep.relationship} • {dep.age}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Última visita: {dep.lastVisit}
                      </p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="outline" routerLink="/dependents/new">
                <IonIcon slot="start" icon={person} />
                Agregar Dependiente
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
