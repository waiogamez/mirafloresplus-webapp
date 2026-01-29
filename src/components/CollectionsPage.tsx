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
  CreditCard,
  Search,
  Upload,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Filter,
  Download,
  Receipt,
  MapPin,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner@2.0.3";

// Tipos
interface PendingQuote {
  id: number;
  quoteId: string;
  affiliateId: string;
  affiliateName: string;
  approvedDate: string;
  services: string[];
  total: number;
  branchId: number;
  status: "Pendiente de Pago" | "Pago Registrado" | "Facturado";
  paymentProof?: string;
  paymentDate?: string;
  paymentMethod?: string;
  registeredBy?: string;
}

interface MonthlyMembership {
  id: number;
  affiliateId: string;
  affiliateName: string;
  membershipType: string;
  monthlyFee: number;
  dueDate: string;
  period: string; // "Enero 2025"
  status: "Pendiente" | "Pagado" | "Vencido" | "Facturado";
  paymentDate?: string;
  paymentMethod?: string;
  paymentProof?: string;
  branchId: number;
}

// Mock data - Cotizaciones aprobadas pendientes de pago
const mockPendingQuotes: PendingQuote[] = [
  {
    id: 1,
    quoteId: "Q-2025-0001",
    affiliateId: "MFP-2025-001",
    affiliateName: "Juan Carlos Pérez",
    approvedDate: "2025-01-10",
    services: ["Consulta Cardiológica", "Electrocardiograma"],
    total: 414.4,
    branchId: 1,
    status: "Pago Registrado",
    paymentProof: "comprobante-001.pdf",
    paymentDate: "2025-01-16",
    paymentMethod: "Tarjeta de Crédito",
    registeredBy: "Ana Recepción",
  },
  {
    id: 2,
    quoteId: "Q-2025-0004",
    affiliateId: "MFP-2025-089",
    affiliateName: "Carmen Rodríguez",
    approvedDate: "2025-01-22",
    services: ["Radiografía de Tórax", "Consulta General"],
    total: 280.0,
    branchId: 1,
    status: "Pendiente de Pago",
  },
  {
    id: 3,
    quoteId: "Q-2025-0005",
    affiliateId: "MFP-2024-156",
    affiliateName: "Miguel Ángel Torres",
    approvedDate: "2025-01-25",
    services: ["Ultrasonido Abdominal"],
    total: 350.0,
    branchId: 2,
    status: "Pendiente de Pago",
  },
];

// Mock data - Membresías mensuales
const mockMemberships: MonthlyMembership[] = [
  {
    id: 1,
    affiliateId: "MFP-2024-001",
    affiliateName: "Roberto Martínez",
    membershipType: "Plan Familiar",
    monthlyFee: 450.0,
    dueDate: "2025-02-01",
    period: "Febrero 2025",
    status: "Pendiente",
    branchId: 1,
  },
  {
    id: 2,
    affiliateId: "MFP-2024-025",
    affiliateName: "María Fernanda López",
    membershipType: "Plan Individual",
    monthlyFee: 250.0,
    dueDate: "2025-02-01",
    period: "Febrero 2025",
    status: "Pendiente",
    branchId: 1,
  },
  {
    id: 3,
    affiliateId: "MFP-2024-078",
    affiliateName: "José Luis Hernández",
    membershipType: "Plan Empresarial",
    monthlyFee: 800.0,
    dueDate: "2025-02-01",
    period: "Febrero 2025",
    status: "Pagado",
    paymentDate: "2025-01-28",
    paymentMethod: "Transferencia Bancaria",
    paymentProof: "transferencia-078.pdf",
    branchId: 2,
  },
  {
    id: 4,
    affiliateId: "MFP-2024-099",
    affiliateName: "Ana Patricia Gómez",
    membershipType: "Plan Familiar",
    monthlyFee: 450.0,
    dueDate: "2025-01-01",
    period: "Enero 2025",
    status: "Vencido",
    branchId: 1,
  },
];

const branches = [
  { id: 1, name: "Zona 10" },
  { id: 2, name: "Zona 11" },
];

const paymentMethods = [
  "Efectivo",
  "Tarjeta de Crédito",
  "Tarjeta de Débito",
  "Transferencia Bancaria",
  "Depósito Bancario",
  "Cheque",
];

