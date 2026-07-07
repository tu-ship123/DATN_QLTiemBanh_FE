<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">
          Cảnh Báo Tồn Kho
        </h1>
        <p class="text-sm text-muted mt-0.5">
          Danh sách sản phẩm cần nhập hàng gấp
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" @click="fetchData" :disabled="loading">
          <iconify-icon
            :icon="loading ? 'ph:spinner-gap' : 'ph:arrows-clockwise-duotone'"
            :class="loading ? 'animate-spin' : ''"
            class="text-base mr-1"
          />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <iconify-icon icon="ph:warning-circle-duotone" class="text-2xl text-red-500" />
        </div>
        <div>
          <div class="text-2xl font-black text-red-500">{{ outOfStock.length }}</div>
          <div class="text-xs text-muted mt-0.5">Hết hàng</div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <iconify-icon icon="ph:warning-duotone" class="text-2xl text-amber-500" />
        </div>
        <div>
          <div class="text-2xl font-black text-amber-500">{{ lowStock.length }}</div>
          <div class="text-xs text-muted mt-0.5">Sắp hết</div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#FDF6EC] flex items-center justify-center">
          <iconify-icon icon="ph:package-duotone" class="text-2xl text-[#7A5C3A]" />
        </div>
        <div>
          <div class="text-2xl font-black" style="color:#5C4428">{{ products.length }}</div>
          <div class="text-xs text-muted mt-0.5">Tổng cần xử lý</div>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <iconify-icon icon="ph:check-circle-duotone" class="text-2xl text-blue-500" />
        </div>
        <div>
          <div class="text-2xl font-black text-blue-500">{{ resolvedCount }}</div>
          <div class="text-xs text-muted mt-0.5">Đã nhập ca này</div>
        </div>
      </div>
    </div>

    <!-- Alert Banner -->
    <div v-if="outOfStock.length > 0"
      class="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
        <iconify-icon icon="ph:siren-duotone" class="text-xl text-red-600" />
      </div>
      <div>
        <p class="font-bold text-red-700 text-sm">Khẩn cấp! {{ outOfStock.length }} sản phẩm đã hết hàng</p>
        <p class="text-xs text-red-500 mt-0.5">Cần nhập hàng ngay để tránh ảnh hưởng đến đơn hàng mới</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="data-card mb-4">
      <div class="p-4 flex flex-wrap gap-3 items-center">
        <div class="search-input flex-1" style="min-width:220px">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm tên sản phẩm..." />
        </div>
        <el-select v-model="filterLevel" placeholder="Mức cảnh báo" clearable style="width:180px">
          <el-option label="Tất cả" value="" />
          <el-option label="🔴 Hết hàng (= 0)" value="out" />
          <el-option label="🟠 Nguy hiểm (1–5)" value="critical" />
          <el-option label="🟡 Thấp (6–10)" value="low" />
        </el-select>
      </div>
    </div>

    <!-- Table -->
    <div class="data-card" v-loading="loading" element-loading-text="Đang tải...">
      <div v-if="!loading && filtered.length === 0" class="py-16 text-center text-muted">
        <iconify-icon icon="ph:check-circle-duotone" class="text-5xl text-green-400 mb-3" />
        <p class="font-semibold text-green-600">Không có sản phẩm cần cảnh báo!</p>
        <p class="text-sm mt-1">Tồn kho đang ở mức an toàn</p>
      </div>

      <el-table v-else :data="filtered" style="width:100%">
        <!-- Sản phẩm -->
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

        <!-- Tồn kho -->
        <el-table-column label="TỒN KHO" width="140" align="center">
          <template #default="{ row }">
            <div class="flex flex-col items-center gap-1">
              <span class="font-black text-lg"
                :class="row.soLuongTon === 0 ? 'text-red-500' : row.soLuongTon <= 5 ? 'text-orange-500' : 'text-amber-500'">
                {{ row.soLuongTon }}
              </span>
              <div class="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full rounded-full transition-all"
                  :class="row.soLuongTon === 0 ? 'bg-red-400' : row.soLuongTon <= 5 ? 'bg-orange-400' : 'bg-amber-400'"
                  :style="{ width: Math.min(100, (row.soLuongTon / (row.nguongCanhBao || 10)) * 100) + '%' }" />
              </div>
              <span class="text-[10px] text-muted">Ngưỡng: {{ row.nguongCanhBao || 10 }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- Mức độ -->
        <el-table-column label="MỨC ĐỘ" width="130" align="center">
          <template #default="{ row }">
            <span v-if="row.soLuongTon === 0"
              class="badge" style="background:#FEE2E2;color:#DC2626">🔴 Hết hàng</span>
            <span v-else-if="row.soLuongTon <= 5"
              class="badge" style="background:#FFEDD5;color:#EA580C">🟠 Nguy hiểm</span>
            <span v-else
              class="badge" style="background:#FEF9C3;color:#CA8A04">🟡 Sắp hết</span>
          </template>
        </el-table-column>

        <!-- Đơn giá -->
        <el-table-column label="ĐƠN GIÁ" width="130" align="right">
          <template #default="{ row }">
            <span class="font-semibold text-sm" style="color:#5C4428">{{ formatVND(row.donGia) }}</span>
          </template>
        </el-table-column>

        <!-- Thao tác -->
        <el-table-column label="NHẬP HÀNG NHANH" width="220" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-input-number
                v-model="quickInputMap[row.id]"
                :min="1" :max="9999"
                size="small"
                style="width:100px"
                controls-position="right"
              />
              <button
                class="btn-primary text-xs px-3 py-1.5"
                @click="quickImport(row)"
                :disabled="submittingId === row.id"
              >
                <iconify-icon
                  :icon="submittingId === row.id ? 'ph:spinner-gap' : 'ph:plus-bold'"
                  :class="submittingId === row.id ? 'animate-spin' : ''"
                  class="text-sm"
                />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="filtered.length > 0" class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <span class="text-sm text-muted">Hiển thị {{ filtered.length }} / {{ products.length }} sản phẩm cần xử lý</span>
        <button class="btn-secondary text-xs" @click="openBatchDialog">
          <iconify-icon icon="ph:stack-duotone" class="mr-1" />
          Nhập hàng hàng loạt
        </button>
      </div>
    </div>

    <!-- Dialog: Nhập hàng hàng loạt -->
    <el-dialog v-model="showBatchDialog" title="Nhập hàng hàng loạt" width="600px" @closed="batchForm = []">
      <p class="text-sm text-muted mb-4">Nhập số lượng cần thêm cho từng sản phẩm (để trống = bỏ qua)</p>
      <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        <div v-for="item in batchForm" :key="item.id"
          class="flex items-center gap-3 p-3 bg-[#FFFBF5] rounded-xl border border-[#EDE0CC]">
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#FFF0EC] flex items-center justify-center shrink-0">
            <img v-if="item.anhSanPham" :src="item.anhSanPham" class="w-full h-full object-cover" @error="handleImgError($event)" />
            <iconify-icon v-else icon="ph:cake-duotone" class="text-lg text-[#E8634A]" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold truncate" style="color:#5C4428">{{ item.tenSanPham }}</div>
            <div class="text-xs text-muted">Hiện còn: <strong :class="item.soLuongTon === 0 ? 'text-red-500' : 'text-amber-500'">{{ item.soLuongTon }}</strong> cái</div>
          </div>
          <el-input-number
            v-model="item.nhapThem"
            :min="0" :max="9999"
            size="small"
            style="width:110px"
            controls-position="right"
            placeholder="Số lượng"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="showBatchDialog = false">Huỷ</el-button>
        <el-button type="primary" :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          :loading="batchSubmitting" @click="submitBatch">
          Xác nhận nhập hàng
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
const products     = ref([])
const loading      = ref(false)
const submittingId = ref(null)
const resolvedCount = ref(0)

const search      = ref('')
const filterLevel = ref('')

const showBatchDialog = ref(false)
const batchForm       = ref([])
const batchSubmitting = ref(false)

// quickInputMap: { [productId]: quantity }
const quickInputMap = reactive({})

// ── COMPUTED ───────────────────────────────────────────────────────
const outOfStock = computed(() => products.value.filter(p => p.soLuongTon === 0))
const lowStock   = computed(() => products.value.filter(p => p.soLuongTon > 0))

const filtered = computed(() => {
  let list = products.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.tenSanPham.toLowerCase().includes(q))
  }
  if (filterLevel.value === 'out')      list = list.filter(p => p.soLuongTon === 0)
  if (filterLevel.value === 'critical') list = list.filter(p => p.soLuongTon > 0 && p.soLuongTon <= 5)
  if (filterLevel.value === 'low')      list = list.filter(p => p.soLuongTon > 5)
  return list
})

