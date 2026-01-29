import { useState, useEffect } from "react";
import { useForm } from "react-hook-form@7.55.0";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../utils/clipboard";
import { 
  User, Mail, Phone, MapPin, CreditCard, Calendar, 
  Trash2, Plus, Check, Lock, HelpCircle, Users, FileText, 
  PartyPopper, Eye, Copy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { QuetzalIcon } from "./ui/quetzal-icon";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ============================================
// CONSTANTES
// ============================================

const PRICES = {
  titular: 85,      // Q85.00
  dependiente: 49   // Q49.00 por cada uno
};

// Contador inicial de afiliados (inicia en 1051 para dar impresión de negocio establecido)
const INITIAL_AFFILIATE_NUMBER = 1051;

// Función para obtener el siguiente número de afiliado
const getNextAffiliateNumber = (): number => {
  const stored = localStorage.getItem('miraflores_affiliate_counter');
  if (!stored) {
    return INITIAL_AFFILIATE_NUMBER;
  }
  return parseInt(stored, 10);
};

// Función para incrementar el contador
const incrementAffiliateCounter = (): void => {
  const current = getNextAffiliateNumber();
  localStorage.setItem('miraflores_affiliate_counter', (current + 1).toString());
};

// Función para generar ID de afiliado
const generateAffiliateId = (): string => {
  const number = getNextAffiliateNumber();
  const year = new Date().getFullYear();
  const paddedNumber = number.toString().padStart(7, '0'); // 0001051
  return `AMP-${year}-${paddedNumber}`;
};

// Función para generar contraseña temporal segura
const generateSecurePassword = (): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%&*';
  
  let password = '';
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));
  
  // Agregar 4 caracteres aleatorios más
  const allChars = uppercase + lowercase + numbers;
  for (let i = 0; i < 4; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Mezclar caracteres
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const DEPARTMENTS = [
  'Guatemala', 'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula',
  'El Progreso', 'Escuintla', 'Huehuetenango', 'Izabal', 'Jalapa',
  'Jutiapa', 'Petén', 'Quetzaltenango', 'Quiché', 'Retalhuleu',
  'Sacatepéquez', 'San Marcos', 'Santa Rosa', 'Sololá', 'Suchitepéquez',
  'Totonicapán', 'Zacapa'
];

const PARENTESCO_OPTIONS = [
  'Cónyuge',
  'Hijo/a',
  'Padre/Madre',
  'Otro'
];

// Tokens de BAC Credomatic por número de dependientes
const PAYMENT_TOKENS: Record<number, string> = {
  0: 'MzM3ZDUxMTA2YTYxNzk2ZGYzNzU3OC4xNzY4MjQwNzU3',           // Q85
  1: 'LjgzNjg5MzU1OTI3OWI3ODc1MzYzNjcxNzY4MjQwNzIy',           // Q134
  2: 'NjZkNTM3NDMzNjE2YS4yZTU3Mzk2MzYxNzY4MjQwOTQ3',           // Q183
  3: 'NzUzMzVhNTM0NjgwNjgzMTYuOTU2NTYxNzY4MjQwOTgy',           // Q232
  4: 'NzJiNjUzOTM5ZDg2ODUxNjA1NS43OTYxNzY4MjQxMDI5',           // Q281
  5: 'OTAwLjBhMTI1NjQzNzc1ZjgxNjU4NjAxNzY4MjQxMDYz',           // Q330
  6: 'NWYzNGI1LjExMDU3OTMwZTY3NTY3MzYxNzY4MjQxMDg2'            // Q379
};

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

// Paso 1: Datos Personales
const step1Schema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dateOfBirth: z.string().min(1, 'Selecciona tu fecha de nacimiento').refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, 'Debes ser mayor de 18 años'),
  dpi: z.string().regex(/^\d{4}\s\d{5}\s\d{4}$/, 'Formato: 0000 00000 0000'),
  phone: z.string().regex(/^\+502\s\d{4}-\d{4}$/, 'Formato: +502 0000-0000'),
  email: z.string().email('Correo electrónico inválido')
});

// Paso 2: Dirección
const step2Schema = z.object({
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  department: z.string().min(1, 'Selecciona un departamento'),
  municipality: z.string().min(2, 'Ingresa el municipio')
});

