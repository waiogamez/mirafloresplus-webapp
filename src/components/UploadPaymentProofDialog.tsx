import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, FileImage, X, Calendar, Users } from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner";
import { usePaymentProofStore } from "../store/usePaymentProofStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

interface UploadPaymentProofDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadPaymentProofDialog({ open, onOpenChange }: UploadPaymentProofDialogProps) {
  const user = useAuthStore(state => state.user);
  const addPaymentProof = usePaymentProofStore(state => state.addPaymentProof);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [monthYear, setMonthYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numberOfDependents = user?.numberOfDependents ?? 0;
  const monthlyAmount = 85 + (numberOfDependents * 49);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida');
        return;
      }
      
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Por favor selecciona un comprobante de pago');
      return;
    }
    
    if (!monthYear) {
      toast.error('Por favor indica el mes y año del pago');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular subida de imagen (en producción, aquí se subiría a un servidor/S3)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En producción, aquí se obtendría la URL real de la imagen subida
      const imageUrl = previewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400';
      
      // Agregar comprobante al store
      addPaymentProof({
        affiliateId: user?.id || '',
        affiliateName: `${user?.firstName} ${user?.lastName}`,
        monthYear,
        amount: monthlyAmount,
        numberOfDependents,
        proofImageUrl: imageUrl,
        uploadedBy: user?.id || '',
        uploadedByRole: 'affiliate',
        status: 'Pendiente',
      });

      toast.success('¡Comprobante subido exitosamente!', {
        description: 'Tu comprobante está en revisión. Te notificaremos cuando sea validado.'
      });

      // Limpiar formulario
      setSelectedFile(null);
      setPreviewUrl("");
      setMonthYear("");
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al subir el comprobante. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#0477BF] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Comprobante de Pago
          </DialogTitle>
          <DialogDescription>
            Sube tu comprobante de pago para validar tu mensualidad
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información del Pago */}
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 text-xs mb-1">Plan</p>
                <p className="font-semibold text-[#0477BF]">Para Todos</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Dependientes
                </p>
                <p className="font-semibold">{numberOfDependents}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-xs mb-1 flex items-center gap-1">
                  <QuetzalIcon className="w-3 h-3" />
                  Monto Mensual
                </p>
                <p className="text-xl font-bold text-[#62BF04]">
                  Q {monthlyAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Mes y Año */}
          <div>
            <Label htmlFor="monthYear" className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              Mes y Año del Pago
            </Label>
            <Input
              id="monthYear"
              type="text"
              placeholder="Ej: Enero 2025"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              required
            />
          </div>

          {/* Subir Comprobante */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <FileImage className="w-4 h-4" />
              Comprobante de Pago
            </Label>
            
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0477BF] transition-colors cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG o JPEG (máx. 5MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain bg-gray-50"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>📌 Importante:</strong> Asegúrate de que el comprobante sea legible y muestre 
              claramente el monto, fecha y número de referencia de la transacción.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#62BF04] hover:bg-[#52a003]"
              disabled={isSubmitting || !selectedFile || !monthYear}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Comprobante
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}