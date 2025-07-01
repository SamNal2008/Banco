/**
 * useExpenses.test.ts
 * Tests for the useExpenses hook
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { useExpenses } from './useExpenses';
import * as ExpensesService from './ExpensesService';

// Mock the ExpensesService
jest.mock('./ExpensesService', () => ({
  getExpenses: jest.fn()
}));

describe('useExpenses', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockResponse = {
    dailyExpenses: {
      expenses: [
        {
          amount: {
            value: 25.5,
            currency: {
              currencyCode: 'EUR',
              numericCode: 978,
              numericCodeAsString: '978',
              displayName: 'Euro',
              symbol: '€',
              defaultFractionDigits: 2
            }
          }
        }
      ]
    },
    weeklyExpenses: {
      expenses: [
        {
          amount: {
            value: 150.75,
            currency: {
              currencyCode: 'EUR',
              numericCode: 978,
              numericCodeAsString: '978',
              displayName: 'Euro',
              symbol: '€',
              defaultFractionDigits: 2
            }
          }
        }
      ]
    },
    monthlyExpenses: {
      expenses: [
        {
          amount: {
            value: 750.25,
            currency: {
              currencyCode: 'EUR',
              numericCode: 978,
              numericCodeAsString: '978',
              displayName: 'Euro',
              symbol: '€',
              defaultFractionDigits: 2
            }
          }
        }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch expenses on mount', async () => {
    // Mock the service response
    (ExpensesService.getExpenses as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useExpenses(mockUserId));

    // Initially, it should be loading with no data
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.expensesData).toBeNull();

    // Wait for the async operation to complete
    await waitForNextUpdate();

    // After loading, it should have data and not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.expensesData).toEqual(mockResponse);
    
    // Check that the widgetData was transformed correctly
    expect(result.current.widgetData).toHaveLength(3);
    expect(result.current.widgetData[0]).toEqual({
      period: 'daily',
      amount: 25.5,
      currency: '€',
      label: 'Aujourd\'hui'
    });
    expect(result.current.widgetData[1]).toEqual({
      period: 'weekly',
      amount: 150.75,
      currency: '€',
      label: 'Cette semaine'
    });
    expect(result.current.widgetData[2]).toEqual({
      period: 'monthly',
      amount: 750.25,
      currency: '€',
      label: 'Ce mois'
    });
  });

  it('should handle errors', async () => {
    // Mock the service error
    const mockError = new Error('Failed to fetch expenses');
    (ExpensesService.getExpenses as jest.Mock).mockRejectedValueOnce(mockError);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useExpenses(mockUserId));

    // Wait for the async operation to complete
    await waitForNextUpdate();

    // After loading, it should have an error and not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch expenses');
    expect(result.current.expensesData).toBeNull();
  });

  it('should refetch data when refetch is called', async () => {
    // Mock the service response
    (ExpensesService.getExpenses as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useExpenses(mockUserId));

    // Wait for the initial fetch to complete
    await waitForNextUpdate();

    // Mock the service response for refetch
    const updatedResponse = { ...mockResponse };
    (ExpensesService.getExpenses as jest.Mock).mockResolvedValueOnce(updatedResponse);

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // It should be loading again
    expect(result.current.isLoading).toBe(true);

    // Wait for the refetch to complete
    await waitForNextUpdate();

    // After loading, it should have updated data and not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.expensesData).toEqual(updatedResponse);
  });
});
