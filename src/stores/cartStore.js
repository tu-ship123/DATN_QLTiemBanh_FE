import { defineStore } from 'pinia';
import { cartService } from '../services/cartService';

export const useCartStore = defineStore('cart', {
  state: () => ({
    gioHang: null,      // GioHangResponse từ BE
    loading: false,
    error: null,
  }),

  getters: {
    items: (state) => state.gioHang?.items || [],

    tongSoLuong: (state) => state.gioHang?.tongSoLuong || 0,

    tongTienHang: (state) => state.gioHang?.tongTienHang || 0,

    phiShip: (state) => state.gioHang?.phiShip || 0,

    tongThanhToan: (state) => state.gioHang?.tongThanhToan || 0,

    soLuongBadge: (state) => state.gioHang?.tongSoLuong || 0,
  },

  actions: {
    // ─── Lấy giỏ hàng ──────────────────────────────────────────────────────
    async fetchGioHang() {
      this.loading = true;
      this.error = null;
      try {
        const res = await cartService.layGioHang();
        this.gioHang = res.data;
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403 || status === 400) {
          this.gioHang = null;
          return; // Không báo lỗi, chỉ reset giỏ
        }
        this.error = err.response?.data || 'Không thể tải giỏ hàng.';
        console.error('[CartStore] fetchGioHang:', err);
      } finally {
        this.loading = false;
      }
    },

    // ─── Thêm sản phẩm ─────────────────────────────────────────────────────
    async themVaoGio(sanPhamId, soLuong = 1, thietKeBanhJson = null, donGiaTuyChinh = null) {
      this.loading = true;
      this.error = null;
      try {
        const res = await cartService.themVaoGio({ sanPhamId, soLuong, thietKeBanhJson, donGiaTuyChinh });
        this.gioHang = res.data;
        return { success: true };
      } catch (err) {
        this.error = err.response?.data || 'Không thể thêm sản phẩm.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // ─── Cập nhật số lượng ─────────────────────────────────────────────────
    async capNhatSoLuong(chiTietId, soLuong) {
      this.error = null;
      try {
        const res = await cartService.capNhatSoLuong(chiTietId, soLuong);
        this.gioHang = res.data;
      } catch (err) {
        this.error = err.response?.data || 'Cập nhật thất bại.';
        console.error('[CartStore] capNhatSoLuong:', err);
      }
    },

    // ─── Xóa 1 sản phẩm ────────────────────────────────────────────────────
    async xoaItem(chiTietId) {
      this.error = null;
      try {
        const res = await cartService.xoaKhoiGio(chiTietId);
        this.gioHang = res.data;
      } catch (err) {
        this.error = err.response?.data || 'Xóa thất bại.';
        console.error('[CartStore] xoaItem:', err);
      }
    },

    // ─── Xóa toàn bộ ───────────────────────────────────────────────────────
    async xoaToanBo() {
      this.error = null;
      try {
        await cartService.xoaToanBoGio();
        this.gioHang = null;
      } catch (err) {
        this.error = err.response?.data || 'Xóa thất bại.';
        console.error('[CartStore] xoaToanBo:', err);
      }
    },

    // ─── Reset local (khi logout) ───────────────────────────────────────────
    resetCart() {
      this.gioHang = null;
      this.error = null;
    },
  },
});