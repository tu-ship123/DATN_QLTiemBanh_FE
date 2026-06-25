import { defineStore } from 'pinia';
import { categoryService } from '../services/categoryService';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  getters: {
    getCategoryNameById: (state) => (id) => {
      const found = state.categories.find((c) => c.id === id);
      return found ? found.tenDanhMuc : 'Không rõ';
    },

    activeCategories: (state) => {
      return state.categories.filter((c) => c.hoatDong === true);
    }
  },

  actions: {
    // Dùng cho trang khách hàng (public)
    async fetchAllCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await categoryService.getAllCategories();
        this.categories = response.data;
      } catch (err) {
        this.error = 'Không thể tải danh sách danh mục';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // Dùng cho trang admin (lấy tất cả kể cả ẩn)
    async fetchAdminCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await categoryService.admin.getAll();
        this.categories = response.data;
      } catch (err) {
        this.error = 'Không thể tải danh mục admin';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
});