// Dependiente individual
const dependentSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  fechaNacimiento: z.string().min(1, 'Selecciona la fecha de nacimiento'),
  parentesco: z.string().min(1, 'Selecciona el parentesco'),
  dpi: z.string().optional()
}).refine((data) => {
  // Si no hay DPI, no validar
  if (!data.dpi || data.dpi.trim() === '') return true;
  
  // Si hay DPI, debe tener formato correcto
  return /^\d{4}\s\d{5}\s\d{4}$/.test(data.dpi);
}, {
  message: 'Formato de DPI inválido: 0000 00000 0000',
  path: ['dpi']
}).refine((data) => {
  // Calcular edad
  const birthDate = new Date(data.fechaNacimiento);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const isOver18 = age > 18 || (age === 18 && monthDiff >= 0);
  
  // Si es mayor de 18, DPI es requerido
  if (isOver18 && (!data.dpi || data.dpi.trim() === '')) {
    return false;
  }
  
  return true;
}, {
  message: 'El DPI es requerido para mayores de 18 años',
  path: ['dpi']
});

// Paso 3: Dependientes
const step3Schema = z.object({
  dependientes: z.array(dependentSchema).max(6, 'Máximo 6 dependientes')
});

// Paso 4: Contrato y Aceptación
const step4Schema = z.object({
  aceptaContrato: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar el contrato para continuar'
  }),
  iniciales: z.string().min(2, 'Ingresa tus iniciales (mínimo 2 caracteres)').max(10, 'Máximo 10 caracteres')
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Dependent = z.infer<typeof dependentSchema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

