import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';
import { Bank } from '../services/BankService';
import { useBanks } from '../hooks/useBanks';
import { initiateBridgeConnection } from '../utils/bridgeBanking';

const BankSelectionStep = () => {
  const { prevStep, setSelectedBank, setIsRedirecting, setError, state } = useOnboarding();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  
  // Fetch banks using React Query
  const { data: banks = [], isLoading, error, refetch } = useBanks();
  
  // Filter banks based on search term
  useEffect(() => {
    if (!banks.length) return;
    
    if (searchTerm.trim() === '') {
      setFilteredBanks(banks);
    } else {
      const filtered = banks.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBanks(filtered);
    }
  }, [searchTerm, banks]);

  const handleBankSelect = async (bankId: string, bankName: string) => {
    const selectedBank = {
      bankId,
      bankName,
      connected: false
    };
    
    setSelectedBank(selectedBank);
    setIsRedirecting(true);
    setError(null); // Clear any previous errors
    
    try {
      // Store the user email in session storage for the onboarding initiation
      // In a real app, this would come from the authenticated user context
      const email = state.email || 'test@example.com';
      console.log('Setting email in session storage:', email);
      sessionStorage.setItem('userEmail', email);
      
      // Use the new onboarding initiation endpoint via the bridgeBanking utility
      console.log('Initiating bridge connection for bank:', { bankId, bankName });
      await initiateBridgeConnection(selectedBank, {
        redirectUrl: `${window.location.origin}/onboarding?bridge_return=true`,
        onError: (errorMessage) => {
          console.error('Bridge connection error:', errorMessage);
          setError(errorMessage);
          setIsRedirecting(false);
        }
      });
    } catch (error) {
      console.error('Bank selection error:', error);
      setError('Une erreur est survenue lors de la connexion à votre banque');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light text-white mb-2 tracking-tight">Connectez votre banque</h2>
        <p className="text-gray-400">Sélectionnez votre banque pour commencer l'agrégation</p>
      </div>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Rechercher votre banque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Bridge Banking Info */}
      <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-1">Connexion sécurisée via Bridge Banking</h3>
            <p className="text-xs text-gray-400">
              Vous allez être redirigé vers Bridge Banking pour vous connecter à votre banque en toute sécurité. Vos identifiants bancaires ne sont jamais stockés par notre application.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bank List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-400">Chargement des banques...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-400">Impossible de récupérer la liste des banques</p>
            <button 
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filteredBanks.length > 0 ? (
          filteredBanks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankSelect(bank.id, bank.name)}
              className="w-full flex items-center justify-between p-3 bg-gray-900/30 border border-gray-800 hover:border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-900/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                  <img src={bank.logo} alt={bank.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-medium">{bank.name}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </button>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Aucune banque trouvée</p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>
    </div>
  );
};

export default BankSelectionStep;
