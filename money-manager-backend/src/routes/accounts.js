const express = require('express');
const {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  transferBetweenAccounts,
  getTransfers,
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getAccounts).post(protect, createAccount);

router.post('/transfer', protect, transferBetweenAccounts);
router.get('/transfers', protect, getTransfers);

router
  .route('/:id')
  .get(protect, getAccount)
  .put(protect, updateAccount)
  .delete(protect, deleteAccount);

module.exports = router;
