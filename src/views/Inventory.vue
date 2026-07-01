<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">Quản Lý Kho Hàng</h1>
        <p class="text-sm text-muted mt-0.5">{{ products.length }} sản phẩm · {{ lowStockCount }} sắp hết hàng</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" @click="fetchProducts" :disabled="loading">
          <iconify-icon :icon="loading ? 'ph:spinner-gap' : 'ph:arrows-clockwise-duotone'"
            :class="loading ? 'animate-spin' : ''" class="text-base mr-1" />
          Làm mới
        </button>
        <button class="btn-primary" @click="openAddDialog">
          <iconify-icon icon="ph:plus-bold" class="mr-1 text-base" />
          Thêm sản phẩm
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#FDF6EC] flex items-center justify-center">
          <iconify-icon icon="ph:package-duotone" class="text-2xl text-[#7A5C3A]" />
        </div>
        <div>
          <div class="text-2xl font-black" style="color:#5C4428">{{ products.length }}</div>
          <div class="text-xs text-muted mt-0.5">Tổng sản phẩm</div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
          <iconify-icon icon="ph:check-circle-duotone" class="text-2xl text-green-600" />
        </div>
        <div>
          <div class="text-2xl font-black text-green-600">{{ activeCount }}</div>
          <div class="text-xs text-muted mt-0.5">Đang bán</div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <iconify-icon icon="ph:warning-duotone" class="text-2xl text-red-500" />
        </div>
        <div>
          <div class="text-2xl font-black text-red-500">{{ lowStockCount }}</div>
          <div class="text-xs text-muted mt-0.5">Sắp hết hàng</div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <iconify-icon icon="ph:eye-slash-duotone" class="text-2xl text-amber-500" />
        </div>
        <div>
          <div class="text-2xl font-black text-amber-500">{{ hiddenCount }}</div>
          <div class="text-xs text-muted mt-0.5">Tạm ẩn</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="data-card mb-4">
      <div class="p-4 flex flex-wrap gap-3 items-center">
        <div class="search-input flex-1" style="min-width:220px">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm tên sản phẩm, danh mục..." />
        </div>
        <el-select v-model="filterStatus" placeholder="Tất cả trạng thái" clearable style="width:180px">
          <el-option label="Tất cả" value="" />
          <el-option label="Đang bán" value="DANG_BAN" />
          <el-option label="Tạm ẩn" value="TAM_AN" />
        </el-select>
        <el-select v-model="filterStock" placeholder="Tình trạng kho" clearable style="width:180px">
          <el-option label="Tất cả" value="" />
          <el-option label="Còn hàng (≥ 10)" value="ok" />
          <el-option label="Sắp hết (< 10)" value="low" />
          <el-option label="Hết hàng (= 0)" value="out" />
        </el-select>
      </div>
    </div>

    <!-- Table -->
    <div class="data-card">
      <el-table
        :data="filteredProducts"
        style="width:100%"
        v-loading="loading"
        element-loading-text="Đang tải dữ liệu..."
      >
        <!-- Ảnh + Tên -->
        <el-table-column label="SẢN PHẨM" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-[#FFF0EC] flex items-center justify-center shrink-0">
                <img v-if="row.anhSanPham" :src="row.anhSanPham" :alt="row.tenSanPham"
                  class="w-full h-full object-cover" @error="handleImgError($event)" />
                <iconify-icon v-else icon="ph:cake-duotone" class="text-2xl text-[#E8634A]" />
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-sm truncate" style="color:#5C4428">{{ row.tenSanPham }}</div>
                <div class="text-xs text-muted">{{ row.tenDanhMuc || 'Chưa phân loại' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Giá -->
        <el-table-column label="ĐƠN GIÁ" width="140" align="right">
          <template #default="{ row }">
            <span class="font-bold text-sm" style="color:#5C4428">{{ formatVND(row.donGia) }}</span>
          </template>
        </el-table-column>

        <!-- Tồn kho -->
        <el-table-column label="TỒN KHO" width="120" align="center">
          <template #default="{ row }">
            <div class="flex flex-col items-center gap-1">
              <span class="font-black text-base"
                :class="row.soLuongTon === 0 ? 'text-red-500' : row.soLuongTon < 10 ? 'text-amber-500' : 'text-[#5C4428]'">
                {{ row.soLuongTon }}
              </span>
              <div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full rounded-full transition-all"
                  :class="row.soLuongTon === 0 ? 'bg-red-400' : row.soLuongTon < 10 ? 'bg-amber-400' : 'bg-green-400'"
                  :style="{ width: Math.min(100, (row.soLuongTon / 50) * 100) + '%' }" />
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- Trạng thái -->
        <el-table-column label="TRẠNG THÁI" width="130" align="center">
          <template #default="{ row }">
            <span class="badge" :class="row.trangThai === 'DANG_BAN' ? 'badge-success' : 'badge-warning'">
              {{ row.trangThai === 'DANG_BAN' ? 'Đang bán' : 'Tạm ẩn' }}
            </span>
          </template>
        </el-table-column>

        <!-- Ngày tạo -->
        <el-table-column label="NGÀY TẠO" width="110" align="center">
          <template #default="{ row }">
            <span class="text-xs text-muted">{{ formatDate(row.ngayTao) }}</span>
          </template>
        </el-table-column>

        <!-- Hành động -->
        <el-table-column label="" width="80" align="center">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="cmd => handleAction(cmd, row)">
              <button class="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
                <el-icon><MoreFilled /></el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu class="w-44 rounded-xl p-1 shadow-xl">
                  <el-dropdown-item command="edit" class="rounded-lg">
                    <iconify-icon icon="ph:pencil-simple-duotone" class="mr-2 text-base" />Chỉnh sửa
                  </el-dropdown-item>
                  <el-dropdown-item command="stock" class="rounded-lg">
                    <iconify-icon icon="ph:arrows-in-duotone" class="mr-2 text-base text-blue-500" />Điều chỉnh kho
                  </el-dropdown-item>
                  <el-dropdown-item command="toggle" class="rounded-lg" divided>
                    <iconify-icon :icon="row.trangThai === 'DANG_BAN' ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'"
                      class="mr-2 text-base text-amber-500" />
                    {{ row.trangThai === 'DANG_BAN' ? 'Tạm ẩn' : 'Hiện lại' }}
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" class="rounded-lg text-red-500 hover:bg-red-50">
                    <iconify-icon icon="ph:trash-duotone" class="mr-2 text-base" />Xoá sản phẩm
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <span class="text-sm text-muted">Hiển thị {{ filteredProducts.length }} / {{ products.length }} sản phẩm</span>
      </div>
    </div>

    <!-- Low Stock Alert -->
    <div v-if="lowStockItems.length > 0" class="mt-5 bg-red-50 rounded-2xl border border-red-200 p-5">
      <div class="flex items-center gap-2 mb-3">
        <iconify-icon icon="ph:warning-circle-duotone" class="text-xl text-red-500" />
        <span class="font-bold text-red-700">Cảnh báo hàng sắp hết ({{ lowStockItems.length }} sản phẩm)</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <div v-for="p in lowStockItems" :key="p.id"
          class="flex items-center justify-between p-3 bg-white rounded-xl border border-red-200">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-[#FFF0EC] flex items-center justify-center overflow-hidden shrink-0">
              <img v-if="p.anhSanPham" :src="p.anhSanPham" class="w-full h-full object-cover" @error="handleImgError($event)" />
              <iconify-icon v-else icon="ph:cake-duotone" class="text-lg text-[#E8634A]" />
            </div>
            <div>
              <div class="text-sm font-semibold truncate max-w-[120px]" style="color:#5C4428">{{ p.tenSanPham }}</div>
              <div class="text-xs text-red-500 font-bold">Còn {{ p.soLuongTon }} cái</div>
            </div>
          </div>
          <button class="btn-primary text-xs px-3 py-1.5" @click="openStockDialog(p)">Nhập hàng</button>
        </div>
      </div>
    </div>

    <!-- ── DIALOG: THÊM / SỬA SẢN PHẨM ─────────────────────── -->
    <el-dialog
      v-model="showProductDialog"
      :title="isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'"
      width="560px"
      @closed="resetForm"
    >
      <el-form :model="productForm" label-position="top" class="space-y-1">
        <el-form-item label="Tên sản phẩm" required>
          <el-input v-model="productForm.tenSanPham" placeholder="VD: Bánh sinh nhật 3 tầng" />
        </el-form-item>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Đơn giá (đ)" required>
            <el-input v-model.number="productForm.donGia" type="number" placeholder="150000">
              <template #suffix>đ</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Số lượng tồn kho" required>
            <el-input v-model.number="productForm.soLuongTon" type="number" placeholder="0" />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Danh mục">
            <el-select v-model="productForm.danhMucId" placeholder="Chọn danh mục" style="width:100%" clearable>
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.tenDanhMuc" :value="cat.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Trạng thái">
            <el-select v-model="productForm.trangThai" style="width:100%">
              <el-option label="Đang bán" value="DANG_BAN" />
              <el-option label="Tạm ẩn" value="TAM_AN" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="URL ảnh sản phẩm">
          <el-input v-model="productForm.anhSanPham" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="Mô tả">
          <el-input v-model="productForm.moTa" type="textarea" :rows="3" placeholder="Mô tả ngắn về sản phẩm..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showProductDialog = false">Huỷ</el-button>
        <el-button type="primary" :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          :loading="submitting" @click="submitProductForm">
          {{ isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- ── DIALOG: ĐIỀU CHỈNH KHO ──────────────────────────── -->
    <el-dialog v-model="showStockDialog" title="Điều chỉnh tồn kho" width="400px" @closed="resetStockForm">
      <div v-if="stockTarget" class="mb-4 flex items-center gap-3 p-3 bg-[#FFFBF5] rounded-xl border border-[#EDE0CC]">
        <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#FFF0EC] flex items-center justify-center shrink-0">
          <img v-if="stockTarget.anhSanPham" :src="stockTarget.anhSanPham" class="w-full h-full object-cover" @error="handleImgError($event)" />
          <iconify-icon v-else icon="ph:cake-duotone" class="text-xl text-[#E8634A]" />
        </div>
        <div>
          <div class="font-semibold text-sm" style="color:#5C4428">{{ stockTarget.tenSanPham }}</div>
          <div class="text-xs text-muted">Tồn kho hiện tại: <strong class="text-[#7A5C3A]">{{ stockTarget.soLuongTon }}</strong> cái</div>
        </div>
      </div>
      <el-form label-position="top">
        <el-form-item label="Loại thao tác">
          <el-radio-group v-model="stockForm.type" class="w-full">
            <el-radio-button value="set" label="Đặt lại số lượng" />
            <el-radio-button value="add" label="Nhập thêm hàng" />
            <el-radio-button value="sub" label="Xuất / trừ hàng" />
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="stockForm.type === 'set' ? 'Số lượng mới' : 'Số lượng'">
          <el-input-number v-model="stockForm.amount" :min="0" style="width:100%" />
        </el-form-item>
        <div v-if="stockTarget" class="text-sm text-muted bg-[#FFFBF5] rounded-xl p-3">
          Sau điều chỉnh:
          <strong class="text-[#7A5C3A] ml-1">
            {{
              stockForm.type === 'set' ? stockForm.amount :
              stockForm.type === 'add' ? stockTarget.soLuongTon + stockForm.amount :
              Math.max(0, stockTarget.soLuongTon - stockForm.amount)
            }} cái
          </strong>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="showStockDialog = false">Huỷ</el-button>
        <el-button type="primary" :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          :loading="submitting" @click="submitStockAdjust">
          Xác nhận
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, MoreFilled } from '@element-plus/icons-vue'
import { productService } from '@/services/ProductService'
import apiClient from '@/services/apiService'

// ── STATE ──────────────────────────────────────────────────────────
const products   = ref([])
const categories = ref([])
const loading    = ref(false)
const submitting = ref(false)
const search     = ref('')
const filterStatus = ref('')
const filterStock  = ref('')

// ── COMPUTED ───────────────────────────────────────────────────────
const activeCount   = computed(() => products.value.filter(p => p.trangThai === 'DANG_BAN').length)
const hiddenCount   = computed(() => products.value.filter(p => p.trangThai === 'TAM_AN').length)
const lowStockCount = computed(() => products.value.filter(p => p.soLuongTon < 10).length)
const lowStockItems = computed(() => products.value.filter(p => p.soLuongTon < 10).slice(0, 6))

const filteredProducts = computed(() => {
  let list = products.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.tenSanPham.toLowerCase().includes(q) ||
      (p.tenDanhMuc || '').toLowerCase().includes(q)
    )
  }
  if (filterStatus.value) {
    list = list.filter(p => p.trangThai === filterStatus.value)
  }
  if (filterStock.value === 'ok')  list = list.filter(p => p.soLuongTon >= 10)
  if (filterStock.value === 'low') list = list.filter(p => p.soLuongTon > 0 && p.soLuongTon < 10)
  if (filterStock.value === 'out') list = list.filter(p => p.soLuongTon === 0)
  return list
})

// ── FETCH ──────────────────────────────────────────────────────────
async function fetchProducts() {
  loading.value = true
  try {
    const [prodRes, catRes] = await Promise.all([
      productService.admin.getAll(),
      apiClient.get('/api/v1/admin/categories')
    ])
    products.value   = prodRes.data || []
    categories.value = catRes.data  || []
  } catch (err) {
    console.error('Lỗi tải dữ liệu:', err)
    ElMessage.error('Không thể tải danh sách sản phẩm!')
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

// ── DIALOG: THÊM / SỬA ────────────────────────────────────────────
const showProductDialog = ref(false)
const isEditing         = ref(false)
const editingId         = ref(null)
const productForm = ref({
  tenSanPham: '', donGia: null, soLuongTon: 0,
  danhMucId: null, trangThai: 'DANG_BAN', anhSanPham: '', moTa: ''
})

function openAddDialog() {
  isEditing.value = false
  editingId.value  = null
  productForm.value = { tenSanPham: '', donGia: null, soLuongTon: 0, danhMucId: null, trangThai: 'DANG_BAN', anhSanPham: '', moTa: '' }
  showProductDialog.value = true
}

function openEditDialog(row) {
  isEditing.value  = true
  editingId.value  = row.id
  productForm.value = {
    tenSanPham:  row.tenSanPham,
    donGia:      row.donGia,
    soLuongTon:  row.soLuongTon,
    danhMucId:   row.danhMucId,
    trangThai:   row.trangThai,
    anhSanPham:  row.anhSanPham || '',
    moTa:        row.moTa || ''
  }
  showProductDialog.value = true
}

function resetForm() {
  productForm.value = { tenSanPham: '', donGia: null, soLuongTon: 0, danhMucId: null, trangThai: 'DANG_BAN', anhSanPham: '', moTa: '' }
}

async function submitProductForm() {
  if (!productForm.value.tenSanPham || productForm.value.donGia == null) {
    return ElMessage.warning('Vui lòng nhập tên sản phẩm và đơn giá!')
  }
  submitting.value = true
  try {
    if (isEditing.value) {
      await productService.admin.update(editingId.value, productForm.value)
      ElMessage.success('Cập nhật sản phẩm thành công!')
    } else {
      await productService.admin.create(productForm.value)
      ElMessage.success('Thêm sản phẩm thành công!')
    }
    showProductDialog.value = false
    await fetchProducts()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || err.response?.data || 'Thao tác thất bại!')
  } finally {
    submitting.value = false
  }
}

// ── TOGGLE TRẠNG THÁI ─────────────────────────────────────────────
async function toggleStatus(row) {
  const newStatus = row.trangThai === 'DANG_BAN' ? 'TAM_AN' : 'DANG_BAN'
  const label = newStatus === 'DANG_BAN' ? 'hiện lại' : 'tạm ẩn'
  try {
    await productService.admin.update(row.id, { ...row, trangThai: newStatus })
    row.trangThai = newStatus
    ElMessage.success(`Đã ${label} sản phẩm "${row.tenSanPham}"!`)
  } catch (err) {
    ElMessage.error('Thay đổi trạng thái thất bại!')
  }
}

// ── XOÁ ───────────────────────────────────────────────────────────
async function confirmDelete(row) {
  try {
    await ElMessageBox.confirm(
      `Xoá sản phẩm <b>${row.tenSanPham}</b>? Thao tác này không thể hoàn tác!`,
      'Xác nhận xoá',
      { confirmButtonText: 'Xoá', cancelButtonText: 'Huỷ', type: 'warning', dangerouslyUseHTMLString: true }
    )
    await productService.admin.delete(row.id)
    ElMessage.success('Đã xoá sản phẩm!')
    await fetchProducts()
  } catch {
    // User nhấn Huỷ
  }
}

// ── DIALOG: ĐIỀU CHỈNH KHO ────────────────────────────────────────
const showStockDialog = ref(false)
const stockTarget = ref(null)
const stockForm   = ref({ type: 'add', amount: 0 })

function openStockDialog(row) {
  stockTarget.value = row
  stockForm.value   = { type: 'add', amount: 0 }
  showStockDialog.value = true
}

function resetStockForm() {
  stockTarget.value = null
  stockForm.value   = { type: 'add', amount: 0 }
}

async function submitStockAdjust() {
  if (!stockTarget.value) return
  const { type, amount } = stockForm.value
  let newQty
  if (type === 'set') newQty = amount
  else if (type === 'add') newQty = stockTarget.value.soLuongTon + amount
  else newQty = Math.max(0, stockTarget.value.soLuongTon - amount)

  submitting.value = true
  try {
    await productService.admin.update(stockTarget.value.id, {
      ...stockTarget.value,
      soLuongTon: newQty
    })
    stockTarget.value.soLuongTon = newQty
    // Cập nhật luôn trong mảng products
    const idx = products.value.findIndex(p => p.id === stockTarget.value.id)
    if (idx !== -1) products.value[idx].soLuongTon = newQty
    ElMessage.success(`Đã điều chỉnh kho "${stockTarget.value.tenSanPham}" → ${newQty} cái`)
    showStockDialog.value = false
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Điều chỉnh kho thất bại!')
  } finally {
    submitting.value = false
  }
}

// ── ACTIONS ───────────────────────────────────────────────────────
function handleAction(cmd, row) {
  if (cmd === 'edit')   openEditDialog(row)
  if (cmd === 'stock')  openStockDialog(row)
  if (cmd === 'toggle') toggleStatus(row)
  if (cmd === 'delete') confirmDelete(row)
}

// ── FORMAT ────────────────────────────────────────────────────────
function formatVND(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}
function formatDate(dt) {
  if (!dt) return '—'
  const d = new Date(dt)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
function handleImgError(e) { e.target.style.display = 'none' }
</script>
