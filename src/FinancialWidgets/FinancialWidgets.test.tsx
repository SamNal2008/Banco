/**
 * FinancialWidgets.test.tsx
 * Tests for the FinancialWidgets component
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FinancialWidgets from './FinancialWidgets';
import { useExpenses } from './useExpenses';

// Mock the useExpenses hook
jest.mock('./useExpenses');

describe('FinancialWidgets', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockRefetch = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state', () => {
    // Mock the hook to return loading state
    (useExpenses as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      expensesData: null,
      widgetData: [],
      refetch: mockRefetch
    });

    render(<FinancialWidgets userId={mockUserId} />);
    
    // Check that loading message is displayed
    expect(screen.getByText('Chargement des dépenses...')).toBeInTheDocument();
  });

  it('should show error state and allow retry', async () => {
    // Mock the hook to return error state
    (useExpenses as jest.Mock).mockReturnValue({
      isLoading: false,
      error: 'Failed to fetch expenses',
      expensesData: null,
      widgetData: [],
      refetch: mockRefetch
    });

    render(<FinancialWidgets userId={mockUserId} />);
    
    // Check that error message is displayed
    expect(screen.getByText('Erreur')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch expenses')).toBeInTheDocument();
    
    // Click retry button
    const retryButton = screen.getByText('Réessayer');
    userEvent.click(retryButton);
    
    // Check that refetch was called
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should render widgets when data is loaded', () => {
    // Mock the hook to return data
    (useExpenses as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      expensesData: {
        dailyExpenses: { expenses: [] },
        weeklyExpenses: { expenses: [] },
        monthlyExpenses: { expenses: [] }
      },
      widgetData: [
        {
          period: 'daily',
          amount: 25.5,
          currency: '€',
          label: 'Aujourd\'hui'
        },
        {
          period: 'weekly',
          amount: 150.75,
          currency: '€',
          label: 'Cette semaine'
        },
        {
          period: 'monthly',
          amount: 750.25,
          currency: '€',
          label: 'Ce mois'
        }
      ],
      refetch: mockRefetch
    });

    render(<FinancialWidgets userId={mockUserId} />);
    
    // Check that title is displayed
    expect(screen.getByText('Vos dépenses')).toBeInTheDocument();
    
    // Check that all widgets are displayed
    expect(screen.getByText('Aujourd\'hui')).toBeInTheDocument();
    expect(screen.getByText('Cette semaine')).toBeInTheDocument();
    expect(screen.getByText('Ce mois')).toBeInTheDocument();
  });
});
