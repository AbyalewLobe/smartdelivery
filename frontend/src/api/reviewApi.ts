import api from './axios';
import { Review, CanReviewResponse } from '../types';

export const reviewApi = {
  // Create a review
  createReview: (data: {
    targetType: 'shop' | 'product';
    targetId: string;
    orderId: string;
    rating: number;
    comment?: string;
  }) => api.post<Review>('/reviews', data),

  // Get all reviews for a shop or product
  getReviews: (targetType: 'shop' | 'product', targetId: string) =>
    api.get<any>(`/reviews/${targetType}/${targetId}`),

  // Get current user's review
  getUserReview: (targetType: 'shop' | 'product', targetId: string) =>
    api.get<Review>(`/reviews/${targetType}/${targetId}/user`),

  // Check if user can review
  canReview: (targetType: 'shop' | 'product', targetId: string) =>
    api.get<CanReviewResponse>(`/reviews/${targetType}/${targetId}/can-review`),

  // Update review
  updateReview: (id: string, data: { rating?: number; comment?: string }) =>
    api.put<Review>(`/reviews/${id}`, data),

  // Delete review
  deleteReview: (id: string) => api.delete(`/reviews/${id}`)
};
