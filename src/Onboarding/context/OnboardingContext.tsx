import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

// Define the types for our onboarding state
export type OnboardingStep = 'account-creation' | 'bank-selection';
export type BankConnection = {
  bankId: string;
  bankName: string;
  connected: boolean;
  connectionId?: string;
};

export type OnboardingState = {
  currentStep: OnboardingStep;
  email: string;
  password: string;
  selectedBank: BankConnection | null;
  isRedirecting: boolean;
  isLoading: boolean;
  error: string | null;
};

// Define the context type
type OnboardingContextType = {
  state: OnboardingState;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setSelectedBank: (bank: BankConnection) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  setIsRedirecting: (isRedirecting: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetOnboarding: () => void;
};

// Create the context with a default value
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Initial state for the onboarding process
const initialState: OnboardingState = {
  currentStep: 'account-creation',
  email: '',
  password: '',
  selectedBank: null,
  isRedirecting: false,
  isLoading: false,
  error: null,
};

// Provider component
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OnboardingState>(initialState);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, password }));
  }, []);

  const setSelectedBank = useCallback((bank: BankConnection) => {
    setState((prev) => ({ ...prev, selectedBank: bank }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 'account-creation') {
        return { ...prev, currentStep: 'bank-selection' };
      }
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 'bank-selection') {
        return { ...prev, currentStep: 'account-creation' };
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setIsRedirecting = useCallback((isRedirecting: boolean) => {
    setState((prev) => ({ ...prev, isRedirecting }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setState(initialState);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    state,
    setEmail,
    setPassword,
    setSelectedBank,
    nextStep,
    prevStep,
    goToStep,
    setIsRedirecting,
    setIsLoading,
    setError,
    resetOnboarding,
  }), [
    state,
    setEmail,
    setPassword,
    setSelectedBank,
    nextStep,
    prevStep,
    goToStep,
    setIsRedirecting,
    setIsLoading,
    setError,
    resetOnboarding,
  ]);

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
