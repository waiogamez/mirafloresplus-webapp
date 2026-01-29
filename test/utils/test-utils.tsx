import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that includes common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { ...options }),
  };
}

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 3000
): Promise<void> {
  const startTime = Date.now();
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

/**
 * Mock de datos comunes para testing
 */
export const mockData = {
  affiliates: [
    { id: 'AF-2586', name: 'María González', plan: 'Premium', status: 'Activo' },
    { id: 'AF-2585', name: 'Carlos Rodríguez', plan: 'Básico', status: 'Activo' },
    { id: 'AF-2584', name: 'Ana Martínez', plan: 'Premium', status: 'Activo' },
  ],
  appointments: [
    {
      id: 'CIT-1234',
      patient: 'María González',
      doctor: 'Dr. Carlos Méndez',
      date: '2024-11-15',
      time: '09:00 AM',
      type: 'Presencial',
      status: 'Confirmada',
    },
    {
      id: 'CIT-1235',
      patient: 'Carlos Rodríguez',
      doctor: 'Dra. Ana García',
      date: '2024-11-15',
      time: '10:00 AM',
      type: 'Telemedicina',
      status: 'Pendiente',
    },
  ],
  invoices: [
    {
      id: 'FACT-2025-001',
      supplier: 'Farmacia San José',
      amount: 15000,
      dueDate: '2024-12-01',
      status: 'Pendiente Aprobación',
    },
    {
      id: 'FACT-2025-002',
      supplier: 'Laboratorio Médico Central',
      amount: 8500,
      dueDate: '2024-12-05',
      status: 'Aprobada',
    },
  ],
};

/**
 * Simulate user typing with delay
 */
export async function typeWithDelay(
  user: ReturnType<typeof userEvent.setup>,
  element: HTMLElement,
  text: string
) {
  await user.clear(element);
  await user.type(element, text, { delay: 10 });
}

/**
 * Get accessible name of element (for debugging)
 */
export function getAccessibleName(element: HTMLElement): string {
  return element.getAttribute('aria-label') || 
         element.getAttribute('aria-labelledby') || 
         element.textContent || 
         '';
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { userEvent };
