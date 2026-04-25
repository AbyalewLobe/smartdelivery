import Order from '../models/Order.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      ordersToday,
      pendingOrders,
      revenueToday,
      totalCustomers,
      activeShops,
      ordersByStatus
    ] = await Promise.all([
      // Orders today
      Order.countDocuments({ createdAt: { $gte: today } }),
      
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      
      // Revenue today
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Total customers
      User.countDocuments({ role: 'customer', isActive: true }),
      
      // Active shops
      Shop.countDocuments({ isActive: true }),
      
      // Orders by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusCounts = {};
    ordersByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        ordersToday,
        pendingOrders,
        revenueToday: revenueToday[0]?.total || 0,
        totalCustomers,
        activeShops,
        ordersByStatus: statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent orders
export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email phone')
      .populate('shopId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get top performing shops
export const getTopShops = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    const dateFilter = new Date();
    if (period === 'week') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === 'month') {
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    const topShops = await Order.aggregate([
      { $match: { createdAt: { $gte: dateFilter }, status: 'delivered' } },
      { 
        $group: { 
          _id: '$shopId', 
          orderCount: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        } 
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'shops',
          localField: '_id',
          foreignField: '_id',
          as: 'shop'
        }
      },
      { $unwind: '$shop' },
      {
        $project: {
          _id: 1,
          name: '$shop.name',
          logoUrl: '$shop.logoUrl',
          orderCount: 1,
          revenue: 1
        }
      }
    ]);

    res.json({ success: true, data: topShops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
