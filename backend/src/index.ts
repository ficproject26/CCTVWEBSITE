import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import productRoutes from './routes/productRoutes';
import jobRoutes from './routes/jobRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { seedDatabase } from './seed';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

import path from 'path';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CCTV eCommerce Backend API is running', timestamp: new Date() });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Database connection & Server start (reloaded for active MongoDB)
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cctv-ecommerce';

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully.');
    await seedDatabase();
  })
  .catch((err) => {
    console.error('⚠️ MongoDB Connection Note:', err.message || err);
    console.log('ℹ️ Operating in fallback mode or waiting for MongoDB service startup...');
  });

app.listen(port, () => {
  console.log(`🚀 Shared Backend API Server is running at http://localhost:${port}`);
});
