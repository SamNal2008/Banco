/**
 * OnboardingService.ts
 * Service for handling onboarding-related API calls
 */
import { ONBOARDING_ENDPOINTS } from '../../config/environment';
import { post, ApiResponse, wrapApiCall } from '../../services/ApiService';

/**
 * Response type for the linking session
 */
export interface LinkingSession {
  linkingSession: {
    id: string;
    url: string;
  }
}



/**
 * Onboarding service functions
 */
export const OnboardingService = {
  /**
   * Initiate onboarding process
   * @param userEmail User's email address
   * @param bankId Selected bank ID
   * @returns Promise with linking session containing redirect URL
   */
  initiateOnboarding: async (userEmail: string, bankId: string): Promise<ApiResponse<LinkingSession>> => {
    console.log('Calling initiateOnboarding with:', { userEmail, bankId });

    return wrapApiCall<LinkingSession>(() =>
      post<LinkingSession>(ONBOARDING_ENDPOINTS.INITIATE, {
        userEmail,
        bankId
      }, { authenticated: false })
    );
  },
};

/**
 * Mock implementation for development without backend
 */
export const MockOnboardingService = {
  /**
   * Mock implementation of initiateOnboarding
   * @param userEmail User's email address
   * @param bankId Selected bank ID
   * @returns Mock linking session
   */
  initiateOnboarding: async (userEmail: string, bankId: string): Promise<ApiResponse<LinkingSession>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      success: true,
      data: {
        linkingSession: {
          id: `session_${Math.random().toString(36).substring(2, 10)}`,
          url: `https://bridge-banking.example.com/connect?bank=${bankId}&email=${encodeURIComponent(userEmail)}&redirect=${encodeURIComponent(window.location.origin)}/onboarding?bridge_return=true`,
        }
      },
    };
  },
};
