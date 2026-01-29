import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle, Download, Printer, Mail, User, Phone, MapPin, CreditCard, Calendar, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AffiliateData {
  affiliateId: string;
  firstName: string;
  lastName: string;
  dpi: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  plan: string;
  paymentMethod: string;
  dependentsCount?: number;
}

interface AffiliateConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliateData: AffiliateData | null;
  onPrintContract?: () => void;
  onDownloadPDF?: () => void;
  onSendEmail?: () => void;
}

export function AffiliateConfirmationDialog({
  open,
  onOpenChange,
  affiliateData,
  onPrintContract,
  onDownloadPDF,
  onSendEmail
}: AffiliateConfirmationDialogProps) {
  if (!affiliateData) return null;

  const handlePrint = () => {
    onPrintContract?.();
    toast.success("Preparando documentos para imprimir...");
  };

  const handleDownload = () => {
    onDownloadPDF?.();
    toast.success("Descargando contrato en PDF...");
  };

  const handleEmail = () => {
    onSendEmail?.();
    toast.success(`Contrato enviado a ${affiliateData.email}`);
  };

  const monthlyFee = 75.00;
  const dependentsFee = (affiliateData.dependentsCount || 0) * 40.00;
  const totalMonthly = monthlyFee + dependentsFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-[#0477BF] to-[#2BB9D9] text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-white text-2xl">
                  ¡Afiliación Exitosa!
                </DialogTitle>
                <DialogDescription className="text-white/90">
                  Bienvenido al programa Miraflores Plus
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* ID de Afiliado */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número de Afiliado</p>
                  <p className="text-3xl text-[#0477BF]">{affiliateData.affiliateId}</p>
                </div>
                <Badge className="bg-[#62BF04] text-white text-lg px-4 py-2">
                  ACTIVO
                </Badge>
              </div>
            </Card>

            {/* Información Personal */}
            <Card className="p-6">
              <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium">{affiliateData.firstName} {affiliateData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DPI</p>
                  <p className="font-medium">{affiliateData.dpi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-medium">{new Date(affiliateData.dateOfBirth).toLocaleDateString('es-GT')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Género</p>
                  <p className="font-medium">{affiliateData.gender}</p>
                </div>
              </div>
            </Card>

            {/* Información de Contacto */}
            <Card className="p-6">
              <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5" />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Correo Electrónico
                  </p>
                  <p className="font-medium">{affiliateData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Teléfono
                  </p>
                  <p className="font-medium">{affiliateData.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Dirección
                  </p>
                  <p className="font-medium">
                    {affiliateData.address}, {affiliateData.city}, {affiliateData.department}
                  </p>
                </div>
              </div>
            </Card>

            {/* Contacto de Emergencia */}
            <Card className="p-6">
              <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5" />
                Contacto de Emergencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{affiliateData.emergencyContactName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{affiliateData.emergencyContactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relación</p>
                  <p className="font-medium">{affiliateData.emergencyContactRelationship}</p>
                </div>
              </div>
            </Card>

            {/* Plan y Pago */}
            <Card className="p-6 border-[#0477BF]">
              <h3 className="text-[#0477BF] flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" />
                Plan y Forma de Pago
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan Seleccionado</span>
                  <Badge className="bg-[#0477BF] text-white">{affiliateData.plan}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Método de Pago</span>
                  <span className="font-medium">{affiliateData.paymentMethod}</span>
                </div>
                <Separator />
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuota Titular</span>
                    <span className="font-medium">Q{monthlyFee.toFixed(2)}</span>
                  </div>
                  {affiliateData.dependentsCount && affiliateData.dependentsCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Dependientes ({affiliateData.dependentsCount})
                      </span>
                      <span className="font-medium">Q{dependentsFee.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="text-[#0477BF]">Total Mensual</span>
                    <span className="text-[#0477BF]">Q{totalMonthly.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sedes Autorizadas */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-[#0477BF] flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5" />
                Sedes Autorizadas
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#62BF04] mt-0.5" />
                  <div>
                    <p className="font-medium">Hospital Miraflores Roosevelt</p>
                    <p className="text-sm text-gray-600">Ciudad de Guatemala</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#62BF04] mt-0.5" />
                  <div>
                    <p className="font-medium">Hospital Miraflores Zona 10</p>
                    <p className="text-sm text-gray-600">Ciudad de Guatemala</p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Próximos Pasos */}
            <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <h3 className="text-[#0477BF] flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5" />
                Próximos Pasos
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-[#0477BF] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span>Recibirá un correo de confirmación con su número de afiliado y credenciales de acceso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#0477BF] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span>Su plan estará activo inmediatamente después de procesar el primer pago</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#0477BF] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <span>Podrá agendar citas y acceder a servicios desde el portal de afiliados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#0477BF] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">4</span>
                  <span>Recibirá recordatorios de pago 5 días antes del vencimiento mensual</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleEmail}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Enviar Email
              </Button>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white"
            >
              Finalizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
