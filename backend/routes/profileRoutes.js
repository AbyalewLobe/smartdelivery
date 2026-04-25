import express from 'express';
import { getProfile, updateProfile, addAddress, updateAddress, deleteAddress } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "0555123456"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Email already in use
 */
router.put('/', protect, updateProfile);

/**
 * @swagger
 * /api/profile/addresses:
 *   post:
 *     summary: Add delivery address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - street
 *               - city
 *             properties:
 *               label:
 *                 type: string
 *                 example: Home
 *               street:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: Algiers
 *               notes:
 *                 type: string
 *                 example: Ring the bell
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 36.7538
 *                   lng:
 *                     type: number
 *                     example: 3.0588
 *     responses:
 *       201:
 *         description: Address added successfully
 */
router.post('/addresses', protect, addAddress);

/**
 * @swagger
 * /api/profile/addresses/{id}:
 *   put:
 *     summary: Update delivery address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               notes:
 *                 type: string
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 */
router.put('/addresses/:id', protect, updateAddress);

/**
 * @swagger
 * /api/profile/addresses/{id}:
 *   delete:
 *     summary: Delete delivery address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */
router.delete('/addresses/:id', protect, deleteAddress);

export default router;
