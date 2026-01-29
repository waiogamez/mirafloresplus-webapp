import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { CreditCard, AlertCircle, FileText, Download, Send, TrendingUp, LogOut } from 'lucide-react';
import { QuetzalIcon } from '../components/ui/quetzal-icon';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function FinanceDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const metrics = [
    { title: 'Ingresos del Mes', value: 'Q 285,450', icon: QuetzalIcon, color: '#62BF04', trend: '+12%' },
    { title: 'Cobros Pendientes', value: 'Q 45,200', icon: CreditCard, color: '#F59E0B', trend: '18 facturas' },
    { title: 'Pagos Atrasados', value: 'Q 12,300', icon: AlertCircle, color: '#EF4444', trend: '5 afiliados' },
    { title: 'Facturas Emitidas', value: '156', icon: FileText, color: '#0477BF', trend: 'Este mes' },
  ];

  const pendingPayments = [
    { id: 1, affiliate: 'María González', affiliateId: 'AF-2156', amount: 'Q 850.00', status: 'Vencido', days: 12, phone: '+502 5555-1234' },
    { id: 2, affiliate: 'Carlos Rodríguez', affiliateId: 'AF-2789', amount: 'Q 1,200.00', status: 'Vencido', days: 7, phone: '+502 5555-5678' },
    { id: 3, affiliate: 'Ana Martínez', affiliateId: 'AF-3012', amount: 'Q 650.00', status: 'Por Vencer', days: 0, phone: '+502 5555-9012' },
    { id: 4, affiliate: 'Luis Hernández', affiliateId: 'AF-3345', amount: 'Q 1,050.00', status: 'Pendiente', days: -3, phone: '+502 5555-3456' },
  ];

  const handleRegisterPayment = () => {
    setShowPaymentDialog(true);
  };

  const handleIssueInvoice = () => {
    setShowInvoiceDialog(true);
  };

  const handleSendReminder = (payment: any) => {
    toast.success(`Recordatorio enviado a ${payment.affiliate}`);
    // Aquí se enviaría SMS/Email
  };

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    toast.info(`Viendo detalles de ${payment.affiliate}`);
  };

  const handleNavigateToPayments = () => {
    navigate('/payments');
    toast.success('Cargando lista completa de pagos');
  };

  const handleExportReport = () => {
    toast.success('Exportando reporte financiero...');
    setTimeout(() => {
      toast.success('Reporte descargado exitosamente');
    }, 1500);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pago registrado exitosamente');
    setShowPaymentDialog(false);
  };

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Factura FEL emitida exitosamente');
    setShowInvoiceDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sesión cerrada exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida */}
      <div className="bg-gradient-to-r from-[#0477BF] to-[#2BB9D9] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">¡Bienvenido, {user?.firstName}!</h1>
            <p className="text-blue-100">Control financiero y facturación</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#62BF04]" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#62BF04] hover:bg-[#52a003]"
            onClick={handleRegisterPayment}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Registrar Pago
          </Button>
          <Button 
            variant="outline"
            className="border-[#0477BF] text-[#0477BF] hover:bg-[#0477BF]/10"
            onClick={handleIssueInvoice}
          >
            <FileText className="w-4 h-4 mr-2" />
            Emitir Factura FEL
          </Button>
          <Button 
            variant="outline"
            onClick={handleNavigateToPayments}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Ver Todos los Pagos
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </CardContent>
      </Card>

      {/* Métricas Financieras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: metric.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <h3 className="text-2xl font-bold" style={{ color: metric.color }}>
                      {metric.value}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{metric.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cobros Pendientes y Vencidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Cobros Pendientes y Vencidos ({pendingPayments.length})
            </span>
            {pendingPayments.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNavigateToPayments}
              >
                Ver Todos
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingPayments.map((payment) => (
              <div 
                key={payment.id} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-red-300 transition-all group cursor-pointer"
                onClick={() => handleViewDetails(payment)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900">
                      {payment.affiliate}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {payment.affiliateId}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {payment.days > 0 
                      ? `${payment.days} días de retraso` 
                      : payment.days === 0 
                      ? 'Vence hoy' 
                      : `Vence en ${Math.abs(payment.days)} días`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ 
                      color: payment.status === 'Vencido' ? '#EF4444' : '#F59E0B' 
                    }}>
                      {payment.amount}
                    </p>
                    <Badge variant={payment.status === 'Vencido' ? 'destructive' : 'default'}>
                      {payment.status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReminder(payment);
                    }}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Recordar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#62BF04] hover:bg-[#52a003] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPayment(payment);
                      handleRegisterPayment();
                    }}
                  >
                    Registrar Pago
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen Mensual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📊 Resumen del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Total Facturado</span>
                <span className="font-bold text-[#0477BF]">Q 285,450.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Total Cobrado</span>
                <span className="font-bold text-[#62BF04]">Q 240,250.00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Pendiente de Cobro</span>
                <span className="font-bold text-[#F59E0B]">Q 45,200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasa de Cobro</span>
                <span className="font-bold text-[#62BF04]">84.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">🎯 Objetivos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Ingresos</span>
                  <span className="font-semibold">Q 285k / Q 300k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#62BF04] h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Cobros Realizados</span>
                  <span className="font-semibold">156 / 180</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0477BF] h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Facturas FEL</span>
                  <span className="font-semibold">156 / 180</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#2BB9D9] h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Registro de Pago */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              Registra un nuevo pago de afiliado
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affiliate">Afiliado *</Label>
              <Input 
                id="affiliate" 
                placeholder="Buscar por nombre o ID..."
                defaultValue={selectedPayment?.affiliate}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto *</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00"
                  defaultValue={selectedPayment?.amount.replace('Q ', '').replace(',', '')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Método de Pago *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Referencia / No. Transacción</Label>
              <Input id="reference" placeholder="Opcional" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-[#62BF04]">
                Registrar Pago
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Factura FEL */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emitir Factura FEL</DialogTitle>
            <DialogDescription>
              Genera una factura electrónica FEL de SAT Guatemala
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitInvoice} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Cliente / Afiliado *</Label>
              <Input id="customer" placeholder="Nombre o NIT..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concept">Concepto *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensualidad">Mensualidad de Afiliación</SelectItem>
                  <SelectItem value="consulta">Consulta Médica</SelectItem>
                  <SelectItem value="procedimiento">Procedimiento</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total *</Label>
              <Input id="total" type="number" placeholder="0.00" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowInvoiceDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-[#0477BF]">
                Emitir FEL
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}