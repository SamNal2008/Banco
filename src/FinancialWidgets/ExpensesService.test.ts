/**
 * ExpensesService.test.ts
 * Tests for the ExpensesService
 */
import { getExpenses } from './ExpensesService';
import * as ApiService from '../services/ApiService';

// Mock the ApiService
jest.mock('../services/ApiService', () => ({
  get: jest.fn()
}));

describe('ExpensesService', () => {
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

  it('should call the API with the correct endpoint and parameters', async () => {
    // Mock the API response
    (ApiService.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Call the service
    const result = await getExpenses(mockUserId);

    // Verify the API was called correctly
    expect(ApiService.get).toHaveBeenCalledWith(
      `/api/v1/expenses/${mockUserId}`,
      undefined,
      { authenticated: true }
    );

    // Verify the result
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when the API call fails', async () => {
    // Mock the API error
    const mockError = new Error('API error');
    (ApiService.get as jest.Mock).mockRejectedValueOnce(mockError);

    // Call the service and expect it to throw
    await expect(getExpenses(mockUserId)).rejects.toThrow('API error');
  });
});
