import api from './axios';
import { User, Address } from '../types';

export const profileApi = {
  // Get current user profile
  getProfile: () => api.get<User>('/profile'),
  
  // Update profile information
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/profile', data),
  
  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/profile/change-password', data),
  
  // Address management
  addAddress: (address: Omit<Address, '_id'>) =>
    api.post('/profile/addresses', address),
  
  updateAddress: (addressId: string, address: Omit<Address, '_id'>) =>
    api.put(`/profile/addresses/${addressId}`, address),
  
  deleteAddress: (addressId: string) =>
    api.delete(`/profile/addresses/${addressId}`)
};
