export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  division: 'office' | 'personal';
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  accountId?: string;
}

export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  icon: string;
  color: string;
}

export interface Account {
  _id: string;
  userId: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'credit_card';
}

export interface Transfer {
  _id: string;
  userId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  description: string;
}

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionCount: number;
  incomeChange: number;
  expenseChange: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  categories?: string[];
  divisions?: ('office' | 'personal')[];
  type?: 'income' | 'expense' | 'all';
  minAmount?: number;
  maxAmount?: number;
}