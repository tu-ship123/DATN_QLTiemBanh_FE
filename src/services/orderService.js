import apiClient from './apiService';

export const orderService = {
  // Tạo đơn hàng mới (Checkout)
  createOrder(orderData) {
    return apiClient.post('/api/v1/orders', orderData);
  },

  // Lấy lịch sử đơn hàng của tôi
  getMyOrders() {
    return apiClient.get('/api/v1/orders/my-orders');
  },

  // Xem chi tiết một đơn hàng theo ID (để dùng cho việc check trạng thái SePay)
  getOrderById(id) {
    return apiClient.get(`/api/v1/orders/${id}`);
  }
};