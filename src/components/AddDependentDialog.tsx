import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Users, User, Calendar, AlertCircle, Link2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { useFocusTrap, announceToScreenReader } from "./FocusTrap";

// Lista de afiliados titulares disponibles (en producción vendría de la base de datos)
const affiliatesOptions = [
  { id: "AF-2586", name: "María González", plan: "Premium" },
  { id: "AF-2585", name: "Carlos Rodríguez", plan: "Básico" },
  { id: "AF-2584", name: "Ana Martínez", plan: "Premium" },
  { id: "AF-2583", name: "Juan Pérez", plan: "Estándar" },
];

// Schema de validación para Dependiente
const dependentSchema = z.object({
  // Afiliado Titular (Obligatorio)
  affiliateId: z.string().min(1, "Debe seleccionar el afiliado titular"),
  
  // Información Personal del Dependiente
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dpi: z.string()
    .optional()
    .refine((val) => !val || val.length === 13, {
      message: "DPI debe tener 13 dígitos si se proporciona"
    }),
  dateOfBirth: z.string().min(1, "Debe seleccionar la fecha de nacimiento"),
  gender: z.enum(["Masculino", "Femenino", "Otro"], {
    required_error: "Debe seleccionar el género"
  }),
  
  // Relación con el titular
  relationship: z.enum(["Cónyuge", "Hijo/a", "Padre/Madre", "Hermano/a", "Otro"], {
    required_error: "Debe especificar la relación"
  }),
  relationshipOther: z.string().optional(),
  
  // Información de Contacto (opcional para menores)
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string()
    .optional()
    .refine((val) => !val || val.match(/^\+502 [0-9]{4}-[0-9]{4}$/), {
      message: "Formato: +502 XXXX-XXXX"
    })
    .or(z.literal("")),
}).refine((data) => {
  // Si la relación es "Otro", debe especificar
  if (data.relationship === "Otro" && !data.relationshipOther) {
    return false;
  }
  return true;
}, {
  message: "Debe especificar la relación",
  path: ["relationshipOther"]
});

type DependentFormData = z.infer<typeof dependentSchema>;

interface AddDependentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedAffiliateId?: string; // Puede venir preseleccionado desde la página de afiliados
  onDependentAdded?: () => void;
}

