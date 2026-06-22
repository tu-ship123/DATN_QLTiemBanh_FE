import { defineStore } from 'pinia';
import { orderService } from '../services/orderService';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],          // Danh sách lịch sử đơn hàng của khách
    currentOrder: null,  // Chi tiết đơn hàng đang xem hoặc đang check QR thanh toán
    loading: false,
    error: null,
  }),

  getters: {
    hasOrders: (state) => state.orders.length > 0,
  },

  actions: {
    // 1. Lấy toàn bộ lịch sử đơn hàng của tôi
    async fetchMyOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderService.getMyOrders();
        this.orders = response.data;
      } catch (err) {
        this.error = err.response?.data || 'Không thể tải danh sách đơn hàng.';
        console.error('Lỗi lấy lịch sử đơn hàng:', err);
      } finally {
        this.loading = false;
      }
    },

    // 2. Lấy chi tiết 1 đơn hàng theo ID (Dùng khi xem chi tiết hoặc Polling quét QR)
    async fetchOrderById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderService.getOrderById(id);
        this.currentOrder = response.data;
        return response.data;
      } catch (err) {
        this.error = err.response?.data || 'Không thể tải thông tin chi tiết đơn hàng.';
        console.error('Lỗi lấy chi tiết đơn hàng:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // 3. Tạo đơn hàng mới (Gửi dữ liệu từ form checkout lên server)
    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await orderService.createOrder(orderData);
        // Thêm đơn hàng mới vào đầu danh sách lịch sử để cập nhật UI ngay lập tức
        if (response.data) {
          this.orders.unshift(response.data);
        }
        return response.data;
      } catch (err) {
        this.error = err.response?.data || 'Đặt hàng không thành công. Vui lòng kiểm tra lại.';
        console.error('Lỗi đặt hàng tại Store:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});