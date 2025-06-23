/**
 * environment.ts
 * Central configuration for environment variables
 */

// API configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    API_VERSION: '/api/v1',
    USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
};

// Combine base URL and API version to create the API base path
export const API_BASE_PATH = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;

// Auth endpoints
export const AUTH_ENDPOINTS = {
    SIGN_UP: `/auth/sign-up`,
    SIGN_IN: `/auth/sign-in`,
};

// Onboarding endpoints
export const ONBOARDING_ENDPOINTS = {
    RETRIEVE_AVAILABLE_BANKS: `/onboarding/available-banks`,
    INITIATE: `/onboarding/initiate`,
};

