import React from 'react';
import TransactionItem from './TransactionItem';

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

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or add a new transaction
          </p>
        </div>
      </div>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
        <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Date Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{date}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {dateTransactions.length} transaction{dateTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Transactions */}
          <div className="divide-y divide-gray-100">
            {dateTransactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;