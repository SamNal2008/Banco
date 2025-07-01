import { useState, useEffect, useCallback } from 'react';
import { Banknote, MessageCircle, Shield, ArrowRight, Mic, CreditCard } from 'lucide-react';
import Onboarding from './Onboarding/Onboarding';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import { StorageService } from './services/StorageService';

function App() {
  // Check if user is logged in and set initial view accordingly
  const getInitialView = () => {
    const isOnboarding = window.location.pathname.includes('onboarding') ||
      new URLSearchParams(window.location.search).has('bridge_return');
    const isLogin = window.location.pathname.includes('login');
    const isDashboard = window.location.pathname.includes('dashboard');
    
    // If user is trying to access dashboard, check authentication
    if (isDashboard && StorageService.isUserLoggedIn()) {
      return 'dashboard';
    }
    
    // If user is logged in but on landing/login page, redirect to dashboard
    if ((window.location.pathname === '/' || isLogin) && StorageService.isUserLoggedIn()) {
      window.history.pushState({}, '', '/dashboard');
      return 'dashboard';
    }
    
    if (isOnboarding) return 'onboarding';
    if (isLogin) return 'login';
    if (isDashboard) return 'dashboard';
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'login' | 'dashboard'>(getInitialView());

  // Fonction pour gérer la navigation par lien
  const handleOnboardingNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log('Navigating to onboarding view');
    window.history.pushState({}, '', '/onboarding');
    setCurrentView('onboarding');
  }, []);

  // Fonction pour gérer la navigation vers la page de connexion
  const handleLoginNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log('Navigating to login view');
    window.history.pushState({}, '', '/login');
    setCurrentView('login');
  }, []);

  // Gérer les changements d'URL
  useEffect(() => {
    const handlePopState = () => {
      const isOnboarding = window.location.pathname.includes('onboarding') ||
        new URLSearchParams(window.location.search).has('bridge_return');
      const isLogin = window.location.pathname.includes('login');
      const isDashboard = window.location.pathname.includes('dashboard');
      
      if (isOnboarding) {
        setCurrentView('onboarding');
      } else if (isLogin) {
        setCurrentView('login');
      } else if (isDashboard) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentView === 'onboarding') {
    return <Onboarding />;
  }
  
  if (currentView === 'login') {
    return <Login />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onLogout={() => {
      StorageService.clearUserData();
      window.history.pushState({}, '', '/');
      setCurrentView('landing');
    }} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/" 
              className="flex items-center gap-3 group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // Redirection vers la page d'accueil
                window.history.pushState({}, '', '/');
                setCurrentView('landing');
              }}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Banknote className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-medium text-white">Banco</span>
            </a>
            <a
              href="/login"
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium hover:scale-105 inline-block text-center"
              onClick={handleLoginNavigation}
            >
              Se connecter
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl lg:text-7xl font-light text-white leading-tight mb-8 tracking-tight">
                Finances
                <span className="block text-gray-400">simplifiées</span>
              </h1>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl mx-auto">
                Agrégez vos comptes bancaires et gérez vos finances avec l'intelligence vocale.
              </p>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/login"
                  className="bg-white text-black px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 flex items-center gap-3 group inline-block"
                  onClick={handleLoginNavigation}
                >
                  Commencer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a
                  href="/demo-vocale"
                  className="border border-gray-700 text-gray-300 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-900/50 hover:border-gray-600 hover:text-white transition-all duration-300 flex items-center gap-3 inline-block"
                  onClick={(e) => e.preventDefault()} /* À implémenter plus tard */
                >
                  <Mic className="w-5 h-5" />
                  Démo vocale
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse-slow animation-delay-1000 pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-white mb-6 tracking-tight">
              Trois piliers essentiels
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group cursor-pointer">
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-500 h-full backdrop-blur-sm hover:scale-105">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-500">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">
                  Agrégation
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Tous vos comptes bancaires centralisés dans une interface épurée et sécurisée.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group cursor-pointer">
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-500 h-full backdrop-blur-sm hover:scale-105">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all duration-500">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">
                  Intelligence
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Assistant vocal intelligent pour gérer vos finances naturellement.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group cursor-pointer">
              <div className="bg-gray-900/30 p-8 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-500 h-full backdrop-blur-sm hover:scale-105">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all duration-500">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-4">
                  Sécurité
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Chiffrement bancaire et conformité européenne pour vos données.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light text-white mb-8 tracking-tight">
            Prêt à commencer ?
          </h2>
          <a
            href="/onboarding"
            className="bg-white text-black px-10 py-4 rounded-xl font-medium text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl inline-block"
            onClick={handleOnboardingNavigation}
          >
            Créer un compte
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-8 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-medium text-white">Banco</span>
            </div>

            <div className="flex items-center gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">Sécurité</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Contact</a>
            </div>
          </div>

          <div className="border-t border-gray-800/50 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2025 Banco. Certifié ACPR • Agréé PSD2</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;