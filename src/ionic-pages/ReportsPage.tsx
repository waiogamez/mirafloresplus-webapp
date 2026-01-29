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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { downloadOutline, statsChart, documentText, calendar } from 'ionicons/icons';

export function ReportsPage() {
  const reports = [
    { title: 'Reporte Financiero Mensual', description: 'Ingresos, gastos y balance del mes', icon: statsChart, color: 'success' },
    { title: 'Reporte de Afiliados', description: 'Lista completa de afiliados activos', icon: documentText, color: 'primary' },
    { title: 'Reporte de Citas', description: 'Historial de citas por período', icon: calendar, color: 'secondary' },
    { title: 'Reporte Ejecutivo', description: 'Métricas generales para Junta Directiva', icon: statsChart, color: 'tertiary' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Centro de Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Reportes Disponibles</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {reports.map((report, index) => (
                  <IonItem key={index} button detail>
                    <IonIcon icon={report.icon} slot="start" color={report.color} style={{ fontSize: '28px' }} />
                    <IonLabel>
                      <h3 style={{ fontWeight: 600 }}>{report.title}</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>{report.description}</p>
                    </IonLabel>
                    <IonButton fill="clear" slot="end">
                      <IonIcon icon={downloadOutline} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <IonIcon icon={downloadOutline} style={{ fontSize: '48px', color: 'var(--ion-color-primary)', marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px 0' }}>Personalizar Reporte</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  Selecciona fechas, filtros y formato de exportación
                </p>
                <IonButton color="primary" expand="block">
                  Crear Reporte Personalizado
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
