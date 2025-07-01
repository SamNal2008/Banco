# Financial Widgets

## Purpose
Display financial widgets showing user expenses for different time periods:
- Daily expenses (today)
- Weekly expenses (last week)
- Monthly expenses (last month)

## Architecture
- Uses the `/api/v1/expenses/{userId}` endpoint to fetch expense data
- Implements a clean separation between data fetching and UI presentation
- Follows the project's design system with TailwindCSS

## Data Flow
1. `ExpensesService` fetches data from the backend API
2. `useExpenses` hook manages state and data fetching
3. `FinancialWidgets` component renders the UI with the expense data
4. Individual widget components display specific time period data

## Exposed Contracts
- `FinancialWidgets` component: Main entry point for the feature
- `ExpensesService`: Service for fetching expense data
- `useExpenses` hook: Custom hook for managing expense data state
