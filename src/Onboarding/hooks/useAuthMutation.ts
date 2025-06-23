/**
 * useAuthMutation.ts
 * Custom hook for authentication mutations using TanStack Query
 */

import { useMutation } from '@tanstack/react-query';
import { SignUpRequest, SignUpResponse, signUp } from '../services/AuthService';

interface UseSignUpMutationOptions {
  onSuccess?: (data: SignUpResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for user registration mutation
 * @param options Success and error callbacks
 * @returns TanStack Query mutation object
 */
export const useSignUpMutation = (options?: UseSignUpMutationOptions) => {
  return useMutation({
    mutationFn: (userData: SignUpRequest) => signUp(userData),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
