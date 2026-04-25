import Category from '../models/Category.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const { type, activeOnly = 'true' } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (activeOnly === 'true') filter.isActive = true;

    const categories = await Category.find(filter).sort({ name: 1 });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category (admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, type, description, icon } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      type 
    });

    if (existingCategory) {
      return res.status(400).json({ 
        success: false, 
        message: `${type} category "${name}" already exists` 
      });
    }

    const category = await Category.create({
      name,
      type,
      description,
      icon: icon || '📦'
    });

    res.status(201).json({ 
      success: true, 
      data: category, 
      message: 'Category created successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        type: category.type,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({ 
          success: false, 
          message: `Category "${name}" already exists` 
        });
      }
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({ 
      success: true, 
      data: category, 
      message: 'Category updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category is in use
    const Shop = (await import('../models/Shop.js')).default;
    const Product = (await import('../models/Product.js')).default;

    if (category.type === 'shop') {
      const shopsCount = await Shop.countDocuments({ category: category.name });
      if (shopsCount > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot delete category. ${shopsCount} shop(s) are using this category.` 
        });
      }
    } else if (category.type === 'product') {
      const productsCount = await Product.countDocuments({ category: category.name });
      if (productsCount > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot delete category. ${productsCount} product(s) are using this category.` 
        });
      }
    }

    await category.deleteOne();

    res.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed default categories (for initial setup)
export const seedDefaultCategories = async (req, res) => {
  try {
    const defaultShopCategories = [
      { name: 'Grocery', type: 'shop', description: 'Grocery stores and supermarkets', icon: '🛒' },
      { name: 'Restaurant', type: 'shop', description: 'Restaurants and food services', icon: '🍽️' },
      { name: 'Pharmacy', type: 'shop', description: 'Pharmacies and drugstores', icon: '💊' },
      { name: 'Electronics', type: 'shop', description: 'Electronics and gadgets', icon: '📱' },
      { name: 'Fashion', type: 'shop', description: 'Clothing and accessories', icon: '👕' },
      { name: 'Other', type: 'shop', description: 'Other types of shops', icon: '🏪' }
    ];

    const defaultProductCategories = [
      { name: 'Food & Beverages', type: 'product', description: 'Food items and drinks', icon: '🍔' },
      { name: 'Electronics', type: 'product', description: 'Electronic devices and accessories', icon: '💻' },
      { name: 'Clothing', type: 'product', description: 'Clothes and fashion items', icon: '👔' },
      { name: 'Health & Beauty', type: 'product', description: 'Health and beauty products', icon: '💄' },
      { name: 'Home & Garden', type: 'product', description: 'Home and garden items', icon: '🏡' },
      { name: 'Sports & Outdoors', type: 'product', description: 'Sports and outdoor equipment', icon: '⚽' },
      { name: 'Books & Media', type: 'product', description: 'Books, movies, and music', icon: '📚' },
      { name: 'Toys & Games', type: 'product', description: 'Toys and games', icon: '🎮' },
      { name: 'Other', type: 'product', description: 'Other products', icon: '📦' }
    ];

    const allCategories = [...defaultShopCategories, ...defaultProductCategories];
    const created = [];

    for (const cat of allCategories) {
      const existing = await Category.findOne({ name: cat.name, type: cat.type });
      if (!existing) {
        const newCat = await Category.create(cat);
        created.push(newCat);
      }
    }

    res.json({ 
      success: true, 
      message: `Seeded ${created.length} default categories`,
      data: created
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
