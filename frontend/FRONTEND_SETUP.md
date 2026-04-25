# Frontend Setup Guide - Smart Deliver

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Project Structure

```
frontend/src/
├── api/                    # API service layer
│   ├── axios.ts           # Axios instance with interceptors
│   ├── authApi.ts         # Authentication endpoints
│   ├── shopApi.ts         # Shop endpoints
│   ├── productApi.ts      # Product endpoints
│   └── orderApi.ts        # Order endpoints
├── components/
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── CustomerLayout.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── pages/
│   └── customer/          # Customer pages
│       ├── Home.tsx
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── Shops.tsx
│       ├── ShopDetail.tsx
│       ├── Cart.tsx
│       ├── Checkout.tsx
│       ├── Orders.tsx
│       ├── OrderDetail.tsx
│       └── Profile.tsx
├── store/                 # Zustand state management
│   ├── authStore.ts       # Authentication state
│   └── cartStore.ts       # Shopping cart state
├── types/                 # TypeScript types
│   └── index.ts
├── lib/                   # Utilities
│   └── utils.ts
├── App.tsx                # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

---

## Design System

### Colors

Based on the UI template with fresh, organic aesthetic:

```typescript
primary: {
  50: '#f0fdf4',   // Very light green
  100: '#dcfce7',
  500: '#22c55e',  // Main green
  600: '#16a34a',  // Primary button
  700: '#15803d',
}

accent: {
  pink: '#fce7f3',   // Soft pink gradient
  peach: '#fed7aa',  // Warm peach
  mint: '#d1fae5',   // Fresh mint
}
```

### Typography

- Font: Inter (Google Fonts)
- Headings: Bold, 700-800 weight
- Body: Regular, 400 weight
- Buttons: Medium, 500-600 weight

### Components

- **Buttons**: Rounded-2xl (16px), shadow-md
- **Cards**: Rounded-2xl, shadow-card
- **Inputs**: Rounded-xl (12px), border focus states
- **Gradients**: Soft pink-to-mint backgrounds

---

## Features Implemented

### ✅ Core Infrastructure
- Axios with token refresh interceptor
- Zustand state management (auth + cart)
- React Query for data fetching
- React Router v6 routing
- TypeScript types
- Tailwind CSS styling

### ✅ Components
- Navbar with cart badge
- Footer with links
- Button variants (primary, secondary, outline, ghost)
- Input with label and error states
- Card component
- Customer layout wrapper

### ✅ Pages Created
- Home (hero, categories, features)
- Login (with form validation)
- More pages to be added...

---

## Remaining Implementation

### Pages to Create

**Customer Pages:**
1. Register.tsx - Sign up form
2. Shops.tsx - Shop listing with filters
3. ShopDetail.tsx - Shop page with products
4. Cart.tsx - Shopping cart
5. Checkout.tsx - Order placement
6. Orders.tsx - Order history
7. OrderDetail.tsx - Single order view
8. Profile.tsx - User profile management

**Components:**
1. ProductCard.tsx - Product display card
2. ShopCard.tsx - Shop display card
3. OrderStatusBadge.tsx - Status indicator
4. OrderTimeline.tsx - Status progression
5. LoadingSkeleton.tsx - Loading states
6. EmptyState.tsx - Empty list states

---

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Open http://localhost:5173
2. Register new account
3. Browse shops
4. Add items to cart
5. Place order
6. Track order status

---

## API Integration

All API calls use the axios instance with:
- Automatic token injection
- Token refresh on 401
- Error handling
- Base URL from environment

Example:
```typescript
import { shopApi } from '../api/shopApi';

const { data } = await shopApi.getAll();
```

---

## State Management

### Auth Store
```typescript
const { user, isAuthenticated, setAuth, logout } = useAuthStore();
```

### Cart Store
```typescript
const { items, totalItems, totalAmount, addItem, clearCart } = useCartStore();
```

---

## Styling Guidelines

### Use Tailwind Classes
```tsx
<div className="card">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### Custom Components
```tsx
<Button variant="primary" size="lg">
  Click Me
</Button>
```

### Gradients
```tsx
<div className="gradient-bg">
  Content with soft gradient background
</div>
```

---

## Next Steps

1. **Complete Remaining Pages**
   - Follow the structure in FRONTEND_IMPLEMENTATION_PLAN.md
   - Use existing components as reference
   - Maintain design consistency

2. **Add React Query Hooks**
   - Create custom hooks for data fetching
   - Handle loading and error states
   - Implement caching strategies

3. **Enhance UX**
   - Add loading skeletons
   - Implement optimistic updates
   - Add animations and transitions

4. **Testing**
   - Test all user flows
   - Verify responsive design
   - Check error handling

---

## Build for Production

```bash
npm run build
```

Output in `dist/` folder ready for deployment.

---

## Resources

- **Backend API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api-docs
- **Tailwind Docs**: https://tailwindcss.com
- **React Query**: https://tanstack.com/query

---

**Frontend foundation is ready! Continue building the remaining pages following the established patterns.** 🚀
