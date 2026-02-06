import React from 'react';
import { formatCurrency, formatRelativeTime, canEditTransaction } from '../../utils/formatters';

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

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const isEditable = canEditTransaction(transaction.createdAt);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors group border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0
          ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}
        `}>
          {transaction.icon || (transaction.type === 'income' ? '💰' : '💸')}
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm text-gray-500">
              {transaction.category}
            </span>
            <span className="text-gray-300">•</span>
            <span className={`
              text-xs px-2 py-0.5 rounded-full font-medium
              ${transaction.division === 'office' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-purple-100 text-purple-700'
              }
            `}>
              {transaction.division}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(transaction.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center gap-4 ml-4">
        <div className="text-right">
          <p className={`
            text-lg font-bold
            {transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
          `}>
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditable && onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit transaction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          )}
          
          {!isEditable && (
            <span className="text-xs text-gray-400 italic">
              Edit locked
            </span>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(transaction._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete transaction"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;