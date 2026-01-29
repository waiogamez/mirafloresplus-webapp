import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { CreditCard, Users, Calculator } from "lucide-react";
import { Badge } from "./ui/badge";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numberOfDependents: number;
}

// Mapeo de iframes de BAC Credomatic según número de dependientes
const PAYMENT_IFRAMES = {
  0: 'https://checkout.baccredomatic.com/payment_button?token=MzM3ZDUxMTA2YTYxNzk2ZGYzNzU3OC4xNzY4MjQwNzU3&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
  1: 'https://checkout.baccredomatic.com/payment_button?token=LjgzNjg5MzU1OTI3OWI3ODc1MzYzNjcxNzY4MjQwNzIy&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
  2: 'https://checkout.baccredomatic.com/payment_button?token=NjZkNTM3NDMzNjE2YS4yZTU3Mzk2MzYxNzY4MjQwOTQ3&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
  3: 'https://checkout.baccredomatic.com/payment_button?token=NzUzMzVhNTM0NjgwNjgzMTYuOTU2NTYxNzY4MjQwOTgy&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
  4: 'https://checkout.baccredomatic.com/payment_button?token=NzJiNjUzOTM5ZDg2ODUxNjA1NS43OTYxNzY4MjQxMDI5&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
  5: 'https://checkout.baccredomatic.com/payment_button?token=OTAwLjBhMTI1NjQzNzc1ZjgxNjU4NjAxNzY4MjQxMDYz&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
  6: 'https://checkout.baccredomatic.com/payment_button?token=NWYzNGI1LjExMDU3OTMwZTY3NTY3MzYxNzY4MjQxMDg2&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
};

// Función para calcular el monto total
const calculateMonthlyAmount = (dependents: number): number => {
  const baseAmount = 85;
  const dependentCost = 49;
  return baseAmount + (dependents * dependentCost);
};

export function PaymentDialog({ open, onOpenChange, numberOfDependents }: PaymentDialogProps) {
  const monthlyAmount = calculateMonthlyAmount(numberOfDependents);
  const iframeUrl = PAYMENT_IFRAMES[numberOfDependents as keyof typeof PAYMENT_IFRAMES] || PAYMENT_IFRAMES[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0477BF] flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pago de Mensualidad
          </DialogTitle>
          <DialogDescription>
            Completa tu pago de forma segura con BAC Credomatic
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Detalles del Plan */}
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Plan</span>
              <Badge className="bg-[#62BF04]">Para Todos</Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Dependientes
              </span>
              <span className="font-bold text-[#0477BF]">{numberOfDependents}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  Total Mensual
                </span>
                <span className="text-2xl font-bold text-[#0477BF]">
                  Q {monthlyAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Desglose del Pago */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Afiliado titular</span>
              <span className="font-semibold">Q 85.00</span>
            </div>
            {numberOfDependents > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {numberOfDependents} {numberOfDependents === 1 ? 'Dependiente' : 'Dependientes'} × Q 49.00
                </span>
                <span className="font-semibold">Q {(numberOfDependents * 49).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Iframe de Pago de BAC Credomatic */}
          <div className="flex justify-center py-2">
            <iframe
              style={{
                width: '210px',
                border: 'none',
                height: '325px',
                display: 'inline'
              }}
              title="Pagar ahora"
              src={iframeUrl}
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
          </div>

          {/* Información de Seguridad */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-xs text-green-800 text-center">
              🔒 <strong>Pago 100% seguro</strong> procesado por BAC Credomatic
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
