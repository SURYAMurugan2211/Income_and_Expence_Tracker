import api from './api';
import { Transaction, FilterOptions, AnalyticsSummary, CategoryBreakdown } from '../types';

export const transactionService = {
  // Get all transactions with filters
  async getTransactions(filters?: FilterOptions): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions', { params: filters });
    return response.data;
  },

  // Get single transaction
  async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  // Create transaction
  async createTransaction(transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
  },

  // Update transaction
  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await api.put<Transaction>(`/transactions/${id}`, transaction);
    return response.data;
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  // Get analytics summary
  async getAnalyticsSummary(period: 'month' | 'week' | 'year', date?: string): Promise<AnalyticsSummary> {
    const response = await api.get<AnalyticsSummary>('/analytics/summary', {
      params: { period, date },
    });
    return response.data;
  },

  // Get category breakdown
  async getCategoryBreakdown(type: 'income' | 'expense', startDate?: string, endDate?: string): Promise<CategoryBreakdown[]> {
    const response = await api.get<CategoryBreakdown[]>('/analytics/category-breakdown', {
      params: { type, startDate, endDate },
    });
    return response.data;
  },

  // Get transactions by date range
  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default transactionService;