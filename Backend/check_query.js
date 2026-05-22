const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/campus-resell')
    .then(async () => {
        const userId = '6a06b6f14ba9b49af22d8158'; // priya's ID
        const products = await Product.find({ buyer: userId, status: 'sold' }).populate('seller buyer');
        console.log("Purchases:", products.length);
        const allProducts = await Product.find({ status: 'sold' });
        console.log("All sold products:", allProducts.length);
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
