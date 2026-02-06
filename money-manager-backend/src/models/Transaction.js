const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify transaction type'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
  },
  division: {
    type: String,
    enum: ['office', 'personal'],
    required: [true, 'Please specify division'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field to check if transaction is editable (within 12 hours)
transactionSchema.virtual('isEditable').get(function () {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  return this.createdAt > twelveHoursAgo;
});

// Ensure virtuals are included in JSON
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema);