export function AddDependentDialog({ 
  open, 
  onOpenChange, 
  preselectedAffiliateId,
  onDependentAdded 
}: AddDependentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<DependentFormData>({
    resolver: zodResolver(dependentSchema),
    defaultValues: {
      affiliateId: preselectedAffiliateId || "",
    }
  });

  const watchedAffiliateId = watch("affiliateId");
  const watchedRelationship = watch("relationship");
  const selectedAffiliate = affiliatesOptions.find(a => a.id === watchedAffiliateId);

  // Announce dialog opening to screen readers
  useEffect(() => {
    if (open) {
      announceToScreenReader('Diálogo de Agregar Dependiente abierto', 'polite');
    }
  }, [open]);

  const onSubmit = async (data: DependentFormData) => {
    setIsSubmitting(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const dependentId = `DEP-${Math.floor(1000 + Math.random() * 9000)}`;
    const affiliate = affiliatesOptions.find(a => a.id === data.affiliateId);
    
    toast.success("¡Dependiente agregado exitosamente!", {
      description: `${data.firstName} ${data.lastName} vinculado a ${affiliate?.name} (${data.affiliateId})`,
      duration: 5000,
    });
    
    announceToScreenReader(`Dependiente agregado exitosamente. ${data.firstName} ${data.lastName} vinculado a ${affiliate?.name}`, 'assertive');
    
    setIsSubmitting(false);
    reset();
    onOpenChange(false);
    onDependentAdded?.();
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = watch("dateOfBirth") ? calculateAge(watch("dateOfBirth")) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-[#0477BF] flex items-center gap-2">
              <Users className="w-6 h-6" aria-hidden="true" />
              Agregar Dependiente
            </DialogTitle>
            <DialogDescription>
              Los dependientes deben estar vinculados a un afiliado titular activo
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-6" aria-label="Formulario de agregar dependiente">
          {/* Alerta de Vinculación Requerida */}
          <Alert className="bg-blue-50 border-blue-200">
            <Link2 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Importante:</strong> Todo dependiente debe estar vinculado a un afiliado titular. 
              El dependiente compartirá el mismo plan de salud del titular.
            </AlertDescription>
          </Alert>

          {/* Selección de Afiliado Titular */}
          <div className="space-y-4">
            <h3 className="text-[#0477BF] flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Vinculación con Afiliado Titular
            </h3>

            <div className="space-y-2">
              <Label htmlFor="affiliateId">
                Afiliado Titular <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={watchedAffiliateId}
                onValueChange={(value) => setValue("affiliateId", value)}
                disabled={!!preselectedAffiliateId}
              >
                <SelectTrigger className={errors.affiliateId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccione el afiliado titular" />
                </SelectTrigger>
                <SelectContent>
                  {affiliatesOptions.map((affiliate) => (
                    <SelectItem key={affiliate.id} value={affiliate.id}>
                      <div className="flex flex-col">
                        <span>{affiliate.name}</span>
                        <span className="text-xs text-gray-500">
                          {affiliate.id} - Plan {affiliate.plan}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.affiliateId && (
                <p className="text-sm text-red-500">{errors.affiliateId.message}</p>
              )}
              
              {selectedAffiliate && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-700">
                    ✓ El dependiente quedará cubierto bajo el <strong>Plan {selectedAffiliate.plan}</strong> de {selectedAffiliate.name}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">
                Relación con el Titular <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value: any) => setValue("relationship", value)}>
                <SelectTrigger className={errors.relationship ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccione la relación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cónyuge">Cónyuge</SelectItem>
                  <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                  <SelectItem value="Padre/Madre">Padre/Madre</SelectItem>
                  <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.relationship && (
                <p className="text-sm text-red-500">{errors.relationship.message}</p>
              )}
            </div>

            {watchedRelationship === "Otro" && (
              <div className="space-y-2">
                <Label htmlFor="relationshipOther">
                  Especifique la Relación <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="relationshipOther"
                  placeholder="Ej: Sobrino, Primo, Tutelado..."
                  {...register("relationshipOther")}
                  className={errors.relationshipOther ? "border-red-500" : ""}
                />
                {errors.relationshipOther && (
                  <p className="text-sm text-red-500">{errors.relationshipOther.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Información Personal del Dependiente */}
          <div className="space-y-4">
            <h3 className="text-[#0477BF] flex items-center gap-2">
              <User className="w-5 h-5" />
              Información del Dependiente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombres <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="María José"
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellidos <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="García López"
                  {...register("lastName")}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dpi">
                  DPI (Opcional para menores)
                </Label>
                <Input
                  id="dpi"
                  placeholder="1234567890123"
                  maxLength={13}
                  {...register("dpi")}
                  className={errors.dpi ? "border-red-500" : ""}
                />
                {errors.dpi && (
                  <p className="text-sm text-red-500">{errors.dpi.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Solo si es mayor de edad
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
                {age !== null && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {age} {age === 1 ? "año" : "años"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Género <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value: "Masculino" | "Femenino" | "Otro") => setValue("gender", value)}>
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto (Opcional) */}
          <div className="space-y-4">
            <h3 className="text-[#0477BF]">
              Información de Contacto (Opcional)
            </h3>
            <p className="text-sm text-gray-600">
              Para menores de edad, se usará la información del titular
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+502 1234-5678"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Importante */}
          {age !== null && age < 18 && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>Menor de edad detectado:</strong> Los servicios médicos requerirán autorización 
                del titular o tutor legal. Las notificaciones se enviarán al titular.
              </AlertDescription>
            </Alert>
          )}

          </form>
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
              aria-label="Cancelar y cerrar diálogo"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-[#0477BF] hover:bg-[#0477BF]/90 text-white"
              disabled={isSubmitting || !watchedAffiliateId}
              aria-label={isSubmitting ? "Agregando dependiente, por favor espere" : "Agregar dependiente"}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Agregando..." : "Agregar Dependiente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
