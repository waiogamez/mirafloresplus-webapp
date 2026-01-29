import { 
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
  Wallet,
  Database,
  Lock,
  UserCog,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Calculator
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuthStore, useUIStore } from "../store";

const roleColors = {
  recepcion: "#0477BF",
  doctor: "#62BF04",
  finanzas: "#F97316",
  junta: "#2BB9D9",
  affiliate: "#9DD973",
  superadmin: "#9333EA"
};

const roleNames = {
  recepcion: "Recepción",
  doctor: "Doctor",
  finanzas: "Finanzas",
  junta: "Junta Directiva",
  affiliate: "Afiliado/Paciente",
  superadmin: "Super Admin"
};

const roleDescriptions = {
  recepcion: "Personal de atención al cliente y gestión operativa diaria",
  doctor: "Personal médico especializado en atención a pacientes",
  finanzas: "Departamento financiero responsable de aprobar pagos y gestionar finanzas",
  junta: "Personal ejecutivo con vista estratégica y financiera",
  affiliate: "Usuario final que recibe servicios médicos",
  superadmin: "Administrador de la plataforma con permisos totales"
};

const rolePages = {
  recepcion: [
    { icon: Calendar, label: "Citas", page: "appointments", hasAccess: true },
    { icon: Users, label: "Afiliados", page: "affiliates", hasAccess: true },
    { icon: Calculator, label: "Cotizador", page: "payments", hasAccess: true },
    { icon: CreditCard, label: "Cobros y Pagos", page: "collections", hasAccess: true },
    { icon: Receipt, label: "Facturación (FEL)", page: "billing", hasAccess: true },
    { icon: Wallet, label: "Cuentas por Pagar", page: "payables", hasAccess: true },
    { icon: Settings, label: "Configuración", page: "settings", hasAccess: true },
    { icon: TrendingUp, label: "Tablero Ejecutivo", page: "board", hasAccess: false },
    { icon: Video, label: "Video Llamadas", page: "videocall", hasAccess: false },
    { icon: FileText, label: "Reportes Ejecutivos", page: "reports", hasAccess: false },
    { icon: Activity, label: "Analíticas", page: "analytics", hasAccess: false },
  ],
  doctor: [
    { icon: Calendar, label: "Mis Citas", page: "appointments", hasAccess: true },
    { icon: Video, label: "Video Llamada", page: "videocall", hasAccess: true },
    { icon: Users, label: "Pacientes", page: "affiliates", hasAccess: true },
    { icon: Settings, label: "Configuración", page: "settings", hasAccess: true },
    { icon: Receipt, label: "Facturación", page: "billing", hasAccess: false },
    { icon: CreditCard, label: "Cobros/Pagos", page: "payments", hasAccess: false },
    { icon: FileText, label: "Reportes", page: "reports", hasAccess: false },
    { icon: Activity, label: "Analíticas", page: "analytics", hasAccess: false },
  ],
  finanzas: [
    { icon: Wallet, label: "Cuentas por Pagar", page: "payables", hasAccess: true },
    { icon: Calculator, label: "Cotizador", page: "payments", hasAccess: true },
    { icon: Receipt, label: "Facturación", page: "billing", hasAccess: true },
    { icon: FileText, label: "Reportes Financieros", page: "reports", hasAccess: true },
    { icon: Users, label: "Afiliados (Solo lectura)", page: "affiliates", hasAccess: true },
    { icon: Settings, label: "Configuración", page: "settings", hasAccess: true },
    { icon: Video, label: "Video Llamadas", page: "videocall", hasAccess: false },
    { icon: Calendar, label: "Citas Operativas", page: "appointments", hasAccess: false },
    { icon: Database, label: "Gestión de Catálogos", page: "catalogs", hasAccess: false },
  ],
  junta: [
    { icon: TrendingUp, label: "Tablero Ejecutivo", page: "board", hasAccess: true },
    { icon: FileText, label: "Reportes", page: "reports", hasAccess: true },
    { icon: Wallet, label: "Cuentas por Pagar", page: "payables", hasAccess: true },
    { icon: Users, label: "Afiliados (Solo lectura)", page: "affiliates", hasAccess: true },
    { icon: Settings, label: "Configuración", page: "settings", hasAccess: true },
    { icon: Calendar, label: "Citas Operativas", page: "appointments", hasAccess: false },
    { icon: Video, label: "Video Llamadas", page: "videocall", hasAccess: false },
    { icon: Receipt, label: "Facturación Operativa", page: "billing", hasAccess: false },
    { icon: CreditCard, label: "Calculadora de Cobros", page: "payments", hasAccess: false },
    { icon: Activity, label: "Analíticas (Panel de Monitoreo)", page: "analytics", hasAccess: false },
  ],
  affiliate: [
    { icon: LayoutDashboard, label: "Mi Portal", page: "affiliate", hasAccess: true },
    { icon: Calendar, label: "Mis Citas", page: "appointments", hasAccess: true },
    { icon: CreditCard, label: "Mi Estado de Cuenta", page: "payments", hasAccess: true },
    { icon: Receipt, label: "Mis Facturas", page: "billing", hasAccess: true },
    { icon: Settings, label: "Mi Perfil", page: "settings", hasAccess: true },
    { icon: Users, label: "Otros Afiliados", page: "affiliates", hasAccess: false },
    { icon: FileText, label: "Reportes", page: "reports", hasAccess: false },
    { icon: Activity, label: "Analíticas", page: "analytics", hasAccess: false },
  ],
  superadmin: [
    { icon: Shield, label: "Panel de Control", page: "admin", hasAccess: true },
    { icon: Database, label: "Gestión de Catálogos", page: "catalogs", hasAccess: true },
    { icon: Users, label: "Usuarios", page: "affiliates", hasAccess: true },
    { icon: TrendingUp, label: "Tablero Ejecutivo", page: "board", hasAccess: true },
    { icon: FileText, label: "Reportes", page: "reports", hasAccess: true },
    { icon: Calendar, label: "Citas", page: "appointments", hasAccess: true },
    { icon: Receipt, label: "Facturación", page: "billing", hasAccess: true },
    { icon: Calculator, label: "Cotizador", page: "payments", hasAccess: true },
    { icon: Wallet, label: "Cuentas por Pagar", page: "payables", hasAccess: true },
    { icon: Activity, label: "Analíticas", page: "analytics", hasAccess: true },
    { icon: Lock, label: "Seguridad", page: "security", hasAccess: true },
    { icon: Settings, label: "Configuración", page: "settings", hasAccess: true },
  ],
};

