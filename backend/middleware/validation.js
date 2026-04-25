import { body, validationResult } from 'express-validator';

// Validation middleware to check for errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

// Registration validation rules
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
];

// Login validation rules
export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Shop validation rules
export const shopValidation = [
  body('name').trim().notEmpty().withMessage('Shop name is required'),
  body('category').isIn(['grocery', 'restaurant', 'pharmacy', 'electronics', 'fashion', 'other'])
    .withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
];

// Product validation rules
export const productValidation = [
  body('shopId').notEmpty().withMessage('Shop ID is required'),
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Order validation rules
export const orderValidation = [
  body('shopId').notEmpty().withMessage('Shop ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').trim().notEmpty().withMessage('City is required'),
  body('paymentMethod').isIn(['cash', 'card']).withMessage('Invalid payment method')
];

// Address validation rules
export const addressValidation = [
  body('label').trim().notEmpty().withMessage('Address label is required'),
  body('street').trim().notEmpty().withMessage('Street is required'),
  body('city').trim().notEmpty().withMessage('City is required')
];
