import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Trỏ thẳng về cổng 8080 của Backend Spring Boot
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRerefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// ─── Request Interceptor: tự động gắn Bearer Token ───────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    // Ưu tiên lấy token từ Pinia, dự phòng bằng sessionStorage
    const token = authStore.accessToken || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: tự động refresh token khi 401 ─────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa từng thử refresh lại
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore();

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = authStore.refreshToken || sessionStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Không tìm thấy Refresh Token');

        // Gọi axios độc lập (không dùng apiClient) để không bị kẹt vòng lặp Interceptor
        const response = await axios.post(
          `${API_URL}/api/v1/auth/refresh?refreshToken=${refreshToken}`
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken || refreshToken; // Đề phòng BE không trả về refresh token mới

        // Lưu token mới vào Store và Session
        authStore.setAuthData({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });

        onRerefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Chạy lại request lúc nãy bị lỗi 401

      } catch (refreshError) {
        refreshSubscribers = [];
        console.error('Refresh token thất bại:', refreshError);
        
        // Cực kỳ quan trọng: Xóa sạch dữ liệu cũ và đá về trang Đăng nhập
        sessionStorage.clear();
        authStore.user = null;
        authStore.accessToken = null;
        authStore.refreshToken = null;
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;