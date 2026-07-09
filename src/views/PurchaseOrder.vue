<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">
          Đặt Hàng Nhập Kho
        </h1>
        <p class="text-sm text-muted mt-0.5">
          Tạo phiếu đặt hàng từ nhà cung cấp để bổ sung hàng tồn kho
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" @click="fetchProducts" :disabled="loading">
          <iconify-icon
            :icon="loading ? 'ph:spinner-gap' : 'ph:arrows-clockwise-duotone'"
            :class="loading ? 'animate-spin' : ''"
            class="text-base mr-1"
          />
          Làm mới
        </button>
        <button class="btn-primary" @click="createPurchaseOrder" :disabled="cart.length === 0 || submitting">
          <iconify-icon icon="ph:paper-plane-tilt-duotone" class="mr-1 text-base" />
          Tạo phiếu nhập ({{ cart.length }})
        </button>
      </div>
    </div>
     
    <!-- 2 Cột Lkjnkayout -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- CỘT TRÁI: Danh sách sản phẩm -->
      <div class="xl:col-span-2 space-y-4">

        <!-- Filter -->
        <div class="data-card">
          <div class="p-4 flex flex-wrap gap-3 items-center">
            <div class="search-input flex-1" style="min-width:220px">
              <el-icon style="color:#B0A8A3"><Search /></el-icon>
              <input v-model="search" type="text" placeholder="Tìm sản phẩm cần nhập..." />
            </div>
            <el-select v-model="filterCategory" placeholder="Tất cả danh mục" clearable style="width:180px">
              <el-option label="Tất cả" value="" />
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.tenDanhMuc" :value="cat.id" />
            </el-select>
            <el-select v-model="filterStock" placeholder="Ưu tiên" clearable style="width:160px">
              <el-option label="Tất cả" value="" />
              <el-option label="Sắp hết (< 10)" value="low" />
              <el-option label="Hết hàng" value="out" />
            </el-select>
          </div>
        </div>

        <!-- Product List -->
        <div class="data-card" v-loading="loading" element-loading-text="Đang tải sản phẩm...">
          <div v-if="!loading && filteredProducts.length === 0" class="py-12 text-center text-muted">
            <iconify-icon icon="ph:magnifying-glass-duotone" class="text-5xl mb-3" />
            <p class="font-semibold">Không tìm thấy sản phẩm</p>
          </div>

          <div class="divide-y divide-[var(--color-border)]">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="flex items-center gap-3 p-4 hover:bg-[#FFFBF5] transition-colors"
            >
              <!-- Ảnh -->
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-[#FFF0EC] flex items-center justify-center shrink-0">
                <img v-if="product.anhSanPham" :src="product.anhSanPham"
                  class="w-full h-full object-cover" @error="handleImgError($event)" />
                <iconify-icon v-else icon="ph:cake-duotone" class="text-2xl text-[#E8634A]" />
              </div>

              <!-- Thông tin -->
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm" style="color:#5C4428">{{ product.tenSanPham }}</div>
                <div class="text-xs text-muted">{{ product.tenDanhMuc || 'Chưa phân loại' }}</div>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-xs font-bold" style="color:#7A5C3A">{{ formatVND(product.donGia) }}</span>
                  <span class="text-xs"
                    :class="product.soLuongTon === 0 ? 'text-red-500 font-bold' : product.soLuongTon < 10 ? 'text-amber-500 font-semibold' : 'text-green-600'">
                    Tồn: {{ product.soLuongTon }}
                  </span>
                  <span v-if="product.soLuongTon === 0"
                    class="badge" style="background:#FEE2E2;color:#DC2626;font-size:10px;padding:1px 6px">Hết hàng</span>
                  <span v-else-if="product.soLuongTon < 10"
                    class="badge" style="background:#FEF9C3;color:#CA8A04;font-size:10px;padding:1px 6px">Sắp hết</span>
                </div>
              </div>

              <!-- Số lượng input + nút thêm -->
              <div class="flex items-center gap-2 shrink-0">
                <el-input-number
                  v-model="qtyMap[product.id]"
                  :min="1" :max="9999"
                  size="small"
                  style="width:100px"
                  controls-position="right"
                />
                <button
                  class="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0"
                  :class="isInCart(product.id)
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-[#FDF6EC] text-[#7A5C3A] hover:bg-[#7A5C3A] hover:text-white'"
                  @click="toggleCart(product)"
                  :title="isInCart(product.id) ? 'Đã thêm vào phiếu' : 'Thêm vào phiếu nhập'"
                >
                  <iconify-icon
                    :icon="isInCart(product.id) ? 'ph:check-bold' : 'ph:plus-bold'"
                    class="text-lg"
                  />
                </button>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 border-t border-[var(--color-border)]">
            <span class="text-sm text-muted">{{ filteredProducts.length }} / {{ products.length }} sản phẩm</span>
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: Phiếu nhập hàng -->
      <div class="space-y-4">
        <!-- Phiếu nhập -->
        <div class="data-card sticky top-20">
          <div class="p-4 border-b border-[var(--color-border)]">
            <h2 class="font-bold text-[#5C4428] flex items-center gap-2">
              <iconify-icon icon="ph:clipboard-text-duotone" class="text-xl text-[#7A5C3A]" />
              Phiếu Nhập Hàng
            </h2>
            <p class="text-xs text-muted mt-1">{{ cart.length }} mặt hàng được chọn</p>
          </div>

          <!-- Nhà cung cấp -->
          <div class="p-4 border-b border-[var(--color-border)]">
            <label class="text-xs font-semibold text-[#7A5C3A] mb-1.5 block uppercase tracking-wider">
              Nhà cung cấp
            </label>
            <el-input
              v-model="orderForm.nhaCungCap"
              placeholder="Tên nhà cung cấp..."
              size="small"
            />
            <label class="text-xs font-semibold text-[#7A5C3A] mb-1.5 mt-3 block uppercase tracking-wider">
              Ghi chú
            </label>
            <el-input
              v-model="orderForm.ghiChu"
              type="textarea"
              :rows="2"
              placeholder="Ghi chú thêm về đơn nhập..."
              size="small"
            />
          </div>

          <!-- Danh sách sản phẩm trong phiếu -->
          <div class="p-4">
            <div v-if="cart.length === 0" class="py-8 text-center text-muted">
              <iconify-icon icon="ph:clipboard-duotone" class="text-4xl mb-2 opacity-40" />
              <p class="text-sm">Chưa có sản phẩm nào</p>
              <p class="text-xs mt-1">Chọn sản phẩm từ danh sách bên trái</p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="item in cart"
                :key="item.id"
                class="flex items-center gap-2 p-2.5 bg-[#FFFBF5] rounded-xl border border-[#EDE0CC]"
              >
                <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#FFF0EC] flex items-center justify-center shrink-0">
                  <img v-if="item.anhSanPham" :src="item.anhSanPham"
                    class="w-full h-full object-cover" @error="handleImgError($event)" />
                  <iconify-icon v-else icon="ph:cake-duotone" class="text-lg text-[#E8634A]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold truncate" style="color:#5C4428">{{ item.tenSanPham }}</div>
                  <div class="text-[11px] text-muted">+{{ item.soLuongNhap }} cái</div>
                </div>
                <button
                  class="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                  @click="removeFromCart(item.id)"
                >
                  <iconify-icon icon="ph:x-bold" class="text-sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tổng cộng -->
          <div v-if="cart.length > 0" class="px-4 pb-4 border-t border-[var(--color-border)] pt-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-muted">Tổng mặt hàng:</span>
              <span class="font-bold" style="color:#5C4428">{{ cart.length }}</span>
            </div>
            <div class="flex justify-between text-sm mb-4">
              <span class="text-muted">Tổng số lượng:</span>
              <span class="font-bold" style="color:#5C4428">{{ totalQty }} cái</span>
            </div>

            <button
              class="btn-primary w-full justify-center"
              @click="createPurchaseOrder"
              :disabled="submitting"
            >
              <iconify-icon
                :icon="submitting ? 'ph:spinner-gap' : 'ph:paper-plane-tilt-duotone'"
                :class="submitting ? 'animate-spin' : ''"
                class="mr-2"
              />
              {{ submitting ? 'Đang xử lý...' : 'Xác nhận nhập hàng' }}
            </button>

            <button class="btn-secondary w-full justify-center mt-2" @click="clearCart">
              <iconify-icon icon="ph:trash-duotone" class="mr-1" />
              Xóa phiếu
            </button>
          </div>
        </div>

        <!-- Lịch sử nhập ca này -->
        <div v-if="importHistory.length > 0" class="data-card">
          <div class="p-4 border-b border-[var(--color-border)]">
            <h3 class="font-bold text-[#5C4428] text-sm flex items-center gap-2">
              <iconify-icon icon="ph:clock-countdown-duotone" class="text-base text-[#7A5C3A]" />
              Đã nhập trong phiên này
            </h3>
          </div>
          <div class="p-3 space-y-2">
            <div
              v-for="record in importHistory"
              :key="record.key"
              class="flex items-center justify-between text-xs p-2 bg-green-50 rounded-lg border border-green-100"
            >
              <span class="text-green-700 font-medium truncate max-w-[140px]">{{ record.tenSanPham }}</span>
              <span class="text-green-600 font-bold shrink-0 ml-2">+{{ record.soLuong }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog xác nhận -->
    <el-dialog v-model="showConfirmDialog" title="Xác nhận nhập hàng" width="480px">
      <div class="space-y-3">
        <div v-if="orderForm.nhaCungCap" class="flex items-center gap-2 text-sm">
          <iconify-icon icon="ph:factory-duotone" class="text-lg text-[#7A5C3A]" />
          <span class="text-muted">Nhà cung cấp:</span>
          <strong style="color:#5C4428">{{ orderForm.nhaCungCap }}</strong>
        </div>
        <div class="bg-[#FFFBF5] rounded-xl border border-[#EDE0CC] divide-y divide-[#EDE0CC]">
          <div v-for="item in cart" :key="item.id"
            class="flex items-center justify-between px-4 py-2.5 text-sm">
            <span class="text-[#5C4428] font-medium">{{ item.tenSanPham }}</span>
            <span class="font-bold text-[#7A5C3A]">+{{ item.soLuongNhap }} cái</span>
          </div>
        </div>
        <div v-if="orderForm.ghiChu" class="text-xs text-muted p-3 bg-gray-50 rounded-xl">
          <strong>Ghi chú:</strong> {{ orderForm.ghiChu }}
        </div>
      </div>
      <template #footer>
        <el-button @click="showConfirmDialog = false">Huỷ</el-button>
        <el-button type="primary" :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          :loading="submitting" @click="doImport">
          Xác nhận nhập kho
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import apiClient from '@/services/apiService'

// ── STATE ──────────────────────────────────────────────────────────
const products   = ref([])
const categories = ref([])
const loading    = ref(false)
const submitting = ref(false)

const search         = ref('')
const filterCategory = ref('')
const filterStock    = ref('')

// map id -> số lượng nhập
const qtyMap = reactive({})

// giỏ phiếu nhập
const cart = ref([])

const orderForm = ref({ nhaCungCap: '', ghiChu: '' })

const showConfirmDialog = ref(false)

// lịch sử nhập trong phiên
const importHistory = ref([])

// ── COMPUTED ───────────────────────────────────────────────────────
const filteredProducts = computed(() => {
  let list = products.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.tenSanPham.toLowerCase().includes(q))
  }
  if (filterCategory.value) {
    list = list.filter(p => p.danhMucId === filterCategory.value)
  }
  if (filterStock.value === 'low') list = list.filter(p => p.soLuongTon > 0 && p.soLuongTon < 10)
  if (filterStock.value === 'out') list = list.filter(p => p.soLuongTon === 0)
  return list
})

const totalQty = computed(() => cart.value.reduce((s, i) => s + i.soLuongNhap, 0))

// ── FETCH ──────────────────────────────────────────────────────────
async function fetchProducts() {
  loading.value = true
  try {
    const [prodRes, catRes] = await Promise.all([
      apiClient.get('/api/v1/admin/products'),
      apiClient.get('/api/v1/admin/categories')
    ])
    products.value   = prodRes.data || []
    categories.value = catRes.data  || []
    // init qtyMap
    products.value.forEach(p => {
      if (!qtyMap[p.id]) qtyMap[p.id] = 10
    })
  } catch {
    ElMessage.error('Không thể tải danh sách sản phẩm!')
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

// ── CART ───────────────────────────────────────────────────────────
function isInCart(id) {
  return cart.value.some(i => i.id === id)
}

function toggleCart(product) {
  if (isInCart(product.id)) {
    removeFromCart(product.id)
  } else {
    cart.value.push({
      ...product,
      soLuongNhap: qtyMap[product.id] || 10
    })
  }
}

function removeFromCart(id) {
  cart.value = cart.value.filter(i => i.id !== id)
}

function clearCart() {
  cart.value = []
  orderForm.value = { nhaCungCap: '', ghiChu: '' }
}

// ── SUBMIT ─────────────────────────────────────────────────────────
function createPurchaseOrder() {
  if (cart.value.length === 0) {
    ElMessage.warning('Vui lòng chọn ít nhất 1 sản phẩm!')
    return
  }
  showConfirmDialog.value = true
}

async function doImport() {
  submitting.value = true
  let successCount = 0
  try {
    for (const item of cart.value) {
      try {
        await apiClient.patch(`/api/v1/admin/products/${item.id}/dieu-chinh-ton-kho`, {
          soLuongThayDoi: item.soLuongNhap
        })
        // Cập nhật số lượng local
        const prod = products.value.find(p => p.id === item.id)
        if (prod) prod.soLuongTon += item.soLuongNhap

        // Lưu vào lịch sử
        importHistory.value.unshift({
          key: Date.now() + item.id,
          tenSanPham: item.tenSanPham,
          soLuong: item.soLuongNhap
        })
        successCount++
      } catch {
        // Tiếp tục
      }
    }

    if (successCount === cart.value.length) {
      ElMessage.success(`Đã nhập kho thành công ${successCount} mặt hàng!`)
    } else {
      ElMessage.warning(`Nhập kho ${successCount}/${cart.value.length} mặt hàng. Có lỗi xảy ra với một số sản phẩm.`)
    }

    clearCart()
    showConfirmDialog.value = false
  } finally {
    submitting.value = false
  }
}

// ── FORMAT ─────────────────────────────────────────────────────────
function formatVND(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}
function handleImgError(e) { e.target.style.display = 'none' }
</script>
