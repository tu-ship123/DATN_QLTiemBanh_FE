import apiClient from './apiService';

const BASE = '/api/v1/cart';

export const cartService = {
  /** Lấy toàn bộ giỏ hàng */
  layGioHang() {
    return apiClient.get(BASE);
  },

  /** Thêm sản phẩm vào giỏ
   * @param {{ sanPhamId: number, soLuong: number, thietKeBanhJson?: string }} payload
   */
  themVaoGio(payload) {
    return apiClient.post(`${BASE}/items`, payload);
  },

  /** Cập nhật số lượng một sản phẩm trong giỏ
   * @param {number} chiTietId
   * @param {number} soLuong
   */
  capNhatSoLuong(chiTietId, soLuong) {
    return apiClient.put(`${BASE}/items/${chiTietId}`, { soLuong });
  },

  /** Xóa 1 sản phẩm khỏi giỏ */
  xoaKhoiGio(chiTietId) {
    return apiClient.delete(`${BASE}/items/${chiTietId}`);
  },

  /** Xóa toàn bộ giỏ hàng */
  xoaToanBoGio() {
    return apiClient.delete(BASE);
  },
};
