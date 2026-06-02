const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:id/rating', userController.getUserRating);

// Wishlist routes (Protected)
router.use(protect);
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:productId', userController.toggleWishlist);

module.exports = router;
