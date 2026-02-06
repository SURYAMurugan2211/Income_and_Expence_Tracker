const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  // Income categories
  { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: '💼', color: '#059669' },
  { name: 'Investment', type: 'income', icon: '📈', color: '#34d399' },
  { name: 'Business', type: 'income', icon: '🏢', color: '#6ee7b7' },
  { name: 'Gift', type: 'income', icon: '🎁', color: '#a7f3d0' },
  { name: 'Other Income', type: 'income', icon: '💵', color: '#d1fae5' },

  // Expense categories
  { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
  { name: 'Transportation', type: 'expense', icon: '🚗', color: '#dc2626' },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#f87171' },
  { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#fca5a5' },
  { name: 'Bills & Utilities', type: 'expense', icon: '📄', color: '#f59e0b' },
  { name: 'Healthcare', type: 'expense', icon: '🏥', color: '#ec4899' },
  { name: 'Education', type: 'expense', icon: '📚', color: '#8b5cf6' },
  { name: 'Travel', type: 'expense', icon: '✈️', color: '#3b82f6' },
  { name: 'Rent', type: 'expense', icon: '🏠', color: '#6366f1' },
  { name: 'Insurance', type: 'expense', icon: '🛡️', color: '#14b8a6' },
  { name: 'Groceries', type: 'expense', icon: '🛒', color: '#22c55e' },
  { name: 'Fitness', type: 'expense', icon: '💪', color: '#84cc16' },
  { name: 'Personal Care', type: 'expense', icon: '💇', color: '#f43f5e' },
  { name: 'Subscriptions', type: 'expense', icon: '📱', color: '#a855f7' },
  { name: 'Other Expense', type: 'expense', icon: '💸', color: '#64748b' },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Connected');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Existing categories cleared');

    // Insert new categories
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
