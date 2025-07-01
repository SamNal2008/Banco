# Login

## Purpose
Gérer l'authentification des utilisateurs avec deux fonctionnalités principales :
- Connexion (sign-in) pour les utilisateurs existants
- Création de compte (sign-up) pour les nouveaux utilisateurs

## Architecture
- Utilise les endpoints `/api/v1/auth/sign-in` et `/api/v1/auth/sign-up` du backend
- Implémente une séparation claire entre les appels API, la logique métier et l'interface utilisateur
- Suit les principes de Clean Architecture avec une structure modulaire
- Organisation des fichiers selon le principe de Screaming Architecture

## Structure
```
/Login
├── Login.md                  # Documentation de la fonctionnalité
├── Login.tsx                 # Composant principal
├── Login.integration.test.tsx # Tests d'intégration
├── components/
│   ├── LoginForm.tsx         # Formulaire de connexion
│   ├── LoginForm.test.tsx    # Tests unitaires du formulaire de connexion
│   └── SignUpForm.tsx        # Formulaire de création de compte
├── services/
│   ├── LoginService.ts       # Service d'appels API d'authentification
│   └── LoginService.test.ts  # Tests unitaires du service
├── hooks/
│   └── useLogin.ts           # Hook de gestion d'état et logique
└── schemas/
    └── login.schema.ts       # Schémas de validation
```

## Data Flow
1. `LoginService` gère les appels API d'authentification
2. `useLogin` hook centralise la logique d'authentification et la gestion d'état
3. `LoginForm` et `SignUpForm` composants pour l'interface utilisateur
4. Les schémas de validation garantissent l'intégrité des données
5. Après authentification réussie, l'utilisateur est redirigé vers la page d'accueil

## Exposed Contracts
- `Login` component: Point d'entrée principal de la fonctionnalité
- `LoginService`: Service pour les appels API d'authentification
- `useLogin` hook: Hook personnalisé pour gérer l'état d'authentification
- `login.schema`: Schémas de validation pour les formulaires

## Sécurité
- Validation des mots de passe avec des règles strictes (8 caractères min., majuscule, minuscule, chiffre, caractère spécial)
- Stockage sécurisé du token d'authentification dans le localStorage
- Gestion des erreurs d'authentification avec feedback utilisateur
- Validation côté client et côté serveur

## Tests
- Tests unitaires pour les composants et services
- Tests d'intégration pour valider le flux complet d'authentification
- Mocks pour simuler les appels API pendant les tests

## Mode Mock
- Implémentation de services mock pour le développement sans backend
- Configurable via la variable d'environnement `VITE_USE_MOCK`
