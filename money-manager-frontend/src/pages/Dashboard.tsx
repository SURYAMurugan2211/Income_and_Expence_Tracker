import React, { useState, useEffect, useCallback } from 'react';
import { StatsCard, Chart, CategoryPieChart, RecentTransactions } from '../components/dashboard';
import { transactionService } from '../services/transactionService';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch analytics summary
      const analyticsData = await transactionService.getAnalyticsSummary('month');
      setAnalytics(analyticsData);

      // Fetch recent transactions
      const transactionsData = await transactionService.getTransactions();
      setTransactions(transactionsData.slice(0, 5)); // Get last 5 transactions
      
      // Fetch category breakdown for pie chart
      const breakdown = await transactionService.getCategoryBreakdown('expense');
      setCategoryBreakdown(breakdown);
      
      // Fetch yearly data for line chart
      try {
        const response = await api.get('/analytics/yearly?year=' + new Date().getFullYear());
        setYearlyData(response.data);
      } catch (error) {
        console.error('Error fetching yearly data:', error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Income"
          amount={analytics?.totalIncome || 0}
          percentageChange={analytics?.incomeChange || 0}
          icon="📈"
          type="income"
        />
        <StatsCard
          title="Total Expense"
          amount={analytics?.totalExpense || 0}
          percentageChange={analytics?.expenseChange || 0}
          icon="📉"
          type="expense"
        />
        <StatsCard
          title="Net Savings"
          amount={analytics?.netSavings || 0}
          percentageChange={
            analytics?.totalIncome > 0
              ? parseFloat(((analytics?.netSavings / analytics?.totalIncome) * 100).toFixed(1))
              : 0
          }
          icon="💎"
          type="savings"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart 
          type="line" 
          title="Income vs Expense Trend"
          data={{
            labels: yearlyData.map((d: any) => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return months[d.month - 1];
            }),
            income: yearlyData.map((d: any) => d.income),
            expense: yearlyData.map((d: any) => d.expense),
          }}
        />
        <CategoryPieChart 
          type="doughnut" 
          title="Expense Breakdown by Category"
          data={{
            labels: categoryBreakdown.map((c: any) => c.category),
            values: categoryBreakdown.map((c: any) => c.amount),
          }}
        />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions 
        transactions={transactions}
        onViewAll={() => window.location.href = '/transactions'} 
      />
    </div>
  );
};

export default Dashboard;