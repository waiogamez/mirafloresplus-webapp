import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  X, 
  Calendar as CalendarIcon,
  Building2,
  Tag,
  Receipt,
  CreditCard,
  FileText
} from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";

interface NewReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewReceiptModal({ open, onOpenChange }: NewReceiptModalProps) {
  const [formData, setFormData] = useState({
    receiptType: "",
    provider: "",
    date: "",
    amount: "",
    description: "",
    paymentMethod: "",
    category: "",
    invoiceNumber: "",
  });

  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
      toast.success("Archivo adjuntado exitosamente");
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    toast.info("Archivo removido");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.receiptType || !formData.provider || !formData.date || !formData.amount) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Simular guardado
    toast.success("Comprobante creado exitosamente", {
      description: `${formData.receiptType} por Q${formData.amount} registrado`
    });

    // Resetear formulario
    setFormData({
      receiptType: "",
      provider: "",
      date: "",
      amount: "",
      description: "",
      paymentMethod: "",
      category: "",
      invoiceNumber: "",
    });
    setAttachedFile(null);
    
    // Cerrar modal
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      receiptType: "",
      provider: "",
      date: "",
      amount: "",
      description: "",
      paymentMethod: "",
      category: "",
      invoiceNumber: "",
    });
    setAttachedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0477BF] flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Nuevo Comprobante
          </DialogTitle>
          <DialogDescription>
            Registra un nuevo comprobante de ingreso o egreso en el sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Información Básica */}
          <Card className="p-4 bg-[#0477BF]/5 border-[#0477BF]/20">
            <h3 className="text-[#0477BF] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receiptType" className="flex items-center gap-1">
                  Tipo de Comprobante <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.receiptType} onValueChange={(value) => handleInputChange("receiptType", value)}>
                  <SelectTrigger id="receiptType">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="factura">Factura</SelectItem>
                    <SelectItem value="recibo">Recibo</SelectItem>
                    <SelectItem value="nota-credito">Nota de Crédito</SelectItem>
                    <SelectItem value="nota-debito">Nota de Débito</SelectItem>
                    <SelectItem value="comprobante-egreso">Comprobante de Egreso</SelectItem>
                    <SelectItem value="comprobante-ingreso">Comprobante de Ingreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Número de Documento</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="Ej: FAC-2024-1234"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  Fecha <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-1">
                  <QuetzalIcon className="w-4 h-4" />
                  Monto (Q) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Información del Proveedor/Cliente */}
          <Card className="p-4 bg-[#2BB9D9]/5 border-[#2BB9D9]/20">
            <h3 className="text-[#0477BF] mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Proveedor / Cliente
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="provider" className="flex items-center gap-1">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provider"
                placeholder="Nombre del proveedor o cliente"
                value={formData.provider}
                onChange={(e) => handleInputChange("provider", e.target.value)}
              />
            </div>
          </Card>

          {/* Categorización */}
          <Card className="p-4 bg-[#62BF04]/5 border-[#62BF04]/20">
            <h3 className="text-[#0477BF] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categorización
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proveedores">Proveedores</SelectItem>
                    <SelectItem value="salarios">Salarios</SelectItem>
                    <SelectItem value="infraestructura">Infraestructura</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="servicios">Servicios</SelectItem>
                    <SelectItem value="suministros">Suministros Médicos</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Método de Pago
                </Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción / Notas</Label>
            <Textarea
              id="description"
              placeholder="Describe el propósito del comprobante, servicios recibidos, productos adquiridos, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          {/* Adjuntar Archivo */}
          <Card className="p-4 bg-gray-50 border-dashed border-2">
            <h3 className="text-[#0477BF] mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Archivo Adjunto
            </h3>
            
            {!attachedFile ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Adjunta una copia escaneada o foto del comprobante físico
                </p>
                <Label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </Label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0477BF]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#0477BF]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{attachedFile}</p>
                    <p className="text-xs text-gray-500">Archivo adjunto</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Nota Informativa */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Todos los comprobantes deben ser revisados y aprobados por la Junta Directiva</li>
                  <li>Los campos marcados con <span className="text-red-500">*</span> son obligatorios</li>
                  <li>Asegúrate de adjuntar el comprobante físico escaneado cuando sea posible</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Crear Comprobante
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}