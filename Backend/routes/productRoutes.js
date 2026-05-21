const express = require('express');
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

router.use(protect); // Protect all routes below

router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);

module.exports = router;
