import { Router, Request, Response } from 'express';
import Order from '../models/Order';

const router = Router();

// GET all orders — with optional ?email= filter for customer dashboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const emailFilter = req.query.email as string | undefined;
    const query = emailFilter ? { customerEmail: emailFilter.toLowerCase() } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create order (for Customer Website)
router.post('/', async (req: Request, res: Response) => {
  try {
    const orderNumber = `SK-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = new Order({ ...req.body, orderNumber });
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update order status
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
