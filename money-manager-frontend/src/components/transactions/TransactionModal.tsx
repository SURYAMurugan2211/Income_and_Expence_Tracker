import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Dropdown, Button } from '../common';
import api from '../../services/api';

interface Transaction {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  division: 'office' | 'personal';
  description: string;
  date: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, '_id'>) => void;
  transaction?: Transaction | null;
  mode?: 'create' | 'edit';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transaction,
  mode = 'create',
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    division: 'personal' as 'office' | 'personal',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any>({ income: [], expense: [] });
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get('/categories');
        const allCategories = response.data;
        
        // Separate income and expense categories
        const incomeCategories = allCategories
          .filter((cat: any) => cat.type === 'income' || cat.type === 'both')
          .map((cat: any) => ({
            value: cat.name,
            label: cat.name,
            icon: cat.icon || '💰'
          }));
        
        const expenseCategories = allCategories
          .filter((cat: any) => cat.type === 'expense' || cat.type === 'both')
          .map((cat: any) => ({
            value: cat.name,
            label: cat.name,
            icon: cat.icon || '💸'
          }));
        
        setCategories({ income: incomeCategories, expense: expenseCategories });
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        setCategories({
          income: [
            { value: 'Salary', label: 'Salary', icon: '💼' },
            { value: 'Freelance', label: 'Freelance', icon: '💻' },
            { value: 'Investment', label: 'Investment', icon: '📈' },
          ],
          expense: [
            { value: 'Food & Dining', label: 'Food & Dining', icon: '🍔' },
            { value: 'Transportation', label: 'Transportation', icon: '🚗' },
            { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
          ],
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Load transaction data when editing
  useEffect(() => {
    if (transaction && mode === 'edit') {
      setActiveTab(transaction.type);
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category,
        division: transaction.division,
        date: transaction.date.split('T')[0],
      });
    } else {
      // Reset form when creating new
      setFormData({
        amount: '',
        description: '',
        category: '',
        division: 'personal',
        date: new Date().toISOString().split('T')[0],
      });
      setActiveTab('expense');
    }
    setErrors({});
  }, [transaction, mode, isOpen]);

  const divisionOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'office', label: 'Office' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const transactionData: Omit<Transaction, '_id'> = {
      type: activeTab,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      division: formData.division,
      date: formData.date,
    };

    onSave(transactionData);
    onClose();
  };

  const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'edit' ? 'Update' : 'Save'} Transaction
          </Button>
        </>
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab('expense')}
          className={`
            flex-1 py-2 px-4 rounded-md font-medium transition-all
            ${activeTab === 'expense'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          Expense
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`
            flex-1 py-2 px-4 rounded-md font-medium transition-all
            ${activeTab === 'income'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          Income
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          leftIcon={<DollarIcon />}
          error={errors.amount}
          fullWidth
          required
        />

        <Input
          label="Description"
          placeholder={`What is this ${activeTab} for?`}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          fullWidth
          required
        />

        <Dropdown
          label="Category"
          options={categories[activeTab] || []}
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
          placeholder={loadingCategories ? "Loading categories..." : "Select a category"}
          error={errors.category}
          fullWidth
          disabled={loadingCategories}
        />

        <Dropdown
          label="Division"
          options={divisionOptions}
          value={formData.division}
          onChange={(value) => setFormData({ ...formData, division: value as 'office' | 'personal' })}
          fullWidth
        />

        <DatePicker
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          fullWidth
          required
        />
      </div>
    </Modal>
  );
};

export default TransactionModal;