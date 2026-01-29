import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings,
  Activity,
  Video,
  TrendingUp,
  Receipt,
  Shield,
  UserCog,
  Lock,
  Wallet,
  Database,
  Menu,
  X,
  Calculator
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { useState } from "react";
import { Logo } from "./Logo";

// Menú para Recepción (gestión operativa diaria)
const recepcionMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard", dataTour: "sidebar-dashboard" },
  { icon: Calendar, label: "Citas", page: "appointments", dataTour: "sidebar-appointments" },
  { icon: Users, label: "Afiliados", page: "affiliates", dataTour: "sidebar-affiliates" },
  { icon: Calculator, label: "Cotizador", page: "payments" },
  { icon: CreditCard, label: "Cobros y Pagos", page: "collections" },
  { icon: Receipt, label: "Facturación", page: "billing" },
  { icon: Wallet, label: "Cuentas por Pagar", page: "payables" },
  { icon: Settings, label: "Configuración", page: "settings" },
];

// Menú para Doctor (atención médica)
const doctorMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard", dataTour: "sidebar-dashboard" },
  { icon: Calendar, label: "Mis Citas", page: "appointments", dataTour: "sidebar-appointments" },
  { icon: Video, label: "Video Llamada", page: "videocall", dataTour: "video-call" },
  { icon: Users, label: "Pacientes", page: "affiliates", dataTour: "sidebar-patients" },
  { icon: Settings, label: "Configuración", page: "settings" },
];

// Menú para Finanzas (gestión financiera y aprobaciones)
const finanzasMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard", dataTour: "sidebar-dashboard" },
  { icon: Wallet, label: "Cuentas por Pagar", page: "payables", dataTour: "sidebar-accounts" },
  { icon: Calculator, label: "Cotizador", page: "payments" },
  { icon: Receipt, label: "Facturación", page: "billing", dataTour: "sidebar-billing" },
  { icon: FileText, label: "Reportes Financieros", page: "reports", dataTour: "sidebar-reports" },
  { icon: Users, label: "Afiliados", page: "affiliates" },
  { icon: Settings, label: "Configuración", page: "settings" },
];

// Menú para Junta Directiva (vista ejecutiva)
const juntaMenuItems = [
  { icon: TrendingUp, label: "Tablero Ejecutivo", page: "board", dataTour: "sidebar-board" },
  { icon: FileText, label: "Reportes", page: "reports" },
  { icon: Wallet, label: "Cuentas por Pagar", page: "payables", dataTour: "sidebar-accounts" },
  { icon: Users, label: "Afiliados", page: "affiliates" },
  { icon: Settings, label: "Configuración", page: "settings" },
];

// Menú para Super Admin (gestión de la plataforma)
const superAdminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard", dataTour: "sidebar-dashboard" },
  { icon: Shield, label: "Panel de Control", page: "admin", dataTour: "sidebar-admin" },
  { icon: Database, label: "Gestión de Catálogos", page: "catalogs", dataTour: "sidebar-catalog" },
  { icon: Users, label: "Usuarios", page: "affiliates" },
  { icon: TrendingUp, label: "Tablero Ejecutivo", page: "board" },
  { icon: FileText, label: "Reportes", page: "reports" },
  { icon: Calendar, label: "Citas", page: "appointments" },
  { icon: Receipt, label: "Facturación", page: "billing" },
  { icon: Calculator, label: "Cotizador", page: "payments" },
  { icon: Wallet, label: "Cuentas por Pagar", page: "payables" },
  { icon: Activity, label: "Analíticas", page: "analytics" },
  { icon: Lock, label: "Seguridad", page: "security", dataTour: "sidebar-security" },
  { icon: Settings, label: "Configuración", page: "settings" },
];

// Menú para Afiliado/Paciente (portal de paciente)
const affiliateMenuItems = [
  { icon: LayoutDashboard, label: "Mi Portal", page: "dashboard", dataTour: "sidebar-portal" },
  { icon: Calendar, label: "Mis Citas", page: "affiliate-appointments", dataTour: "sidebar-appointments" },
  { icon: Settings, label: "Mi Perfil", page: "settings" },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: "recepcion" | "doctor" | "finanzas" | "junta" | "superadmin" | "affiliate";
  showDemoControls?: boolean;
}

