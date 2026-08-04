import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from './models/Product';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cctv-ecommerce';

const BASE_URL = 'http://localhost:5000/images';

async function updateImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const products = await Product.find({});
    let updatedCount = 0;

    for (let product of products) {
      const title = product.title.toLowerCase();
      let newImage = '';

      if (title.includes('bullet')) {
        newImage = `${BASE_URL}/bullet_camera.png`;
      } else if (title.includes('dome') || title.includes('ptz')) {
        newImage = title.includes('ptz') ? `${BASE_URL}/ptz_camera.png` : `${BASE_URL}/dome_camera.png`;
      } else if (title.includes('dvr') || title.includes('nvr')) {
        newImage = `${BASE_URL}/dvr_nvr.png`;
      } else if (title.includes('hdd') || title.includes('hard disk')) {
        newImage = `${BASE_URL}/hard_disk.png`;
      } else {
        newImage = `${BASE_URL}/cctv_accessories.png`;
      }

      if (newImage) {
        product.image = newImage;
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} product images!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateImages();
