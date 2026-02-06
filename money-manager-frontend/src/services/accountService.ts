import api from './api';

export interface Account {
  _id: string;
  userId: string;
  name: string;
  type: 'cash' | 'bank' | 'credit_card';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  _id: string;
  userId: string;
  fromAccount: {
    _id: string;
    name: string;
    type: string;
  };
  toAccount: {
    _id: string;
    name: string;
    type: string;
  };
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface CreateAccountData {
  name: string;
  type: 'cash' | 'bank' | 'credit_card';
  balance?: number;
}

export interface TransferData {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
  date?: string;
}

export const accountService = {
  // Get all accounts
  async getAccounts(): Promise<Account[]> {
    const response = await api.get<Account[]>('/accounts');
    return response.data;
  },

  // Get single account
  async getAccount(id: string): Promise<Account> {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  // Create account
  async createAccount(data: CreateAccountData): Promise<Account> {
    const response = await api.post<Account>('/accounts', data);
    return response.data;
  },

  // Update account
  async updateAccount(id: string, data: Partial<CreateAccountData>): Promise<Account> {
    const response = await api.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  // Delete account
  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },

  // Transfer between accounts
  async transferBetweenAccounts(data: TransferData): Promise<{
    transfer: Transfer;
    sourceAccount: Account;
    destinationAccount: Account;
  }> {
    const response = await api.post('/accounts/transfer', data);
    return response.data;
  },

  // Get transfer history
  async getTransfers(): Promise<Transfer[]> {
    const response = await api.get<Transfer[]>('/accounts/transfers');
    return response.data;
  },
};

export default accountService;
