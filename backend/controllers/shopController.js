import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinaryUpload.js';

// Get all active shops (customer view)
export const getAllActiveShops = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const shops = await Shop.find(filter).sort({ createdAt: -1 });
    
    // Add product count for each shop
    const shopsWithCount = await Promise.all(
      shops.map(async (shop) => {
        const productCount = await Product.countDocuments({ shopId: shop._id, isAvailable: true });
        return { ...shop.toObject(), productCount };
      })
    );

    res.json({ success: true, data: shopsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all shops (admin view)
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    
    const shopsWithStats = await Promise.all(
      shops.map(async (shop) => {
        const productCount = await Product.countDocuments({ shopId: shop._id });
        const orderCount = await Order.countDocuments({ shopId: shop._id });
        return { ...shop.toObject(), productCount, orderCount };
      })
    );

    res.json({ success: true, data: shopsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single shop with products
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    // Get products based on user role
    const productFilter = { shopId: shop._id };
    if (!req.user || req.user.role !== 'admin') {
      productFilter.isAvailable = true;
      productFilter.stock = { $gt: 0 };
    }

    const products = await Product.find(productFilter);
    
    res.json({ success: true, data: { ...shop.toObject(), products } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create shop with logo upload
export const createShop = async (req, res) => {
  try {
    const { name, category, description, address, phone } = req.body;
    
    let logoUrl = null;
    let logoPublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'shops');
      logoUrl = result.url;
      logoPublicId = result.publicId;
    }

    // Parse JSON strings sent via FormData with error handling
    let parsedName, parsedDesc, parsedAddress;
    try {
      parsedName = typeof name === 'string' ? JSON.parse(name) : name;
    } catch (e) {
      parsedName = { en: name, am: '' };
    }
    
    try {
      parsedDesc = typeof description === 'string' ? JSON.parse(description) : description;
    } catch (e) {
      parsedDesc = { en: description, am: '' };
    }

    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      parsedAddress = { en: address, am: '' };
    }

    const shop = await Shop.create({
      name: parsedName,
      category,
      description: parsedDesc,
      address: parsedAddress,
      phone,
      logoUrl,
      logoPublicId
    });

    res.status(201).json({ success: true, data: shop, message: 'Shop created successfully' });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update shop
export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const { name, category, description, address, phone } = req.body;
    
    if (name) {
      try {
        shop.name = typeof name === 'string' ? JSON.parse(name) : name;
      } catch (e) {
        shop.name = { en: name, am: shop.name?.am || '' };
      }
    }
    if (description) {
      try {
        shop.description = typeof description === 'string' ? JSON.parse(description) : description;
      } catch (e) {
        shop.description = { en: description, am: shop.description?.am || '' };
      }
    }
    if (address) {
      try {
        shop.address = typeof address === 'string' ? JSON.parse(address) : address;
      } catch (e) {
        shop.address = { en: address, am: shop.address?.am || '' };
      }
    }
    if (category) shop.category = category;
    if (phone) shop.phone = phone;

    // Handle logo replacement
    if (req.file) {
      // Delete old logo from Cloudinary if exists
      if (shop.logoPublicId) {
        try {
          await deleteFromCloudinary(shop.logoPublicId);
        } catch (err) {
          console.error('Error deleting old logo from Cloudinary:', err);
        }
      }
      
      // Upload new logo to Cloudinary
      const result = await uploadToCloudinary(req.file.path, 'shops');
      shop.logoUrl = result.url;
      shop.logoPublicId = result.publicId;
    }

    await shop.save();
    res.json({ success: true, data: shop, message: 'Shop updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle shop active status
export const toggleShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    shop.isActive = !shop.isActive;
    await shop.save();

    res.json({ 
      success: true, 
      data: shop, 
      message: `Shop ${shop.isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete shop and all products
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    // Check for pending orders
    const pendingOrders = await Order.countDocuments({
      shopId: shop._id,
      status: { $in: ['pending', 'confirmed', 'collected', 'on_the_way'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete shop with pending orders' 
      });
    }

    // Delete all products and their images from Cloudinary
    const products = await Product.find({ shopId: shop._id });
    for (const product of products) {
      if (product.imagePublicIds && product.imagePublicIds.length > 0) {
        for (const publicId of product.imagePublicIds) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (err) {
            console.error('Error deleting product image from Cloudinary:', err);
          }
        }
      }
    }
    await Product.deleteMany({ shopId: shop._id });

    // Delete shop logo from Cloudinary
    if (shop.logoPublicId) {
      try {
        await deleteFromCloudinary(shop.logoPublicId);
      } catch (err) {
        console.error('Error deleting logo from Cloudinary:', err);
      }
    }

    await shop.deleteOne();
    res.json({ success: true, message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
