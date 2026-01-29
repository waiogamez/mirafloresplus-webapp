import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonAvatar,
  IonButton
} from '@ionic/react';
import {
  home,
  calendar,
  people,
  cash,
  documentText,
  statsChart,
  videocam,
  medkit,
  card,
  settings,
  shield,
  logOut,
  person
} from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './Menu.css';

interface AppPage {
  url: string;
  icon: string;
  title: string;
  roles?: string[];
}

const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: home
  },
  {
    title: 'Citas',
    url: '/appointments',
    icon: calendar,
    roles: ['recepcion', 'doctor', 'affiliate']
  },
  {
    title: 'Afiliados',
    url: '/affiliates',
    icon: people,
    roles: ['recepcion', 'finanzas', 'superadmin']
  },
  {
    title: 'Pagos',
    url: '/payments',
    icon: cash,
    roles: ['recepcion', 'finanzas']
  },
  {
    title: 'Facturación FEL',
    url: '/billing/fel',
    icon: documentText,
    roles: ['finanzas']
  },
  {
    title: 'Reportes',
    url: '/reports',
    icon: statsChart,
    roles: ['finanzas', 'junta', 'superadmin']
  },
  {
    title: 'Videoconsultas',
    url: '/videocall',
    icon: videocam,
    roles: ['doctor', 'affiliate']
  },
  {
    title: 'Historial Médico',
    url: '/medical-history',
    icon: medkit,
    roles: ['doctor', 'affiliate']
  },
  {
    title: 'Mi Plan',
    url: '/my-plan',
    icon: card,
    roles: ['affiliate']
  },
  {
    title: 'Administración',
    url: '/admin',
    icon: shield,
    roles: ['superadmin']
  }
];

export const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case 'recepcion':
        return 'Recepción';
      case 'doctor':
        return 'Doctor';
      case 'finanzas':
        return 'Finanzas';
      case 'junta':
        return 'Junta Directiva';
      case 'affiliate':
        return 'Afiliado';
      case 'superadmin':
        return 'Super Admin';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case 'recepcion':
        return '#0477BF';
      case 'doctor':
        return '#62BF04';
      case 'finanzas':
        return '#9DD973';
      case 'junta':
        return '#2BB9D9';
      case 'affiliate':
        return '#F59E0B';
      case 'superadmin':
        return '#EF4444';
      default:
        return '#92949c';
    }
  };

  // Filter pages based on user role
  const visiblePages = appPages.filter(page => {
    if (!page.roles) return true;
    return page.roles.includes(user?.role || '');
  });

  return (
    <IonMenu contentId="main" type="reveal" disabled={false}>
      <IonContent>
        {/* User Profile Section */}
        <div className="menu-header">
          <div className="logo-section">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L4 14V34L24 44L44 34V14L24 4Z" fill="#0477BF"/>
              <path d="M24 14L14 19V29L24 34L34 29V19L24 14Z" fill="#2BB9D9"/>
              <circle cx="24" cy="24" r="4" fill="white"/>
            </svg>
            <div>
              <h3 className="app-title">MIRAFLORES PLUS</h3>
              <p className="app-tagline">¡Tu salud, a un clic!</p>
            </div>
          </div>

          <div className="user-profile">
            <IonAvatar className="user-avatar">
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: getRoleColor(user?.role),
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            </IonAvatar>
            <div className="user-info">
              <h4>{user?.firstName} {user?.lastName}</h4>
              <p style={{ color: getRoleColor(user?.role), fontWeight: 600 }}>
                {getRoleLabel(user?.role)}
              </p>
              <IonNote>{user?.email}</IonNote>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <IonList id="menu-list">
          <IonListHeader>Navegación</IonListHeader>
          {visiblePages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={location.pathname === appPage.url ? 'selected' : ''}
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon aria-hidden="true" slot="start" icon={appPage.icon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        {/* Settings & Logout */}
        <IonList id="menu-list-bottom">
          <IonListHeader>Configuración</IonListHeader>
          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/settings" lines="none" detail={false}>
              <IonIcon aria-hidden="true" slot="start" icon={settings} />
              <IonLabel>Configuración</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/profile" lines="none" detail={false}>
              <IonIcon aria-hidden="true" slot="start" icon={person} />
              <IonLabel>Mi Perfil</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonItem button onClick={handleLogout} lines="none" detail={false}>
            <IonIcon aria-hidden="true" slot="start" icon={logOut} color="danger" />
            <IonLabel color="danger">Cerrar Sesión</IonLabel>
          </IonItem>
        </IonList>

        {/* Footer */}
        <div className="menu-footer">
          <IonNote>
            <p>© 2025 Miraflores Plus</p>
            <p>Hospital Miraflores - Zona 10</p>
            <p>Versión 1.0.0</p>
          </IonNote>
        </div>
      </IonContent>
    </IonMenu>
  );
};