export function Sidebar({ currentPage, onNavigate, userRole = "recepcion", showDemoControls = false }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Compute menu items based on current userRole
  const menuItems = 
    userRole === "superadmin" ? superAdminMenuItems :
    userRole === "junta" ? juntaMenuItems :
    userRole === "finanzas" ? finanzasMenuItems :
    userRole === "doctor" ? doctorMenuItems :
    userRole === "affiliate" ? affiliateMenuItems :
    recepcionMenuItems;

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleRoleChange = (role: string) => {
    try {
      // Assuming there's a function to switch roles, if not, remove this block
      // switchRole(role as any);
    } catch (error) {
      console.error('Error switching role:', error);
    }
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-xs text-[#2BB9D9] text-center italic" role="text">
            ¡Tu salud, a un clic de distancia!
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <nav 
        id="navigation"
        className="flex-1 p-4" 
        role="navigation" 
        aria-label="Navegación principal"
      >
        <ul role="menubar" className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <li key={item.label} role="none">
                <button
                  role="menuitem"
                  onClick={() => handleNavigation(item.page)}
                  aria-label={`Navegar a ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  data-tour={item.dataTour}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0477BF] focus-visible:ring-offset-2 ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={isActive ? { backgroundColor: '#0477BF' } : {}}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Demo Controls - Role Switcher */}
      {showDemoControls && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <p className="text-xs text-gray-500 text-center mb-2">
            Cambiar Rol (Demo)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => handleRoleChange("recepcion")}
              style={{ 
                backgroundColor: userRole === "recepcion" ? "#0477BF" : "white",
                color: userRole === "recepcion" ? "white" : "#0477BF",
                borderColor: "#0477BF",
                borderWidth: "1px"
              }}
              className="text-xs h-auto py-2"
            >
              Recepción
            </Button>
            <Button
              size="sm"
              onClick={() => handleRoleChange("doctor")}
              style={{ 
                backgroundColor: userRole === "doctor" ? "#62BF04" : "white",
                color: userRole === "doctor" ? "white" : "#62BF04",
                borderColor: "#62BF04",
                borderWidth: "1px"
              }}
              className="text-xs h-auto py-2"
            >
              Doctor
            </Button>
            <Button
              size="sm"
              onClick={() => handleRoleChange("finanzas")}
              style={{ 
                backgroundColor: userRole === "finanzas" ? "#F97316" : "white",
                color: userRole === "finanzas" ? "white" : "#F97316",
                borderColor: "#F97316",
                borderWidth: "1px"
              }}
              className="text-xs h-auto py-2"
            >
              Finanzas
            </Button>
            <Button
              size="sm"
              onClick={() => handleRoleChange("junta")}
              style={{ 
                backgroundColor: userRole === "junta" ? "#2BB9D9" : "white",
                color: userRole === "junta" ? "white" : "#2BB9D9",
                borderColor: "#2BB9D9",
                borderWidth: "1px"
              }}
              className="text-xs h-auto py-2"
            >
              Junta
            </Button>
            <Button
              size="sm"
              onClick={() => handleRoleChange("affiliate")}
              style={{ 
                backgroundColor: userRole === "affiliate" ? "#9DD973" : "white",
                color: userRole === "affiliate" ? "white" : "#9DD973",
                borderColor: "#9DD973",
                borderWidth: "1px"
              }}
              className="text-xs h-auto py-2"
            >
              Afiliado
            </Button>
            <Button
              size="sm"
              onClick={() => handleRoleChange("superadmin")}
              style={{ 
                backgroundColor: userRole === "superadmin" ? "#9333EA" : "white",
                color: userRole === "superadmin" ? "white" : "#9333EA",
                borderColor: "#9333EA",
                borderWidth: "1px"
              }}
              className="text-xs h-auto py-2"
            >
              Admin
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center" role="contentinfo">
          © 2025 Miraflores Plus
        </p>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-lg"
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="h-5 w-5 text-[#0477BF]" aria-hidden="true" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-64 p-0"
            aria-label="Menú de navegación móvil"
            id="mobile-navigation"
          >
            <div className="flex flex-col h-full bg-white">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col"
        role="complementary"
        aria-label="Barra lateral de navegación"
      >
        <SidebarContent />
      </aside>
    </>
  );
}