import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from './models/Product';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cctv-ecommerce';

const products = [
  {
    title: 'Hikvision 2MP HD-TVI Dome Camera',
    category: 'bullet', // 'bullet' covers analog
    brand: 'Hikvision',
    price: 1299,
    originalPrice: 1800,
    badge: '10% OFF',
    rating: 4.6,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['2MP Resolution', '20m IR Distance', 'Indoor Use'],
    stock: 120,
    description: 'High quality 2MP analog dome camera for indoor surveillance with 20m IR night vision.',
    isBestSeller: true
  },
  {
    title: 'Hikvision 2MP Full HD Bullet Camera',
    category: 'bullet',
    brand: 'Hikvision',
    price: 1499,
    originalPrice: 2000,
    badge: 'Best Value',
    rating: 4.8,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    specs: ['1080p Full HD', '20m Smart IR', 'IP66 Weatherproof'],
    stock: 85,
    description: 'Reliable 2MP outdoor bullet camera with IP66 weather resistance and excellent night vision.',
    isBestSeller: true
  },
  {
    title: 'Dahua 4MP Full Color IP Dome Camera',
    category: 'ip',
    brand: 'Dahua',
    price: 3499,
    originalPrice: 4500,
    badge: 'NEW',
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['4MP Resolution', 'Full Color Night Vision', 'Built-in Mic'],
    stock: 45,
    description: 'Advanced 4MP IP camera offering 24/7 full-color images even in total darkness.',
    isBestSeller: false
  },
  {
    title: 'Dahua 4MP Full Color IP Bullet Camera',
    category: 'ip',
    brand: 'Dahua',
    price: 3899,
    originalPrice: 5000,
    rating: 4.7,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    specs: ['4MP IP Camera', 'Color Night Vision', 'IP67 Weatherproof'],
    stock: 60,
    description: 'Outdoor 4MP IP Bullet camera featuring Starlight technology for color images at night.',
    isBestSeller: true
  },
  {
    title: 'CP Plus 2MP Wi-Fi PTZ Camera',
    category: 'ip',
    brand: 'CP Plus',
    price: 2999,
    originalPrice: 4200,
    badge: '28% OFF',
    rating: 4.5,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    specs: ['Wi-Fi Enabled', '360° Pan & Tilt', 'Two-Way Audio'],
    stock: 150,
    description: 'Smart Wi-Fi PTZ camera ideal for home monitoring. Offers 360-degree coverage via mobile app.',
    isFlashDeal: true,
    isBestSeller: true
  },
  {
    title: 'Hikvision 5MP ColorVu Bullet Camera',
    category: 'bullet',
    brand: 'Hikvision',
    price: 3299,
    originalPrice: 4000,
    rating: 4.8,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    specs: ['5MP High Resolution', 'ColorVu Technology', 'IP67'],
    stock: 40,
    description: 'Premium 5MP analog camera with ColorVu technology for vivid color details in the dark.',
    isBestSeller: false
  },
  {
    title: 'CP Plus 8 Channel HD DVR',
    category: 'dvr',
    brand: 'CP Plus',
    price: 4999,
    originalPrice: 6500,
    badge: 'Trending',
    rating: 4.4,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['8 Channel Support', '1080p Recording', 'H.265 Compression'],
    stock: 35,
    description: '8-channel Digital Video Recorder supporting all major analog camera formats.',
    isBestSeller: true
  },
  {
    title: 'Dahua 16 Channel 4K NVR',
    category: 'nvr',
    brand: 'Dahua',
    price: 9999,
    originalPrice: 12500,
    rating: 4.9,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['16 Channels', '4K Resolution Support', 'AI Face Recognition'],
    stock: 20,
    description: 'Professional 16-channel Network Video Recorder with AI features and 4K recording capabilities.',
    isBestSeller: false
  },
  {
    title: 'Hikvision 4 Channel PoE NVR',
    category: 'nvr',
    brand: 'Hikvision',
    price: 5499,
    originalPrice: 7000,
    badge: '20% OFF',
    rating: 4.7,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['4 Channels', 'Built-in PoE Ports', 'Plug & Play'],
    stock: 30,
    description: 'Easy-to-install 4-channel NVR with built-in Power over Ethernet (PoE) for IP cameras.',
    isBestSeller: true
  },
  {
    title: 'Seagate 1TB SkyHawk Surveillance HDD',
    category: 'harddisk',
    brand: 'Seagate',
    price: 3699,
    originalPrice: 4500,
    rating: 4.8,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['1TB Capacity', '24/7 Workload', '3-Year Warranty'],
    stock: 200,
    description: 'Surveillance-optimized hard drive built for 24/7 always-on recording workloads.',
    isBestSeller: true
  },
  {
    title: 'WD Purple 2TB Surveillance HDD',
    category: 'harddisk',
    brand: 'Western Digital',
    price: 5499,
    originalPrice: 6800,
    rating: 4.9,
    reviewsCount: 315,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['2TB Capacity', 'AllFrame Technology', '3-Year Warranty'],
    stock: 150,
    description: 'Reliable 2TB storage engineered specifically for CCTV DVRs and NVRs.',
    isBestSeller: true
  },
  {
    title: 'WD Purple 4TB Surveillance HDD',
    category: 'harddisk',
    brand: 'Western Digital',
    price: 9499,
    originalPrice: 11000,
    rating: 4.8,
    reviewsCount: 125,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['4TB Capacity', 'High Workload Rate', 'Optimized for HD Video'],
    stock: 80,
    description: 'Massive 4TB storage for long-term video retention in large surveillance setups.',
    isBestSeller: false
  },
  {
    title: 'CP Plus 4 Channel HD DVR',
    category: 'dvr',
    brand: 'CP Plus',
    price: 3499,
    originalPrice: 4200,
    rating: 4.5,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['4 Channels', 'Smart Search', 'Mobile View'],
    stock: 60,
    description: 'Cost-effective 4-channel DVR perfect for small homes and retail shops.',
    isFlashDeal: true,
    isBestSeller: true
  },
  {
    title: 'Hikvision 8 Channel AcuSense NVR',
    category: 'nvr',
    brand: 'Hikvision',
    price: 8999,
    originalPrice: 11500,
    badge: 'NEW',
    rating: 4.9,
    reviewsCount: 35,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['8 Channels', 'AcuSense AI Tech', 'False Alarm Reduction'],
    stock: 25,
    description: 'Advanced 8-channel NVR with AcuSense technology to filter out false alarms.',
    isBestSeller: false
  },
  {
    title: '3+1 CCTV Copper Cable (90m Roll)',
    category: 'accessories',
    brand: 'Generic',
    price: 1199,
    originalPrice: 1600,
    rating: 4.3,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['90 Meters Length', 'Pure Copper', 'Weather Resistant'],
    stock: 300,
    description: 'High-quality 3+1 coaxial copper cable for transmitting video and power reliably.',
    isBestSeller: true
  },
  {
    title: '8 Port Gigabit PoE Switch',
    category: 'accessories',
    brand: 'D-Link',
    price: 4999,
    originalPrice: 6000,
    rating: 4.7,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['8 PoE Ports', 'Gigabit Speed', 'Unmanaged'],
    stock: 45,
    description: '8-port PoE switch providing power and data transmission for IP cameras.',
    isBestSeller: true
  },
  {
    title: '4 Port Fast Ethernet PoE Switch',
    category: 'accessories',
    brand: 'TP-Link',
    price: 2499,
    originalPrice: 3200,
    rating: 4.6,
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['4 PoE Ports', '10/100Mbps', 'Desktop Design'],
    stock: 120,
    description: 'Affordable 4-port PoE switch ideal for small IP camera installations.',
    isBestSeller: false
  },
  {
    title: '12V 5A CCTV Power Supply (SMPS)',
    category: 'accessories',
    brand: 'Generic',
    price: 499,
    originalPrice: 800,
    badge: '37% OFF',
    rating: 4.4,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['12V 5 Ampere', '4 Channel Support', 'Surge Protection'],
    stock: 500,
    description: 'Reliable switch mode power supply capable of powering up to 4 analog cameras.',
    isBestSeller: true,
    isFlashDeal: true
  },
  {
    title: 'BNC & DC Connectors Combo (20 Pairs)',
    category: 'accessories',
    brand: 'Generic',
    price: 399,
    originalPrice: 600,
    rating: 4.8,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['20 BNC Pins', '20 DC Pins', 'Gold Plated Core'],
    stock: 1000,
    description: 'Pack of 20 premium BNC and DC connectors for terminating CCTV cables securely.',
    isBestSeller: false
  },
  {
    title: 'Hikvision IP Video Door Phone Kit',
    category: 'cctv',
    brand: 'Hikvision',
    price: 12500,
    originalPrice: 15000,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    specs: ['7-inch Touch Screen', '2MP Door Station', 'Mobile Unlock'],
    stock: 15,
    description: 'Complete IP Video Door Phone intercom system for homes and apartments.',
    isBestSeller: true
  }
];

async function seedProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    console.log('Clearing existing products (optional, uncomment to clear)');
    // await Product.deleteMany({});
    
    console.log('Seeding 20 new CCTV products...');
    const createdProducts = await Product.insertMany(products);
    
    console.log(`Successfully seeded ${createdProducts.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
