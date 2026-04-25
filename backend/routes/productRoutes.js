import express from 'express';
import { 
  getAllProducts,
  getProductsByShop, 
  searchProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  toggleProductAvailability, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', protect, adminOnly, getAllProducts);

/**
 * @swagger
 * /api/products/shop/{shopId}:
 *   get:
 *     summary: Get products by shop
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/shop/:shopId', getProductsByShop);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products across all shops
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Search results
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
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Search query required
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - shopId
 *               - name
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               shopId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               name:
 *                 type: string
 *                 example: Fresh Apples
 *               description:
 *                 type: string
 *                 example: Red delicious apples
 *               price:
 *                 type: number
 *                 example: 250
 *               category:
 *                 type: string
 *                 example: fruits
 *               stock:
 *                 type: number
 *                 example: 100
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (max 5 images, 5MB each)
 *     responses:
 *       201:
 *         description: Product created successfully
 *       404:
 *         description: Shop not found
 */
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);

/**
 * @swagger
 * /api/products/{id}/toggle:
 *   patch:
 *     summary: Toggle product availability (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product availability toggled
 *       404:
 *         description: Product not found
 */
router.patch('/:id/toggle', protect, adminOnly, toggleProductAvailability);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Cannot delete product with pending orders
 *       404:
 *         description: Product not found
 */
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
