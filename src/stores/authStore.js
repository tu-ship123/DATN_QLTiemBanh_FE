import { defineStore } from 'pinia';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    accessToken: sessionStorage.getItem('accessToken') || null,
    refreshToken: sessionStorage.getItem('refreshToken') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,

    // Trả về role của user hiện tại: 'ADMIN' | 'NHAN_VIEN' | 'KHACH_HANG'
    userRole: (state) => state.user?.role || null,

    isAdmin: (state) => state.user?.role === 'ADMIN',
    isNhanVien: (state) => state.user?.role === 'NHAN_VIEN',
    isKhachHang: (state) => state.user?.role === 'KHACH_HANG',
  },

  actions: {
    // ─── Lưu token vào state + sessionStorage ──────────────────────────────
    setAuthData(authResponse) {
      this.accessToken = authResponse.accessToken;
      this.refreshToken = authResponse.refreshToken;
      sessionStorage.setItem('accessToken', authResponse.accessToken);
      sessionStorage.setItem('refreshToken', authResponse.refreshToken);
    },

    // ─── Lưu thông tin user ────────────────────────────────────────────────
    setUser(userData) {
      this.user = userData;
      sessionStorage.setItem('user', JSON.stringify(userData));
    },

    // ─── LOGIN: gọi API → lưu token → redirect theo role ──────────────────
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);
        const data = response.data;

        // Lưu token
        this.setAuthData({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        // Lưu thông tin user (backend trả về trong data.user hoặc trực tiếp)
        const userData = data.user || {
          id: data.id,
          hoTen: data.hoTen,
          email: data.email,
          role: data.role,
        };
        this.setUser(userData);

        // ── Redirect theo role ─────────────────────────────────────────────
        const role = userData.role;
        if (role === 'ADMIN') {
          return '/dashboard';        // Trang admin dashboard
        } else if (role === 'NHAN_VIEN') {
          return '/pos';              // Nhân viên vào thẳng POS
        } else {
          return '/shop';             // Khách hàng vào trang shop
        }

      } catch (err) {
        // Lấy message lỗi từ backend hoặc fallback
        this.error =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ─── LOGOUT: gọi API → xóa state → về trang login ─────────────────────
    async logout() {
      try {
        // Gọi API logout để server invalidate token
        await authService.logout();
      } catch (err) {
        // Dù API lỗi vẫn xóa local — không block user
        console.warn('Logout API lỗi (vẫn xóa local):', err.message);
      } finally {
        // Xóa toàn bộ state
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.error = null;
        sessionStorage.clear();
      }
    },
  },
});