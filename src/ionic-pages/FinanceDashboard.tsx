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
  IonChip
} from '@ionic/react';
import {
  cash,
  trendingUp,
  trendingDown,
  documentText,
  card,
  alertCircle,
  checkmarkCircle,
  downloadOutline
} from 'ionicons/icons';
import { useAuthStore } from '../store/useAuthStore';

export function FinanceDashboard() {
  const user = useAuthStore(state => state.user);

  const metrics = [
    { 
      title: 'Ingresos del Mes', 
      value: 'Q 285,450', 
      icon: cash, 
      color: 'success',
      subtitle: '+12% vs mes anterior',
      trend: 'up'
    },
    { 
      title: 'Cobros Pendientes', 
      value: 'Q 45,200', 
      icon: card, 
      color: 'warning',
      subtitle: '18 facturas pendientes',
      trend: 'neutral'
    },
    { 
      title: 'Pagos Atrasados', 
      value: 'Q 12,300', 
      icon: alertCircle, 
      color: 'danger',
      subtitle: '5 afiliados',
      trend: 'down'
    },
    { 
      title: 'Facturas Emitidas', 
      value: '156', 
      icon: documentText, 
      color: 'primary',
      subtitle: 'Este mes',
      trend: 'up'
    }
  ];

  const pendingPayments = [
    { 
      affiliate: "María González", 
      id: "AF-2645",
      amount: "Q 850.00", 
      dueDate: "15/01/2025",
      daysOverdue: 12,
      status: "Vencido"
    },
    { 
      affiliate: "Carlos Rodríguez", 
      id: "AF-2589",
      amount: "Q 1,200.00", 
      dueDate: "20/01/2025",
      daysOverdue: 7,
      status: "Vencido"
    },
    { 
      affiliate: "Ana Martínez", 
      id: "AF-2701",
      amount: "Q 650.00", 
      dueDate: "25/01/2025",
      daysOverdue: 2,
      status: "Vencido"
    },
    { 
      affiliate: "Pedro López", 
      id: "AF-2458",
      amount: "Q 950.00", 
      dueDate: "28/01/2025",
      daysOverdue: 0,
      status: "Por Vencer"
    },
  ];

  const recentTransactions = [
    { 
      type: "Pago recibido",
      affiliate: "Laura Hernández",
      amount: "Q 1,200.00",
      date: "Hoy 10:30 AM",
      method: "Tarjeta de crédito",
      status: "Completado"
    },
    { 
      type: "Pago recibido",
      affiliate: "Diego Castro",
      amount: "Q 850.00",
      date: "Hoy 09:15 AM",
      method: "Transferencia bancaria",
      status: "Completado"
    },
    { 
      type: "Factura emitida",
      affiliate: "Patricia Ruiz",
      amount: "Q 1,500.00",
      date: "Ayer 4:20 PM",
      method: "Plan Premium",
      status: "Pendiente"
    },
  ];

  const felPending = [
    { invoice: "F001-00002345", affiliate: "María González", amount: "Q 850.00", date: "Hace 2 horas" },
    { invoice: "F001-00002344", affiliate: "Carlos Rodríguez", amount: "Q 1,200.00", date: "Hace 3 horas" },
    { invoice: "F001-00002343", affiliate: "Ana Martínez", amount: "Q 650.00", date: "Hace 5 horas" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Vencido':
        return 'danger';
      case 'Por Vencer':
        return 'warning';
      default:
        return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Panel de Finanzas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>¡Bienvenido, {user?.firstName}!</h2>
          <p>Control financiero y facturación</p>
        </div>

        <div className="page-content">
          {/* Quick Actions */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Acciones Rápidas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="quick-actions">
                <IonButton expand="block" routerLink="/payments/new" color="success">
                  <IonIcon slot="start" icon={cash} />
                  Registrar Pago
                </IonButton>
                <IonButton expand="block" routerLink="/billing/fel" color="primary">
                  <IonIcon slot="start" icon={documentText} />
                  Emitir Factura FEL
                </IonButton>
                <IonButton expand="block" routerLink="/reports/financial" color="secondary" fill="outline">
                  <IonIcon slot="start" icon={downloadOutline} />
                  Exportar Reportes
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        {metric.trend === 'up' && (
                          <IonIcon icon={trendingUp} style={{ fontSize: '14px', color: '#16a34a' }} />
                        )}
                        {metric.trend === 'down' && (
                          <IonIcon icon={trendingDown} style={{ fontSize: '14px', color: '#dc2626' }} />
                        )}
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                          {metric.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          {/* Pagos Pendientes */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={alertCircle} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Cobros Pendientes y Vencidos
                </IonCardTitle>
                <IonBadge color="danger">{pendingPayments.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {pendingPayments.map((payment, index) => (
                  <IonItem key={index} button detail>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {payment.affiliate}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            ID: {payment.id} • Vence: {payment.dueDate}
                          </p>
                        </IonLabel>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ fontWeight: 700, color: '#dc2626', margin: '0 0 4px 0' }}>
                            {payment.amount}
                          </h3>
                          <IonBadge color={getStatusColor(payment.status)}>
                            {payment.status}
                          </IonBadge>
                        </div>
                      </div>
                      {payment.daysOverdue > 0 && (
                        <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                          ⚠️ {payment.daysOverdue} días de retraso
                        </p>
                      )}
                    </div>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/payments">
                Ver todos los pagos
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Transacciones Recientes */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={cash} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Transacciones Recientes
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {recentTransactions.map((transaction, index) => (
                  <IonItem key={index}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {transaction.type}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            {transaction.affiliate} • {transaction.date}
                          </p>
                        </IonLabel>
                        <div style={{ textAlign: 'right' }}>
                          <h3 style={{ fontWeight: 700, color: '#16a34a', margin: '0 0 4px 0' }}>
                            {transaction.amount}
                          </h3>
                          <IonBadge color={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </IonBadge>
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {transaction.method}
                      </p>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Facturas FEL Pendientes */}
          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={documentText} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Facturas FEL Pendientes
                </IonCardTitle>
                <IonBadge color="warning">{felPending.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {felPending.map((fel, index) => (
                  <IonItem key={index} button detail>
                    <IonLabel>
                      <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {fel.invoice}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>
                        {fel.affiliate} • {fel.amount}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {fel.date}
                      </p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/billing/fel">
                Gestionar facturas FEL
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
