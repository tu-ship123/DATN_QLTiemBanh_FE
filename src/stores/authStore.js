import { defineStore } from 'pinia';
import { authService } from '../services/authService';

// ─── HÀM GIẢI MÃ JWT TOKEN ──────────────────────────────────────────────────
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
};

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

    userRole: (state) => {
      const rawRole = state.user?.role || state.user?.quyen || '';
      return rawRole.trim().toUpperCase();
    },

    isAdmin(state) {
      return this.userRole.includes('ADMIN');
    },
    isNhanVien(state) {
      return this.userRole.includes('NHAN_VIEN');
    },
    isKhachHang(state) {
      return this.userRole.includes('KHACH_HANG');
    },
  },

  actions: {
    setAuthData(data) {
      this.accessToken = data.accessToken || data.token;
      this.refreshToken = data.refreshToken;
      
      if (this.accessToken) sessionStorage.setItem('accessToken', this.accessToken);
      if (this.refreshToken) sessionStorage.setItem('refreshToken', this.refreshToken);
    },

    setUser(userData) {
      this.user = userData;
      if (userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);
        const data = response.data;

        // 1. Lưu Token vào bộ nhớ
        this.setAuthData(data);

        // 2. BÍ KÍP: GIẢI MÃ TOKEN ĐỂ TÌM QUYỀN ADMIN
        const decoded = parseJwt(this.accessToken);
        console.log("🔍 Dữ liệu giấu trong Token:", decoded);

        // 3. Quét tìm quyền trong các biến phổ biến mà Spring Boot hay dùng
        let currentRole = '';
        
        // Xử lý nếu Spring trả về mảng (vd: authorities: [{authority: "ROLE_ADMIN"}])
        if (Array.isArray(decoded.authorities) && decoded.authorities.length > 0) {
          const auth = decoded.authorities[0];
          currentRole = typeof auth === 'object' ? auth.authority : auth;
        } else if (Array.isArray(decoded.roles) && decoded.roles.length > 0) {
          currentRole = decoded.roles[0];
        } else if (decoded.scope) {
          currentRole = decoded.scope;
        } else {
          // Xử lý chuỗi thông thường
          currentRole = String(decoded.role || decoded.roles || decoded.authorities || decoded.quyen || '');
        }

        currentRole = currentRole.trim().toUpperCase();

        // 4. Tạo user ảo từ token để Vue lưu trạng thái đăng nhập
        const userData = {
          email: credentials.email,
          role: currentRole
        };
        this.setUser(userData);

        // 5. Kiểm tra quyền và chuyển hướng
        if (currentRole.includes('ADMIN')) {
          return '/admin/dashboard';
        } else if (currentRole.includes('NHAN_VIEN')) {
          return '/staff-area/checkin';
        } else {
          return '/shop'; 
        }

      } catch (err) {
        console.error("❌ [LỖI GỐC TẠI STORE]:", err);
        this.error =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch (err) {
        console.warn('Logout API lỗi (vẫn xóa local):', err.message);
      } finally {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.error = null;
        sessionStorage.clear();
      }
    },
  },
});