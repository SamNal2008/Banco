import { z } from 'zod';

// User schema for account creation validation
export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule et un chiffre'
    )
});

export type UserFormData = z.infer<typeof userSchema>;

// Bank selection schema
export const bankSchema = z.object({
  bankId: z.string().min(1, 'Veuillez sélectionner une banque'),
  bankName: z.string().min(1, 'Veuillez sélectionner une banque')
});

export type BankFormData = z.infer<typeof bankSchema>;
