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
  Wallet,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  MapPin,
  Stethoscope,
  Building2,
  Calendar,
  Filter,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";
import { useCatalogStore } from "../store/useCatalogStore";
import { useAuthStore } from "../store/useAuthStore";

// Tipos
interface AccountPayable {
  id: number;
  payableNumber: string;
  recipientType: "Especialista" | "Proveedor";
  recipientId: number;
  recipientName: string;
  concept: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Pendiente" | "Aprobada" | "Pagada" | "Rechazada";
  branchId: number;
  invoiceNumber?: string;
  paymentMethod?: string;
  paymentDate?: string;
  paymentReference?: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
}

interface Supplier {
  id: number;
  name: string;
  nit: string;
  contact: string;
  phone: string;
  email: string;
  type: string;
}

// Proveedores mock
const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Laboratorios Clínicos Central",
    nit: "12345678-9",
    contact: "Ana María Rodríguez",
    phone: "+502 2334-5000",
    email: "facturacion@labcentral.com.gt",
    type: "Laboratorio",
  },
  {
    id: 2,
    name: "Farmacia San José",
    nit: "98765432-1",
    contact: "Carlos Méndez",
    phone: "+502 2440-6000",
    email: "ventas@farmaciasanjose.com",
    type: "Farmacia",
  },
  {
    id: 3,
    name: "Equipos Médicos Guatemala",
    nit: "55667788-0",
    contact: "Roberto Gómez",
    phone: "+502 2366-7000",
    email: "info@equiposmedgt.com",
    type: "Equipos Médicos",
  },
];

// Cuentas por pagar mock
const mockPayables: AccountPayable[] = [
  {
    id: 1,
    payableNumber: "CXP-2025-0001",
    recipientType: "Especialista",
    recipientId: 1,
    recipientName: "Dr. Fernando Ruiz Castillo",
    concept: "Consultas Cardiología - Enero 2025",
    amount: 2500,
    date: "2025-01-25",
    dueDate: "2025-02-05",
    status: "Aprobada",
    branchId: 1,
    invoiceNumber: "FAC-DR-001",
    approvedBy: "Ana García - Finanzas",
    approvedDate: "2025-01-26",
  },
  {
    id: 2,
    payableNumber: "CXP-2025-0002",
    recipientType: "Proveedor",
    recipientId: 1,
    recipientName: "Laboratorios Clínicos Central",
    concept: "Servicios de laboratorio - Diciembre 2024",
    amount: 4500,
    date: "2025-01-20",
    dueDate: "2025-02-04",
    status: "Pagada",
    branchId: 1,
    invoiceNumber: "LAB-2024-0345",
    paymentMethod: "Transferencia Bancaria",
    paymentDate: "2025-01-22",
    paymentReference: "TRF-202501220001",
    approvedBy: "Ana García - Finanzas",
    approvedDate: "2025-01-21",
  },
  {
    id: 3,
    payableNumber: "CXP-2025-0003",
    recipientType: "Especialista",
    recipientId: 3,
    recipientName: "Dr. Miguel Santana Pérez",
    concept: "Consultas Traumatología - Enero 2025",
    amount: 3360,
    date: "2025-01-26",
    dueDate: "2025-02-10",
    status: "Pendiente",
    branchId: 2,
    invoiceNumber: "FAC-DR-003",
  },
  {
    id: 4,
    payableNumber: "CXP-2025-0004",
    recipientType: "Proveedor",
    recipientId: 2,
    recipientName: "Farmacia San José",
    concept: "Medicamentos varios",
    amount: 1250,
    date: "2025-01-15",
    dueDate: "2025-01-30",
    status: "Pendiente",
    branchId: 2,
    invoiceNumber: "FARM-2025-089",
  },
];

const branches = [
  { id: 1, name: "Zona 10" },
  { id: 2, name: "Zona 11" },
];

