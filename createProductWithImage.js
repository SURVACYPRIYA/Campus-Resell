require('dotenv').config({ path: require('path').resolve(__dirname, 'Backend/.env') });
const mongoose = require('mongoose');
const axios = require('axios'); // not used but available if needed
const Product = require('./Backend/models/Product');
const User = require('./Backend/models/User');
const { uploadImage } = require('./Backend/utils/cloudinary');

// Helper to connect to MongoDB
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected to MongoDB');
}

(async () => {
  try {
    await connectDB();

    // Find any existing user to act as the seller
    const seller = await User.findOne();
    if (!seller) {
      console.error('❌ No users found in DB – cannot assign seller');
      process.exit(1);
    }
    console.log('Seller ID:', seller._id);

    // Tiny transparent PNG (base64) – replace with any image you want
    const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Rk94AAAAASUVORK5CYII=';
    const imageUrl = await uploadImage(base64);
    console.log('Uploaded image URL:', imageUrl);

    const newProduct = await Product.create({
      title: 'Demo Product with Cloudinary Image',
      description: 'Automatic product created via script for testing Cloudinary upload.',
      price: 19.99,
      category: 'Demo',
      images: [imageUrl],
      seller: seller._id,
    });

    console.log('✅ Product created:', newProduct);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
})();