export function CollectionsPage() {
  const [pendingQuotes, setPendingQuotes] = useState<PendingQuote[]>(mockPendingQuotes);
  const [memberships, setMemberships] = useState<MonthlyMembership[]>(mockMemberships);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Dialog states - Registrar pago de cotización
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<PendingQuote | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  // Dialog states - Registrar pago de membresía
  const [showMembershipPaymentDialog, setShowMembershipPaymentDialog] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<MonthlyMembership | null>(null);
  const [membershipPaymentMethod, setMembershipPaymentMethod] = useState("");
  const [membershipPaymentNotes, setMembershipPaymentNotes] = useState("");
  const [membershipPaymentProofFile, setMembershipPaymentProofFile] = useState<File | null>(null);

  // Estadísticas para cotizaciones
  const totalPendingQuotes = pendingQuotes.filter(
    (q) => q.status === "Pendiente de Pago"
  ).length;
  const totalPendingQuotesAmount = pendingQuotes
    .filter((q) => q.status === "Pendiente de Pago")
    .reduce((sum, q) => sum + q.total, 0);

  const totalRegisteredPayments = pendingQuotes.filter(
    (q) => q.status === "Pago Registrado"
  ).length;
  const totalRegisteredPaymentsAmount = pendingQuotes
    .filter((q) => q.status === "Pago Registrado")
    .reduce((sum, q) => sum + q.total, 0);

  // Estadísticas para membresías
  const totalPendingMemberships = memberships.filter(
    (m) => m.status === "Pendiente" || m.status === "Vencido"
  ).length;
  const totalPendingMembershipsAmount = memberships
    .filter((m) => m.status === "Pendiente" || m.status === "Vencido")
    .reduce((sum, m) => sum + m.monthlyFee, 0);

  const totalPaidMemberships = memberships.filter((m) => m.status === "Pagado").length;
  const totalPaidMembershipsAmount = memberships
    .filter((m) => m.status === "Pagado")
    .reduce((sum, m) => sum + m.monthlyFee, 0);

  // Filtrar cotizaciones
  const filteredQuotes = pendingQuotes.filter((quote) => {
    const matchesSearch =
      quote.quoteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.affiliateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.affiliateId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = filterBranch === "all" || quote.branchId.toString() === filterBranch;
    const matchesStatus = filterStatus === "all" || quote.status === filterStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Filtrar membresías
  const filteredMemberships = memberships.filter((membership) => {
    const matchesSearch =
      membership.affiliateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membership.affiliateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membership.membershipType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch =
      filterBranch === "all" || membership.branchId.toString() === filterBranch;

    return matchesSearch && matchesBranch;
  });

  // Abrir diálogo de registro de pago de cotización
  const openPaymentDialog = (quote: PendingQuote) => {
    setSelectedQuote(quote);
    setPaymentMethod("");
    setPaymentNotes("");
    setPaymentProofFile(null);
    setShowPaymentDialog(true);
  };

  // Registrar pago de cotización
  const registerPayment = () => {
    if (!selectedQuote || !paymentMethod) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!paymentProofFile) {
      toast.error("Por favor sube un comprobante de pago");
      return;
    }

    const updatedQuotes = pendingQuotes.map((q) =>
      q.id === selectedQuote.id
        ? {
            ...q,
            status: "Pago Registrado" as const,
            paymentDate: new Date().toISOString().split("T")[0],
            paymentMethod,
            paymentProof: paymentProofFile.name,
            registeredBy: "Usuario Actual", // En producción sería el usuario autenticado
          }
        : q
    );

    setPendingQuotes(updatedQuotes);
    setShowPaymentDialog(false);
    toast.success("Pago registrado exitosamente", {
      description: `El pago de la cotización ${selectedQuote.quoteId} ha sido registrado`,
    });
  };

  // Abrir diálogo de registro de pago de membresía
  const openMembershipPaymentDialog = (membership: MonthlyMembership) => {
    setSelectedMembership(membership);
    setMembershipPaymentMethod("");
    setMembershipPaymentNotes("");
    setMembershipPaymentProofFile(null);
    setShowMembershipPaymentDialog(true);
  };

  // Registrar pago de membresía
  const registerMembershipPayment = () => {
    if (!selectedMembership || !membershipPaymentMethod) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (!membershipPaymentProofFile) {
      toast.error("Por favor sube un comprobante de pago");
      return;
    }

    const updatedMemberships = memberships.map((m) =>
      m.id === selectedMembership.id
        ? {
            ...m,
            status: "Pagado" as const,
            paymentDate: new Date().toISOString().split("T")[0],
            paymentMethod: membershipPaymentMethod,
            paymentProof: membershipPaymentProofFile.name,
          }
        : m
    );

    setMemberships(updatedMemberships);
    setShowMembershipPaymentDialog(false);
    toast.success("Pago de membresía registrado exitosamente", {
      description: `Membresía de ${selectedMembership.affiliateName} - ${selectedMembership.period}`,
    });
  };

  // Generar factura desde cotización pagada
  const generateInvoiceFromQuote = (quote: PendingQuote) => {
    if (quote.status !== "Pago Registrado") {
      toast.error("Solo se pueden facturar cotizaciones con pago registrado");
      return;
    }

    // Simular generación de factura
    const updatedQuotes = pendingQuotes.map((q) =>
      q.id === quote.id ? { ...q, status: "Facturado" as const } : q
    );

    setPendingQuotes(updatedQuotes);
    toast.success("Factura generada exitosamente", {
      description: `Factura FEL generada para cotización ${quote.quoteId}`,
    });

    // Aquí se integraría con el sistema de facturación FEL de SAT Guatemala
  };

  // Generar factura desde membresía pagada
  const generateInvoiceFromMembership = (membership: MonthlyMembership) => {
    if (membership.status !== "Pagado") {
      toast.error("Solo se pueden facturar membresías con pago registrado");
      return;
    }

    const updatedMemberships = memberships.map((m) =>
      m.id === membership.id ? { ...m, status: "Facturado" as const } : m
    );

    setMemberships(updatedMemberships);
    toast.success("Factura de membresía generada exitosamente", {
      description: `Factura FEL generada para ${membership.affiliateName} - ${membership.period}`,
    });
  };

  // Obtener badge de estado para cotizaciones
  const getQuoteStatusBadge = (status: PendingQuote["status"]) => {
    switch (status) {
      case "Pendiente de Pago":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente de Pago
          </Badge>
        );
      case "Pago Registrado":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Pago Registrado
          </Badge>
        );
      case "Facturado":
        return (
          <Badge className="bg-[#0477BF]">
            <FileText className="w-3 h-3 mr-1" />
            Facturado
          </Badge>
        );
    }
  };

  // Obtener badge de estado para membresías
  const getMembershipStatusBadge = (status: MonthlyMembership["status"]) => {
    switch (status) {
      case "Pendiente":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "Pagado":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Pagado
          </Badge>
        );
      case "Vencido":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Vencido
          </Badge>
        );
      case "Facturado":
        return (
          <Badge className="bg-[#0477BF]">
            <FileText className="w-3 h-3 mr-1" />
            Facturado
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0477BF]">Cobros y Registro de Pagos</h1>
        <p className="text-gray-600 mt-1">
          Centro de control para registro de pagos y generación de facturas
        </p>

        {/* Regla de Oro */}
        <Card className="mt-4 p-4 bg-amber-50 border-amber-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-800 mb-1">⚠️ REGLA DE ORO</p>
              <p className="text-sm text-amber-700">
                <strong>NO SE FACTURA NADA QUE NO TENGA UN PAGO COMPROBADO EN EL SISTEMA.</strong>
                <br />
                Todo pago debe estar respaldado con su comprobante antes de generar la factura
                electrónica FEL.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Cotizaciones Aprobadas
          </TabsTrigger>
          <TabsTrigger value="memberships" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Membresías Mensuales
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: COTIZACIONES APROBADAS */}
        <TabsContent value="quotes" className="space-y-6">
          {/* Estadísticas - Cotizaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pendientes de Pago</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalPendingQuotes}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <QuetzalIcon className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm font-semibold text-yellow-600">
                      {totalPendingQuotesAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pagos Registrados</p>
                  <p className="text-2xl font-bold text-green-600">{totalRegisteredPayments}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <QuetzalIcon className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-semibold text-green-600">
                      {totalRegisteredPaymentsAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#0477BF]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Listos para Facturar</p>
                  <p className="text-2xl font-bold text-[#0477BF]">{totalRegisteredPayments}</p>
                  <p className="text-xs text-gray-500 mt-1">Con comprobante válido</p>
                </div>
                <QuetzalIcon className="w-8 h-8 text-[#0477BF] opacity-50" />
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cotización, afiliado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente de Pago">Pendiente de Pago</SelectItem>
                  <SelectItem value="Pago Registrado">Pago Registrado</SelectItem>
                  <SelectItem value="Facturado">Facturado</SelectItem>
                </SelectContent>
              </Select>
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
            </div>
          </Card>

          {/* Tabla de Cotizaciones */}
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cotización</TableHead>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Servicios</TableHead>
                  <TableHead>Aprobada</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.length > 0 ? (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-[#0477BF]">{quote.quoteId}</p>
                          {quote.paymentDate && (
                            <p className="text-xs text-green-600">
                              Pagado: {quote.paymentDate}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{quote.affiliateName}</p>
                          <p className="text-xs text-gray-500">{quote.affiliateId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {quote.services.slice(0, 2).map((service, idx) => (
                            <div key={idx} className="text-gray-700">
                              • {service}
                            </div>
                          ))}
                          {quote.services.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{quote.services.length - 2} más
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{quote.approvedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                          <span className="font-bold text-[#62BF04]">
                            {quote.total.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            quote.branchId === 1 ? "bg-purple-500" : "bg-orange-500"
                          }
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {branches.find((b) => b.id === quote.branchId)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{getQuoteStatusBadge(quote.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {quote.status === "Pendiente de Pago" && (
                            <Button
                              size="sm"
                              onClick={() => openPaymentDialog(quote)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Registrar Pago
                            </Button>
                          )}
                          {quote.status === "Pago Registrado" && (
                            <>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <FileCheck className="w-3 h-3 mr-1" />
                                {quote.paymentProof}
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => generateInvoiceFromQuote(quote)}
                                className="bg-[#0477BF] hover:bg-[#0369a1]"
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                Generar Factura FEL
                              </Button>
                            </>
                          )}
                          {quote.status === "Facturado" && (
                            <Badge className="bg-[#0477BF]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Facturado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      <FileCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No se encontraron cotizaciones</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 2: MEMBRESÍAS MENSUALES */}
        <TabsContent value="memberships" className="space-y-6">
          {/* Estadísticas - Membresías */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pendientes y Vencidas</p>
                  <p className="text-2xl font-bold text-red-600">{totalPendingMemberships}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <QuetzalIcon className="w-4 h-4 text-red-600" />
                    <p className="text-sm font-semibold text-red-600">
                      {totalPendingMembershipsAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pagadas Este Mes</p>
                  <p className="text-2xl font-bold text-green-600">{totalPaidMemberships}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <QuetzalIcon className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-semibold text-green-600">
                      {totalPaidMembershipsAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Afiliados Activos</p>
                  <p className="text-2xl font-bold text-purple-600">{memberships.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Con membresía activa</p>
                </div>
                <Users className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por afiliado, tipo de membresía..."
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
            </div>
          </Card>

          {/* Tabla de Membresías */}
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Tipo de Plan</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Monto Mensual</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemberships.length > 0 ? (
                  filteredMemberships.map((membership) => (
                    <TableRow key={membership.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{membership.affiliateName}</p>
                          <p className="text-xs text-gray-500">{membership.affiliateId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50">
                          {membership.membershipType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>{membership.period}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            new Date(membership.dueDate) < new Date() &&
                            membership.status === "Pendiente"
                              ? "text-red-600 font-semibold"
                              : ""
                          }
                        >
                          {membership.dueDate}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                          <span className="font-bold text-[#62BF04]">
                            {membership.monthlyFee.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            membership.branchId === 1 ? "bg-purple-500" : "bg-orange-500"
                          }
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {branches.find((b) => b.id === membership.branchId)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{getMembershipStatusBadge(membership.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {(membership.status === "Pendiente" ||
                            membership.status === "Vencido") && (
                            <Button
                              size="sm"
                              onClick={() => openMembershipPaymentDialog(membership)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Registrar Pago
                            </Button>
                          )}
                          {membership.status === "Pagado" && (
                            <>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <FileCheck className="w-3 h-3 mr-1" />
                                {membership.paymentProof}
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => generateInvoiceFromMembership(membership)}
                                className="bg-[#0477BF] hover:bg-[#0369a1]"
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                Generar Factura FEL
                              </Button>
                            </>
                          )}
                          {membership.status === "Facturado" && (
                            <Badge className="bg-[#0477BF]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Facturado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No se encontraron membresías</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Registrar Pago de Cotización */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">Registrar Pago de Cotización</DialogTitle>
            <DialogDescription>
              Cotización: {selectedQuote?.quoteId} - {selectedQuote?.affiliateName}
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-4">
              {/* Resumen */}
              <Card className="p-4 bg-blue-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Total a Pagar</p>
                    <div className="flex items-center gap-1">
                      <QuetzalIcon className="w-5 h-5 text-[#0477BF]" />
                      <p className="text-2xl font-bold text-[#0477BF]">
                        {selectedQuote.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Servicios</p>
                    <p className="text-sm font-semibold">{selectedQuote.services.length} incluidos</p>
                  </div>
                </div>
              </Card>

              {/* Formulario */}
              <div className="space-y-4">
                <div>
                  <Label>Método de Pago *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Comprobante de Pago * (Imagen o PDF)</Label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  {paymentProofFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Archivo seleccionado: {paymentProofFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Notas adicionales (opcional)</Label>
                  <Textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Referencia, número de transacción, etc."
                    rows={3}
                  />
                </div>
              </div>

              {/* Advertencia */}
              <Card className="p-3 bg-amber-50 border-amber-300">
                <p className="text-xs text-amber-800">
                  <strong>⚠️ Importante:</strong> Verifica que el comprobante sea válido antes de
                  registrar el pago. Este paso es irreversible y permitirá la generación de la
                  factura electrónica FEL.
                </p>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={registerPayment}
              className="bg-green-600 hover:bg-green-700"
              disabled={!paymentMethod || !paymentProofFile}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Registrar Pago de Membresía */}
      <Dialog open={showMembershipPaymentDialog} onOpenChange={setShowMembershipPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">Registrar Pago de Membresía</DialogTitle>
            <DialogDescription>
              {selectedMembership?.affiliateName} - {selectedMembership?.period}
            </DialogDescription>
          </DialogHeader>

          {selectedMembership && (
            <div className="space-y-4">
              {/* Resumen */}
              <Card className="p-4 bg-purple-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Cuota Mensual</p>
                    <div className="flex items-center gap-1">
                      <QuetzalIcon className="w-5 h-5 text-purple-700" />
                      <p className="text-2xl font-bold text-purple-700">
                        {selectedMembership.monthlyFee.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tipo de Plan</p>
                    <p className="text-sm font-semibold">{selectedMembership.membershipType}</p>
                  </div>
                </div>
              </Card>

              {/* Formulario */}
              <div className="space-y-4">
                <div>
                  <Label>Método de Pago *</Label>
                  <Select
                    value={membershipPaymentMethod}
                    onValueChange={setMembershipPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Comprobante de Pago * (Imagen o PDF)</Label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setMembershipPaymentProofFile(e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  {membershipPaymentProofFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Archivo seleccionado: {membershipPaymentProofFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Notas adicionales (opcional)</Label>
                  <Textarea
                    value={membershipPaymentNotes}
                    onChange={(e) => setMembershipPaymentNotes(e.target.value)}
                    placeholder="Referencia, número de transacción, etc."
                    rows={3}
                  />
                </div>
              </div>

              {/* Advertencia */}
              <Card className="p-3 bg-amber-50 border-amber-300">
                <p className="text-xs text-amber-800">
                  <strong>⚠️ Importante:</strong> Verifica que el comprobante sea válido antes de
                  registrar el pago. Este paso es irreversible y permitirá la generación de la
                  factura electrónica FEL.
                </p>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMembershipPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={registerMembershipPayment}
              className="bg-green-600 hover:bg-green-700"
              disabled={!membershipPaymentMethod || !membershipPaymentProofFile}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}