import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cctv-ecommerce';

const categories = [
  { name: "CCTV Cameras", slug: "cctv", image: "/images/cctv_camera.png", isFeaturedOnHome: true },
  { name: "IP Cameras", slug: "ip", image: "/images/ip_camera.png", isFeaturedOnHome: true },
  { name: "WiFi Cameras", slug: "wifi", image: "/images/wifi_camera.png", isFeaturedOnHome: true },
  { name: "DVR", slug: "dvr", image: "/images/dvr_system.png", isFeaturedOnHome: true },
  { name: "NVR", slug: "nvr", image: "/images/nvr_system.png", isFeaturedOnHome: true },
  { name: "Accessories", slug: "accessories", image: "/images/cctv_accessories.png", isFeaturedOnHome: true },
  { name: "Video Door Phone", slug: "vdp", image: "/images/video_door_phone.png", isFeaturedOnHome: true },
  { name: "Alarm Systems", slug: "alarm", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80", isFeaturedOnHome: true },
  { name: "SSD", slug: "ssd", image: "/images/surveillance_hdd.png", isFeaturedOnHome: true },
  { name: "Pendrive", slug: "pendrive", image: "/images/cctv_accessories.png", isFeaturedOnHome: true },
  { name: "HDMI Cables", slug: "hdmi", image: "/images/cctv_cable.png", isFeaturedOnHome: true },
];

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seedCategories();
