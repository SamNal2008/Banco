# Dashboard

## Purpose
The Dashboard serves as the main interface for users after login, providing an overview of their financial information and access to various features.

## Architecture
- Central hub for displaying financial information and widgets
- Integrates with other features like FinancialWidgets
- Follows the project's design system with TailwindCSS

## Data Flow
1. Dashboard component loads when a user successfully logs in
2. Dashboard fetches user information and authentication status
3. Dashboard renders child components like FinancialWidgets which fetch their own data

## Exposed Contracts
- `Dashboard` component: Main entry point for the dashboard feature
- Integrates with other features through component composition
