import apiClient from './apiService';

export const authService = {
  /**
   * Đăng nhập
   * @param {{ email: string, matKhau: string }} credentials
   */
  login(credentials) {
    return apiClient.post('/api/v1/auth/login', credentials);
  },

  /**
   * Đăng xuất — cần Bearer Token (apiClient tự gắn)
   */
  logout() {
    return apiClient.post('/api/v1/auth/logout');
  },

  /**
   * Đăng ký tài khoản
   * @param {Object} userData
   */
  register(userData) {
    return apiClient.post('/api/v1/auth/register', userData);
  },

  /**
   * Quên mật khẩu — gửi OTP về email
   * @param {string} email
   */
  forgotPassword(email) {
    return apiClient.post('/api/v1/auth/forgot-password', { email });
  },

  /**
   * Đặt lại mật khẩu bằng OTP
   * @param {{ otp: string, matKhauMoi: string }} payload
   */
  resetPassword(payload) {
    return apiClient.post('/api/v1/auth/reset-password', payload);
  },
};