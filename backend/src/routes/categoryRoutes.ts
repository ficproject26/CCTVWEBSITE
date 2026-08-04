import express from 'express';
import Category from '../models/Category';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = featured === 'true' ? { isFeaturedOnHome: true } : {};
    
    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST new category
router.post('/', async (req, res) => {
  try {
    const { name, slug, image, isFeaturedOnHome } = req.body;
    
    if (!name || !slug || !image) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newCategory = new Category({ name, slug, image, isFeaturedOnHome });
    await newCategory.save();
    
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
