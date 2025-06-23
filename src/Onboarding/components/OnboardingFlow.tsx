import { useEffect } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import AccountCreationStep from './AccountCreationStep';
import BankSelectionStep from './BankSelectionStep';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { isBridgeReturn, handleBridgeReturn } from '../utils/bridgeBanking';

const OnboardingFlow = () => {
  const { state, setSelectedBank, setIsRedirecting, setError } = useOnboarding();
  
  // Handle Bridge Banking return
  useEffect(() => {
    if (isBridgeReturn()) {
      const result = handleBridgeReturn();
      
      if (result.success && result.bankConnection) {
        setSelectedBank({
          ...result.bankConnection,
          connected: true
        });
      } else if (result.error) {
        setError(result.error);
      }
      
      setIsRedirecting(false);
    }
  }, [setSelectedBank, setIsRedirecting, setError]);

  // Render the current step
  const renderStep = () => {
    if (state.isRedirecting) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Redirection en cours...</h3>
          <p className="text-gray-400">
            Vous allez être redirigé vers Bridge Banking pour vous connecter à votre banque.
          </p>
        </div>
      );
    }
    
    if (state.selectedBank?.connected) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Connexion réussie !</h3>
          <p className="text-gray-400 mb-8">
            Votre compte {state.selectedBank.bankName} a été connecté avec succès.
          </p>
          <button
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium hover:scale-105"
            onClick={() => {
              // In a real app, this would redirect to the dashboard
              window.location.href = '/dashboard';
            }}
          >
            Accéder à mon tableau de bord
          </button>
        </div>
      );
    }
    
    if (state.error) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Une erreur est survenue</h3>
          <p className="text-gray-400 mb-8">{state.error}</p>
          <button
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium hover:scale-105"
            onClick={() => setError(null)}
          >
            Réessayer
          </button>
        </div>
      );
    }
    
    switch (state.currentStep) {
      case 'account-creation':
        return <AccountCreationStep />;
      case 'bank-selection':
        return <BankSelectionStep />;
      default:
        return <AccountCreationStep />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-900 h-1">
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ 
            width: state.currentStep === 'account-creation' ? '50%' : '100%' 
          }}
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
