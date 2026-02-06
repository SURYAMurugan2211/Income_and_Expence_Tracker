const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, categories, divisions, type, minAmount, maxAmount } = req.query;

    // Build query
    let query = { userId: req.user._id };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Category filter
    if (categories) {
      const categoryArray = categories.split(',');
      query.category = { $in: categoryArray };
    }

    // Division filter
    if (divisions) {
      const divisionArray = divisions.split(',');
      query.division = { $in: divisionArray };
    }

    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, category, division, description, date, accountId } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      division,
      description,
      date: date || Date.now(),
      accountId,
    });

    // Update account balance if accountId is provided
    if (accountId) {
      const account = await Account.findById(accountId);
      if (account && account.userId.toString() === req.user._id.toString()) {
        if (type === 'income') {
          account.balance += amount;
        } else {
          account.balance -= amount;
        }
        await account.save();
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if transaction is editable (within 12 hours)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    if (transaction.createdAt < twelveHoursAgo) {
      return res.status(403).json({ message: 'Transaction can only be edited within 12 hours of creation' });
    }

    // If amount or type changed, update account balance
    if (transaction.accountId && (req.body.amount || req.body.type)) {
      const account = await Account.findById(transaction.accountId);
      if (account) {
        // Reverse old transaction
        if (transaction.type === 'income') {
          account.balance -= transaction.amount;
        } else {
          account.balance += transaction.amount;
        }

        // Apply new transaction
        const newType = req.body.type || transaction.type;
        const newAmount = req.body.amount || transaction.amount;
        if (newType === 'income') {
          account.balance += newAmount;
        } else {
          account.balance -= newAmount;
        }
        await account.save();
      }
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update account balance if accountId exists
    if (transaction.accountId) {
      const account = await Account.findById(transaction.accountId);
      if (account) {
        if (transaction.type === 'income') {
          account.balance -= transaction.amount;
        } else {
          account.balance += transaction.amount;
        }
        await account.save();
      }
    }

    await transaction.deleteOne();

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transactions by date range
// @route   GET /api/transactions/date-range
// @access  Private
exports.getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both startDate and endDate' });
    }

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
