import { OnboardingProvider } from './context/OnboardingContext';
import OnboardingFlow from './components/OnboardingFlow';
import { Banknote } from 'lucide-react';

const Onboarding = () => {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center">
              <a 
                href="/" 
                className="flex items-center gap-3 group cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // Rediriger vers la page d'accueil
                  window.location.href = '/';
                }}
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Banknote className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-medium text-white">Banco</span>
              </a>
            </div>
          </div>
        </header>
        
        {/* Onboarding Flow */}
        <OnboardingFlow />
      </div>
    </OnboardingProvider>
  );
};

export default Onboarding;
