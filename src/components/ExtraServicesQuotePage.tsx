import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
  SelectValue,
} from "./ui/select";
import {
  Search,
  Plus,
  Send,
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  Activity,
  CreditCard,
  Link as LinkIcon,
  AlertCircle,
  Stethoscope,
  TestTube,
  Heart,
  Pill,
  Camera,
  Zap,
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";
import { copyToClipboard } from "../utils/clipboard";

// Tipos
interface Affiliate {
  id: string;
  name: string;
  affiliateId: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
}

interface ExtraService {
  id: number;
  name: string;
  description: string;
  cost: number;
  category: "Consulta" | "Laboratorio" | "Imagen" | "Terapia" | "Otro";
  icon: any;
}

interface Quote {
  id: string;
  quoteNumber: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  affiliatePhone: string;
  services: { serviceId: number; serviceName: string; cost: number; quantity: number }[];
  subtotal: number;
  total: number;
  status: "Pendiente" | "Link Enviado" | "Pagado" | "Vencido";
  paymentLink?: string;
  createdAt: string;
  validUntil: string;
  notes?: string;
}

// Servicios disponibles
const availableServices: ExtraService[] = [
  {
    id: 1,
    name: "Consulta Médico Especialista - Cardiología",
    description: "Consulta con especialista en cardiología",
    cost: 250,
    category: "Consulta",
    icon: Heart,
  },
  {
    id: 2,
    name: "Consulta Médico Especialista - Dermatología",
    description: "Consulta con especialista en dermatología",
    cost: 220,
    category: "Consulta",
    icon: Stethoscope,
  },
  {
    id: 3,
    name: "Examen de Sangre Completo",
    description: "Hemograma, química sanguínea completa",
    cost: 180,
    category: "Laboratorio",
    icon: TestTube,
  },
  {
    id: 4,
    name: "Perfil Lipídico",
    description: "Análisis de colesterol y triglicéridos",
    cost: 150,
    category: "Laboratorio",
    icon: TestTube,
  },
  {
    id: 5,
    name: "Glucosa en Ayunas",
    description: "Medición de glucosa en sangre",
    cost: 60,
    category: "Laboratorio",
    icon: TestTube,
  },
  {
    id: 6,
    name: "Radiografía de Tórax",
    description: "Imagen radiológica del tórax",
    cost: 180,
    category: "Imagen",
    icon: Camera,
  },
  {
    id: 7,
    name: "Ultrasonido Abdominal",
    description: "Ecografía completa del abdomen",
    cost: 280,
    category: "Imagen",
    icon: Camera,
  },
  {
    id: 8,
    name: "Electrocardiograma (EKG)",
    description: "Estudio del ritmo cardíaco",
    cost: 120,
    category: "Imagen",
    icon: Zap,
  },
  {
    id: 9,
    name: "Terapia Física (Sesión)",
    description: "Sesión individual de terapia física",
    cost: 175,
    category: "Terapia",
    icon: Activity,
  },
  {
    id: 10,
    name: "Consulta Nutricional",
    description: "Asesoría con nutricionista certificado",
    cost: 150,
    category: "Terapia",
    icon: Pill,
  },
];

// Afiliados de ejemplo
const mockAffiliates: Affiliate[] = [
  {
    id: "1",
    name: "María Elena González Pérez",
    affiliateId: "MFP-2024-001",
    email: "maria.gonzalez@example.com",
    phone: "+502 5555-1234",
    plan: "Premium",
    status: "Activo",
  },
  {
    id: "2",
    name: "Carlos Roberto Ramírez López",
    affiliateId: "MFP-2024-002",
    email: "carlos.ramirez@example.com",
    phone: "+502 5555-5678",
    plan: "Básico",
    status: "Activo",
  },
  {
    id: "3",
    name: "Ana Lucía Martínez Hernández",
    affiliateId: "MFP-2024-003",
    email: "ana.martinez@example.com",
    phone: "+502 5555-9012",
    plan: "Familiar",
    status: "Activo",
  },
];

export function ExtraServicesQuotePage() {
  const [activeTab, setActiveTab] = useState<"new" | "quotes">("new");
  const [searchAffiliate, setSearchAffiliate] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [selectedServices, setSelectedServices] = useState<Map<number, number>>(new Map());
  const [notes, setNotes] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [searchQuote, setSearchQuote] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filtrar afiliados
  const filteredAffiliates = mockAffiliates.filter((aff) =>
    aff.name.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
    aff.affiliateId.toLowerCase().includes(searchAffiliate.toLowerCase())
  );

  // Calcular total
  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach((quantity, serviceId) => {
      const service = availableServices.find((s) => s.id === serviceId);
      if (service) {
        total += service.cost * quantity;
      }
    });
    return total;
  };

  // Toggle servicio
  const toggleService = (serviceId: number) => {
    const newSelected = new Map(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.set(serviceId, 1);
    }
    setSelectedServices(newSelected);
  };

  // Actualizar cantidad
  const updateQuantity = (serviceId: number, quantity: number) => {
    if (quantity < 1) {
      const newSelected = new Map(selectedServices);
      newSelected.delete(serviceId);
      setSelectedServices(newSelected);
    } else {
      const newSelected = new Map(selectedServices);
      newSelected.set(serviceId, quantity);
      setSelectedServices(newSelected);
    }
  };

  // Generar cotización
  const generateQuote = () => {
    if (!selectedAffiliate) {
      toast.error("Selecciona un afiliado");
      return;
    }
    if (selectedServices.size === 0) {
      toast.error("Selecciona al menos un servicio");
      return;
    }

    const quoteNumber = `COT-${Date.now()}`;
    const services = Array.from(selectedServices.entries()).map(([serviceId, quantity]) => {
      const service = availableServices.find((s) => s.id === serviceId)!;
      return {
        serviceId,
        serviceName: service.name,
        cost: service.cost,
        quantity,
      };
    });

    const newQuote: Quote = {
      id: Date.now().toString(),
      quoteNumber,
      affiliateId: selectedAffiliate.affiliateId,
      affiliateName: selectedAffiliate.name,
      affiliateEmail: selectedAffiliate.email,
      affiliatePhone: selectedAffiliate.phone,
      services,
      subtotal: calculateTotal(),
      total: calculateTotal(),
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes,
    };

    setQuotes([newQuote, ...quotes]);
    setCurrentQuote(newQuote);
    setShowQuotePreview(true);

    toast.success("¡Cotización generada!", {
      description: `Cotización ${quoteNumber} creada exitosamente`,
    });
  };

  // Generar link de pago
  const generatePaymentLink = (quote: Quote) => {
    const paymentLink = `https://pagos.mirafloresplus.com.gt/pagar/${quote.quoteNumber}`;
    const updatedQuote = { ...quote, paymentLink, status: "Link Enviado" as const };
    setQuotes(quotes.map((q) => (q.id === quote.id ? updatedQuote : q)));
    setCurrentQuote(updatedQuote);

    // Copiar al portapapeles
    copyToClipboard(paymentLink);

    toast.success("¡Link de pago generado!", {
      description: "El link ha sido copiado al portapapeles",
      icon: <LinkIcon className="w-5 h-5" />,
    });
  };

  // Enviar por correo
  const sendByEmail = (quote: Quote) => {
    toast.success("Correo enviado", {
      description: `Link de pago enviado a ${quote.affiliateEmail}`,
      icon: <Mail className="w-5 h-5" />,
    });
  };

  // Enviar por WhatsApp
  const sendByWhatsApp = (quote: Quote) => {
    const message = `Hola ${quote.affiliateName}, tu cotización ${quote.quoteNumber} por Q${quote.total.toFixed(2)} está lista. Paga aquí: ${quote.paymentLink}`;
    const whatsappUrl = `https://wa.me/${quote.affiliatePhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast.success("WhatsApp abierto", {
      description: "Mensaje preparado para enviar",
      icon: <MessageSquare className="w-5 h-5" />,
    });
  };

  // Filtrar cotizaciones
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchQuote.toLowerCase()) ||
      quote.affiliateName.toLowerCase().includes(searchQuote.toLowerCase()) ||
      quote.affiliateId.toLowerCase().includes(searchQuote.toLowerCase());

    const matchesStatus = filterStatus === "all" || quote.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Obtener color de estado
  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "Pagado":
        return "bg-green-500";
      case "Link Enviado":
        return "bg-blue-500";
      case "Pendiente":
        return "bg-yellow-500";
      case "Vencido":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Obtener icono de estado
  const getStatusIcon = (status: Quote["status"]) => {
    switch (status) {
      case "Pagado":
        return <CheckCircle className="w-4 h-4" />;
      case "Link Enviado":
        return <LinkIcon className="w-4 h-4" />;
      case "Pendiente":
        return <Clock className="w-4 h-4" />;
      case "Vencido":
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0477BF]">Cotizador de Servicios Extras</h1>
        <p className="text-gray-600 mt-1">
          Genera cotizaciones y links de pago para servicios médicos adicionales
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#0477BF]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Cotizaciones Hoy</p>
              <p className="text-2xl font-bold text-[#0477BF]">{quotes.length}</p>
            </div>
            <FileText className="w-8 h-8 text-[#0477BF] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-l-4 border-[#62BF04]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pagadas</p>
              <p className="text-2xl font-bold text-[#62BF04]">
                {quotes.filter((q) => q.status === "Pagado").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#62BF04] opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {quotes.filter((q) => q.status === "Pendiente" || q.status === "Link Enviado").length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total del Día</p>
              <div className="flex items-center gap-1">
                <QuetzalIcon className="w-4 h-4 text-purple-600" />
                <p className="text-xl font-bold text-purple-600">
                  {quotes.reduce((sum, q) => sum + q.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
            <QuetzalIcon className="w-8 h-8 text-purple-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "new"
              ? "text-[#0477BF] border-b-2 border-[#0477BF]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Plus className="w-4 h-4 inline-block mr-2" />
          Nueva Cotización
        </button>
        <button
          onClick={() => setActiveTab("quotes")}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === "quotes"
              ? "text-[#0477BF] border-b-2 border-[#0477BF]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FileText className="w-4 h-4 inline-block mr-2" />
          Historial de Cotizaciones ({quotes.length})
        </button>
      </div>

      {/* Nueva Cotización */}
      {activeTab === "new" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Selección de Afiliado y Servicios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seleccionar Afiliado */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#0477BF] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                1. Seleccionar Afiliado
              </h3>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o ID de afiliado..."
                  value={searchAffiliate}
                  onChange={(e) => setSearchAffiliate(e.target.value)}
                  className="pl-10"
                />
              </div>

              {selectedAffiliate ? (
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border-2 border-[#0477BF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#0477BF]">{selectedAffiliate.name}</p>
                      <p className="text-sm text-gray-600">ID: {selectedAffiliate.affiliateId}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        📧 {selectedAffiliate.email}
                      </p>
                      <p className="text-xs text-gray-500">📱 {selectedAffiliate.phone}</p>
                      <Badge className="mt-2 bg-[#62BF04]">{selectedAffiliate.plan}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAffiliate(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredAffiliates.length > 0 ? (
                    filteredAffiliates.map((affiliate) => (
                      <div
                        key={affiliate.id}
                        onClick={() => setSelectedAffiliate(affiliate)}
                        className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-200 hover:border-[#0477BF]"
                      >
                        <p className="font-semibold text-gray-900">{affiliate.name}</p>
                        <p className="text-xs text-gray-500">ID: {affiliate.affiliateId}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No se encontraron afiliados</p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Seleccionar Servicios */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-[#0477BF] mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                2. Seleccionar Servicios
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {availableServices.map((service) => {
                  const Icon = service.icon;
                  const isSelected = selectedServices.has(service.id);
                  const quantity = selectedServices.get(service.id) || 1;

                  return (
                    <div
                      key={service.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "bg-blue-50 border-[#0477BF]"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleService(service.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-5 h-5 ${isSelected ? "text-[#0477BF]" : "text-gray-400"}`} />
                              <div>
                                <p className="font-semibold text-gray-900">{service.name}</p>
                                <p className="text-xs text-gray-500">{service.description}</p>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs"
                                >
                                  {service.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                                <p className="font-bold text-lg text-[#62BF04]">
                                  {service.cost.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-2 mt-3">
                              <Label className="text-xs">Cantidad:</Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(service.id, quantity - 1)}
                                  className="h-7 w-7 p-0"
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) =>
                                    updateQuantity(service.id, parseInt(e.target.value) || 0)
                                  }
                                  className="h-7 w-16 text-center"
                                  min={1}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(service.id, quantity + 1)}
                                  className="h-7 w-7 p-0"
                                >
                                  +
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 ml-2">
                                Subtotal: Q{(service.cost * quantity).toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold text-[#0477BF] mb-4">Resumen</h3>

              {selectedAffiliate && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Afiliado</p>
                  <p className="font-semibold text-sm">{selectedAffiliate.name}</p>
                  <p className="text-xs text-gray-500">{selectedAffiliate.affiliateId}</p>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <p className="text-xs font-semibold text-gray-700">
                  Servicios Seleccionados ({selectedServices.size})
                </p>
                {selectedServices.size > 0 ? (
                  Array.from(selectedServices.entries()).map(([serviceId, quantity]) => {
                    const service = availableServices.find((s) => s.id === serviceId)!;
                    return (
                      <div key={serviceId} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {service.name} <span className="text-xs">(x{quantity})</span>
                        </span>
                        <span className="font-semibold">
                          Q{(service.cost * quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 italic">No hay servicios seleccionados</p>
                )}
              </div>

              <div className="pt-4 border-t-2 border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900">TOTAL</span>
                  <div className="flex items-center gap-2">
                    <QuetzalIcon className="w-6 h-6 text-[#62BF04]" />
                    <span className="text-2xl font-bold text-[#62BF04]">
                      {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-xs">Notas adicionales (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agrega información adicional sobre la cotización..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={generateQuote}
                disabled={!selectedAffiliate || selectedServices.size === 0}
                className="w-full mt-4 bg-[#0477BF] hover:bg-[#0369a1]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generar Cotización
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Historial de Cotizaciones */}
      {activeTab === "quotes" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#0477BF]">Historial de Cotizaciones</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuote}
                  onChange={(e) => setSearchQuote(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Link Enviado">Link Enviado</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredQuotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cotización</TableHead>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Servicios</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-mono text-sm">{quote.quoteNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">{quote.affiliateName}</p>
                        <p className="text-xs text-gray-500">{quote.affiliateId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{quote.services.length} servicio(s)</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                        <span className="font-bold text-[#62BF04]">{quote.total.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusIcon(quote.status)}
                        <span className="ml-1">{quote.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(quote.createdAt).toLocaleDateString("es-GT")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCurrentQuote(quote);
                            setShowQuotePreview(true);
                          }}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {quote.status === "Pendiente" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => generatePaymentLink(quote)}
                            className="text-[#0477BF] hover:text-[#0369a1]"
                            title="Generar link de pago"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p>No hay cotizaciones para mostrar</p>
            </div>
          )}
        </Card>
      )}

      {/* Modal de Preview de Cotización */}
      <Dialog open={showQuotePreview} onOpenChange={setShowQuotePreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Cotización {currentQuote?.quoteNumber}
            </DialogTitle>
            <DialogDescription>
              Detalles de la cotización y opciones de pago
            </DialogDescription>
          </DialogHeader>

          {currentQuote && (
            <div className="space-y-6">
              {/* Información del Afiliado */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-white">
                <h4 className="font-bold text-[#0477BF] mb-3">Información del Afiliado</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Nombre</p>
                    <p className="font-semibold">{currentQuote.affiliateName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">ID Afiliado</p>
                    <p className="font-semibold">{currentQuote.affiliateId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Correo</p>
                    <p className="text-sm">{currentQuote.affiliateEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Teléfono</p>
                    <p className="text-sm">{currentQuote.affiliatePhone}</p>
                  </div>
                </div>
              </Card>

              {/* Servicios */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Servicios Cotizados</h4>
                <div className="space-y-2">
                  {currentQuote.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-sm">{service.serviceName}</p>
                        <p className="text-xs text-gray-500">Cantidad: {service.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Q{service.cost.toFixed(2)} c/u
                        </p>
                        <div className="flex items-center gap-1">
                          <QuetzalIcon className="w-4 h-4 text-[#62BF04]" />
                          <p className="font-bold text-[#62BF04]">
                            {(service.cost * service.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">TOTAL</span>
                    <div className="flex items-center gap-2">
                      <QuetzalIcon className="w-6 h-6 text-[#62BF04]" />
                      <span className="text-3xl font-bold text-[#62BF04]">
                        {currentQuote.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {currentQuote.notes && (
                <Card className="p-4 bg-yellow-50">
                  <p className="text-xs text-gray-600 mb-1">Notas</p>
                  <p className="text-sm">{currentQuote.notes}</p>
                </Card>
              )}

              {/* Estado */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Estado</p>
                  <Badge className={`${getStatusColor(currentQuote.status)} mt-1`}>
                    {getStatusIcon(currentQuote.status)}
                    <span className="ml-1">{currentQuote.status}</span>
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Válida hasta</p>
                  <p className="text-sm font-semibold">
                    {new Date(currentQuote.validUntil).toLocaleDateString("es-GT")}
                  </p>
                </div>
              </div>

              {/* Link de Pago */}
              {currentQuote.paymentLink && (
                <Card className="p-4 bg-gradient-to-r from-green-50 to-white border-2 border-[#62BF04]">
                  <h4 className="font-bold text-[#62BF04] mb-2 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Link de Pago Generado
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      value={currentQuote.paymentLink}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        copyToClipboard(currentQuote.paymentLink!);
                        toast.success("Link copiado al portapapeles");
                      }}
                      className="bg-[#0477BF] hover:bg-[#0369a1]"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => sendByEmail(currentQuote)}
                      className="flex-1 bg-[#2BB9D9] hover:bg-[#1a9ab9]"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar por Correo
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => sendByWhatsApp(currentQuote)}
                      className="flex-1 bg-[#62BF04] hover:bg-[#52a003]"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Enviar por WhatsApp
                    </Button>
                  </div>
                </Card>
              )}

              {/* Acciones */}
              <DialogFooter>
                {currentQuote.status === "Pendiente" && !currentQuote.paymentLink && (
                  <Button
                    onClick={() => generatePaymentLink(currentQuote)}
                    className="bg-[#0477BF] hover:bg-[#0369a1]"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Generar Link de Pago
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowQuotePreview(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}