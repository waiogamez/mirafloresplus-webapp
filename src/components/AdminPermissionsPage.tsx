/**
 * AdminPermissionsPage - Módulo de Administración de Usuarios y Permisos
 * 
 * Funcionalidades:
 * - Gestión completa de usuarios (crear, editar, activar/desactivar, eliminar)
 * - Asignación de roles (Recepción, Doctor, Junta Directiva, Afiliado)
 * - Configuración de permisos por rol (habilitar/deshabilitar acceso a módulos)
 * - Búsqueda y filtrado de usuarios
 * - Estadísticas de usuarios por rol y estado
 * - Vista de último acceso por usuario
 * 
 * Exclusivo para: Rol Administrador (admin)
 */
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Shield,
  Users,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  UserPlus,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

// Mock data de usuarios
const initialUsers = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@mirafloresplus.com",
    role: "recepcion",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1610387694365-19fafcc86d86?w=200&h=200&fit=crop&crop=faces",
    lastAccess: "2025-10-29",
  },
  {
    id: 2,
    name: "Dr. Carlos Hernández",
    email: "carlos.hernandez@mirafloresplus.com",
    role: "doctor",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1625134673337-519d4d10b313?w=200&h=200&fit=crop&crop=faces",
    lastAccess: "2025-10-29",
  },
  {
    id: 3,
    name: "Ing. Roberto Méndez",
    email: "roberto.mendez@mirafloresplus.com",
    role: "junta",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1548454782-15b189d129ab?w=200&h=200&fit=crop&crop=faces",
    lastAccess: "2025-10-28",
  },
  {
    id: 4,
    name: "Ana López",
    email: "ana.lopez@gmail.com",
    role: "affiliate",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?w=200&h=200&fit=crop&crop=faces",
    lastAccess: "2025-10-29",
  },
  {
    id: 5,
    name: "Dr. Patricia Ruiz",
    email: "patricia.ruiz@mirafloresplus.com",
    role: "doctor",
    status: "inactive",
    avatar: "https://images.unsplash.com/photo-1754715203698-70c7ad3a879d?w=200&h=200&fit=crop&crop=faces",
    lastAccess: "2025-10-20",
  },
];

// Permisos por módulo
type ModuleName =
  | "dashboard"
  | "appointments"
  | "affiliates"
  | "payments"
  | "billing"
  | "videocall"
  | "board"
  | "analytics"
  | "reports"
  | "settings";

interface RolePermissions {
  [key: string]: {
    [K in ModuleName]?: boolean;
  };
}

const initialPermissions: RolePermissions = {
  recepcion: {
    dashboard: true,
    appointments: true,
    affiliates: true,
    payments: true,
    billing: true,
    videocall: false,
    board: false,
    analytics: false,
    reports: false,
    settings: true,
  },
  doctor: {
    dashboard: false,
    appointments: true,
    affiliates: true,
    payments: false,
    billing: false,
    videocall: true,
    board: false,
    analytics: false,
    reports: false,
    settings: true,
  },
  junta: {
    dashboard: true,
    appointments: true,
    affiliates: true,
    payments: true,
    billing: true,
    videocall: false,
    board: true,
    analytics: true,
    reports: true,
    settings: true,
  },
  affiliate: {
    dashboard: true,
    appointments: true,
    affiliates: false,
    payments: false,
    billing: false,
    videocall: false,
    board: false,
    analytics: false,
    reports: false,
    settings: true,
  },
};

const roleNames: { [key: string]: string } = {
  recepcion: "Recepción",
  doctor: "Doctor",
  junta: "Junta Directiva",
  affiliate: "Afiliado",
  admin: "Administrador",
};

const roleColors: { [key: string]: string } = {
  recepcion: "bg-[#2BB9D9]/10 text-[#2BB9D9]",
  doctor: "bg-[#62BF04]/10 text-[#62BF04]",
  junta: "bg-[#0477BF]/10 text-[#0477BF]",
  affiliate: "bg-gray-200 text-gray-700",
  admin: "bg-purple-100 text-purple-700",
};

const moduleNames: { [K in ModuleName]: string } = {
  dashboard: "Dashboard Principal",
  appointments: "Citas Médicas",
  affiliates: "Gestión de Afiliados",
  payments: "Pagos y Cobros",
  billing: "Facturación FEL",
  videocall: "Video Llamada",
  board: "Tablero Ejecutivo",
  analytics: "Analíticas",
  reports: "Reportes",
  settings: "Configuración",
};

