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
  IonLabel
} from '@ionic/react';
import {
  people,
  medkit,
  settings,
  shield,
  statsChart,
  server,
  notifications,
  warning,
  checkmarkCircle,
  key
} from 'ionicons/icons';
import { useAuthStore } from '../store/useAuthStore';

export function SuperAdminDashboard() {
  const user = useAuthStore(state => state.user);

  const metrics = [
    { title: 'Usuarios Totales', value: '2,158', icon: people, color: 'primary', subtitle: '6 roles activos' },
    { title: 'Personal Médico', value: '45', icon: medkit, color: 'success', subtitle: '12 especialidades' },
    { title: 'Salud del Sistema', value: '99.8%', icon: server, color: 'tertiary', subtitle: 'Uptime este mes' },
    { title: 'Incidentes', value: '2', icon: warning, color: 'danger', subtitle: 'Últimas 24h' }
  ];

  const systemHealth = [
    { service: 'Base de Datos', status: 'Operativo', uptime: '99.9%', color: 'success' },
    { service: 'API Backend', status: 'Operativo', uptime: '99.8%', color: 'success' },
    { service: 'Facturación FEL', status: 'Operativo', uptime: '99.5%', color: 'success' },
    { service: 'Videoconsultas', status: 'Degradado', uptime: '95.2%', color: 'warning' },
  ];

  const recentActivity = [
    { action: 'Nuevo usuario creado', user: 'María González', role: 'Afiliado', time: 'Hace 5 min' },
    { action: 'Permisos modificados', user: 'Carlos Méndez', role: 'Finanzas', time: 'Hace 15 min' },
    { action: 'Backup completado', user: 'Sistema', role: 'Automático', time: 'Hace 1 hora' },
    { action: 'Actualización de sistema', user: 'Admin', role: 'Sistema', time: 'Hace 2 horas' },
  ];

  const pendingTasks = [
    { task: 'Revisar logs de seguridad', priority: 'Alta', dueDate: 'Hoy' },
    { task: 'Actualizar certificados SSL', priority: 'Media', dueDate: 'Mañana' },
    { task: 'Backup mensual verificación', priority: 'Alta', dueDate: 'Hoy' },
    { task: 'Auditoría de permisos', priority: 'Baja', dueDate: 'Esta semana' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operativo':
        return 'success';
      case 'Degradado':
        return 'warning';
      case 'Caído':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'danger';
      case 'Media':
        return 'warning';
      case 'Baja':
        return 'success';
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
          <IonTitle>Panel de Administración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="welcome-section">
          <h2>¡Bienvenido, {user?.firstName}!</h2>
          <p>Control total del sistema Miraflores Plus</p>
        </div>

        <div className="page-content">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Acciones Administrativas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="quick-actions">
                <IonButton expand="block" routerLink="/admin/users" color="primary">
                  <IonIcon slot="start" icon={people} />
                  Gestión de Usuarios
                </IonButton>
                <IonButton expand="block" routerLink="/admin/permissions" color="success">
                  <IonIcon slot="start" icon={shield} />
                  Permisos y Roles
                </IonButton>
                <IonButton expand="block" routerLink="/admin/settings" fill="outline">
                  <IonIcon slot="start" icon={settings} />
                  Configuración del Sistema
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
              <IonCardTitle>
                <IonIcon icon={server} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Estado del Sistema
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {systemHealth.map((service, index) => (
                  <IonItem key={index}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{service.service}</h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            Uptime: {service.uptime}
                          </p>
                        </IonLabel>
                        <IonBadge color={getStatusColor(service.status)}>
                          {service.status}
                        </IonBadge>
                      </div>
                    </div>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/admin/system">
                Ver detalles del sistema
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={notifications} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Actividad Reciente
                </IonCardTitle>
                <IonBadge color="primary">{recentActivity.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {recentActivity.map((activity, index) => (
                  <IonItem key={index}>
                    <div style={{ width: '100%' }}>
                      <IonLabel>
                        <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                          {activity.action}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                          {activity.user} • {activity.role}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          {activity.time}
                        </p>
                      </IonLabel>
                    </div>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" fill="clear" routerLink="/admin/logs">
                Ver todos los logs
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonCardTitle>
                  <IonIcon icon={warning} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Tareas Pendientes
                </IonCardTitle>
                <IonBadge color="danger">{pendingTasks.length}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonList lines="full">
                {pendingTasks.map((task, index) => (
                  <IonItem key={index} button detail>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <IonLabel>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {task.task}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            Vence: {task.dueDate}
                          </p>
                        </IonLabel>
                        <IonBadge color={getPriorityColor(task.priority)}>
                          {task.priority}
                        </IonBadge>
                      </div>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardContent>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <IonIcon icon={shield} style={{ fontSize: '48px', color: 'var(--ion-color-primary)', marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
                  Sistema Seguro y Protegido
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
                  Todos los datos están encriptados y protegidos según estándares HIPAA
                </p>
                <IonButton expand="block" routerLink="/admin/security">
                  <IonIcon slot="start" icon={key} />
                  Panel de Seguridad
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