export function RolesDemoPage() {
  const currentRole = useAuthStore((state) => state.user?.role) || "recepcion";
  const setCurrentPage = useUIStore((state) => state.setCurrentPage);
  
  // Use selector to get switchRole function - this is the CORRECT way with Zustand
  const switchRoleFromStore = useAuthStore((state) => state.switchRole);
  
  // Debug logs
  console.log('🔍 [RolesDemoPage] currentRole:', currentRole);
  console.log('🔍 [RolesDemoPage] switchRole type:', typeof switchRoleFromStore);

  const handleRoleChange = (role: string) => {
    try {
      console.log('🔄 [RolesDemoPage] Cambiando a rol:', role);
      console.log('🔍 [RolesDemoPage] switchRole function:', typeof switchRoleFromStore);
      
      if (typeof switchRoleFromStore !== 'function') {
        console.error('❌ [RolesDemoPage] switchRole is not a function:', typeof switchRoleFromStore);
        return;
      }
      
      // Call the function to switch role
      switchRoleFromStore(role as any);
      console.log('✅ [RolesDemoPage] Rol cambiado exitosamente');
      
      // Navigate directly to dashboard - the App.tsx will render the correct dashboard based on the new role
      console.log('🎯 [RolesDemoPage] Navigating to dashboard');
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('❌ [RolesDemoPage] Error switching role:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#0477BF] mb-2">Sistema de Roles - Miraflores Plus</h1>
        <p className="text-gray-600">
          Explora todos los roles del sistema, sus permisos y páginas disponibles
        </p>
      </div>

      {/* Quick Role Switcher */}
      <Card style={{ borderLeft: `4px solid ${roleColors[currentRole as keyof typeof roleColors]}` }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" style={{ color: roleColors[currentRole as keyof typeof roleColors] }} />
            Cambiar de Rol (Demo)
          </CardTitle>
          <CardDescription>
            Rol actual: <strong>{roleNames[currentRole as keyof typeof roleNames]}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(roleColors).map(([role, color]) => (
              <Button
                key={role}
                onClick={() => handleRoleChange(role)}
                style={{ 
                  backgroundColor: currentRole === role ? color : 'white',
                  color: currentRole === role ? 'white' : color,
                  borderColor: color,
                  borderWidth: '2px'
                }}
                className="h-auto py-3 flex flex-col items-center gap-2"
              >
                <div className="text-xs opacity-70">Cambiar a</div>
                <div>{roleNames[role as keyof typeof roleNames]}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles Tabs */}
      <Tabs defaultValue="recepcion" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {Object.keys(roleColors).map((role) => (
            <TabsTrigger 
              key={role} 
              value={role}
              className="text-xs md:text-sm"
            >
              {roleNames[role as keyof typeof roleNames]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(rolePages).map(([role, pages]) => (
          <TabsContent key={role} value={role} className="space-y-4 mt-6">
            {/* Role Header */}
            <Card style={{ borderLeft: `4px solid ${roleColors[role as keyof typeof roleColors]}` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: roleColors[role as keyof typeof roleColors] }}
                      />
                      {roleNames[role as keyof typeof roleNames]}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {roleDescriptions[role as keyof typeof roleDescriptions]}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleRoleChange(role)}
                    style={{ 
                      backgroundColor: roleColors[role as keyof typeof roleColors]
                    }}
                    size="sm"
                  >
                    Cambiar a este rol
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Pages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => {
                const Icon = page.icon;
                return (
                  <Card 
                    key={page.page}
                    className={`transition-all ${
                      page.hasAccess 
                        ? 'hover:shadow-md cursor-pointer' 
                        : 'opacity-50 bg-gray-50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: page.hasAccess 
                              ? `${roleColors[role as keyof typeof roleColors]}15`
                              : '#f3f4f6',
                            color: page.hasAccess 
                              ? roleColors[role as keyof typeof roleColors]
                              : '#9ca3af'
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{page.label}</p>
                            {page.hasAccess ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {page.hasAccess ? 'Acceso completo' : 'Sin acceso'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Access Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen de Acceso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {pages.filter(p => p.hasAccess).length} páginas con acceso
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="text-sm">
                      {pages.filter(p => !p.hasAccess).length} páginas restringidas
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Legend */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#0477BF] mt-0.5" />
            <div className="text-sm text-gray-700">
              <strong>Nota:</strong> Los botones de cambio de rol son solo para demostración. 
              En producción, los roles se asignan desde el Panel de Control del Super Admin.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}