import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Clock, User, Stethoscope, Building, Video, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { announceToScreenReader, useFocusTrap } from "./FocusTrap";
import { useAppointmentStore } from "../store/useAppointmentStore";

// Datos de ejemplo - en producción vendrían de la base de datos
const affiliatesOptions = [
  { id: "AF-2586", name: "María González" },
  { id: "AF-2585", name: "Carlos Rodríguez" },
  { id: "AF-2584", name: "Ana Martínez" },
  { id: "AF-2583", name: "Juan Pérez" },
];

const doctorsOptions = [
  { id: 1, name: "Dr. Carlos Méndez", specialty: "Medicina General", branch: "Hospital Miraflores Zona 10" },
  { id: 2, name: "Dra. Ana García", specialty: "Medicina General", branch: "Hospital Miraflores Roosevelt" },
  { id: 3, name: "Dr. Fernando Ruiz", specialty: "Cardiología", branch: "Hospital Miraflores Zona 10" },
  { id: 4, name: "Dra. Patricia Morales", specialty: "Pediatría", branch: "Hospital Miraflores Zona 10" },
  { id: 5, name: "Dr. Miguel Santana", specialty: "Traumatología", branch: "Hospital Miraflores Roosevelt" },
];

const branchesOptions = [
  "Hospital Miraflores Zona 10",
  "Hospital Miraflores Roosevelt"
];

// Horarios disponibles de lunes a domingo: 8:00 AM - 8:00 PM
// Citas de 20 minutos cada una
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

