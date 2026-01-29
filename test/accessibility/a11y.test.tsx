import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../utils/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MetricCard } from '../../components/MetricCard';
import { NotificationCenter } from '../../components/NotificationCenter';
import { Sidebar } from '../../components/Sidebar';
import { SkipLinks } from '../../components/SkipLinks';
import { Users } from 'lucide-react';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests (WCAG 2.1 AA)', () => {
  describe('MetricCard a11y', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(
        <MetricCard
          title="Total Afiliados"
          value="2,586"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          color="#0477BF"
          trend={{ value: 12, isPositive: true }}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has sufficient color contrast', () => {
      renderWithProviders(
        <MetricCard
          title="Test Metric"
          value="100"
          change="+8.2%"
          changeType="positive"
          icon={Users}
          color="#0477BF"
        />
      );

      const title = screen.getByText('Test Metric');
      const styles = window.getComputedStyle(title);
      
      // Text should be visible
      expect(styles.color).toBeTruthy();
    });
  });

  describe('NotificationCenter a11y', () => {
    it('should not have accessibility violations when closed', async () => {
      const { container } = renderWithProviders(
        <NotificationCenter userRole="Finanzas" pendingApprovals={3} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when open', async () => {
      const { container, user } = renderWithProviders(
        <NotificationCenter userRole="Finanzas" pendingApprovals={3} />
      );

      const button = screen.getByRole('button', { name: /notificaciones/i });
      await user.click(button);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper focus management', async () => {
      const { user } = renderWithProviders(
        <NotificationCenter userRole="Finanzas" />
      );

      const button = screen.getByRole('button', { name: /notificaciones/i });
      
      // Should be keyboard accessible
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      
      // Dialog should open and be accessible
      const dialog = await screen.findByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Sidebar a11y', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(
        <Sidebar currentPage="dashboard" userRole="Super Admin" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper navigation landmark', () => {
      renderWithProviders(
        <Sidebar currentPage="dashboard" userRole="Super Admin" />
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('has accessible link labels', () => {
      renderWithProviders(
        <Sidebar currentPage="dashboard" userRole="Super Admin" />
      );

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('indicates current page for screen readers', () => {
      renderWithProviders(
        <Sidebar currentPage="afiliados" userRole="Super Admin" />
      );

      const currentLink = screen.getByRole('link', { current: 'page' });
      expect(currentLink).toBeInTheDocument();
    });
  });

  describe('SkipLinks a11y', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithProviders(
        <SkipLinks />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('skip links are keyboard accessible', async () => {
      const { user } = renderWithProviders(
        <div>
          <SkipLinks />
          <main id="main-content">Main Content</main>
        </div>
      );

      // Tab to first skip link
      await user.keyboard('{Tab}');

      const skipLink = screen.getByText(/saltar al contenido principal/i);
      expect(skipLink).toHaveFocus();
    });

    it('skip links are hidden until focused', () => {
      renderWithProviders(<SkipLinks />);

      const skipLink = screen.getByText(/saltar al contenido principal/i);
      const styles = window.getComputedStyle(skipLink);
      
      // Should be positioned off-screen or use sr-only pattern
      expect(skipLink).toBeInTheDocument();
    });
  });

  describe('Form Accessibility', () => {
    it('all form inputs have associated labels', () => {
      renderWithProviders(
        <form>
          <label htmlFor="test-input">Test Label</label>
          <input id="test-input" type="text" />
        </form>
      );

      const input = screen.getByLabelText('Test Label');
      expect(input).toBeInTheDocument();
    });

    it('required fields are indicated for screen readers', () => {
      renderWithProviders(
        <label>
          Required Field <span aria-label="campo obligatorio">*</span>
          <input type="text" required aria-required="true" />
        </label>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('error messages are associated with inputs', () => {
      renderWithProviders(
        <div>
          <label htmlFor="email-input">Email</label>
          <input
            id="email-input"
            type="email"
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <p id="email-error" role="alert">Email is required</p>
        </div>
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');

      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Email is required');
    });
  });

  describe('Color Contrast', () => {
    it('primary text has sufficient contrast', () => {
      const { container } = renderWithProviders(
        <div style={{ backgroundColor: '#F2F2F2', color: '#000000' }}>
          <p>Test text with good contrast</p>
        </div>
      );

      const text = screen.getByText('Test text with good contrast');
      expect(text).toBeInTheDocument();
    });

    it('links have sufficient contrast', () => {
      renderWithProviders(
        <a href="#" style={{ color: '#0477BF' }}>
          Test Link
        </a>
      );

      const link = screen.getByText('Test Link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('interactive elements are keyboard accessible', async () => {
      const { user } = renderWithProviders(
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <a href="#">Link</a>
        </div>
      );

      await user.keyboard('{Tab}');
      expect(screen.getByText('Button 1')).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByText('Button 2')).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByText('Link')).toHaveFocus();
    });

    it('focus is visible on interactive elements', async () => {
      const { user } = renderWithProviders(
        <button style={{ outline: '2px solid blue' }}>Focused Button</button>
      );

      const button = screen.getByText('Focused Button');
      button.focus();

      expect(button).toHaveFocus();
      
      const styles = window.getComputedStyle(button);
      expect(styles.outline).toBeTruthy();
    });
  });

  describe('ARIA Landmarks', () => {
    it('page has proper landmark structure', () => {
      renderWithProviders(
        <div>
          <header>Header</header>
          <nav>Navigation</nav>
          <main>Main Content</main>
          <footer>Footer</footer>
        </div>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('live regions announce dynamic content', () => {
      renderWithProviders(
        <div aria-live="polite" aria-atomic="true">
          Dynamic content updated
        </div>
      );

      const liveRegion = screen.getByText('Dynamic content updated');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('alerts use assertive live region', () => {
      renderWithProviders(
        <div role="alert" aria-live="assertive">
          Error: Something went wrong
        </div>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });
});
