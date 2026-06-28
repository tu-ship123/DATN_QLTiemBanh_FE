<template>
  <section class="space-y-6" v-loading="loading">

    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Quản Lý Khách Hàng</h1>
          <p class="text-sm text-muted">Xem, chỉnh sửa và quản lý tài khoản khách hàng</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-muted bg-[#FDF6EC] px-4 py-2 rounded-xl border border-[#EDE0CC]">
          <iconify-icon icon="ph:users-three-duotone" class="text-lg" style="color:#7A5C3A"></iconify-icon>
          <span style="color:#7A5C3A">{{ customers.length }} khách hàng</span>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng khách hàng</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">{{ customers.length }}</div>
          <div class="text-xs text-muted mt-2">Đã đăng ký</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Đang hoạt động</div>
          <div class="text-3xl font-bold" style="color:#22C55E">{{ activeCount }}</div>
          <div class="text-xs text-green-600 mt-2">Tài khoản kích hoạt</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Bị khóa</div>
          <div class="text-3xl font-bold" style="color:#EF4444">{{ lockedCount }}</div>
          <div class="text-xs text-red-500 mt-2">Tài khoản bị khóa</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng đơn hàng</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">{{ totalOrders }}</div>
          <div class="text-xs text-muted mt-2">Toàn bộ đơn</div>
        </div>
      </div>
    </div>

    <!-- Table card -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#5C4428">Danh sách khách hàng</h3>
        <div class="flex gap-2 items-center flex-wrap">
          <!-- Search -->
          <div class="relative">
            <iconify-icon icon="ph:magnifying-glass-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-base"></iconify-icon>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm tên, email, SĐT..."
              class="border border-[#EDE0CC] rounded-xl pl-9 pr-3 py-2 text-xs w-52 focus:outline-none focus:ring-2 focus:ring-[#C8996A]/40"
              style="color:#5C4428"
            />
          </div>
          <!-- Filter status -->
          <select
            v-model="filterStatus"
            class="border border-[#EDE0CC] rounded-xl px-3 py-2 text-xs"
            style="color:#5C4428"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="HOAT_DONG">Hoạt động</option>
            <option value="BI_KHOA">Bị khóa</option>
            <option value="NGUNG_HOAT_DONG">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredCustomers.length === 0" class="p-10 text-center text-muted text-sm">
        <iconify-icon icon="ph:users-duotone" class="text-4xl mb-2 block mx-auto opacity-30"></iconify-icon>
        Không tìm thấy khách hàng nào
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[#EDE0CC] bg-[#FFFBF5]">
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted">Khách hàng</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted">Liên hệ</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-muted">Điểm</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-muted">Đơn hàng</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-muted">Chi tiêu</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-muted">Trạng thái</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-muted">Ngày tham gia</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-muted">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="kh in filteredCustomers"
              :key="kh.id"
              class="border-b border-[#F5EDE0] hover:bg-[#FFFBF5] transition-colors"
            >
              <!-- Avatar + Tên -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden"
                    :style="{ background: avatarBg(kh.hoTen) }"
                  >
                    <img v-if="kh.anhDaiDien" :src="kh.anhDaiDien" class="w-full h-full object-cover" />
                    <span v-else class="text-white">{{ kh.hoTen?.[0]?.toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="font-semibold text-[#5C4428]">{{ kh.hoTen }}</div>
                    <div class="text-xs text-muted">#{{ kh.id }}</div>
                  </div>
                </div>
              </td>
              <!-- Liên hệ -->
              <td class="px-4 py-3">
                <div class="text-xs text-[#5C4428]">{{ kh.email }}</div>
                <div class="text-xs text-muted mt-0.5">{{ kh.soDienThoai || '—' }}</div>
              </td>
              <!-- Điểm -->
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <iconify-icon icon="ph:star-duotone" class="text-amber-400 text-sm"></iconify-icon>
                  <span class="font-bold text-amber-600 text-sm">{{ kh.tongDiem ?? 0 }}</span>
                </div>
              </td>
              <!-- Đơn hàng -->
              <td class="px-4 py-3 text-center">
                <span class="font-semibold text-[#5C4428]">{{ kh.tongDonHang ?? 0 }}</span>
              </td>
              <!-- Chi tiêu -->
              <td class="px-4 py-3 text-right">
                <span class="font-semibold text-[#7A5C3A] text-xs">{{ kh.tongChiTieu }}</span>
              </td>
              <!-- Trạng thái -->
              <td class="px-4 py-3 text-center">
                <span class="badge" :class="statusBadge(kh.trangThai)">
                  {{ statusLabel(kh.trangThai) }}
                </span>
              </td>
              <!-- Ngày tham gia -->
              <td class="px-4 py-3 text-center text-xs text-muted">
                {{ formatDate(kh.ngayTao) }}
              </td>
              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="openEdit(kh)"
                    class="text-xs px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                    title="Chỉnh sửa"
                  >
                    <iconify-icon icon="ph:pencil-simple-duotone"></iconify-icon>
                  </button>
                  <button
                    @click="openPointDialog(kh)"
                    class="text-xs px-2 py-1 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                    title="Điều chỉnh điểm"
                  >
                    <iconify-icon icon="ph:star-duotone"></iconify-icon>
                  </button>
                  <button
                    @click="toggleStatus(kh)"
                    :class="kh.trangThai === 'HOAT_DONG'
                      ? 'text-orange-500 hover:bg-orange-50'
                      : 'text-green-600 hover:bg-green-50'"
                    class="text-xs px-2 py-1 rounded-lg transition"
                    :title="kh.trangThai === 'HOAT_DONG' ? 'Khóa tài khoản' : 'Mở khóa'"
                  >
                    <iconify-icon :icon="kh.trangThai === 'HOAT_DONG' ? 'ph:lock-duotone' : 'ph:lock-open-duotone'"></iconify-icon>
                  </button>
                  <button
                    @click="deleteCustomer(kh)"
                    class="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                    title="Xóa"
                  >
                    <iconify-icon icon="ph:trash-duotone"></iconify-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dialog Sửa thông tin -->
    <el-dialog v-model="showEditDialog" title="Chỉnh sửa khách hàng" width="460px">
      <el-form :model="editForm" label-position="top">
        <el-form-item label="Họ tên *">
          <el-input v-model="editForm.hoTen" placeholder="Nguyễn Văn A" />
        </el-form-item>
        <el-form-item label="Số điện thoại">
          <el-input v-model="editForm.soDienThoai" placeholder="0901234567" />
        </el-form-item>
        <el-form-item label="Trạng thái *">
          <el-select v-model="editForm.trangThai" style="width:100%">
            <el-option label="Hoạt động" value="HOAT_DONG" />
            <el-option label="Bị khóa" value="BI_KHOA" />
            <el-option label="Ngừng hoạt động" value="NGUNG_HOAT_DONG" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Hủy</el-button>
        <el-button
          type="primary"
          :style="{ background: '#7A5C3A', borderColor: '#7A5C3A' }"
          @click="saveEdit"
        >Lưu thay đổi</el-button>
      </template>
    </el-dialog>

    <!-- Dialog Điều chỉnh điểm -->
    <el-dialog v-model="showPointDialog" title="Điều chỉnh điểm tích lũy" width="420px">
      <div v-if="selectedCustomer" class="mb-4 p-3 rounded-xl bg-[#FDF6EC] border border-[#EDE0CC]">
        <div class="text-sm font-semibold" style="color:#5C4428">{{ selectedCustomer.hoTen }}</div>
        <div class="text-xs text-muted mt-1">
          Điểm hiện tại:
          <span class="font-bold text-amber-600 ml-1">
            <iconify-icon icon="ph:star-fill" class="text-amber-400"></iconify-icon>
            {{ selectedCustomer.tongDiem }} điểm
          </span>
        </div>
      </div>
      <el-form :model="pointForm" label-position="top">
        <el-form-item>
          <template #label>
            <span>Số điểm thay đổi
              <span class="text-muted text-xs ml-1">(dương = cộng, âm = trừ)</span>
            </span>
          </template>
          <el-input
            v-model.number="pointForm.diemThayDoi"
            type="number"
            placeholder="VD: 100 hoặc -50"
          />
        </el-form-item>
        <el-form-item label="Lý do *">
          <el-input
            v-model="pointForm.moTa"
            type="textarea"
            :rows="3"
            placeholder="VD: Bù điểm lỗi hệ thống, tặng thêm nhân dịp sinh nhật..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPointDialog = false">Hủy</el-button>
        <el-button
          type="primary"
          :style="{ background: '#F59E0B', borderColor: '#F59E0B' }"
          @click="savePoint"
        >Xác nhận điều chỉnh</el-button>
      </template>
    </el-dialog>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiClient from '../services/apiService'

const loading = ref(false)
const customers = ref([])
const search = ref('')
const filterStatus = ref('')

// Dialogs
const showEditDialog = ref(false)
const showPointDialog = ref(false)
const selectedCustomer = ref(null)

const editForm = ref({ hoTen: '', soDienThoai: '', trangThai: 'HOAT_DONG' })
const pointForm = ref({ diemThayDoi: null, moTa: '' })

// ── Fetch ──────────────────────────────────────────────────────────────────────
async function fetchCustomers() {
  loading.value = true
  try {
    const res = await apiClient.get('/api/v1/admin/customers')
    customers.value = Array.isArray(res.data) ? res.data : []
  } catch {
    ElMessage.error('Không thể tải danh sách khách hàng')
  } finally {
    loading.value = false
  }
}
onMounted(fetchCustomers)

// ── Computed ───────────────────────────────────────────────────────────────────
const filteredCustomers = computed(() => {
  let list = customers.value
  if (filterStatus.value) list = list.filter(k => k.trangThai === filterStatus.value)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(k =>
      k.hoTen?.toLowerCase().includes(q) ||
      k.email?.toLowerCase().includes(q) ||
      k.soDienThoai?.includes(q)
    )
  }
  return list
})

const activeCount = computed(() => customers.value.filter(k => k.trangThai === 'HOAT_DONG').length)
const lockedCount = computed(() => customers.value.filter(k => k.trangThai === 'BI_KHOA').length)
const totalOrders = computed(() => customers.value.reduce((s, k) => s + (k.tongDonHang ?? 0), 0))

// ── Edit dialog ────────────────────────────────────────────────────────────────
function openEdit(kh) {
  selectedCustomer.value = kh
  editForm.value = { hoTen: kh.hoTen, soDienThoai: kh.soDienThoai || '', trangThai: kh.trangThai }
  showEditDialog.value = true
}

async function saveEdit() {
  if (!editForm.value.hoTen?.trim()) return ElMessage.warning('Họ tên không được để trống!')
  try {
    await apiClient.put(`/api/v1/admin/customers/${selectedCustomer.value.id}`, editForm.value)
    ElMessage.success('Cập nhật thành công!')
    showEditDialog.value = false
    await fetchCustomers()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Lưu thất bại!')
  }
}

// ── Point dialog ───────────────────────────────────────────────────────────────
function openPointDialog(kh) {
  selectedCustomer.value = kh
  pointForm.value = { diemThayDoi: null, moTa: '' }
  showPointDialog.value = true
}

async function savePoint() {
  if (pointForm.value.diemThayDoi === null || pointForm.value.diemThayDoi === 0) {
    return ElMessage.warning('Số điểm thay đổi phải khác 0!')
  }
  if (!pointForm.value.moTa?.trim()) return ElMessage.warning('Vui lòng nhập lý do!')
  try {
    await apiClient.post(`/api/v1/admin/customers/${selectedCustomer.value.id}/adjust-points`, pointForm.value)
    const sign = pointForm.value.diemThayDoi > 0 ? '+' : ''
    ElMessage.success(`Đã ${sign}${pointForm.value.diemThayDoi} điểm cho ${selectedCustomer.value.hoTen}!`)
    showPointDialog.value = false
    await fetchCustomers()
  } catch (err) {
    ElMessage.error(err.response?.data?.message || err.response?.data || 'Điều chỉnh thất bại!')
  }
}

// ── Toggle status ──────────────────────────────────────────────────────────────
async function toggleStatus(kh) {
  const action = kh.trangThai === 'HOAT_DONG' ? 'khóa' : 'mở khóa'
  try {
    await ElMessageBox.confirm(
      `Bạn muốn ${action} tài khoản của "${kh.hoTen}"?`,
      'Xác nhận',
      { type: 'warning', confirmButtonText: 'Xác nhận', cancelButtonText: 'Hủy' }
    )
    await apiClient.patch(`/api/v1/admin/customers/${kh.id}/toggle-status`)
    ElMessage.success(`Đã ${action} tài khoản!`)
    await fetchCustomers()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('Thao tác thất bại!')
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────
async function deleteCustomer(kh) {
  try {
    await ElMessageBox.confirm(
      `Xóa vĩnh viễn khách hàng "${kh.hoTen}"? Thao tác này không thể hoàn tác.`,
      'Xác nhận xóa',
      { type: 'error', confirmButtonText: 'Xóa', cancelButtonText: 'Hủy' }
    )
    await apiClient.delete(`/api/v1/admin/customers/${kh.id}`)
    ElMessage.success('Đã xóa khách hàng!')
    await fetchCustomers()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error(err.response?.data || 'Xóa thất bại!')
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusBadge(s) {
  if (s === 'HOAT_DONG') return 'badge-success'
  if (s === 'BI_KHOA') return 'badge-danger'
  return 'badge-warning'
}

function statusLabel(s) {
  if (s === 'HOAT_DONG') return 'Hoạt động'
  if (s === 'BI_KHOA') return 'Bị khóa'
  return 'Ngừng HĐ'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN')
}

const BG_PALETTE = ['#FDE68A','#A7F3D0','#BFDBFE','#FCA5A5','#DDD6FE','#FED7AA']
function avatarBg(name) {
  if (!name) return BG_PALETTE[0]
  const code = name.charCodeAt(0) % BG_PALETTE.length
  return BG_PALETTE[code]
}
</script>