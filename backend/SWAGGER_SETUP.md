# Swagger Setup - Technical Details

## Installation

The following packages have been added to enable Swagger documentation:

```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

Install them:
```bash
npm install swagger-jsdoc swagger-ui-express
```

---

## File Structure

```
backend/
├── config/
│   └── swagger.js          # Swagger configuration
├── routes/
│   ├── authRoutes.js       # Auth endpoints with JSDoc comments
│   ├── shopRoutes.js       # Shop endpoints with JSDoc comments
│   ├── productRoutes.js    # Product endpoints with JSDoc comments
│   ├── orderRoutes.js      # Order endpoints with JSDoc comments
│   ├── customerRoutes.js   # Customer endpoints with JSDoc comments
│   ├── profileRoutes.js    # Profile endpoints with JSDoc comments
│   └── dashboardRoutes.js  # Dashboard endpoints with JSDoc comments
└── index.js                # Swagger UI setup
```

---

## Configuration

### swagger.js

Located at `backend/config/swagger.js`, this file contains:

1. **OpenAPI 3.0 Definition**
   - API metadata (title, version, description)
   - Server URLs (development and production)
   - Contact and license information

2. **Security Schemes**
   - JWT Bearer authentication configuration

3. **Component Schemas**
   - User, Shop, Product, Order models
   - Address, OrderItem, StatusHistory sub-models
   - Response schemas (Success, Error, Auth)

4. **Tags**
   - Organized endpoint categories

5. **API Source Files**
   - Points to route files for JSDoc parsing

---

## JSDoc Comments

Each route file contains JSDoc comments above route definitions:

### Example Structure

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   method:
 *     summary: Brief description
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path/query
 *         name: paramName
 *         required: true/false
 *         schema:
 *           type: string
 *         description: Parameter description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Error response
 */
router.method('/endpoint', handler);
```

---

## Integration in index.js

```javascript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Smart Deliver API Documentation'
}));
```

---

## Customization Options

### UI Customization

```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  // Hide Swagger UI top bar
  customCss: '.swagger-ui .topbar { display: none }',
  
  // Custom page title
  customSiteTitle: 'Smart Deliver API Documentation',
  
  // Custom favicon
  customfavIcon: '/favicon.ico',
  
  // Swagger UI options
  swaggerOptions: {
    // Persist authorization between page refreshes
    persistAuthorization: true,
    
    // Show request duration
    displayRequestDuration: true,
    
    // Default expand level
    docExpansion: 'list', // 'none', 'list', 'full'
    
    // Filter by tags
    filter: true,
    
    // Show extensions
    showExtensions: true,
    
    // Show common extensions
    showCommonExtensions: true
  }
}));
```

### Adding Custom CSS

```javascript
const customCss = `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 20px 0 }
  .swagger-ui .scheme-container { background: #fafafa }
`;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss
}));
```

---

## Adding New Endpoints

### Step 1: Add JSDoc Comment

```javascript
/**
 * @swagger
 * /api/new-endpoint:
 *   post:
 *     summary: Create new resource
 *     tags: [ResourceName]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *               - field2
 *             properties:
 *               field1:
 *                 type: string
 *                 example: value1
 *               field2:
 *                 type: number
 *                 example: 123
 *     responses:
 *       201:
 *         description: Resource created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 */
router.post('/new-endpoint', protect, handler);
```

### Step 2: Add Schema (if needed)

In `config/swagger.js`, add to `components.schemas`:

```javascript
NewResource: {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    field1: { type: 'string' },
    field2: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' }
  }
}
```

### Step 3: Restart Server

```bash
npm run dev
```

Documentation updates automatically!

---

## Schema References

### Using $ref

Reference existing schemas:

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
```

### Array of Schemas

```javascript
schema:
  type: array
  items:
    $ref: '#/components/schemas/Product'
```

### Combining Schemas

```javascript
schema:
  allOf:
    - $ref: '#/components/schemas/User'
    - type: object
      properties:
        additionalField:
          type: string
```

---

## File Upload Documentation

### Single File

```javascript
/**
 * @swagger
 * /api/upload:
 *   post:
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
```

### Multiple Files

```javascript
/**
 * @swagger
 * /api/upload-multiple:
 *   post:
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 */
```

---

## Authentication Documentation

### Protecting Endpoints

```javascript
/**
 * @swagger
 * /api/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 */
```

### Multiple Security Options

```javascript
security:
  - bearerAuth: []
  - apiKey: []
```

---

## Response Examples

### Success with Data

```javascript
responses:
  200:
    description: Success
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              $ref: '#/components/schemas/User'
            message:
              type: string
              example: Operation successful
```

### Error Response

```javascript
responses:
  400:
    description: Validation error
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            message:
              type: string
              example: Validation failed
            errors:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
```

---

## Testing

### Verify Swagger JSON

```bash
curl http://localhost:5000/api-docs.json
```

Should return valid OpenAPI 3.0 JSON.

### Validate OpenAPI Spec

Use online validator:
```
https://editor.swagger.io/
```

Paste your JSON from `/api-docs.json`

---

## Troubleshooting

### Swagger UI Not Loading

1. Check server is running
2. Verify route is registered in `index.js`
3. Check browser console for errors
4. Verify `swagger-ui-express` is installed

### Endpoints Not Showing

1. Check JSDoc comments syntax
2. Verify file is included in `swagger.js` apis array
3. Restart server after changes
4. Check for YAML syntax errors in comments

### Schema Not Found

1. Verify schema is defined in `config/swagger.js`
2. Check schema name matches $ref
3. Ensure proper nesting in components.schemas

### Authentication Not Working

1. Click "Authorize" button
2. Enter token in format: `Bearer YOUR_TOKEN`
3. Verify security scheme is defined
4. Check endpoint has `security` property

---

## Production Deployment

### Environment-Based URLs

```javascript
servers: [
  {
    url: process.env.NODE_ENV === 'production' 
      ? 'https://api.smartdeliver.com' 
      : 'http://localhost:5000',
    description: process.env.NODE_ENV === 'production' 
      ? 'Production server' 
      : 'Development server'
  }
]
```

### Disable in Production (Optional)

```javascript
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

### Password Protection (Optional)

```javascript
import basicAuth from 'express-basic-auth';

app.use('/api-docs', 
  basicAuth({
    users: { 'admin': 'password' },
    challenge: true
  }),
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec)
);
```

---

## Best Practices

1. **Keep JSDoc Comments Updated**
   - Update when changing endpoints
   - Document all parameters
   - Include examples

2. **Use Schema References**
   - Define schemas once
   - Reference with $ref
   - Maintain consistency

3. **Document Error Cases**
   - Include all possible error codes
   - Explain error conditions
   - Provide error examples

4. **Add Descriptions**
   - Explain what endpoint does
   - Describe parameters
   - Note special requirements

5. **Test Documentation**
   - Use "Try it out" feature
   - Verify examples work
   - Check all endpoints

---

## Resources

- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **OpenAPI Specification**: https://swagger.io/specification/
- **swagger-jsdoc**: https://github.com/Surnet/swagger-jsdoc
- **swagger-ui-express**: https://github.com/scottie1984/swagger-ui-express

---

**Swagger documentation is fully configured and ready to use!** 🎉
