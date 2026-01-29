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
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Wallet,
  Plus,
  Upload,
  Calendar as CalendarIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Search,
  Filter,
  TrendingUp,
  Building,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  History,
  ImageIcon,
  X,
  ShieldCheck,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";

interface PaymentRecord {
  id: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  amount: number;
  notes?: string;
  voucherFile?: string;
  approvedBy?: string;
}

interface ApprovalRecord {
  approvedBy: string;
  approvedDate: string;
  approvalNotes?: string;
  action: "approved" | "rejected";
}

interface Payable {
  id: number;
  invoiceNumber: string;
  provider: string;
  category: string;
  description: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  approvalStatus: "pending_approval" | "approved" | "rejected";
  paymentStatus: "pending" | "overdue" | "paid" | "partial";
  branch: string;
  payments?: PaymentRecord[];
  paidAmount?: number;
  approvalRecord?: ApprovalRecord;
  createdBy?: string;
  createdDate?: string;
}

// Mock data for payables with approval workflow
const mockPayables: Payable[] = [
  {
    id: 1,
    invoiceNumber: "FACT-2025-001",
    provider: "Farmacia San Pablo",
    category: "Suministros Médicos",
    description: "Medicamentos y material quirúrgico",
    amount: 12500,
    issueDate: "2025-10-15",
    dueDate: "2025-11-15",
    approvalStatus: "pending_approval",
    paymentStatus: "pending",
    branch: "Hospital Miraflores Zona 10",
    payments: [],
    paidAmount: 0,
    createdBy: "María González (Recepción)",
    createdDate: "2025-10-25",
  },
  {
    id: 2,
    invoiceNumber: "FACT-2025-002",
    provider: "Laboratorio Clínico Central",
    category: "Servicios de Laboratorio",
    description: "Reactivos y análisis clínicos",
    amount: 8400,
    issueDate: "2025-10-18",
    dueDate: "2025-11-18",
    approvalStatus: "approved",
    paymentStatus: "pending",
    branch: "Hospital Miraflores Zona 10",
    payments: [],
    paidAmount: 0,
    approvalRecord: {
      approvedBy: "Carlos Méndez (Finanzas)",
      approvedDate: "2025-10-26",
      approvalNotes: "Factura correcta, proveedor verificado",
      action: "approved",
    },
    createdBy: "María González (Recepción)",
    createdDate: "2025-10-24",
  },
  {
    id: 3,
    invoiceNumber: "FACT-2025-003",
    provider: "Equipos Médicos Guatemala",
    category: "Mantenimiento",
    description: "Mantenimiento preventivo equipos",
    amount: 15200,
    issueDate: "2025-10-10",
    dueDate: "2025-11-10",
    approvalStatus: "approved",
    paymentStatus: "overdue",
    branch: "Hospital Miraflores Roosevelt",
    payments: [],
    paidAmount: 0,
    approvalRecord: {
      approvedBy: "Junta Directiva",
      approvedDate: "2025-10-12",
      approvalNotes: "Mantenimiento autorizado",
      action: "approved",
    },
    createdBy: "Pedro Ramírez (Recepción)",
    createdDate: "2025-10-11",
  },
  {
    id: 4,
    invoiceNumber: "FACT-2025-004",
    provider: "Servicios Públicos Municipales",
    category: "Servicios",
    description: "Agua, luz y teléfono - Octubre",
    amount: 6800,
    issueDate: "2025-10-05",
    dueDate: "2025-10-28",
    approvalStatus: "approved",
    paymentStatus: "overdue",
    branch: "Hospital Miraflores Zona 10",
    payments: [],
    paidAmount: 0,
    approvalRecord: {
      approvedBy: "Carlos Méndez (Finanzas)",
      approvedDate: "2025-10-07",
      approvalNotes: "Servicios básicos - Autorizado",
      action: "approved",
    },
    createdBy: "María González (Recepción)",
    createdDate: "2025-10-06",
  },
  {
    id: 5,
    invoiceNumber: "FACT-2025-005",
    provider: "Limpieza Profesional S.A.",
    category: "Servicios",
    description: "Servicio de limpieza mensual",
    amount: 4200,
    issueDate: "2025-10-01",
    dueDate: "2025-10-20",
    approvalStatus: "approved",
    paymentStatus: "paid",
    branch: "Hospital Miraflores Roosevelt",
    payments: [
      {
        id: 1,
        paymentDate: "2025-10-19",
        paymentMethod: "Transferencia Bancaria",
        referenceNumber: "TRF-2025-00145",
        amount: 4200,
        notes: "Pago completo del servicio de octubre",
        voucherFile: "comprobante_limpieza_oct.pdf",
        approvedBy: "Ana Martínez",
      },
    ],
    paidAmount: 4200,
    approvalRecord: {
      approvedBy: "Carlos Méndez (Finanzas)",
      approvedDate: "2025-10-05",
      approvalNotes: "Servicio recurrente aprobado",
      action: "approved",
    },
    createdBy: "Pedro Ramírez (Recepción)",
    createdDate: "2025-10-02",
  },
  {
    id: 6,
    invoiceNumber: "FACT-2025-006",
    provider: "Distribuidora Médica Nacional",
    category: "Suministros Médicos",
    description: "Material desechable y EPP",
    amount: 9600,
    issueDate: "2025-10-20",
    dueDate: "2025-11-20",
    approvalStatus: "approved",
    paymentStatus: "partial",
    branch: "Hospital Miraflores Roosevelt",
    payments: [
      {
        id: 1,
        paymentDate: "2025-10-22",
        paymentMethod: "Cheque",
        referenceNumber: "CHQ-001234",
        amount: 5000,
        notes: "Primer abono del 50%",
        voucherFile: "cheque_001234.jpg",
        approvedBy: "Roberto Morales",
      },
    ],
    paidAmount: 5000,
    approvalRecord: {
      approvedBy: "Junta Directiva",
      approvedDate: "2025-10-21",
      approvalNotes: "Suministros necesarios para operación",
      action: "approved",
    },
    createdBy: "María González (Recepción)",
    createdDate: "2025-10-20",
  },
  {
    id: 7,
    invoiceNumber: "FACT-2025-007",
    provider: "Proveedor Falso S.A.",
    category: "Otros",
    description: "Servicios no solicitados",
    amount: 25000,
    issueDate: "2025-10-22",
    dueDate: "2025-11-22",
    approvalStatus: "rejected",
    paymentStatus: "pending",
    branch: "Hospital Miraflores Zona 10",
    payments: [],
    paidAmount: 0,
    approvalRecord: {
      approvedBy: "Carlos Méndez (Finanzas)",
      approvedDate: "2025-10-23",
      approvalNotes: "Factura no corresponde a servicios solicitados. Proveedor no está en el registro autorizado.",
      action: "rejected",
    },
    createdBy: "Juan Pérez (Recepción)",
    createdDate: "2025-10-22",
  },
];

