import api from './axios';

export interface Category {
  _id: string;
  name: string;
  type: 'shop' | 'product';
  description?: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export const categoryApi = {
  getCategories: async (params?: { type?: 'shop' | 'product'; activeOnly?: boolean }) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: { name: string; type: 'shop' | 'product'; description?: string; icon?: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name?: string; description?: string; icon?: string; isActive?: boolean }) => {
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
