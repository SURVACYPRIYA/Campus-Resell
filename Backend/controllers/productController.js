const Product = require('../models/Product');
const { uploadImage } = require('../utils/cloudinary');

exports.createProduct = async (req, res) => {
    try {
        let { title, description, price, category, images } = req.body;
        // Upload any base64 images to Cloudinary (fallback to original data if not configured)
        if (Array.isArray(images) && images.length > 0) {
            images = await Promise.all(images.map(img => uploadImage(img)));
        }
        const product = await Product.create({
            title,
            description,
            price,
            category,
            images,
            seller: req.user._id
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

        if (req.query.buyer) {
            query.buyer = req.query.buyer;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        console.log("getAllProducts query:", query);

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

        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }

        const updateData = { ...req.body };
        // Handle image uploads if images array is provided
        if (Array.isArray(updateData.images) && updateData.images.length > 0) {
            updateData.images = await Promise.all(
                updateData.images.map(img => (typeof img === 'string' && img.startsWith('data:') ? uploadImage(img) : img))
            );
        }
        if (updateData.status === 'available') {
            updateData.$unset = { buyer: 1 };
            delete updateData.buyer;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
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

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Only the seller or admin can delete
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this product' });
        }

        // Clean up related chats and messages
        const Chat = require('../models/Chat');
        const Message = require('../models/Message');
        const relatedChats = await Chat.find({ product: req.params.id });
        const chatIds = relatedChats.map(c => c._id);
        if (chatIds.length > 0) {
            await Message.deleteMany({ chat: { $in: chatIds } });
            await Chat.deleteMany({ product: req.params.id });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify the product is sold and the current user is the buyer
        if (product.status !== 'sold' || !product.buyer) {
            return res.status(400).json({ message: 'Product has not been sold yet' });
        }

        if (product.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the buyer can review this product' });
        }

        // Add the review
        product.rating = Number(rating);
        if (reviewText) {
            product.reviewText = reviewText;
        }

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCategoryCounts = async (req, res) => {
    try {
        const counts = await Product.aggregate([
            { $match: { status: 'available' } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const countsMap = {
            Books: 0,
            Electronics: 0,
            Cycles: 0,
            Others: 0
        };

        counts.forEach(item => {
            if (item._id && item._id in countsMap) {
                countsMap[item._id] = item.count;
            }
        });

        res.status(200).json({
            status: 'success',
            data: countsMap
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
