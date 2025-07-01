/**
 * ExpenseWidget.test.tsx
 * Tests for the ExpenseWidget component
 */
import { render, screen } from '@testing-library/react';
import ExpenseWidget from './ExpenseWidget';
import { ExpenseWidgetData } from './types';

describe('ExpenseWidget', () => {
  const mockData: ExpenseWidgetData = {
    period: 'daily',
    amount: 25.5,
    currency: '€',
    label: 'Aujourd\'hui'
  };

  it('should render the widget with correct data', () => {
    render(<ExpenseWidget data={mockData} />);
    
    // Check that the label is displayed
    expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
    
    // Check that the amount is displayed and formatted correctly
    // Note: The actual formatting might vary based on locale, so we're checking for the base amount
    expect(screen.getByText(/25,50/)).toBeInTheDocument();
  });

  it('should render with trending down icon by default', () => {
    const { container } = render(<ExpenseWidget data={mockData} />);
    
    // Check for the presence of the TrendingDown icon (this is a bit implementation-specific)
    // We're checking for the red color class that's applied to the icon container
    expect(container.querySelector('.text-red-400')).toBeInTheDocument();
  });

  it('should render with trending up icon when isPositive is true', () => {
    const { container } = render(<ExpenseWidget data={mockData} isPositive={true} />);
    
    // Check for the presence of the TrendingUp icon
    // We're checking for the green color class that's applied to the icon container
    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });
});
