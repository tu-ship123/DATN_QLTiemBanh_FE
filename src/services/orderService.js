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
   * @param {string} trangThai - DA_XAC_NHAN | DANG_LAM | SAN_SANG | DANG_GIAO | HOAN_THANH | DA_HUY
   * @param {string} [lyDoHuy] - Bắt buộc khi trangThai = 'DA_HUY'
   */
  processOrder(id, trangThai, lyDoHuy = null) {
    const payload = { trangThai };
    if (lyDoHuy) payload.lyDoHuy = lyDoHuy;
    return apiClient.put(`/api/v1/orders/${id}/process`, payload);
  },

  confirmOrder(id)    { return orderService.processOrder(id, 'DA_XAC_NHAN'); },
  startBaking(id)     { return orderService.processOrder(id, 'DANG_LAM');    },
  markReady(id)       { return orderService.processOrder(id, 'SAN_SANG');    },
  handToShipper(id)   { return orderService.processOrder(id, 'DANG_GIAO');  },
  markDelivered(id)   { return orderService.processOrder(id, 'HOAN_THANH'); },

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  /** Admin lọc đơn hàng nâng cao — @param {object} params { trangThai, nguonDon, tuNgay, denNgay } */
  filterOrders(params = {}) {
    return apiClient.get('/api/v1/admin/orders', { params });
  },

  /** Admin ghi đè trạng thái bỏ qua flow + audit log */
  overrideOrderStatus(id, trangThaiMoi, lyDo = '') {
    return apiClient.put(`/api/v1/admin/orders/${id}/override`, null, {
      params: { trangThaiMoi, lyDo },
    });
  },

  /** Admin hoàn tiền */
  refundOrder(id, lyDo) {
    return apiClient.post(`/api/v1/admin/orders/${id}/refund`, null, {
      params: { lyDo },
    });
  },

  /** Admin hủy đơn + rollback kho */
  cancelAndRollback(id, lyDo) {
    return apiClient.delete(`/api/v1/admin/orders/${id}/cancel`, {
      params: { lyDo },
    });
  },

  // ── ADMIN MỚI ─────────────────────────────────────────────────────────────

  /**
   * Admin chỉnh sửa thông tin đơn (địa chỉ, SĐT, ngày giao, ghi chú).
   * Chỉ gửi các trường cần thay đổi — trường null sẽ bị bỏ qua bên BE.
   * @param {number} id
   * @param {{ diaChiGiaoHang?, soDienThoai?, ngayGiaoHang?, ghiChu? }} payload
   */
  updateOrderInfo(id, payload) {
    return apiClient.put(`/api/v1/admin/orders/${id}/update`, payload);
  },

  /**
   * Admin đổi trạng thái theo flow chuẩn (BE validate thứ tự).
   * Khác với overrideOrderStatus: sẽ báo lỗi nếu nhảy cóc bước.
   * @param {number} id
   * @param {string} trangThaiMoi
   * @param {string} [lyDoHuy] — bắt buộc khi trangThaiMoi = 'DA_HUY'
   */
  changeOrderStatus(id, trangThaiMoi, lyDoHuy) {
    const params = { trangThaiMoi };
    if (lyDoHuy) params.lyDoHuy = lyDoHuy;
    return apiClient.put(`/api/v1/admin/orders/${id}/status`, null, { params });
  },

  /**
   * Lấy dữ liệu đầy đủ để render phiếu in đơn hàng.
   * @returns {OrderDto.PrintResponse}
   */
  getPrintData(id) {
    return apiClient.get(`/api/v1/admin/orders/${id}/print`);
  },

  /** Lấy dữ liệu thiết kế 3D của đơn hàng */
  getOrder3DDesign(id) {
    return apiClient.get(`/api/v1/orders/${id}/design`);
  },
};