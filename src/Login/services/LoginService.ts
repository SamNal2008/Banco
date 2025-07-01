/**
 * LoginService.ts
 * Service for handling login-related API calls
 */
import { AUTH_ENDPOINTS } from '../../config/environment';
import { post, ApiResponse, wrapApiCall } from '../../services/ApiService';
import { storeAuthToken } from '../../Onboarding/services/AuthService';

// Types for login requests and responses
export interface SignInRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  userEmail: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  userId: string;
  accessToken: string;
  userEmail: string;
}

/**
 * Login service functions
 */
export const LoginService = {
  /**
   * Sign in with email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise with login response containing access token
   */
  signIn: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    console.log('Calling signIn with:', { email });

    return wrapApiCall<LoginResponse>(() =>
      post<LoginResponse>(AUTH_ENDPOINTS.SIGN_IN, {
        email,
        password
      }, { authenticated: false })
    );
  },

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Promise with sign up response containing user ID and access token
   */
  signUp: async (email: string, password: string): Promise<ApiResponse<SignUpResponse>> => {
    console.log('Calling signUp with:', { email });

    return wrapApiCall<SignUpResponse>(() =>
      post<SignUpResponse>(AUTH_ENDPOINTS.SIGN_UP, {
        email,
        password
      }, { authenticated: false })
    );
  }
};

/**
 * Mock implementation for development without backend
 */
export const MockLoginService = {
  /**
   * Mock implementation of signIn
   * @param email User's email
   * @param password User's password
   * @returns Mock login response
   */
  signIn: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simulate authentication logic
    if (email === 'test@example.com' && password === 'Password123!') {
      const token = `mock_token_${Math.random().toString(36).substring(2, 15)}`;
      storeAuthToken(token);

      return {
        success: true,
        data: {
          accessToken: token,
          userId: 'mock_user_id',
          userEmail: 'mock_user_email'
        }
      };
    }

    return {
      success: false,
      error: 'Email ou mot de passe incorrect'
    };
  },

  /**
   * Mock implementation of signUp
   * @param email User's email
   * @param password User's password
   * @returns Mock sign up response
   */
  signUp: async (email: string, password: string): Promise<ApiResponse<SignUpResponse>> => {
    // Simulate API delay
    if (password === '') {
      return {
        success: false,
        error: 'Le mot de passe est requis'
      };
    }
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate user creation
    const userId = `user_${Math.random().toString(36).substring(2, 10)}`;
    const token = `mock_token_${Math.random().toString(36).substring(2, 15)}`;
    storeAuthToken(token);

    return {
      success: true,
      data: {
        userId,
        accessToken: token,
        userEmail: email
      }
    };
  }
};
