/**
 * ApiService.ts
 * Utility service for making API requests with authentication using Axios
 * Also provides standardized response handling
 */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken } from '../Onboarding/services/AuthService';
import { API_BASE_PATH } from '../config/environment';

interface ApiOptions {
  headers?: Record<string, string>;
  authenticated?: boolean;
  params?: Record<string, string>;
  timeout?: number;
}

// Extended Axios request config with our custom properties
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  authenticated?: boolean;
}

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_PATH,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token when needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Cast to our extended config type
    const extendedConfig = config as ExtendedAxiosRequestConfig;
    
    // If the request should be authenticated and we have a token
    if (extendedConfig.authenticated !== false) {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Makes an API request with optional authentication using Axios
 * @param url The URL to make the request to
 * @param method The HTTP method to use
 * @param data Optional request body data
 * @param options Additional request options
 * @returns Promise with the response data
 */
export const apiRequest = async <T>(
  url: string, 
  method: string = 'GET',
  data?: Record<string, unknown>,
  options: ApiOptions = {}
): Promise<T> => {
  try {
    // Log the API request for debugging
    console.log(`Making API request to: ${API_BASE_PATH}${url}`);
    
    const config: ExtendedAxiosRequestConfig = {
      url,  // Axios will prepend baseURL automatically
      method,
      ...options,
    };
    
    // Add data to request if provided
    if (data) {
      if (method.toUpperCase() === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }
    }
    
    const response: AxiosResponse<T> = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      // Extract error message from response if available
      const errorMessage = axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
        ? String(axiosError.response.data.message)
        : `Error ${axiosError.response?.status}: ${axiosError.message}`;
      throw new Error(errorMessage);
    }
    // Re-throw if it's not an Axios error
    throw error;
  }
};

/**
 * Convenience method for GET requests
 */
export const get = <T>(url: string, params?: Record<string, unknown>, options: ApiOptions = {}): Promise<T> => {
  return apiRequest<T>(url, 'GET', params, options);
};

/**
 * Convenience method for POST requests
 */
export const post = <T>(url: string, data: Record<string, unknown>, options: ApiOptions = {}): Promise<T> => {
  return apiRequest<T>(url, 'POST', data, options);
};

/**
 * Convenience method for PUT requests
 */
export const put = <T>(url: string, data: Record<string, unknown>, options: ApiOptions = {}): Promise<T> => {
  return apiRequest<T>(url, 'PUT', data, options);
};

/**
 * Convenience method for DELETE requests
 */
export const del = <T>(url: string, data?: Record<string, unknown>, options: ApiOptions = {}): Promise<T> => {
  return apiRequest<T>(url, 'DELETE', data, options);
};

/**
 * Convenience method for PATCH requests
 */
export const patch = <T>(url: string, data: Record<string, unknown>, options: ApiOptions = {}): Promise<T> => {
  return apiRequest<T>(url, 'PATCH', data, options);
};

/**
 * Standard API response format used throughout the application
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Helper function to standardize API responses
 * Wraps the ApiService calls to maintain the ApiResponse format expected by the app
 */
export const wrapApiCall = async <T>(
  apiCallFn: () => Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCallFn();
    console.log('API response:', response);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    // Amélioration de la journalisation des erreurs
    if (axios.isAxiosError(error)) {
      console.error('API call error (Axios):', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
    } else {
      console.error('API call error (Non-Axios):', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error);
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion au serveur',
    };
  }
};
