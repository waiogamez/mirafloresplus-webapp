/**
 * Contextual Help Component - Miraflores Plus
 * 
 * Tooltips de ayuda contextual para formularios y acciones
 */

import { ReactNode } from 'react';
import { HelpCircle, Info, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useOnboarding } from '../utils/onboarding';

interface ContextualHelpProps {
  content: string | ReactNode;
  id?: string;
  variant?: 'default' | 'info' | 'warning';
  maxWidth?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  showIcon?: boolean;
}

export function ContextualHelp({
  content,
  id,
  variant = 'default',
  maxWidth = '300px',
  side = 'top',
  align = 'center',
  showIcon = true,
}: ContextualHelpProps) {
  const { markTooltipShown } = useOnboarding();

  const handleOpen = () => {
    if (id) {
      markTooltipShown(id);
    }
  };

  const Icon = variant === 'warning' ? AlertCircle : variant === 'info' ? Info : HelpCircle;

  const iconColor =
    variant === 'warning'
      ? 'text-yellow-500 hover:text-yellow-600'
      : variant === 'info'
      ? 'text-blue-500 hover:text-blue-600'
      : 'text-gray-400 hover:text-[#0477BF]';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip onOpenChange={(open) => open && handleOpen()}>
        <TooltipTrigger asChild>
          {showIcon ? (
            <button
              type="button"
              className={`inline-flex items-center transition-colors ${iconColor}`}
              aria-label="Ayuda"
            >
              <Icon className="w-4 h-4" />
            </button>
          ) : (
            <span className="inline-flex items-center cursor-help">
              {content}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="max-w-xs z-50"
          style={{ maxWidth }}
        >
          <div className="text-sm">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Field Help - Ayuda específica para campos de formulario
 */
interface FieldHelpProps {
  label: string;
  help: string | ReactNode;
  example?: string;
  required?: boolean;
  id?: string;
}

export function FieldHelp({ label, help, example, required, id }: FieldHelpProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <ContextualHelp
        id={id}
        content={
          <div>
            {typeof help === 'string' ? <p className="mb-2">{help}</p> : help}
            {example && (
              <p className="text-xs text-gray-400 mt-2">
                <strong>Ejemplo:</strong> {example}
              </p>
            )}
          </div>
        }
      />
    </div>
  );
}

/**
 * Help Hints - Mensajes de ayuda inline
 */
interface HelpHintProps {
  children: ReactNode;
  variant?: 'default' | 'info' | 'warning' | 'success';
}

export function HelpHint({ children, variant = 'default' }: HelpHintProps) {
  const bgColor = {
    default: 'bg-gray-50 border-gray-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    success: 'bg-green-50 border-green-200',
  }[variant];

  const textColor = {
    default: 'text-gray-600',
    info: 'text-blue-700',
    warning: 'text-yellow-700',
    success: 'text-green-700',
  }[variant];

  const Icon = {
    default: Info,
    info: Info,
    warning: AlertCircle,
    success: HelpCircle,
  }[variant];

  return (
    <div className={`flex gap-2 p-3 rounded-lg border ${bgColor} ${textColor}`}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div className="text-sm flex-1">{children}</div>
    </div>
  );
}

/**
 * Quick Tips - Tips rápidos con animación
 */
interface QuickTipProps {
  tip: string;
  onDismiss?: () => void;
}

export function QuickTip({ tip, onDismiss }: QuickTipProps) {
  return (
    <div className="bg-gradient-to-r from-[#0477BF] to-[#2BB9D9] text-white rounded-lg p-4 shadow-lg animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          💡
        </div>
        <div className="flex-1">
          <h4 className="font-medium mb-1">Tip del día</h4>
          <p className="text-sm opacity-90">{tip}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Tips predefinidos para diferentes secciones
 */
export const CONTEXTUAL_HELP_CONTENT = {
  // Afiliados
  dpi: {
    label: 'DPI',
    help: 'Documento Personal de Identificación de Guatemala',
    example: '1234567890101 (13 dígitos)',
  },
  phone: {
    label: 'Teléfono',
    help: 'Número de teléfono con código de área de Guatemala',
    example: '+502 2345-6789 o 2345-6789',
  },
  email: {
    label: 'Email',
    help: 'Correo electrónico para notificaciones y acceso al portal',
    example: 'usuario@ejemplo.com',
  },
  address: {
    label: 'Dirección',
    help: 'Dirección completa incluyendo zona',
    example: '5ta Avenida 10-50, Zona 10, Ciudad de Guatemala',
  },
  bloodType: {
    label: 'Tipo de Sangre',
    help: 'Grupo sanguíneo y factor RH',
    example: 'O+, A-, AB+, etc.',
  },

  // Citas
  specialty: {
    label: 'Especialidad',
    help: 'Especialidad médica requerida para la consulta',
  },
  appointmentDate: {
    label: 'Fecha de Cita',
    help: 'Selecciona fecha y hora disponibles. Las citas se agendan en bloques de 30 minutos.',
  },
  reason: {
    label: 'Motivo de Consulta',
    help: 'Describe brevemente el motivo de la cita',
    example: 'Dolor de cabeza persistente, control de presión arterial, etc.',
  },

  // Pagos
  amount: {
    label: 'Monto',
    help: 'Monto en Quetzales (Q)',
    example: 'Q 150.00',
  },
  paymentMethod: {
    label: 'Método de Pago',
    help: 'Selecciona cómo el paciente realizó el pago',
  },
  reference: {
    label: 'No. de Referencia',
    help: 'Número de transacción o boleta (opcional)',
    example: 'Para tarjeta o transferencia',
  },

  // Finanzas
  vendor: {
    label: 'Proveedor',
    help: 'Empresa o persona a quien se debe pagar',
  },
  dueDate: {
    label: 'Fecha de Vencimiento',
    help: 'Fecha límite para realizar el pago',
  },
  invoiceNumber: {
    label: 'No. de Factura',
    help: 'Número de factura o documento',
    example: 'FAC-2025-001',
  },

  // Sistema
  password: {
    label: 'Contraseña',
    help: 'Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números',
  },
  confirmPassword: {
    label: 'Confirmar Contraseña',
    help: 'Ingresa la misma contraseña para verificar',
  },
};

/**
 * Tips rápidos rotativos
 */
export const QUICK_TIPS = [
  'Usa Ctrl+K para buscar rápidamente pacientes, citas o afiliados',
  'Presiona Alt+N para agendar una nueva cita en cualquier momento',
  'Las notificaciones se muestran en tiempo real en la campana 🔔',
  'Puedes exportar reportes en PDF o Excel para análisis externos',
  'La barra lateral se puede colapsar con Ctrl+B para más espacio',
  'Usa la tecla Esc para cerrar cualquier modal o diálogo abierto',
  'Los datos se guardan automáticamente al completar formularios',
  'Puedes filtrar tablas haciendo clic en los encabezados de columna',
  'Las citas se pueden reprogramar arrastrándolas en el calendario',
  'Presiona ? para ver todos los atajos de teclado disponibles',
];

/**
 * Get random tip
 */
export function getRandomTip(): string {
  return QUICK_TIPS[Math.floor(Math.random() * QUICK_TIPS.length)];
}
