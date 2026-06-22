import { defineStore } from 'pinia';
import { categoryService } from '../services/categoryService';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],       // danh sách danh mục từ server
    loading: false,
    error: null
  }),

  getters: {
    // Lấy tên danh mục theo id (dùng trong product card nếu cần)
    getCategoryNameById: (state) => (id) => {
      const found = state.categories.find((c) => c.id === id);
      return found ? found.tenDanhMuc : 'Không rõ';
    },

    // Chỉ lấy danh mục đang hoạt động
    activeCategories: (state) => {
      return state.categories.filter((c) => c.hoatDong === true);
    }
  },

  actions: {
    async fetchAllCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await categoryService.getAllCategories();
        // BE trả về List<DanhMucDto.Response>
        this.categories = response.data;
      } catch (err) {
        this.error = 'Không thể tải danh sách danh mục';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
});