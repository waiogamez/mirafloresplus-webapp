import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Search, Filter, Download, UserPlus, MoreVertical, Users } from "lucide-react";
import { AddAffiliateDialog } from "./AddAffiliateDialog";
import { AddDependentDialog } from "./AddDependentDialog";
import { ViewAffiliateDialog } from "./ViewAffiliateDialog";
import { Toaster } from "./ui/sonner";
import { useUserRole } from "../store/useAuthStore";

const affiliatesData = [
  { id: "AF-2586", name: "María González", email: "maria.gonzalez@email.com", phone: "+502 5234-5678", plan: "Premium", status: "Activo", joined: "2024-10-01" },
  { id: "AF-2585", name: "Carlos Rodríguez", email: "carlos.rodriguez@email.com", phone: "+502 5987-6543", plan: "Básico", status: "Activo", joined: "2024-09-28" },
  { id: "AF-2584", name: "Ana Martínez", email: "ana.martinez@email.com", phone: "+502 4123-4567", plan: "Premium", status: "Activo", joined: "2024-09-25" },
  { id: "AF-2583", name: "Juan Pérez", email: "juan.perez@email.com", phone: "+502 5555-5555", plan: "Estándar", status: "Activo", joined: "2024-09-20" },
  { id: "AF-2582", name: "Laura Díaz", email: "laura.diaz@email.com", phone: "+502 4333-3333", plan: "Premium", status: "Inactivo", joined: "2024-09-15" },
  { id: "AF-2581", name: "Pedro Sánchez", email: "pedro.sanchez@email.com", phone: "+502 5777-7777", plan: "Básico", status: "Activo", joined: "2024-09-10" },
  { id: "AF-2580", name: "Isabel Fernández", email: "isabel.fernandez@email.com", phone: "+502 4999-9999", plan: "Estándar", status: "Activo", joined: "2024-09-05" },
  { id: "AF-2579", name: "Miguel Torres", email: "miguel.torres@email.com", phone: "+502 5111-1111", plan: "Premium", status: "Pendiente", joined: "2024-09-01" },
];

export function AffiliatesPage() {
  const userRole = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [showAddAffiliateDialog, setShowAddAffiliateDialog] = useState(false);
  const [showAddDependentDialog, setShowAddDependentDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<typeof affiliatesData[0] | null>(null);
  
  // Check if user has write permissions (Finanzas only has read-only access)
  const canEdit = userRole !== "finanzas" && userRole !== "junta";

  const handleViewAffiliate = (affiliate: typeof affiliatesData[0]) => {
    setSelectedAffiliate(affiliate);
    setShowViewDialog(true);
  };

  const filteredAffiliates = affiliatesData.filter(affiliate => {
    const matchesSearch = 
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || affiliate.status === statusFilter;
    const matchesPlan = planFilter === "all" || affiliate.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0477BF]">
            {userRole === "finanzas" ? "Reporte de Afiliados" : "Gestión de Afiliados"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === "finanzas" 
              ? "Consulte el estado y reportes de afiliados registrados"
              : "Administre y monitoree todos los afiliados registrados"
            }
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button 
              className="text-white"
              style={{ backgroundColor: '#0477BF' }}
              onClick={() => setShowAddAffiliateDialog(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Afiliado
            </Button>
            <Button 
              className="text-white"
              style={{ backgroundColor: '#62BF04' }}
              onClick={() => setShowAddDependentDialog(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Nuevo Dependiente
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Total de Afiliados</p>
          <h3 className="text-[#0477BF]">2,586</h3>
          <p className="text-xs text-[#62BF04] mt-2">+12.5% del mes anterior</p>
        </Card>
        <Card className="p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Activos</p>
          <h3 className="text-[#62BF04]">2,450</h3>
          <p className="text-xs text-gray-500 mt-2">94.7% del total</p>
        </Card>
        <Card className="p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Pendientes</p>
          <h3 className="text-[#2BB9D9]">86</h3>
          <p className="text-xs text-gray-500 mt-2">3.3% del total</p>
        </Card>
        <Card className="p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Inactivos</p>
          <h3 className="text-gray-600">50</h3>
          <p className="text-xs text-gray-500 mt-2">2.0% del total</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, correo o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Estados</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Planes</SelectItem>
              <SelectItem value="Básico">Básico</SelectItem>
              <SelectItem value="Estándar">Estándar</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6 border border-gray-200">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">ID</TableHead>
                <TableHead className="text-[#0477BF]">Nombre</TableHead>
                <TableHead className="text-[#0477BF]">Contacto</TableHead>
                <TableHead className="text-[#0477BF]">Plan</TableHead>
                <TableHead className="text-[#0477BF]">Estado</TableHead>
                <TableHead className="text-[#0477BF]">Fecha de Ingreso</TableHead>
                <TableHead className="text-[#0477BF]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-900">{affiliate.id}</TableCell>
                  <TableCell className="text-gray-900">{affiliate.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900">{affiliate.email}</p>
                      <p className="text-gray-500">{affiliate.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        affiliate.plan === "Premium" 
                          ? "border-[#0477BF] text-[#0477BF] bg-[#0477BF]/5"
                          : affiliate.plan === "Estándar"
                          ? "border-[#2BB9D9] text-[#2BB9D9] bg-[#2BB9D9]/5"
                          : "border-gray-400 text-gray-700 bg-gray-50"
                      }
                    >
                      {affiliate.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        affiliate.status === "Activo"
                          ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/5"
                          : affiliate.status === "Pendiente"
                          ? "border-[#2BB9D9] text-[#2BB9D9] bg-[#2BB9D9]/5"
                          : "border-gray-400 text-gray-600 bg-gray-50"
                      }
                    >
                      {affiliate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{affiliate.joined}</TableCell>
                  <TableCell>
                    {canEdit ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewAffiliate(affiliate)}>
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Dependientes</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewAffiliate(affiliate)}
                      >
                        Ver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {filteredAffiliates.length} de {affiliatesData.length} afiliados
          </p>
        </div>
      </Card>

      {/* Diálogo para agregar afiliado - Solo para usuarios con permisos de edición */}
      {canEdit && (
        <>
          <AddAffiliateDialog 
            open={showAddAffiliateDialog}
            onOpenChange={setShowAddAffiliateDialog}
            onAffiliateAdded={(affiliateId) => {
              // console.log("Afiliado agregado:", affiliateId);
            }}
          />

          {/* Diálogo para agregar dependiente */}
          <AddDependentDialog 
            open={showAddDependentDialog}
            onOpenChange={setShowAddDependentDialog}
            onDependentAdded={() => {
              // console.log("Dependiente agregado");
            }}
          />
        </>
      )}

      {/* Diálogo para ver detalles del afiliado */}
      <ViewAffiliateDialog 
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        affiliate={selectedAffiliate}
      />

      <Toaster />
    </div>
  );
}
