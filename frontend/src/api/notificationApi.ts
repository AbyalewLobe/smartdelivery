import api from './axios';

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

export const notificationApi = {
  getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};