export function AdminPermissionsPage() {
  const [users, setUsers] = useState(initialUsers);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<string | null>(
    null
  );
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "affiliate",
  });

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Toggle user status
  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
    toast.success("Estado del usuario actualizado", {
      description: "El cambio se ha guardado correctamente",
    });
  };

  // Delete user
  const deleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
    toast.success("Usuario eliminado", {
      description: "El usuario ha sido eliminado del sistema",
    });
  };

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    const user = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active" as const,
      avatar: "https://images.unsplash.com/photo-1749711258555-b6d9adb5e3ad?w=200&h=200&fit=crop&crop=faces",
      lastAccess: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "affiliate" });
    setIsAddUserOpen(false);
    toast.success("Usuario agregado exitosamente", {
      description: `${user.name} ha sido agregado al sistema`,
    });
  };

  // Toggle permission
  const togglePermission = (role: string, module: ModuleName) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role],
        [module]: !permissions[role]?.[module],
      },
    });
  };

  // Save permissions
  const savePermissions = () => {
    setIsEditPermissionsOpen(false);
    toast.success("Permisos actualizados", {
      description: "Los cambios han sido guardados correctamente",
    });
  };

  // Statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    doctors: users.filter((u) => u.role === "doctor").length,
    reception: users.filter((u) => u.role === "recepcion").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#0477BF]">Administración de Usuarios y Permisos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestione usuarios y configure permisos por rol
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#0477BF]/5 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
              <p className="text-[#0477BF]">{stats.totalUsers}</p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#0477BF" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#62BF04]/5 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usuarios Activos</p>
              <p className="text-[#62BF04]">{stats.activeUsers}</p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#62BF04" }}
            >
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#2BB9D9]/5 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Personal Recepción</p>
              <p className="text-[#2BB9D9]">{stats.reception}</p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2BB9D9" }}
            >
              <UserPlus className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border border-gray-200 bg-gradient-to-br from-[#9DD973]/10 to-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Doctores</p>
              <p className="text-[#62BF04]">{stats.doctors}</p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#9DD973" }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="recepcion">Recepción</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="junta">Junta Directiva</SelectItem>
              <SelectItem value="affiliate">Afiliado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => setIsAddUserOpen(true)}
            className="text-white flex-1 sm:flex-none"
            style={{ backgroundColor: "#0477BF" }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Usuario
          </Button>
          <Button
            onClick={() => {
              setSelectedRoleForEdit("recepcion");
              setIsEditPermissionsOpen(true);
            }}
            variant="outline"
            className="text-[#0477BF] border-[#0477BF] flex-1 sm:flex-none"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar Permisos
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border border-gray-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">Usuario</TableHead>
                <TableHead className="text-[#0477BF]">Email</TableHead>
                <TableHead className="text-[#0477BF]">Rol</TableHead>
                <TableHead className="text-[#0477BF]">Estado</TableHead>
                <TableHead className="text-[#0477BF]">Último Acceso</TableHead>
                <TableHead className="text-[#0477BF] text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {roleNames[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status === "active"}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                      <span
                        className={`text-sm ${
                          user.status === "active"
                            ? "text-[#62BF04]"
                            : "text-gray-400"
                        }`}
                      >
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {new Date(user.lastAccess).toLocaleDateString("es-GT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#0477BF] hover:bg-[#0477BF]/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              Agregar Nuevo Usuario
            </DialogTitle>
            <DialogDescription>
              Complete la información del nuevo usuario del sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Ej: María González"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@mirafloresplus.com"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="role">Rol del Usuario</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recepcion">Recepción</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="junta">Junta Directiva</SelectItem>
                  <SelectItem value="affiliate">Afiliado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddUser}
              className="text-white"
              style={{ backgroundColor: "#0477BF" }}
            >
              Agregar Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog
        open={isEditPermissionsOpen}
        onOpenChange={setIsEditPermissionsOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              Configurar Permisos por Rol
            </DialogTitle>
            <DialogDescription>
              Seleccione qué módulos puede acceder cada rol
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Role Selector */}
            <div className="mb-6">
              <Label>Seleccionar Rol</Label>
              <Select
                value={selectedRoleForEdit || ""}
                onValueChange={setSelectedRoleForEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recepcion">Recepción</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="junta">Junta Directiva</SelectItem>
                  <SelectItem value="affiliate">Afiliado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Permissions Grid */}
            {selectedRoleForEdit && (
              <div className="space-y-4">
                <h4 className="text-[#0477BF]">
                  Permisos de {roleNames[selectedRoleForEdit]}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    Object.keys(moduleNames) as Array<ModuleName>
                  ).map((module) => (
                    <Card
                      key={module}
                      className="p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {permissions[selectedRoleForEdit]?.[module] ? (
                            <Unlock className="w-5 h-5 text-[#62BF04]" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm text-gray-900">
                              {moduleNames[module]}
                            </p>
                            <p className="text-xs text-gray-500">
                              {permissions[selectedRoleForEdit]?.[module]
                                ? "Acceso permitido"
                                : "Acceso denegado"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={
                            permissions[selectedRoleForEdit]?.[module] || false
                          }
                          onCheckedChange={() =>
                            togglePermission(selectedRoleForEdit, module)
                          }
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPermissionsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={savePermissions}
              className="text-white"
              style={{ backgroundColor: "#0477BF" }}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
