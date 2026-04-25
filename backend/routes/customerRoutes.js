import express from 'express';
import { getAllCustomers, getCustomerById, suspendCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers (admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of customers with pagination
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/User'
 *                       - type: object
 *                         properties:
 *                           orderCount:
 *                             type: number
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     pages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', protect, adminOnly, getAllCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID with statistics (admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details with order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         orderCount:
 *                           type: number
 *                         totalSpent:
 *                           type: number
 *                         recentOrders:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Order'
 *       404:
 *         description: Customer not found
 */
router.get('/:id', protect, adminOnly, getCustomerById);

/**
 * @swagger
 * /api/customers/{id}/suspend:
 *   patch:
 *     summary: Suspend or activate customer account (admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer status toggled successfully
 *       404:
 *         description: Customer not found
 */
router.patch('/:id/suspend', protect, adminOnly, suspendCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customer account (admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Cannot delete customer with pending orders
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', protect, adminOnly, deleteCustomer);

export default router;
