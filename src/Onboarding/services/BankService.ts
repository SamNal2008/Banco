/**
 * BankService.ts
 * Service for fetching bank-related data from the API
 */
import { ONBOARDING_ENDPOINTS } from '../../config/environment';
import { get } from '../../services/ApiService';

// API response format for available banks
interface AvailableBanksResponse {
  availableBanks: ApiBank[];
}

// Bank format from the API
export interface ApiBank {
  id: string;
  name: string;
  logoUrl: string;
}

// Bank format used in the application
export interface Bank {
  id: string;
  name: string;
  logo: string;
}

/**
 * Fetches the list of available banks from the API
 * @returns Promise with the list of available banks in the application format
 */
export const getAvailableBanks = async (): Promise<Bank[]> => {
  const response = await get<AvailableBanksResponse>(ONBOARDING_ENDPOINTS.RETRIEVE_AVAILABLE_BANKS, undefined, { authenticated: false });
  // Map the API response format to the application format
  return response.availableBanks.map(apiBank => ({
    id: apiBank.id,
    name: apiBank.name,
    logo: apiBank.logoUrl,
  }));
};
