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
  IonButton
} from '@ionic/react';
import { cash, card, checkmarkCircle, alertCircle, timeOutline } from 'ionicons/icons';
import { useState } from 'react';

const mockPayments = [
  { id: 'PAY-001', affiliate: 'María González', amount: 'Q 1,200.00', date: '28 Ene 2025', status: 'Completado', method: 'Tarjeta' },
  { id: 'PAY-002', affiliate: 'Carlos Rodríguez', amount: 'Q 850.00', date: '27 Ene 2025', status: 'Completado', method: 'Transferencia' },
  { id: 'PAY-003', affiliate: 'Ana Martínez', amount: 'Q 650.00', date: '25 Ene 2025', status: 'Pendiente', method: 'Efectivo' },
  { id: 'PAY-004', affiliate: 'Pedro López', amount: 'Q 1,500.00', date: '20 Ene 2025', status: 'Vencido', method: 'Tarjeta' },
];

export function PaymentsListPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockPayments.filter(p => statusFilter === 'all' || p.status.toLowerCase() === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'success';
      case 'Pendiente': return 'warning';
      case 'Vencido': return 'danger';
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
          <IonTitle>Gestión de Pagos</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={statusFilter} onIonChange={e => setStatusFilter(e.detail.value!)}>
            <IonSegmentButton value="all"><IonLabel>Todos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="completado"><IonLabel>Completados</IonLabel></IonSegmentButton>
            <IonSegmentButton value="pendiente"><IonLabel>Pendientes</IonLabel></IonSegmentButton>
            <IonSegmentButton value="vencido"><IonLabel>Vencidos</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="quick-stats-grid">
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={cash} style={{ fontSize: '32px', color: 'var(--ion-color-success)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-success)' }}>Q 285,450</h3>
                <p className="metric-title">Total del Mes</p>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={checkmarkCircle} style={{ fontSize: '32px', color: 'var(--ion-color-primary)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-primary)' }}>156</h3>
                <p className="metric-title">Pagos Procesados</p>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={alertCircle} style={{ fontSize: '32px', color: 'var(--ion-color-danger)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-danger)' }}>Q 12,300</h3>
                <p className="metric-title">Atrasados</p>
              </IonCardContent>
            </IonCard>
          </div>

          <IonCard>
            <IonCardContent style={{ padding: 0 }}>
              <IonList lines="full">
                {filtered.map(payment => (
                  <IonItem key={payment.id} button detail>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{payment.affiliate}</h3>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                            {payment.id} • {payment.date}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ fontWeight: 700, margin: '0 0 4px 0' }}>{payment.amount}</h3>
                          <IonBadge color={getStatusColor(payment.status)}>{payment.status}</IonBadge>
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                        <IonIcon icon={card} style={{ marginRight: '4px' }} />
                        {payment.method}
                      </p>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