// ── FETCH ──────────────────────────────────────────────────────────
async function fetchData() {
  loading.value = true
  try {
    const res = await apiClient.get('/api/v1/admin/products/canh-bao-ton-thap')
    products.value = res.data || []
    // Khởi tạo quickInputMap
    products.value.forEach(p => {
      if (!quickInputMap[p.id]) quickInputMap[p.id] = 10
    })
  } catch {
    ElMessage.error('Không thể tải danh sách cảnh báo tồn kho!')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

// ── NHẬP HÀNG NHANH ───────────────────────────────────────────────
async function quickImport(row) {
  const qty = quickInputMap[row.id]
  if (!qty || qty <= 0) {
    ElMessage.warning('Vui lòng nhập số lượng cần nhập')
    return
  }
  submittingId.value = row.id
  try {
    await apiClient.patch(`/api/v1/admin/products/${row.id}/dieu-chinh-ton-kho`, {
      soLuongThayDoi: qty
    })
    row.soLuongTon += qty
    resolvedCount.value++
    quickInputMap[row.id] = 10
    ElMessage.success(`Đã nhập thêm ${qty} cái cho "${row.tenSanPham}"`)
    // Nếu đã đủ hàng, xóa khỏi danh sách
    if (row.soLuongTon > (row.nguongCanhBao || 10)) {
      products.value = products.value.filter(p => p.id !== row.id)
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Nhập hàng thất bại!')
  } finally {
    submittingId.value = null
  }
}

// ── NHẬP HÀNG HÀNG LOẠT ───────────────────────────────────────────
function openBatchDialog() {
  batchForm.value = products.value.map(p => ({
    ...p,
    nhapThem: 10
  }))
  showBatchDialog.value = true
}

async function submitBatch() {
  const toImport = batchForm.value.filter(item => item.nhapThem > 0)
  if (toImport.length === 0) {
    ElMessage.warning('Vui lòng nhập số lượng cho ít nhất 1 sản phẩm')
    return
  }
  batchSubmitting.value = true
  try {
    let successCount = 0
    for (const item of toImport) {
      try {
        await apiClient.patch(`/api/v1/admin/products/${item.id}/dieu-chinh-ton-kho`, {
          soLuongThayDoi: item.nhapThem
        })
        successCount++
        resolvedCount.value++
      } catch {
        // Tiếp tục các sản phẩm khác
      }
    }
    ElMessage.success(`Đã nhập hàng thành công cho ${successCount}/${toImport.length} sản phẩm`)
    showBatchDialog.value = false
    await fetchData()
  } finally {
    batchSubmitting.value = false
  }
}

// ── FORMAT ─────────────────────────────────────────────────────────
function formatVND(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}
function handleImgError(e) { e.target.style.display = 'none' }
</script>
