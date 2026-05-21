const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, category, images } = req.body;
        
        const product = await Product.create({
            title,
            description,
            price,
            category,
            images,
            seller: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category, search, seller, status } = req.query;
        let query = {};

        if (status === 'all') {
            // No status filter
        } else if (status) {
            query.status = status;
        } else {
            query.status = 'available'; // Default behavior
        }

        if (seller) {
            query.seller = seller;
        }

        if (category) {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).populate('seller', 'name avatar');

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name avatar email');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { product: updatedProduct }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
