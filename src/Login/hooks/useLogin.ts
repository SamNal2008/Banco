import { useState } from 'react';
import { LoginService, MockLoginService } from '../services/LoginService';
import { storeAuthToken } from '../../Onboarding/services/AuthService';
import { StorageService } from '../../services/StorageService';
import { API_CONFIG } from '../../config/environment';

/**
 * Hook for handling login and sign-up functionality
 * @returns Login-related functions and state
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use mock service if configured in environment
  const service = API_CONFIG.USE_MOCK ? MockLoginService : LoginService;

  /**
   * Handle user login
   * @param email User's email
   * @param password User's password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.signIn(email, password);

      if (response.success && response.data) {
        // Store the token for authenticated requests
        storeAuthToken(response.data.accessToken);

        // Store user info and token in localStorage
        StorageService.setUserToken(response.data.accessToken);
        StorageService.setUserInfo({
          id: response.data.userId,
          email: response.data.userEmail
        });

        // Redirect to dashboard after successful login
        window.history.pushState({}, '', '/dashboard');
        window.location.reload();
      } else {
        setError(response.error || 'Une erreur est survenue lors de la connexion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user sign-up
   * @param email User's email
   * @param password User's password
   */
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.signUp(email, password);

      if (response.success && response.data) {
        // Store the token for authenticated requests
        storeAuthToken(response.data.accessToken);

        // Store user info and token in localStorage
        StorageService.setUserToken(response.data.accessToken);
        StorageService.setUserInfo({
          id: response.data.userId,
          email: response.data.userEmail
        });

        // Redirect to onboarding flow after successful sign-up
        // This preserves the URL structure and allows bank selection
        // Use URLSearchParams to ensure proper URL formatting
        const params = new URLSearchParams();
        params.append('step', 'bank-selection');

        // Redirect to onboarding with the bank-selection step
        window.location.href = `/onboarding?${params.toString()}`;
      } else {
        setError(response.error || 'Une erreur est survenue lors de la création du compte');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signUp,
    isLoading,
    error
  };
};
