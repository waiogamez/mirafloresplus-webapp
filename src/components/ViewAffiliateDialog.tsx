import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard, 
  FileText,
  Users
} from "lucide-react";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  joined: string;
  // Datos adicionales para la vista detallada
  dpi?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
}

interface ViewAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate: Affiliate | null;
}

export function ViewAffiliateDialog({ open, onOpenChange, affiliate }: ViewAffiliateDialogProps) {
  if (!affiliate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0477BF] flex items-center gap-2">
            <User className="w-5 h-5" aria-hidden="true" />
            Detalles del Afiliado
          </DialogTitle>
          <DialogDescription>
            Información completa del afiliado incluyendo datos personales, contacto y estado financiero.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header con estado y plan */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[#0477BF] mb-1">{affiliate.name}</h3>
              <p className="text-sm text-gray-500">ID: {affiliate.id}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
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
                Plan {affiliate.plan}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Información de Contacto */}
          <div>
            <h4 className="text-sm text-gray-500 mb-3">Información de Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{affiliate.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm text-gray-900">{affiliate.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Dirección</p>
                  <p className="text-sm text-gray-900">
                    {affiliate.address || "Zona 10, Ciudad de Guatemala"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">DPI</p>
                  <p className="text-sm text-gray-900">
                    {affiliate.dpi || "2345 67890 0101"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Personal */}
          <div>
            <h4 className="text-sm text-gray-500 mb-3">Información Personal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Fecha de Nacimiento</p>
                  <p className="text-sm text-gray-900">
                    {affiliate.birthDate || "15/03/1985"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Género</p>
                  <p className="text-sm text-gray-900">
                    {affiliate.gender || "Femenino"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Fecha de Ingreso</p>
                  <p className="text-sm text-gray-900">{affiliate.joined}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Plan de Afiliación</p>
                  <p className="text-sm text-gray-900">Plan {affiliate.plan}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contacto de Emergencia */}
          <div>
            <h4 className="text-sm text-gray-500 mb-3">Contacto de Emergencia</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="text-sm text-gray-900">
                    {affiliate.emergencyContact || "Juan González"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#0477BF] mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="text-sm text-gray-900">
                    {affiliate.emergencyPhone || "+502 5234-9999"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          <div>
            <h4 className="text-sm text-gray-500 mb-3">Información Financiera</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0477BF]/5 p-4 rounded-lg border border-[#0477BF]/20">
                <p className="text-xs text-gray-500 mb-1">Mensualidad</p>
                <p className="text-[#0477BF]">
                  {affiliate.plan === "Premium" ? "Q 500.00" : 
                   affiliate.plan === "Estándar" ? "Q 350.00" : "Q 200.00"}
                </p>
              </div>
              <div className="bg-[#62BF04]/5 p-4 rounded-lg border border-[#62BF04]/20">
                <p className="text-xs text-gray-500 mb-1">Estado de Cuenta</p>
                <p className="text-[#62BF04]">Al día</p>
              </div>
              <div className="bg-[#2BB9D9]/5 p-4 rounded-lg border border-[#2BB9D9]/20">
                <p className="text-xs text-gray-500 mb-1">Último Pago</p>
                <p className="text-sm text-gray-900">01/10/2024</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
