import apiClient from './apiService';

const BASE = '/api/v1/messages';

export const messagesService = {
  /** Lấy toàn bộ tin nhắn của chính khách hàng đang đăng nhập */
  getMyMessages() {
    return apiClient.get(`${BASE}/me`);
  },

  /** Gửi tin nhắn mới tới cửa hàng
   * @param {string} noiDung
   */
  sendMessage(noiDung) {
    return apiClient.post(`${BASE}/me`, { noiDung });
  },
};
