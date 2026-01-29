import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Search, Send, Calculator, Percent, Plus, Minus, Link2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

// Payment records data
const paymentsData = [
  { 
    id: 1, 
    date: "2025-10-16", 
    patientName: "María González Hernández", 
    serviceType: "Consulta General", 
    amount: 250, 
    status: "Pendiente" 
  },
  { 
    id: 2, 
    date: "2025-10-16", 
    patientName: "Carlos Méndez López", 
    serviceType: "Consulta Especializada", 
    amount: 450, 
    status: "Pagado" 
  },
  { 
    id: 3, 
    date: "2025-10-15", 
    patientName: "Ana Rodríguez Castillo", 
    serviceType: "Exámenes de Laboratorio", 
    amount: 350, 
    status: "Pagado" 
  },
  { 
    id: 4, 
    date: "2025-10-15", 
    patientName: "Juan Pérez Morales", 
    serviceType: "Teleconsulta", 
    amount: 180, 
    status: "Pendiente" 
  },
  { 
    id: 5, 
    date: "2025-10-14", 
    patientName: "Laura Díaz Ramírez", 
    serviceType: "Consulta General", 
    amount: 250, 
    status: "Pagado" 
  },
  { 
    id: 6, 
    date: "2025-10-14", 
    patientName: "Pedro Sánchez García", 
    serviceType: "Cirugía Menor", 
    amount: 1200, 
    status: "Pendiente" 
  },
  { 
    id: 7, 
    date: "2025-10-13", 
    patientName: "Isabel Fernández Torres", 
    serviceType: "Consulta Especializada", 
    amount: 450, 
    status: "Pagado" 
  },
  { 
    id: 8, 
    date: "2025-10-13", 
    patientName: "Miguel Torres Vásquez", 
    serviceType: "Exámenes de Laboratorio", 
    amount: 350, 
    status: "Pendiente" 
  },
  { 
    id: 9, 
    date: "2025-10-12", 
    patientName: "Carmen Ruiz Ortiz", 
    serviceType: "Consulta General", 
    amount: 250, 
    status: "Pagado" 
  },
  { 
    id: 10, 
    date: "2025-10-12", 
    patientName: "Roberto Jiménez Cruz", 
    serviceType: "Teleconsulta", 
    amount: 180, 
    status: "Pendiente" 
  },
];

