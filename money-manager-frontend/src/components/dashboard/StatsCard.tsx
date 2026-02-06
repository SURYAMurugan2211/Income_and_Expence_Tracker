import React from 'react';

interface StatsCardProps {
  title: string;
  amount: number;
  percentageChange: number;
  icon: string;
  type: 'income' | 'expense' | 'savings';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  amount,
  percentageChange,
  icon,
  type,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const colorConfig = {
    income: {
      border: 'border-green-500',
      text: 'text-green-600',
      change: 'text-green-500',
      bg: 'bg-green-50',
    },
    expense: {
      border: 'border-red-500',
      text: 'text-red-600',
      change: 'text-red-500',
      bg: 'bg-red-50',
    },
    savings: {
      border: 'border-blue-500',
      text: 'text-blue-600',
      change: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  };

  const config = colorConfig[type];
  const isPositive = percentageChange >= 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border-t-4 ${config.border} p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      
      <p className={`text-3xl font-bold ${config.text} mb-2`}>
        {formatCurrency(amount)}
      </p>
      
      <div className="flex items-center gap-1">
        <span className={config.change}>
          {isPositive ? '↑' : '↓'}
        </span>
        <p className={`text-sm font-medium ${config.change}`}>
          {Math.abs(percentageChange)}% from last month
        </p>
      </div>
    </div>
  );
};

export default StatsCard;