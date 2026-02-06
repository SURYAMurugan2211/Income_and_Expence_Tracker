import React, { useState, useEffect, useCallback } from 'react';
import { 
  TransactionModal, 
  TransactionList, 
  FilterPanel,
  FilterState 
} from '../components/transactions';
import { Button } from '../components/common';
import { PlusIcon } from '../components/common/Icons';
import { transactionService } from '../services/transactionService';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  division: 'office' | 'personal';
  description: string;
  date: string;
  createdAt: string;
  icon?: string;
}

const Transactions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    category: 'all',
    division: 'all',
    startDate: '',
    endDate: '',
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // Convert FilterState to API parameters
      const apiFilters: any = {};
      
      if (filters.type && filters.type !== 'all') {
        apiFilters.type = filters.type;
      }
      if (filters.category && filters.category !== 'all') {
        apiFilters.categories = filters.category;
      }
      if (filters.division && filters.division !== 'all') {
        apiFilters.divisions = filters.division;
      }
      if (filters.startDate) {
        apiFilters.startDate = filters.startDate;
      }
      if (filters.endDate) {
        apiFilters.endDate = filters.endDate;
      }
      
      const data = await transactionService.getTransactions(apiFilters);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = () => {
    setModalMode('create');
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setModalMode('edit');
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    try {
      await transactionService.deleteTransaction(id);
      fetchTransactions(); // Refresh list
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      if (modalMode === 'edit' && selectedTransaction) {
        await transactionService.updateTransaction(selectedTransaction._id, transactionData);
      } else {
        await transactionService.createTransaction(transactionData);
      }
      setIsModalOpen(false);
      fetchTransactions(); // Refresh list
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction');
    }
  };

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      division: 'all',
      startDate: '',
      endDate: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage your income and expenses</p>
        </div>
        <Button variant="primary" onClick={handleAddTransaction}>
          <PlusIcon size={20} />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <FilterPanel onFilter={handleFilter} onReset={handleResetFilters} />

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={selectedTransaction}
        mode={modalMode}
      />
    </div>
  );
};

export default Transactions;