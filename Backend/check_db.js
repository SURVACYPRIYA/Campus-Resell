const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/campus-resell')
    .then(async () => {
        const products = await Product.find({ title: 'pen' }).populate('seller buyer');
        console.log(JSON.stringify(products, null, 2));
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
