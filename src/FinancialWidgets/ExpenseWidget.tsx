/**
 * ExpenseWidget.tsx
 * Individual widget component for displaying expense data for a specific time period
 */
import { ExpenseWidgetData } from './types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface ExpenseWidgetProps {
  data: ExpenseWidgetData;
  isPositive?: boolean;
}

const ExpenseWidget = ({ data, isPositive = false }: ExpenseWidgetProps) => {
  // Format the amount with proper decimal places
  const formattedAmount = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: data.currency === '€' ? 'EUR' : 'USD',
    maximumFractionDigits: 2,
  }).format(data.amount);

  return (
    <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{data.label}</h3>
        <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
        </div>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-3xl font-light text-white">{formattedAmount}</span>
      </div>
    </div>
  );
};

export default ExpenseWidget;
