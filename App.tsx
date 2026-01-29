import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router';

/* Pages - versión web simple */
import { LoginPage } from './pages/LoginPage';
import { ReceptionDashboard } from './pages/ReceptionDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { BoardDashboard } from './pages/BoardDashboard';
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AffiliatesListPage } from './pages/AffiliatesListPage';
import { AppointmentsListPage } from './pages/AppointmentsListPage';
import { AffiliateAppointmentsPage } from './pages/AffiliateAppointmentsPage';
import { PaymentsListPage } from './pages/PaymentsListPage';
import { BillingPage } from './components/BillingPage';
import { PayablesPage } from './components/PayablesPage';
import { CollectionsPage } from './components/CollectionsPage';
import { FinancialReportsPage } from './components/FinancialReportsPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SecurityPage } from './components/SecurityPage';
import { CatalogManagementPage } from './components/CatalogManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { VideoCallPage } from './pages/VideoCallPage';
import { DoctorFeesReportPage } from './pages/DoctorFeesReportPage';
import { DoctorManagementPage } from './pages/DoctorManagementPage';
import PatientCallView from './pages/PatientCallView';
import DoctorConsultView from './pages/DoctorConsultView';
import { Sidebar } from './components/Sidebar';
import { Toaster } from './components/ui/sonner';

/* Auth Store */
import { useAuthStore } from './store/useAuthStore';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useAuthStore(state => state.user?.role);

  const getDashboardRoute = () => {
    switch(userRole) {
      case 'recepcion': return '/dashboard/recepcion';
      case 'doctor': return '/dashboard/doctor';
      case 'finanzas': return '/dashboard/finanzas';
      case 'junta': return '/dashboard/junta';
      case 'affiliate': return '/dashboard/affiliate';
      case 'superadmin': return '/dashboard/admin';
      default: return '/dashboard/finanzas';
    }
  };

  const handleNavigate = (page: string) => {
    switch(page) {
      case 'dashboard':
        navigate(getDashboardRoute());
        break;
      case 'appointments':
        navigate('/appointments');
        break;
      case 'affiliate-appointments':
        navigate('/affiliate-appointments');
        break;
      case 'affiliates':
        navigate('/affiliates');
        break;
      case 'payments':
        navigate('/payments');
        break;
      case 'videocall':
        navigate('/videocall');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'board':
        navigate('/dashboard/junta');
        break;
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'payables':
        navigate('/payables');
        break;
      case 'collections':
        navigate('/collections');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'security':
        navigate('/security');
        break;
      case 'catalogs':
        navigate('/catalogs');
        break;
      default:
        console.log(`Página no reconocida: ${page}`);
    }
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/affiliate-appointments')) return 'affiliate-appointments';
    if (path.includes('/appointments')) return 'appointments';
    if (path.includes('/affiliates')) return 'affiliates';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/billing')) return 'billing';
    if (path.includes('/payables')) return 'payables';
    if (path.includes('/collections')) return 'collections';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/videocall')) return 'videocall';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/security')) return 'security';
    if (path.includes('/catalogs')) return 'catalogs';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F2F2F2' }}>
      <Sidebar 
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        userRole={userRole as any}
        showDemoControls={false}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Routes>
              <Route path="/login" element={<Navigate to={getDashboardRoute()} replace />} />
              
              <Route path="/dashboard/recepcion" element={
                userRole === 'recepcion' ? <ReceptionDashboard /> : <Navigate to="/login" replace />
              } />
              <Route path="/dashboard/doctor" element={
                userRole === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" replace />
              } />
              <Route path="/dashboard/finanzas" element={
                userRole === 'finanzas' ? <FinanceDashboard /> : <Navigate to="/login" replace />
              } />
              <Route path="/dashboard/junta" element={
                userRole === 'junta' ? <BoardDashboard /> : <Navigate to="/login" replace />
              } />
              <Route path="/dashboard/affiliate" element={
                userRole === 'affiliate' ? <AffiliateDashboard /> : <Navigate to="/login" replace />
              } />
              <Route path="/dashboard/admin" element={
                userRole === 'superadmin' ? <SuperAdminDashboard /> : <Navigate to="/login" replace />
              } />
              
              <Route path="/affiliates" element={<AffiliatesListPage />} />
              <Route path="/appointments" element={<AppointmentsListPage />} />
              <Route path="/affiliate-appointments" element={<AffiliateAppointmentsPage />} />
              <Route path="/payments" element={<PaymentsListPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/payables" element={<PayablesPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/reports" element={<FinancialReportsPage />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/catalogs" element={<CatalogManagementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/videocall" element={<VideoCallPage />} />
              <Route path="/doctor-fees-report" element={<DoctorFeesReportPage />} />
              <Route path="/doctor-management" element={<DoctorManagementPage />} />
              
              {/* Rutas de Videoconsultas con Jitsi */}
              <Route path="/call/:appointmentId" element={<PatientCallView />} />
              <Route path="/doctor/consult/:appointmentId" element={<DoctorConsultView />} />
              
              <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} replace />} />
              <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <AppContent />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;