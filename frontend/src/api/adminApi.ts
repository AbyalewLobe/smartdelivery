import api from './axios';
import { Shop, Product, Order, User, DashboardStats } from '../types';

// Dashboard APIs
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
  getRecentOrders: () => api.get<Order[]>('/dashboard/recent-orders'),
  getTopShops: () => api.get('/dashboard/top-shops'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getRevenue: (period?: string) => api.get('/dashboard/revenue', { params: { period } }),
  getOrdersByStatus: () => api.get('/dashboard/orders-by-status')
};

// Shop Management APIs
export const adminShopApi = {
  getShops: () => api.get<Shop[]>('/shops'),
  getShopById: (id: string) => api.get<Shop>(`/shops/${id}`),
  createShop: (data: FormData) => api.post('/shops', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateShop: (id: string, data: FormData) => api.put(`/shops/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteShop: (id: string) => api.delete(`/shops/${id}`)
};

// Product Management APIs
export const adminProductApi = {
  getProducts: () => api.get<Product[]>('/products'),
  getProductById: (id: string) => api.get<Product>(`/products/${id}`),
  getProductsByShop: (shopId: string) => api.get<Product[]>(`/products/shop/${shopId}`),
  createProduct: (data: FormData) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id: string, data: FormData) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id: string) => api.delete(`/products/${id}`)
};

// Order Management APIs
export const adminOrderApi = {
  getAllOrders: () => api.get<Order[]>('/orders'),
  getOrderById: (id: string) => api.get<Order>(`/orders/${id}`),
  getShopOrders: (shopId: string) => api.get<Order[]>(`/orders/shop/${shopId}`),
  getCustomerOrders: (customerId: string) => api.get<Order[]>(`/orders/customer/${customerId}`),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    api.patch(`/orders/${id}/status`, { status, note })
};

// Customer Management APIs
export const adminCustomerApi = {
  getCustomers: () => api.get<User[]>('/customers'),
  getCustomerById: (id: string) => api.get<User>(`/customers/${id}`),
  getCustomerOrders: (id: string) => api.get<Order[]>(`/customers/${id}/orders`),
  updateCustomerStatus: (id: string, isActive: boolean) =>
    api.put(`/customers/${id}/status`, { isActive })
};