// Schema de validación con Zod
const appointmentSchema = z.object({
  affiliateId: z.string().min(1, "Debe seleccionar un afiliado"),
  doctorId: z.string().min(1, "Debe seleccionar un médico"),
  branch: z.string().min(1, "Debe seleccionar una sede"),
  date: z.date({ required_error: "Debe seleccionar una fecha" }),
  time: z.string().min(1, "Debe seleccionar una hora"),
  type: z.enum(["Presencial", "Telemedicina"], {
    required_error: "Debe seleccionar el tipo de cita"
  }),
  reason: z.string().min(5, "El motivo debe tener al menos 5 caracteres"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentAdded?: () => void;
}

export function AddAppointmentDialog({ open, onOpenChange, onAppointmentAdded }: AddAppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctorsOptions[0] | null>(null);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);

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
  const watchedType = watch("type");

  // Announce dialog opening to screen readers
  useEffect(() => {
    if (open) {
      announceToScreenReader('Diálogo de Agendar Nueva Cita abierto', 'polite');
    }
  }, [open]);

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const appointmentId = `CIT-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Obtener información del afiliado y doctor seleccionados
    const selectedAffiliate = affiliatesOptions.find(a => a.id === data.affiliateId);
    const selectedDoctorInfo = doctorsOptions.find(d => d.id.toString() === data.doctorId);
    
    // REGLAS DE NEGOCIO:
    // - Telemedicina + Medicina General = Agendamiento inmediato (Programada)
    // - Presencial + Medicina General = Requiere confirmación (Pendiente Confirmación)
    // - Cualquier especialidad = Requiere confirmación (Pendiente Confirmación)
    
    const isGeneralMedicine = selectedDoctorInfo?.specialty === "Medicina General";
    const isTelemedicine = data.type === "Telemedicina";
    const requiresConfirmation = !isTelemedicine || !isGeneralMedicine;
    
    // Estado inicial de la cita según reglas
    const initialStatus = requiresConfirmation ? "Pendiente Confirmación" as const : "Programada" as const;
    
    // Mapear el tipo de cita del formulario al tipo del store
    const appointmentType = selectedDoctorInfo?.specialty === "Medicina General"
      ? "Consulta General" as const
      : "Especialista" as const;
    
    // Hospital para telemedicina vs presencial
    const hospital = isTelemedicine 
      ? "Telemedicina - Virtual" as any
      : data.branch as "Hospital Miraflores Roosevelt" | "Hospital Miraflores Zona 10";
    
    // Crear objeto de cita para el store
    const newAppointment = {
      affiliateId: data.affiliateId,
      affiliateName: selectedAffiliate?.name || "Paciente",
      doctorId: data.doctorId,
      doctorName: selectedDoctorInfo?.name || "Doctor",
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      type: appointmentType,
      status: initialStatus,
      hospital: hospital,
      notes: `${isTelemedicine ? '[TELEMEDICINA]' : '[PRESENCIAL]'} ${data.reason}${data.notes ? ` - ${data.notes}` : ""}`,
      createdBy: "current-user", // En producción vendría del usuario actual
      isVirtual: isTelemedicine,
      specialty: selectedDoctorInfo?.specialty,
      requiresConfirmation: requiresConfirmation,
    };
    
    // Guardar en el store
    addAppointment(newAppointment);
    
    const successMessage = `Cita ${appointmentId} para ${format(data.date, "dd 'de' MMMM, yyyy", { locale: es })} a las ${data.time}`;
    
    if (requiresConfirmation) {
      toast.success("Solicitud de cita enviada", {
        description: `${successMessage}\n⏳ Un asesor de atención al cliente confirmará tu cita pronto`,
      });
    } else {
      toast.success("¡Videoconsulta agendada exitosamente! 🎉", {
        description: `${successMessage}\n📧 Recibirás el enlace de videollamada por correo y SMS`,
      });
    }
    
    // Announce to screen readers
    announceToScreenReader(
      requiresConfirmation 
        ? `Solicitud de cita enviada. ${successMessage}. Un asesor confirmará tu cita pronto.`
        : `Cita agendada exitosamente. ${successMessage}`,
      'assertive'
    );
    
    setIsSubmitting(false);
    reset();
    setSelectedDoctor(null);
    onOpenChange(false);
    onAppointmentAdded?.();
  };

  const handleDoctorChange = (doctorId: string) => {
    setValue("doctorId", doctorId); // Importante: actualizar el valor en el formulario
    const doctor = doctorsOptions.find(d => d.id.toString() === doctorId);
    setSelectedDoctor(doctor || null);
    if (doctor) {
      setValue("branch", doctor.branch);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0477BF]">
            Agendar Nueva Cita
          </DialogTitle>
          <DialogDescription>
            Complete los datos para programar una cita médica
          </DialogDescription>
        </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Formulario de agendar cita">
          {/* Información del Paciente */}
          <div className="space-y-4" role="group" aria-labelledby="patient-info-heading">
            <h3 id="patient-info-heading" className="text-[#0477BF] flex items-center gap-2">
              <User className="w-5 h-5" aria-hidden="true" />
              Información del Paciente
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="affiliateId">
                Afiliado / Paciente <span className="text-red-500" aria-label="campo obligatorio">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("affiliateId", value)}>
                <SelectTrigger 
                  id="affiliateId"
                  className={errors.affiliateId ? "border-red-500" : ""}
                  aria-invalid={!!errors.affiliateId}
                  aria-describedby={errors.affiliateId ? "affiliateId-error" : undefined}
                >
                  <SelectValue placeholder="Seleccione un afiliado" />
                </SelectTrigger>
                <SelectContent>
                  {affiliatesOptions.map((affiliate) => (
                    <SelectItem key={affiliate.id} value={affiliate.id}>
                      {affiliate.name} - {affiliate.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.affiliateId && (
                <p id="affiliateId-error" className="text-sm text-red-500" role="alert">
                  {errors.affiliateId.message}
                </p>
              )}
            </div>
          </div>

          {/* Información del Médico */}
          <div className="space-y-4" role="group" aria-labelledby="doctor-info-heading">
            <h3 id="doctor-info-heading" className="text-[#0477BF] flex items-center gap-2">
              <Stethoscope className="w-5 h-5" aria-hidden="true" />
              Información del Médico
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="doctorId">
                Médico <span className="text-red-500" aria-label="campo obligatorio">*</span>
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
                        <span>{doctor.name}</span>
                        <span className="text-xs text-gray-500">
                          {doctor.specialty} - {doctor.branch}
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

            <div className="space-y-2">
              <Label htmlFor="branch">
                Sede <span className="text-red-500" aria-label="campo obligatorio">*</span>
              </Label>
              <Select 
                value={watch("branch")}
                onValueChange={(value) => setValue("branch", value)}
                disabled={!!selectedDoctor}
              >
                <SelectTrigger 
                  id="branch"
                  className={errors.branch ? "border-red-500" : ""}
                  aria-invalid={!!errors.branch}
                  aria-describedby={errors.branch ? "branch-error" : selectedDoctor ? "branch-note" : undefined}
                >
                  <SelectValue placeholder="Seleccione una sede" />
                </SelectTrigger>
                <SelectContent>
                  {branchesOptions.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDoctor && (
                <p id="branch-note" className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  Sede asignada automáticamente según el médico seleccionado
                </p>
              )}
              {errors.branch && (
                <p id="branch-error" className="text-sm text-red-500" role="alert">{errors.branch.message}</p>
              )}
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-4" role="group" aria-labelledby="datetime-heading">
            <h3 id="datetime-heading" className="text-[#0477BF] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" aria-hidden="true" />
              Fecha y Hora
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
                      aria-label="Seleccionar fecha de cita"
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
              </div>
            </div>
          </div>

          {/* Tipo de Cita */}
          <div className="space-y-4" role="group" aria-labelledby="type-heading">
            <h3 id="type-heading" className="text-[#0477BF] flex items-center gap-2">
              <Building className="w-5 h-5" aria-hidden="true" />
              Tipo de Atención
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="type">
                Modalidad <span className="text-red-500" aria-label="campo obligatorio">*</span>
              </Label>
              <Select onValueChange={(value: "Presencial" | "Telemedicina") => setValue("type", value)}>
                <SelectTrigger 
                  id="type"
                  className={errors.type ? "border-red-500" : ""}
                  aria-invalid={!!errors.type}
                  aria-describedby={errors.type ? "type-error" : undefined}
                >
                  <SelectValue placeholder="Seleccione el tipo de cita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" aria-hidden="true" />
                      Presencial
                    </div>
                  </SelectItem>
                  <SelectItem value="Telemedicina">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" aria-hidden="true" />
                      Telemedicina (Video Llamada)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p id="type-error" className="text-sm text-red-500" role="alert">{errors.type.message}</p>
              )}
              
              {watchedType === "Telemedicina" && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3" role="status" aria-live="polite">
                  <p className="text-sm text-blue-700">
                    📹 Se enviará un enlace de videollamada por correo electrónico y SMS al paciente
                  </p>
                </div>
              )}
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
                placeholder="Ej: Control de presión arterial, dolor abdominal..."
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
              <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
              <textarea
                id="notes"
                {...register("notes")}
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0477BF] focus:border-transparent resize-none"
                placeholder="Información adicional relevante para la cita..."
                aria-label="Notas adicionales para la cita"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              aria-label="Cancelar y cerrar diálogo"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white"
              disabled={isSubmitting}
              aria-label={isSubmitting ? "Agendando cita, por favor espere" : "Agendar cita"}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Agendando..." : "Agendar Cita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}