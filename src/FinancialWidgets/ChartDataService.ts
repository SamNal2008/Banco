/**
 * ChartDataService.ts
 * Service for fetching chart data from the API
 */
import { get } from '../services/ApiService';

export interface ChartDataPoint {
  date: string;
  actualAmount: {
    value: number;
    currency: {
      currencyCode: string;
      numericCode: number;
      numericCodeAsString: string;
      displayName: string;
      symbol: string;
      defaultFractionDigits: number;
    };
  };
  targetAmount: {
    value: number;
    currency: {
      currencyCode: string;
      numericCode: number;
      numericCodeAsString: string;
      displayName: string;
      symbol: string;
      defaultFractionDigits: number;
    };
  };
}

export interface GetChartDataResponse {
  dailyData: ChartDataPoint[];
  weeklyData: ChartDataPoint[];
  monthlyData: ChartDataPoint[];
}

export class ChartDataService {
  static async getChartData(userId: string): Promise<GetChartDataResponse> {
    return get<GetChartDataResponse>(`/chart/${userId}`);
  }

  static async getChartDataWithTargets(
    userId: string, 
    dailyTarget?: number, 
    weeklyTarget?: number, 
    monthlyTarget?: number
  ): Promise<GetChartDataResponse> {
    const params: Record<string, unknown> = {};
    if (dailyTarget !== undefined) params.dailyTarget = dailyTarget;
    if (weeklyTarget !== undefined) params.weeklyTarget = weeklyTarget;
    if (monthlyTarget !== undefined) params.monthlyTarget = monthlyTarget;
    
    return get<GetChartDataResponse>(`/chart/${userId}/custom`, params);
  }
}