/**
 * Dashboard.tsx
 * Main dashboard component that displays after user login
 */
import { useState, useEffect } from 'react';
import { Banknote, User, Settings, LogOut } from 'lucide-react';
import FinancialWidgets from '../FinancialWidgets/FinancialWidgets';
import ExpenseChartWidget from '../FinancialWidgets/ExpenseChartWidget';
import { StorageService, UserInfo } from '../services/StorageService';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUserInfo = StorageService.getUserInfo();
    if (storedUserInfo && StorageService.isUserLoggedIn()) {
      setUserInfo(storedUserInfo);
    } else {
      // User not logged in or token expired, redirect to login
      window.history.pushState({}, '', '/login');
      window.location.reload();
    }
  }, []);

  const handleLogout = () => {
    StorageService.clearUserData();
    if (onLogout) {
      onLogout();
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const getDisplayName = () => {
    return userInfo.email.split('@')[0];
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-medium text-white">Banco</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-3 ml-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-white mb-2">Bonjour, {getDisplayName()}!</h1>
          <p className="text-gray-400">Voici un aperçu de vos finances</p>
        </div>

        {/* Financial Widgets Section */}
        <section className="mb-12">
          <FinancialWidgets userId={userInfo.id} />
        </section>

        {/* Chart Section */}
        <section className="mb-12">
          <ExpenseChartWidget 
            userId={userInfo.id}
            title="Évolution des dépenses"
            period="monthly"
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
