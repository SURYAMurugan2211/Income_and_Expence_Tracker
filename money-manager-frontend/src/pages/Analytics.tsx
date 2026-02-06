import React, { useState, useEffect, useCallback } from 'react';
import { Chart, CategoryPieChart } from '../components/dashboard';
import { Dropdown } from '../components/common';
import { transactionService } from '../services/transactionService';
import api from '../services/api';

const Analytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [analytics, setAnalytics] = useState<any>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const analyticsData = await transactionService.getAnalyticsSummary(timePeriod as any);
      setAnalytics(analyticsData);

      // Fetch category breakdown for expenses
      const expenseBreakdown = await transactionService.getCategoryBreakdown('expense');
      setCategoryBreakdown(expenseBreakdown);
      
      // Fetch category breakdown for income
      const incomeBreakdownData = await transactionService.getCategoryBreakdown('income');
      setIncomeBreakdown(incomeBreakdownData);

      // Fetch yearly data for charts
      try {
        const yearlyResponse = await api.get('/analytics/yearly?year=' + new Date().getFullYear());
        setYearlyData(yearlyResponse.data);
      } catch (error) {
        console.error('Error fetching yearly data:', error);
        setYearlyData([]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const savingsRate = analytics?.totalIncome > 0 
    ? ((analytics.netSavings / analytics.totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your financial trends and patterns</p>
        </div>
        <Dropdown
          options={periodOptions}
          value={timePeriod}
          onChange={setTimePeriod}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">₹{analytics?.totalIncome?.toLocaleString('en-IN') || 0}</p>
          <p className="text-xs text-gray-400 mt-1">this {timePeriod}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Expense</p>
          <p className="text-2xl font-bold text-red-600">₹{analytics?.totalExpense?.toLocaleString('en-IN') || 0}</p>
          <p className="text-xs text-gray-400 mt-1">this {timePeriod}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
          <p className="text-2xl font-bold text-blue-600">{savingsRate}%</p>
          <p className="text-xs text-gray-400 mt-1">of income</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{analytics?.transactionCount || 0}</p>
          <p className="text-xs text-gray-400 mt-1">this {timePeriod}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart 
          type="line" 
          title="Monthly Income vs Expense"
          data={{
            labels: yearlyData.length > 0 
              ? yearlyData.map((d: any) => {
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return months[d.month - 1];
                })
              : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            income: yearlyData.length > 0 
              ? yearlyData.map((d: any) => d.income)
              : Array(12).fill(0),
            expense: yearlyData.length > 0 
              ? yearlyData.map((d: any) => d.expense)
              : Array(12).fill(0),
          }}
        />
        <Chart 
          type="bar" 
          title="Category-wise Comparison"
          data={{
            labels: categoryBreakdown.length > 0 
              ? categoryBreakdown.slice(0, 6).map((c: any) => c.category)
              : ['No Data'],
            income: Array(categoryBreakdown.length > 0 ? categoryBreakdown.slice(0, 6).length : 1).fill(0),
            expense: categoryBreakdown.length > 0 
              ? categoryBreakdown.slice(0, 6).map((c: any) => c.amount)
              : [0],
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart 
          type="doughnut" 
          title="Income Sources"
          data={{
            labels: incomeBreakdown.length > 0 
              ? incomeBreakdown.map((c: any) => c.category)
              : ['No Data'],
            values: incomeBreakdown.length > 0 
              ? incomeBreakdown.map((c: any) => c.amount)
              : [1],
          }}
        />
        <CategoryPieChart 
          type="pie" 
          title="Expense Categories"
          data={{
            labels: categoryBreakdown.length > 0 
              ? categoryBreakdown.map((c: any) => c.category)
              : ['No Data'],
            values: categoryBreakdown.length > 0 
              ? categoryBreakdown.map((c: any) => c.amount)
              : [1],
          }}
        />
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Spending Categories</h2>
        {categoryBreakdown.length > 0 ? (
          <div className="space-y-4">
            {categoryBreakdown.slice(0, 5).map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{category.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{category.count} transactions • {category.percentage}%</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No expense data available</p>
            <p className="text-sm mt-1">Start adding transactions to see analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;