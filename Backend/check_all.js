const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/campus-resell')
    .then(async () => {
        const counts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, status: { $push: '$status' } } }
        ]);
        console.log("Counts in DB:", JSON.stringify(counts, null, 2));
        const allProducts = await Product.find({});
        console.log("All products total:", allProducts.length);
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
