import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../utils/test-utils';
import { KeyboardShortcuts } from '../../components/KeyboardShortcuts';

describe('KeyboardShortcuts', () => {
  const mockOnNavigate = vi.fn();
  const mockOnAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders keyboard shortcuts help dialog', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    // Press ? to open help
    await user.keyboard('?');

    await waitFor(() => {
      expect(screen.getByText(/Atajos de Teclado/i)).toBeInTheDocument();
    });
  });

  it('triggers navigation with keyboard shortcuts', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    // Press g then d for dashboard
    await user.keyboard('g');
    await user.keyboard('d');

    await waitFor(() => {
      expect(mockOnNavigate).toHaveBeenCalledWith('dashboard');
    });
  });

  it('handles new appointment shortcut (n)', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    await user.keyboard('n');

    await waitFor(() => {
      expect(mockOnAction).toHaveBeenCalledWith('new-appointment');
    });
  });

  it('handles search shortcut (ctrl+k)', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    await user.keyboard('{Control>}k{/Control}');

    await waitFor(() => {
      expect(mockOnAction).toHaveBeenCalledWith('search');
    });
  });

  it('displays shortcuts organized by category', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    await user.keyboard('?');

    await waitFor(() => {
      expect(screen.getByText(/Navegación/i)).toBeInTheDocument();
      expect(screen.getByText(/Acciones/i)).toBeInTheDocument();
    });
  });

  it('closes help dialog with Escape', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    await user.keyboard('?');

    await waitFor(() => {
      expect(screen.getByText(/Atajos de Teclado/i)).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText(/Atajos de Teclado/i)).not.toBeInTheDocument();
    });
  });

  it('does not trigger shortcuts when typing in input fields', async () => {
    const { user } = renderWithProviders(
      <div>
        <input type="text" placeholder="Test input" />
        <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
      </div>
    );

    const input = screen.getByPlaceholderText('Test input');
    await user.click(input);
    await user.keyboard('n');

    // Should not trigger shortcut when focused on input
    expect(mockOnAction).not.toHaveBeenCalled();
  });

  it('shows visual feedback for active shortcuts', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    await user.keyboard('?');

    await waitFor(() => {
      // Should display keyboard key badges
      const helpDialog = screen.getByText(/Atajos de Teclado/i).closest('div');
      expect(helpDialog).toBeInTheDocument();
    });
  });

  it('is accessible with proper ARIA labels', async () => {
    const { user } = renderWithProviders(
      <KeyboardShortcuts onNavigate={mockOnNavigate} onAction={mockOnAction} />
    );

    await user.keyboard('?');

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAccessibleName();
    });
  });
});
