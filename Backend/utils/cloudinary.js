require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if credentials are available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log('⚡️ Cloudinary configured');
} else {
  console.warn('⚠️ Cloudinary credentials missing – falling back to base64 storage');
}

/**
 * Uploads an image (base64 data URL) to Cloudinary.
 * If Cloudinary is not configured, returns the original string.
 * @param {string} base64Str - Base64 data URL of the image.
 * @returns {Promise<string>} - URL of uploaded image or original base64 string.
 */
async function uploadImage(base64Str) {
  // If Cloudinary is not configured, skip upload
  if (!cloudName) {
    return base64Str;
  }
  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder: 'campus_resell_products',
      resource_type: 'image'
    });
    return result.secure_url; // Return the CDN URL
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err);
    // Fallback to original data to avoid breaking flow
    return base64Str;
  }
}

module.exports = { uploadImage };
