import express from 'express';
import {
  createReview,
  getReviews,
  getUserReview,
  updateReview,
  deleteReview,
  canReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review (customer only, requires delivered order)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetType
 *               - targetId
 *               - orderId
 *               - rating
 *             properties:
 *               targetType:
 *                 type: string
 *                 enum: [shop, product]
 *               targetId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input or already reviewed
 *       404:
 *         description: Order not found
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /api/reviews/{targetType}/{targetId}:
 *   get:
 *     summary: Get all reviews for a shop or product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [shop, product]
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/:targetType/:targetId', getReviews);

/**
 * @swagger
 * /api/reviews/{targetType}/{targetId}/user:
 *   get:
 *     summary: Get current user's review for a specific item
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [shop, product]
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's review
 *       404:
 *         description: Review not found
 */
router.get('/:targetType/:targetId/user', protect, getUserReview);

/**
 * @swagger
 * /api/reviews/{targetType}/{targetId}/can-review:
 *   get:
 *     summary: Check if user can review this item
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [shop, product]
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Can review status
 */
router.get('/:targetType/:targetId/can-review', protect, canReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update user's own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
router.put('/:id', protect, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete user's own review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete('/:id', protect, deleteReview);

export default router;
