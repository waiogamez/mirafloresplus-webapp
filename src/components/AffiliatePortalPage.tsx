import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  User,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Shield,
  FileText,
} from "lucide-react";
import { Logo } from "./Logo";
import { toast } from "sonner";

// Mock user data
const affiliateData = {
  name: "María González Hernández",
  email: "maria.gonzalez@email.com",
  phone: "+502 5555-1234",
  address: "Ciudad de Guatemala",
  membershipId: "MPL-2024-0158",
  planType: "Plan Miraflores Plus",
  joinDate: "2024-01-15",
  status: "Active", // Change to "Inactive" to test payment form
  profileImage: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?w=400&h=400&fit=crop&crop=faces",
};

// Mock appointments data
const appointmentsData = [
  {
    id: 1,
    doctor: "Dr. Carlos Méndez López",
    specialty: "Medicina General",
    date: "2025-10-20",
    time: "10:00 AM",
    status: "Confirmada",
    type: "Presencial",
  },
  {
    id: 2,
    doctor: "Dra. Ana Rodríguez Castillo",
    specialty: "Cardiología",
    date: "2025-10-25",
    time: "2:30 PM",
    status: "Pendiente",
    type: "Teleconsulta",
  },
  {
    id: 3,
    doctor: "Dr. Carlos Méndez López",
    specialty: "Medicina General",
    date: "2025-09-15",
    time: "11:00 AM",
    status: "Completada",
    type: "Presencial",
  },
  {
    id: 4,
    doctor: "Dr. Luis Morales Pérez",
    specialty: "Dermatología",
    date: "2025-08-22",
    time: "3:00 PM",
    status: "Completada",
    type: "Presencial",
  },
];

