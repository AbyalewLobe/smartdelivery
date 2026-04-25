import User from '../models/User.js';
import Order from '../models/Order.js';

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    
    const filter = { role: 'customer' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [customers, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    // Add order count for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ customerId: customer._id });
        return { ...customer.toObject(), orderCount };
      })
    );

    res.json({ 
      success: true, 
      data: customersWithStats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-passwordHash');
    
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Get customer orders
    const orders = await Order.find({ customerId: customer._id })
      .populate('shopId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const orderCount = await Order.countDocuments({ customerId: customer._id });
    const totalSpent = await Order.aggregate([
      { $match: { customerId: customer._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({ 
      success: true, 
      data: {
        ...customer.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0,
        recentOrders: orders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suspend customer
export const suspendCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    res.json({ 
      success: true, 
      data: customer, 
      message: `Customer ${customer.isActive ? 'activated' : 'suspended'} successfully` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check for pending orders
    const pendingOrders = await Order.countDocuments({
      customerId: customer._id,
      status: { $in: ['pending', 'confirmed', 'collected', 'on_the_way'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete customer with pending orders' 
      });
    }

    await customer.deleteOne();
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
