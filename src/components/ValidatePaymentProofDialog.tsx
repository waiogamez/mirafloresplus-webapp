import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CheckCircle, XCircle, FileImage, Users, Calendar } from "lucide-react";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { toast } from "sonner@2.0.3";
import { usePaymentProofStore } from "../store/usePaymentProofStore";
import { useAuthStore } from "../store/useAuthStore";
import { PaymentProof } from "../store/types";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface ValidatePaymentProofDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proof: PaymentProof | null;
}

export function ValidatePaymentProofDialog({ open, onOpenChange, proof }: ValidatePaymentProofDialogProps) {
  const user = useAuthStore(state => state.user);
  const updatePaymentProofStatus = usePaymentProofStore(state => state.updatePaymentProofStatus);
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!proof) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updatePaymentProofStatus(proof.id, 'Aprobado', user?.id || '');
      
      toast.success('¡Comprobante aprobado!', {
        description: `El comprobante de ${proof.affiliateName} ha sido validado exitosamente.`
      });
      
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al aprobar comprobante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Debes indicar el motivo del rechazo');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updatePaymentProofStatus(proof.id, 'Rechazado', user?.id || '', rejectionReason);
      
      toast.success('Comprobante rechazado', {
        description: `Se ha notificado a ${proof.affiliateName} sobre el rechazo.`
      });
      
      setRejectionReason("");
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al rechazar comprobante');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0477BF] flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Validar Comprobante de Pago
          </DialogTitle>
          <DialogDescription>
            Revisa el comprobante y aprueba o rechaza el pago
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del Afiliado */}
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Afiliado</p>
                <p className="font-semibold text-[#0477BF]">{proof.affiliateName}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {proof.affiliateId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Período
                </p>
                <p className="font-semibold">{proof.monthYear}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <QuetzalIcon className="w-3 h-3" />
                  Monto
                </p>
                <p className="text-lg font-bold text-[#62BF04]">
                  Q {proof.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Dependientes
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {proof.numberOfDependents}
                </p>
              </div>
            </div>

            {/* Desglose */}
            <div className="mt-3 pt-3 border-t border-blue-200 bg-white/50 p-2 rounded">
              <p className="text-xs font-semibold text-gray-700 mb-2">Desglose:</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Afiliado titular</span>
                  <span className="font-semibold">Q 85.00</span>
                </div>
                {proof.numberOfDependents > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {proof.numberOfDependents} {proof.numberOfDependents === 1 ? 'Dependiente' : 'Dependientes'} × Q 49.00
                    </span>
                    <span className="font-semibold">Q {(proof.numberOfDependents * 49).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comprobante de Pago */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <FileImage className="w-4 h-4" />
              Comprobante de Pago
            </Label>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={proof.proofImageUrl}
                alt="Comprobante de pago"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Subido el {new Date(proof.uploadedAt).toLocaleDateString('es-GT', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Estado Actual */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Estado actual:</span>
            <Badge variant={proof.status === 'Aprobado' ? 'default' : proof.status === 'Rechazado' ? 'destructive' : 'secondary'}
                   className={proof.status === 'Aprobado' ? 'bg-green-500' : proof.status === 'Pendiente' ? 'bg-yellow-500' : ''}>
              {proof.status}
            </Badge>
          </div>

          {/* Motivo de Rechazo */}
          {proof.status === 'Pendiente' && (
            <div>
              <Label htmlFor="rejectionReason" className="mb-2 block">
                Motivo de Rechazo (opcional)
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder="Ej: El comprobante no es legible, falta información, monto incorrecto, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Información adicional si ya fue validado */}
          {proof.status !== 'Pendiente' && proof.validatedBy && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                Validado por: <span className="font-semibold">{proof.validatedBy}</span>
              </p>
              <p className="text-xs text-gray-600">
                Fecha: {proof.validatedAt ? new Date(proof.validatedAt).toLocaleDateString('es-GT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </p>
              {proof.status === 'Rechazado' && proof.rejectionReason && (
                <p className="text-xs text-red-700 mt-2">
                  <strong>Motivo:</strong> {proof.rejectionReason}
                </p>
              )}
            </div>
          )}

          {/* Botones de Acción */}
          {proof.status === 'Pendiente' && (
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cerrar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Rechazando...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={handleApprove}
                className="flex-1 bg-[#62BF04] hover:bg-[#52a003]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Aprobando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar Pago
                  </>
                )}
              </Button>
            </div>
          )}

          {proof.status !== 'Pendiente' && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Cerrar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}