export function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calculator states
  const [basePrice, setBasePrice] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [extraFees, setExtraFees] = useState<string>("");
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [isFromCalculator, setIsFromCalculator] = useState(false);

  // Filter payments by search
  const filteredPayments = paymentsData.filter(payment =>
    payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total from calculator
  const calculateTotal = () => {
    const base = parseFloat(basePrice) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    const fees = parseFloat(extraFees) || 0;
    
    const discountAmount = (base * discount) / 100;
    const total = base - discountAmount + fees;
    
    return total;
  };

  const handleGenerateLink = () => {
    const total = calculateTotal();
    if (total <= 0) {
      toast.error("Por favor ingrese un monto válido");
      return;
    }
    setCalculatedTotal(total);
    setIsFromCalculator(true);
    setSelectedPatient("");
    setShowPaymentModal(true);
  };

  const handleSendPaymentLink = (patientName: string, amount: number) => {
    setSelectedPatient(patientName);
    setCalculatedTotal(amount);
    setIsFromCalculator(false);
    setShowPaymentModal(true);
  };

  const confirmSendLink = () => {
    toast.success(
      `Enlace de pago enviado a ${selectedPatient || "el paciente"} por Q${calculatedTotal.toLocaleString()}`,
      {
        icon: <CheckCircle2 className="w-5 h-5" />,
      }
    );
    
    // Reset calculator if it was used
    if (isFromCalculator) {
      setBasePrice("");
      setDiscountPercentage("");
      setExtraFees("");
    }
    
    setShowPaymentModal(false);
  };

  const currentTotal = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <Card className="p-6 border-2 border-[#0477BF]/20 bg-gradient-to-br from-white to-[#0477BF]/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0477BF' }}>
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-[#0477BF]">Calculadora de Cobros</h3>
            <p className="text-sm text-gray-600">Calcule el monto total del servicio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Base Price */}
          <div>
            <Label htmlFor="basePrice" className="text-sm text-gray-700 mb-2 block">
              Precio Base (Q)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Q</span>
              <Input
                id="basePrice"
                type="number"
                placeholder="0.00"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="pl-8 border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <Label htmlFor="discount" className="text-sm text-gray-700 mb-2 block">
              Descuento (%)
            </Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
              />
            </div>
          </div>

          {/* Extra Fees */}
          <div>
            <Label htmlFor="extraFees" className="text-sm text-gray-700 mb-2 block">
              Cargos Adicionales (Q)
            </Label>
            <div className="relative">
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="extraFees"
                type="number"
                placeholder="0.00"
                value={extraFees}
                onChange={(e) => setExtraFees(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
              />
            </div>
          </div>

          {/* Total */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">
              Total a Cobrar
            </Label>
            <div className="h-10 bg-gradient-to-r from-[#0477BF] to-[#2BB9D9] rounded-lg flex items-center justify-center px-4">
              <span className="text-white">Q{currentTotal.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Calculation Breakdown */}
        {basePrice && parseFloat(basePrice) > 0 && (
          <div className="mb-6 p-4 bg-white/50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Desglose del Cálculo:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Precio Base:</span>
                <span className="text-gray-900">Q{parseFloat(basePrice).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
              </div>
              {discountPercentage && parseFloat(discountPercentage) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="flex items-center gap-1">
                    <Minus className="w-3 h-3" />
                    Descuento ({discountPercentage}%):
                  </span>
                  <span>-Q{((parseFloat(basePrice) * parseFloat(discountPercentage)) / 100).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {extraFees && parseFloat(extraFees) > 0 && (
                <div className="flex justify-between text-[#9DD973]">
                  <span className="flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    Cargos Adicionales:
                  </span>
                  <span>+Q{parseFloat(extraFees).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-[#0477BF]">Total:</span>
                <span className="text-[#0477BF]">Q{currentTotal.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleGenerateLink}
          className="w-full text-white"
          style={{ backgroundColor: '#0477BF' }}
          disabled={currentTotal <= 0}
        >
          <Link2 className="w-4 h-4 mr-2" />
          Generar Enlace de Pago
        </Button>
      </Card>

      {/* Search Bar */}
      <Card className="p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre de paciente o tipo de servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-[#0477BF]">Lista de Pagos</h3>
          <p className="text-sm text-gray-600 mt-1">
            Administre y envíe enlaces de pago a los pacientes
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-[#0477BF]">Fecha</TableHead>
                <TableHead className="text-[#0477BF]">Nombre del Paciente</TableHead>
                <TableHead className="text-[#0477BF]">Tipo de Servicio</TableHead>
                <TableHead className="text-[#0477BF]">Monto</TableHead>
                <TableHead className="text-[#0477BF]">Estado</TableHead>
                <TableHead className="text-[#0477BF] text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-900">
                    {new Date(payment.date).toLocaleDateString('es-GT', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {payment.patientName}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {payment.serviceType}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    Q{payment.amount.toLocaleString('es-GT')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        payment.status === "Pagado"
                          ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/10"
                          : "border-[#2BB9D9] text-[#2BB9D9] bg-[#2BB9D9]/10"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {payment.status === "Pendiente" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendPaymentLink(payment.patientName, payment.amount)}
                        className="border-[#0477BF] text-[#0477BF] hover:bg-[#0477BF] hover:text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Enlace
                      </Button>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-[#9DD973] text-[#9DD973] bg-[#9DD973]/10"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completado
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Mostrando {filteredPayments.length} de {paymentsData.length} registros de pago
          </p>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <AlertDialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#0477BF] flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Confirmar Envío de Enlace de Pago
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Desea enviar el enlace de pago {isFromCalculator ? "al paciente" : `a ${selectedPatient}`}? Se enviará un enlace seguro de pago por correo electrónico y SMS.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-[#0477BF]/5 to-[#2BB9D9]/5 rounded-lg border border-[#0477BF]/20">
              <div className="space-y-2">
                {!isFromCalculator && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paciente:</span>
                    <span className="text-sm text-gray-900">{selectedPatient}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto a cobrar:</span>
                  <span className="text-[#0477BF]">
                    Q{calculatedTotal.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSendLink}
              className="text-white"
              style={{ backgroundColor: '#0477BF' }}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Enlace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
