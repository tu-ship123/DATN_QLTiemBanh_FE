import apiClient from './apiService';

export const accessoryService = {
  /**
   * T050 - Lấy danh sách phụ kiện trang trí còn hàng (API công khai)
   */
  getAvailableAccessories() {
    return apiClient.get('/api/v1/accessories');
  },
};
