import api from './axios';

export const shopApi = {
  getAll: (category?: string) =>
    api.get('/shops', { params: { category } }),
  
  getById: (id: string) =>
    api.get(`/shops/${id}`),
  
  getAllAdmin: () => api.get('/shops/all/admin'),
  
  create: (formData: FormData) =>
    api.post('/shops', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/shops/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  toggleStatus: (id: string) =>
    api.patch(`/shops/${id}/toggle`),
  
  delete: (id: string) =>
    api.delete(`/shops/${id}`)
};
