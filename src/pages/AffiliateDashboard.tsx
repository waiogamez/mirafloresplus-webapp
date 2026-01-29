import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { usePaymentProofStore } from "../store/usePaymentProofStore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Calendar, Video, Phone, CreditCard, Users, Hospital, Clock, Heart, LogOut, FileText, Download, Upload, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PaymentDialog } from "../components/PaymentDialog";
import { AffiliateAddAppointmentDialog } from "../components/AffiliateAddAppointmentDialog";
import { UploadPaymentProofDialog } from "../components/UploadPaymentProofDialog";

export function AffiliateDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const appointments = useAppointmentStore(state => state.appointments);
  const updateAppointmentStatus = useAppointmentStore(state => state.updateAppointmentStatus);
  const getPaymentProofsByAffiliate = usePaymentProofStore(state => state.getPaymentProofsByAffiliate);
  
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showCarnetDialog, setShowCarnetDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showUploadPaymentProofDialog, setShowUploadPaymentProofDialog] = useState(false);

  // Calcular el monto mensual según dependientes
  const numberOfDependents = user?.numberOfDependents ?? 3;
  const monthlyAmount = 85 + (numberOfDependents * 49);
  
  // Obtener comprobantes de pago del afiliado
  const paymentProofs = getPaymentProofsByAffiliate(user?.id || '');
  const latestProof = paymentProofs[paymentProofs.length - 1];

  // Calcular próxima fecha de pago basado en fecha de afiliación
  const calculateNextPaymentDate = () => {
    if (!user?.createdAt) return '5 Feb 2026';
    
    const affiliationDate = new Date(user.createdAt);
    const affiliationDay = affiliationDate.getDate();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let nextPaymentDate: Date;
    
    // Si se afilió del 1-14: Pago del 1-5
    if (affiliationDay >= 1 && affiliationDay <= 14) {
      nextPaymentDate = new Date(currentYear, currentMonth, 5);
      // Si ya pasó el día 5 de este mes, siguiente mes
      if (currentDate.getDate() > 5) {
        nextPaymentDate = new Date(currentYear, currentMonth + 1, 5);
      }
    } 
    // Si se afilió del 15-31: Pago del 15-20
    else {
      nextPaymentDate = new Date(currentYear, currentMonth, 20);
      // Si ya pasó el día 20 de este mes, siguiente mes
      if (currentDate.getDate() > 20) {
        nextPaymentDate = new Date(currentYear, currentMonth + 1, 20);
      }
    }
    
    return nextPaymentDate.toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const nextPaymentDate = calculateNextPaymentDate();
  
  const metrics = [
    { title: 'Próxima Cita', value: '15 Feb', icon: Calendar, color: '#0477BF', subtitle: '10:30 AM' },
    { title: 'Plan Actual', value: 'Para Todos', icon: CreditCard, color: '#62BF04', subtitle: 'Renovación: 15 Feb' },
    { title: 'Dependientes', value: '3', icon: Users, color: '#9DD973', subtitle: 'Familia completa' },
    { title: 'Consultas', value: '12', icon: Hospital, color: '#2BB9D9', subtitle: 'Este año' },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Carlos Hernández', specialty: 'Medicina General', date: '15 Feb 2026', time: '10:30 AM', status: 'Confirmada' },
    { id: 2, doctor: 'Dra. María López', specialty: 'Pediatría', date: '22 Feb 2026', time: '3:00 PM', status: 'Pendiente' },
  ];

  const handleScheduleAppointment = () => {
    setShowAppointmentDialog(true);
  };

  const handleViewHistory = () => {
    toast.info('Cargando tu historial médico...');
    setTimeout(() => {
      toast.success('Historial médico disponible');
    }, 1000);
  };

  const handleDownloadCarnet = () => {
    setShowCarnetDialog(true);
  };

  const handlePayMonthly = () => {
    // Mostrar el diálogo de pago con el iframe de BAC Credomatic
    setShowPaymentDialog(true);
  };

  const handleCancelAppointment = (id: number, doctor: string) => {
    if (window.confirm(`¿Deseas cancelar la cita con ${doctor}?`)) {
      updateAppointmentStatus(id.toString(), 'Cancelada');
      toast.success(`Cita cancelada con ${doctor}`);
    }
  };

  const handleConfirmAppointment = (id: number, doctor: string) => {
    updateAppointmentStatus(id.toString(), 'Confirmada');
    toast.success(`Cita confirmada con ${doctor}`);
  };

  const handleViewAllAppointments = () => {
    navigate('/affiliate-appointments');
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Cita agendada exitosamente!');
    setShowAppointmentDialog(false);
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
            <h1 className="text-2xl font-bold mb-2">¡Hola, {user?.firstName}!</h1>
            <p className="text-blue-100">Bienvenido a tu portal de salud</p>
            <p className="text-sm text-blue-200 mt-2">
              Tu salud, a un clic de distancia
            </p>
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
            <Heart className="w-5 h-5 text-red-500" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button 
            className="bg-[#0477BF] hover:bg-[#0366a3]"
            onClick={handleScheduleAppointment}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Cita
          </Button>
          <Button 
            variant="outline"
            className="border-[#62BF04] text-[#62BF04] hover:bg-[#62BF04]/10"
            onClick={handleViewHistory}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver Mi Historial Médico
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadCarnet}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Carnet Digital
          </Button>
          <Button 
            variant="outline"
            className="border-[#2BB9D9] text-[#2BB9D9] hover:bg-[#2BB9D9]/10"
            onClick={handlePayMonthly}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pagar Mensualidad
          </Button>
        </CardContent>
      </Card>

      {/* Métricas del Afiliado */}
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
                    <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Próximas Citas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0477BF]" />
              Próximas Citas ({upcomingAppointments.length})
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant="outline"
                className="border-[#2BB9D9] text-[#2BB9D9] hover:bg-[#2BB9D9]/10"
                onClick={handleViewAllAppointments}
              >
                <FileText className="w-4 h-4 mr-1" />
                Ver Todas
              </Button>
              <Button 
                size="sm"
                className="bg-[#0477BF]"
                onClick={handleScheduleAppointment}
              >
                <Video className="w-4 h-4 mr-1" />
                Nueva Cita
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold mb-2">No tienes citas programadas</p>
              <Button 
                className="mt-4 bg-[#0477BF]"
                onClick={handleScheduleAppointment}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Mi Primera Cita
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200 hover:border-[#0477BF] transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">
                        {apt.doctor}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {apt.specialty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      📅 {apt.date} • 🕐 {apt.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={apt.status === 'Confirmada' ? 'default' : 'secondary'}>
                      {apt.status}
                    </Badge>
                    {apt.status === 'Pendiente' && (
                      <Button
                        size="sm"
                        className="bg-[#62BF04] hover:bg-[#52a003] text-white"
                        onClick={() => handleConfirmAppointment(apt.id, apt.doctor)}
                      >
                        Confirmar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleCancelAppointment(apt.id, apt.doctor)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel Informativo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💳 Estado de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Plan Actual</span>
                <span className="font-bold text-[#62BF04]">Para Todos</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Dependientes</span>
                <span className="font-semibold text-gray-900">{numberOfDependents}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Mensualidad</span>
                <span className="font-bold text-[#0477BF]">
                  Q {monthlyAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-gray-600">Próximo Pago</span>
                <span className="font-semibold text-gray-900">{nextPaymentDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado</span>
                <Badge className="bg-green-500">Al Día</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">👨‍👩‍👧‍👦 Mis Dependientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-sm">María González</p>
                <p className="text-xs text-gray-600">Cónyuge • 35 años</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-sm">Carlos González Jr.</p>
                <p className="text-xs text-gray-600">Hijo • 12 años</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-sm">Ana González</p>
                <p className="text-xs text-gray-600">Hija • 8 años</p>
              </div>
              <Button variant="outline" className="w-full mt-2">
                <Users className="w-4 h-4 mr-2" />
                Agregar Dependiente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PAGO EMBEBIDO - Iframe de BAC Credomatic */}
      <Card className="border-2 border-[#62BF04]">
        <CardHeader className="bg-gradient-to-r from-[#62BF04]/10 to-transparent">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#62BF04]" />
              Pagar Tu Mensualidad
            </span>
            <Badge className="bg-[#62BF04]">Pago Seguro</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Información del Pago */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Plan Para Todos</p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {numberOfDependents} {numberOfDependents === 1 ? 'Dependiente' : 'Dependientes'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#0477BF]">
                  Q {monthlyAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">Mensual</p>
              </div>
            </div>
            
            {/* Desglose */}
            <div className="border-t border-blue-200 pt-3 space-y-1 text-xs">
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
          </div>

          {/* Iframe de BAC Credomatic Embebido */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex justify-center">
              <iframe
                style={{
                  width: '210px',
                  border: 'none',
                  height: '325px',
                  display: 'inline'
                }}
                title="Pagar ahora con BAC Credomatic"
                src={(() => {
                  const PAYMENT_IFRAMES: Record<number, string> = {
                    0: 'https://checkout.baccredomatic.com/payment_button?token=MzM3ZDUxMTA2YTYxNzk2ZGYzNzU3OC4xNzY4MjQwNzU3&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                    1: 'https://checkout.baccredomatic.com/payment_button?token=LjgzNjg5MzU1OTI3OWI3ODc1MzYzNjcxNzY4MjQwNzIy&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                    2: 'https://checkout.baccredomatic.com/payment_button?token=NjZkNTM3NDMzNjE2YS4yZTU3Mzk2MzYxNzY4MjQwOTQ3&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                    3: 'https://checkout.baccredomatic.com/payment_button?token=NzUzMzVhNTM0NjgwNjgzMTYuOTU2NTYxNzY4MjQwOTgy&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                    4: 'https://checkout.baccredomatic.com/payment_button?token=NzJiNjUzOTM5ZDg2ODUxNjA1NS43OTYxNzY4MjQxMDI5&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                    5: 'https://checkout.baccredomatic.com/payment_button?token=OTAwLjBhMTI1NjQzNzc1ZjgxNjU4NjAxNzY4MjQxMDYz&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                    6: 'https://checkout.baccredomatic.com/payment_button?token=NWYzNGI1LjExMDU3OTMwZTY3NTY3MzYxNzY4MjQxMDg2&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true',
                  };
                  return PAYMENT_IFRAMES[numberOfDependents] || PAYMENT_IFRAMES[0];
                })()}
              >
                <p>Your browser does not support iframes.</p>
              </iframe>
            </div>

            {/* Información de Seguridad */}
            <div className="w-full bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-xs text-green-800 text-center">
                🔒 <strong>Pago 100% seguro</strong> procesado por BAC Credomatic Guatemala
              </p>
            </div>

            {/* Instrucciones Post-Pago */}
            <div className="w-full bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-800 mb-2">
                📸 Después de realizar el pago:
              </p>
              <ol className="text-xs text-yellow-700 space-y-1 ml-4 list-decimal">
                <li>Guarda tu comprobante de pago (captura de pantalla o PDF)</li>
                <li>Haz clic en el botón "Subir Comprobante" abajo</li>
                <li>Sube la imagen de tu comprobante</li>
                <li>Espera la validación de nuestro equipo (máx. 24 horas)</li>
              </ol>
              <Button
                size="sm"
                className="w-full mt-3 bg-[#0477BF]"
                onClick={() => setShowUploadPaymentProofDialog(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir Mi Comprobante de Pago
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contactos de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🚨 Contactos de Emergencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Phone className="w-6 h-6 text-red-600" />
              <span className="font-semibold">Emergencias</span>
              <span className="text-sm text-gray-600">123</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Phone className="w-6 h-6 text-[#0477BF]" />
              <span className="font-semibold">Miraflores Plus</span>
              <span className="text-sm text-gray-600">+502 4898-1003</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Phone className="w-6 h-6 text-[#62BF04]" />
              <span className="font-semibold">Asistencia 24/7</span>
              <span className="text-sm text-gray-600">+502 2222-3333</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Comprobantes de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0477BF]" />
              Comprobantes de Pago
            </span>
            <Button
              size="sm"
              className="bg-[#62BF04] hover:bg-[#52a003]"
              onClick={() => setShowUploadPaymentProofDialog(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir Comprobante
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentProofs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold mb-2">No hay comprobantes subidos</p>
              <Button
                className="mt-4 bg-[#0477BF]"
                onClick={() => setShowUploadPaymentProofDialog(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir Mi Primer Comprobante
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentProofs.slice(-3).reverse().map((proof) => {
                const statusIcon = proof.status === 'Aprobado' ? CheckCircle : proof.status === 'Rechazado' ? XCircle : AlertCircle;
                const StatusIcon = statusIcon;
                const statusColor = proof.status === 'Aprobado' ? 'text-green-600' : proof.status === 'Rechazado' ? 'text-red-600' : 'text-yellow-600';
                const bgColor = proof.status === 'Aprobado' ? 'from-green-50' : proof.status === 'Rechazado' ? 'from-red-50' : 'from-yellow-50';
                
                return (
                  <div
                    key={proof.id}
                    className={`flex items-center justify-between p-4 bg-gradient-to-r ${bgColor} to-white rounded-lg border border-gray-200 hover:shadow-md transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                      <div>
                        <p className="font-semibold text-gray-900">{proof.monthYear}</p>
                        <p className="text-sm text-gray-600">
                          Q {proof.amount.toFixed(2)} • {proof.numberOfDependents} dependientes
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Subido: {new Date(proof.uploadedAt).toLocaleDateString('es-GT')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={proof.status === 'Aprobado' ? 'default' : proof.status === 'Rechazado' ? 'destructive' : 'secondary'}
                        className={proof.status === 'Aprobado' ? 'bg-green-500' : proof.status === 'Pendiente' ? 'bg-yellow-500' : ''}
                      >
                        {proof.status}
                      </Badge>
                      {proof.status === 'Rechazado' && proof.rejectionReason && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.info(`Motivo: ${proof.rejectionReason}`)}
                        >
                          Ver motivo
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {paymentProofs.length > 3 && (
                <Button variant="outline" className="w-full mt-2">
                  Ver Todos ({paymentProofs.length})
                </Button>
              )}
            </div>
          )}
          
          {/* Alerta si hay comprobante pendiente */}
          {latestProof?.status === 'Pendiente' && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-800 mb-1">
                ⏳ Comprobante en Revisión
              </p>
              <p className="text-xs text-yellow-700">
                Tu comprobante de {latestProof.monthYear} está siendo verificado por nuestro equipo. 
                Te notificaremos cuando sea aprobado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Nueva Cita - Usando componente completo */}
      <AffiliateAddAppointmentDialog
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        onAppointmentAdded={() => {
          toast.success('¡Videoconsulta agendada exitosamente!');
        }}
      />

      {/* Modal de Carnet Digital */}
      <Dialog open={showCarnetDialog} onOpenChange={setShowCarnetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mi Carnet Digital</DialogTitle>
            <DialogDescription>
              Carnet de afiliado MirafloresPlus
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#0477BF] to-[#2BB9D9] text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs opacity-80">MirafloresPlus</p>
                  <p className="text-2xl font-bold">{user?.firstName} {user?.lastName}</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#0477BF]" />
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p>ID: MP-2026-A3F2D1</p>
                <p>Plan: Para Todos</p>
                <p>Vigencia: {nextPaymentDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              <Button className="flex-1 bg-[#62BF04]">
                Compartir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pago */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        numberOfDependents={numberOfDependents}
      />

      {/* Modal de Subida de Comprobante de Pago */}
      <UploadPaymentProofDialog
        open={showUploadPaymentProofDialog}
        onOpenChange={setShowUploadPaymentProofDialog}
      />
    </div>
  );
}