<template>
  <div>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import AdminProductModal from './AdminProductModal.vue'

const viewMode = ref('grid'), search = ref(''), activeCategory = ref('Tất cả'), sortBy = ref('popular')
const showProductDialog = ref(false), editingProduct = ref(null)
const defaultProductImage = '/cake-placeholder.svg'

// CRUD inline: sửa nhanh giá ngay trong bảng (list view), không cần mở dialog
const inlineEditId = ref(null)
const inlineEditValue = ref('')

const categories = ['Tất cả', 'Bánh sinh nhật', 'Bánh cưới', 'Cupcake', 'Mousse', 'Macaron']

const products = ref([
  { id:1, name:'Bánh sinh nhật 3D Custom', category:'Bánh sinh nhật', price:'2,500,000đ', originalPrice:null,           soldCount:128, rating:4.9, isBestseller:true,  active:true,  image:'https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=800&q=80' },
  { id:2, name:'Bánh cưới 5 tầng',         category:'Bánh cưới',     price:'5,000,000đ', originalPrice:null,           soldCount:18,  rating:5.0, isBestseller:false, active:true,  image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80' },
  { id:3, name:'Cupcake set 12 mix',        category:'Cupcake',       price:'350,000đ',   originalPrice:'420,000đ',     soldCount:96,  rating:4.8, isBestseller:true,  active:true,  image:'https://images.unsplash.com/photo-1520186994236-a332a9a6da5b?auto=format&fit=crop&w=800&q=80' },
  { id:4, name:'Bánh mousse chanh leo',     category:'Mousse',        price:'520,000đ',   originalPrice:null,           soldCount:72,  rating:4.7, isBestseller:false, active:true,  image:'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?auto=format&fit=crop&w=800&q=80' },
  { id:5, name:'Macaron hộp 24',            category:'Macaron',       price:'480,000đ',   originalPrice:'550,000đ',     soldCount:64,  rating:4.8, isBestseller:false, active:true,  image:'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=800&q=80' },
  { id:6, name:'Bánh tiramisu',             category:'Mousse',        price:'380,000đ',   originalPrice:null,           soldCount:55,  rating:4.6, isBestseller:false, active:true,  image:'https://images.unsplash.com/photo-1601312373015-7f1e4c1b1104?auto=format&fit=crop&w=800&q=80' },
  { id:7, name:'Bánh su kem dâu',           category:'Bánh kem',      price:'180,000đ',   originalPrice:null,           soldCount:44,  rating:4.5, isBestseller:false, active:false, image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' },
  { id:8, name:'Cupcake cầu vồng',          category:'Cupcake',       price:'280,000đ',   originalPrice:null,           soldCount:38,  rating:4.9, isBestseller:false, active:true,  image:'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80' },
])

const activeProducts = computed(() => products.value.filter(p => p.active).length)

const filteredProducts = computed(() => {
  let result = products.value
  if (activeCategory.value !== 'Tất cả') result = result.filter(p => p.category === activeCategory.value)
  if (search.value) result = result.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
  if (sortBy.value === 'popular') result = [...result].sort((a,b) => b.soldCount - a.soldCount)
  return result
})

function openAdd() {
  editingProduct.value = null
  showProductDialog.value = true
}

function openEdit(product) {
  editingProduct.value = product
  showProductDialog.value = true
}

function handleSaveProduct(formData) {
  if (editingProduct.value) {
    const idx = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (idx > -1) products.value[idx] = { ...products.value[idx], ...formData }
    ElMessage.success('Đã cập nhật sản phẩm')
  } else {
    products.value.unshift({
      ...formData,
      id: Date.now(),
      soldCount: 0,
      rating: 0,
      image: formData.image || defaultProductImage
    })
    ElMessage.success('Đã thêm sản phẩm mới 🎉')
  }
  showProductDialog.value = false
}

// Toggle active nhanh trên card (grid view) — không cần mở dialog
function toggleActiveGrid(product) {
  product.active = !product.active
  toggleProduct(product)
}

// CRUD inline: bấm vào giá trong list view để sửa nhanh tại chỗ
function startInlinePrice(row) {
  inlineEditId.value = row.id
  inlineEditValue.value = row.price
}
function saveInlinePrice(row) {
  if (inlineEditValue.value.trim()) {
    row.price = inlineEditValue.value.trim()
    ElMessage.success('Đã cập nhật giá')
  }
  inlineEditId.value = null
}

function toggleProduct(row) { ElMessage.success(row.active ? `Đã bật "${row.name}"` : `Đã tạm dừng "${row.name}"`) }

function deleteProduct(product) {
  ElMessageBox.confirm(`Xoá "${product.name}"?`, 'Xác nhận', { type:'warning' })
    .then(() => { products.value = products.value.filter(p => p.id !== product.id); ElMessage.success('Đã xoá sản phẩm') })
    .catch(()=>{})
}

function handleImageError(event) {
  event.target.src = defaultProductImage
}
</script>