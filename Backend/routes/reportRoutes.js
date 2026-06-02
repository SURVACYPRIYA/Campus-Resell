const express = require('express');
const reportController = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', reportController.createReport);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/', reportController.getAllReports);
router.patch('/:id/resolve', reportController.resolveReport);

module.exports = router;