interface AddAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function AddAffiliateDialog({ open, onOpenChange }: AddAffiliateDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step4Data, setStep4Data] = useState<Step4Data | null>(null);
  const [dependientes, setDependientes] = useState<Dependent[]>([]);

  // Cargar draft desde localStorage
  useEffect(() => {
    if (open) {
      const draft = localStorage.getItem('miraflores_form_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (window.confirm('¿Deseas continuar con tu solicitud anterior?')) {
            setStep1Data(parsed.step1Data || null);
            setStep2Data(parsed.step2Data || null);
            setDependientes(parsed.dependientes || []);
            setCurrentStep(parsed.currentStep || 1);
          } else {
            localStorage.removeItem('miraflores_form_draft');
          }
        } catch (e) {
          console.error('Error loading draft:', e);
        }
      }
    }
  }, [open]);

  // Guardar draft en localStorage
  useEffect(() => {
    if (open && (step1Data || step2Data || dependientes.length > 0)) {
      localStorage.setItem('miraflores_form_draft', JSON.stringify({
        step1Data,
        step2Data,
        dependientes,
        currentStep
      }));
    }
  }, [step1Data, step2Data, dependientes, currentStep, open]);

  const totalCost = PRICES.titular + (dependientes.length * PRICES.dependiente);

  const handleClose = () => {
    if (step1Data || step2Data || dependientes.length > 0) {
      if (window.confirm('¿Estás seguro de cerrar? Se guardará tu progreso.')) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <div className="px-6 pt-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle className="text-[#00A3D7] text-2xl">
                Afiliación MirafloresPlus
              </DialogTitle>
              <DialogDescription className="text-[#7AC943] italic">
                Dale un Plus a tu año
              </DialogDescription>
            </DialogHeader>

            {/* Stepper Visual */}
            <div className="mt-6 flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: 'Personal', icon: User },
                { num: 2, label: 'Dirección', icon: MapPin },
                { num: 3, label: 'Dependientes', icon: Users },
                { num: 4, label: 'Contrato', icon: FileText }
              ].map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;
                
                return (
                  <div key={step.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold
                          transition-all duration-300
                          ${isCompleted ? 'bg-[#7AC943] text-white' : ''}
                          ${isActive ? 'bg-[#00A3D7] text-white scale-110' : ''}
                          ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                        `}
                      >
                        {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <span className={`text-xs mt-2 ${isActive ? 'text-[#00A3D7] font-semibold' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${currentStep > step.num ? 'bg-[#7AC943]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {currentStep === 1 && (
              <Step1Form 
                onNext={(data) => {
                  setStep1Data(data);
                  setCurrentStep(2);
                }} 
                initialData={step1Data} 
              />
            )}
            {currentStep === 2 && (
              <Step2Form 
                onNext={(data) => {
                  setStep2Data(data);
                  setCurrentStep(3);
                }} 
                onBack={() => setCurrentStep(1)} 
                initialData={step2Data} 
              />
            )}
            {currentStep === 3 && (
              <Step3Form 
                dependientes={dependientes}
                setDependientes={setDependientes}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 4 && step1Data && step2Data && (
              <Step4Form 
                onNext={(data) => {
                  setStep4Data(data);
                  setShowWelcomeModal(true);
                }}
                onBack={() => setCurrentStep(3)}
                initialData={step4Data}
                step1Data={step1Data}
                totalCost={totalCost}
              />
            )}
          </div>

          {/* Footer con ayuda */}
          <div className="px-6 py-3 border-t bg-gray-50 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Tus datos están protegidos
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                ¿Necesitas ayuda? +502 4898-1003
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Bienvenida */}
      {showWelcomeModal && step1Data && step2Data && step4Data && (
        <WelcomeModal
          open={showWelcomeModal}
          onClose={() => {
            setShowWelcomeModal(false);
            onOpenChange(false);
          }}
          step1Data={step1Data}
          step2Data={step2Data}
          step4Data={step4Data}
          dependientes={dependientes}
          totalCost={totalCost}
        />
      )}
    </>
  );
}

// ============================================
// STEP 1: DATOS PERSONALES
// ============================================

interface Step1FormProps {
  onNext: (data: Step1Data) => void;
  initialData: Step1Data | null;
}

function Step1Form({ onNext, initialData }: Step1FormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData || undefined
  });

  // Auto-formatear DPI mientras escribe
  const handleDPIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    
    if (value.length >= 4) {
      value = value.slice(0, 4) + ' ' + value.slice(4);
    }
    if (value.length >= 10) {
      value = value.slice(0, 10) + ' ' + value.slice(10);
    }
    
    setValue('dpi', value);
    e.target.value = value;
  };

  // Auto-formatear teléfono
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = '+502 ';
    if (value.length > 3) {
      formatted += value.slice(3, 7);
      if (value.length > 7) {
        formatted += '-' + value.slice(7, 11);
      }
    } else if (value.length > 0) {
      formatted += value.slice(3);
    }
    
    setValue('phone', formatted);
    e.target.value = formatted;
  };

  const onSubmit = (data: Step1Data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit((data) => { onNext(data); })} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#00A3D7] mb-4">Datos Personales del Titular</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombres */}
          <div className="space-y-2">
            <Label htmlFor="firstName">
              Nombre(s) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="firstName"
                placeholder="Juan Carlos"
                className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                {...register('firstName')}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          {/* Apellidos */}
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Apellido(s) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="lastName"
                placeholder="García López"
                className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                {...register('lastName')}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="dateOfBirth"
                type="date"
                className={`pl-10 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                {...register('dateOfBirth')}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* DPI */}
          <div className="space-y-2">
            <Label htmlFor="dpi">
              DPI <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="dpi"
                placeholder="1234 56789 0123"
                className={`pl-10 ${errors.dpi ? 'border-red-500' : ''}`}
                {...register('dpi')}
                onChange={handleDPIChange}
              />
            </div>
            {errors.dpi && (
              <p className="text-sm text-red-600">{errors.dpi.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                placeholder="+502 0000-0000"
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                {...register('phone')}
                onChange={handlePhoneChange}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Correo Electrónico <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit"
          className="bg-[#00A3D7] hover:bg-[#0092c4] text-white"
        >
          Siguiente: Dirección →
        </Button>
      </div>
    </form>
  );
}

// ============================================
// STEP 2: DIRECCIÓN
// ============================================

interface Step2FormProps {
  onNext: (data: Step2Data) => void;
  onBack: () => void;
  initialData: Step2Data | null;
}

function Step2Form({ onNext, onBack, initialData }: Step2FormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData || undefined
  });

  const onSubmit = (data: Step2Data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit((data) => { onNext(data); })} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#00A3D7] mb-4">Dirección Completa</h3>
        
        {/* Dirección */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="address">
            Dirección <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Textarea
              id="address"
              placeholder="Calle, número, colonia, zona..."
              rows={3}
              className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
              {...register('address')}
            />
          </div>
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departamento */}
          <div className="space-y-2">
            <Label htmlFor="department">
              Departamento <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(value) => setValue('department', value)}>
              <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona departamento" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          {/* Municipio */}
          <div className="space-y-2">
            <Label htmlFor="municipality">
              Municipio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="municipality"
              placeholder="Guatemala, Antigua..."
              className={errors.municipality ? 'border-red-500' : ''}
              {...register('municipality')}
            />
            {errors.municipality && (
              <p className="text-sm text-red-600">{errors.municipality.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
        >
          ← Anterior
        </Button>
        <Button 
          type="submit"
          className="bg-[#00A3D7] hover:bg-[#0092c4] text-white"
        >
          Siguiente: Dependientes →
        </Button>
      </div>
    </form>
  );
}

// ============================================
// STEP 3: DEPENDIENTES
// ============================================

interface Step3FormProps {
  dependientes: Dependent[];
  setDependientes: (deps: Dependent[]) => void;
  onBack: () => void;
  onNext: () => void;
}

function Step3Form({ dependientes, setDependientes, onBack, onNext }: Step3FormProps) {
  const totalCost = PRICES.titular + (dependientes.length * PRICES.dependiente);

  const addDependent = () => {
    if (dependientes.length >= 6) {
      toast.error('Máximo 6 dependientes permitidos');
      return;
    }
    setDependientes([...dependientes, {
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      parentesco: '',
      dpi: ''
    }]);
  };

  const removeDependent = (index: number) => {
    if (window.confirm('¿Eliminar este dependiente?')) {
      setDependientes(dependientes.filter((_, i) => i !== index));
    }
  };

  const updateDependent = (index: number, field: keyof Dependent, value: string) => {
    const updated = [...dependientes];
    updated[index] = { ...updated[index], [field]: value };
    setDependientes(updated);
  };

  const handleContinue = () => {
    // Validar dependientes si hay alguno
    if (dependientes.length > 0) {
      const hasErrors = dependientes.some(dep => 
        !dep.nombre || !dep.apellido || !dep.fechaNacimiento || !dep.parentesco
      );
      
      if (hasErrors) {
        toast.error('Completa todos los datos de los dependientes');
        return;
      }
    }
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#00A3D7] mb-2">Agregar Dependientes (Opcional)</h3>
        <p className="text-sm text-gray-600">Puedes agregar hasta 6 dependientes. Cada uno tiene un costo de Q{PRICES.dependiente}.00/mes</p>
      </div>

      {/* Lista de Dependientes */}
      <div className="space-y-4">
        {dependientes.map((dep, index) => (
          <Card key={index} className="border-2 border-[#7AC943]/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#00A3D7]">
                  Dependiente {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDependent(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input
                    placeholder="Nombre del dependiente"
                    value={dep.nombre}
                    onChange={(e) => updateDependent(index, 'nombre', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Apellido *</Label>
                  <Input
                    placeholder="Apellido del dependiente"
                    value={dep.apellido}
                    onChange={(e) => updateDependent(index, 'apellido', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Nacimiento *</Label>
                  <Input
                    type="date"
                    value={dep.fechaNacimiento}
                    onChange={(e) => updateDependent(index, 'fechaNacimiento', e.target.value)}
                  />
                  {dep.fechaNacimiento && (() => {
                    const birthDate = new Date(dep.fechaNacimiento);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    return (
                      <p className="text-xs text-gray-500">
                        Edad: {age} años {age < 18 ? '(Menor de edad - DPI no requerido)' : '(Mayor de edad - DPI requerido)'}
                      </p>
                    );
                  })()}
                </div>
                <div className="space-y-2">
                  <Label>Parentesco *</Label>
                  <Select 
                    value={dep.parentesco}
                    onValueChange={(value) => updateDependent(index, 'parentesco', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARENTESCO_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    DPI {(() => {
                      if (!dep.fechaNacimiento) return '';
                      const birthDate = new Date(dep.fechaNacimiento);
                      const today = new Date();
                      const age = today.getFullYear() - birthDate.getFullYear();
                      return age >= 18 ? <span className="text-red-500">*</span> : '(Opcional para menores)';
                    })()}
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="1234 56789 0123"
                      value={dep.dpi || ''}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, '');
                        if (value.length > 13) value = value.slice(0, 13);
                        
                        if (value.length >= 4) {
                          value = value.slice(0, 4) + ' ' + value.slice(4);
                        }
                        if (value.length >= 10) {
                          value = value.slice(0, 10) + ' ' + value.slice(10);
                        }
                        
                        updateDependent(index, 'dpi', value);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botón Agregar Dependiente */}
      {dependientes.length < 6 && (
        <Button
          type="button"
          variant="outline"
          onClick={addDependent}
          className="w-full border-2 border-dashed border-[#7AC943] text-[#7AC943] hover:bg-[#7AC943]/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Dependiente ({dependientes.length}/6)
        </Button>
      )}

      {/* Calculadora de Precio */}
      <Card className="bg-gradient-to-br from-[#00A3D7]/5 to-[#7AC943]/5 border-2 border-[#7AC943]">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4">📋 Resumen de Costos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Titular:</span>
              <span className="font-semibold">Q{PRICES.titular}.00</span>
            </div>
            {dependientes.length > 0 && (
              <div className="flex justify-between">
                <span>+ {dependientes.length} Dependiente{dependientes.length > 1 ? 's' : ''}:</span>
                <span className="font-semibold">Q{(dependientes.length * PRICES.dependiente).toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Total mensual:</span>
              <Badge className="bg-[#7AC943] text-white text-lg px-4 py-1">
                Q{totalCost.toFixed(2)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
        >
          ← Anterior
        </Button>
        <Button 
          type="button"
          onClick={handleContinue}
          className="bg-[#7AC943] hover:bg-[#6ba83a] text-white"
        >
          Siguiente: Contrato →
        </Button>
      </div>
    </div>
  );
}

// ============================================
// STEP 4: CONTRATO Y ACEPTACIÓN
// ============================================

interface Step4FormProps {
  onNext: (data: Step4Data) => void;
  onBack: () => void;
  initialData: Step4Data | null;
  step1Data: Step1Data;
  totalCost: number;
}

function Step4Form({ onNext, onBack, initialData, step1Data, totalCost }: Step4FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: initialData || undefined
  });

  const onSubmit = (data: Step4Data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit((data) => { onNext(data); })} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#00A3D7] mb-4">Contrato y Aceptación</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              <Checkbox
                id="aceptaContrato"
                className="mr-2"
                {...register('aceptaContrato')}
              />
              Acepto el contrato de afiliación MirafloresPlus
            </Label>
            {errors.aceptaContrato && (
              <p className="text-sm text-red-600">{errors.aceptaContrato.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="iniciales">
              Iniciales <span className="text-red-500">*</span>
            </Label>
            <Input
              id="iniciales"
              placeholder="JG"
              className={`pl-10 ${errors.iniciales ? 'border-red-500' : ''}`}
              {...register('iniciales')}
            />
            {errors.iniciales && (
              <p className="text-sm text-red-600">{errors.iniciales.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
        >
          ← Anterior
        </Button>
        <Button 
          type="submit"
          className="bg-[#7AC943] hover:bg-[#6ba83a] text-white"
        >
          Continuar al Pago →
        </Button>
      </div>
    </form>
  );
}

// ============================================
// MODAL DE BIENVENIDA
// ============================================

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  step1Data: Step1Data;
  step2Data: Step2Data;
  step4Data: Step4Data;
  dependientes: Dependent[];
  totalCost: number;
}

function WelcomeModal({ 
  open, 
  onClose, 
  step1Data, 
  step2Data, 
  step4Data, 
  dependientes, 
  totalCost
}: WelcomeModalProps) {
  const [affiliateData, setAffiliateData] = useState<{
    affiliateId: string;
    password: string;
    crmNumber: number;
  } | null>(null);

  // Generar datos al abrir el modal
  useEffect(() => {
    if (open && !affiliateData) {
      const affiliateId = generateAffiliateId();
      const password = generateSecurePassword();
      const crmNumber = getNextAffiliateNumber() - INITIAL_AFFILIATE_NUMBER + 1;
      
      setAffiliateData({
        affiliateId,
        password,
        crmNumber
      });
    }
  }, [open, affiliateData]);

  const numDependientes = dependientes.length;
  const paymentToken = PAYMENT_TOKENS[numDependientes];

  const handleCopyToClipboard = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} copiado al portapapeles`);
    } else {
      toast.error(`No se pudo copiar ${label}. Cópialo manualmente.`);
    }
  };

  const onPaymentComplete = () => {
    if (!affiliateData) return;
    
    // Guardar en localStorage
    const activationDate = new Date().toISOString().split('T')[0];
    const vigenciaHasta = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
    
    // Crear dependientes con sus IDs
    const dependientesConId = dependientes.map((dep, index) => ({
      ...dep,
      dependientId: `${affiliateData.affiliateId}-D${index + 1}`
    }));
    
    const affiliateRecord = {
      ...step1Data,
      ...step2Data,
      dependientes: dependientesConId,
      affiliateId: affiliateData.affiliateId,
      crmNumber: affiliateData.crmNumber,
      usuario: step1Data.email,
      password: affiliateData.password,
      activationDate,
      vigenciaHasta,
      monthlyFee: totalCost,
      status: 'pending_payment', // Estado: esperando confirmación de pago
      paymentCompleted: true, // Marcado como pagado (temporal)
      contractSignature: step4Data.iniciales,
      contractAccepted: true,
      contractDate: new Date().toISOString()
    };
    
    localStorage.setItem('miraflores_affiliate', JSON.stringify(affiliateRecord));
    
    // Incrementar contador
    incrementAffiliateCounter();
    
    // Limpiar draft
    localStorage.removeItem('miraflores_form_draft');
    
    toast.success('¡Afiliación completada! Credenciales generadas', {
      duration: 5000
    });
    
    onClose();
  };

  if (!affiliateData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <PartyPopper className="w-8 h-8 text-[#7AC943]" />
            <div>
              <DialogTitle className="text-[#00A3D7] text-2xl">
                ¡Bienvenido a MirafloresPlus!
              </DialogTitle>
              <DialogDescription className="text-[#7AC943] italic">
                Tu afiliación ha sido creada exitosamente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Credenciales de Acceso */}
          <Card className="border-2 border-[#00A3D7] bg-gradient-to-br from-[#00A3D7]/5 to-[#7AC943]/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Credenciales de Acceso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">ID de Afiliado</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border-2 border-[#00A3D7] rounded-lg px-3 py-2 font-mono font-bold text-[#00A3D7]">
                      {affiliateData.affiliateId}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(affiliateData.affiliateId, 'ID')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Registro interno CRM: #{affiliateData.crmNumber}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Usuario (Email)</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border-2 border-[#00A3D7] rounded-lg px-3 py-2 font-mono text-sm">
                      {step1Data.email}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(step1Data.email, 'Email')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs text-gray-600">Contraseña Temporal</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border-2 border-[#7AC943] rounded-lg px-3 py-2 font-mono font-bold text-lg tracking-wider">
                      {affiliateData.password}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(affiliateData.password, 'Contraseña')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <p className="text-xs text-yellow-800">
                      <strong>⚠️ IMPORTANTE:</strong> Guarda esta contraseña en un lugar seguro. 
                      Podrás cambiarla después de iniciar sesión por primera vez.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Afiliación */}
          <Card className="border-2 border-[#7AC943]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5" />
                Resumen de tu Afiliación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Titular:</p>
                  <p className="font-semibold">{step1Data.firstName} {step1Data.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dependientes:</p>
                  <p className="font-semibold">{numDependientes} persona{numDependientes !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {numDependientes > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">📋 Carnets Generados:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#00A3D7] text-white">
                        {affiliateData.affiliateId}
                      </Badge>
                      <span>{step1Data.firstName} {step1Data.lastName} (Titular)</span>
                    </li>
                    {dependientes.map((dep, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#7AC943] text-white">
                          {affiliateData.affiliateId}-D{idx + 1}
                        </Badge>
                        <span>{dep.nombre} {dep.apellido} ({dep.parentesco})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• Afiliación titular:</span>
                  <span>Q{PRICES.titular}.00</span>
                </div>
                {numDependientes > 0 && (
                  <div className="flex justify-between">
                    <span>• {numDependientes} Dependiente{numDependientes > 1 ? 's' : ''}:</span>
                    <span>Q{(numDependientes * PRICES.dependiente).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total mensual:</span>
                  <span className="text-[#7AC943]">Q{totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Estado:</strong> Afiliación activa - Pendiente de confirmación de pago
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Vigencia: Hasta {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('es-GT')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Iframe de Pago de BAC Credomatic */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <QuetzalIcon className="w-5 h-5" />
                Completar Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-[#00A3D7]/20 rounded-xl overflow-hidden">
                <iframe 
                  style={{
                    width: '100%',
                    border: 'none',
                    height: '450px',
                    display: 'block',
                  }}
                  title="Pagar ahora - MirafloresPlus"
                  src={`https://checkout.baccredomatic.com/payment_button?token=${paymentToken}&color=%23ffffff&background=%23e4002b&text=Pagar ahora&hasimage=true`}
                >
                  <p>Tu navegador no soporta iframes.</p>
                </iframe>
              </div>
            </CardContent>
          </Card>

          {/* Nota Informativa */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-semibold mb-1">✅ Próximos pasos:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Completa tu pago en el formulario de arriba</li>
                    <li>Haz clic en "Ya pagué - Finalizar"</li>
                    <li>Recibirás un email con tus credenciales y carnets digitales</li>
                    <li>Inicia sesión en la plataforma con tu email y contraseña</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar y volver
            </Button>
            <Button
              onClick={onPaymentComplete}
              className="flex-1 bg-[#7AC943] hover:bg-[#6ba83a] text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Ya pagué - Finalizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}