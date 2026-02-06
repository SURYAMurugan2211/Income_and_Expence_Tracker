const Account = require('../models/Account');
const Transfer = require('../models/Transfer');

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create account
// @route   POST /api/accounts
// @access  Private
exports.createAccount = async (req, res) => {
  try {
    const { name, balance, type } = req.body;

    const account = await Account.create({
      userId: req.user._id,
      name,
      balance: balance || 0,
      type,
    });

    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (account.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await account.deleteOne();
    res.json({ message: 'Account removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Transfer between accounts
// @route   POST /api/accounts/transfer
// @access  Private
exports.transferBetweenAccounts = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount, description, date } = req.body;

    if (!fromAccount || !toAccount || !amount) {
      return res.status(400).json({ message: 'Please provide fromAccount, toAccount, and amount' });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({ message: 'Cannot transfer to the same account' });
    }

    // Get both accounts
    const sourceAccount = await Account.findById(fromAccount);
    const destinationAccount = await Account.findById(toAccount);

    if (!sourceAccount || !destinationAccount) {
      return res.status(404).json({ message: 'One or both accounts not found' });
    }

    // Check ownership
    if (
      sourceAccount.userId.toString() !== req.user._id.toString() ||
      destinationAccount.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check sufficient balance
    if (sourceAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance in source account' });
    }

    // Create transfer record
    const transfer = await Transfer.create({
      userId: req.user._id,
      fromAccount,
      toAccount,
      amount,
      description: description || '',
      date: date || Date.now(),
    });

    // Update balances
    sourceAccount.balance -= amount;
    destinationAccount.balance += amount;

    await sourceAccount.save();
    await destinationAccount.save();

    res.status(201).json({
      transfer,
      sourceAccount,
      destinationAccount,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get transfer history
// @route   GET /api/accounts/transfers
// @access  Private
exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({ userId: req.user._id })
      .populate('fromAccount', 'name type')
      .populate('toAccount', 'name type')
      .sort({ date: -1 });

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
