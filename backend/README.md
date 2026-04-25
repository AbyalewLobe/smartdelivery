# Smart Deliver Backend

Admin-operated multi-shop delivery platform backend API built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication with refresh tokens
- Role-based access control (Customer & Admin)
- Shop management (CRUD operations)
- Product management with image uploads
- Order processing with status tracking
- Customer management
- Dashboard analytics
- Email notifications
- Rate limiting
- Input validation

## Prerequisites

- Node.js 20 LTS or higher
- MongoDB 7+ (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secrets (use strong random strings)
   - Email credentials
   - Admin credentials

4. Create upload directories:
```bash
mkdir -p uploads/shops uploads/products
```

5. Seed admin user:
```bash
npm run seed:admin
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login (customer/admin)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Shops
- `GET /api/shops` - Get all active shops (public)
- `GET /api/shops/:id` - Get shop details (public)
- `GET /api/shops/all/admin` - Get all shops (admin)
- `POST /api/shops` - Create shop (admin)
- `PUT /api/shops/:id` - Update shop (admin)
- `PATCH /api/shops/:id/toggle` - Toggle shop status (admin)
- `DELETE /api/shops/:id` - Delete shop (admin)

### Products
- `GET /api/products/shop/:shopId` - Get products by shop
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `PATCH /api/products/:id/toggle` - Toggle availability (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order (customer)
- `GET /api/orders/my` - Get customer orders (customer)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (admin)
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Customers
- `GET /api/customers` - Get all customers (admin)
- `GET /api/customers/:id` - Get customer details (admin)
- `PATCH /api/customers/:id/suspend` - Suspend/activate customer (admin)
- `DELETE /api/customers/:id` - Delete customer (admin)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/addresses` - Add address
- `PUT /api/profile/addresses/:id` - Update address
- `DELETE /api/profile/addresses/:id` - Delete address

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (admin)
- `GET /api/dashboard/recent-orders` - Get recent orders (admin)
- `GET /api/dashboard/top-shops` - Get top performing shops (admin)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Order Status Flow

1. `pending` - Order placed, awaiting admin confirmation
2. `confirmed` - Admin confirmed the order
3. `collected` - Items collected from shop
4. `on_the_way` - Order dispatched for delivery
5. `delivered` - Order successfully delivered
6. `cancelled` - Order cancelled

## Security Features

- Password hashing with bcrypt (cost factor 12)
- JWT tokens with short expiry (15 min access, 7 day refresh)
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- File upload validation
- Admin-only route protection

## File Uploads

- Shop logos: `uploads/shops/`
- Product images: `uploads/products/`
- Max file size: 5MB
- Allowed formats: JPEG, JPG, PNG, WebP

## Email Notifications

Emails are sent for:
- Order confirmation (to customer)
- New order alert (to admin)
- Order status updates (to customer)
- Password reset

## Environment Variables

See `.env.example` for all required environment variables.

## Database Indexes

The following indexes are created for optimal performance:
- User: email
- Shop: category + isActive
- Product: shopId + isAvailable, text search on name/description
- Order: customerId + createdAt, shopId + status, status + createdAt

## Error Handling

All errors are caught and returned in a consistent format. The error handler middleware provides:
- Structured error responses
- Stack traces in development mode
- Appropriate HTTP status codes

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes
- General API: 100 requests per 15 minutes

## Testing

Run the seed script to create an admin user:
```bash
npm run seed:admin
```

Default admin credentials (change in production):
- Email: admin@smartdeliver.com
- Password: admin123

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production MongoDB (MongoDB Atlas recommended)
4. Set up production email service
5. Configure CORS for production frontend domain
6. Enable HTTPS
7. Set up monitoring and logging
8. Consider using PM2 for process management

## License

ISC
