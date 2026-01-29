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
  IonList,
  IonItem,
  IonBadge,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { documentText, add, checkmarkCircle, timeOutline, alertCircle } from 'ionicons/icons';

const mockInvoices = [
  { invoice: 'F001-00002345', affiliate: 'María González', amount: 'Q 850.00', date: '28 Ene 2025', status: 'Certificada' },
  { invoice: 'F001-00002344', affiliate: 'Carlos Rodríguez', amount: 'Q 1,200.00', date: '27 Ene 2025', status: 'Certificada' },
  { invoice: 'F001-00002343', affiliate: 'Ana Martínez', amount: 'Q 650.00', date: '25 Ene 2025', status: 'Pendiente' },
  { invoice: 'F001-00002342', affiliate: 'Pedro López', amount: 'Q 1,500.00', date: '20 Ene 2025', status: 'Error' },
];

export function FELInvoiceListPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Certificada': return 'success';
      case 'Pendiente': return 'warning';
      case 'Error': return 'danger';
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
          <IonTitle>Facturación Electrónica (FEL)</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <div className="quick-stats-grid">
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={documentText} style={{ fontSize: '32px', color: 'var(--ion-color-primary)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-primary)' }}>156</h3>
                <p className="metric-title">Facturas Este Mes</p>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={checkmarkCircle} style={{ fontSize: '32px', color: 'var(--ion-color-success)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-success)' }}>148</h3>
                <p className="metric-title">Certificadas</p>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={timeOutline} style={{ fontSize: '32px', color: 'var(--ion-color-warning)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-warning)' }}>5</h3>
                <p className="metric-title">Pendientes</p>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent style={{ textAlign: 'center' }}>
                <IonIcon icon={alertCircle} style={{ fontSize: '32px', color: 'var(--ion-color-danger)' }} />
                <h3 className="metric-value" style={{ color: 'var(--ion-color-danger)' }}>3</h3>
                <p className="metric-title">Con Errores</p>
              </IonCardContent>
            </IonCard>
          </div>

          <IonCard>
            <IonCardContent style={{ padding: 0 }}>
              <IonList lines="full">
                {mockInvoices.map(inv => (
                  <IonItem key={inv.invoice} button detail>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{inv.invoice}</h3>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                            {inv.affiliate}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ fontWeight: 700, margin: '0 0 4px 0', color: '#16a34a' }}>{inv.amount}</h3>
                          <IonBadge color={getStatusColor(inv.status)}>{inv.status}</IonBadge>
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                        Fecha: {inv.date}
                      </p>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
