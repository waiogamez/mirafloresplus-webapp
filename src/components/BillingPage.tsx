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
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Send,
  Users,
  Calendar,
  CreditCard,
  Building2,
  MapPin,
  Hash,
  Printer,
  Mail,
  Filter,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";

// Tipos
interface Invoice {
  id: number;
  invoiceNumber: string;
  felNumber: string; // Número FEL SAT
  affiliateId: string;
  affiliateName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Pendiente" | "Pagada" | "Vencida" | "Anulada";
  paymentMethod?: string;
  paymentDate?: string;
  branchId: number;
  notes?: string;
  quoteId: string; // ID de la cotización de origen
  quoteApprovedDate: string; // Fecha de aprobación de cotización
}

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "FAC-2025-0001",
    felNumber: "FEL-1234567890",
    affiliateId: "MFP-2025-001",
    affiliateName: "Juan Carlos Pérez",
    date: "2025-01-15",
    dueDate: "2025-01-30",
    items: [
      {
        id: 1,
        description: "Consulta con Cardiólogo - Dr. Fernando Ruiz",
        quantity: 1,
        unitPrice: 250,
        total: 250,
        taxable: true,
      },
      {
        id: 2,
        description: "Electrocardiograma (EKG)",
        quantity: 1,
        unitPrice: 120,
        total: 120,
        taxable: true,
      },
    ],
    subtotal: 370,
    tax: 44.4, // 12% IVA
    total: 414.4,
    status: "Pagada",
    paymentMethod: "Tarjeta de Crédito",
    paymentDate: "2025-01-16",
    branchId: 1,
    quoteId: "Q-2025-0001",
    quoteApprovedDate: "2025-01-10",
  },
  {
    id: 2,
    invoiceNumber: "FAC-2025-0002",
    felNumber: "FEL-1234567891",
    affiliateId: "MFP-2025-045",
    affiliateName: "María Fernanda López",
    date: "2025-01-20",
    dueDate: "2025-02-04",
    items: [
      {
        id: 1,
        description: "Hemograma Completo",
        quantity: 1,
        unitPrice: 180,
        total: 180,
        taxable: true,
      },
      {
        id: 2,
        description: "Perfil Lipídico",
        quantity: 1,
        unitPrice: 150,
        total: 150,
        taxable: true,
      },
    ],
    subtotal: 330,
    tax: 39.6,
    total: 369.6,
    status: "Pendiente",
    branchId: 2,
    quoteId: "Q-2025-0002",
    quoteApprovedDate: "2025-01-15",
  },
  {
    id: 3,
    invoiceNumber: "FAC-2025-0003",
    felNumber: "FEL-1234567892",
    affiliateId: "MFP-2024-233",
    affiliateName: "Roberto Martínez",
    date: "2025-01-10",
    dueDate: "2025-01-25",
    items: [
      {
        id: 1,
        description: "Consulta Pediátrica - Dra. Patricia Morales",
        quantity: 1,
        unitPrice: 220,
        total: 220,
        taxable: true,
      },
    ],
    subtotal: 220,
    tax: 26.4,
    total: 246.4,
    status: "Vencida",
    branchId: 1,
    quoteId: "Q-2025-0003",
    quoteApprovedDate: "2025-01-05",
  },
];

const branches = [
  { id: 1, name: "Zona 10" },
  { id: 2, name: "Zona 11" },
];

