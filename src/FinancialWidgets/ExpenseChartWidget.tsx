/**
 * ExpenseChartWidget.tsx
 * Chart component for visualizing expense data over time
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingDown, BarChart3 } from 'lucide-react';
import { useChartData, transformChartDataForDisplay } from './useChartData';

interface ExpenseChartWidgetProps {
  userId: string;
  title?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

const ExpenseChartWidget = ({ 
  userId,
  title = "Graphique des dépenses",
  period = 'monthly'
}: ExpenseChartWidgetProps) => {
  const { isLoading, error, chartData, refetch } = useChartData(userId);

  if (isLoading) {
    return (
      <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-white">{title}</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/30 p-6 rounded-2xl border border-red-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-medium text-white">{title}</h3>
        </div>
        <div className="h-64 flex items-center justify-center flex-col">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-white">{title}</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  // Transform data based on selected period
  const periodData = period === 'daily' ? chartData.dailyData : 
                    period === 'weekly' ? chartData.weeklyData : 
                    chartData.monthlyData;
  
  const transformedData = transformChartDataForDisplay(periodData, period);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actualAmount = payload.find((p: any) => p.dataKey === 'amount')?.value;
      const targetAmount = payload.find((p: any) => p.dataKey === 'target')?.value;
      const currency = transformedData[0]?.currency || '€';
      
      const formatValue = (value: number) => new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency === '€' ? 'EUR' : 'USD',
        maximumFractionDigits: 2,
      }).format(value);

      return (
        <div className="bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50">
          <p className="text-white font-medium mb-2">{label}</p>
          {actualAmount !== undefined && (
            <p className="text-red-400 flex items-center">
              <TrendingDown className="w-4 h-4 mr-1" />
              Réel: {formatValue(actualAmount)}
            </p>
          )}
          {targetAmount !== undefined && (
            <p className="text-blue-400 flex items-center">
              Objectif: {formatValue(targetAmount)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-medium text-white">{title}</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="label" 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
            />
            <Bar 
              dataKey="amount" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
              name="Dépenses réelles"
            />
            <Bar 
              dataKey="target" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              opacity={0.6}
              name="Objectif"
            />
            <Tooltip content={<CustomTooltip />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChartWidget;