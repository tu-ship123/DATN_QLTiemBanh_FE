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

    // ─── Mã giảm giá đang áp dụng (đồng bộ với backend, không còn là state ảo ở FE) ──
    maGiamGiaCode: (state) => state.gioHang?.maGiamGiaCode || null,

    loaiGiamGia: (state) => state.gioHang?.loaiGiamGia || null,

    soTienGiam: (state) => state.gioHang?.soTienGiam || 0,

    coApDungMaGiamGia: (state) => !!state.gioHang?.maGiamGiaCode,

    // ─── Voucher cá nhân (đổi bằng điểm) đang áp dụng ở giỏ hàng ────────────
    voucherKhachHangId: (state) => state.gioHang?.voucherKhachHangId || null,

    tenVoucherKhachHang: (state) => state.gioHang?.tenVoucherKhachHang || null,

    coApDungVoucherKhachHang: (state) => !!state.gioHang?.voucherKhachHangId,

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

    // ─── Áp dụng mã giảm giá ────────────────────────────────────────────────
    // Trả về { success, message } để component tự hiển thị toast/lỗi phù hợp
    async apDungMaGiamGia(maCode) {
      this.error = null;
      try {
        const res = await cartService.apDungMaGiamGia(maCode);
        this.gioHang = res.data;
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data || 'Mã giảm giá không hợp lệ.';
        return { success: false, message };
      }
    },

    // ─── Gỡ mã giảm giá ─────────────────────────────────────────────────────
    async xoaMaGiamGia() {
      this.error = null;
      try {
        const res = await cartService.xoaMaGiamGia();
        this.gioHang = res.data;
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data || 'Gỡ mã thất bại.';
        return { success: false, message };
      }
    },

    // ─── Áp dụng voucher cá nhân (đổi bằng điểm) ────────────────────────────
    async apDungVoucherKhachHang(voucherKhachHangId) {
      this.error = null;
      try {
        const res = await cartService.apDungVoucherKhachHang(voucherKhachHangId);
        this.gioHang = res.data;
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data || 'Áp dụng voucher thất bại.';
        return { success: false, message };
      }
    },

    // ─── Gỡ voucher cá nhân ──────────────────────────────────────────────────
    async xoaVoucherKhachHang() {
      this.error = null;
      try {
        const res = await cartService.xoaVoucherKhachHang();
        this.gioHang = res.data;
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data || 'Gỡ voucher thất bại.';
        return { success: false, message };
      }
    },

    // ─── Reset local (khi logout) ───────────────────────────────────────────
    resetCart() {
      this.gioHang = null;
      this.error = null;
    },
  },
});