const categories = [
  "Suministros Médicos",
  "Servicios de Laboratorio",
  "Mantenimiento",
  "Servicios",
  "Nómina",
  "Marketing",
  "Tecnología",
  "Otros",
];

const paymentMethods = [
  "Transferencia Bancaria",
  "Cheque",
  "Efectivo",
  "Tarjeta de Crédito",
  "Depósito Bancario",
];

const branches = ["Hospital Miraflores Zona 10", "Hospital Miraflores Roosevelt"];

// Props to receive current user role
interface AccountsPayablePageProps {
  userRole?: "Recepción" | "Finanzas" | "Junta Directiva" | "Super Admin";
}

export function AccountsPayablePage({ userRole = "Recepción" }: AccountsPayablePageProps) {
  const [activeTab, setActiveTab] = useState("list");
  const [payables, setPayables] = useState<Payable[]>(mockPayables);
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<Payable | null>(null);
  
  // Check if user can approve (Finanzas or Junta Directiva)
  const canApprove = userRole === "Finanzas" || userRole === "Junta Directiva";
  const canCreateInvoice = userRole === "Recepción" || userRole === "Super Admin" || userRole === "Finanzas";
  
  // Form state for adding invoice
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    provider: "",
    category: "",
    description: "",
    amount: "",
    issueDate: "",
    dueDate: "",
    branch: "",
  });

  // Form state for payment
  const [paymentData, setPaymentData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: "",
    referenceNumber: "",
    amount: "",
    notes: "",
    voucherFile: null as File | null,
  });

  // Form state for approval
  const [approvalData, setApprovalData] = useState({
    action: "" as "approved" | "rejected" | "",
    notes: "",
  });

  // Calculate totals
  const totalPendingApproval = payables.filter(
    (p) => p.approvalStatus === "pending_approval"
  ).length;

  const totalApproved = payables.filter((p) => p.approvalStatus === "approved").length;
  const totalRejected = payables.filter((p) => p.approvalStatus === "rejected").length;

  const totalPendingPayment = payables
    .filter((p) => p.approvalStatus === "approved" && (p.paymentStatus === "pending" || p.paymentStatus === "partial"))
    .reduce((sum, p) => sum + (p.amount - (p.paidAmount || 0)), 0);
  
  const totalOverdue = payables
    .filter((p) => p.approvalStatus === "approved" && p.paymentStatus === "overdue")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPaid = payables
    .filter((p) => p.approvalStatus === "approved" && p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate approval metrics
  const approvedPayables = payables.filter((p) => p.approvalStatus === "approved" && p.approvalRecord);
  const rejectedPayables = payables.filter((p) => p.approvalStatus === "rejected" && p.approvalRecord);
  const totalReviewed = approvedPayables.length + rejectedPayables.length;
  const rejectionRate = totalReviewed > 0 ? ((rejectedPayables.length / totalReviewed) * 100).toFixed(1) : "0.0";
  
  // Calculate average approval time (mock - in days)
  const avgApprovalTime = approvedPayables.length > 0 ? 
    (approvedPayables.reduce((sum, p) => {
      if (p.createdDate && p.approvalRecord?.approvedDate) {
        const created = new Date(p.createdDate);
        const approved = new Date(p.approvalRecord.approvedDate);
        const diffDays = Math.floor((approved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }
      return sum;
    }, 0) / approvedPayables.length).toFixed(1) : "0.0";

  // Filter payables
  const filteredPayables = payables.filter((payable) => {
    const matchesApproval = approvalFilter === "all" || payable.approvalStatus === approvalFilter;
    const matchesPaymentStatus = paymentStatusFilter === "all" || payable.paymentStatus === paymentStatusFilter;
    const matchesCategory = categoryFilter === "all" || payable.category === categoryFilter;
    const matchesSearch = 
      searchQuery === "" ||
      payable.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payable.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesApproval && matchesPaymentStatus && matchesCategory && matchesSearch;
  });

  const handleAddPayable = () => {
    if (!formData.invoiceNumber || !formData.provider || !formData.amount || !formData.dueDate) {
      toast.error("Campos requeridos", {
        description: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    const newPayable: Payable = {
      id: payables.length + 1,
      invoiceNumber: formData.invoiceNumber,
      provider: formData.provider,
      category: formData.category || "Otros",
      description: formData.description,
      amount: parseFloat(formData.amount),
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      approvalStatus: "pending_approval",
      paymentStatus: "pending",
      branch: formData.branch || "Hospital Miraflores Zona 10",
      payments: [],
      paidAmount: 0,
      createdBy: `Usuario Actual (${userRole})`,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setPayables([newPayable, ...payables]);
    
    toast.success("Factura agregada exitosamente", {
      description: `${formData.invoiceNumber} - Q${parseFloat(formData.amount).toLocaleString()} - Pendiente de aprobación`,
      icon: <CheckCircle2 className="w-5 h-5" />,
    });

    setFormData({
      invoiceNumber: "",
      provider: "",
      category: "",
      description: "",
      amount: "",
      issueDate: "",
      dueDate: "",
      branch: "",
    });
    
    setShowAddDialog(false);
  };

  const handleOpenApprovalDialog = (payable: Payable) => {
    setSelectedPayable(payable);
    setApprovalData({
      action: "",
      notes: "",
    });
    setShowApprovalDialog(true);
  };

  const handleApproveReject = () => {
    if (!selectedPayable || !approvalData.action) {
      toast.error("Acción requerida", {
        description: "Debes seleccionar aprobar o rechazar",
      });
      return;
    }

    if (approvalData.action === "rejected" && !approvalData.notes) {
      toast.error("Motivo requerido", {
        description: "Debes proporcionar un motivo para rechazar la factura",
      });
      return;
    }

    const approvalRecord: ApprovalRecord = {
      approvedBy: `Usuario Actual (${userRole})`,
      approvedDate: new Date().toISOString().split('T')[0],
      approvalNotes: approvalData.notes,
      action: approvalData.action,
    };

    setPayables(
      payables.map((p) =>
        p.id === selectedPayable.id
          ? {
              ...p,
              approvalStatus: approvalData.action === "approved" ? "approved" : "rejected",
              approvalRecord,
            }
          : p
      )
    );

    const actionText = approvalData.action === "approved" ? "aprobada" : "rechazada";
    const actionIcon = approvalData.action === "approved" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;

    toast.success(`Factura ${actionText}`, {
      description: `${selectedPayable.invoiceNumber} ha sido ${actionText} exitosamente`,
      icon: actionIcon,
    });

    setShowApprovalDialog(false);
    setSelectedPayable(null);
    setApprovalData({ action: "", notes: "" });
  };

  const handleOpenPaymentDialog = (payable: Payable) => {
    if (payable.approvalStatus !== "approved") {
      toast.error("Factura no aprobada", {
        description: "Solo puedes registrar pagos para facturas aprobadas",
        icon: <AlertTriangle className="w-5 h-5" />,
      });
      return;
    }

    setSelectedPayable(payable);
    const remainingAmount = payable.amount - (payable.paidAmount || 0);
    setPaymentData({
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "",
      referenceNumber: "",
      amount: remainingAmount.toString(),
      notes: "",
      voucherFile: null,
    });
    setShowPaymentDialog(true);
  };

  const handleRegisterPayment = () => {
    if (!selectedPayable || !paymentData.paymentMethod || !paymentData.referenceNumber || !paymentData.amount) {
      toast.error("Campos requeridos", {
        description: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    if (!paymentData.voucherFile) {
      toast.error("Comprobante requerido", {
        description: "Debes subir un comprobante de pago (imagen o PDF)",
      });
      return;
    }

    const paymentAmount = parseFloat(paymentData.amount);
    const remainingAmount = selectedPayable.amount - (selectedPayable.paidAmount || 0);

    if (paymentAmount > remainingAmount) {
      toast.error("Monto inválido", {
        description: `El monto no puede ser mayor al saldo pendiente (Q${remainingAmount.toLocaleString()})`,
      });
      return;
    }

    const newPayment: PaymentRecord = {
      id: (selectedPayable.payments?.length || 0) + 1,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      referenceNumber: paymentData.referenceNumber,
      amount: paymentAmount,
      notes: paymentData.notes,
      voucherFile: paymentData.voucherFile.name,
      approvedBy: `Usuario Actual (${userRole})`,
    };

    const updatedPaidAmount = (selectedPayable.paidAmount || 0) + paymentAmount;
    const newStatus: Payable["paymentStatus"] = 
      updatedPaidAmount >= selectedPayable.amount 
        ? "paid" 
        : "partial";

    setPayables(
      payables.map((p) =>
        p.id === selectedPayable.id
          ? {
              ...p,
              payments: [...(p.payments || []), newPayment],
              paidAmount: updatedPaidAmount,
              paymentStatus: newStatus,
            }
          : p
      )
    );

    toast.success("¡Pago registrado exitosamente!", {
      description: `Se registró el pago de Q${paymentAmount.toLocaleString()} para ${selectedPayable.invoiceNumber}`,
      icon: <CheckCircle2 className="w-5 h-5" />,
    });

    setShowPaymentDialog(false);
    setSelectedPayable(null);
    setPaymentData({
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: "",
      referenceNumber: "",
      amount: "",
      notes: "",
      voucherFile: null,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Tipo de archivo no válido", {
          description: "Solo se permiten imágenes (JPG, PNG) o PDF",
        });
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Archivo muy grande", {
          description: "El archivo no debe superar 5MB",
        });
        return;
      }

      setPaymentData({ ...paymentData, voucherFile: file });
      toast.success("Archivo cargado", {
        description: file.name,
      });
    }
  };

  const handleViewHistory = (payable: Payable) => {
    setSelectedPayable(payable);
    setShowHistoryDialog(true);
  };

  const handleDelete = (id: number) => {
    const payable = payables.find(p => p.id === id);
    if (payable && payable.paymentStatus === "paid") {
      toast.error("No se puede eliminar", {
        description: "No puedes eliminar una factura que ya fue pagada",
      });
      return;
    }
    if (payable && payable.approvalStatus === "approved") {
      toast.error("No se puede eliminar", {
        description: "No puedes eliminar una factura aprobada. Contacta a Finanzas.",
      });
      return;
    }
    setPayables(payables.filter((p) => p.id !== id));
    toast.success("Factura eliminada");
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#62BF04]/10 text-[#62BF04]">✓ Aprobada</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">✗ Rechazada</Badge>;
      case "pending_approval":
        return <Badge className="bg-orange-100 text-orange-700">⏳ Pendiente Aprobación</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string, payable?: Payable) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-blue-100 text-blue-700">Pagada</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-700">Vencida</Badge>;
      case "partial":
        const paidPercent = payable ? ((payable.paidAmount || 0) / payable.amount * 100).toFixed(0) : 0;
        return <Badge className="bg-purple-100 text-purple-700">Parcial ({paidPercent}%)</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-700">Pendiente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Transferencia Bancaria":
      case "Depósito Bancario":
        return <Banknote className="w-4 h-4" />;
      case "Cheque":
        return <Receipt className="w-4 h-4" />;
      case "Efectivo":
        return <QuetzalIcon className="w-4 h-4" />;
      case "Tarjeta de Crédito":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const handleExportReport = () => {
    toast.success("Generando reporte...", {
      description: "El reporte de cuentas por pagar se descargará en formato Excel",
      icon: <Download className="w-5 h-5" />,
    });
    
    setTimeout(() => {
      toast.success("¡Reporte descargado!", {
        description: `Cuentas_Por_Pagar_${new Date().toISOString().split('T')[0]}.xlsx`,
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
    }, 1500);
  };

  const handleExportRejectedInvoices = () => {
    const rejected = payables.filter(p => p.approvalStatus === "rejected");
    
    if (rejected.length === 0) {
      toast.error("No hay facturas rechazadas", {
        description: "No existen facturas rechazadas para exportar",
      });
      return;
    }

    toast.success("Generando reporte de facturas rechazadas...", {
      description: `${rejected.length} factura(s) rechazada(s) - Exportando a Excel`,
      icon: <Download className="w-5 h-5" />,
    });
    
    setTimeout(() => {
      toast.success("¡Reporte de rechazos descargado!", {
        description: `Facturas_Rechazadas_${new Date().toISOString().split('T')[0]}.xlsx`,
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#0477BF]">Gestión de Cuentas por Pagar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra y da seguimiento a las facturas de proveedores
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Rol actual: {userRole}
            </Badge>
            {canApprove && (
              <Badge className="bg-[#62BF04]/10 text-[#62BF04] text-xs">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Puede aprobar facturas
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {canApprove && totalRejected > 0 && (
            <Button
              onClick={handleExportRejectedInvoices}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Rechazadas
            </Button>
          )}
          <Button
            onClick={handleExportReport}
            variant="outline"
            className="text-[#0477BF] border-[#0477BF]"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
          {canCreateInvoice && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button
                  className="text-white"
                  style={{ backgroundColor: "#0477BF" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Factura
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#0477BF]">
                    Agregar Nueva Factura por Pagar
                  </DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles de la factura del proveedor. La factura será enviada a Finanzas/Junta Directiva para aprobación.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">
                      Número de Factura <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="FACT-2025-XXX"
                      value={formData.invoiceNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, invoiceNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider">
                      Proveedor <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="provider"
                      placeholder="Nombre del proveedor"
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({ ...formData, provider: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Sucursal</Label>
                    <Select
                      value={formData.branch}
                      onValueChange={(value) =>
                        setFormData({ ...formData, branch: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">
                      Monto (Q) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Fecha de Emisi��n</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, issueDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="dueDate">
                      Fecha de Vencimiento <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      placeholder="Descripción de la factura"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddPayable}
                    className="text-white"
                    style={{ backgroundColor: "#0477BF" }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enviar para Aprobación
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Pendientes de Aprobación</p>
          <p className="text-orange-600 mb-1">{totalPendingApproval}</p>
          <p className="text-xs text-gray-500">facturas</p>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-[#62BF04]/10 to-white">
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#62BF04" }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Facturas Aprobadas</p>
          <p className="text-[#62BF04] mb-1">{totalApproved}</p>
          <p className="text-xs text-gray-500">listas para pagar</p>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500">
              <QuetzalIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Por Pagar (Aprobadas)</p>
          <p className="text-yellow-600 mb-1">Q{totalPendingPayment.toLocaleString()}</p>
          <p className="text-xs text-gray-500">pendiente</p>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Vencidas</p>
          <p className="text-red-600 mb-1">Q{totalOverdue.toLocaleString()}</p>
          <p className="text-xs text-red-600">urgente</p>
        </Card>

        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Pagadas Este Mes</p>
          <p className="text-blue-600 mb-1">Q{totalPaid.toLocaleString()}</p>
          <p className="text-xs text-gray-500">completadas</p>
        </Card>
      </div>

      {/* Approval Metrics Cards - Only for approvers */}
      {canApprove && (
        <Card className="p-6 border border-gray-200 bg-gradient-to-br from-[#0477BF]/5 to-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#0477BF]">Métricas de Aprobación</h3>
              <p className="text-sm text-gray-600 mt-1">Rendimiento del proceso de aprobación</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#0477BF]/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#2BB9D9]/10">
                  <Clock className="w-5 h-5 text-[#2BB9D9]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tiempo Promedio de Aprobación</p>
                  <p className="text-[#2BB9D9]">{avgApprovalTime} días</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Desde creación hasta aprobación
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tasa de Rechazo</p>
                  <p className="text-red-600">{rejectionRate}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {totalRejected} de {totalReviewed} facturas revisadas
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#62BF04]/10">
                  <ShieldCheck className="w-5 h-5 text-[#62BF04]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Revisadas</p>
                  <p className="text-[#62BF04]">{totalReviewed}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {totalApproved} aprobadas, {totalRejected} rechazadas
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Approval Alert for Finanzas/Junta */}
      {canApprove && totalPendingApproval > 0 && (
        <Card className="p-4 border-l-4 border-orange-500 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-orange-900">
                Tienes {totalPendingApproval} factura(s) pendiente(s) de aprobación
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Revisa y aprueba las facturas para que puedan ser procesadas para pago.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Número, proveedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado de Aprobación</Label>
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending_approval">Pendiente Aprobación</SelectItem>
                <SelectItem value="approved">Aprobadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado de Pago</Label>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="partial">Pago Parcial</SelectItem>
                <SelectItem value="overdue">Vencida</SelectItem>
                <SelectItem value="paid">Pagada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setApprovalFilter("all");
                setPaymentStatusFilter("all");
                setCategoryFilter("all");
                setSearchQuery("");
              }}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>
      </Card>

      {/* Payables Table */}
      <Card className="border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-[#0477BF]">Listado de Facturas por Pagar</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredPayables.length} facturas encontradas
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">No. Factura</TableHead>
                <TableHead className="text-[#0477BF]">Proveedor</TableHead>
                <TableHead className="text-[#0477BF]">Categoría</TableHead>
                <TableHead className="text-[#0477BF]">Descripción</TableHead>
                <TableHead className="text-[#0477BF]">Sucursal</TableHead>
                <TableHead className="text-[#0477BF] text-right">Monto</TableHead>
                <TableHead className="text-[#0477BF]">Vencimiento</TableHead>
                <TableHead className="text-[#0477BF]">Aprobación</TableHead>
                <TableHead className="text-[#0477BF]">Estado Pago</TableHead>
                <TableHead className="text-[#0477BF]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No se encontraron facturas con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayables.map((payable) => (
                  <TableRow key={payable.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-900">
                      {payable.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-gray-900">{payable.provider}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {payable.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm max-w-xs truncate">
                      {payable.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Building className="w-3 h-3" />
                        {payable.branch}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[#0477BF]">
                      Q{payable.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {new Date(payable.dueDate).toLocaleDateString("es-GT")}
                    </TableCell>
                    <TableCell>{getApprovalStatusBadge(payable.approvalStatus)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(payable.paymentStatus, payable)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payable.approvalStatus === "pending_approval" && canApprove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#62BF04] hover:text-[#62BF04] hover:bg-[#62BF04]/10"
                            onClick={() => handleOpenApprovalDialog(payable)}
                            title="Aprobar/Rechazar"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        )}
                        {payable.approvalStatus === "approved" && 
                         (payable.paymentStatus === "pending" || payable.paymentStatus === "overdue" || payable.paymentStatus === "partial") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpenPaymentDialog(payable)}
                            title="Registrar pago"
                          >
                            <QuetzalIcon className="w-4 h-4" />
                          </Button>
                        )}
                        {(payable.payments && payable.payments.length > 0) || payable.approvalRecord && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#0477BF] hover:text-[#0477BF] hover:bg-[#0477BF]/10"
                            onClick={() => handleViewHistory(payable)}
                            title="Ver historial"
                          >
                            <History className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(payable.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              Aprobar o Rechazar Factura
            </DialogTitle>
            <DialogDescription>
              Revisa los detalles de la factura {selectedPayable?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedPayable && (
            <div className="space-y-4 mt-4">
              {/* Invoice Details */}
              <Card className="p-4 bg-gray-50 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Proveedor</p>
                    <p className="text-gray-900">{selectedPayable.provider}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Categoría</p>
                    <p className="text-gray-900">{selectedPayable.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monto</p>
                    <p className="text-[#0477BF]">Q{selectedPayable.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vencimiento</p>
                    <p className="text-gray-700">
                      {new Date(selectedPayable.dueDate).toLocaleDateString("es-GT")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sucursal</p>
                    <p className="text-gray-700">{selectedPayable.branch}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Creada por</p>
                    <p className="text-gray-700">{selectedPayable.createdBy}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Descripción</p>
                    <p className="text-gray-900">{selectedPayable.description}</p>
                  </div>
                </div>
              </Card>

              {/* Approval Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Acción <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={approvalData.action === "approved" ? "default" : "outline"}
                      className={
                        approvalData.action === "approved"
                          ? "bg-[#62BF04] text-white hover:bg-[#62BF04]/90"
                          : ""
                      }
                      onClick={() => setApprovalData({ ...approvalData, action: "approved" })}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Aprobar Factura
                    </Button>
                    <Button
                      variant={approvalData.action === "rejected" ? "default" : "outline"}
                      className={
                        approvalData.action === "rejected"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "text-red-600 border-red-300 hover:bg-red-50"
                      }
                      onClick={() => setApprovalData({ ...approvalData, action: "rejected" })}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar Factura
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalNotes">
                    {approvalData.action === "rejected" ? "Motivo de Rechazo" : "Comentarios"} 
                    {approvalData.action === "rejected" && <span className="text-red-500"> *</span>}
                  </Label>
                  <Textarea
                    id="approvalNotes"
                    placeholder={
                      approvalData.action === "rejected"
                        ? "Explica por qué se rechaza esta factura..."
                        : "Agrega comentarios sobre esta aprobación (opcional)..."
                    }
                    value={approvalData.notes}
                    onChange={(e) =>
                      setApprovalData({ ...approvalData, notes: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApprovalDialog(false);
                    setSelectedPayable(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleApproveReject}
                  className="text-white"
                  style={{
                    backgroundColor: approvalData.action === "approved" ? "#62BF04" : "#DC2626"
                  }}
                >
                  {approvalData.action === "approved" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirmar Aprobación
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Confirmar Rechazo
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Registration Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#62BF04]">
              Registrar Pago
            </DialogTitle>
            <DialogDescription>
              Registra el pago de la factura {selectedPayable?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedPayable && (
            <div className="space-y-4 mt-4">
              {/* Invoice Summary */}
              <Card className="p-4 bg-gray-50 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Proveedor</p>
                    <p className="text-gray-900">{selectedPayable.provider}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monto Total</p>
                    <p className="text-[#0477BF]">Q{selectedPayable.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pagado Anteriormente</p>
                    <p className="text-gray-700">Q{(selectedPayable.paidAmount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Saldo Pendiente</p>
                    <p className="text-red-600">
                      Q{(selectedPayable.amount - (selectedPayable.paidAmount || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Payment Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">
                    Fecha de Pago <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, paymentDate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">
                    Método de Pago <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={paymentData.paymentMethod}
                    onValueChange={(value) =>
                      setPaymentData({ ...paymentData, paymentMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(method)}
                            {method}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">
                    Número de Referencia/Cheque <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="referenceNumber"
                    placeholder="TRF-XXXX o CHQ-XXXX"
                    value={paymentData.referenceNumber}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, referenceNumber: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">
                    Monto a Pagar (Q) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    placeholder="0.00"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notas (Opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Agrega notas sobre este pago..."
                    value={paymentData.notes}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="voucherFile">
                    Comprobante de Pago <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="voucherFile"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("voucherFile")?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {paymentData.voucherFile ? "Cambiar archivo" : "Subir comprobante"}
                    </Button>
                  </div>
                  {paymentData.voucherFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <ImageIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 flex-1">
                        {paymentData.voucherFile.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPaymentData({ ...paymentData, voucherFile: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentDialog(false);
                    setSelectedPayable(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRegisterPayment}
                  className="text-white"
                  style={{ backgroundColor: "#62BF04" }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Registrar Pago
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF]">
              Historial Completo de Factura
            </DialogTitle>
            <DialogDescription>
              Factura {selectedPayable?.invoiceNumber} - {selectedPayable?.provider}
            </DialogDescription>
          </DialogHeader>

          {selectedPayable && (
            <div className="space-y-4 mt-4">
              {/* Summary */}
              <Card className="p-4 bg-gradient-to-br from-[#0477BF]/5 to-white border border-[#0477BF]/20">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Monto Total</p>
                    <p className="text-[#0477BF]">Q{selectedPayable.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Pagado</p>
                    <p className="text-[#62BF04]">
                      Q{(selectedPayable.paidAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Saldo Pendiente</p>
                    <p className="text-red-600">
                      Q{(selectedPayable.amount - (selectedPayable.paidAmount || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Approval Record */}
              {selectedPayable.approvalRecord && (
                <div>
                  <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#0477BF]" />
                    Registro de Aprobación
                  </h4>
                  <Card className={`p-4 border ${
                    selectedPayable.approvalRecord.action === "approved"
                      ? "border-[#62BF04]/30 bg-[#62BF04]/5"
                      : "border-red-300 bg-red-50"
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedPayable.approvalRecord.action === "approved"
                              ? "bg-[#62BF04]"
                              : "bg-red-600"
                          }`}
                        >
                          {selectedPayable.approvalRecord.action === "approved" ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <XCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-900">
                            {selectedPayable.approvalRecord.action === "approved" ? "Aprobada" : "Rechazada"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedPayable.approvalRecord.approvedDate).toLocaleDateString("es-GT")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">
                          {selectedPayable.approvalRecord.action === "approved" ? "Aprobado por" : "Rechazado por"}
                        </p>
                        <p className="text-gray-900">{selectedPayable.approvalRecord.approvedBy}</p>
                      </div>
                      {selectedPayable.approvalRecord.approvalNotes && (
                        <div>
                          <p className="text-gray-500 text-xs">Comentarios</p>
                          <p className="text-gray-700">{selectedPayable.approvalRecord.approvalNotes}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Payments List */}
              <div>
                <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#0477BF]" />
                  Historial de Pagos
                </h4>
                <div className="space-y-3">
                  {selectedPayable.payments && selectedPayable.payments.length > 0 ? (
                    selectedPayable.payments.map((payment) => (
                      <Card key={payment.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "#62BF04" }}
                            >
                              {getPaymentMethodIcon(payment.paymentMethod)}
                            </div>
                            <div>
                              <p className="text-gray-900">{payment.paymentMethod}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(payment.paymentDate).toLocaleDateString("es-GT")}
                              </p>
                            </div>
                          </div>
                          <p className="text-[#62BF04]">Q{payment.amount.toLocaleString()}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Referencia</p>
                            <p className="text-gray-900">{payment.referenceNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Procesado por</p>
                            <p className="text-gray-900">{payment.approvedBy}</p>
                          </div>
                          {payment.notes && (
                            <div className="col-span-2">
                              <p className="text-gray-500 text-xs">Notas</p>
                              <p className="text-gray-700">{payment.notes}</p>
                            </div>
                          )}
                          {payment.voucherFile && (
                            <div className="col-span-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-[#0477BF]"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar Comprobante ({payment.voucherFile})
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <QuetzalIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No hay pagos registrados para esta factura</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Creation Info */}
              <Card className="p-3 bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Creada por: {selectedPayable.createdBy}</span>
                  <span>Fecha: {selectedPayable.createdDate && new Date(selectedPayable.createdDate).toLocaleDateString("es-GT")}</span>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
