import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Database,
  Plus,
  Edit,
  Trash2,
  Search,
  Stethoscope,
  Heart,
  TestTube,
  Building2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Camera,
  Activity,
  Pill,
  Zap,
  Save,
  X,
  DollarSign,
  FileText,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";
import { useCatalogStore, Doctor, ExtraService } from "../store/useCatalogStore";

interface Branch {
  id: number;
  name: string;
  zone: string;
  address: string;
  phone: string;
}

// Sucursales
const branches: Branch[] = [
  {
    id: 1,
    name: "Miraflores Plus - Zona 10",
    zone: "Zona 10",
    address: "12 Calle 1-25, Zona 10, Ciudad de Guatemala",
    phone: "+502 2366-5000",
  },
  {
    id: 2,
    name: "Miraflores Plus - Zona 11",
    zone: "Zona 11",
    address: "Calzada Aguilar Batres 32-69, Zona 11",
    phone: "+502 2440-3000",
  },
];

// Especialidades médicas
const specialties = [
  "Medicina General",
  "Cardiología",
  "Pediatría",
  "Ginecología",
  "Traumatología",
  "Dermatología",
  "Neurología",
  "Oftalmología",
  "Otorrinolaringología",
  "Psiquiatría",
  "Endocrinología",
  "Gastroenterología",
  "Urología",
  "Reumatología",
];

// Categorías de servicios
const serviceCategories = [
  "Consulta Especializada",
  "Laboratorio - Hematología",
  "Laboratorio - Química Sanguínea",
  "Laboratorio - Microbiología",
  "Laboratorio - Urología",
  "Imagenología - Rayos X",
  "Imagenología - Ultrasonido",
  "Imagenología - Tomografía",
  "Terapia Física",
  "Nutrición",
  "Psicología",
  "Otros",
];

// Tipos de contrato
const contractTypes = [
  "Por Consulta",
  "Mensual Fijo",
  "Por Hora",
  "Por Servicio",
];

