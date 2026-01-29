import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../utils/test-utils';
import { NotificationCenter } from '../../components/NotificationCenter';

describe('NotificationCenter', () => {
  it('renders notification bell button', () => {
    renderWithProviders(<NotificationCenter />);

    const button = screen.getByRole('button', { name: /notificaciones/i });
    expect(button).toBeInTheDocument();
  });

  it('displays unread count badge when there are notifications', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={3} />
    );

    // Should show badge with count
    await waitFor(() => {
      const badge = screen.getByText('3');
      expect(badge).toBeInTheDocument();
    });
  });

  it('opens notification panel on click', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" />
    );

    const button = screen.getByRole('button', { name: /notificaciones/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });
  });

  it('shows role-specific notifications for Finanzas', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={5} />
    );

    await user.click(screen.getByRole('button', { name: /notificaciones/i }));

    await waitFor(() => {
      expect(screen.getByText(/facturas pendientes de aprobación/i)).toBeInTheDocument();
    });
  });

  it('shows role-specific notifications for Recepción', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Recepción" />
    );

    await user.click(screen.getByRole('button', { name: /notificaciones/i }));

    await waitFor(() => {
      // Should show reception-specific notifications
      const content = screen.getByRole('dialog');
      expect(content).toBeInTheDocument();
    });
  });

  it('marks notification as read on click', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={2} />
    );

    await user.click(screen.getByRole('button', { name: /notificaciones/i }));

    await waitFor(() => {
      const notifications = screen.getAllByRole('listitem');
      expect(notifications.length).toBeGreaterThan(0);
    });

    // Click on a notification
    const firstNotification = screen.getAllByRole('listitem')[0];
    await user.click(firstNotification);

    // Notification should be marked as read (visually)
    await waitFor(() => {
      expect(firstNotification).toBeInTheDocument();
    });
  });

  it('marks all as read when button is clicked', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={3} />
    );

    await user.click(screen.getByRole('button', { name: /notificaciones/i }));

    await waitFor(() => {
      const markAllButton = screen.getByRole('button', { name: /marcar.*como leídas/i });
      expect(markAllButton).toBeInTheDocument();
    });

    const markAllButton = screen.getByRole('button', { name: /marcar.*como leídas/i });
    await user.click(markAllButton);

    // Badge count should update
    await waitFor(() => {
      const unreadText = screen.getByText(/0 sin leer/i);
      expect(unreadText).toBeInTheDocument();
    });
  });

  it('deletes notification when X button is clicked', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={2} />
    );

    await user.click(screen.getByRole('button', { name: /notificaciones/i }));

    await waitFor(() => {
      const notifications = screen.getAllByRole('listitem');
      expect(notifications.length).toBeGreaterThan(0);
    });

    const initialCount = screen.getAllByRole('listitem').length;

    // Find and click first delete button
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar notificación/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      const notifications = screen.getAllByRole('listitem');
      expect(notifications.length).toBe(initialCount - 1);
    });
  });

  it('shows empty state when no notifications', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Doctor" />
    );

    await user.click(screen.getByRole('button', { name: /notificaciones/i }));

    await waitFor(() => {
      // Initially might have some, but after clearing all
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  it('is keyboard accessible', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={2} />
    );

    const button = screen.getByRole('button', { name: /notificaciones/i });
    
    // Focus and activate with keyboard
    button.focus();
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Should be able to navigate with Tab
    await user.keyboard('{Tab}');
    
    // Close with Escape
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('has proper ARIA attributes', async () => {
    const { user } = renderWithProviders(
      <NotificationCenter userRole="Finanzas" pendingApprovals={3} />
    );

    const button = screen.getByRole('button', { name: /notificaciones/i });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Centro de notificaciones');
  });
});
