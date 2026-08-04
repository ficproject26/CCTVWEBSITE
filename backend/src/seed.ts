import Product from './models/Product';
import Job from './models/Job';
import User from './models/User';
import Dashboard from './models/Dashboard';
import Order from './models/Order';

export async function seedDatabase() {
  try {
    // Seed default Admin User if no users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default Admin User into MongoDB...');
      await User.create({
        name: 'Admin User',
        email: 'admin@sktech.com',
        passwordHash: 'admin123',
        role: 'ADMIN',
        phone: '+1 (555) 000-1111',
      });
      console.log('Admin User seeded successfully.');
    }

    // Seed default clean Dashboard state if none exists
    const dashboardCount = await Dashboard.countDocuments();
    if (dashboardCount === 0) {
      console.log('Seeding clean baseline dashboard document...');
      await Dashboard.create({
        orders: [],
        customers: [],
        technicians: [],
        projects: [],
        serviceRequests: [],
        products: [],
        inventory: [],
        payments: [],
        notifications: [],
        settings: {},
        chartData: [],
        queries: [],
        announcements: [],
        banners: [],
        brands: []
      });
      console.log('Dashboard clean baseline document seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
