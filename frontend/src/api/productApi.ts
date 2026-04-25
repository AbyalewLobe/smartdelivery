import api from './axios';

export const productApi = {
  getByShop: (shopId: string) =>
    api.get(`/products/shop/${shopId}`),
  
  search: (query: string, category?: string) =>
    api.get('/products/search', { params: { q: query, category } }),
  
  getById: (id: string) =>
    api.get(`/products/${id}`),
  
  create: (formData: FormData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  toggleAvailability: (id: string) =>
    api.patch(`/products/${id}/toggle`),
  
  delete: (id: string) =>
    api.delete(`/products/${id}`)
};
