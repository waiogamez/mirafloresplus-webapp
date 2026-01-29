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
  IonChip,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  calendar,
  people,
  checkmarkCircle,
  time,
  videocam,
  clipboard,
  medkit,
  documentText
} from 'ionicons/icons';
import { useAuthStore } from '../store/useAuthStore';
import { useAppointmentStore } from '../store/useAppointmentStore';

export function DoctorDashboard() {
  const user = useAuthStore(state => state.user);
  const getTodayAppointments = useAppointmentStore((state) => state.getTodayAppointments);
  const todaySchedule = getTodayAppointments();

  const metrics = [
    { 
      title: 'Consultas Hoy', 
      value: todaySchedule.length.toString(), 
      icon: calendar, 
      color: 'primary',
      subtitle: 'Programadas'
    },
    { 
      title: 'Pacientes Atendidos', 
      value: '8', 
      icon: people, 
      color: 'success',
      subtitle: 'Completadas'
    },
    { 
      title: 'Pendientes', 
      value: (todaySchedule.length - 8).toString(), 
      icon: time, 
      color: 'warning',
      subtitle: 'Por atender'
    },
    { 
      title: 'Videoconsultas', 
      value: '2', 
      icon: videocam, 
      color: 'secondary',
      subtitle: 'Hoy'
    }
  ];

  const nextPatients = todaySchedule.slice(0, 3);

  const recentConsultations = [
    { 
      patient: "María González", 
      time: "08:30 AM", 
      diagnosis: "Control prenatal - 28 semanas",
      status: "Completada"
    },
    { 
      patient: "Carlos Rodríguez", 
      time: "09:15 AM", 
      diagnosis: "Consulta general - Hipertensión",
      status: "Completada"
    },
    { 
      patient: "Ana Martínez", 
      time: "10:00 AM", 
      diagnosis: "Seguimiento diabetes tipo 2",
      status: "En progreso"
    },
  ];

  const pendingReports = [
    { patient: "Pedro López", type: "Resultados de laboratorio", date: "Hace 2 horas" },
    { patient: "Laura Hernández", type: "Reporte de ultrasonido", date: "Hace 4 horas" },
    { patient: "Diego Ramírez", type: "Historia clínica", date: "Ayer" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada':
        return 'success';
      case 'En progreso':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Panel Médico</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>¡Bienvenido, {user?.firstName}!</h2>
          <p>Tus consultas y pacientes de hoy</p>
        </div>

        <div className="page-content">
          {/* Quick Actions */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Acciones Rápidas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="quick-actions">
                <IonButton expand="block" routerLink="/appointments" color="primary">
                  <IonIcon slot="start" icon={calendar} />
                  Mi Agenda del Día
                </IonButton>
                <IonButton expand="block" routerLink="/videocall" color="secondary">
                  <IonIcon slot="start" icon={videocam} />
                  Iniciar Videoconsulta
                </IonButton>
                <IonButton expand="block" routerLink="/medical-records" color="success" fill="outline">
                  <IonIcon slot="start" icon={clipboard} />
                  Historias Clínicas
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

          {/* Próximos Pacientes */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={people} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Próximos Pacientes
                </IonCardTitle>
                <IonBadge color="primary">{nextPatients.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {nextPatients.length === 0 ? (
                <div className="empty-state">
                  <IonIcon icon={calendar} />
                  <h3>No hay pacientes pendientes</h3>
                  <p>No tienes consultas programadas</p>
                </div>
              ) : (
                <IonList lines="full">
                  {nextPatients.map((appointment) => (
                    <IonItem key={appointment.id} button detail>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <IonLabel>
                            <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                              {appointment.patientName}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#6b7280' }}>
                              <IonIcon icon={time} style={{ marginRight: '4px', verticalAlign: 'middle', fontSize: '14px' }} />
                              {appointment.time}
                            </p>
                          </IonLabel>
                          <IonChip color="primary">
                            {appointment.type || 'Consulta General'}
                          </IonChip>
                        </div>
                        {appointment.reason && (
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            Motivo: {appointment.reason}
                          </p>
                        )}
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCardContent>
          </IonCard>

          {/* Consultas Recientes */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={clipboard} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Consultas Recientes
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {recentConsultations.map((consultation, index) => (
                  <IonItem key={index} button detail>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {consultation.patient}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            {consultation.time}
                          </p>
                        </IonLabel>
                        <IonBadge color={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </IonBadge>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {consultation.diagnosis}
                      </p>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Reportes Pendientes */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={documentText} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Reportes Pendientes
                </IonCardTitle>
                <IonBadge color="warning">{pendingReports.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {pendingReports.map((report, index) => (
                  <IonItem key={index} button detail>
                    <IonLabel>
                      <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {report.patient}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {report.type}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {report.date}
                      </p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/reports">
                Ver todos los reportes
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
