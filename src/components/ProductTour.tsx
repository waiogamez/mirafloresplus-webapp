/**
 * Product Tour Component - Miraflores Plus
 * 
 * Tour guiado interactivo para nuevos usuarios
 */

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  CheckCircle2 
} from 'lucide-react';
import { getTourForRole, useOnboarding } from '../utils/onboarding';
import { logger } from '../utils/logger';
import { analytics } from '../utils/analytics';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface ProductTourProps {
  userRole: string;
  userName?: string;
}

export function ProductTour({ userRole, userName }: ProductTourProps) {
  const { shouldShowTour, completeTour, skipTour } = useOnboarding(userRole);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Cargar steps del rol
    const tourSteps = getTourForRole(userRole);
    setSteps(tourSteps);

    // Mostrar tour si es necesario
    if (shouldShowTour && tourSteps.length > 0) {
      // Esperar un poco para que la UI se renderice
      const timer = setTimeout(() => {
        setIsOpen(true);
        logger.info('Product tour started', { role: userRole });
        analytics.event('tour_started', 'onboarding', userRole);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, userRole]);

  useEffect(() => {
    if (isOpen && steps.length > 0) {
      highlightStep(currentStep);
    } else {
      removeHighlight();
    }

    return () => removeHighlight();
  }, [isOpen, currentStep, steps]);

  const highlightStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;

    // Remover highlight anterior
    removeHighlight();

    // Encontrar elemento
    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);

      // Scroll al elemento
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Agregar clase de highlight
      element.classList.add('tour-highlight');

      // Agregar overlay
      const overlay = document.createElement('div');
      overlay.id = 'tour-overlay';
      overlay.className = 'tour-overlay';
      document.body.appendChild(overlay);

      // Agregar spotlight
      const spotlight = document.createElement('div');
      spotlight.id = 'tour-spotlight';
      spotlight.className = 'tour-spotlight';
      
      const rect = element.getBoundingClientRect();
      spotlight.style.top = `${rect.top - 8}px`;
      spotlight.style.left = `${rect.left - 8}px`;
      spotlight.style.width = `${rect.width + 16}px`;
      spotlight.style.height = `${rect.height + 16}px`;
      
      document.body.appendChild(spotlight);
    }
  };

  const removeHighlight = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
      setHighlightedElement(null);
    }

    // Remover overlay y spotlight
    const overlay = document.getElementById('tour-overlay');
    const spotlight = document.getElementById('tour-spotlight');
    
    if (overlay) overlay.remove();
    if (spotlight) spotlight.remove();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      analytics.event('tour_step_next', 'onboarding', `step_${currentStep + 1}`);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      analytics.event('tour_step_previous', 'onboarding', `step_${currentStep - 1}`);
    }
  };

  const handleComplete = () => {
    completeTour();
    setIsOpen(false);
    removeHighlight();
    
    logger.info('Product tour completed', { role: userRole, steps: steps.length });
    analytics.event('tour_completed', 'onboarding', userRole);
  };

  const handleSkip = () => {
    skipTour();
    setIsOpen(false);
    removeHighlight();
    
    logger.info('Product tour skipped', { role: userRole, step: currentStep });
    analytics.event('tour_skipped', 'onboarding', `step_${currentStep}`);
  };

  if (!isOpen || steps.length === 0) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Estilos para el tour */}
      <style>{`
        .tour-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          pointer-events: none;
        }
        
        .tour-spotlight {
          position: fixed;
          background: transparent;
          border: 3px solid #0477BF;
          border-radius: 8px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          pointer-events: none;
          transition: all 0.3s ease;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            border-color: #0477BF;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px #0477BF;
          }
          50% {
            border-color: #2BB9D9;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px #2BB9D9;
          }
        }
        
        .tour-highlight {
          position: relative;
          z-index: 10000 !important;
        }
      `}</style>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] z-[10001]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0477BF]">
              {currentStep === 0 && <Sparkles className="w-5 h-5" />}
              {step.title}
            </DialogTitle>
            
            <DialogDescription className="text-base">
              {currentStep === 0 && userName && (
                <p className="mb-3 text-gray-700">
                  ¡Hola {userName}! 👋 Bienvenido a Miraflores Plus.
                </p>
              )}
              {step.content}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-[#0477BF]/10 text-[#0477BF] border-[#0477BF]/20">
              Paso {currentStep + 1} de {steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              Saltar
            </Button>
          </div>

          {/* Progress bar */}
          <div className="py-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {Math.round(progress)}% completado
            </p>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                size="sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              {isLastStep ? (
                <Button
                  onClick={handleComplete}
                  className="bg-[#62BF04] hover:bg-[#62BF04]/90"
                  size="sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  ¡Entendido!
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[#0477BF] hover:bg-[#0477BF]/90"
                  size="sm"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Componente para mostrar modal de bienvenida antes del tour
 */
interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTour: () => void;
  onSkipTour: () => void;
  userName?: string;
  userRole: string;
}

export function WelcomeModal({
  open,
  onOpenChange,
  onStartTour,
  onSkipTour,
  userName,
  userRole,
}: WelcomeModalProps) {
  const roleNames: Record<string, string> = {
    recepcion: 'Recepción',
    doctor: 'Doctor',
    'junta-directiva': 'Junta Directiva',
    afiliado: 'Afiliado/Paciente',
    'super-admin': 'Super Admin',
    finanzas: 'Finanzas',
  };

  const roleName = roleNames[userRole.toLowerCase().replace(/\s+/g, '-')] || userRole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <div className="flex justify-center -mt-2 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0477BF] to-[#2BB9D9] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            ¡Bienvenido a Miraflores Plus!
          </DialogTitle>
          
          <DialogDescription className="text-center text-base pt-2">
            {userName && (
              <p className="mb-3 text-lg">
                Hola <strong>{userName}</strong> 👋
              </p>
            )}
            <p className="mb-4">
              Tu salud, a un clic de distancia! 🏥
            </p>
            <p className="text-gray-600">
              Has iniciado sesión como <strong>{roleName}</strong>.
              ¿Te gustaría hacer un tour rápido por las funciones principales?
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-[#F2F2F2] rounded-lg p-4 my-4">
          <h4 className="font-medium text-sm mb-2 text-[#0477BF]">
            ⏱️ El tour toma aproximadamente 2 minutos
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Conoce las funciones principales</li>
            <li>✓ Aprende atajos de teclado</li>
            <li>✓ Descubre tips de productividad</li>
          </ul>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onSkipTour}
            className="flex-1"
          >
            Saltar tour
          </Button>
          <Button
            onClick={onStartTour}
            className="flex-1 bg-[#0477BF] hover:bg-[#0477BF]/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Iniciar tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
