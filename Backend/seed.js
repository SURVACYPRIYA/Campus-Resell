const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus-resell');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();

        // Create a dummy user (seller)
        const user = await User.create({
            name: 'Alex Rivera',
            email: 'alex@university.edu',
            password: 'password123',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        });

        // Create sample products
        const products = [
            {
                title: 'MacBook Pro 2021',
                description: 'Excellent condition, 16GB RAM, 512GB SSD. Used for 1 year.',
                price: 1200,
                category: 'Electronics',
                images: ['https://images.unsplash.com/photo-1517336712461-481bf791ad7e?q=80&w=1000&auto=format&fit=crop'],
                seller: user._id
            },
            {
                title: 'Introduction to Algorithms',
                description: 'CLRS 3rd Edition. Almost new, no markings.',
                price: 45,
                category: 'Books',
                images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop'],
                seller: user._id
            },
            {
                title: 'Mountain Bike',
                description: '21-speed mountain bike, perfect for campus commute.',
                price: 150,
                category: 'Cycles',
                images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000&auto=format&fit=crop'],
                seller: user._id
            }
        ];

        await Product.insertMany(products);
        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
