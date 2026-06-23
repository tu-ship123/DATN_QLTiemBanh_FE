import apiClient from './apiService';

export const orderService = {
  // ── KHÁCH HÀNG ────────────────────────────────────────────────────────────

  /** Tạo đơn hàng mới (Checkout) */
  createOrder(orderData) {
    return apiClient.post('/api/v1/orders', orderData);
  },

  /** Lấy lịch sử đơn hàng của tôi */
  getMyOrders() {
    return apiClient.get('/api/v1/orders/my-orders');
  },

  /** Xem chi tiết một đơn hàng theo ID */
  getOrderById(id) {
    return apiClient.get(`/api/v1/orders/${id}`);
  },

  /** Khách tự hủy đơn của mình */
  cancelMyOrder(id) {
    return apiClient.put(`/api/v1/orders/${id}/cancel`);
  },

  // ── NHÂN VIÊN / TIỆM BÁNH ─────────────────────────────────────────────────

  /** Lấy toàn bộ đơn hàng (ADMIN / NHAN_VIEN) */
  getAllOrders() {
    return apiClient.get('/api/v1/orders');
  },

  /**
   * Cập nhật trạng thái đơn hàng (NHAN_VIEN / ADMIN)
   * @param {number} id - ID đơn hàng
   * @param {string} trangThai - Trạng thái mới:
   *   DA_XAC_NHAN | DANG_LAM | SAN_SANG | DANG_GIAO | HOAN_THANH | DA_HUY
   * @param {string} [lyDoHuy] - Bắt buộc khi trangThai = 'DA_HUY'
   */
  processOrder(id, trangThai, lyDoHuy = null) {
    const payload = { trangThai };
    if (lyDoHuy) payload.lyDoHuy = lyDoHuy;
    return apiClient.put(`/api/v1/orders/${id}/process`, payload);
  },

  // ── SHORTCUTS CHO TIỆM BÁNH ───────────────────────────────────────────────

  /** Tiệm xác nhận đơn: CHO_XAC_NHAN → DA_XAC_NHAN */
  confirmOrder(id) {
    return orderService.processOrder(id, 'DA_XAC_NHAN');
  },

  /** Tiệm bắt đầu làm: DA_XAC_NHAN → DANG_LAM */
  startBaking(id) {
    return orderService.processOrder(id, 'DANG_LAM');
  },

  /** Bánh xong, sẵn sàng giao: DANG_LAM → SAN_SANG */
  markReady(id) {
    return orderService.processOrder(id, 'SAN_SANG');
  },

  /** Chuyển đơn cho shipper: SAN_SANG → DANG_GIAO */
  handToShipper(id) {
    return orderService.processOrder(id, 'DANG_GIAO');
  },

  // ── SHORTCUTS CHO SHIPPER ─────────────────────────────────────────────────

  /** Shipper xác nhận giao xong: DANG_GIAO → HOAN_THANH */
  markDelivered(id) {
    return orderService.processOrder(id, 'HOAN_THANH');
  },

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  /**
   * Admin lọc đơn hàng nâng cao
   * @param {object} params - { trangThai, nguonDon, tuNgay, denNgay }
   */
  filterOrders(params = {}) {
    return apiClient.get('/api/v1/admin/orders', { params });
  },

  /**
   * Admin ghi đè trạng thái + audit log
   * @param {number} id
   * @param {string} trangThaiMoi
   * @param {string} [lyDo]
   */
  overrideOrderStatus(id, trangThaiMoi, lyDo = '') {
    return apiClient.put(`/api/v1/admin/orders/${id}/override`, null, {
      params: { trangThaiMoi, lyDo }
    });
  },

  /** Admin hoàn tiền */
  refundOrder(id, lyDo) {
    return apiClient.post(`/api/v1/admin/orders/${id}/refund`, null, {
      params: { lyDo }
    });
  },

  /** Admin hủy đơn + rollback kho */
  cancelAndRollback(id, lyDo) {
    return apiClient.delete(`/api/v1/admin/orders/${id}/cancel`, {
      params: { lyDo }
    });
  },

  /** Lấy dữ liệu thiết kế 3D của đơn hàng */
  getOrder3DDesign(id) {
    return apiClient.get(`/api/v1/orders/${id}/design`);
  },
};