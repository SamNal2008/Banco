import { BankConnection } from '../context/OnboardingContext';
import { OnboardingService, MockOnboardingService, LinkingSession } from '../services/OnboardingService';
import { API_CONFIG } from '../../config/environment';
import { LoginService } from '../../Login/services/LoginService';
import { StorageService } from '../../services/StorageService';

// Mock Bridge Banking integration
// In a real implementation, this would interact with the Bridge Banking API

interface BridgeConfig {
  redirectUrl: string;
  onSuccess?: (connectionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export const initiateBridgeConnection = async (bank: BankConnection, config: BridgeConfig): Promise<void> => {
  try {
    // Get user email from session storage or context
    const userEmail = StorageService.getUserInfo()?.email;

    if (!userEmail) {
      throw new Error('No user email found in sessionStorage');
    }

    // For debugging
    console.log('Initiating bridge connection with:', { bank, userEmail });

    // Use a default test email if none is found (for development purposes)
    if (!userEmail) {
      console.warn('No user email found in sessionStorage, using default test email');
    }

    // Use the new onboarding initiation endpoint
    // Use mock service only if explicitly configured to do so
    const service = API_CONFIG.USE_MOCK ? MockOnboardingService : OnboardingService;
    const response = await service.initiateOnboarding(userEmail, bank.bankId);

    console.log(response);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to initiate onboarding');
    }

    const linkingSession = response.data as LinkingSession;

    // Open the URL provided by the API in a new tab
    console.log('Opening Bridge Banking URL in new tab:', linkingSession.linkingSession.url);
    window.open(linkingSession.linkingSession.url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    if (config.onError) {
      config.onError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }
};

export const handleBridgeReturn = (): {
  success: boolean;
  connectionId?: string;
  error?: string;
  bankConnection?: BankConnection;
} => {
  // In a real implementation, this would:
  // 1. Parse URL parameters from the redirect
  // 2. Validate the connection state
  // 3. Make an API call to verify the connection was successful

  // Get stored connection state
  const stateStr = sessionStorage.getItem('bridgeConnectionState');
  if (!stateStr) {
    return { success: false, error: 'No connection state found' };
  }

  try {
    const state = JSON.parse(stateStr);

    // Parse URL params (in a real app, you'd get these from the redirect URL)
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status') || 'success'; // Mock success by default
    const connectionId = urlParams.get('connection_id') || `conn_${Math.random().toString(36).substring(2, 10)}`;

    if (status === 'success') {
      // Clean up session storage
      sessionStorage.removeItem('bridgeConnectionState');

      return {
        success: true,
        connectionId,
        bankConnection: {
          bankId: state.bankId,
          bankName: state.bankName,
          connected: true,
          connectionId
        }
      };
    } else {
      return {
        success: false,
        error: urlParams.get('error') || 'Connection failed',
        bankConnection: {
          bankId: state.bankId,
          bankName: state.bankName,
          connected: false
        }
      };
    }
  } catch {
    return { success: false, error: 'Invalid connection state' };
  }
};

// Utility to check if the current page is a Bridge Banking return redirect
export const isBridgeReturn = (): boolean => {
  // In a real implementation, check for specific URL parameters that Bridge adds
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('bridge_return') || urlParams.has('status');
};
