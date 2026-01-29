import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonBadge,
  IonIcon,
  IonChip,
  IonFab,
  IonFabButton,
  IonButton
} from '@ionic/react';
import { 
  add, 
  calendar,
  time,
  person,
  medkit,
  checkmarkCircle,
  alertCircle,
  helpCircle
} from 'ionicons/icons';
import { useState } from 'react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function AppointmentsListPage() {
  const [selectedDate, setSelectedDate] = useState<string>('today');
  
  const appointments = useAppointmentStore(state => state.appointments);
  const getTodayAppointments = useAppointmentStore(state => state.getTodayAppointments);

  const todayAppointments = getTodayAppointments();

  const getFilteredAppointments = () => {
    switch (selectedDate) {
      case 'today':
        return todayAppointments;
      case 'week':
        // Filter appointments for this week
        return appointments.slice(0, 20);
      case 'all':
        return appointments;
      default:
        return todayAppointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completada':
        return 'success';
      case 'En Progreso':
        return 'warning';
      case 'Confirmada':
        return 'primary';
      case 'Programada':
        return 'secondary';
      case 'Cancelada':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completada':
        return checkmarkCircle;
      case 'En Progreso':
        return time;
      case 'Confirmada':
      case 'Programada':
        return calendar;
      case 'Cancelada':
        return alertCircle;
      default:
        return helpCircle;
    }
  };

  const statusCounts = {
    completed: appointments.filter(a => a.status === 'Completada').length,
    inProgress: appointments.filter(a => a.status === 'En Progreso').length,
    scheduled: appointments.filter(a => a.status === 'Programada' || a.status === 'Confirmada').length,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Gestión de Citas</IonTitle>
        </IonToolbar>

        {/* Date Filter */}
        <IonToolbar>
          <IonSegment value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value as string)}>
            <IonSegmentButton value="today">
              <IonLabel>Hoy ({todayAppointments.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="week">
              <IonLabel>Esta Semana</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="all">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          {/* Summary Cards */}
          <div className="quick-stats-grid" style={{ marginBottom: '16px' }}>
            <IonCard className="metric-card">
              <IonCardContent>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={calendar} style={{ fontSize: '32px', color: 'var(--ion-color-primary)' }} />
                  <h3 className="metric-value" style={{ color: 'var(--ion-color-primary)' }}>
                    {statusCounts.scheduled}
                  </h3>
                  <p className="metric-title">Programadas</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="metric-card">
              <IonCardContent>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={time} style={{ fontSize: '32px', color: 'var(--ion-color-warning)' }} />
                  <h3 className="metric-value" style={{ color: 'var(--ion-color-warning)' }}>
                    {statusCounts.inProgress}
                  </h3>
                  <p className="metric-title">En Progreso</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="metric-card">
              <IonCardContent>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={checkmarkCircle} style={{ fontSize: '32px', color: 'var(--ion-color-success)' }} />
                  <h3 className="metric-value" style={{ color: 'var(--ion-color-success)' }}>
                    {statusCounts.completed}
                  </h3>
                  <p className="metric-title">Completadas</p>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Appointments List */}
          <IonCard>
            <IonCardContent style={{ padding: 0 }}>
              {filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  <IonIcon icon={calendar} />
                  <h3>No hay citas</h3>
                  <p>No hay citas para el período seleccionado</p>
                  <IonButton color="primary" style={{ marginTop: '16px' }}>
                    <IonIcon slot="start" icon={add} />
                    Agendar Nueva Cita
                  </IonButton>
                </div>
              ) : (
                <IonList lines="full">
                  {filteredAppointments.map((appointment) => (
                    <IonItem key={appointment.id} button detail>
                      <div style={{ width: '100%' }}>
                        {/* Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <h3 style={{ fontWeight: 600, margin: '0 0 4px 0', fontSize: '16px' }}>
                              {appointment.patientName}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                              <IonIcon icon={time} style={{ marginRight: '4px', verticalAlign: 'middle', fontSize: '14px' }} />
                              {appointment.date} • {appointment.time}
                            </p>
                          </div>
                          <IonBadge color={getStatusColor(appointment.status)}>
                            <IonIcon icon={getStatusIcon(appointment.status)} style={{ marginRight: '4px', fontSize: '12px' }} />
                            {appointment.status}
                          </IonBadge>
                        </div>

                        {/* Details Row */}
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span>
                            <IonIcon icon={person} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {appointment.doctorName}
                          </span>
                          {appointment.type && (
                            <IonChip style={{ fontSize: '11px', height: '24px', margin: 0 }}>
                              <IonIcon icon={medkit} style={{ fontSize: '12px' }} />
                              <IonLabel>{appointment.type}</IonLabel>
                            </IonChip>
                          )}
                        </div>

                        {/* Reason */}
                        {appointment.reason && (
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0', fontStyle: 'italic' }}>
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
        </div>

        {/* FAB - Add Appointment */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
