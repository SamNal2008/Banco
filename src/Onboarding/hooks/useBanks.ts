/**
 * useBanks.ts
 * Custom hook for fetching available banks using React Query
 */
import { useQuery } from '@tanstack/react-query';
import { getAvailableBanks, Bank } from '../services/BankService';

export const BANKS_QUERY_KEY = ['available-banks'];

/**
 * Hook for fetching available banks
 * @returns React Query result with banks data, loading state, and error handling
 */
export const useBanks = () => {
  return useQuery<Bank[], Error>({
    queryKey: BANKS_QUERY_KEY,
    queryFn: getAvailableBanks,
  });
};
