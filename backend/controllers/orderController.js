import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import User from '../models/User.js';
import { canTransitionStatus, getStatusMessage } from '../utils/orderValidation.js';
import { sendOrderConfirmation, sendStatusUpdate, sendOrderToAdmin } from '../services/notificationService.js';
import { createNotification } from './notificationController.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { shopId, items, deliveryAddress, paymentMethod } = req.body;

    // Validate shop exists
    const shop = await Shop.findById(shopId);
    if (!shop || !shop.isActive) {
      return res.status(404).json({ success: false, message: 'Shop not found or inactive' });
    }

    // Validate all products and check stock
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.productId} not found` 
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ 
          success: false, 
          message: `Product ${product.name} is not available` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      const subtotal = product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });

      totalAmount += subtotal;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      customerId: req.user._id,
      shopId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        changedAt: new Date(),
        note: 'Order placed'
      }]
    });

    // Populate order details
    await order.populate('shopId', 'name logoUrl phone');

    // Send notifications
    try {
      await sendOrderConfirmation(order, req.user);
      await sendOrderToAdmin(order, req.user);
      
      // Create in-app notification
      await createNotification(
        req.user._id,
        'order_placed',
        'Order Placed Successfully',
        `Your order #${order._id.toString().slice(-8)} has been placed and is being processed.`,
        order._id,
        'Order'
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      data: order, 
      message: 'Order placed successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get customer's orders
export const getMyOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { customerId: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('shopId', 'name logoUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('shopId', 'name logoUrl address phone')
      .populate('customerId', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, shopId, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (shopId) filter.shopId = shopId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('shopId', 'name logoUrl')
        .populate('customerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({ 
      success: true, 
      data: orders,
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

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Validate status transition
    if (!canTransitionStatus(order.status, status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot transition from ${order.status} to ${status}` 
      });
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      changedAt: new Date(),
      note: note || getStatusMessage(status)
    });

    // If delivered and cash payment, mark as paid
    if (status === 'delivered' && order.paymentMethod === 'cash') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Send notification to customer
    try {
      await sendStatusUpdate(order, order.customerId, status);
      
      // Create in-app notification
      await createNotification(
        order.customerId._id,
        'order_status',
        'Order Status Updated',
        `Your order #${order._id.toString().slice(-8)} is now ${status.replace('_', ' ')}.`,
        order._id,
        'Order'
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.json({ 
      success: true, 
      data: order, 
      message: 'Order status updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Cancellation reason required' });
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel this order' 
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    // Update order
    order.status = 'cancelled';
    order.cancelReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      changedAt: new Date(),
      note: `Cancelled: ${reason}`
    });

    await order.save();

    // Send notification
    try {
      await sendStatusUpdate(order, order.customerId, 'cancelled');
      
      // Create in-app notification
      await createNotification(
        order.customerId._id,
        'order_cancelled',
        'Order Cancelled',
        `Your order #${order._id.toString().slice(-8)} has been cancelled. Reason: ${reason}`,
        order._id,
        'Order'
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.json({ 
      success: true, 
      data: order, 
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
