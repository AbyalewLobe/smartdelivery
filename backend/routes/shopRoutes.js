import express from 'express';
import { 
  getAllActiveShops, 
  getAllShops, 
  getShopById, 
  createShop, 
  updateShop, 
  toggleShopStatus, 
  deleteShop 
} from '../controllers/shopController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

/**
 * @swagger
 * /api/shops/test/cloudinary:
 *   get:
 *     summary: Test Cloudinary connection
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: Cloudinary connection successful
 *       500:
 *         description: Cloudinary connection failed
 */
router.get('/test/cloudinary', async (req, res) => {
  try {
    // Test Cloudinary connection by getting account details
    const result = await cloudinary.api.ping();
    res.json({ 
      success: true, 
      message: 'Cloudinary connected successfully',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      status: result.status
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Cloudinary connection failed',
      error: error.message,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  }
});

/**
 * @swagger
 * /api/shops:
 *   get:
 *     summary: Get all active shops
 *     tags: [Shops]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [grocery, restaurant, pharmacy, electronics, fashion, other]
 *         description: Filter shops by category
 *     responses:
 *       200:
 *         description: List of active shops
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
 *                     $ref: '#/components/schemas/Shop'
 */
router.get('/', getAllActiveShops);

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     summary: Get shop by ID with products
 *     tags: [Shops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop details with products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   allOf:
 *                     - $ref: '#/components/schemas/Shop'
 *                     - type: object
 *                       properties:
 *                         products:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 *       404:
 *         description: Shop not found
 */
router.get('/:id', getShopById);

/**
 * @swagger
 * /api/shops/all/admin:
 *   get:
 *     summary: Get all shops (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all shops with statistics
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
 *                       - $ref: '#/components/schemas/Shop'
 *                       - type: object
 *                         properties:
 *                           productCount:
 *                             type: number
 *                           orderCount:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/all/admin', protect, adminOnly, getAllShops);

/**
 * @swagger
 * /api/shops:
 *   post:
 *     summary: Create a new shop (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fresh Market
 *               category:
 *                 type: string
 *                 enum: [grocery, restaurant, pharmacy, electronics, fashion, other]
 *                 example: grocery
 *               description:
 *                 type: string
 *                 example: Fresh fruits and vegetables
 *               address:
 *                 type: string
 *                 example: 123 Main St, Algiers
 *               phone:
 *                 type: string
 *                 example: "0555987654"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Shop logo image (max 5MB, jpeg/jpg/png/webp)
 *     responses:
 *       201:
 *         description: Shop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Shop'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, adminOnly, upload.single('logo'), createShop);

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     summary: Update shop (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [grocery, restaurant, pharmacy, electronics, fashion, other]
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Shop updated successfully
 *       404:
 *         description: Shop not found
 */
router.put('/:id', protect, adminOnly, upload.single('logo'), updateShop);

/**
 * @swagger
 * /api/shops/{id}/toggle:
 *   patch:
 *     summary: Toggle shop active status (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop status toggled successfully
 *       404:
 *         description: Shop not found
 */
router.patch('/:id/toggle', protect, adminOnly, toggleShopStatus);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     summary: Delete shop (admin only)
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop deleted successfully
 *       400:
 *         description: Cannot delete shop with pending orders
 *       404:
 *         description: Shop not found
 */
router.delete('/:id', protect, adminOnly, deleteShop);

export default router;
