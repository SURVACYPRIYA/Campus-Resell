// createProductWithImage.js – run with `node Backend/createProductWithImage.js`
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const { uploadImage } = require('./utils/cloudinary');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
}

(async () => {
  try {
    await connectDB();

    // Grab any existing user to act as the seller
    const seller = await User.findOne();
    if (!seller) {
      console.error('❌ No user found in DB – cannot assign seller');
      process.exit(1);
    }
    console.log('Seller ID:', seller._id);

    // Tiny transparent PNG (base64). Replace with any image you like.
    const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Rk94AAAAASUVORK5CYII=';
    const imageUrl = await uploadImage(base64);
    console.log('Uploaded image URL:', imageUrl);

    const product = await Product.create({
      title: 'Demo Product via Script',
      description: 'Automatically created product with Cloudinary image',
      price: 19.99,
      category: 'Books',
      images: [imageUrl],
      seller: seller._id,
    });

    console.log('✅ Product created:', product);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
})();
