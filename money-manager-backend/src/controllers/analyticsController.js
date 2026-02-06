const Transaction = require('../models/Transaction');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const { period, date } = req.query;
    let startDate, endDate;

    const currentDate = date ? new Date(date) : new Date();

    // Calculate date range based on period
    if (period === 'month') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (period === 'week') {
      const day = currentDate.getDay();
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - day);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (period === 'year') {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
    } else {
      return res.status(400).json({ message: 'Invalid period. Use month, week, or year' });
    }

    // Get current period transactions
    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpense;
    const transactionCount = transactions.length;

    // Calculate previous period for comparison
    let prevStartDate, prevEndDate;
    if (period === 'month') {
      prevStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      prevEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    } else if (period === 'week') {
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(startDate.getDate() - 7);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(endDate.getDate() - 7);
    } else if (period === 'year') {
      prevStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
      prevEndDate = new Date(currentDate.getFullYear() - 1, 11, 31);
    }

    const prevTransactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: prevStartDate, $lte: prevEndDate },
    });

    const prevIncome = prevTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpense = prevTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentage changes
    const incomeChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : 0;

    res.json({
      totalIncome,
      totalExpense,
      netSavings,
      transactionCount,
      incomeChange: Math.round(incomeChange * 100) / 100,
      expenseChange: Math.round(expenseChange * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category breakdown
// @route   GET /api/analytics/category-breakdown
// @access  Private
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Please provide valid type (income or expense)' });
    }

    // Build query
    let query = {
      userId: req.user._id,
      type,
    };

    // Add date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Aggregate by category
    const breakdown = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    // Calculate total for percentage
    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    // Format response
    const result = breakdown.map((item) => ({
      category: item._id,
      amount: item.amount,
      count: item.count,
      percentage: total > 0 ? Math.round((item.amount / total) * 100 * 100) / 100 : 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get division breakdown
// @route   GET /api/analytics/division-breakdown
// @access  Private
exports.getDivisionBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const breakdown = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: { division: '$division', type: '$type' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weekly analytics
// @route   GET /api/analytics/weekly
// @access  Private
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const { startDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date();
    
    // Get start of week (Sunday)
    const day = start.getDay();
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - day);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: weekStart, $lte: weekEnd },
    });

    // Group by day
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      
      const dayTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === currentDay.toDateString();
      });

      const income = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      dailyData.push({
        date: currentDay.toISOString().split('T')[0],
        income,
        expense,
        net: income - expense,
      });
    }

    res.json(dailyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get yearly analytics
// @route   GET /api/analytics/yearly
// @access  Private
exports.getYearlyAnalytics = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Group by month
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === i;
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: i + 1,
        income,
        expense,
        net: income - expense,
      });
    }

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
