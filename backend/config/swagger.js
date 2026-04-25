import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Deliver API',
      version: '1.0.0',
      description: 'Admin-operated multi-shop delivery platform API documentation',
      contact: {
        name: 'Smart Deliver Team',
        email: 'support@smartdeliver.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.smartdeliver.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '0555123456' },
            role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/Address' }
            },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Address: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            label: { type: 'string', example: 'Home' },
            street: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'Algiers' },
            notes: { type: 'string', example: 'Ring the bell' },
            coordinates: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: 36.7538 },
                lng: { type: 'number', example: 3.0588 }
              }
            }
          }
        },
        Shop: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Fresh Market' },
            category: {
              type: 'string',
              enum: ['grocery', 'restaurant', 'pharmacy', 'electronics', 'fashion', 'other'],
              example: 'grocery'
            },
            description: { type: 'string', example: 'Fresh fruits and vegetables' },
            logoUrl: { type: 'string', example: '/uploads/shops/logo-123.jpg' },
            address: { type: 'string', example: '456 Market St, Algiers' },
            phone: { type: 'string', example: '0555987654' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            shopId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Fresh Apples' },
            description: { type: 'string', example: 'Red delicious apples' },
            price: { type: 'number', example: 250 },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['/uploads/products/img-123.jpg']
            },
            category: { type: 'string', example: 'fruits' },
            stock: { type: 'number', example: 100 },
            isAvailable: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            customerId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            shopId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            },
            totalAmount: { type: 'number', example: 1500 },
            deliveryAddress: { $ref: '#/components/schemas/Address' },
            paymentMethod: { type: 'string', enum: ['cash', 'card'], example: 'cash' },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'refunded'],
              example: 'pending'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'collected', 'on_the_way', 'delivered', 'cancelled'],
              example: 'pending'
            },
            statusHistory: {
              type: 'array',
              items: { $ref: '#/components/schemas/StatusHistory' }
            },
            cancelReason: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            productId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Fresh Apples' },
            price: { type: 'number', example: 250 },
            quantity: { type: 'number', example: 3 },
            subtotal: { type: 'number', example: 750 }
          }
        },
        StatusHistory: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'confirmed' },
            changedAt: { type: 'string', format: 'date-time' },
            note: { type: 'string', example: 'Order confirmed by admin' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operation successful' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
            code: { type: 'string', example: 'ERROR_CODE' },
            errors: {
              type: 'array',
              items: { type: 'object' }
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Shops', description: 'Shop management endpoints' },
      { name: 'Products', description: 'Product management endpoints' },
      { name: 'Orders', description: 'Order management endpoints' },
      { name: 'Customers', description: 'Customer management endpoints (Admin only)' },
      { name: 'Profile', description: 'User profile management endpoints' },
      { name: 'Dashboard', description: 'Admin dashboard endpoints' }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
