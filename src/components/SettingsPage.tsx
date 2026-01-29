/**
 * SettingsPage - Configuración Completa del Usuario
 * 
 * Secciones:
 * 1. Perfil Personal (foto, datos personales)
 * 2. Seguridad (contraseña, 2FA, sesiones)
 * 3. Notificaciones (email, SMS, WhatsApp)
 * 4. Preferencias del Sistema (zona horaria, idioma, formato)
 * 5. Configuraciones por Rol (específicas según usuario)
 * 6. Facturación (NIT, dirección fiscal) - Solo admin/recepción
 * 7. Integraciones (Google Calendar, WhatsApp)
 */
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  User,
  Shield,
  Bell,
  Settings,
  Briefcase,
  CreditCard,
  Link2,
  Upload,
  Camera,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  Clock,
  Globe,
  Palette,
  Volume2,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  LogOut,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

interface SettingsPageProps {
  userRole?: "recepcion" | "doctor" | "junta" | "affiliate" | "admin";
}

export function SettingsPage({ userRole = "recepcion" }: SettingsPageProps) {
  const [profileImage, setProfileImage] = useState<string | null>("https://images.unsplash.com/photo-1736939666660-d4c776e0532c?w=400&h=400&fit=crop&crop=faces");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    push: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Foto de perfil actualizada", {
          description: "Tu imagen se ha cargado correctamente",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile
  const handleSaveProfile = () => {
    toast.success("Perfil actualizado", {
      description: "Tus cambios han sido guardados exitosamente",
    });
  };

  // Change password
  const handleChangePassword = () => {
    toast.success("Contraseña actualizada", {
      description: "Tu contraseña ha sido cambiada correctamente",
    });
  };

  // Toggle 2FA
  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    toast.success(
      enabled ? "2FA Activado" : "2FA Desactivado",
      {
        description: enabled
          ? "La autenticación de dos factores está ahora activa"
          : "La autenticación de dos factores ha sido desactivada",
      }
    );
  };

  // Close session
  const handleCloseSession = (sessionId: string) => {
    toast.success("Sesión cerrada", {
      description: `La sesión ${sessionId} ha sido cerrada`,
    });
  };

  // Save notifications
  const handleSaveNotifications = () => {
    toast.success("Notificaciones actualizadas", {
      description: "Tus preferencias han sido guardadas",
    });
  };

  // Get user info based on role
  const getUserInfo = () => {
    if (userRole === "admin") {
      return {
        name: "Ing. Mario Rodríguez",
        email: "mario.rodriguez@mirafloresplus.com",
        phone: "+502 5555-1234",
        role: "Administrador del Sistema",
        dpi: "2345 67890 1234",
        specialty: null,
      };
    }
    if (userRole === "doctor") {
      return {
        name: "Dr. Carlos Hernández",
        email: "carlos.hernandez@mirafloresplus.com",
        phone: "+502 5555-5678",
        role: "Médico Especialista",
        dpi: "1234 56789 0123",
        specialty: "Cardiología",
      };
    }
    if (userRole === "junta") {
      return {
        name: "Lic. Roberto Morales",
        email: "roberto.morales@mirafloresplus.com",
        phone: "+502 5555-9012",
        role: "Junta Directiva",
        dpi: "3456 78901 2345",
        specialty: null,
      };
    }
    if (userRole === "affiliate") {
      return {
        name: "María González Hernández",
        email: "maria.gonzalez@gmail.com",
        phone: "+502 5555-3456",
        role: "Afiliado Premium",
        dpi: "4567 89012 3456",
        specialty: null,
      };
    }
    return {
      name: "Ana Martínez López",
      email: "ana.martinez@mirafloresplus.com",
      phone: "+502 5555-7890",
      role: "Recepción",
      dpi: "5678 90123 4567",
      specialty: null,
    };
  };

  const userInfo = getUserInfo();

  // Mock active sessions
  const activeSessions = [
    {
      id: "1",
      device: "Windows - Chrome",
      location: "Guatemala, Guatemala",
      ip: "192.168.1.1",
      lastActive: "Ahora",
      current: true,
    },
    {
      id: "2",
      device: "iPhone 14 - Safari",
      location: "Ciudad de Guatemala",
      ip: "192.168.1.2",
      lastActive: "Hace 2 horas",
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#0477BF]">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administre sus preferencias y configuraciones del sistema
        </p>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-2 h-auto bg-gray-100 p-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Preferencias</span>
          </TabsTrigger>
          <TabsTrigger value="role" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Mi Rol</span>
          </TabsTrigger>
          {(userRole === "admin" || userRole === "recepcion") && (
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Facturación</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Integraciones</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Perfil Personal */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="p-6 border border-gray-200">
            <div className="space-y-6">
              {/* Photo Upload Section */}
              <div>
                <h3 className="text-[#0477BF] mb-4">Foto de Perfil</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0477BF] to-[#2BB9D9] flex items-center justify-center text-white overflow-hidden"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12" />
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#62BF04] flex items-center justify-center cursor-pointer hover:bg-[#62BF04]/90 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      Suba una foto de perfil profesional
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Tamaño recomendado: 400x400px. Formatos: JPG, PNG
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Foto
                      </Button>
                      {profileImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProfileImage(null);
                            toast.success("Foto eliminada");
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div>
                <h3 className="text-[#0477BF] mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullname">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre Completo
                    </Label>
                    <Input
                      id="fullname"
                      defaultValue={userInfo.name}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userInfo.email}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      defaultValue={userInfo.phone}
                      placeholder="+502 0000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dpi">
                      <IdCard className="w-4 h-4 inline mr-2" />
                      DPI / Cédula
                    </Label>
                    <Input
                      id="dpi"
                      defaultValue={userInfo.dpi}
                      placeholder="0000 00000 0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthdate">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Fecha de Nacimiento
                    </Label>
                    <Input id="birthdate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="address">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      placeholder="Dirección completa"
                      defaultValue="Ciudad de Guatemala"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="text-white"
                  style={{ backgroundColor: "#0477BF" }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Seguridad */}
        <TabsContent value="security" className="space-y-6 mt-6">
          {/* Change Password */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Cambiar Contraseña</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button
                onClick={handleChangePassword}
                className="text-white"
                style={{ backgroundColor: "#0477BF" }}
              >
                <Lock className="w-4 h-4 mr-2" />
                Actualizar Contraseña
              </Button>
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-[#0477BF] mb-2">
                  Autenticación de Dos Factores (2FA)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Agregue una capa adicional de seguridad a su cuenta
                </p>
                {twoFactorEnabled && (
                  <Badge className="bg-[#62BF04]/10 text-[#62BF04]">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Activado
                  </Badge>
                )}
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
          </Card>

          {/* Active Sessions */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Sesiones Activas</h3>
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: session.current
                          ? "#62BF04"
                          : "#F2F2F2",
                      }}
                    >
                      <Smartphone
                        className={`w-5 h-5 ${
                          session.current ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {session.device}
                        {session.current && (
                          <Badge className="ml-2 bg-[#62BF04]/10 text-[#62BF04] text-xs">
                            Actual
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.location} • {session.ip}
                      </p>
                      <p className="text-xs text-gray-500">{session.lastActive}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[#0477BF]">
                            Cerrar Sesión
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Está seguro que desea cerrar esta sesión? El dispositivo
                            deberá volver a iniciar sesión.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCloseSession(session.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Cerrar Sesión
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Security Questions */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Preguntas de Seguridad</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure preguntas de seguridad para recuperar su cuenta
            </p>
            <div className="space-y-4">
              <div>
                <Label>Pregunta 1</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una pregunta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet">
                      ¿Cuál es el nombre de su primera mascota?
                    </SelectItem>
                    <SelectItem value="city">
                      ¿En qué ciudad nació?
                    </SelectItem>
                    <SelectItem value="school">
                      ¿Cuál fue el nombre de su primera escuela?
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Respuesta" className="mt-2" />
              </div>
              <Button variant="outline">Configurar Preguntas</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Notificaciones */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Preferencias de Notificaciones</h3>
            <p className="text-sm text-gray-600 mb-6">
              Administre cómo y cuándo desea recibir notificaciones
            </p>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#0477BF" }}
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Notificaciones por Email
                    </p>
                    <p className="text-xs text-gray-500">
                      Reciba actualizaciones sobre citas, pagos y recordatorios
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              {/* SMS Notifications */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#2BB9D9" }}
                  >
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Notificaciones por SMS</p>
                    <p className="text-xs text-gray-500">
                      Mensajes de texto para recordatorios de citas urgentes
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>

              {/* WhatsApp Notifications */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#62BF04" }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Notificaciones por WhatsApp
                    </p>
                    <p className="text-xs text-gray-500">
                      Reciba confirmaciones y recordatorios por WhatsApp
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.whatsapp}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, whatsapp: checked })
                  }
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#9DD973" }}
                  >
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Notificaciones Push del Navegador
                    </p>
                    <p className="text-xs text-gray-500">
                      Alertas en tiempo real en su navegador web
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <Separator />

              {/* Notification Types */}
              <div>
                <h4 className="text-sm text-gray-900 mb-3">Tipos de Notificaciones</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-appointments" className="text-sm">
                      Recordatorios de citas (24 horas antes)
                    </Label>
                    <Switch id="notify-appointments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-payments" className="text-sm">
                      Confirmaciones de pago
                    </Label>
                    <Switch id="notify-payments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-results" className="text-sm">
                      Resultados de exámenes disponibles
                    </Label>
                    <Switch id="notify-results" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-updates" className="text-sm">
                      Actualizaciones del sistema
                    </Label>
                    <Switch id="notify-updates" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-marketing" className="text-sm">
                      Promociones y ofertas especiales
                    </Label>
                    <Switch id="notify-marketing" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Frequency */}
              <div>
                <Label>Frecuencia de Resúmenes</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tiempo Real</SelectItem>
                    <SelectItem value="hourly">Cada Hora</SelectItem>
                    <SelectItem value="daily">Diario (8:00 AM)</SelectItem>
                    <SelectItem value="weekly">Semanal (Lunes)</SelectItem>
                    <SelectItem value="never">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  className="text-white"
                  style={{ backgroundColor: "#0477BF" }}
                >
                  Guardar Preferencias
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 4: Preferencias del Sistema */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Preferencias del Sistema</h3>
            <div className="space-y-6">
              {/* Timezone */}
              <div>
                <Label>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Zona Horaria
                </Label>
                <Select defaultValue="gt">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gt">
                      Guatemala (GMT-6) - Hora Central
                    </SelectItem>
                    <SelectItem value="mx">México (GMT-6)</SelectItem>
                    <SelectItem value="us-est">EE.UU. Este (GMT-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <Label>
                  <Globe className="w-4 h-4 inline mr-2" />
                  Idioma de la Interfaz
                </Label>
                <Select defaultValue="es">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español (Guatemala)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Format */}
              <div>
                <Label>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Formato de Fecha
                </Label>
                <Select defaultValue="dmy">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dmy">DD/MM/YYYY (29/10/2025)</SelectItem>
                    <SelectItem value="mdy">MM/DD/YYYY (10/29/2025)</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD (2025-10-29)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Currency */}
              <div>
                <Label>
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Formato de Moneda
                </Label>
                <Select defaultValue="gtq">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gtq">Quetzales (Q 1,234.56)</SelectItem>
                    <SelectItem value="usd">Dólares ($ 1,234.56)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div>
                <Label>
                  <Palette className="w-4 h-4 inline mr-2" />
                  Tema de Color
                </Label>
                <Select defaultValue="blue">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">
                      Azul Miraflores (Predeterminado)
                    </SelectItem>
                    <SelectItem value="green">Verde Suave</SelectItem>
                    <SelectItem value="dark">Modo Oscuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Size */}
              <div>
                <Label>
                  <Volume2 className="w-4 h-4 inline mr-2" />
                  Tamaño de Texto (Accesibilidad)
                </Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeño</SelectItem>
                    <SelectItem value="medium">Mediano (Recomendado)</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                    <SelectItem value="xlarge">Extra Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    toast.success("Preferencias guardadas", {
                      description: "La configuración del sistema ha sido actualizada",
                    })
                  }
                  className="text-white"
                  style={{ backgroundColor: "#0477BF" }}
                >
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 5: Configuración por Rol */}
        <TabsContent value="role" className="space-y-6 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Configuración de {userInfo.role}</h3>

            {/* Doctor Settings */}
            {userRole === "doctor" && (
              <div className="space-y-4">
                <div>
                  <Label>Especialidad Médica</Label>
                  <Select defaultValue={userInfo.specialty || ""}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiología">Cardiología</SelectItem>
                      <SelectItem value="Pediatría">Pediatría</SelectItem>
                      <SelectItem value="Medicina General">
                        Medicina General
                      </SelectItem>
                      <SelectItem value="Ginecología">Ginecología</SelectItem>
                      <SelectItem value="Traumatología">Traumatología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Número de Colegiado</Label>
                  <Input placeholder="12345" defaultValue="12345" />
                </div>
                <div>
                  <Label>Horario de Atención</Label>
                  <Textarea
                    placeholder="Ej: Lunes a Viernes 8:00 AM - 5:00 PM"
                    defaultValue="Lunes a Viernes: 8:00 AM - 5:00 PM&#10;Sábados: 9:00 AM - 1:00 PM"
                  />
                </div>
                <div>
                  <Label>Duración Promedio de Cita (minutos)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Reception Settings */}
            {userRole === "recepcion" && (
              <div className="space-y-4">
                <div>
                  <Label>Sucursal Asignada</Label>
                  <Select defaultValue="zona10">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zona10">Hospital Miraflores Zona 10</SelectItem>
                      <SelectItem value="roosevelt">Hospital Miraflores Roosevelt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Horario de Trabajo</Label>
                  <Textarea
                    placeholder="Horario de trabajo"
                    defaultValue="Lunes a Viernes: 7:00 AM - 4:00 PM"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Acceso a Caja Chica</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            )}

            {/* Board Settings */}
            {userRole === "junta" && (
              <div className="space-y-4">
                <div>
                  <Label>Frecuencia de Reportes Ejecutivos</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Métricas Preferidas en Dashboard</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Ingresos Mensuales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Afiliados Activos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">Tasa de Ocupación</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Affiliate Settings */}
            {userRole === "affiliate" && (
              <div className="space-y-4">
                <div>
                  <Label>Plan de Salud</Label>
                  <Input defaultValue="Premium" disabled />
                </div>
                <div>
                  <Label>Número de Afiliación</Label>
                  <Input defaultValue="AF-2024-00123" disabled />
                </div>
                <div>
                  <Label>Contacto de Emergencia</Label>
                  <Input placeholder="Nombre" defaultValue="Juan González" />
                  <Input
                    placeholder="Teléfono"
                    defaultValue="+502 5555-0000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Alergias o Condiciones Médicas</Label>
                  <Textarea placeholder="Ninguna conocida" />
                </div>
              </div>
            )}

            {/* Admin Settings */}
            {userRole === "admin" && (
              <div className="space-y-4">
                <div>
                  <Label>Nivel de Acceso</Label>
                  <Input defaultValue="Super Administrador" disabled />
                </div>
                <div>
                  <Label>Módulos Habilitados</Label>
                  <p className="text-sm text-gray-600 mt-2">
                    Acceso completo a todos los módulos del sistema
                  </p>
                  <Badge className="bg-[#62BF04]/10 text-[#62BF04] mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Todos los permisos activos
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Logs del Sistema</Label>
                    <p className="text-xs text-gray-500">
                      Recibir logs de actividad del sistema
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() =>
                  toast.success("Configuración actualizada", {
                    description: "Los cambios han sido guardados",
                  })
                }
                className="text-white"
                style={{ backgroundColor: "#0477BF" }}
              >
                Guardar Configuración
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 6: Facturación (Only for admin/recepcion) */}
        {(userRole === "admin" || userRole === "recepcion") && (
          <TabsContent value="billing" className="space-y-6 mt-6">
            <Card className="p-6 border border-gray-200">
              <h3 className="text-[#0477BF] mb-4">Configuración de Facturación</h3>
              <div className="space-y-4">
                <div>
                  <Label>NIT de la Empresa</Label>
                  <Input placeholder="12345678-9" defaultValue="12345678-9" />
                </div>
                <div>
                  <Label>Razón Social</Label>
                  <Input
                    placeholder="Nombre de la empresa"
                    defaultValue="Miraflores Plus, S.A."
                  />
                </div>
                <div>
                  <Label>Dirección Fiscal</Label>
                  <Textarea
                    placeholder="Dirección fiscal completa"
                    defaultValue="Ciudad de Guatemala, Guatemala"
                  />
                </div>
                <div>
                  <Label>Métodos de Pago Aceptados</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Efectivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Tarjeta de Crédito/Débito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <span className="text-sm">Transferencia Bancaria</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-sm">Cheque</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm text-gray-900 mb-3">
                    Configuración FEL (Factura Electrónica en Línea)
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Proveedor de Certificación FEL</Label>
                      <Select defaultValue="infile">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infile">INFILE</SelectItem>
                          <SelectItem value="digifact">DIGIFACT</SelectItem>
                          <SelectItem value="mega">MEGAPRINT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Usuario FEL</Label>
                      <Input placeholder="usuario@fel.com" />
                    </div>
                    <div>
                      <Label>Llave de Certificación</Label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <Label className="text-sm">
                        Generar facturas automáticamente al confirmar pago
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() =>
                      toast.success("Configuración de facturación guardada", {
                        description: "Los datos fiscales han sido actualizados",
                      })
                    }
                    className="text-white"
                    style={{ backgroundColor: "#0477BF" }}
                  >
                    Guardar Configuración Fiscal
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        )}

        {/* Tab 7: Integraciones */}
        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-[#0477BF] mb-4">Integraciones</h3>
            <p className="text-sm text-gray-600 mb-6">
              Conecte servicios externos para mejorar su experiencia
            </p>

            <div className="space-y-4">
              {/* Google Calendar */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500"
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Google Calendar</p>
                    <p className="text-xs text-gray-500">
                      Sincronice sus citas médicas con Google Calendar
                    </p>
                    <Badge className="bg-gray-100 text-gray-600 mt-2">
                      No conectado
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Conectar
                </Button>
              </div>

              {/* WhatsApp Business */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#62BF04" }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">WhatsApp Business</p>
                    <p className="text-xs text-gray-500">
                      Envíe recordatorios y confirmaciones por WhatsApp
                    </p>
                    <Badge className="bg-[#62BF04]/10 text-[#62BF04] mt-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-600">
                  Desconectar
                </Button>
              </div>

              {/* Zoom */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#2BB9D9" }}
                  >
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Zoom (Solo doctores)</p>
                    <p className="text-xs text-gray-500">
                      Conecte Zoom para videoconsultas médicas
                    </p>
                    <Badge className="bg-gray-100 text-gray-600 mt-2">
                      No conectado
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={userRole !== "doctor"}
                >
                  Conectar
                </Button>
              </div>

              {/* Jitsi */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Jitsi Meet (Videoconsultas)</p>
                    <p className="text-xs text-gray-500">
                      Plataforma de videoconsultas médicas seguras
                    </p>
                    <Badge className="bg-gray-100 text-gray-600 mt-2">
                      No configurado
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Export Data */}
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500"
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Exportar Datos</p>
                    <p className="text-xs text-gray-500">
                      Descargue todos sus datos en formato CSV o JSON
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success("Exportación iniciada", {
                      description:
                        "Recibirá un correo con el archivo en unos minutos",
                    })
                  }
                >
                  Exportar
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}