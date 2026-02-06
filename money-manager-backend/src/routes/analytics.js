const express = require('express');
const {
  getAnalyticsSummary,
  getCategoryBreakdown,
  getDivisionBreakdown,
  getWeeklyAnalytics,
  getYearlyAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', protect, getAnalyticsSummary);
router.get('/category-breakdown', protect, getCategoryBreakdown);
router.get('/division-breakdown', protect, getDivisionBreakdown);
router.get('/weekly', protect, getWeeklyAnalytics);
router.get('/yearly', protect, getYearlyAnalytics);

module.exports = router;
