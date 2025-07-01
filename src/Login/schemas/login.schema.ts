import * as z from 'zod';

/**
 * Schema for login form validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'L\'email est requis' })
    .email({ message: 'Format d\'email invalide' }),
  password: z
    .string()
    .min(1, { message: 'Le mot de passe est requis' })
});

/**
 * Schema for sign-up form validation
 * Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'L\'email est requis' })
    .email({ message: 'Format d\'email invalide' }),
  password: z
    .string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
    .regex(/[!@#&()\[\]{};:',?/*~$^+=<>-]/, { 
      message: 'Le mot de passe doit contenir au moins un caractère spécial' 
    }),
  confirmPassword: z
    .string()
    .min(1, { message: 'La confirmation du mot de passe est requise' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

/**
 * Type for login form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Type for sign-up form data
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;
