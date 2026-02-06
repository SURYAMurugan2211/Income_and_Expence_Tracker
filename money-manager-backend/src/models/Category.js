const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    required: [true, 'Please specify category type'],
  },
  icon: {
    type: String,
    default: 'default',
  },
  color: {
    type: String,
    default: '#6366f1',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Category', categorySchema);
