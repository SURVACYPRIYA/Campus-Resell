require('dotenv').config({ path: './Backend/.env' });
console.log('DEBUG CLOUDINARY_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
const { uploadImage } = require('./Backend/utils/cloudinary');

(async () => {
  const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Rk94AAAAASUVORK5CYII=';
  console.log('Uploading test image to Cloudinary...');
  const result = await uploadImage(base64);
  console.log('Result URL:', result);
})();
