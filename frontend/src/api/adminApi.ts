import api from './axios';

// Dashboard APIs
export const dashboardApi = {
  getStats: () => api.get<any>('/dashboard/stats'),
  getRecentOrders: () => api.get<any>('/dashboard/recent-orders'),
  getTopShops: () => api.get('/dashboard/top-shops'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getRevenue: (period?: string) => api.get('/dashboard/revenue', { params: { period } }),
  getOrdersByStatus: () => api.get('/dashboard/orders-by-status')
};

// Shop Management APIs
export const adminShopApi = {
  getShops: () => api.get<any>('/shops'),
  getShopById: (id: string) => api.get<any>(`/shops/${id}`),
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
  getProducts: () => api.get<any>('/products'),
  getProductById: (id: string) => api.get<any>(`/products/${id}`),
  getProductsByShop: (shopId: string) => api.get<any>(`/products/shop/${shopId}`),
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
  getAllOrders: () => api.get<any>('/orders'),
  getOrderById: (id: string) => api.get<any>(`/orders/${id}`),
  getShopOrders: (shopId: string) => api.get<any>(`/orders/shop/${shopId}`),
  getCustomerOrders: (customerId: string) => api.get<any>(`/orders/customer/${customerId}`),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    api.patch(`/orders/${id}/status`, { status, note })
};

// Customer Management APIs
export const adminCustomerApi = {
  getCustomers: () => api.get<any>('/customers'),
  getCustomerById: (id: string) => api.get<any>(`/customers/${id}`),
  getCustomerOrders: (id: string) => api.get<any>(`/customers/${id}/orders`),
  updateCustomerStatus: (id: string, isActive: boolean) =>
    api.put(`/customers/${id}/status`, { isActive })
};
