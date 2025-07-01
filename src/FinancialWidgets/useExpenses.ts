/**
 * useExpenses.ts
 * Custom hook for managing expense data state
 */
import { useState, useEffect } from 'react';
import { getExpenses } from './ExpensesService';
import { GetExpensesWidgetResponse, ExpenseWidgetData } from './types';

interface UseExpensesResult {
  isLoading: boolean;
  error: string | null;
  expensesData: GetExpensesWidgetResponse | null;
  widgetData: ExpenseWidgetData[];
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing expense data
 * @param userId The user's UUID
 * @returns Object containing loading state, error, expense data, and refetch function
 */
export const useExpenses = (userId: string): UseExpensesResult => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expensesData, setExpensesData] = useState<GetExpensesWidgetResponse | null>(null);
  const [widgetData, setWidgetData] = useState<ExpenseWidgetData[]>([]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getExpenses(userId);
      setExpensesData(data);
      
      // Transform the data for easier consumption by the UI
      const transformedData: ExpenseWidgetData[] = [
        {
          period: 'daily',
          amount: calculateTotalAmount(data.dailyExpenses),
          currency: getCurrency(data.dailyExpenses),
          label: 'Aujourd\'hui'
        },
        {
          period: 'weekly',
          amount: calculateTotalAmount(data.weeklyExpenses),
          currency: getCurrency(data.weeklyExpenses),
          label: 'Cette semaine'
        },
        {
          period: 'monthly',
          amount: calculateTotalAmount(data.monthlyExpenses),
          currency: getCurrency(data.monthlyExpenses),
          label: 'Ce mois'
        }
      ];
      
      setWidgetData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des dépenses');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate total amount from expenses
  const calculateTotalAmount = (expenses: { expenses: Array<{ amount: { value: number } }> }): number => {
    return expenses.expenses.reduce((total, expense) => total + expense.amount.value, 0);
  };

  // Helper function to get currency from expenses
  const getCurrency = (expenses: { expenses: Array<{ amount: { currency: { symbol: string } } }> }): string => {
    return expenses.expenses.length > 0 ? expenses.expenses[0].amount.currency.symbol : '€';
  };

  // Fetch expenses on component mount
  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId]);

  return {
    isLoading,
    error,
    expensesData,
    widgetData,
    refetch: fetchExpenses
  };
};
