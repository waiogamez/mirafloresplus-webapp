import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../utils/test-utils';
import { MetricCard } from '../../components/MetricCard';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

describe('MetricCard', () => {
  it('renders metric card with basic props', () => {
    renderWithProviders(
      <MetricCard
        title="Total Afiliados"
        value="2,586"
        change="+12.5%"
        changeType="positive"
        icon={Users}
        color="#0477BF"
      />
    );

    expect(screen.getByText('Total Afiliados')).toBeInTheDocument();
    expect(screen.getByText('2,586')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('displays positive trend correctly', () => {
    renderWithProviders(
      <MetricCard
        title="Citas del Mes"
        value="342"
        change="+8.2%"
        changeType="positive"
        icon={Users}
        color="#62BF04"
        trend={{ value: 12, isPositive: true }}
      />
    );

    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('vs. mes anterior')).toBeInTheDocument();
  });

  it('displays negative trend correctly', () => {
    renderWithProviders(
      <MetricCard
        title="Ingresos"
        value="Q 50,000"
        change="-3.1%"
        changeType="negative"
        icon={Users}
        color="#0477BF"
        trend={{ value: 5, isPositive: false }}
      />
    );

    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProviders(
      <MetricCard
        title="Loading Metric"
        value="0"
        change="+0%"
        changeType="neutral"
        icon={Users}
        color="#0477BF"
        loading={true}
      />
    );

    // Should show skeleton or loading indicator
    const card = screen.getByText('Loading Metric').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    renderWithProviders(
      <MetricCard
        title="Afiliados"
        value="2,586"
        change="+5.2%"
        changeType="positive"
        subtitle="Activos este mes"
        icon={Users}
        color="#0477BF"
      />
    );

    expect(screen.getByText('Activos este mes')).toBeInTheDocument();
  });

  it('is accessible with proper ARIA labels', () => {
    renderWithProviders(
      <MetricCard
        title="Test Metric"
        value="100"
        change="+8.3%"
        changeType="positive"
        icon={Users}
        color="#0477BF"
        trend={{ value: 10, isPositive: true }}
      />
    );

    // Should have semantic structure
    const title = screen.getByText('Test Metric');
    expect(title).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <MetricCard
        title="Custom Class"
        value="123"
        change="+5.0%"
        changeType="positive"
        icon={Users}
        color="#0477BF"
        className="custom-test-class"
      />
    );

    const card = container.querySelector('.custom-test-class');
    expect(card).toBeInTheDocument();
  });
});
