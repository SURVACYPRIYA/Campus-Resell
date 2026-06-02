const express = require('express');
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', chatController.getChats);
router.post('/', chatController.createChat);
router.get('/:chatId/messages', chatController.getMessages);
router.delete('/:chatId', chatController.deleteChat);
router.get('/product/:productId/buyers', chatController.getInterestedBuyers);
router.post('/:chatId/read', chatController.markAsRead);

module.exports = router;
