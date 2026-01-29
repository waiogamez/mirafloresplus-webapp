import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
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
  IonNote,
  IonChip
} from '@ionic/react';
import {
  calendar,
  people,
  time,
  checkmarkCircle,
  personAdd,
  call,
  mail,
  alertCircle,
  documentText
} from 'ionicons/icons';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const waitingRoom = [
  { name: "Carlos Rodríguez", appointmentTime: "08:30", waitTime: "12 min", priority: "normal" },
  { name: "Pedro Morales", appointmentTime: "Sin cita", waitTime: "25 min", priority: "urgent" },
  { name: "Sofia Ramírez", appointmentTime: "09:15", waitTime: "5 min", priority: "normal" },
];

const recentRegistrations = [
  { id: "AF-2658", name: "Laura Méndez", plan: "Premium", date: "Hoy 10:30 AM" },
  { id: "AF-2657", name: "Diego Castro", plan: "Básico", date: "Hoy 09:15 AM" },
  { id: "AF-2656", name: "Patricia Ruiz", plan: "Premium", date: "Ayer 4:20 PM" },
];

export function ReceptionDashboard() {
  const user = useAuthStore(state => state.user);
  const getTodayAppointments = useAppointmentStore((state) => state.getTodayAppointments);
  const todaySchedule = getTodayAppointments();

  const metrics = [
    { 
      title: 'Citas Hoy', 
      value: todaySchedule.length.toString(), 
      icon: calendar, 
      color: 'primary',
      subtitle: 'Programadas'
    },
    { 
      title: 'En Sala de Espera', 
      value: '3', 
      icon: people, 
      color: 'warning',
      subtitle: 'Pacientes esperando'
    },
    { 
      title: 'Atendidas', 
      value: '12', 
      icon: checkmarkCircle, 
      color: 'success',
      subtitle: 'Completadas hoy'
    },
    { 
      title: 'Nuevos Afiliados', 
      value: '3', 
      icon: personAdd, 
      color: 'tertiary',
      subtitle: 'Esta semana'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Progreso':
        return 'warning';
      case 'Confirmada':
        return 'success';
      case 'Completada':
        return 'medium';
      default:
        return 'primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'danger' : 'medium';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Panel de Recepción</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>¡Bienvenida, {user?.firstName}!</h2>
          <p>Gestión de citas y atención al paciente</p>
        </div>

        <div className="page-content">
          {/* Quick Actions */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Acciones Rápidas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="quick-actions">
                <IonButton expand="block" routerLink="/appointments/new" color="primary">
                  <IonIcon slot="start" icon={calendar} />
                  Agendar Nueva Cita
                </IonButton>
                <IonButton expand="block" routerLink="/affiliates/new" color="success">
                  <IonIcon slot="start" icon={personAdd} />
                  Nueva Afiliación
                </IonButton>
                <IonButton expand="block" routerLink="/appointments" color="secondary" fill="outline">
                  <IonIcon slot="start" icon={documentText} />
                  Ver Todas las Citas
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Metrics Grid */}
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

          {/* Sala de Espera */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={people} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Sala de Espera
                </IonCardTitle>
                <IonBadge color="warning">{waitingRoom.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {waitingRoom.map((patient, index) => (
                  <IonItem key={index}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
                      {patient.priority === 'urgent' && (
                        <IonIcon icon={alertCircle} color="danger" style={{ fontSize: '24px' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{patient.name}</h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            Cita: {patient.appointmentTime} • Esperando: {patient.waitTime}
                          </p>
                        </IonLabel>
                      </div>
                      <IonChip color={getPriorityColor(patient.priority)}>
                        {patient.priority === 'urgent' ? 'Urgente' : 'Normal'}
                      </IonChip>
                      <IonButton fill="clear" size="small">
                        <IonIcon slot="icon-only" icon={call} />
                      </IonButton>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Citas del Día */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={calendar} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Citas del Día
                </IonCardTitle>
                <IonBadge color="primary">{todaySchedule.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {todaySchedule.length === 0 ? (
                <div className="empty-state">
                  <IonIcon icon={calendar} />
                  <h3>No hay citas programadas</h3>
                  <p>No hay citas para el día de hoy</p>
                </div>
              ) : (
                <IonList lines="full">
                  {todaySchedule.slice(0, 5).map((appointment) => (
                    <IonItem key={appointment.id}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <IonLabel>
                            <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                              {appointment.patientName}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#6b7280' }}>
                              <IonIcon icon={time} style={{ marginRight: '4px', verticalAlign: 'middle', fontSize: '14px' }} />
                              {appointment.time} - {appointment.doctorName}
                            </p>
                          </IonLabel>
                          <IonBadge color={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </IonBadge>
                        </div>
                        {appointment.reason && (
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            {appointment.reason}
                          </p>
                        )}
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}
              
              {todaySchedule.length > 5 && (
                <IonButton expand="block" fill="clear" routerLink="/appointments">
                  Ver todas ({todaySchedule.length})
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>

          {/* Nuevos Afiliados */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={personAdd} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Afiliaciones Recientes
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {recentRegistrations.map((affiliate) => (
                  <IonItem key={affiliate.id}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {affiliate.name}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            ID: {affiliate.id} • {affiliate.date}
                          </p>
                        </IonLabel>
                        <IonChip color={affiliate.plan === 'Premium' ? 'tertiary' : 'medium'}>
                          {affiliate.plan}
                        </IonChip>
                      </div>
                    </div>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/affiliates">
                Ver todos los afiliados
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
