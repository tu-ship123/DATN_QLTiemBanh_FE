import { defineStore } from 'pinia';
import { productService } from '../services/productService';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],       // danh sách sản phẩm từ server
    loading: false,
    error: null
  }),

  getters: {
    // Lọc sản phẩm theo danhMucId
    getProductsByCategory: (state) => (danhMucId) => {
      if (!danhMucId) return state.products;
      return state.products.filter((p) => p.danhMucId === danhMucId);
    },

    // Lọc sản phẩm còn hàng
    availableProducts: (state) => {
      return state.products.filter((p) => p.soLuongTon > 0);
    }
  },

  actions: {
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await productService.getAllProducts();
        // BE trả về List<SanPhamDto.Response>
        this.products = response.data;
      } catch (err) {
        this.error = 'Không thể tải danh sách sản phẩm';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
});