# Smart Deliver

Admin-operated multi-shop delivery platform built with React, Node.js, Express, and MongoDB.

## Project Structure

```
├── backend/          # Node.js + Express API
│   ├── config/       # Database connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth, error handling, uploads
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── utils/        # JWT, email helpers
│   └── index.js      # Entry point
│
└── frontend/         # React + TypeScript
    └── src/
        ├── api/      # API calls
        ├── components/ # Reusable UI
        ├── pages/    # Route pages
        ├── store/    # Zustand state
        └── hooks/    # Custom hooks
```

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and secrets

5. Create uploads folder:
```bash
mkdir uploads
```

6. Start server:
```bash
npm run dev
```

Server runs on http://localhost:5000

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on http://localhost:5173

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query, Zustand
- **Tools**: Vite, React Router, Axios, React Hook Form

## Features

- Two-role system: Customer & Admin
- Admin manages shops, products, and orders
- Customers browse shops and place orders
- Order tracking with status updates
- JWT authentication
- Image upload for products and shop logos

## API Endpoints

- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Login (customer/admin)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout

More routes will be added for shops, products, and orders.
