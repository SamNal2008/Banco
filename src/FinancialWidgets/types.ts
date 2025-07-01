/**
 * Types for the Financial Widgets feature
 * Based on the API schema from backend-swagger.json
 */

export interface Amount {
  value: number;
  currency: {
    currencyCode: string;
    numericCode: number;
    numericCodeAsString: string;
    displayName: string;
    symbol: string;
    defaultFractionDigits: number;
  };
}

export interface Expense {
  amount: Amount;
}

export interface Expenses {
  expenses: Expense[];
}

export interface GetExpensesWidgetResponse {
  dailyExpenses: Expenses;
  weeklyExpenses: Expenses;
  monthlyExpenses: Expenses;
}

// Helper type for the widget display
export interface ExpenseWidgetData {
  period: 'daily' | 'weekly' | 'monthly';
  amount: number;
  currency: string;
  label: string;
}
