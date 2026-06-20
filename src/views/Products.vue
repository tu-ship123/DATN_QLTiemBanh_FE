<template>
  <div :class="isCustomer ? 'blossom-theme px-4 md:px-12 py-10 max-w-7xl mx-auto space-y-10' : 'space-y-6'">
    
    <!-- ==================== FRONTEND KHÁCH HÀNG (SHOP GALLERY) ==================== -->
    <div v-if="isCustomer" class="space-y-8 animate-fade-in">
      <!-- Banner / Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#EC4899;letter-spacing:2px;text-transform:uppercase;display:block;">Thủ công · Tươi mới mỗi ngày</span>
        <h1 style="font-family:'Playfair Display',serif;font-size:44px;font-weight:950;color:#3D1A2C;letter-spacing:1px;">Thực Đơn Bánh Ngọt</h1>
        <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#7C3D5C;line-height:1.7;">Khám phá thế giới bánh ngọt tinh tế của chúng tôi, được làm thủ công bằng nguyên liệu tự nhiên bởi những nghệ nhân làm bánh hàng đầu.</p>
        <div style="width:48px;height:2px;background:#EC4899;margin:16px auto 0;opacity:0.6;"></div>
      </div>

      <!-- Lọc & Tìm kiếm -->
      <div class="flex flex-col md:flex-row gap-4 justify-between items-center p-4 rounded-[20px]" style="background:#FFFFFF;border:1px solid #FDD8EE;">
        <!-- Nhóm phân loại -->
        <div class="flex gap-2 flex-wrap items-center justify-center">
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
            :class="activeCategory === cat
              ? 'text-white'
              : 'text-[#7C3D5C] hover:text-[#EC4899]'"
            :style="activeCategory === cat
              ? 'background:linear-gradient(135deg,#EC4899,#F472B6);border:1px solid transparent;box-shadow:0 4px 12px rgba(236,72,153,0.25);'
              : 'background:#FFF0F7;border:1px solid #FDD8EE;'"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Tìm kiếm & Sắp xếp -->
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
          <el-select v-model="sortBy" style="width:145px" size="default">
            <el-option label="Bán chạy nhất" value="popular" />
            <el-option label="Giá cao → thấp" value="price-desc" />
            <el-option label="Giá thấp → cao" value="price-asc" />
            <el-option label="Mới nhất" value="newest" />
          </el-select>
        </div>
      </div>

      <!-- Lưới sản phẩm -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="overflow-hidden group transition-all duration-300 flex flex-col justify-between h-[450px] product-card"
          style="border-radius:20px;background:#FFFFFF;border:1px solid #FDD8EE;"
          onmouseenter="this.style.borderColor='#F9A8D4';this.style.boxShadow='0 8px 24px rgba(236,72,153,0.08)'"
          onmouseleave="this.style.borderColor='#FDD8EE';this.style.boxShadow='none'"
        >
          <!-- Hình ảnh sản phẩm -->
          <div class="h-48 relative overflow-hidden bg-[#FAFAF9] flex items-center justify-center flex-shrink-0">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              @error="handleImageError"
            />
            <!-- Gradient overlay -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style="background:linear-gradient(to top, rgba(61,26,44,0.15) 0%, transparent 60%);"></div>

            <!-- Thêm vào yêu thích -->
            <button
              class="absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center transition hover:scale-110 active:scale-95"
              style="background:rgba(255,255,255,0.85);border:1px solid #FDD8EE;"
              :class="product.wished ? 'text-[#EC4899]' : 'text-[#B07090]'"
              @click.stop="toggleWishlist(product)"
            >
              <span class="text-base">♥</span>
            </button>

            <!-- Nhãn Best Seller -->
            <span v-if="product.isBestseller" class="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm" style="background:#EC4899;color:#FFFFFF;">
              ★ Bán chạy
            </span>
          </div>

            <!-- Chi tiết bánh -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;color:#B07090;text-transform:uppercase;letter-spacing:1.5px;display:block;">{{ product.category }}</span>
                <h3 style="font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#3D1A2C;margin:4px 0 0;letter-spacing:0.3px;" class="truncate group-hover:text-[#EC4899] transition-colors" :title="product.name">{{ product.name }}</h3>
                <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;margin-top:8px;line-height:1.5;" class="line-clamp-2">
                  Chiếc bánh thơm ngon mềm mịn, chế biến trong ngày với kem tươi organic hảo hạng.
                </p>
              </div>

              <div>
                <div class="flex items-center justify-between pt-3 mt-4" style="border-top:1px solid #FFF0F7;">
                  <div>
                    <span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#EC4899;">{{ product.price }}</span>
                    <span v-if="product.originalPrice" style="font-family:'DM Sans',sans-serif;font-size:11px;color:#B07090;text-decoration:line-through;display:block;">{{ product.originalPrice }}</span>
                  </div>
                  <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl" style="background:#FFF0F7;border:1px solid #FDD8EE;">
                    <span style="color:#F59E0B;font-size:11px;">★</span>
                    <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#3D1A2C;">{{ product.rating }}</span>
                  </div>
                </div>

                <!-- Thêm vào giỏ -->
                <button
                  @click="addToCart(product)"
                  class="mt-4 w-full py-3 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2"
                  style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.5px;"
                  :style="product.added
                    ? 'background:#10B981;color:#FFFFFF;border:none;'
                    : 'background:linear-gradient(135deg,#EC4899,#F472B6);color:#FFFFFF;border:none;box-shadow:0 4px 12px rgba(236,72,153,0.25);'"
                >
                  {{ product.added ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ' }}
                </button>
              </div>
            </div>
          </div>
      </div>

      <!-- Không tìm thấy sản phẩm -->
      <div v-else class="p-16 text-center" style="border-radius:24px;border:1px dashed #FDD8EE;background:#FFFFFF;">
        <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:750;color:#3D1A2C;margin-bottom:8px;">Không tìm thấy bánh ngọt phù hợp</h3>
        <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;">Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác nhé.</p>
      </div>
    </div>

    <!-- ==================== BACKEND QUẢN TRỊ (ADMIN/STAFF VIEW) ==================== -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-display font-black text-2xl" style="color:#1E2A3B">Quản lý sản phẩm</h1>
          <p class="text-sm text-muted mt-0.5">{{ products.length }} sản phẩm · {{ activeProducts }} đang bán</p>
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

      <!-- Category tabs -->
      <div class="flex gap-2 mb-5 flex-wrap">
        <button v-for="cat in categories" :key="cat"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition"
          :class="activeCategory === cat ? 'text-white shadow' : 'bg-white border border-[var(--color-border)] text-gray-500 hover:border-[#E8634A] hover:text-[#E8634A]'"
          :style="activeCategory === cat ? 'background:linear-gradient(135deg,#E8634A,#F07A5E)' : ''"
          @click="activeCategory = cat">
          {{ cat }}
        </button>
      </div>

      <!-- Search + Filter -->
      <div class="flex gap-3 mb-5">
        <div class="search-input flex-1">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm sản phẩm..." />
        </div>
        <el-select v-model="sortBy" style="width:160px">
          <el-option label="Bán chạy nhất" value="popular" />
          <el-option label="Giá cao → thấp" value="price-desc" />
          <el-option label="Giá thấp → cao" value="price-asc" />
          <el-option label="Mới nhất" value="newest" />
        </el-select>
      </div>

      <!-- GRID VIEW -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="product in filteredProducts" :key="product.id"
          class="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
          @click="openEdit(product)"
        >
          <!-- Product Image -->
          <div class="h-44 relative overflow-hidden bg-slate-100">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              @error="handleImageError"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            <div class="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-sm" @click.stop="openEdit(product)" title="Sửa">✏️</button>
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-sm" @click.stop="toggleActiveGrid(product)" :title="product.active ? 'Tạm dừng bán' : 'Mở bán lại'">
                {{ product.active ? '⏸️' : '▶️' }}
              </button>
              <button class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-sm" @click.stop="deleteProduct(product)" title="Xoá">🗑</button>
            </div>
            <div class="absolute top-3 left-3">
              <span v-if="product.isBestseller" class="badge badge-warning text-xs">🔥 Bán chạy</span>
              <span v-if="!product.active" class="badge badge-gray text-xs">Tạm dừng</span>
            </div>
          </div>

          <div class="p-4">
            <div class="font-semibold text-sm mb-1" style="color:#1E2A3B">{{ product.name }}</div>
            <div class="text-xs text-muted mb-3">{{ product.category }} · {{ product.soldCount }} đã bán</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-base" style="color:#E8634A">{{ product.price }}</div>
                <div v-if="product.originalPrice" class="text-xs text-muted line-through">{{ product.originalPrice }}</div>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-yellow-400 text-sm">★</span>
                <span class="text-sm font-semibold" style="color:#1E2A3B">{{ product.rating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add new card -->
        <div
          class="bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#E8634A] hover:bg-[#FFF8F4] transition min-h-[240px]"
          @click="openAdd"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#FFF0EC] flex items-center justify-center text-2xl">+</div>
          <div class="text-sm font-semibold" style="color:#E8634A">Thêm sản phẩm</div>
        </div>
      </div>

      <!-- LIST VIEW -->
      <div v-else class="data-card">
        <el-table :data="filteredProducts" style="width:100%">
          <el-table-column label="SẢN PHẨM" min-width="240">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img :src="row.image" :alt="row.name" class="h-full w-full object-cover" @error="handleImageError" />
                </div>
                <div>
                  <div class="font-semibold text-sm" style="color:#1E2A3B">{{ row.name }}</div>
                  <div class="text-xs text-muted">{{ row.category }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="GIÁ BÁN" width="150">
            <template #default="{ row }">
              <div v-if="inlineEditId === row.id" class="flex items-center gap-1" @click.stop>
                <el-input
                  v-model="inlineEditValue"
                  size="small"
                  style="width:110px"
                  @keyup.enter="saveInlinePrice(row)"
                  @blur="saveInlinePrice(row)"
                />
              </div>
              <span
                v-else
                class="font-bold cursor-pointer hover:underline decoration-dashed"
                style="color:#E8634A"
                title="Bấm để sửa nhanh giá"
                @click="startInlinePrice(row)"
              >{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ĐÃ BÁN" width="100" align="center">
            <template #default="{ row }"><span class="font-semibold">{{ row.soldCount }}</span></template>
          </el-table-column>
          <el-table-column label="ĐÁNH GIÁ" width="100" align="center">
            <template #default="{ row }"><span>★ {{ row.rating }}</span></template>
          </el-table-column>
          <el-table-column label="TRẠNG THÁI" width="120" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.active" :active-color="'#E8634A'" @change="toggleProduct(row)" />
            </template>
          </el-table-column>
          <el-table-column label="" width="120" align="center">
            <template #default="{ row }">
              <div class="flex items-center justify-center gap-3">
                <button class="btn-secondary py-1 px-3 text-xs" @click="openEdit(row)">Sửa</button>
                <button class="text-red-400 hover:text-red-500 text-sm" title="Xoá" @click="deleteProduct(row)">🗑</button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- ===== ADD/EDIT PRODUCT DIALOG ===== -->
      <AdminProductModal
        v-model:visible="showProductDialog"
        :editing-product="editingProduct"
        @save="handleSaveProduct"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import AdminProductModal from './AdminProductModal.vue'

const route = useRoute()
const isCustomer = computed(() => route.path.startsWith('/shop'))

const viewMode = ref('grid'), search = ref(''), activeCategory = ref('Tất cả'), sortBy = ref('popular')
const showProductDialog = ref(false), editingProduct = ref(null)
const defaultProductImage = '/cake-placeholder.svg'

const inlineEditId = ref(null)
const inlineEditValue = ref('')

const categories = ['Tất cả', 'Bánh sinh nhật', 'Bánh cưới', 'Cupcake', 'Mousse', 'Macaron']

const products = ref([
  { id:1, name:'Bánh sinh nhật 3D Custom', category:'Bánh sinh nhật', price:'2,500,000đ', originalPrice:null,           soldCount:128, rating:4.9, isBestseller:true,  active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=800&q=80' },
  { id:2, name:'Bánh cưới 5 tầng',         category:'Bánh cưới',     price:'5,000,000đ', originalPrice:null,           soldCount:18,  rating:5.0, isBestseller:false, active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80' },
  { id:3, name:'Cupcake set 12 mix',        category:'Cupcake',       price:'350,000đ',   originalPrice:'420,000đ',     soldCount:96,  rating:4.8, isBestseller:true,  active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1520186994236-a332a9a6da5b?auto=format&fit=crop&w=800&q=80' },
  { id:4, name:'Bánh mousse chanh leo',     category:'Mousse',        price:'520,000đ',   originalPrice:null,           soldCount:72,  rating:4.7, isBestseller:false, active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?auto=format&fit=crop&w=800&q=80' },
  { id:5, name:'Macaron hộp 24',            category:'Macaron',       price:'480,000đ',   originalPrice:'550,000đ',     soldCount:64,  rating:4.8, isBestseller:false, active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=800&q=80' },
  { id:6, name:'Bánh tiramisu',             category:'Mousse',        price:'380,000đ',   originalPrice:null,           soldCount:55,  rating:4.6, isBestseller:false, active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1601312373015-7f1e4c1b1104?auto=format&fit=crop&w=800&q=80' },
  { id:7, name:'Bánh su kem dâu',           category:'Macaron',       price:'180,000đ',   originalPrice:null,           soldCount:44,  rating:4.5, isBestseller:false, active:false, wished:false, added:false, image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' },
  { id:8, name:'Cupcake cầu vồng',          category:'Cupcake',       price:'280,000đ',   originalPrice:null,           soldCount:38,  rating:4.9, isBestseller:false, active:true,  wished:false, added:false, image:'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80' },
])

const activeProducts = computed(() => products.value.filter(p => p.active).length)
const parsePrice = (str) => parseInt(str.replace(/[^0-9]/g, '')) || 0

const filteredProducts = computed(() => {
  let result = products.value
  if (isCustomer.value) result = result.filter(p => p.active)
  if (activeCategory.value !== 'Tất cả') result = result.filter(p => p.category === activeCategory.value)
  if (search.value) result = result.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
  if (sortBy.value === 'popular') result = [...result].sort((a,b) => b.soldCount - a.soldCount)
  else if (sortBy.value === 'price-desc') result = [...result].sort((a,b) => parsePrice(b.price) - parsePrice(a.price))
  else if (sortBy.value === 'price-asc') result = [...result].sort((a,b) => parsePrice(a.price) - parsePrice(b.price))
  else if (sortBy.value === 'newest') result = [...result].sort((a,b) => b.id - a.id)
  return result
})

function openAdd() { editingProduct.value = null; showProductDialog.value = true }
function openEdit(product) { editingProduct.value = product; showProductDialog.value = true }

function handleSaveProduct(formData) {
  if (editingProduct.value) {
    const idx = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (idx > -1) products.value[idx] = { ...products.value[idx], ...formData }
    ElMessage.success('Đã cập nhật sản phẩm')
  } else {
    products.value.unshift({ ...formData, id: Date.now(), soldCount: 0, rating: 5.0, active: true, wished: false, added: false, image: formData.image || defaultProductImage })
    ElMessage.success('Đã thêm sản phẩm mới 🎉')
  }
  showProductDialog.value = false
}

function toggleActiveGrid(product) { product.active = !product.active; toggleProduct(product) }
function startInlinePrice(row) { inlineEditId.value = row.id; inlineEditValue.value = row.price }
function saveInlinePrice(row) { if (inlineEditValue.value.trim()) { row.price = inlineEditValue.value.trim(); ElMessage.success('Đã cập nhật giá') }; inlineEditId.value = null }
function toggleProduct(row) { ElMessage.success(row.active ? `Đã bật "${row.name}"` : `Đã tạm dừng "${row.name}"`) }
function deleteProduct(product) {
  ElMessageBox.confirm(`Xoá "${product.name}"?`, 'Xác nhận', { type:'warning' })
    .then(() => { products.value = products.value.filter(p => p.id !== product.id); ElMessage.success('Đã xoá sản phẩm') })
    .catch(()=>{})
}
function handleImageError(event) { event.target.src = defaultProductImage }
function addToCart(product) {
  product.added = true
  setTimeout(() => { product.added = false }, 1800)
  ElMessage.success(`Đã thêm "${product.name}" vào giỏ hàng`)
}
function toggleWishlist(product) {
  product.wished = !product.wished
  ElMessage.success(product.wished ? `Đã thêm "${product.name}" vào yêu thích` : `Đã bỏ "${product.name}" khỏi yêu thích`)
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>