import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../utils/test-utils';
import { useFocusTrap, announceToScreenReader, FocusTrap } from '../../components/FocusTrap';
import { useState } from 'react';

// Test component using the hook
function TestFocusTrapComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useFocusTrap(isOpen);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      {isOpen && (
        <div ref={containerRef} role="dialog">
          <button>First Button</button>
          <button>Second Button</button>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

describe('FocusTrap', () => {
  describe('useFocusTrap hook', () => {
    it('focuses first element when opened', async () => {
      const { user } = renderWithProviders(<TestFocusTrapComponent />);

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        const firstButton = screen.getByText('First Button');
        expect(firstButton).toHaveFocus();
      });
    });

    it('traps Tab navigation within container', async () => {
      const { user } = renderWithProviders(<TestFocusTrapComponent />);

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByText('First Button')).toHaveFocus();
      });

      // Tab through elements
      await user.keyboard('{Tab}');
      expect(screen.getByText('Second Button')).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByText('Close')).toHaveFocus();

      // Tab from last element should cycle to first
      await user.keyboard('{Tab}');
      await waitFor(() => {
        expect(screen.getByText('First Button')).toHaveFocus();
      });
    });

    it('handles Shift+Tab for backward navigation', async () => {
      const { user } = renderWithProviders(<TestFocusTrapComponent />);

      await user.click(screen.getByText('Open Dialog'));

      await waitFor(() => {
        expect(screen.getByText('First Button')).toHaveFocus();
      });

      // Shift+Tab from first element should go to last
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      
      await waitFor(() => {
        expect(screen.getByText('Close')).toHaveFocus();
      });
    });

    it('restores focus when closed', async () => {
      const { user } = renderWithProviders(<TestFocusTrapComponent />);

      const openButton = screen.getByText('Open Dialog');
      await user.click(openButton);

      await waitFor(() => {
        expect(screen.getByText('First Button')).toHaveFocus();
      });

      // Close dialog
      await user.click(screen.getByText('Close'));

      await waitFor(() => {
        expect(openButton).toHaveFocus();
      });
    });
  });

  describe('FocusTrap component', () => {
    it('renders children when active', () => {
      renderWithProviders(
        <FocusTrap isActive={true}>
          <div>Trapped Content</div>
        </FocusTrap>
      );

      expect(screen.getByText('Trapped Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = renderWithProviders(
        <FocusTrap isActive={true} className="custom-class">
          <div>Content</div>
        </FocusTrap>
      );

      const trapDiv = container.querySelector('.custom-class');
      expect(trapDiv).toBeInTheDocument();
    });
  });

  describe('announceToScreenReader', () => {
    it('creates announcement element with correct attributes', () => {
      announceToScreenReader('Test announcement', 'polite');

      // The announcement element should be added to the body
      const announcement = document.querySelector('[role="status"]');
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveTextContent('Test announcement');
    });

    it('creates assertive announcement when specified', () => {
      announceToScreenReader('Urgent message', 'assertive');

      const announcement = document.querySelector('[aria-live="assertive"]');
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveTextContent('Urgent message');
    });

    it('removes announcement after timeout', async () => {
      announceToScreenReader('Temporary message', 'polite');

      const announcement = document.querySelector('[role="status"]');
      expect(announcement).toBeInTheDocument();

      // Wait for removal (1000ms timeout in the function)
      await new Promise(resolve => setTimeout(resolve, 1100));

      expect(document.querySelector('[role="status"]')).not.toBeInTheDocument();
    });

    it('has sr-only class for screen readers only', () => {
      announceToScreenReader('Screen reader only', 'polite');

      const announcement = document.querySelector('[role="status"]');
      expect(announcement).toHaveClass('sr-only');
    });
  });
});
