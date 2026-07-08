<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display font-black text-2xl text-[#5C4428]">Kiểm Kê Cuối Ca</h1>
        <p class="text-sm text-gray-400 mt-0.5">Nhập số lượng thực tế để so sánh với tồn kho hệ thống</p>
      </div>
      <button class="btn-secondary" @click="fetchProducts" :disabled="loading">
        <iconify-icon :icon="loading ? 'ph:spinner-gap' : 'ph:arrows-clockwise-duotone'"
          :class="loading ? 'animate-spin' : ''" class="text-base mr-1" />
        Làm mới
      </button>
    </div>

    <!-- Tổng quan chênh lệch -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5" v-if="daNhap.length > 0">
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Đã kiểm kê</div>
        <div class="text-2xl font-black text-[#5C4428]">{{ daNhap.length }} sản phẩm</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Thiếu hàng (chênh lệch âm)</div>
        <div class="text-2xl font-black text-red-500">{{ soSanPhamThieu }} sản phẩm</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Giá trị thiếu hụt ước tính</div>
        <div class="text-2xl font-black text-red-500">{{ formatVND(giaTriThieuHut) }}</div>
      </div>
    </div>

    <!-- Bảng kiểm kê -->
    <div class="data-card mb-5">
      <div class="p-4 border-b border-[#EDE0CC]">
        <div class="search-input" style="max-width:320px">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm sản phẩm..." />
        </div>
      </div>

      <el-table :data="filteredProducts" style="width:100%" v-loading="loading" max-height="560">
        <el-table-column label="SẢN PHẨM" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-[#FFF0EC] flex items-center justify-center shrink-0">
                <img v-if="row.anhSanPham" :src="row.anhSanPham" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
                <iconify-icon v-else icon="ph:cake-duotone" class="text-xl text-[#E8634A]" />
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-sm truncate" style="color:#5C4428">{{ row.tenSanPham }}</div>
                <div class="text-xs text-muted">{{ row.tenDanhMuc || 'Chưa phân loại' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="TỒN HỆ THỐNG" width="130" align="center">
          <template #default="{ row }">
            <span class="font-bold text-sm text-[#5C4428]">{{ row.soLuongTon }}</span>
          </template>
        </el-table-column>

        <el-table-column label="SỐ LƯỢNG THỰC TẾ" width="170" align="center">
          <template #default="{ row }">
            <el-input-number
              v-model="soLuongThucTe[row.id]"
              :min="0" :max="99999" size="small" controls-position="right"
              style="width:130px"
              @change="v => onNhapSoLuong(row, v)"
            />
          </template>
        </el-table-column>

        <el-table-column label="CHÊNH LỆCH" width="150" align="center">
          <template #default="{ row }">
            <span v-if="soLuongThucTe[row.id] === null || soLuongThucTe[row.id] === undefined"
              class="text-xs text-gray-300">Chưa nhập</span>
            <span v-else class="font-black text-sm"
              :class="chenhLech(row) === 0 ? 'text-gray-400' : chenhLech(row) < 0 ? 'text-red-500' : 'text-green-600'">
              {{ chenhLech(row) > 0 ? '+' : '' }}{{ chenhLech(row) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Hành động -->
    <div class="flex flex-wrap gap-3 mb-8">
      <button
        class="btn-primary"
        :disabled="daNhap.length === 0 || submitting"
        @click="guiBaoCaoKiemKe">
        <iconify-icon :icon="submitting ? 'ph:spinner-gap' : 'ph:clipboard-text-duotone'"
          :class="submitting ? 'animate-spin' : ''" class="text-base mr-1" />
        Gửi báo cáo kiểm kê
      </button>

      <button
        v-if="soSanPhamThieu > 0"
        class="px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-red-300 text-red-500 hover:bg-red-50 transition-all flex items-center gap-1.5"
        @click="moFormHoanTien">
        <iconify-icon icon="ph:currency-circle-dollar-duotone" class="text-base" />
        Tạo yêu cầu hoàn tiền
      </button>
    </div>

    <!-- Lịch sử yêu cầu hoàn tiền của tôi -->
    <div class="data-card">
      <div class="p-4 border-b border-[#EDE0CC] flex items-center justify-between">
        <div class="font-display font-bold text-base text-[#5C4428]">Yêu cầu hoàn tiền đã gửi</div>
        <button class="text-xs font-bold text-[#7A5C3A] hover:underline" @click="fetchYeuCauHoanTien">
          Tải lại
        </button>
      </div>
      <div v-if="loadingYeuCau" class="py-10 text-center text-sm text-gray-400">Đang tải...</div>
      <div v-else-if="danhSachYeuCau.length === 0" class="py-10 text-center text-sm text-gray-400">
        Bạn chưa gửi yêu cầu hoàn tiền nào.
      </div>
      <div v-else class="divide-y divide-[#EDE0CC]">
        <div v-for="yc in danhSachYeuCau" :key="yc.id" class="p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div class="text-sm font-bold text-[#5C4428]">{{ formatVND(yc.soTien) }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ yc.lyDo }}</div>
            <div class="text-[11px] text-gray-300 mt-0.5">{{ formatDateTime(yc.ngayTao) }}</div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold"
            :class="trangThaiYeuCau(yc.trangThai).cls">
            {{ trangThaiYeuCau(yc.trangThai).label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Dialog tạo yêu cầu hoàn tiền -->
    <el-dialog v-model="showHoanTienDialog" title="Tạo yêu cầu hoàn tiền" width="480px">
      <p class="text-sm text-gray-500 mb-4">
        Dựa trên kết quả kiểm kê, hệ thống phát hiện <strong class="text-red-500">{{ soSanPhamThieu }} sản phẩm</strong>
        bị thiếu hụt so với tồn kho, ước tính giá trị <strong class="text-red-500">{{ formatVND(giaTriThieuHut) }}</strong>.
      </p>
      <el-form label-position="top">
        <el-form-item label="Số tiền yêu cầu hoàn">
          <el-input-number v-model="hoanTienForm.soTien" :min="0" :step="1000" style="width:100%" />
        </el-form-item>
        <el-form-item label="Lý do" required>
          <el-input v-model="hoanTienForm.lyDo" type="textarea" :rows="3"
            placeholder="VD: Kiểm kê cuối ca phát hiện thiếu 3 bánh kem dâu do hư hỏng..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showHoanTienDialog = false">Huỷ</el-button>
        <el-button type="primary" :loading="guiHoanTienLoading"
          style="background:#7A5C3A;border-color:#7A5C3A"
          @click="guiYeuCauHoanTien">
          Gửi yêu cầu cho Admin duyệt
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { productService } from '@/services/productService'
import apiClient from '@/services/apiService'

// ── DANH SÁCH SẢN PHẨM + TỒN HỆ THỐNG ─────────────────────────────
const products = ref([])
const loading = ref(false)
const search = ref('')

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(p => p.tenSanPham.toLowerCase().includes(q))
})

async function fetchProducts() {
  loading.value = true
  try {
    const { data } = await productService.admin.getAll()
    products.value = data || []
  } catch (err) {
    ElMessage.error('Không thể tải danh sách sản phẩm!')
  } finally {
    loading.value = false
  }
}

// ── NHẬP SỐ LƯỢNG THỰC TẾ ──────────────────────────────────────────
// key = sanPhamId, value = số lượng nhân viên đếm được
const soLuongThucTe = ref({})

function onNhapSoLuong(row, value) {
  soLuongThucTe.value[row.id] = value
}

function chenhLech(row) {
  const thucTe = soLuongThucTe.value[row.id]
  if (thucTe === null || thucTe === undefined) return 0
  return thucTe - row.soLuongTon
}

// Danh sách các dòng đã nhập số lượng thực tế
const daNhap = computed(() =>
  products.value.filter(p => soLuongThucTe.value[p.id] !== null && soLuongThucTe.value[p.id] !== undefined)
)

const soSanPhamThieu = computed(() => daNhap.value.filter(p => chenhLech(p) < 0).length)

const giaTriThieuHut = computed(() =>
  daNhap.value.reduce((sum, p) => {
    const cl = chenhLech(p)
    return cl < 0 ? sum + Math.abs(cl) * (p.donGia || 0) : sum
  }, 0)
)

// ── GỬI BÁO CÁO KIỂM KÊ ────────────────────────────────────────────
// LƯU Ý: endpoint /api/v1/staff/kiem-ke hiện là endpoint ĐỀ XUẤT — cần Backend
// tạo thêm nếu chưa có. Payload gồm danh sách chi tiết từng sản phẩm đã kiểm kê.
const submitting = ref(false)
async function guiBaoCaoKiemKe() {
  if (daNhap.value.length === 0) return
  submitting.value = true
  try {
    const chiTiet = daNhap.value.map(p => ({
      sanPhamId: p.id,
      soLuongHeThong: p.soLuongTon,
      soLuongThucTe: soLuongThucTe.value[p.id],
      chenhLech: chenhLech(p),
    }))
    const { data } = await apiClient.post('/api/v1/staff/kiem-ke', { chiTiet })
    kiemKeIdGanNhat.value = data?.id || null
    ElMessage.success('Đã gửi báo cáo kiểm kê thành công!')
  } catch (err) {
    ElMessage.error(err.response?.data || 'Gửi báo cáo kiểm kê thất bại!')
  } finally {
    submitting.value = false
  }
}

// ── YÊU CẦU HOÀN TIỀN ──────────────────────────────────────────────
// LƯU Ý: endpoint /api/v1/staff/hoan-tien-yeu-cau cũng là ĐỀ XUẤT, cần khớp
// với Backend. Request tạo ra ở trạng thái CHO_DUYET, chờ Admin duyệt.
const kiemKeIdGanNhat = ref(null)
const showHoanTienDialog = ref(false)
const guiHoanTienLoading = ref(false)
const hoanTienForm = ref({ soTien: 0, lyDo: '' })

function moFormHoanTien() {
  hoanTienForm.value = {
    soTien: giaTriThieuHut.value,
    lyDo: `Kiểm kê cuối ca phát hiện thiếu ${soSanPhamThieu.value} sản phẩm so với tồn kho hệ thống.`,
  }
  showHoanTienDialog.value = true
}

async function guiYeuCauHoanTien() {
  if (!hoanTienForm.value.lyDo.trim()) {
    return ElMessage.warning('Vui lòng nhập lý do!')
  }
  guiHoanTienLoading.value = true
  try {
    await apiClient.post('/api/v1/staff/hoan-tien-yeu-cau', {
      kiemKeId: kiemKeIdGanNhat.value,
      soTien: hoanTienForm.value.soTien,
      lyDo: hoanTienForm.value.lyDo,
    })
    ElMessage.success('Đã gửi yêu cầu hoàn tiền cho Admin duyệt!')
    showHoanTienDialog.value = false
    await fetchYeuCauHoanTien()
  } catch (err) {
    ElMessage.error(err.response?.data || 'Gửi yêu cầu thất bại!')
  } finally {
    guiHoanTienLoading.value = false
  }
}

// ── LỊCH SỬ YÊU CẦU CỦA TÔI ────────────────────────────────────────
const danhSachYeuCau = ref([])
const loadingYeuCau = ref(false)

async function fetchYeuCauHoanTien() {
  loadingYeuCau.value = true
  try {
    const { data } = await apiClient.get('/api/v1/staff/hoan-tien-yeu-cau/cua-toi')
    danhSachYeuCau.value = data || []
  } catch (err) {
    // Im lặng nếu chưa có yêu cầu nào / endpoint chưa sẵn sàng
    danhSachYeuCau.value = []
  } finally {
    loadingYeuCau.value = false
  }
}

function trangThaiYeuCau(tt) {
  const map = {
    CHO_DUYET: { label: 'Chờ duyệt', cls: 'bg-amber-50 text-amber-600' },
    DA_DUYET: { label: 'Đã duyệt', cls: 'bg-green-50 text-green-600' },
    TU_CHOI: { label: 'Từ chối', cls: 'bg-red-50 text-red-500' },
  }
  return map[tt] || { label: tt || '—', cls: 'bg-gray-50 text-gray-400' }
}

// ── FORMAT ─────────────────────────────────────────────────────────
function formatVND(n) {
  if (n == null) return '0đ'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}
function formatDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── INIT ───────────────────────────────────────────────────────────
onMounted(() => {
  fetchProducts()
  fetchYeuCauHoanTien()
})
</script>
