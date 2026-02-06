const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide an account name'],
    trim: true,
  },
  balance: {
    type: Number,
    required: [true, 'Please provide initial balance'],
    default: 0,
  },
  type: {
    type: String,
    enum: ['cash', 'bank', 'credit_card'],
    required: [true, 'Please specify account type'],
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

accountSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Account', accountSchema);
