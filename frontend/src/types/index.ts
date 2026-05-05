export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Shop {
  _id: string;
  name: LocalizedString | string;
  category: 'grocery' | 'restaurant' | 'pharmacy' | 'electronics' | 'fashion' | 'other';
  description: LocalizedString | string;
  logoUrl?: string;
  address: LocalizedString | string;
  phone: string;
  isActive: boolean;
  averageRating?: number;
  totalReviews?: number;
  productCount?: number;
  orderCount?: number;
  createdAt: string;
}

export interface Product {
  _id: string;
  shopId: string;
  name: LocalizedString | string;
  description: LocalizedString | string;
  price: number;
  images: string[];
  category?: string;
  stock: number;
  isAvailable: boolean;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface StatusHistory {
  status: string;
  changedAt: string;
  note?: string;
}

export interface Order {
  _id: string;
  customerId: string | User;
  shopId: string | Shop;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'collected' | 'on_the_way' | 'delivered' | 'cancelled';
  statusHistory: StatusHistory[];
  cancelReason?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface DashboardStats {
  ordersToday: number;
  pendingOrders: number;
  revenueToday: number;
  totalCustomers: number;
  activeShops: number;
  ordersByStatus: {
    [key: string]: number;
  };
}

export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  targetType: 'shop' | 'product';
  targetId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CanReviewResponse {
  canReview: boolean;
  reason?: 'already_reviewed' | 'no_delivered_order';
  review?: Review;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'order_placed' | 'order_status' | 'order_cancelled' | 'review_added' | 'shop_approved' | 'shop_rejected';
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: 'Order' | 'Shop' | 'Product' | 'Review';
  isRead: boolean;
  createdAt: string;
}

export interface LocalizedString {
  en: string;
  am: string;
}

export interface Category {
  _id: string;
  name: LocalizedString | string;
  type: 'shop' | 'product';
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
}
