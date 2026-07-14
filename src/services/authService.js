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
   * Đăng nhập bằng Google (OAuth2 One Tap / GIS)
   * @param {string} idToken - ID Token trả về từ Google Identity Services
   */
  loginWithGoogle(idToken) {
    return apiClient.post('/api/v1/auth/google', { idToken });
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