export function AffiliatePortalPage() {
  const [membershipStatus, setMembershipStatus] = useState(affiliateData.status);
  
  // Payment form states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReactivateMembership = async () => {
    if (!cardName || !cardNumber || !expirationDate || !cvv) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setMembershipStatus("Active");
      setIsProcessing(false);
      toast.success("¡Membresía reactivada exitosamente!", {
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
      
      // Clear form
      setCardName("");
      setCardNumber("");
      setExpirationDate("");
      setCvv("");
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, "");
    if (value.length <= 4 && /^\d*$/.test(value)) {
      if (value.length >= 2) {
        setExpirationDate(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpirationDate(value);
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const upcomingAppointments = appointmentsData.filter(
    (apt) => apt.status === "Confirmada" || apt.status === "Pendiente"
  );
  const pastAppointments = appointmentsData.filter(
    (apt) => apt.status === "Completada"
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Top Bar */}
      <div 
        className="p-6 shadow-md bg-white"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="h-12 w-auto" />
            <Separator orientation="vertical" className="h-8 bg-[#0477BF]/30" />
            <div>
              <h2 className="text-[#0477BF]">Portal del Afiliado</h2>
              <p className="text-sm text-[#2BB9D9]">¡Tu salud, a un clic de distancia!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-[#0477BF] hover:bg-[#0477BF]/10"
            onClick={() => {
              toast.info("Cerrando sesión...");
            }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-2 border-[#0477BF]/20">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-[#0477BF]/20">
                  <AvatarImage src={affiliateData.profileImage} />
                  <AvatarFallback className="text-2xl" style={{ backgroundColor: '#0477BF', color: 'white' }}>
                    {affiliateData.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-[#0477BF] mb-1">{affiliateData.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">ID: {affiliateData.membershipId}</p>
                  <Badge
                    variant="outline"
                    className={
                      membershipStatus === "Active"
                        ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/10"
                        : "border-red-500 text-red-600 bg-red-50"
                    }
                  >
                    {membershipStatus === "Active" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Membresía Activa
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Membresía Inactiva
                      </>
                    )}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Shield className="w-4 h-4 text-[#0477BF]" />
                  <span>{affiliateData.planType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Miembro desde {new Date(affiliateData.joinDate).toLocaleDateString('es-GT', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Inactive Membership Alert */}
        {membershipStatus === "Inactive" && (
          <Card className="border-2 border-red-300 bg-red-50">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-red-700 mb-2">Su membresía está inactiva</h3>
                  <p className="text-sm text-red-600 mb-4">
                    Para continuar disfrutando de los beneficios de Miraflores Plus, reactive su membresía realizando el pago correspondiente.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="info" className="data-[state=active]:bg-[#0477BF] data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Mi Información
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-[#0477BF] data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Mis Citas
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-[#0477BF] data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Estado de Pago
            </TabsTrigger>
          </TabsList>

          {/* My Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card className="border border-gray-200">
              <div className="p-6">
                <h3 className="text-[#0477BF] mb-6">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre Completo
                    </Label>
                    <p className="text-gray-900 pl-6">{affiliateData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Correo Electrónico
                    </Label>
                    <p className="text-gray-900 pl-6">{affiliateData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </Label>
                    <p className="text-gray-900 pl-6">{affiliateData.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Dirección
                    </Label>
                    <p className="text-gray-900 pl-6">{affiliateData.address}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border border-gray-200">
              <div className="p-6">
                <h3 className="text-[#0477BF] mb-6">Detalles del Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Tipo de Plan
                    </Label>
                    <p className="text-gray-900 pl-6">{affiliateData.planType}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      ID de Membresía
                    </Label>
                    <p className="text-gray-900 pl-6">{affiliateData.membershipId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Inicio
                    </Label>
                    <p className="text-gray-900 pl-6">
                      {new Date(affiliateData.joinDate).toLocaleDateString('es-GT', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Estado</Label>
                    <div className="pl-6">
                      <Badge
                        variant="outline"
                        className={
                          membershipStatus === "Active"
                            ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/10"
                            : "border-red-500 text-red-600 bg-red-50"
                        }
                      >
                        {membershipStatus === "Active" ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="border border-gray-200">
              <div className="p-6">
                <h3 className="text-[#0477BF] mb-4">Próximas Citas</h3>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border border-gray-200 bg-gradient-to-r from-[#0477BF]/5 to-white">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-gray-900 mb-1">{appointment.doctor}</h4>
                              <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                appointment.status === "Confirmada"
                                  ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/10"
                                  : "border-[#2BB9D9] text-[#2BB9D9] bg-[#2BB9D9]/10"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="w-4 h-4 text-[#0477BF]" />
                              <span>
                                {new Date(appointment.date).toLocaleDateString('es-GT', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4 text-[#0477BF]" />
                              <span>{appointment.time}</span>
                            </div>
                            <Badge variant="secondary">{appointment.type}</Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No tienes citas programadas</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Past Appointments */}
            <Card className="border border-gray-200">
              <div className="p-6">
                <h3 className="text-[#0477BF] mb-4">Historial de Citas</h3>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {pastAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border border-gray-200 bg-gray-50">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="text-gray-900 mb-1">{appointment.doctor}</h4>
                              <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-gray-400 text-gray-600 bg-gray-100"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>
                              {new Date(appointment.date).toLocaleDateString('es-GT', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay historial de citas</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Payment Status Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card className="border border-gray-200">
              <div className="p-6">
                <h3 className="text-[#0477BF] mb-6">Estado de Membresía</h3>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#0477BF]/5 to-[#2BB9D9]/5 rounded-lg border-2 border-[#0477BF]/20">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Estado Actual</p>
                    <Badge
                      variant="outline"
                      className={
                        membershipStatus === "Active"
                          ? "border-[#62BF04] text-[#62BF04] bg-[#62BF04]/10 text-lg px-4 py-2"
                          : "border-red-500 text-red-600 bg-red-50 text-lg px-4 py-2"
                      }
                    >
                      {membershipStatus === "Active" ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Activa
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 mr-2" />
                          Inactiva
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Próximo Pago</p>
                    <p className="text-gray-900">15 de noviembre, 2025</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Form - Only shown if inactive */}
            {membershipStatus === "Inactive" && (
              <Card className="border-2 border-[#0477BF]/30">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0477BF' }}>
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[#0477BF]">Reactivar Membresía</h3>
                      <p className="text-sm text-gray-600">Complete los datos de pago para reactivar su membresía</p>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName" className="text-sm text-gray-700 mb-2 block">
                        Nombre en la Tarjeta
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="Nombre completo como aparece en la tarjeta"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-sm text-gray-700 mb-2 block">
                        Número de Tarjeta
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiration" className="text-sm text-gray-700 mb-2 block">
                          Fecha de Vencimiento
                        </Label>
                        <Input
                          id="expiration"
                          placeholder="MM/AA"
                          value={expirationDate}
                          onChange={handleExpirationChange}
                          className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm text-gray-700 mb-2 block">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={handleCvvChange}
                          className="border-gray-300 focus:border-[#0477BF] focus:ring-[#0477BF]"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-[#9DD973]/10 rounded-lg border border-[#9DD973]/30 mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Monto a pagar:</span>
                        <span className="text-2xl text-[#0477BF]">Q1,250.00</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {affiliateData.planType} - Pago mensual
                      </p>
                    </div>

                    <Button
                      onClick={handleReactivateMembership}
                      disabled={isProcessing}
                      className="w-full text-white mt-4"
                      style={{ backgroundColor: '#62BF04' }}
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Procesando Pago...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Reactivar Membresía
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Transacción segura y encriptada
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Active Membership Benefits */}
            {membershipStatus === "Active" && (
              <Card className="border border-gray-200 bg-gradient-to-br from-[#62BF04]/5 to-white">
                <div className="p-6">
                  <h3 className="text-[#0477BF] mb-4">Beneficios de su Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#62BF04] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">Consultas ilimitadas</p>
                        <p className="text-xs text-gray-600">Presenciales y teleconsultas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#62BF04] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">Descuentos en medicamentos</p>
                        <p className="text-xs text-gray-600">Hasta 30% de descuento</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#62BF04] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">Exámenes de laboratorio</p>
                        <p className="text-xs text-gray-600">Precios preferenciales</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#62BF04] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">Atención prioritaria</p>
                        <p className="text-xs text-gray-600">Sin tiempos de espera</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
