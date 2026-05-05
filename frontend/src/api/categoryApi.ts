import api from './axios';
import type { Category, LocalizedString } from '../types';

export type { Category, LocalizedString };

export const categoryApi = {
  getCategories: async (params?: { type?: 'shop' | 'product'; activeOnly?: boolean }) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: { name: LocalizedString; type: 'shop' | 'product'; description?: string; icon?: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name?: LocalizedString; isActive?: boolean; description?: string; icon?: string }) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  seedDefaultCategories: async () => {
    const response = await api.post('/categories/seed');
    return response.data;
  }
};
