import Review from '../models/Review.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Helper function to update average rating
const updateAverageRating = async (targetType, targetId) => {
  const reviews = await Review.find({ targetType, targetId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const Model = targetType === 'shop' ? Shop : Product;
  await Model.findByIdAndUpdate(targetId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews
  });
};

// Create review (customer only, must have completed order)
export const createReview = async (req, res) => {
  try {
    const { targetType, targetId, orderId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate target type
    if (!['shop', 'product'].includes(targetType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid target type. Must be "shop" or "product"' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, customerId: userId });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or does not belong to you' 
      });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only review after the order is delivered' 
      });
    }

    // For product reviews, check if product was in the order
    if (targetType === 'product') {
      const productInOrder = order.items.some(
        item => item.productId.toString() === targetId
      );
      if (!productInOrder) {
        return res.status(400).json({ 
          success: false, 
          message: 'You can only review products you have ordered' 
        });
      }
    }

    // For shop reviews, check if order was from this shop
    if (targetType === 'shop') {
      if (order.shopId.toString() !== targetId) {
        return res.status(400).json({ 
          success: false, 
          message: 'You can only review shops you have ordered from' 
        });
      }
    }

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({ 
      userId, 
      targetType, 
      targetId 
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this item. Use update instead.' 
      });
    }

    // Create review
    const review = await Review.create({
      userId,
      targetType,
      targetId,
      orderId,
      rating,
      comment
    });

    // Update average rating
    await updateAverageRating(targetType, targetId);

    // Populate user info
    await review.populate('userId', 'name email');

    res.status(201).json({ 
      success: true, 
      data: review, 
      message: 'Review created successfully' 
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a shop or product
export const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    const reviews = await Review.find({ targetType, targetId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's review for a specific item
export const getUserReview = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({ userId, targetType, targetId })
      .populate('userId', 'name');

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: id, userId });

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found or you do not have permission to update it' 
      });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Update average rating
    await updateAverageRating(review.targetType, review.targetId);

    await review.populate('userId', 'name email');

    res.json({ 
      success: true, 
      data: review, 
      message: 'Review updated successfully' 
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: id, userId });

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found or you do not have permission to delete it' 
      });
    }

    const { targetType, targetId } = review;

    await review.deleteOne();

    // Update average rating
    await updateAverageRating(targetType, targetId);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if user can review (has delivered order)
export const canReview = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.user._id;

    // Check if user already reviewed
    const existingReview = await Review.findOne({ userId, targetType, targetId });
    if (existingReview) {
      return res.json({ 
        success: true, 
        canReview: false, 
        reason: 'already_reviewed',
        review: existingReview
      });
    }

    // Check if user has delivered order
    let hasDeliveredOrder = false;

    if (targetType === 'shop') {
      hasDeliveredOrder = await Order.exists({
        customerId: userId,
        shopId: targetId,
        status: 'delivered'
      });
    } else if (targetType === 'product') {
      const orders = await Order.find({
        customerId: userId,
        status: 'delivered',
        'items.productId': targetId
      });
      hasDeliveredOrder = orders.length > 0;
    }

    if (!hasDeliveredOrder) {
      return res.json({ 
        success: true, 
        canReview: false, 
        reason: 'no_delivered_order'
      });
    }

    res.json({ success: true, canReview: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
