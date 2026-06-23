<template>
  <div :class="isCustomer ? 'blossom-theme px-4 md:px-12 py-10 max-w-7xl mx-auto space-y-10' : 'space-y-6'" v-loading="productStore.loading">
    
    <div v-if="isCustomer" class="space-y-8 animate-fade-in">
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#EC4899;letter-spacing:2px;text-transform:uppercase;display:block;">Thủ công · Tươi mới mỗi ngày</span>
        <h1 style="font-family:'Playfair Display',serif;font-size:44px;font-weight:950;color:#3D1A2C;letter-spacing:1px;">Thực Đơn Bánh Ngọt</h1>
        <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#7C3D5C;line-height:1.7;">Khám phá thế giới bánh ngọt tinh tế của chúng tôi, được làm thủ công bằng nguyên liệu tự nhiên bởi những nghệ nhân làm bánh hàng đầu.</p>
        <div style="width:48px;height:2px;background:#EC4899;margin:16px auto 0;opacity:0.6;"></div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 justify-between items-center p-4 rounded-[20px]" style="background:#FFFFFF;border:1px solid #FDD8EE;">
        <div class="flex gap-2 flex-wrap items-center justify-center">
          <button
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            :class="activeCategory === null ? 'text-white' : 'text-[#7C3D5C] hover:text-[#EC4899]'"
            :style="activeCategory === null ? 'background:linear-gradient(135deg,#EC4899,#F472B6);border:1px solid transparent;box-shadow:0 4px 12px rgba(236,72,153,0.25);' : 'background:#FFF0F7;border:1px solid #FDD8EE;'"
            @click="activeCategory = null"
          >
            Tất cả
          </button>
          
          <template v-if="categoryStore.loading">
            <div v-for="n in 3" :key="n" class="h-8 w-20 rounded-xl bg-pink-50 animate-pulse"></div>
          </template>
          
          <button
            v-else
            v-for="cat in categoryStore.activeCategories || categoryStore.categories"
            :key="cat.id"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            :class="activeCategory === cat.id ? 'text-white' : 'text-[#7C3D5C] hover:text-[#EC4899]'"
            :style="activeCategory === cat.id ? 'background:linear-gradient(135deg,#EC4899,#F472B6);border:1px solid transparent;box-shadow:0 4px 12px rgba(236,72,153,0.25);' : 'background:#FFF0F7;border:1px solid #FDD8EE;'"
            @click="activeCategory = cat.id"
          >
            {{ cat.tenDanhMuc }}
          </button>
        </div>

        <div class="flex gap-3 w-full md:w-auto items-center">
          <div class="relative flex-1 md:w-60">
            <el-icon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base" style="color:#7C3D5C;"><Search /></el-icon>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm bánh ngọt..."
              class="w-full pl-10 pr-4 py-2 rounded-xl text-xs outline-none transition-all"
              style="border:1px solid #FDD8EE;background:#FFF0F7;color:#3D1A2C;font-family:'DM Sans',sans-serif;"
            />
          </div>
          <el-select v-model="sortBy" style="width:145px" size="default" class="custom-select">
            <el-option label="Mới nhất" value="newest" />
            <el-option label="Giá thấp → cao" value="price-asc" />
            <el-option label="Giá cao → thấp" value="price-desc" />
          </el-select>
        </div>
      </div>

      <div v-if="displayedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in displayedProducts"
          :key="product.id"
          class="overflow-hidden group transition-all duration-300 flex flex-col justify-between h-[450px] product-card"
          style="border-radius:20px;background:#FFFFFF;border:1px solid #FDD8EE;"
          onmouseenter="this.style.borderColor='#F9A8D4';this.style.boxShadow='0 8px 24px rgba(236,72,153,0.08)'"
          onmouseleave="this.style.borderColor='#FDD8EE';this.style.boxShadow='none'"
        >
          <div class="h-48 relative overflow-hidden bg-[#FAFAF9] flex items-center justify-center flex-shrink-0 cursor-pointer" @click="goToDetail(product.id)">
            <img
              :src="product.anhSanPham || defaultImage"
              :alt="product.tenSanPham"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="handleImageError"
            />
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style="background:linear-gradient(to top, rgba(61,26,44,0.15) 0%, transparent 60%);"></div>

            <div v-if="product.soLuongTon === 0" class="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <span class="bg-white text-[#3D1A2C] font-black text-xs px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">Hết hàng</span>
            </div>

            <button
              class="absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center transition hover:scale-110 active:scale-95 z-10"
              style="background:rgba(255,255,255,0.85);border:1px solid #FDD8EE;"
              :class="product.wished ? 'text-[#EC4899]' : 'text-[#B07090]'"
              @click.stop="toggleWishlist(product)"
            >
              <span class="text-base">♥</span>
            </button>

            <span v-if="product.isBestseller" class="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm z-10" style="background:#EC4899;color:#FFFFFF;">
              ★ Bán chạy
            </span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#B07090;text-transform:uppercase;letter-spacing:1.5px;display:block;">{{ product.tenDanhMuc || 'Bánh ngọt' }}</span>
              <h3 @click="goToDetail(product.id)" style="font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#3D1A2C;margin:4px 0 0;letter-spacing:0.3px;" class="truncate cursor-pointer group-hover:text-[#EC4899] transition-colors" :title="product.tenSanPham">{{ product.tenSanPham }}</h3>
              <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;margin-top:8px;line-height:1.5;" class="line-clamp-2">
                {{ product.moTa || 'Chiếc bánh thơm ngon mềm mịn, chế biến trong ngày với kem tươi organic hảo hạng.' }}
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between pt-3 mt-4" style="border-top:1px solid #FFF0F7;">
                <div>
                  <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#EC4899;">{{ formatPrice(product.donGia) }}</span>
                  <span v-if="product.giaGoc" style="font-family:'DM Sans',sans-serif;font-size:11px;color:#B07090;text-decoration:line-through;display:block;">{{ formatPrice(product.giaGoc) }}</span>
                </div>
                <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl" style="background:#FFF0F7;border:1px solid #FDD8EE;">
                  <span style="color:#F59E0B;font-size:11px;">★</span>
                  <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#3D1A2C;">5.0</span>
                </div>
              </div>

              <button
                @click.stop="addToCart(product)"
                :disabled="cartStore.loading || product.soLuongTon === 0"
                class="mt-4 w-full py-3 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.5px;"
                :style="product.added
                  ? 'background:#10B981;color:#FFFFFF;border:none;'
                  : 'background:linear-gradient(135deg,#EC4899,#F472B6);color:#FFFFFF;border:none;box-shadow:0 4px 12px rgba(236,72,153,0.25);'"
              >
                {{ cartStore.loading ? 'Đang xử lý...' : (product.added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-16 text-center" style="border-radius:24px;border:1px dashed #FDD8EE;background:#FFFFFF;">
        <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:750;color:#3D1A2C;margin-bottom:8px;">Không tìm thấy bánh ngọt phù hợp</h3>
        <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;">Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác nhé.</p>
        <button @click="activeCategory = null; search = ''" class="mt-4 text-xs font-bold text-[#EC4899] hover:underline">Xóa bộ lọc</button>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-display font-black text-2xl" style="color:#1E2A3B">Quản lý sản phẩm</h1>
          <p class="text-sm text-muted mt-0.5">{{ productStore.products.length }} sản phẩm · {{ productStore.products.filter(p => p.trangThai).length }} đang bán</p>
        </div>
        <div class="flex gap-2">
          <div class="flex bg-white border border-[var(--color-border)] rounded-xl p-1">
            <button v-for="v in ['grid','list']" :key="v"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              :class="viewMode === v ? 'bg-[#E8634A] text-white' : 'text-gray-400 hover:text-gray-600'"
              @click="viewMode = v">
              {{ v === 'grid' ? '⊞' : '☰' }}
            </button>
          </div>
          <button class="btn-primary" @click="openAdd">
            <el-icon><Plus /></el-icon> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div class="flex gap-2 mb-5 flex-wrap">
        <button
          class="px-4 py-2 rounded-xl text-sm font-semibold transition"
          :class="activeCategory === null ? 'text-white shadow bg-gradient-to-br from-[#E8634A] to-[#F07A5E]' : 'bg-white border border-[var(--color-border)] text-gray-500 hover:border-[#E8634A] hover:text-[#E8634A]'"
          @click="activeCategory = null"
        >Tất cả</button>
        <button v-for="cat in categoryStore.categories" :key="cat.id"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition"
          :class="activeCategory === cat.id ? 'text-white shadow bg-gradient-to-br from-[#E8634A] to-[#F07A5E]' : 'bg-white border border-[var(--color-border)] text-gray-500 hover:border-[#E8634A] hover:text-[#E8634A]'"
          @click="activeCategory = cat.id">
          {{ cat.tenDanhMuc }}
        </button>
      </div>

      <div class="flex gap-3 mb-5">
        <div class="search-input flex-1">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm tên sản phẩm..." />
        </div>
        <el-select v-model="sortBy" style="width:160px">
          <el-option label="Mới nhất" value="newest" />
          <el-option label="Giá thấp → cao" value="price-asc" />
          <el-option label="Giá cao → thấp" value="price-desc" />
        </el-select>
      </div>

      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="product in displayedProducts" :key="product.id"
          class="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
          @click="openEdit(product)"
        >
          <div class="h-44 relative overflow-hidden bg-slate-100">
            <img
              :src="product.anhSanPham || defaultImage"
              :alt="product.tenSanPham"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            <div class="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-sm" @click.stop="openEdit(product)" title="Sửa">✏️</button>
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-sm text-red-500" @click.stop="deleteProduct(product)" title="Xoá">🗑</button>
            </div>
            <div class="absolute top-3 left-3">
              <span v-if="!product.trangThai" class="px-2 py-1 rounded bg-gray-500 text-white text-[10px] font-bold uppercase shadow">Tạm ẩn</span>
            </div>
          </div>

          <div class="p-4">
            <div class="font-semibold text-sm mb-1 line-clamp-1" style="color:#1E2A3B" :title="product.tenSanPham">{{ product.tenSanPham }}</div>
            <div class="text-xs text-muted mb-3">{{ product.tenDanhMuc }} · Tồn: {{ product.soLuongTon }}</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-base" style="color:#E8634A">{{ formatPrice(product.donGia) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#E8634A] hover:bg-[#FFF8F4] transition min-h-[240px]"
          @click="openAdd"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#FFF0EC] flex items-center justify-center text-2xl">+</div>
          <div class="text-sm font-semibold" style="color:#E8634A">Thêm sản phẩm</div>
        </div>
      </div>

      <div v-else class="data-card">
        <el-table :data="displayedProducts" style="width:100%">
          <el-table-column label="SẢN PHẨM" min-width="240">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <img :src="row.anhSanPham || defaultImage" class="h-full w-full object-cover" @error="handleImageError" />
                </div>
                <div>
                  <div class="font-semibold text-sm line-clamp-1" style="color:#1E2A3B" :title="row.tenSanPham">{{ row.tenSanPham }}</div>
                  <div class="text-xs text-muted">{{ row.tenDanhMuc }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="GIÁ BÁN" width="150">
            <template #default="{ row }">
              <span class="font-bold" style="color:#E8634A">{{ formatPrice(row.donGia) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="TỒN KHO" width="100" align="center">
            <template #default="{ row }"><span class="font-semibold">{{ row.soLuongTon }}</span></template>
          </el-table-column>
          <el-table-column label="TRẠNG THÁI" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="row.trangThai ? 'success' : 'info'" size="small">
                {{ row.trangThai ? 'Đang bán' : 'Tạm ẩn' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="THAO TÁC" width="120" align="center">
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-3">
                <button class="btn-secondary py-1 px-3 text-xs" @click="openEdit(row)">Sửa</button>
                <button class="text-red-400 hover:text-red-500 text-sm" title="Xoá" @click="deleteProduct(row)">🗑</button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <AdminProductModal
        v-if="showProductDialog"
        v-model:visible="showProductDialog"
        :editing-product="editingProduct"
        @save="handleSaveProduct"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import AdminProductModal from './AdminProductModal.vue'

// Import trực tiếp các Store của bạn như trong Shop.vue
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/services/apiService'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isCustomer = computed(() => route.path.startsWith('/shop'))

const viewMode = ref('grid')
const search = ref('')
const activeCategory = ref(null) // null = Tất cả, số = danhMucId
const sortBy = ref('newest')
const showProductDialog = ref(false)
const editingProduct = ref(null)

const defaultImage = 'https://placehold.co/400x300?text=Polycake'

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const handleImageError = (e) => {
  e.target.src = defaultImage
}

// ======================= LOAD DATA =======================
onMounted(() => {
  // Lấy dữ liệu chuẩn xác thông qua Store giống như Shop.vue
  productStore.fetchAllProducts()
  categoryStore.fetchAllCategories()
})

// ======================= FILTER & SORT =======================
const displayedProducts = computed(() => {
  let result = productStore.products

  // Nếu là khách hàng, chỉ hiện bánh đang bán (trangThai = true)
  if (isCustomer.value) {
    result = result.filter(p => p.trangThai !== false)
  }

  // Lọc theo Danh mục
  if (activeCategory.value !== null) {
    result = result.filter(p => p.danhMucId === activeCategory.value)
  }
  
  // Lọc theo Tìm kiếm
  if (search.value) {
    result = result.filter(p => p.tenSanPham?.toLowerCase().includes(search.value.toLowerCase()))
  }
  
  // Sắp xếp
  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))
  } else if (sortBy.value === 'price-asc') {
    result = [...result].sort((a, b) => a.donGia - b.donGia)
  } else if (sortBy.value === 'price-desc') {
    result = [...result].sort((a, b) => b.donGia - a.donGia)
  }

  return result
})

const goToDetail = (id) => {
  router.push(`/shop/product/${id}`)
}

// ======================= THÊM VÀO GIỎ HÀNG =======================
const addToCart = async (product) => {
  if (product.soLuongTon === 0) {
    ElMessage.warning('Sản phẩm này đã hết hàng!')
    return
  }
  if (!authStore.isAuthenticated) {
    ElMessage.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!')
    router.push('/login')
    return
  }

  // Chú ý: Gọi y hệt như Shop.vue
  const result = await cartStore.themVaoGio(product.id, 1)
  
  if (result.success) {
    product.added = true
    setTimeout(() => { product.added = false }, 1800)
    ElMessage.success(`Đã thêm "${product.tenSanPham}" vào giỏ hàng!`)
  } else {
    ElMessage.error(typeof result.message === 'string' ? result.message : 'Thêm vào giỏ thất bại, vui lòng thử lại!')
  }
}

function toggleWishlist(product) {
  product.wished = !product.wished
  if(product.wished) {
    ElMessage.success(`Đã lưu "${product.tenSanPham}" vào danh sách yêu thích! ♥`)
  } else {
    ElMessage.info(`Đã bỏ lưu "${product.tenSanPham}".`)
  }
}

// ======================= ADMIN LOGIC =======================
function openAdd() { editingProduct.value = null; showProductDialog.value = true }
function openEdit(product) { editingProduct.value = product; showProductDialog.value = true }

function handleSaveProduct() {
  // Sau khi AdminProductModal lưu thành công, reload lại danh sách
  productStore.fetchAllProducts()
  showProductDialog.value = false
}

function deleteProduct(product) {
  ElMessageBox.confirm(`Bạn có chắc chắn muốn xoá vĩnh viễn "${product.tenSanPham}"?`, 'Xác nhận xoá', { 
    confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning' 
  }).then(async () => { 
      try {
        await apiClient.delete(`/api/v1/products/${product.id}`)
        productStore.fetchAllProducts()
        ElMessage.success('Đã xoá sản phẩm thành công') 
      } catch(e) {
        ElMessage.error(e.response?.data || 'Có lỗi xảy ra, không thể xóa sản phẩm')
      }
  }).catch(()=>{})
}
</script>

<style scoped>
.animate-fade-in { 
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
}
@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(12px); } 
  to { opacity: 1; transform: translateY(0); } 
}

/* Custom Select cho Theme Khách hàng */
:deep(.custom-select .el-input__wrapper) {
  background-color: #FFF0F7;
  border-radius: 1rem;
  box-shadow: none !important;
  border: 1px solid #FDD8EE;
  padding: 6px 12px;
}
:deep(.custom-select .el-input__wrapper.is-focus) {
  border-color: #EC4899;
}
:deep(.custom-select .el-input__inner) {
  color: #3D1A2C;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>