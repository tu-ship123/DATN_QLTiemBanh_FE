import apiClient from './apiService';

export const productService = {
  /**
   * Lấy danh sách sản phẩm công khai (chỉ DANG_BAN)
   * Dùng cho trang khách hàng
   */
  getAllProducts(params = {}) {
    return apiClient.get('/api/v1/products', { params });
  },

  /**
   * Lấy chi tiết 1 sản phẩm
   */
  getProductById(id) {
    return apiClient.get(`/api/v1/products/${id}`);
  },

  /**
   * Tìm kiếm sản phẩm theo keyword
   */
  searchProducts(keyword) {
    return apiClient.get('/api/v1/products', { params: { keyword } });
  },

  /**
   * Lấy sản phẩm theo danh mục
   */
  getProductsByCategory(danhMucId) {
    return apiClient.get('/api/v1/products', { params: { danhMucId } });
  },

  // ==========================================
  // ADMIN - Quản lý sản phẩm (cần token ADMIN)
  // ==========================================

  admin: {
    getAll(params = {}) {
      return apiClient.get('/api/v1/admin/products', { params });
    },
    getById(id) {
      return apiClient.get(`/api/v1/admin/products/${id}`);
    },
    create(data) {
      return apiClient.post('/api/v1/admin/products', data);
    },
    update(id, data) {
      return apiClient.put(`/api/v1/admin/products/${id}`, data);
    },
    delete(id) {
      return apiClient.delete(`/api/v1/admin/products/${id}`);
    },
  }
};