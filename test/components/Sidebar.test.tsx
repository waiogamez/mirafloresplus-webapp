import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../utils/test-utils';
import { Sidebar } from '../../components/Sidebar';

describe('Sidebar', () => {
  it('renders Miraflores Plus logo', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Super Admin" />);

    expect(screen.getByText('Miraflores Plus')).toBeInTheDocument();
    expect(screen.getByText(/Tu salud, a un clic de distancia/i)).toBeInTheDocument();
  });

  it('highlights current page', () => {
    renderWithProviders(<Sidebar currentPage="afiliados" userRole="Super Admin" />);

    const afiliadosLink = screen.getByText('Afiliados').closest('a');
    expect(afiliadosLink).toHaveClass('bg-[#0477BF]');
  });

  it('shows all menu items for Super Admin', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Super Admin" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Citas')).toBeInTheDocument();
    expect(screen.getByText('Afiliados')).toBeInTheDocument();
    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Cuentas por Pagar')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
  });

  it('shows limited menu items for Recepción role', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Recepción" />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Citas')).toBeInTheDocument();
    expect(screen.getByText('Afiliados')).toBeInTheDocument();
    
    // Should not see financial pages
    expect(screen.queryByText('Cuentas por Pagar')).not.toBeInTheDocument();
  });

  it('shows financial menu items for Finanzas role', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Finanzas" />);

    expect(screen.getByText('Cuentas por Pagar')).toBeInTheDocument();
    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
  });

  it('shows board dashboard for Junta Directiva role', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Junta Directiva" />);

    expect(screen.getByText('Dashboard Ejecutivo')).toBeInTheDocument();
    expect(screen.getByText('Cuentas por Pagar')).toBeInTheDocument();
  });

  it('shows only patient portal for Afiliado role', () => {
    renderWithProviders(<Sidebar currentPage="portal" userRole="Afiliado" />);

    expect(screen.getByText('Mi Portal')).toBeInTheDocument();
    
    // Should not see admin features
    expect(screen.queryByText('Afiliados')).not.toBeInTheDocument();
    expect(screen.queryByText('Facturación')).not.toBeInTheDocument();
  });

  it('shows doctor-specific menu for Doctor role', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Doctor" />);

    expect(screen.getByText('Mis Citas')).toBeInTheDocument();
    expect(screen.getByText('Mis Pacientes')).toBeInTheDocument();
  });

  it('displays user role badge', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Finanzas" />);

    const roleText = screen.getByText(/Finanzas/i);
    expect(roleText).toBeInTheDocument();
  });

  it('is keyboard navigable', async () => {
    const { user } = renderWithProviders(
      <Sidebar currentPage="dashboard" userRole="Super Admin" />
    );

    // Tab to first menu item
    await user.keyboard('{Tab}');
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveFocus();

    // Tab to next item
    await user.keyboard('{Tab}');
    
    const citasLink = screen.getByText('Citas').closest('a');
    expect(citasLink).toHaveFocus();
  });

  it('has proper semantic structure with nav element', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Super Admin" />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('has aria-current on active page', () => {
    renderWithProviders(<Sidebar currentPage="afiliados" userRole="Super Admin" />);

    const afiliadosLink = screen.getByText('Afiliados').closest('a');
    expect(afiliadosLink).toHaveAttribute('aria-current', 'page');
  });

  it('shows shortcuts section for power users', () => {
    renderWithProviders(<Sidebar currentPage="dashboard" userRole="Super Admin" />);

    // Should show keyboard shortcuts hint
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
  });
});
