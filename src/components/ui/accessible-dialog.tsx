/**
 * Accessible Dialog Wrapper
 * 
 * Este componente envuelve Dialog con mejores prácticas de accesibilidad automáticas.
 * Asegura que siempre haya DialogTitle y DialogDescription incluso si están ocultos visualmente.
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  VisuallyHidden,
} from "./dialog";

interface AccessibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  hideTitle?: boolean;
  hideDescription?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * AccessibleDialog Component
 * 
 * Uso:
 * <AccessibleDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Título del Diálogo"
 *   description="Descripción del diálogo"
 *   hideTitle={false} // opcional: ocultar título visualmente pero mantener accesibilidad
 *   hideDescription={false} // opcional: ocultar descripción visualmente pero mantener accesibilidad
 * >
 *   {contenido del diálogo}
 * </AccessibleDialog>
 */
export function AccessibleDialog({
  open,
  onOpenChange,
  title,
  description,
  hideTitle = false,
  hideDescription = false,
  children,
  footer,
  className,
}: AccessibleDialogProps) {
  const TitleWrapper = hideTitle ? VisuallyHidden : React.Fragment;
  const DescriptionWrapper = hideDescription || !description ? VisuallyHidden : React.Fragment;
  
  // Always provide a description for accessibility, even if it's hidden
  const finalDescription = description || title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <TitleWrapper>
            <DialogTitle>{title}</DialogTitle>
          </TitleWrapper>
          <DescriptionWrapper>
            <DialogDescription>{finalDescription}</DialogDescription>
          </DescriptionWrapper>
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export default AccessibleDialog;
