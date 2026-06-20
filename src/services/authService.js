import apiClient from './apiService';

export const authService = {
  login(credentials) {
    return apiClient.post('/api/v1/auth/login', credentials);
  },
  
  register(userData) {
    return apiClient.post('/api/v1/auth/register', userData);
  },

  forgotPassword(email) {
    return apiClient.post('/api/v1/auth/forgot-password', { email });
  }
};