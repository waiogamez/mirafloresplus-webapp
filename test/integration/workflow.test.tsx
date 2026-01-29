import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../utils/test-utils';
import { useState } from 'react';
import { AddAppointmentDialog } from '../../components/AddAppointmentDialog';
import { NotificationCenter } from '../../components/NotificationCenter';

describe('Integration Tests - User Workflows', () => {
  describe('Appointment Booking Flow', () => {
    function AppointmentWorkflow() {
      const [dialogOpen, setDialogOpen] = useState(false);
      const [appointments, setAppointments] = useState<string[]>([]);

      return (
        <div>
          <button onClick={() => setDialogOpen(true)}>
            Nueva Cita
          </button>
          <div data-testid="appointments-list">
            {appointments.map((apt, idx) => (
              <div key={idx}>{apt}</div>
            ))}
          </div>
          <AddAppointmentDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onAppointmentAdded={() => {
              setAppointments([...appointments, 'Nueva cita agendada']);
            }}
          />
        </div>
      );
    }

    it('completes full appointment booking workflow', async () => {
      const { user } = renderWithProviders(<AppointmentWorkflow />);

      // Step 1: Click to open dialog
      await user.click(screen.getByText('Nueva Cita'));

      await waitFor(() => {
        expect(screen.getByText('Agendar Nueva Cita')).toBeInTheDocument();
      });

      // Step 2: Verify form is present
      expect(screen.getByText('Información del Paciente')).toBeInTheDocument();
      
      // Step 3: Can cancel
      await user.click(screen.getByRole('button', { name: /cancelar/i }));

      await waitFor(() => {
        expect(screen.queryByText('Agendar Nueva Cita')).not.toBeInTheDocument();
      });
    });
  });

  describe('Notification Interaction Flow', () => {
    it('allows user to interact with notifications', async () => {
      const { user } = renderWithProviders(
        <NotificationCenter userRole="Finanzas" pendingApprovals={3} />
      );

      // Step 1: Open notifications
      const button = screen.getByRole('button', { name: /notificaciones/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Step 2: Verify notifications are shown
      const notifications = screen.getAllByRole('listitem');
      expect(notifications.length).toBeGreaterThan(0);

      // Step 3: Mark all as read
      const markAllButton = screen.getByRole('button', { name: /marcar.*como leídas/i });
      await user.click(markAllButton);

      await waitFor(() => {
        expect(screen.getByText(/0 sin leer/i)).toBeInTheDocument();
      });
    });
  });

  describe('Role-Based Access Flow', () => {
    function RoleBasedApp({ role }: { role: string }) {
      return (
        <div>
          <div data-testid="user-role">{role}</div>
          {role === 'Finanzas' && (
            <div data-testid="finance-section">
              <h2>Cuentas por Pagar</h2>
            </div>
          )}
          {role === 'Recepción' && (
            <div data-testid="reception-section">
              <h2>Citas</h2>
            </div>
          )}
        </div>
      );
    }

    it('shows appropriate content for Finanzas role', () => {
      renderWithProviders(<RoleBasedApp role="Finanzas" />);

      expect(screen.getByTestId('user-role')).toHaveTextContent('Finanzas');
      expect(screen.getByTestId('finance-section')).toBeInTheDocument();
      expect(screen.getByText('Cuentas por Pagar')).toBeInTheDocument();
    });

    it('shows appropriate content for Recepción role', () => {
      renderWithProviders(<RoleBasedApp role="Recepción" />);

      expect(screen.getByTestId('user-role')).toHaveTextContent('Recepción');
      expect(screen.getByTestId('reception-section')).toBeInTheDocument();
      expect(screen.getByText('Citas')).toBeInTheDocument();
    });
  });

  describe('Search and Filter Flow', () => {
    function SearchableList() {
      const [search, setSearch] = useState('');
      const items = ['María González', 'Carlos Rodríguez', 'Ana Martínez'];
      const filtered = items.filter(item => 
        item.toLowerCase().includes(search.toLowerCase())
      );

      return (
        <div>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar afiliados"
          />
          <div data-testid="results">
            {filtered.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
        </div>
      );
    }

    it('filters results based on search input', async () => {
      const { user } = renderWithProviders(<SearchableList />);

      const searchInput = screen.getByPlaceholderText('Buscar...');

      // Initially shows all items
      expect(screen.getByText('María González')).toBeInTheDocument();
      expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument();
      expect(screen.getByText('Ana Martínez')).toBeInTheDocument();

      // Type in search
      await user.type(searchInput, 'María');

      await waitFor(() => {
        expect(screen.getByText('María González')).toBeInTheDocument();
        expect(screen.queryByText('Carlos Rodríguez')).not.toBeInTheDocument();
        expect(screen.queryByText('Ana Martínez')).not.toBeInTheDocument();
      });

      // Clear search
      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText('María González')).toBeInTheDocument();
        expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument();
        expect(screen.getByText('Ana Martínez')).toBeInTheDocument();
      });
    });
  });

  describe('Multi-Step Form Flow', () => {
    function MultiStepForm() {
      const [step, setStep] = useState(1);
      const [formData, setFormData] = useState({ name: '', email: '' });

      return (
        <div>
          <div data-testid="current-step">Paso {step} de 2</div>
          
          {step === 1 && (
            <div>
              <h2>Información Personal</h2>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                aria-label="Nombre"
              />
              <button onClick={() => setStep(2)} disabled={!formData.name}>
                Siguiente
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Contacto</h2>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-label="Email"
              />
              <button onClick={() => setStep(1)}>Anterior</button>
              <button disabled={!formData.email}>Enviar</button>
            </div>
          )}
        </div>
      );
    }

    it('navigates through multi-step form', async () => {
      const { user } = renderWithProviders(<MultiStepForm />);

      // Step 1
      expect(screen.getByTestId('current-step')).toHaveTextContent('Paso 1 de 2');
      expect(screen.getByText('Información Personal')).toBeInTheDocument();

      const nextButton = screen.getByText('Siguiente');
      expect(nextButton).toBeDisabled();

      // Fill name
      const nameInput = screen.getByLabelText('Nombre');
      await user.type(nameInput, 'Juan Pérez');

      expect(nextButton).not.toBeDisabled();
      await user.click(nextButton);

      // Step 2
      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('Paso 2 de 2');
        expect(screen.getByText('Contacto')).toBeInTheDocument();
      });

      // Go back
      await user.click(screen.getByText('Anterior'));

      await waitFor(() => {
        expect(screen.getByTestId('current-step')).toHaveTextContent('Paso 1 de 2');
      });
    });
  });

  describe('Data Loading and Error States', () => {
    function DataComponent() {
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);
      const [data, setData] = useState<string[]>([]);

      const loadData = async () => {
        setLoading(true);
        setError(false);
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          setData(['Item 1', 'Item 2', 'Item 3']);
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <button onClick={loadData}>Cargar Datos</button>
          {loading && <div>Cargando...</div>}
          {error && <div role="alert">Error al cargar datos</div>}
          {!loading && !error && data.length > 0 && (
            <ul>
              {data.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    it('handles loading and data display', async () => {
      const { user } = renderWithProviders(<DataComponent />);

      const loadButton = screen.getByText('Cargar Datos');
      await user.click(loadButton);

      // Should show loading
      expect(screen.getByText('Cargando...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
      });

      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });
  });
});