export function PayablesPage() {
  const specialists = useCatalogStore((state) => state.specialists);
  const user = useAuthStore((state) => state.user);
  
  const [payables, setPayables] = useState<AccountPayable[]>(mockPayables);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<AccountPayable | null>(null);

  // Filtrar cuentas por pagar
  const filteredPayables = payables.filter((payable) => {
    const matchesSearch =
      payable.payableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.concept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || payable.status === filterStatus;
    const matchesBranch = filterBranch === "all" || payable.branchId.toString() === filterBranch;
    const matchesType = filterType === "all" || payable.recipientType === filterType;

    return matchesSearch && matchesStatus && matchesBranch && matchesType;
  });

  // Estadísticas
  const totalPendiente = payables
    .filter((p) => p.status === "Pendiente")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalAprobado = payables
    .filter((p) => p.status === "Aprobada")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPagado = payables
    .filter((p) => p.status === "Pagada")
    .reduce((sum, p) => sum + p.amount, 0);

  // Por sucursal
  const zona10Total = payables
    .filter((p) => p.branchId === 1 && p.status !== "Rechazada")
    .reduce((sum, p) => sum + p.amount, 0);

  const zona11Total = payables
    .filter((p) => p.branchId === 2 && p.status !== "Rechazada")
    .reduce((sum, p) => sum + p.amount, 0);

  // Ver detalle
  const viewDetail = (payable: AccountPayable) => {
    setSelectedPayable(payable);
    setShowDetailDialog(true);
  };

  // Aprobar cuenta por pagar
  const approvePayable = (id: number) => {
    setPayables(
      payables.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "Aprobada",
              approvedBy: `${user?.name} - Finanzas`,
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );
    toast.success("Cuenta por pagar aprobada", {
      description: "La cuenta ha sido aprobada y está lista para pago",
    });
  };

  // Rechazar cuenta por pagar
  const rejectPayable = (id: number) => {
    if (confirm("¿Estás seguro de rechazar esta cuenta por pagar?")) {
      setPayables(payables.map((p) => (p.id === id ? { ...p, status: "Rechazada" } : p)));
      toast.error("Cuenta por pagar rechazada");
    }
  };

  // Marcar como pagada
  const markAsPaid = (payable: AccountPayable) => {
    setSelectedPayable(payable);
    setShowPaymentDialog(true);
  };

  // Confirmar pago
  const confirmPayment = (paymentMethod: string, reference: string) => {
    if (!selectedPayable) return;

    setPayables(
      payables.map((p) =>
        p.id === selectedPayable.id
          ? {
              ...p,
              status: "Pagada",
              paymentMethod,
              paymentDate: new Date().toISOString().split("T")[0],
              paymentReference: reference,
            }
          : p
      )
    );

    toast.success("Pago registrado exitosamente", {
      description: `Pago a ${selectedPayable.recipientName} registrado`,
    });

    setShowPaymentDialog(false);
    setSelectedPayable(null);
  };

  // Badge de estado
  const getStatusBadge = (status: AccountPayable["status"]) => {
    switch (status) {
      case "Pagada":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Pagada
          </Badge>
        );
      case "Aprobada":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aprobada
          </Badge>
        );
      case "Pendiente":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "Rechazada":
        return (
          <Badge className="bg-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazada
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0477BF]">Cuentas por Pagar</h1>
        <p className="text-gray-600 mt-1">
          Gestión de pagos a especialistas y proveedores por sucursal
        </p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pendiente de Aprobar</p>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-5 h-5 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">
                  {totalPendiente.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {payables.filter((p) => p.status === "Pendiente").length} cuentas
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Aprobado (Por Pagar)</p>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{totalAprobado.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {payables.filter((p) => p.status === "Aprobada").length} cuentas
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Pagado</p>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-5 h-5 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{totalPagado.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Este mes</p>
            </div>
            <Wallet className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Cuentas</p>
              <p className="text-2xl font-bold text-purple-600">{payables.length}</p>
              <p className="text-xs text-gray-500 mt-1">Todas las sucursales</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Estadísticas por Sucursal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <p className="font-semibold text-purple-800">Zona 10</p>
              </div>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-6 h-6 text-purple-600" />
                <p className="text-3xl font-bold text-purple-600">{zona10Total.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {payables.filter((p) => p.branchId === 1).length} cuentas
              </p>
            </div>
            <Building2 className="w-12 h-12 text-purple-500 opacity-30" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-white border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <p className="font-semibold text-orange-800">Zona 11</p>
              </div>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-6 h-6 text-orange-600" />
                <p className="text-3xl font-bold text-orange-600">{zona11Total.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {payables.filter((p) => p.branchId === 2).length} cuentas
              </p>
            </div>
            <Building2 className="w-12 h-12 text-orange-500 opacity-30" />
          </div>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por número, beneficiario, concepto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Especialista">Especialistas</SelectItem>
              <SelectItem value="Proveedor">Proveedores</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Aprobada">Aprobada</SelectItem>
              <SelectItem value="Pagada">Pagada</SelectItem>
              <SelectItem value="Rechazada">Rechazada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sucursal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="1">Zona 10</SelectItem>
              <SelectItem value="2">Zona 11</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#0477BF] hover:bg-[#0369a1]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cuenta
          </Button>
        </div>
      </Card>

      {/* Tabla de cuentas por pagar */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Beneficiario</TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayables.length > 0 ? (
              filteredPayables.map((payable) => (
                <TableRow key={payable.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{payable.payableNumber}</p>
                      <p className="text-xs text-gray-500">{payable.date}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        {payable.recipientType === "Especialista" ? (
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Building2 className="w-4 h-4 text-orange-600" />
                        )}
                        <p className="font-semibold">{payable.recipientName}</p>
                      </div>
                      <p className="text-xs text-gray-500">{payable.recipientType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{payable.concept}</p>
                  </TableCell>
                  <TableCell>
                    {payable.invoiceNumber && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {payable.invoiceNumber}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{payable.date}</TableCell>
                  <TableCell>
                    <span
                      className={
                        new Date(payable.dueDate) < new Date() &&
                        payable.status !== "Pagada"
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {payable.dueDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={payable.branchId === 1 ? "bg-purple-500" : "bg-orange-500"}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {branches.find((b) => b.id === payable.branchId)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                      <span className="font-bold text-[#62BF04]">
                        {payable.amount.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payable.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewDetail(payable)}
                        className="text-[#0477BF]"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {payable.status === "Pendiente" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => approvePayable(payable.id)}
                            className="text-green-600"
                            title="Aprobar"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => rejectPayable(payable.id)}
                            className="text-red-500"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {payable.status === "Aprobada" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsPaid(payable)}
                          className="text-blue-600"
                          title="Registrar pago"
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                  <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No se encontraron cuentas por pagar</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog: Ver Detalle */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              Detalle de Cuenta por Pagar - {selectedPayable?.payableNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedPayable && (
            <div className="space-y-4">
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Beneficiario</p>
                    <p className="font-semibold">{selectedPayable.recipientName}</p>
                    <p className="text-xs text-gray-500">{selectedPayable.recipientType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Concepto</p>
                    <p className="font-semibold">{selectedPayable.concept}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Monto</p>
                    <div className="flex items-center gap-1">
                      <QuetzalIcon className="w-5 h-5 text-[#62BF04]" />
                      <p className="text-xl font-bold text-[#62BF04]">
                        {selectedPayable.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Estado</p>
                    {getStatusBadge(selectedPayable.status)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Fecha de Emisión</p>
                    <p className="font-semibold">{selectedPayable.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Fecha de Vencimiento</p>
                    <p className="font-semibold">{selectedPayable.dueDate}</p>
                  </div>
                  {selectedPayable.invoiceNumber && (
                    <div>
                      <p className="text-xs text-gray-600">Número de Factura</p>
                      <p className="font-semibold font-mono">{selectedPayable.invoiceNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-600">Sucursal</p>
                    <Badge
                      className={
                        selectedPayable.branchId === 1 ? "bg-purple-500" : "bg-orange-500"
                      }
                    >
                      {branches.find((b) => b.id === selectedPayable.branchId)?.name}
                    </Badge>
                  </div>
                </div>
              </Card>

              {selectedPayable.status === "Aprobada" && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">Aprobada para Pago</p>
                      <p className="text-sm text-blue-700">
                        Aprobado por: {selectedPayable.approvedBy} •{" "}
                        {selectedPayable.approvedDate}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {selectedPayable.status === "Pagada" && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Pago Realizado</p>
                      <p className="text-sm text-green-700">
                        Método: {selectedPayable.paymentMethod} • Fecha:{" "}
                        {selectedPayable.paymentDate}
                      </p>
                      {selectedPayable.paymentReference && (
                        <p className="text-sm text-green-700 font-mono">
                          Ref: {selectedPayable.paymentReference}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Registrar Pago */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">Registrar Pago</DialogTitle>
            <DialogDescription>
              Completa la información del pago realizado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Método de Pago *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Número de Referencia / Cheque</Label>
              <Input placeholder="TRF-202501280001" />
            </div>

            <div>
              <Label>Notas (opcional)</Label>
              <Textarea placeholder="Información adicional sobre el pago..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => confirmPayment("Transferencia Bancaria", "TRF-202501280001")}
              className="bg-[#62BF04] hover:bg-[#52a003]"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Crear Nueva Cuenta por Pagar */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">Nueva Cuenta por Pagar</DialogTitle>
            <DialogDescription>Registra una nueva obligación de pago</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Beneficiario *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="especialista">Médico Especialista</SelectItem>
                    <SelectItem value="proveedor">Proveedor de Servicios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Beneficiario *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} - {s.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Concepto *</Label>
              <Input placeholder="Ej: Consultas Enero 2025" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monto (Q) *</Label>
                <div className="relative">
                  <QuetzalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input type="number" placeholder="0.00" className="pl-10" step="0.01" />
                </div>
              </div>
              <div>
                <Label>Fecha de Vencimiento *</Label>
                <Input type="date" />
              </div>
            </div>

            <div>
              <Label>Sucursal *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Zona 10</SelectItem>
                  <SelectItem value="2">Zona 11</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Número de Factura (opcional)</Label>
              <Input placeholder="FAC-DR-001" />
            </div>

            <div>
              <Label>Notas (opcional)</Label>
              <Textarea placeholder="Información adicional..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success("Cuenta por pagar creada", {
                  description: "La cuenta ha sido registrada exitosamente",
                });
                setShowCreateDialog(false);
              }}
              className="bg-[#0477BF] hover:bg-[#0369a1]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}