export function CatalogManagementPage() {
  // Zustand store
  const specialists = useCatalogStore(state => state.specialists);
  const extraServices = useCatalogStore(state => state.extraServices);
  const addSpecialist = useCatalogStore(state => state.addSpecialist);
  const addExtraService = useCatalogStore(state => state.addExtraService);
  const updateSpecialist = useCatalogStore(state => state.updateSpecialist);
  const updateExtraService = useCatalogStore(state => state.updateExtraService);
  const deleteSpecialist = useCatalogStore(state => state.deleteSpecialist);
  const deleteExtraService = useCatalogStore(state => state.deleteExtraService);
  
  // Estados locales
  const [activeTab, setActiveTab] = useState<"specialists" | "services">("specialists");
  const [extraServicesTemp] = useState<ExtraService[]>([
    {
      id: 1,
      name: "Hemograma Completo",
      code: "LAB-001",
      description: "Análisis completo de células sanguíneas",
      price: 180,
      category: "Laboratorio - Hematología",
      status: "Activo",
      branchId: 1,
      requiresAppointment: false,
    },
    {
      id: 2,
      name: "Perfil Lipídico",
      code: "LAB-002",
      description: "Colesterol total, HDL, LDL y triglicéridos",
      price: 150,
      category: "Laboratorio - Química Sanguínea",
      status: "Activo",
      branchId: 2,
      requiresAppointment: false,
    },
    {
      id: 3,
      name: "Radiografía de Tórax",
      code: "IMG-001",
      description: "Imagen radiológica del tórax",
      price: 180,
      category: "Imagenología - Rayos X",
      status: "Activo",
      branchId: 1,
      requiresAppointment: true,
      estimatedDuration: 15,
    },
    {
      id: 4,
      name: "Ultrasonido Abdominal",
      code: "IMG-002",
      description: "Ecografía completa del abdomen",
      price: 280,
      category: "Imagenología - Ultrasonido",
      status: "Activo",
      branchId: 2,
      requiresAppointment: true,
      estimatedDuration: 30,
    },
    {
      id: 5,
      name: "Electrocardiograma (EKG)",
      code: "CAR-001",
      description: "Estudio del ritmo cardíaco",
      price: 120,
      category: "Imagenología - Rayos X",
      status: "Activo",
      branchId: 1,
      requiresAppointment: true,
      estimatedDuration: 20,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Doctor | ExtraService | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  // Filtrar especialistas
  const filteredSpecialists = specialists.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.license.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = filterBranch === "all" || doc.branchId === parseInt(filterBranch);
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Filtrar servicios
  const filteredServices = extraServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = filterBranch === "all" || service.branchId === parseInt(filterBranch);
    const matchesStatus = filterStatus === "all" || service.status === filterStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Obtener nombre de sucursal
  const getBranchName = (branchId: number) => {
    return branches.find((b) => b.id === branchId)?.zone || "N/A";
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
  };

  // Agregar especialista
  const handleAddSpecialist = () => {
    if (!formData.name || !formData.specialty || !formData.license || !formData.negotiatedRate || !formData.branchId) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const newSpecialist: Doctor = {
      id: Date.now(),
      name: formData.name,
      specialty: formData.specialty,
      license: formData.license,
      email: formData.email || "",
      phone: formData.phone || "",
      negotiatedRate: parseFloat(formData.negotiatedRate),
      status: "Activo",
      branchId: parseInt(formData.branchId),
      contract: formData.contract || "Por Consulta",
      notes: formData.notes || "",
    };

    addSpecialist(newSpecialist);
    toast.success("¡Especialista agregado!", {
      description: `${newSpecialist.name} - ${newSpecialist.specialty} agregado a ${getBranchName(newSpecialist.branchId)}`,
    });

    resetForm();
    setShowAddDialog(false);
  };

  // Editar especialista
  const handleEditSpecialist = () => {
    if (!editingItem) return;

    const updatedFields = {
      name: formData.name,
      specialty: formData.specialty,
      license: formData.license,
      email: formData.email || "",
      phone: formData.phone || "",
      negotiatedRate: parseFloat(formData.negotiatedRate),
      branchId: parseInt(formData.branchId),
      contract: formData.contract,
      notes: formData.notes || "",
    };

    updateSpecialist(editingItem.id, updatedFields);
    toast.success("Especialista actualizado", {
      description: `${updatedFields.name} actualizado exitosamente`,
    });

    resetForm();
    setShowEditDialog(false);
  };

  // Eliminar especialista
  const handleDeleteSpecialist = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este especialista?")) {
      deleteSpecialist(id);
      toast.success("Especialista eliminado");
    }
  };

  // Cambiar estado especialista
  const toggleSpecialistStatus = (id: number) => {
    const specialist = specialists.find(s => s.id === id);
    if (specialist) {
      updateSpecialist(id, { status: specialist.status === "Activo" ? "Inactivo" : "Activo" });
      toast.success("Estado actualizado");
    }
  };

  // Agregar servicio
  const handleAddService = () => {
    if (!formData.name || !formData.code || !formData.price || !formData.category || !formData.branchId) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const newService: ExtraService = {
      id: Date.now(),
      name: formData.name,
      code: formData.code,
      description: formData.description || "",
      price: parseFloat(formData.price),
      category: formData.category,
      status: "Activo",
      branchId: parseInt(formData.branchId),
      requiresAppointment: formData.requiresAppointment === "true",
      estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined,
    };

    addExtraService(newService);
    toast.success("¡Servicio agregado!", {
      description: `${newService.name} agregado a ${getBranchName(newService.branchId)}`,
    });

    resetForm();
    setShowAddDialog(false);
  };

  // Editar servicio
  const handleEditService = () => {
    if (!editingItem) return;

    const updatedFields = {
      name: formData.name,
      code: formData.code,
      description: formData.description || "",
      price: parseFloat(formData.price),
      category: formData.category,
      branchId: parseInt(formData.branchId),
      requiresAppointment: formData.requiresAppointment === "true",
      estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined,
    };

    updateExtraService(editingItem.id, updatedFields);
    toast.success("Servicio actualizado", {
      description: `${updatedFields.name} actualizado exitosamente`,
    });

    resetForm();
    setShowEditDialog(false);
  };

  // Eliminar servicio
  const handleDeleteService = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      deleteExtraService(id);
      toast.success("Servicio eliminado");
    }
  };

  // Cambiar estado servicio
  const toggleServiceStatus = (id: number) => {
    const service = extraServices.find(s => s.id === id);
    if (service) {
      updateExtraService(id, { status: service.status === "Activo" ? "Inactivo" : "Activo" });
      toast.success("Estado actualizado");
    }
  };

  // Abrir diálogo de edición
  const openEditDialog = (item: Doctor | ExtraService, type: "specialist" | "service") => {
    setEditingItem(item);
    if (type === "specialist") {
      const doc = item as Doctor;
      setFormData({
        name: doc.name,
        specialty: doc.specialty,
        license: doc.license,
        email: doc.email,
        phone: doc.phone,
        negotiatedRate: doc.negotiatedRate,
        branchId: doc.branchId.toString(),
        contract: doc.contract,
        notes: doc.notes,
      });
    } else {
      const service = item as ExtraService;
      setFormData({
        name: service.name,
        code: service.code,
        description: service.description,
        price: service.price,
        category: service.category,
        branchId: service.branchId.toString(),
        requiresAppointment: service.requiresAppointment.toString(),
        estimatedDuration: service.estimatedDuration,
      });
    }
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0477BF]">Gestión de Catálogos</h1>
        <p className="text-gray-600 mt-1">
          Administra especialistas y servicios extras por sucursal
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#0477BF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Especialistas</p>
              <p className="text-2xl font-bold text-[#0477BF]">{specialists.length}</p>
              <p className="text-xs text-gray-500">
                Activos: {specialists.filter((s) => s.status === "Activo").length}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-[#0477BF] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-l-4 border-[#62BF04]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Servicios Extras</p>
              <p className="text-2xl font-bold text-[#62BF04]">{extraServices.length}</p>
              <p className="text-xs text-gray-500">
                Activos: {extraServices.filter((s) => s.status === "Activo").length}
              </p>
            </div>
            <TestTube className="w-8 h-8 text-[#62BF04] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Zona 10</p>
              <p className="text-lg font-bold text-purple-600">
                {specialists.filter((s) => s.branchId === 1).length} Especialistas
              </p>
              <p className="text-xs text-gray-500">
                {extraServices.filter((s) => s.branchId === 1).length} Servicios
              </p>
            </div>
            <MapPin className="w-8 h-8 text-purple-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-white border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Zona 11</p>
              <p className="text-lg font-bold text-orange-600">
                {specialists.filter((s) => s.branchId === 2).length} Especialistas
              </p>
              <p className="text-xs text-gray-500">
                {extraServices.filter((s) => s.branchId === 2).length} Servicios
              </p>
            </div>
            <MapPin className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specialists">
            <Stethoscope className="w-4 h-4 mr-2" />
            Médicos Especialistas
          </TabsTrigger>
          <TabsTrigger value="services">
            <TestTube className="w-4 h-4 mr-2" />
            Servicios Extras
          </TabsTrigger>
        </TabsList>

        {/* TAB: ESPECIALISTAS */}
        <TabsContent value="specialists" className="space-y-4">
          <Card className="p-6">
            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar especialista por nombre, especialidad o licencia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  <SelectItem value="1">Zona 10</SelectItem>
                  <SelectItem value="2">Zona 11</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activos</SelectItem>
                  <SelectItem value="Inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                className="bg-[#0477BF] hover:bg-[#0369a1]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Especialista
              </Button>
            </div>

            {/* Tabla de especialistas */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Licencia</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Tarifa Negociada</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpecialists.length > 0 ? (
                  filteredSpecialists.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{doc.name}</p>
                          {doc.notes && (
                            <p className="text-xs text-gray-500 mt-1">{doc.notes}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50">
                          <Heart className="w-3 h-3 mr-1" />
                          {doc.specialty}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{doc.license}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {doc.email || "N/A"}
                          </p>
                          <p className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {doc.phone || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                          <span className="font-bold text-[#62BF04]">
                            {doc.negotiatedRate.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {doc.contract}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            doc.branchId === 1
                              ? "bg-purple-500"
                              : "bg-orange-500"
                          }
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {getBranchName(doc.branchId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            doc.status === "Activo"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleSpecialistStatus(doc.id)}
                            className={
                              doc.status === "Activo"
                                ? "text-gray-500"
                                : "text-green-600"
                            }
                            title={
                              doc.status === "Activo"
                                ? "Desactivar"
                                : "Activar"
                            }
                          >
                            {doc.status === "Activo" ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(doc, "specialist")}
                            className="text-[#0477BF]"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSpecialist(doc.id)}
                            className="text-red-500"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      <Stethoscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No se encontraron especialistas</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB: SERVICIOS EXTRAS */}
        <TabsContent value="services" className="space-y-4">
          <Card className="p-6">
            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar servicio por nombre, código o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las sucursales</SelectItem>
                  <SelectItem value="1">Zona 10</SelectItem>
                  <SelectItem value="2">Zona 11</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activos</SelectItem>
                  <SelectItem value="Inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                className="bg-[#62BF04] hover:bg-[#52a003]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Servicio
              </Button>
            </div>

            {/* Tabla de servicios */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Requiere Cita</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-mono text-sm font-semibold">
                        {service.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{service.name}</p>
                          {service.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-xs">
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                          <span className="font-bold text-[#62BF04]">
                            {service.price.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            service.branchId === 1
                              ? "bg-purple-500"
                              : "bg-orange-500"
                          }
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {getBranchName(service.branchId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.requiresAppointment ? (
                          <Badge className="bg-blue-500">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Sí
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {service.estimatedDuration ? (
                          <span className="text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.estimatedDuration} min
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            service.status === "Activo"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleServiceStatus(service.id)}
                            className={
                              service.status === "Activo"
                                ? "text-gray-500"
                                : "text-green-600"
                            }
                            title={
                              service.status === "Activo"
                                ? "Desactivar"
                                : "Activar"
                            }
                          >
                            {service.status === "Activo" ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(service, "service")}
                            className="text-[#0477BF]"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-500"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      <TestTube className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No se encontraron servicios</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: AGREGAR */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              {activeTab === "specialists" ? "Agregar Médico Especialista" : "Agregar Servicio Extra"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "specialists"
                ? "Completa la información del médico especialista y su tarifa negociada"
                : "Completa la información del servicio extra"}
            </DialogDescription>
          </DialogHeader>

          {activeTab === "specialists" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre Completo *</Label>
                  <Input
                    placeholder="Dr. Juan Pérez"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Especialidad *</Label>
                  <Select
                    value={formData.specialty || ""}
                    onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Licencia Médica *</Label>
                  <Input
                    placeholder="ESP-GT-2024-001"
                    value={formData.license || ""}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="+502 5555-1234"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Correo Electrónico</Label>
                <Input
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tarifa Negociada (Q) *</Label>
                  <div className="relative">
                    <QuetzalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="250.00"
                      value={formData.negotiatedRate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, negotiatedRate: e.target.value })
                      }
                      className="pl-10"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <Label>Tipo de Contrato *</Label>
                  <Select
                    value={formData.contract || ""}
                    onValueChange={(value) => setFormData({ ...formData, contract: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Sucursal *</Label>
                <Select
                  value={formData.branchId || ""}
                  onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {b.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notas adicionales</Label>
                <Textarea
                  placeholder="Ej: Disponibilidad, horarios especiales, etc."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Código del Servicio *</Label>
                  <Input
                    placeholder="LAB-001"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Precio (Q) *</Label>
                  <div className="relative">
                    <QuetzalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="150.00"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="pl-10"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Nombre del Servicio *</Label>
                <Input
                  placeholder="Ej: Hemograma Completo"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Descripción detallada del servicio"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Categoría *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sucursal *</Label>
                <Select
                  value={formData.branchId || ""}
                  onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {b.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>¿Requiere Cita?</Label>
                  <Select
                    value={formData.requiresAppointment || "false"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, requiresAppointment: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duración Estimada (minutos)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.estimatedDuration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedDuration: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={
                activeTab === "specialists" ? handleAddSpecialist : handleAddService
              }
              className="bg-[#0477BF] hover:bg-[#0369a1]"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDITAR */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              {activeTab === "specialists" ? "Editar Médico Especialista" : "Editar Servicio Extra"}
            </DialogTitle>
            <DialogDescription>
              Modifica la información del {activeTab === "specialists" ? "especialista" : "servicio"}
            </DialogDescription>
          </DialogHeader>

          {activeTab === "specialists" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre Completo *</Label>
                  <Input
                    placeholder="Dr. Juan Pérez"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Especialidad *</Label>
                  <Select
                    value={formData.specialty || ""}
                    onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Licencia Médica *</Label>
                  <Input
                    placeholder="ESP-GT-2024-001"
                    value={formData.license || ""}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="+502 5555-1234"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Correo Electrónico</Label>
                <Input
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tarifa Negociada (Q) *</Label>
                  <div className="relative">
                    <QuetzalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="250.00"
                      value={formData.negotiatedRate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, negotiatedRate: e.target.value })
                      }
                      className="pl-10"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <Label>Tipo de Contrato *</Label>
                  <Select
                    value={formData.contract || ""}
                    onValueChange={(value) => setFormData({ ...formData, contract: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Sucursal *</Label>
                <Select
                  value={formData.branchId || ""}
                  onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {b.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notas adicionales</Label>
                <Textarea
                  placeholder="Ej: Disponibilidad, horarios especiales, etc."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Código del Servicio *</Label>
                  <Input
                    placeholder="LAB-001"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Precio (Q) *</Label>
                  <div className="relative">
                    <QuetzalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="150.00"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="pl-10"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Nombre del Servicio *</Label>
                <Input
                  placeholder="Ej: Hemograma Completo"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Descripción detallada del servicio"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Categoría *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sucursal *</Label>
                <Select
                  value={formData.branchId || ""}
                  onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {b.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>¿Requiere Cita?</Label>
                  <Select
                    value={formData.requiresAppointment || "false"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, requiresAppointment: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duración Estimada (minutos)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.estimatedDuration || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedDuration: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={
                activeTab === "specialists" ? handleEditSpecialist : handleEditService
              }
              className="bg-[#0477BF] hover:bg-[#0369a1]"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
