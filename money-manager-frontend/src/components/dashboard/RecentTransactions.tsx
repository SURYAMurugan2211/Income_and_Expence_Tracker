import React from 'react';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  division: 'office' | 'personal';
  description: string;
  date: string;
  icon?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  onViewAll?: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions = [],
  onViewAll 
}) => {
  // Sample data if no transactions provided
  const sampleTransactions: Transaction[] = [
    {
      _id: '1',
      type: 'expense',
      amount: 1250,
      category: 'Food',
      division: 'personal',
      description: 'Grocery Shopping',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: '🍔',
    },
    {
      _id: '2',
      type: 'expense',
      amount: 850,
      category: 'Transport',
      division: 'office',
      description: 'Uber to Office',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      icon: '🚗',
    },
    {
      _id: '3',
      type: 'income',
      amount: 45000,
      category: 'Salary',
      division: 'office',
      description: 'Monthly Salary',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      icon: '💼',
    },
    {
      _id: '4',
      type: 'expense',
      amount: 2500,
      category: 'Shopping',
      division: 'personal',
      description: 'New Headphones',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '🛍️',
    },
    {
      _id: '5',
      type: 'expense',
      amount: 500,
      category: 'Entertainment',
      division: 'personal',
      description: 'Movie Tickets',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '🎬',
    },
  ];

  const displayTransactions = transactions.length > 0 ? transactions : sampleTransactions;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
              `}>
                {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {transaction.category}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${transaction.division === 'office' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                    }
                  `}>
                    {transaction.division}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(transaction.date)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right ml-4">
              <p className={`
                text-lg font-bold
                ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
              `}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
              <button className="text-xs text-gray-400 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Start by adding your first transaction</p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;