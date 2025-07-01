/**
 * useChartData.ts
 * React hook for fetching and managing chart data
 */
import { useState, useEffect } from 'react';
import { ChartDataService, GetChartDataResponse, ChartDataPoint } from './ChartDataService';

interface UseChartDataResult {
  isLoading: boolean;
  error: string | null;
  chartData: GetChartDataResponse | null;
  refetch: () => void;
}

export const useChartData = (userId: string): UseChartDataResult => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<GetChartDataResponse | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ChartDataService.getChartData(userId);
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données du graphique');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const refetch = () => {
    fetchData();
  };

  return {
    isLoading,
    error,
    chartData,
    refetch,
  };
};

// Helper function to transform chart data for display
export const transformChartDataForDisplay = (
  data: ChartDataPoint[], 
  period: 'daily' | 'weekly' | 'monthly'
) => {
  return data.map((point, index) => ({
    period: period,
    amount: point.actualAmount.value,
    target: point.targetAmount.value,
    label: formatDateLabel(point.date, period),
    date: point.date,
    currency: point.actualAmount.currency.symbol
  }));
};

const formatDateLabel = (dateString: string, period: 'daily' | 'weekly' | 'monthly'): string => {
  const date = new Date(dateString);
  
  switch (period) {
    case 'daily':
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    case 'weekly':
      return `S${getWeekNumber(date)}`;
    case 'monthly':
      return date.toLocaleDateString('fr-FR', { month: 'short' });
    default:
      return dateString;
  }
};

const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};