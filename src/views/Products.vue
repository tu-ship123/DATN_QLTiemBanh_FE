<template>
  <div :class="isCustomer ? 'chocopine-page' : 'space-y-6'" v-loading="productStore.loading">
    
    <div v-if="isCustomer" class="chocopine-inner animate-fade-in">
      <div class="chocopine-hero">
        <span class="chocopine-eyebrow">Thủ công · Tươi mới mỗi ngày</span>
        <h1 class="chocopine-title">Thực Đơn Bánh Ngọt</h1>
        <p class="chocopine-desc">Khám phá thế giới bánh ngọt tinh tế của Chocopine, được làm thủ công bằng nguyên liệu tự nhiên bởi những nghệ nhân làm bánh hàng đầu.</p>
        <div class="chocopine-divider"></div>
      </div>

      <div class="chocopine-filter-bar chocopine-card">
        <div class="flex gap-2 flex-wrap items-center justify-center">
          <button
            class="chocopine-pill"
            :class="{ 'chocopine-pill--active': activeCategory === null }"
            @click="activeCategory = null"
          >
            Tất cả
          </button>
          
          <template v-if="categoryStore.loading">
            <div v-for="n in 3" :key="n" class="h-8 w-20 rounded-xl animate-pulse" style="background: var(--cream-white-mid)"></div>
          </template>
          
          <button
            v-else
            v-for="cat in categoryStore.activeCategories || categoryStore.categories"
            :key="cat.id"
            class="chocopine-pill"
            :class="{ 'chocopine-pill--active': activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            {{ cat.tenDanhMuc }}
          </button>
        </div>

        <div class="flex gap-3 w-full md:w-auto items-center">
          <div class="relative flex-1 md:w-60">
            <el-icon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base chocopine-text-mid"><Search /></el-icon>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm bánh ngọt..."
              class="chocopine-input"
            />
          </div>
          <el-select v-model="sortBy" style="width:145px" size="default" class="chocopine-select">
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
          class="chocopine-product-card overflow-hidden group transition-all duration-300 flex flex-col justify-between h-[450px]"
        >
          <div class="h-48 relative overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer product-img-wrap" @click="goToDetail(product.id)">
            <img
              :src="product.anhSanPham || defaultImage"
              :alt="product.tenSanPham"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="handleImageError"
            />
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity product-img-overlay"></div>

            <button
              class="wish-btn"
              :class="{ 'wish-btn--active': product.wished }"
              @click.stop="toggleWishlist(product)"
            >
              <iconify-icon :icon="product.wished ? 'ph:heart-fill' : 'ph:heart'" class="text-base"></iconify-icon>
            </button>

            <span v-if="product.isBestseller" class="bestseller-badge"><iconify-icon icon="ph:star-fill" class="inline text-xs"></iconify-icon> Bán chạy</span>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <span class="product-cat">{{ product.tenDanhMuc || 'Bánh ngọt' }}</span>
              <h3 @click="goToDetail(product.id)" class="product-name truncate cursor-pointer" :title="product.tenSanPham">{{ product.tenSanPham }}</h3>
              <p class="product-desc line-clamp-2">
                {{ product.moTa || 'Chiếc bánh thơm ngon mềm mịn, chế biến trong ngày với kem tươi organic hảo hạng.' }}
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between pt-3 mt-4 product-footer-row">
                <div>
                  <span class="product-price">{{ formatPrice(product.donGia) }}</span>
                  <span v-if="product.giaGoc" class="product-price-old">{{ formatPrice(product.giaGoc) }}</span>
                </div>
                <div class="rating-pill">
                  <iconify-icon icon="ph:star-fill" class="rating-star"></iconify-icon>
                  <span class="rating-num">
                    {{ productRatings[product.id]?.avg || '—' }}
                    <span v-if="productRatings[product.id]" style="font-size:9px;color:#A68B5C;font-weight:600;">
                      ({{ productRatings[product.id].count }})
                    </span>
                  </span>
                </div>
              </div>

              <button
                @click.stop="addToCart(product)"
                :disabled="cartStore.loading"
                class="chocopine-btn-primary mt-4 w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'btn-added': product.added }"
              >
                <iconify-icon :icon="cartStore.loading ? 'ph:spinner-gap-bold' : (product.added ? 'ph:check-bold' : 'ph:shopping-cart-simple')" :class="{ 'spin-icon': cartStore.loading }"></iconify-icon>
                {{ cartStore.loading ? 'Đang xử lý...' : (product.added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-box p-16 text-center chocopine-card">
        <h3 class="chocopine-title" style="font-size: 2rem;">Không tìm thấy bánh ngọt phù hợp</h3>
        <p class="chocopine-desc">Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác nhé.</p>
        <button @click="activeCategory = null; search = ''" class="mt-4 text-xs font-extrabold chocopine-accent hover:underline" style="font-family: var(--font-sans)">Xóa bộ lọc</button>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-display font-black text-2xl" style="color:#5C4428">Quản lý sản phẩm</h1>
          <p class="text-sm text-muted mt-0.5">{{ productStore.products.length }} sản phẩm · {{ productStore.products.filter(p => p.trangThai).length }} đang bán</p>
        </div>
        <div class="flex gap-2">
          <div class="flex bg-white border border-[var(--color-border)] rounded-xl p-1">
            <button v-for="v in ['grid','list']" :key="v"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
              :class="viewMode === v ? 'bg-[#7A5C3A] text-white' : 'text-gray-400 hover:text-gray-600'"
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
          :class="activeCategory === null ? 'text-white shadow bg-gradient-to-br from-[#7A5C3A] to-[#9A7650]' : 'bg-white border border-[var(--color-border)] text-gray-500 hover:border-[#7A5C3A] hover:text-[#7A5C3A]'"
          @click="activeCategory = null"
        >Tất cả</button>
        <button v-for="cat in categoryStore.categories" :key="cat.id"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition"
          :class="activeCategory === cat.id ? 'text-white shadow bg-gradient-to-br from-[#7A5C3A] to-[#9A7650]' : 'bg-white border border-[var(--color-border)] text-gray-500 hover:border-[#7A5C3A] hover:text-[#7A5C3A]'"
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
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-[#7A5C3A]" @click.stop="openEdit(product)" title="Sửa"><iconify-icon icon="ph:pencil-simple-duotone"></iconify-icon></button>
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-sm text-red-500" @click.stop="deleteProduct(product)" title="Xoá">🗑</button>
            </div>
            <div class="absolute top-3 left-3">
              <span v-if="!product.trangThai" class="px-2 py-1 rounded bg-gray-500 text-white text-[10px] font-bold uppercase shadow">Tạm ẩn</span>
            </div>
          </div>

          <div class="p-4">
            <div class="font-semibold text-sm mb-1 line-clamp-1" style="color:#5C4428" :title="product.tenSanPham">{{ product.tenSanPham }}</div>
            <div class="text-xs text-muted mb-3">{{ product.tenDanhMuc }} · Tồn: {{ product.soLuongTon }}</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-base" style="color:#7A5C3A">{{ formatPrice(product.donGia) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7A5C3A] hover:bg-[#FFFBF5] transition min-h-[240px]"
          @click="openAdd"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#FDF6EC] flex items-center justify-center text-2xl">+</div>
          <div class="text-sm font-semibold" style="color:#7A5C3A">Thêm sản phẩm</div>
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
                  <div class="font-semibold text-sm line-clamp-1" style="color:#5C4428" :title="row.tenSanPham">{{ row.tenSanPham }}</div>
                  <div class="text-xs text-muted">{{ row.tenDanhMuc }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="GIÁ BÁN" width="150">
            <template #default="{ row }">
              <span class="font-bold" style="color:#7A5C3A">{{ formatPrice(row.donGia) }}</span>
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

// ==========================================
// ĐÁNH GIÁ THẬT — rating động theo sản phẩm
// ==========================================
const productRatings = ref({}) // { [sanPhamId]: { avg: '4.5', count: 12 } }

const loadAllRatings = async (productList) => {
  await Promise.allSettled(
    productList.map(async (p) => {
      try {
        const { data } = await apiClient.get(`/api/v1/products/${p.id}/reviews`)
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.soSao, 0) / data.length
          productRatings.value[p.id] = { avg: avg.toFixed(1), count: data.length }
        }
      } catch (e) {
        // Bỏ qua lỗi từng sản phẩm, không làm crash toàn trang
      }
    })
  )
}

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const handleImageError = (e) => {
  e.target.src = defaultImage
}

// ======================= LOAD DATA =======================
onMounted(async () => {
  // Lấy dữ liệu chuẩn xác thông qua Store giống như Shop.vue
  await productStore.fetchAllProducts()
  categoryStore.fetchAllCategories()

  // Chỉ load ratings ở trang khách hàng
  if (isCustomer.value) {
    loadAllRatings(productStore.products)
  }
})

// ======================= FILTER & SORT =======================
const displayedProducts = computed(() => {
  let result = productStore.products

  // Nếu là khách hàng, chỉ hiện bánh đang bán (trangThai = true) và còn hàng (soLuongTon > 0)
  if (isCustomer.value) {
    result = result.filter(p => p.trangThai !== false && p.soLuongTon > 0)
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
    ElMessage.success(`Đã lưu "${product.tenSanPham}" vào danh sách yêu thích!`)
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

.chocopine-product-card {
  border-radius: 20px;
  background: var(--cream-white);
  border: 1px solid var(--cream-white-deep);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.chocopine-product-card:hover {
  border-color: var(--wheat-brown-pale);
  box-shadow: 0 8px 24px rgba(122, 92, 58, 0.1);
}
.product-img-wrap { background: var(--cream-white-soft); }
.product-img-overlay {
  background: linear-gradient(to top, rgba(92, 68, 40, 0.15) 0%, transparent 60%);
}
.sold-out-badge {
  background: var(--cream-white);
  color: var(--wheat-brown-dark);
  font-family: var(--font-sans);
  font-weight: 900;
  font-size: 12px;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.wish-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(92, 68, 40, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 251, 245, 0.9);
  border: 1px solid var(--cream-white-deep);
  color: var(--wheat-brown-light);
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
  z-index: 10;
}
.wish-btn:hover { transform: scale(1.1); }
.wish-btn--active { color: var(--wheat-brown); }
.bestseller-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--wheat-brown);
  color: var(--cream-white);
  z-index: 10;
}
.product-cat {
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 800;
  color: var(--wheat-brown-mid);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: block;
}
.product-name {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 800;
  color: var(--wheat-brown-dark);
  margin: 4px 0 0;
  transition: color 0.2s;
}
.group:hover .product-name { color: var(--wheat-brown); }
.product-desc {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--wheat-brown-mid);
  margin-top: 8px;
  line-height: 1.5;
}
.product-footer-row {
  border-top: 1px solid var(--cream-white-deep);
}
.product-price {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 900;
  color: var(--wheat-brown);
}
.product-price-old {
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--wheat-brown-light);
  text-decoration: line-through;
  display: block;
}
.rating-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--cream-white-soft);
  border: 1px solid var(--cream-white-deep);
}
.rating-star { color: var(--wheat-brown-mid); font-size: 11px; }
.spin-icon { animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.rating-num {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 800;
  color: var(--wheat-brown-dark);
}
.btn-added {
  background: #10B981 !important;
  box-shadow: none !important;
}
.empty-box {
  border-style: dashed;
}
</style>