export function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filtrar facturas
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.affiliateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.felNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.affiliateId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const matchesBranch = filterBranch === "all" || invoice.branchId.toString() === filterBranch;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Estadísticas
  const totalPendiente = invoices
    .filter((i) => i.status === "Pendiente")
    .reduce((sum, i) => sum + i.total, 0);

  const totalPagado = invoices
    .filter((i) => i.status === "Pagada")
    .reduce((sum, i) => sum + i.total, 0);

  const totalVencido = invoices
    .filter((i) => i.status === "Vencida")
    .reduce((sum, i) => sum + i.total, 0);

  // Ver detalle de factura
  const viewInvoiceDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDialog(true);
  };

  // Generar FEL (mock)
  const generateFEL = (invoice: Invoice) => {
    toast.success("Factura FEL generada", {
      description: `Se generó la factura electrónica FEL para ${invoice.affiliateName}`,
    });
  };

  // Enviar factura por correo
  const sendInvoiceByEmail = (invoice: Invoice) => {
    toast.success("Factura enviada por correo", {
      description: `Factura ${invoice.invoiceNumber} enviada a ${invoice.affiliateName}`,
    });
  };

  // Imprimir factura
  const printInvoice = (invoice: Invoice) => {
    toast.info("Abriendo vista de impresión...", {
      description: `Factura ${invoice.invoiceNumber}`,
    });
    // Aquí se implementaría la lógica de impresión
  };

  // Anular factura
  const cancelInvoice = (id: number) => {
    if (confirm("¿Estás seguro de anular esta factura?")) {
      setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: "Anulada" } : i)));
      toast.success("Factura anulada exitosamente");
    }
  };

  // Obtener badge de estado
  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "Pagada":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Pagada
          </Badge>
        );
      case "Pendiente":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "Vencida":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Vencida
          </Badge>
        );
      case "Anulada":
        return (
          <Badge className="bg-gray-500">
            <XCircle className="w-3 h-3 mr-1" />
            Anulada
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0477BF]">Facturación</h1>
        <p className="text-gray-600 mt-1">
          Gestión de facturas y cumplimiento tributario (FEL - SAT Guatemala)
        </p>
        
        {/* Workflow Info */}
        <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#0477BF] mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-[#0477BF] mb-1">Workflow de Facturación</p>
              <p className="text-sm text-gray-700">
                Las facturas se generan automáticamente siguiendo este proceso:
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Badge className="bg-blue-500">1. Cotización Creada</Badge>
                <span className="text-gray-400">→</span>
                <Badge className="bg-green-500">2. Cotización Aprobada</Badge>
                <span className="text-gray-400">→</span>
                <Badge className="bg-purple-500">3. Pago Recibido</Badge>
                <span className="text-gray-400">→</span>
                <Badge className="bg-[#0477BF]">4. Factura FEL Generada</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#0477BF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Facturas</p>
              <p className="text-2xl font-bold text-[#0477BF]">{invoices.length}</p>
              <p className="text-xs text-gray-500 mt-1">Este mes</p>
            </div>
            <FileText className="w-8 h-8 text-[#0477BF] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pendiente de Pago</p>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-5 h-5 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">
                  {totalPendiente.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {invoices.filter((i) => i.status === "Pendiente").length} facturas
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
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
              <p className="text-xs text-gray-500 mt-1">
                {invoices.filter((i) => i.status === "Pagada").length} facturas
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Vencido</p>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-5 h-5 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{totalVencido.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {invoices.filter((i) => i.status === "Vencida").length} facturas
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por factura, afiliado, FEL..."
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
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Pagada">Pagada</SelectItem>
              <SelectItem value="Vencida">Vencida</SelectItem>
              <SelectItem value="Anulada">Anulada</SelectItem>
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

      {/* Tabla de facturas */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factura</TableHead>
              <TableHead>FEL</TableHead>
              <TableHead>Afiliado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 font-mono text-xs">
                      {invoice.felNumber}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{invoice.affiliateName}</p>
                      <p className="text-xs text-gray-500">{invoice.affiliateId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <span
                      className={
                        new Date(invoice.dueDate) < new Date() && invoice.status === "Pendiente"
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {invoice.dueDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={invoice.branchId === 1 ? "bg-purple-500" : "bg-orange-500"}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {branches.find((b) => b.id === invoice.branchId)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                      <span className="font-bold text-[#62BF04]">
                        {invoice.total.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewInvoiceDetail(invoice)}
                        className="text-[#0477BF]"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => printInvoice(invoice)}
                        className="text-gray-600"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => sendInvoiceByEmail(invoice)}
                        className="text-green-600"
                        title="Enviar por correo"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      {invoice.status !== "Anulada" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelInvoice(invoice.id)}
                          className="text-red-500"
                          title="Anular factura"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No se encontraron facturas</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog: Ver Detalle de Factura */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              Detalle de Factura - {selectedInvoice?.invoiceNumber}
            </DialogTitle>
            <DialogDescription>
              Factura Electrónica FEL: {selectedInvoice?.felNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="grid grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                {/* Información de Origen */}
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <h3 className="font-semibold mb-3 text-purple-800">Origen de Factura</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Cotización:</span>
                      <Badge variant="outline" className="bg-white font-mono">
                        {selectedInvoice.quoteId}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Aprobada:</span>
                      <span className="text-sm font-semibold">{selectedInvoice.quoteApprovedDate}</span>
                    </div>
                    <p className="text-xs text-purple-700 mt-2">
                      ✓ Esta factura fue generada automáticamente al recibir el pago de la cotización aprobada
                    </p>
                  </div>
                </Card>

                {/* Información del cliente */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3 text-[#0477BF]">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Nombre</p>
                      <p className="font-semibold">{selectedInvoice.affiliateName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">ID Afiliado</p>
                      <p className="font-semibold">{selectedInvoice.affiliateId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Fecha de Emisión</p>
                      <p className="font-semibold">{selectedInvoice.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Fecha de Vencimiento</p>
                      <p className="font-semibold">{selectedInvoice.dueDate}</p>
                    </div>
                  </div>
                </Card>

                {/* Totales */}
                <Card className="p-4 bg-blue-50">
                  <h3 className="font-semibold mb-3 text-[#0477BF]">Resumen de Pago</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <div className="flex items-center gap-1">
                        <QuetzalIcon className="w-4 h-4" />
                        <span className="font-semibold">{selectedInvoice.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IVA (12%):</span>
                      <div className="flex items-center gap-1">
                        <QuetzalIcon className="w-4 h-4" />
                        <span className="font-semibold">{selectedInvoice.tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="font-bold text-[#0477BF]">TOTAL:</span>
                      <div className="flex items-center gap-1">
                        <QuetzalIcon className="w-5 h-5 text-[#62BF04]" />
                        <span className="font-bold text-[#62BF04] text-xl">
                          {selectedInvoice.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Estado de pago */}
                {selectedInvoice.status === "Pagada" && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Factura Pagada</p>
                        <p className="text-sm text-green-700">
                          Método: {selectedInvoice.paymentMethod} • Fecha:{" "}
                          {selectedInvoice.paymentDate}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Columna Derecha - Items de la factura */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 text-[#0477BF]">Detalle de Servicios</h3>
                  <Card className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-center w-20">Cant.</TableHead>
                          <TableHead className="text-right w-28">P. Unit.</TableHead>
                          <TableHead className="text-right w-28">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-sm">{item.description}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <QuetzalIcon className="w-3 h-3" />
                                <span className="text-sm">{item.unitPrice.toFixed(2)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <QuetzalIcon className="w-3 h-3" />
                                <span className="font-semibold">{item.total.toFixed(2)}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
              Cerrar
            </Button>
            <Button
              onClick={() => selectedInvoice && printInvoice(selectedInvoice)}
              className="bg-[#0477BF] hover:bg-[#0369a1]"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}