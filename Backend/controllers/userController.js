const Product = require('../models/Product');
const User = require('../models/User');

exports.getUserRating = async (req, res) => {
    try {
        const userId = req.params.id;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all reviews for this seller
        const reviews = await Product.find({
            seller: user._id,
            rating: { $exists: true, $ne: null }
        })
        .populate('buyer', 'name avatar')
        .select('title rating reviewText createdAt buyer')
        .sort('-createdAt');

        let averageRating = 0;
        const totalRatings = reviews.length;

        if (totalRatings > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = Math.round((sum / totalRatings) * 10) / 10;
        }

        res.status(200).json({
            status: 'success',
            data: {
                averageRating,
                totalRatings,
                reviews
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
