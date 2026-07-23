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

  /** Khách tự hủy đơn của mình — kèm lý do hủy do khách nhập ở popup xác nhận */
  cancelMyOrder(id, lyDo = '') {
    return apiClient.put(`/api/v1/orders/${id}/cancel`, null, {
      params: lyDo ? { lyDo } : {},
    });
  },

  /**
   * DF_ST05 — Đặt lại đơn cũ (Re-order): thêm TOÀN BỘ sản phẩm của 1 đơn cũ
   * vào giỏ hàng hiện tại của khách. BE tự bỏ qua (và trả về danh sách)
   * những sản phẩm không còn khả dụng thay vì làm hỏng cả thao tác.
   * @returns {Promise<{ data: { gioHang, soSanPhamDaThem, sanPhamBiBoQua } }>}
   */
  reorder(id) {
    return apiClient.post(`/api/v1/orders/${id}/reorder`);
  },

  /**
   * DF_ST06 — Gửi yêu cầu sửa đơn: chỉ áp dụng khi đơn đang ở trạng thái
   * "Chờ xác nhận". BE lưu lại yêu cầu và thông báo realtime cho nhân viên/admin.
   * @param {number} id
   * @param {{ diaChiGiaoHang, soDienThoai, ngayGiaoHang, ghiChu }} payload
   */
  guiYeuCauSuaDon(id, payload) {
    return apiClient.post(`/api/v1/orders/${id}/edit-request`, payload);
  },

  /** Nhân viên hủy hóa đơn POS khi bấm Huỷ / đóng mã QR trước khi khách thanh toán */
  cancelPosOrder(id) {
    return apiClient.delete(`/api/v1/pos/orders/${id}/cancel`);
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

  /** Nhân viên/Admin ghi/cập nhật ghi chú nội bộ (khách hàng không thấy) */
  updateInternalNote(id, ghiChuNoiBo) {
    return apiClient.put(`/api/v1/admin/orders/${id}/internal-note`, null, {
      params: { ghiChuNoiBo },
    });
  },

  /** Nhân viên giao hàng quét mã bill (HD-{id}) khi giao tận nơi -> tự động DA_GIAO */
  scanDelivery(maVach) {
    return apiClient.put('/api/v1/admin/orders/scan-delivery', null, {
      params: { maVach },
    });
  },

  /** Xác nhận thiết kế bánh 3D -> trừ kho phụ kiện + chuyển DANG_LAM + báo khách */
  confirmDesign(id) {
    return apiClient.put(`/api/v1/admin/orders/${id}/confirm-design`);
  },

  /** Từ chối thiết kế bánh 3D + lý do -> đơn về CHO_XAC_NHAN + báo khách sửa lại */
  rejectDesign(id, lyDo) {
    return apiClient.put(`/api/v1/admin/orders/${id}/reject-design`, null, {
      params: { lyDo },
    });
  },
};