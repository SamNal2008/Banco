/**
 * FinancialWidgets.tsx
 * Main component for displaying financial widgets
 */
import { useExpenses } from './useExpenses';
import ExpenseWidget from './ExpenseWidget';
import { Wallet } from 'lucide-react';

interface FinancialWidgetsProps {
  userId: string;
}

const FinancialWidgets = ({ userId }: FinancialWidgetsProps) => {
  const { isLoading, error, widgetData, refetch } = useExpenses(userId);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900/30 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-medium text-white">Chargement des dépenses...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900/30 rounded-2xl border border-red-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">Erreur</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <Wallet className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-medium text-white">Vos dépenses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {widgetData.map((data) => (
          <ExpenseWidget 
            key={data.period} 
            data={data} 
            isPositive={false} // Expenses are typically negative from a budget perspective
          />
        ))}
      </div>
    </div>
  );
};

export default FinancialWidgets;
