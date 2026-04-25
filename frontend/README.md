# Smart Deliver Frontend

Modern React + TypeScript frontend for the Smart Deliver multi-shop delivery platform.

## Features

- 🎨 Beautiful UI inspired by organic/fresh design aesthetic
- 🚀 React 18 with TypeScript
- 💅 Tailwind CSS with custom design system
- 🔄 React Query for data fetching
- 🗂️ Zustand for state management
- 📱 Fully responsive design
- ✨ Smooth animations and transitions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Design System

### Colors

- **Primary Green**: Fresh, organic feel
  - Main: `#16a34a`
  - Light: `#22c55e`
  - Dark: `#15803d`

- **Accent Colors**: Soft gradients
  - Pink: `#fce7f3`
  - Peach: `#fed7aa`
  - Mint: `#d1fae5`

### Typography

- Font: Inter (Google Fonts)
- Headings: Bold (700-800)
- Body: Regular (400)
- Buttons: Medium (500-600)

### Components

- Border Radius: 12-16px (rounded-xl, rounded-2xl)
- Shadows: Soft, subtle
- Transitions: 200ms

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable components
│   ├── layout/      # Layout components
│   └── ui/          # UI components
├── pages/           # Page components
│   └── customer/    # Customer pages
├── store/           # Zustand stores
├── types/           # TypeScript types
├── lib/             # Utilities
├── App.tsx          # Main app
└── main.tsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Implementation Status

### ✅ Completed
- Core infrastructure
- API integration
- State management
- Design system
- Layout components
- Home page
- Login page

### 🚧 In Progress
- Register page
- Shops listing
- Shop detail
- Cart
- Checkout
- Orders
- Profile

See `FRONTEND_COMPLETE_IMPLEMENTATION.md` for detailed implementation guide.

## Resources

- Backend API: http://localhost:5000/api
- Swagger Docs: http://localhost:5000/api-docs
- Implementation Guide: FRONTEND_COMPLETE_IMPLEMENTATION.md
- Setup Guide: FRONTEND_SETUP.md

## License

ISC
