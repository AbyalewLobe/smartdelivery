import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import Order from '../models/Order.js';
import { uploadMultipleToCloudinary, deleteMultipleFromCloudinary } from '../utils/cloudinaryUpload.js';

// Get products by shop
export const getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const filter = { shopId };
    if (!req.user || req.user.role !== 'admin') {
      filter.isAvailable = true;
      filter.stock = { $gt: 0 };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get all products (admin only)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('shopId', 'name logoUrl')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Search products across all shops
export const searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) {
      filter.category = category;
    }

    // Only show available products to customers
    if (!req.user || req.user.role !== 'admin') {
      filter.isAvailable = true;
      filter.stock = { $gt: 0 };
    }

    const products = await Product.find(filter).populate('shopId', 'name logoUrl').limit(50);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopId', 'name logoUrl address phone');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product with multiple images
export const createProduct = async (req, res) => {
  try {
    const { shopId, name, description, price, category, stock } = req.body;

    // Validate shop exists
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    let images = [];
    let imagePublicIds = [];

    // Upload images to Cloudinary if files exist
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
      images = uploadResults.map(result => result.url);
      imagePublicIds = uploadResults.map(result => result.publicId);
    }

    const product = await Product.create({
      shopId,
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      images,
      imagePublicIds
    });

    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.http_code ? 'Cloudinary error: ' + error.message : error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, category, stock } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? parseInt(stock) : product.stock;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle product availability
export const toggleProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.json({ 
      success: true, 
      data: product, 
      message: `Product ${product.isAvailable ? 'made available' : 'marked unavailable'}` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if product is in pending orders
    const pendingOrders = await Order.countDocuments({
      'items.productId': product._id,
      status: { $in: ['pending', 'confirmed', 'collected', 'on_the_way'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete product with pending orders' 
      });
    }

    // Delete product images from Cloudinary
    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(product.imagePublicIds);
      } catch (err) {
        console.error('Error deleting images from Cloudinary:', err);
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
