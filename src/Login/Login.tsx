import { useState } from 'react';
// Utiliser des chemins relatifs complets pour résoudre les problèmes d'import
import LoginForm from '../Login/components/LoginForm';
import SignUpForm from '../Login/components/SignUpForm';
import { useLogin } from '../Login/hooks/useLogin';

/**
 * Login component that handles both login and sign-up functionality
 * Provides a toggle between login and sign-up forms
 */
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signUp, isLoading, error } = useLogin();
  
  // Handlers for login and signup
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    // Note: login function in useLogin already handles redirect
  };
  
  // Handler for signup
  const handleSignUp = async (email: string, password: string) => {
    await signUp(email, password);
    // Note: signUp function in useLogin already handles redirect to onboarding
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800/50 p-8 shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-2xl font-medium text-white">
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </h1>
          </div>

          {isLogin ? (
            <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
          ) : (
            <SignUpForm onSignUp={handleSignUp} isLoading={isLoading} error={error} />
          )}

          <div className="mt-6 text-center">
            <button
              onClick={toggleForm}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
            >
              {isLogin
                ? "Vous n'avez pas de compte ? Créer un compte"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
