import React, { useState } from 'react';
import { Dropdown, DatePicker, Button } from '../common';

interface FilterPanelProps {
  onFilter: (filters: FilterState) => void;
  onReset: () => void;
}

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  category: string;
  division: 'all' | 'office' | 'personal';
  startDate: string;
  endDate: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter, onReset }) => {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    category: 'all',
    division: 'all',
    startDate: '',
    endDate: '',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const typeOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'income', label: 'Income Only' },
    { value: 'expense', label: 'Expense Only' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills' },
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
  ];

  const divisionOptions = [
    { value: 'all', label: 'All Divisions' },
    { value: 'office', label: 'Office' },
    { value: 'personal', label: 'Personal' },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      type: 'all',
      category: 'all',
      division: 'all',
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Transaction Type */}
            <Dropdown
              label="Transaction Type"
              options={typeOptions}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              fullWidth
            />

            {/* Category */}
            <Dropdown
              label="Category"
              options={categoryOptions}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              fullWidth
            />

            {/* Division */}
            <Dropdown
              label="Division"
              options={divisionOptions}
              value={filters.division}
              onChange={(value) => handleFilterChange('division', value)}
              fullWidth
            />

            {/* Start Date */}
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              fullWidth
            />

            {/* End Date */}
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              fullWidth
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="primary" onClick={handleApplyFilters} fullWidth>
              Apply Filters
            </Button>
            <Button variant="secondary" onClick={handleResetFilters} fullWidth>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;