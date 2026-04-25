import api from './axios';

export const orderApi = {
  create: (orderData: any) =>
    api.post('/orders', orderData),
  
  getMyOrders: (status?: string) =>
    api.get('/orders/my', { params: { status } }),
  
  getById: (id: string) =>
    api.get(`/orders/${id}`),
  
  cancel: (id: string, reason: string) =>
    api.post(`/orders/${id}/cancel`, { reason }),
  
  getAll: (filters?: any) =>
    api.get('/orders', { params: filters }),
  
  updateStatus: (id: string, status: string, note?: string) =>
    api.patch(`/orders/${id}/status`, { status, note })
};
