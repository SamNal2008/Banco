/**
 * ExpensesService.ts
 * Service for fetching expense data from the backend API
 */
import { get } from '../services/ApiService';
import { GetExpensesWidgetResponse } from './types';

/**
 * Fetches expense data for a user
 * @param userId The user's UUID
 * @returns Promise with the expense data
 */
export const getExpenses = async (userId: string): Promise<GetExpensesWidgetResponse> => {
  return get<GetExpensesWidgetResponse>(`/expenses/${userId}`, undefined, { authenticated: true });
};
