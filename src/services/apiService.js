import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// CẢI THIỆN 1: Sử dụng biến môi trường (Tránh Hardcode)
// Lưu ý: Cần tạo file .env ở thư mục gốc và thêm: VITE_API_BASE_URL=http://localhost:8080
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- CẢI THIỆN 2: Logic hàng đợi (Queue) cho Refresh Token ---
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm đẩy các request bị 401 vào phòng chờ
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Hàm báo hiệu có token mới và chạy lại tất cả request trong phòng chờ
const onRerefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = []; // Reset lại hàng đợi
};
// -------------------------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); 
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore();

      // Nếu ĐANG có một request khác gọi API refresh rồi -> Đợi
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      // Nếu CHƯA có ai gọi refresh -> Bật cờ lên và đi gọi API
      isRefreshing = true;

      try {
        const refreshToken = authStore.refreshToken;
        if (!refreshToken) throw new Error('Không tìm thấy Refresh Token');

        const response = await axios.post(
          `${API_URL}/api/v1/auth/refresh?refreshToken=${refreshToken}`
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        
        authStore.accessToken = newAccessToken;
        authStore.refreshToken = newRefreshToken;
        sessionStorage.setItem('accessToken', newAccessToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);

        // Báo hiệu đã có token mới, cho phép các request trong hàng đợi chạy tiếp
        onRerefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        refreshSubscribers = []; // Dọn dẹp hàng đợi nếu thất bại
        console.error('Refresh token thất bại:', refreshError);
        authStore.logout();
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; // Luôn tắt cờ dù gọi API thành công hay thất bại
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;