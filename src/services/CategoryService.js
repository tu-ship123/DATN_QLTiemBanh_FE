import apiClient from './apiService';

export const categoryService = {
  /**
   * Lấy tất cả danh mục đang hoạt động (công khai)
   * GET /api/v1/categories
   */
  getAllCategories() {
    return apiClient.get('/api/v1/categories');
  },

  /**
   * Lấy chi tiết 1 danh mục
   * GET /api/v1/categories/{id}
   */
  getCategoryById(id) {
    return apiClient.get(`/api/v1/categories/${id}`);
  },

  // ==========================================
  // ADMIN - Quản lý danh mục (cần token ADMIN)
  // ==========================================
  admin: {
    getAll() {
      return apiClient.get('/api/v1/admin/categories');
    },
    getById(id) {
      return apiClient.get(`/api/v1/admin/categories/${id}`);
    },
    create(data) {
      return apiClient.post('/api/v1/admin/categories', data);
    },
    update(id, data) {
      return apiClient.put(`/api/v1/admin/categories/${id}`, data);
    },
    delete(id) {
      return apiClient.delete(`/api/v1/admin/categories/${id}`);
    },
  }
};