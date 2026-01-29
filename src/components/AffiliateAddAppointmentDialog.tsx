import { useState, useEffect } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner@2.0.3";
import { CalendarIcon, Clock, Stethoscope, Video, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { announceToScreenReader } from "./FocusTrap";
import { useAppointmentStore } from "../store/useAppointmentStore";
import { useAuthStore } from "../store/useAuthStore";

// Doctores disponibles para telemedicina - SOLO MEDICINA GENERAL
const doctorsOptions = [
  { id: 1, name: "Dr. Carlos Méndez", specialty: "Medicina General" },
  { id: 2, name: "Dra. Ana García", specialty: "Medicina General" },
  { id: 3, name: "Dr. Roberto Castillo", specialty: "Medicina General" },
  { id: 4, name: "Dra. Patricia Morales", specialty: "Medicina General" },
  { id: 5, name: "Dr. Miguel Santana", specialty: "Medicina General" },
];

// Horarios disponibles de lunes a domingo: 8:00 AM - 8:00 PM
// Citas de videollamada de 20 minutos cada una
const timeSlots = [
  // 8:00 AM - 9:00 AM
  "08:00 AM", "08:20 AM", "08:40 AM",
  // 9:00 AM - 10:00 AM
  "09:00 AM", "09:20 AM", "09:40 AM",
  // 10:00 AM - 11:00 AM
  "10:00 AM", "10:20 AM", "10:40 AM",
  // 11:00 AM - 12:00 PM
  "11:00 AM", "11:20 AM", "11:40 AM",
  // 12:00 PM - 1:00 PM
  "12:00 PM", "12:20 PM", "12:40 PM",
  // 1:00 PM - 2:00 PM
  "01:00 PM", "01:20 PM", "01:40 PM",
  // 2:00 PM - 3:00 PM
  "02:00 PM", "02:20 PM", "02:40 PM",
  // 3:00 PM - 4:00 PM
  "03:00 PM", "03:20 PM", "03:40 PM",
  // 4:00 PM - 5:00 PM
  "04:00 PM", "04:20 PM", "04:40 PM",
  // 5:00 PM - 6:00 PM
  "05:00 PM", "05:20 PM", "05:40 PM",
  // 6:00 PM - 7:00 PM
  "06:00 PM", "06:20 PM", "06:40 PM",
  // 7:00 PM - 8:00 PM
  "07:00 PM", "07:20 PM", "07:40 PM",
  "08:00 PM"
];

// Schema de validación - Solo telemedicina para afiliados
const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Debe seleccionar un médico"),
  date: z.date({ required_error: "Debe seleccionar una fecha" }),
  time: z.string().min(1, "Debe seleccionar una hora"),
  reason: z.string().min(5, "El motivo debe tener al menos 5 caracteres"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AffiliateAddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentAdded?: () => void;
}

export function AffiliateAddAppointmentDialog({ open, onOpenChange, onAppointmentAdded }: AffiliateAddAppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctorsOptions[0] | null>(null);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const watchedDate = watch("date");

  // Announce dialog opening to screen readers
  useEffect(() => {
    if (open) {
      announceToScreenReader('Diálogo de Agendar Videoconsulta abierto', 'polite');
    }
  }, [open]);

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const appointmentId = `CIT-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Obtener información del doctor seleccionado
    const selectedDoctorInfo = doctorsOptions.find(d => d.id.toString() === data.doctorId);
    
    // Crear objeto de cita para el store
    const newAppointment = {
      affiliateId: user?.id || "AF-UNKNOWN",
      affiliateName: `${user?.firstName} ${user?.lastName}` || "Paciente",
      doctorId: data.doctorId,
      doctorName: selectedDoctorInfo?.name || "Doctor",
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      type: "Consulta General" as const,
      status: "Programada" as const,
      hospital: "Telemedicina - Virtual" as any, // Virtual no requiere hospital físico
      notes: `[TELEMEDICINA] ${data.reason}${data.notes ? ` - ${data.notes}` : ""}`,
      createdBy: user?.id || "affiliate-user",
      isVirtual: true, // Flag para identificar citas virtuales
    };
    
    // Guardar en el store
    addAppointment(newAppointment);
    
    const successMessage = `Videoconsulta ${appointmentId} programada para ${format(data.date, "dd 'de' MMMM, yyyy", { locale: es })} a las ${data.time}`;
    
    toast.success("¡Videoconsulta agendada exitosamente! 🎉", {
      description: successMessage + "\n📧 Recibirás el enlace de la videollamada por correo electrónico y SMS",
    });
    
    // Announce to screen readers
    announceToScreenReader(`Videoconsulta agendada exitosamente. ${successMessage}`, 'assertive');
    
    setIsSubmitting(false);
    reset();
    setSelectedDoctor(null);
    onOpenChange(false);
    onAppointmentAdded?.();
  };

  const handleDoctorChange = (doctorId: string) => {
    setValue("doctorId", doctorId);
    const doctor = doctorsOptions.find(d => d.id.toString() === doctorId);
    setSelectedDoctor(doctor || null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0477BF] flex items-center gap-2">
            <Video className="w-6 h-6" />
            Agendar Videoconsulta
          </DialogTitle>
          <DialogDescription>
            Programa una consulta médica virtual con nuestros especialistas
          </DialogDescription>
        </DialogHeader>

        {/* Alerta informativa sobre modalidad */}
        <div className="bg-blue-50 border-l-4 border-[#0477BF] p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#0477BF] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#0477BF] mb-1">
                Modalidad: Telemedicina (Virtual)
              </p>
              <p className="text-sm text-gray-700">
                Como afiliado, puedes solicitar videoconsultas de medicina general de manera inmediata. 
                Para todas las demás citas (presenciales o especialidades), un asesor de Miraflores Plus confirmará tu cita en la fecha y horario solicitado.
              </p>
            </div>
          </div>
        </div>

        {/* Información sobre citas presenciales */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">
                ¿Necesitas coordinar tu cita?
              </p>
              <p className="text-sm text-amber-700">
                Contacta a nuestro equipo de atención al cliente:
              </p>
              <div className="text-sm text-amber-700 mt-2 space-y-1">
                <p className="font-semibold flex items-center gap-2">
                  📞 Miraflores Plus: <span className="text-amber-900">+502 4898-1003</span>
                </p>
                <p className="text-xs">Un asesor confirmará tu cita en la fecha y horario que solicitaste.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Formulario de agendar videoconsulta">
          
          {/* Información del Médico */}
          <div className="space-y-4" role="group" aria-labelledby="doctor-info-heading">
            <h3 id="doctor-info-heading" className="text-[#0477BF] flex items-center gap-2">
              <Stethoscope className="w-5 h-5" aria-hidden="true" />
              Selecciona tu Médico
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="doctorId">
                Médico Especialista <span className="text-red-500" aria-label="campo obligatorio">*</span>
              </Label>
              <Select onValueChange={handleDoctorChange}>
                <SelectTrigger 
                  id="doctorId"
                  className={errors.doctorId ? "border-red-500" : ""}
                  aria-invalid={!!errors.doctorId}
                  aria-describedby={errors.doctorId ? "doctorId-error" : undefined}
                >
                  <SelectValue placeholder="Seleccione un médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsOptions.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{doctor.name}</span>
                        <span className="text-xs text-gray-500">
                          {doctor.specialty} • Disponible para Telemedicina
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && (
                <p id="doctorId-error" className="text-sm text-red-500" role="alert">{errors.doctorId.message}</p>
              )}
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-4" role="group" aria-labelledby="datetime-heading">
            <h3 id="datetime-heading" className="text-[#0477BF] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" aria-hidden="true" />
              Fecha y Hora de la Videoconsulta
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-button">
                  Fecha <span className="text-red-500" aria-label="campo obligatorio">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-button"
                      variant="outline"
                      className={`w-full justify-start text-left ${errors.date ? "border-red-500" : ""}`}
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      aria-label="Seleccionar fecha de videoconsulta"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {watchedDate ? (
                        format(watchedDate, "PPP", { locale: es })
                      ) : (
                        <span className="text-gray-500">Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" role="dialog" aria-label="Calendario para seleccionar fecha">
                    <Calendar
                      mode="single"
                      selected={watchedDate}
                      onSelect={(date) => date && setValue("date", date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p id="date-error" className="text-sm text-red-500" role="alert">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  Hora <span className="text-red-500" aria-label="campo obligatorio">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("time", value)}>
                  <SelectTrigger 
                    id="time"
                    className={errors.time ? "border-red-500" : ""}
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? "time-error" : undefined}
                  >
                    <SelectValue placeholder="Seleccione una hora" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p id="time-error" className="text-sm text-red-500" role="alert">{errors.time.message}</p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Duración: 20 minutos • Horario: 8:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Motivo y Notas */}
          <div className="space-y-4" role="group" aria-labelledby="reason-notes-heading">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Motivo de Consulta <span className="text-red-500" aria-label="campo obligatorio">*</span>
              </Label>
              <Input
                id="reason"
                placeholder="Ej: Control de presión arterial, dolor abdominal, consulta general..."
                {...register("reason")}
                className={errors.reason ? "border-red-500" : ""}
                aria-invalid={!!errors.reason}
                aria-describedby={errors.reason ? "reason-error" : undefined}
              />
              {errors.reason && (
                <p id="reason-error" className="text-sm text-red-500" role="alert">{errors.reason.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Síntomas o Información Adicional (Opcional)</Label>
              <textarea
                id="notes"
                {...register("notes")}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0477BF] focus:border-transparent resize-none"
                placeholder="Describe tus síntomas o cualquier información relevante para el médico..."
                aria-label="Notas adicionales para la videoconsulta"
              />
            </div>
          </div>

          {/* Recordatorio sobre el enlace */}
          <div className="bg-green-50 border-l-4 border-[#62BF04] p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-[#62BF04] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#62BF04] mb-1">
                  📹 Enlace de Videollamada
                </p>
                <p className="text-sm text-gray-700">
                  Una vez confirmada tu cita, recibirás el enlace de videollamada por correo electrónico y SMS 
                  para unirte a la videoconsulta a la hora programada.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
                setSelectedDoctor(null);
              }}
              disabled={isSubmitting}
              aria-label="Cancelar y cerrar diálogo"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white"
              disabled={isSubmitting}
              aria-label={isSubmitting ? "Agendando videoconsulta, por favor espere" : "Agendar videoconsulta"}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Agendando..." : "Agendar Videoconsulta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}