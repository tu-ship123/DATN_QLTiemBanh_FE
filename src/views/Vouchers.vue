<template>
  <section class="space-y-6" v-loading="loading">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Khuyến Mãi & Voucher</h1>
          <p class="text-sm text-muted">Quản lý mã giảm giá, chương trình ưu đãi</p>
        </div>
        <button class="btn-primary flex items-center gap-2" @click="openAdd"><iconify-icon icon="ph:ticket-duotone"></iconify-icon> Tạo khuyến mãi</button>
      </div>
    </div>

    <!-- Promo Stats -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Voucher hoạt động</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">{{ activeCount }}</div>
          <div class="text-xs text-muted mt-2">{{ expiringSoonCount }} sắp hết hạn</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Lượt sử dụng</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">{{ totalUsed }}</div>
          <div class="text-xs text-green-600 mt-2">Tổng cộng</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng voucher</div>
          <div class="text-3xl font-bold" style="color:#22C55E">{{ vouchers.length }}</div>
          <div class="text-xs text-muted mt-2">Đã tạo</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tỉ lệ sử dụng</div>
          <div class="text-3xl font-bold" style="color:#F59E0B">{{ conversionRate }}%</div>
          <div class="text-xs text-muted mt-2">Trung bình</div>
        </div>
      </div>
    </div>

    <!-- Vouchers List -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#5C4428">Danh sách voucher</h3>
        <div class="flex gap-2">
          <select
            v-model="filterStatus"
            class="border border-[#EDE0CC] rounded-xl px-3 py-2 text-xs"
            style="color:#5C4428"
          >
            <option>Tất cả</option>
            <option>Hoạt động</option>
            <option>Sắp hết</option>
            <option>Hết hạn</option>
          </select>
        </div>
      </div>

      <div v-if="displayedVouchers.length === 0" class="p-8 text-center text-muted text-sm">
        Chưa có voucher nào
      </div>

      <div class="space-y-2 p-4">
        <div
          v-for="voucher in displayedVouchers"
          :key="voucher.id"
          class="border border-[#EDE0CC] rounded-lg p-4 hover:bg-[#FFFBF5] transition"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                :style="{ background: voucher.bg }"
              >
                <iconify-icon :icon="voucher.icon" class="text-xl text-[#7A5C3A]"></iconify-icon>
              </div>
              <div>
                <h4 class="font-bold" style="color:#5C4428">{{ voucher.name }}</h4>
                <p class="text-sm text-muted">{{ voucher.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="badge" :class="'badge-' + voucher.statusType">{{ voucher.status }}</span>
              <button
                @click="openEdit(voucher)"
                class="text-xs px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition"
              ><iconify-icon icon="ph:pencil-simple-duotone" class="mr-1"></iconify-icon> Sửa</button>
              <button
                @click="deleteVoucher(voucher)"
                class="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 transition"
              >🗑 Xóa</button>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-[#FDF8F2]">
            <div>
              <div class="text-muted text-xs">Mã voucher</div>
              <div class="font-mono font-bold" style="color:#7A5C3A">{{ voucher.code }}</div>
            </div>
            <div>
              <div class="text-muted text-xs">Giảm giá</div>
              <div class="font-bold" style="color:#5C4428">{{ voucher.discount }}</div>
            </div>
            <div>
              <div class="text-muted text-xs">Sử dụng</div>
              <div class="font-bold" style="color:#5C4428">{{ voucher.used }}/{{ voucher.limit }}</div>
            </div>
            <div class="text-right">
              <div class="text-muted text-xs">Hết hạn</div>
              <div class="font-bold" style="color:#5C4428">{{ voucher.expiry }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Campaigns -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#5C4428">🚀 Chiến dịch khuyến mãi</h3>
      </div>
      <div class="space-y-3 p-4">
        <div
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="border border-[#EDE0CC] rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-sm" style="color:#5C4428">{{ campaign.name }}</h4>
            <span class="text-xs font-semibold" style="color:#7A5C3A">{{ campaign.period }}</span>
          </div>
          <p class="text-xs text-muted mb-3">{{ campaign.description }}</p>
          <div class="flex items-center justify-between text-xs">
            <div class="text-muted">Tiến độ</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-2 rounded-full bg-gray-100 w-32 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-[#7A5C3A] to-[#FBB830]"
                  :style="{ width: campaign.progress + '%' }"
                ></div>
              </div>
              <span class="font-semibold">{{ campaign.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Thêm/Sửa Voucher -->
    <el-dialog
      v-model="showDialog"
      :title="editingVoucher ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'"
      width="500px"
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="Mã voucher *">
          <el-input
            v-model="form.maCode"
            placeholder="VD: SINH20"
            :disabled="!!editingVoucher"
            style="text-transform:uppercase"
          />
        </el-form-item>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Loại giảm giá *">
            <el-select v-model="form.loaiGiamGia" style="width:100%">
              <el-option label="Phần trăm (%)" value="PHAN_TRAM" />
              <el-option label="Số tiền cố định (đ)" value="SO_TIEN_CO_DINH" />
            </el-select>
          </el-form-item>

          <el-form-item :label="form.loaiGiamGia === 'PHAN_TRAM' ? 'Giá trị giảm (%) *' : 'Giá trị giảm (đ) *'">
            <el-input v-model.number="form.giaTriGiam" type="number" :min="0" placeholder="20" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Đơn hàng tối thiểu (đ)">
            <el-input v-model.number="form.donHangToiThieu" type="number" :min="0" placeholder="0" />
          </el-form-item>

          <el-form-item label="Số lượt tối đa">
            <el-input v-model.number="form.soLuotToiDa" type="number" :min="1" placeholder="100" />
          </el-form-item>
        </div>

        <el-form-item label="Ngày hết hạn *">
          <el-input v-model="form.ngayHetHan" type="datetime-local" style="width:100%" />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.hoatDong" label="Kích hoạt ngay" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">Hủy</el-button>
        <el-button
          type="primary"
          :style="{ background: '#7A5C3A', borderColor: '#7A5C3A' }"
          @click="saveVoucher"
        >
          {{ editingVoucher ? 'Cập nhật' : 'Tạo voucher' }}
        </el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiClient from '../services/apiService'

const loading = ref(false)
const filterStatus = ref('Tất cả')
const vouchers = ref([])
const showDialog = ref(false)
const editingVoucher = ref(null)

const emptyForm = () => ({
  maCode: '',
  loaiGiamGia: 'PHAN_TRAM',
  giaTriGiam: null,
  donHangToiThieu: 0,
  soLuotToiDa: 100,
  ngayHetHan: '',
  hoatDong: true,
})
const form = ref(emptyForm())

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchVouchers() {
  loading.value = true
  try {
    const res = await apiClient.get('/api/v1/admin/vouchers')
    vouchers.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    ElMessage.error('Không thể tải danh sách voucher')
  } finally {
    loading.value = false
  }
}
onMounted(() => fetchVouchers())

// ── Map response → hiển thị ───────────────────────────────────────────────────
function mapVoucher(v) {
  const now = new Date()
  const expiry = v.ngayHetHan ? new Date(v.ngayHetHan) : null
  const isExpired = expiry && expiry < now
  const almostExpired = expiry && !isExpired && (expiry - now) < 3 * 24 * 60 * 60 * 1000

  let status, statusType
  if (!v.hoatDong || isExpired)  { status = 'Hết hạn';  statusType = 'danger' }
  else if (almostExpired)        { status = 'Sắp hết';  statusType = 'warning' }
  else                           { status = 'Hoạt động'; statusType = 'success' }

  const discount = v.loaiGiamGia === 'PHAN_TRAM'
    ? `-${v.giaTriGiam}%`
    : `-${Number(v.giaTriGiam).toLocaleString('vi-VN')}đ`

  return {
    id: v.id,
    icon: v.loaiGiamGia === 'PHAN_TRAM' ? 'ph:ticket-duotone' : 'ph:coins-duotone',
    bg: v.loaiGiamGia === 'PHAN_TRAM' ? '#FDF6EC' : '#EFF6FF',
    name: v.maCode,
    description: v.loaiGiamGia === 'PHAN_TRAM'
      ? `Giảm ${v.giaTriGiam}% — Đơn tối thiểu ${Number(v.donHangToiThieu || 0).toLocaleString('vi-VN')}đ`
      : `Giảm ${Number(v.giaTriGiam).toLocaleString('vi-VN')}đ`,
    code: v.maCode,
    discount,
    used: v.soLuotDaDung ?? 0,
    limit: v.soLuotToiDa ?? 0,
    expiry: expiry ? expiry.toLocaleDateString('vi-VN') : '--',
    status, statusType,
    _raw: v,
  }
}

const displayedVouchers = computed(() => {
  const list = vouchers.value.map(mapVoucher)
  if (filterStatus.value === 'Tất cả') return list
  return list.filter(v => v.status === filterStatus.value)
})

// ── Stats ─────────────────────────────────────────────────────────────────────
const activeCount = computed(() =>
  vouchers.value.filter(v => v.hoatDong && new Date(v.ngayHetHan) > new Date()).length
)
const expiringSoonCount = computed(() => {
  const now = new Date()
  return vouchers.value.filter(v => {
    const exp = new Date(v.ngayHetHan)
    return exp > now && (exp - now) < 3 * 24 * 60 * 60 * 1000
  }).length
})
const totalUsed = computed(() =>
  vouchers.value.reduce((s, v) => s + (v.soLuotDaDung ?? 0), 0)
)
const conversionRate = computed(() => {
  const total = vouchers.value.reduce((s, v) => s + (v.soLuotToiDa ?? 0), 0)
  if (!total) return 0
  return Math.round((totalUsed.value / total) * 100)
})

// ── Dialog ────────────────────────────────────────────────────────────────────
function openAdd() {
  editingVoucher.value = null
  form.value = emptyForm()
  showDialog.value = true
}

function openEdit(v) {
  editingVoucher.value = v._raw
  form.value = {
    maCode: v._raw.maCode,
    loaiGiamGia: v._raw.loaiGiamGia,
    giaTriGiam: v._raw.giaTriGiam,
    donHangToiThieu: v._raw.donHangToiThieu ?? 0,
    soLuotToiDa: v._raw.soLuotToiDa ?? 100,
    ngayHetHan: v._raw.ngayHetHan ? v._raw.ngayHetHan.slice(0, 16) : '',
    hoatDong: v._raw.hoatDong ?? true,
  }
  showDialog.value = true
}

async function saveVoucher() {
  if (!form.value.maCode || !form.value.giaTriGiam || !form.value.ngayHetHan) {
    return ElMessage.warning('Vui lòng điền đầy đủ thông tin bắt buộc!')
  }
  const payload = {
    maCode:          form.value.maCode.toUpperCase(),
    loaiGiamGia:     form.value.loaiGiamGia,
    giaTriGiam:      Number(form.value.giaTriGiam),
    donHangToiThieu: Number(form.value.donHangToiThieu) || 0,
    soLuotToiDa:     Number(form.value.soLuotToiDa) || 100,
    ngayHetHan:      form.value.ngayHetHan,
    hoatDong:        form.value.hoatDong,
  }
  try {
    if (editingVoucher.value) {
      await apiClient.put(`/api/v1/admin/vouchers/${editingVoucher.value.id}`, payload)
      ElMessage.success('Cập nhật voucher thành công!')
    } else {
      await apiClient.post('/api/v1/admin/vouchers', payload)
      ElMessage.success('Tạo voucher thành công!')
    }
    showDialog.value = false
    await fetchVouchers()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || err.response?.data || 'Lưu thất bại!')
  }
}

async function deleteVoucher(v) {
  try {
    await ElMessageBox.confirm(`Xóa voucher "${v.code}"?`, 'Xác nhận', {
      type: 'warning', confirmButtonText: 'Xóa', cancelButtonText: 'Hủy'
    })
    await apiClient.delete(`/api/v1/admin/vouchers/${v.id}`)
    await fetchVouchers()
    ElMessage.success('Đã xóa voucher!')
  } catch (err) {
    if (err !== 'cancel') ElMessage.error(err.response?.data || 'Xóa thất bại!')
  }
}

// Campaigns tĩnh
const campaigns = [
  { id:1, name:'Khuyến mãi Tháng 6', period:'01-30/06/2026', description:'Chiến dịch khuyến mãi tổng hợp cho tất cả loại bánh', progress:65 },
  { id:2, name:'Flash Sale Cuối Tuần', period:'08-09/06/2026', description:'Giảm giá sâu cho cuối tuần', progress:85 },
]
</script>