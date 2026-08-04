import { Router, Request, Response } from 'express';
import Dashboard from '../models/Dashboard';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Job from '../models/Job';

const router = Router();

// GET entire dashboard state dynamically built from live database collections
router.get('/', async (req: Request, res: Response) => {
  try {
    let dashboardData = await Dashboard.findOne().lean();
    if (!dashboardData) {
      // Create baseline document with empty fields if it doesn't exist
      dashboardData = await Dashboard.create({
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
      dashboardData = (dashboardData as any).toObject();
    }

    // Fetch live data from individual collections
    const liveOrders = await Order.find().sort({ createdAt: -1 }).lean();
    const liveProducts = await Product.find().lean();
    const liveTechnicians = await User.find({ role: 'TECHNICIAN' }).lean();
    const liveCustomers = await User.find({ role: 'CUSTOMER' }).lean();
    const liveJobs = await Job.find().sort({ createdAt: -1 }).lean();

    // Map live Jobs/Projects
    const mappedProjects = liveJobs.map((job: any) => ({
      id: job.jobCode,
      name: job.title,
      technician: job.assignedTechnician?.name || 'Unassigned',
      customer: job.customer?.name || 'Unknown Customer',
      location: job.customer?.address || 'Chennai Area',
      submissionDate: job.scheduledDate || new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: (job.status === 'COMPLETED' || job.status === 'ASSIGNED' || job.status === 'IN_PROGRESS') ? 'Approved' : (job.status === 'PENDING' ? 'Pending Approval' : 'Rework'),
      details: job.scopeOfWork?.join(', ') || job.title,
      devicesCount: job.equipmentList?.length || 0,
      dailyLogs: job.fieldNotes ? [{ date: new Date(job.updatedAt).toLocaleDateString('en-US'), status: job.status, report: job.fieldNotes, photos: [] }] : []
    }));

    // Map live Orders
    const mappedOrders = liveOrders.map((order: any) => {
      const job = liveJobs.find(j => j.jobCode === order.orderNumber || j.customer?.email?.toLowerCase() === order.customerEmail?.toLowerCase());
      let dashboardStatus = 'Pending';
      if (order.orderStatus === 'DELIVERED') {
        dashboardStatus = 'Completed';
      } else if (order.orderStatus === 'PROCESSING') {
        // If there is no job created yet, it means the order is brand new and needs admin approval
        dashboardStatus = job ? 'In Progress' : 'Pending Approval';
      } else if (order.orderStatus === 'SHIPPED') {
        dashboardStatus = 'Completed';
      } else if (order.orderStatus === 'CANCELLED') {
        dashboardStatus = 'Cancelled';
      }
      if (job) {
        if (job.status === 'COMPLETED') {
          dashboardStatus = 'Completed';
        } else if (job.status === 'IN_PROGRESS') {
          dashboardStatus = 'In Progress';
        } else if (job.status === 'ASSIGNED') {
          dashboardStatus = 'Approved';
        } else if (job.status === 'PENDING') {
          dashboardStatus = 'Pending Approval';
        }
      }
      return {
        id: order.orderNumber,
        customer: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        type: order.items?.map((item: any) => item.title).join(', ') || 'CCTV Installation',
        location: order.shippingAddress || 'Chennai Area',
        assignedTechnician: job?.assignedTechnician?.name || 'Unassigned',
        status: dashboardStatus,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: order.totalAmount,
        createdAt: order.createdAt
      };
    });

    // Map live Technicians
    const mappedTechnicians = liveTechnicians.map((tech: any) => {
      const activeJob = liveJobs.find((j: any) => j.assignedTechnician?.id === tech._id.toString() && j.status !== 'COMPLETED' && j.status !== 'CANCELLED');
      return {
        id: tech._id.toString(),
        name: tech.name,
        phone: tech.phone || '',
        email: tech.email,
        status: activeJob ? 'Busy' : 'Available',
        currentProject: activeJob ? activeJob.title : 'None',
        rating: tech.rating || 5.0,
        specialization: tech.specialties?.join(', ') || 'IP Cameras & Networking',
        password: tech.passwordHash || ''
      };
    });

    // Map live Customers
    const mappedCustomers = liveCustomers.map((cust: any) => {
      const custOrders = liveOrders.filter((o: any) => o.customerEmail?.toLowerCase() === cust.email?.toLowerCase());
      const totalSpent = custOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
      return {
        id: `CUST-${cust._id.toString().slice(-4).toUpperCase()}`,
        name: cust.name,
        email: cust.email,
        phone: cust.phone || '',
        location: custOrders[0]?.shippingAddress || 'Chennai Area',
        totalSpent,
        installationsCount: custOrders.length
      };
    });

    // Map live Products
    const mappedProducts = liveProducts.map((prod: any) => ({
      id: prod._id.toString(),
      name: prod.title || prod.name,
      category: prod.category === 'ip' ? 'IP Camera' : (prod.category === 'dvr' ? 'DVR/NVR' : prod.category),
      price: prod.price,
      stock: prod.stock,
      model: prod.specs?.join(', ') || '',
      description: prod.description || '',
      imageUrl: prod.image || '',
      isFlashDeal: prod.isFlashDeal || false
    }));

    // Merge baseline and dynamic live collections
    const mergedData = {
      ...dashboardData,
      orders: mappedOrders,
      products: mappedProducts,
      technicians: mappedTechnicians,
      customers: mappedCustomers,
      projects: mappedProjects
    };

    res.json({ success: true, data: mergedData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update dashboard state & sync live sub-collections
router.put('/', async (req: Request, res: Response) => {
  try {
    let dashboardData = await Dashboard.findOne();
    if (!dashboardData) {
      dashboardData = new Dashboard(req.body);
    } else {
      Object.assign(dashboardData, req.body);
    }
    const saved = await dashboardData.save();

    // 1. Sync orders back to live Orders collection
    if (req.body.orders && Array.isArray(req.body.orders)) {
      for (const o of req.body.orders) {
        const dbStatus = o.status === 'Completed' ? 'DELIVERED' : 'PROCESSING';
        const existingOrder = await Order.findOne({ orderNumber: o.id });
        if (!existingOrder) {
          await Order.create({
            orderNumber: o.id,
            customerName: o.customer,
            customerEmail: o.email || `${o.customer.toLowerCase().replace(/\s+/g, '')}@example.com`,
            customerPhone: o.phone || '0000000000',
            shippingAddress: o.location || 'Chennai Area',
            items: [{ productId: 'temp', title: o.type, price: o.amount, quantity: 1 }],
            totalAmount: o.amount,
            paymentStatus: 'PAID',
            orderStatus: dbStatus
          });
        } else {
          await Order.updateOne({ orderNumber: o.id }, { orderStatus: dbStatus });
        }

        // Keep associated Job status in sync to prevent dashboard interval reverting
        if (o.id) {
          const emailQuery = o.email ? o.email.toLowerCase() : '';
          let associatedJob = await Job.findOne({
            $or: [
              { jobCode: o.id },
              { 'customer.email': emailQuery }
            ]
          });
          if (associatedJob) {
            if (o.status === 'Approved') {
              associatedJob.status = 'ASSIGNED';
            } else if (o.status === 'In Progress') {
              associatedJob.status = 'IN_PROGRESS';
            } else if (o.status === 'Completed') {
              associatedJob.status = 'COMPLETED';
            } else if (o.status === 'Pending Approval' || o.status === 'Pending') {
              associatedJob.status = 'PENDING';
            }
            await associatedJob.save();
          } else {
            // Create a job if the order has been approved or is pending approval
            if (o.status === 'Approved' || o.status === 'Pending Approval' || o.status === 'Pending') {
              const jobStatus = o.status === 'Approved' ? 'ASSIGNED' : 'PENDING';
              await Job.create({
                jobCode: o.id,
                title: o.type || 'CCTV Installation',
                category: o.type || 'CCTV Installation',
                status: jobStatus,
                priority: 'MEDIUM',
                scheduledDate: new Date().toISOString().split('T')[0],
                customer: {
                  name: o.customer,
                  phone: o.phone || '0000000000',
                  email: emailQuery,
                  address: o.location || 'Chennai Area',
                  city: 'Chennai',
                  postalCode: '600032'
                },
                assignedTechnician: o.assignedTechnician && o.assignedTechnician !== 'Unassigned' ? { name: o.assignedTechnician } : undefined
              });
            }
          }
        }
      }
    }

    // 2. Sync products back to live Products collection
    if (req.body.products && Array.isArray(req.body.products)) {
      for (const p of req.body.products) {
        // If ID is valid 24-character MongoDB ID, try finding and updating
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(p.id);
        const query = isMongoId ? { _id: p.id } : { title: p.name };
        const existingProd = await Product.findOne(query);
        if (!existingProd) {
          await Product.create({
            title: p.name,
            category: p.category === 'IP Camera' ? 'ip' : (p.category === 'DVR/NVR' ? 'dvr' : p.category),
            brand: 'SK-Vision',
            price: p.price,
            specs: p.model ? [p.model] : [],
            stock: p.stock,
            image: p.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
            description: p.description || '',
            isFlashDeal: p.isFlashDeal || false
          });
        } else {
          await Product.updateOne(query, {
            price: p.price,
            stock: p.stock,
            description: p.description,
            image: p.imageUrl,
            isFlashDeal: p.isFlashDeal || false
          });
        }
      }
    }

    // 3. Sync technicians back to live Users collection
    if (req.body.technicians && Array.isArray(req.body.technicians)) {
      for (const t of req.body.technicians) {
        const existingUser = await User.findOne({ email: t.email });
        if (!existingUser) {
          await User.create({
            name: t.name,
            email: t.email,
            passwordHash: t.password || 'seeded123',
            phone: t.phone,
            role: 'TECHNICIAN',
            specialties: t.specialization ? t.specialization.split(', ') : [],
            rating: t.rating || 5.0
          });
        } else {
          const updateFields: any = {
            name: t.name,
            phone: t.phone,
            specialties: t.specialization ? t.specialization.split(', ') : []
          };
          if (t.password) {
            updateFields.passwordHash = t.password;
          }
          await User.updateOne({ email: t.email }, updateFields);
        }
      }
    }

    // 4. Sync projects back to live Jobs collection
    if (req.body.projects && Array.isArray(req.body.projects)) {
      for (const pr of req.body.projects) {
        const existingJob = await Job.findOne({ jobCode: pr.id });
        let dbStatus = existingJob?.status || 'PENDING';
        if (pr.status === 'Approved') {
          dbStatus = existingJob?.status === 'PENDING' ? 'ASSIGNED' : (existingJob?.status || 'ASSIGNED');
        } else if (pr.status === 'Rework') {
          dbStatus = 'PENDING';
        } else if (pr.status === 'Pending Approval') {
          if (existingJob && !['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].includes(existingJob.status)) {
            dbStatus = 'PENDING';
          }
        }

        if (!existingJob) {
          await Job.create({
            jobCode: pr.id,
            title: pr.name,
            category: 'IP Camera Installation',
            status: dbStatus,
            priority: 'MEDIUM',
            scheduledDate: pr.submissionDate || new Date().toLocaleDateString('en-US'),
            customer: {
              name: pr.customer,
              phone: '0000000000',
              email: `${pr.customer.toLowerCase().replace(/\s+/g, '')}@example.com`,
              address: pr.location || 'Chennai Area',
              city: 'Chennai',
              postalCode: '600001'
            },
            assignedTechnician: pr.technician !== 'Unassigned' ? { name: pr.technician, id: 'temp' } : undefined,
            fieldNotes: pr.dailyLogs?.[0]?.report || ''
          });
        } else {
          await Job.updateOne({ jobCode: pr.id }, {
            status: dbStatus,
            assignedTechnician: pr.technician !== 'Unassigned' ? { name: pr.technician, id: existingJob.assignedTechnician?.id || 'temp' } : undefined,
            fieldNotes: pr.dailyLogs?.[0]?.report || ''
          });
        }
      }
    }

    res.json({ success: true, data: saved });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
