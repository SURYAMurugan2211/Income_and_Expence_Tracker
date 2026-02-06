import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Input } from '../components/common';
import { PlusIcon } from '../components/common/Icons';
import { accountService, Account, Transfer } from '../services/accountService';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'bank' as 'cash' | 'bank' | 'credit_card',
    balance: 0,
  });

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransfers = useCallback(async () => {
    try {
      const data = await accountService.getTransfers();
      setTransfers(data.slice(0, 5)); // Get last 5 transfers
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchTransfers();
  }, [fetchAccounts, fetchTransfers]);

  const handleAddAccount = async () => {
    try {
      if (!newAccount.name.trim()) {
        alert('Please enter account name');
        return;
      }

      await accountService.createAccount(newAccount);
      setShowAddModal(false);
      setNewAccount({ name: '', type: 'bank', balance: 0 });
      fetchAccounts();
    } catch (error: any) {
      console.error('Error creating account:', error);
      alert(error.response?.data?.message || 'Failed to create account');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      await accountService.deleteAccount(id);
      fetchAccounts();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'cash': return '💵';
      case 'bank': return '🏦';
      case 'credit_card': return '💳';
      default: return '💰';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'cash': return 'Cash';
      case 'bank': return 'Bank Account';
      case 'credit_card': return 'Credit Card';
      default: return 'Account';
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'cash': return 'bg-green-500';
      case 'bank': return 'bg-blue-500';
      case 'credit_card': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN');
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
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500 mt-1">Manage your accounts and balances</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <PlusIcon size={20} />
          Add Account
        </Button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
        <p className="text-sm opacity-90 mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold mb-4">
          ₹{totalBalance.toLocaleString('en-IN')}
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <p className="opacity-75">Accounts</p>
            <p className="font-semibold">{accounts.length}</p>
          </div>
          <div className="w-px h-8 bg-white opacity-30"></div>
          <div>
            <p className="opacity-75">Active</p>
            <p className="font-semibold">{accounts.filter(a => a.balance > 0).length}</p>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${getAccountColor(account.type)} flex items-center justify-center text-2xl`}>
                  {getAccountIcon(account.type)}
                </div>
                <button 
                  onClick={() => handleDeleteAccount(account._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-600"
                  title="Delete account"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{account.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{getAccountTypeLabel(account.type)}</p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(account.balance).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No accounts yet</p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <PlusIcon size={20} />
              Create Your First Account
            </Button>
          </div>
        )}

        {/* Add Account Card */}
        {accounts.length > 0 && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center justify-center min-h-[200px] group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
              <PlusIcon size={24} className="text-gray-400 group-hover:text-primary-600" />
            </div>
            <p className="text-gray-600 group-hover:text-primary-600 font-medium transition-colors">
              Add New Account
            </p>
          </button>
        )}
      </div>

      {/* Recent Transactions by Account */}
      {transfers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transfers</h2>
          <div className="space-y-3">
            {transfers.map((transfer) => (
              <div key={transfer._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    🔄
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transfer.fromAccount.name} → {transfer.toAccount.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transfer.description || 'Transfer'} • {formatDate(transfer.date)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-blue-600">₹{transfer.amount.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Account"
      >
        <div className="space-y-4">
          <Input
            label="Account Name"
            type="text"
            value={newAccount.name}
            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
            placeholder="e.g., HDFC Savings"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={newAccount.type}
              onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank Account</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>

          <Input
            label="Initial Balance"
            type="number"
            value={newAccount.balance}
            onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddAccount}
              className="flex-1"
            >
              Add Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Accounts;