const express = require('express');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDateRange,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, createTransaction);

router.route('/date-range').get(protect, getTransactionsByDateRange);

router
  .route('/:id')
  .get(protect, getTransaction)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
