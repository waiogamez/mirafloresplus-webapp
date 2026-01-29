import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Pages */
import { LoginPage } from '../ionic-pages/LoginPage';
import { ReceptionDashboard } from '../ionic-pages/ReceptionDashboard';
import { DoctorDashboard } from '../ionic-pages/DoctorDashboard';
import { FinanceDashboard } from '../ionic-pages/FinanceDashboard';
import { BoardDashboard } from '../ionic-pages/BoardDashboard';
import { AffiliateDashboard } from '../ionic-pages/AffiliateDashboard';
import { SuperAdminDashboard } from '../ionic-pages/SuperAdminDashboard';
import { Menu } from './Menu';

/* Auth Store */
import { useAuthStore } from '../store/useAuthStore';

/* Core CSS required for Ionic components */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import '../ionic-theme/variables.css';
import '../globals.css';
import "../ionic-theme/overrides.css";

setupIonicReact();

const App: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userRole = useAuthStore(state => state.user?.role);

  const getDashboardRoute = () => {
    switch(userRole) {
      case 'recepcion':
        return '/dashboard/recepcion';
      case 'doctor':
        return '/dashboard/doctor';
      case 'finanzas':
        return '/dashboard/finanzas';
      case 'junta':
        return '/dashboard/junta';
      case 'affiliate':
        return '/dashboard/affiliate';
      case 'superadmin':
        return '/dashboard/admin';
      default:
        return '/dashboard/finanzas';
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main" when={true}>
          {isAuthenticated && <Menu />}
          
          <IonRouterOutlet id="main">
            {/* Login */}
            <Route exact path="/login">
              {isAuthenticated ? <Redirect to={getDashboardRoute()} /> : <LoginPage />}
            </Route>

            {/* Dashboards por Rol */}
            <Route exact path="/dashboard/recepcion">
              {isAuthenticated && userRole === 'recepcion' ? (
                <ReceptionDashboard />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/dashboard/doctor">
              {isAuthenticated && userRole === 'doctor' ? (
                <DoctorDashboard />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/dashboard/finanzas">
              {isAuthenticated && userRole === 'finanzas' ? (
                <FinanceDashboard />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/dashboard/junta">
              {isAuthenticated && userRole === 'junta' ? (
                <BoardDashboard />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/dashboard/affiliate">
              {isAuthenticated && userRole === 'affiliate' ? (
                <AffiliateDashboard />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route exact path="/dashboard/admin">
              {isAuthenticated && userRole === 'superadmin' ? (
                <SuperAdminDashboard />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            {/* Default Routes */}
            <Route exact path="/dashboard">
              {isAuthenticated ? <Redirect to={getDashboardRoute()} /> : <Redirect to="/login" />}
            </Route>

            <Route exact path="/">
              <Redirect to={isAuthenticated ? getDashboardRoute() : "/login"} />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
