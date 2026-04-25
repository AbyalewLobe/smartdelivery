import express from 'express';
import { getDashboardStats, getRecentOrders, getTopShops } from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ordersToday:
 *                       type: number
 *                       example: 15
 *                     pendingOrders:
 *                       type: number
 *                       example: 5
 *                     revenueToday:
 *                       type: number
 *                       example: 12500
 *                     totalCustomers:
 *                       type: number
 *                       example: 250
 *                     activeShops:
 *                       type: number
 *                       example: 12
 *                     ordersByStatus:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: number
 *                         confirmed:
 *                           type: number
 *                         collected:
 *                           type: number
 *                         on_the_way:
 *                           type: number
 *                         delivered:
 *                           type: number
 *                         cancelled:
 *                           type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/stats', protect, adminOnly, getDashboardStats);

/**
 * @swagger
 * /api/dashboard/recent-orders:
 *   get:
 *     summary: Get recent orders (admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of 10 most recent orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/recent-orders', protect, adminOnly, getRecentOrders);

/**
 * @swagger
 * /api/dashboard/top-shops:
 *   get:
 *     summary: Get top performing shops (admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month]
 *           default: week
 *         description: Time period for statistics
 *     responses:
 *       200:
 *         description: Top 5 shops by revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       logoUrl:
 *                         type: string
 *                       orderCount:
 *                         type: number
 *                       revenue:
 *                         type: number
 */
router.get('/top-shops', protect, adminOnly, getTopShops);

export default router;
