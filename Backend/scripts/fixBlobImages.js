/**
 * fixBlobImages.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Scans every product in MongoDB Atlas and replaces any blob:// URL (which only
 * ever worked in the uploader's browser session) with a clean placeholder SVG
 * so the listing is at least visible to buyers.
 *
 * Run once with:  node scripts/fixBlobImages.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const PLACEHOLDER =
  'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Not+Available';

async function run() {
  console.log('🔗 Connecting to MongoDB Atlas…');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected.\n');

  // Find products that have at least one blob:// URL in their images array
  const broken = await Product.find({ images: /^blob:/ });
  console.log(`🔍 Found ${broken.length} product(s) with broken blob:// images.\n`);

  let fixed = 0;

  for (const product of broken) {
    const cleanedImages = product.images.map((url) =>
      url.startsWith('blob:') ? PLACEHOLDER : url
    );

    // If ALL images were blobs, keep the single placeholder; otherwise keep real ones
    const finalImages = cleanedImages.every((u) => u === PLACEHOLDER)
      ? [PLACEHOLDER]
      : cleanedImages.filter((u) => u !== PLACEHOLDER);

    await Product.findByIdAndUpdate(product._id, { images: finalImages });
    console.log(`  ✔ Fixed: "${product.title}" (ID: ${product._id})`);
    fixed++;
  }

  console.log(`\n🎉 Done! Fixed ${fixed} product(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
