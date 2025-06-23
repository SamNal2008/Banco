/**
 * AuthService.ts
 * Handles authentication-related API calls
 */
import { AUTH_ENDPOINTS } from '../../config/environment';
import { post } from '../../services/ApiService';

// Types for authentication requests and responses
export interface SignUpRequest extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface SignUpResponse {
  accessToken: string;
}

/**
 * Signs up a new user with email and password
 * @param userData User credentials for registration
 * @returns Promise with the API response containing the access token
 */
export const signUp = async (userData: SignUpRequest): Promise<SignUpResponse> => {
  try {
    // Use the ApiService to make the request (with authenticated=false since we don't have a token yet)
    const data = await post<SignUpResponse>(AUTH_ENDPOINTS.SIGN_UP, userData, { authenticated: false });
    
    // Store the token for future authenticated requests
    storeAuthToken(data.accessToken);
    
    return data;
  } catch (error) {
    // Rethrow with a user-friendly message
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Une erreur est survenue lors de la création du compte'
    );
  }
};

/**
 * Stores the authentication token for future use
 * @param token The access token to store
 */
export const storeAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Retrieves the stored authentication token
 * @returns The stored token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Clears the stored authentication token
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Creates headers with authentication token for API requests
 * @returns Headers object with Authorization header if token exists
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
