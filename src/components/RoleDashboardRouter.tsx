import { DashboardPage } from "./DashboardPage";
import { DoctorDashboard } from "./DoctorDashboard";
import { FinanceDashboard } from "./FinanceDashboard";
import { ReceptionDashboard } from "./ReceptionDashboard";
import { BoardDashboardPage } from "./BoardDashboardPage";
import { AffiliatePortalPage } from "./AffiliatePortalPage";

interface RoleDashboardRouterProps {
  role: "super-admin" | "finanzas" | "junta-directiva" | "doctor" | "recepcion" | "afiliado";
}

export function RoleDashboardRouter({ role }: RoleDashboardRouterProps) {
  switch (role) {
    case "super-admin":
      return <DashboardPage />;
    
    case "finanzas":
      return <FinanceDashboard />;
    
    case "junta-directiva":
      return <BoardDashboardPage />;
    
    case "doctor":
      return <DoctorDashboard />;
    
    case "recepcion":
      return <ReceptionDashboard />;
    
    case "afiliado":
      return <AffiliatePortalPage />;
    
    default:
      return <DashboardPage />;
  }
}
