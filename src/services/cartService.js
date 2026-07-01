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

  /** Áp dụng mã giảm giá vào giỏ hàng
   * @param {string} maCode
   */
  apDungMaGiamGia(maCode) {
    return apiClient.post(`${BASE}/discount`, { maCode });
  },

  /** Gỡ mã giảm giá khỏi giỏ hàng */
  xoaMaGiamGia() {
    return apiClient.delete(`${BASE}/discount`);
  },

  /** Áp dụng voucher cá nhân (đổi bằng điểm) vào giỏ hàng
   * @param {number} voucherKhachHangId
   */
  apDungVoucherKhachHang(voucherKhachHangId) {
    return apiClient.post(`${BASE}/voucher`, { voucherKhachHangId });
  },

  /** Gỡ voucher cá nhân khỏi giỏ hàng */
  xoaVoucherKhachHang() {
    return apiClient.delete(`${BASE}/voucher`);
  },
};