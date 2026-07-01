<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">Nhân sự & Phân quyền</h1>
        <p class="text-sm text-muted mt-0.5">
          {{ staffStore.totalStaff }} tài khoản · {{ roles.length }} vai trò
        </p>
      </div>
      <button class="btn-primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon> Thêm nhân viên
      </button>
    </div>

    <el-tabs v-model="activeTab" class="mb-6">
      <el-tab-pane name="staff">
        <template #label>
          <span class="flex items-center gap-1.5"><iconify-icon icon="ph:users-duotone" class="text-lg" /> Danh sách nhân viên</span>
        </template>
      </el-tab-pane>
      <el-tab-pane name="roles">
        <template #label>
          <span class="flex items-center gap-1.5"><iconify-icon icon="ph:key-duotone" class="text-lg" /> Phân quyền & Vai trò</span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- STAFF TAB -->
    <div v-if="activeTab === 'staff'">
      <div class="flex gap-3 mb-4">
        <div class="search-input flex-1">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm nhân viên..." />
        </div>
        <el-select v-model="filterRole" placeholder="Tất cả vai trò" clearable style="width:160px">
          <el-option v-for="r in roles" :key="r.name" :label="r.label" :value="r.name" />
        </el-select>
      </div>

      <!-- Loading skeleton -->
      <div v-if="staffStore.loading" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <el-skeleton v-for="n in 6" :key="n" :rows="4" animated class="bg-white rounded-2xl p-5" />
      </div>

      <!-- Error state -->
      <el-alert v-else-if="staffStore.error" :title="staffStore.error" type="error" show-icon class="mb-4" />

      <!-- Staff grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="s in filteredStaff" :key="s.id"
          class="bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-md transition group"
          :class="{ 'opacity-60': !s.active }"
        >
          <div class="flex items-start gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
              :style="{ background: s.avatarBg, color: s.avatarColor }"
            >{{ s.initials }}</div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold" style="color:#5C4428">{{ s.name }}</div>
              <div class="text-xs text-muted mt-0.5">{{ s.email }}</div>
              <span class="badge mt-1.5" :class="`badge-${roleColor(s.role)}`">{{ roleLabel(s.role) }}</span>
            </div>

            <!-- Dropdown actions -->
            <el-dropdown trigger="click" placement="bottom-end">
              <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 text-slate-400 hover:text-[#7A5C3A] transition-all">
                <el-icon><MoreFilled /></el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu class="w-48 rounded-xl p-1 shadow-xl border border-slate-100">
                  <el-dropdown-item class="rounded-lg py-2" @click="openEditDialog(s)">
                    <iconify-icon icon="ph:pencil-simple-duotone" class="mr-2 text-lg"></iconify-icon>
                    <span class="font-medium">Chỉnh sửa</span>
                  </el-dropdown-item>
                  <el-dropdown-item class="rounded-lg py-2" @click="openScheduleDialog(s)">
                    <iconify-icon icon="ph:calendar-plus-duotone" class="mr-2 text-lg text-blue-500"></iconify-icon>
                    <span class="font-medium">Phân ca làm việc</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    divided
                    class="rounded-lg py-2 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    :disabled="!s.active"
                    @click="confirmDeactivate(s)"
                  >
                    <iconify-icon icon="ph:prohibit-duotone" class="mr-2 text-lg"></iconify-icon>
                    <span class="font-medium">{{ s.active ? 'Vô hiệu hoá' : 'Đã khoá' }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-[#FFFBF5] rounded-xl p-2">
              <div class="font-bold text-sm" style="color:#5C4428">{{ s.ordersHandled }}</div>
              <div class="text-xs text-muted">Đơn xử lý</div>
            </div>
            <div class="bg-[#FFFBF5] rounded-xl p-2">
              <div class="font-bold text-sm" style="color:#5C4428">{{ s.performance }}%</div>
              <div class="text-xs text-muted">Hiệu suất</div>
            </div>
            <div class="bg-[#FFFBF5] rounded-xl p-2">
              <div class="font-bold text-sm" :style="{ color: s.active ? '#22C55E' : '#EF4444' }">
                {{ s.active ? 'Làm việc' : 'Nghỉ phép' }}
              </div>
              <div class="text-xs text-muted">Trạng thái</div>
            </div>
          </div>

          <div class="mt-3 text-xs text-muted flex items-center gap-1.5">
            <span class="flex items-center gap-1.5"><iconify-icon icon="ph:phone-duotone" class="text-[#7A5C3A]"></iconify-icon> {{ s.phone }}</span>
            <span>·</span>
            <span class="flex items-center gap-1.5"><iconify-icon icon="ph:calendar-duotone" class="text-[#7A5C3A]"></iconify-icon> Từ {{ s.joinDate }}</span>
          </div>
        </div>

        <!-- Add new card -->
        <div
          class="bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7A5C3A] hover:bg-[#FFFBF5] transition min-h-[200px]"
          @click="openAddDialog"
        >
          <div class="w-12 h-12 rounded-2xl bg-[#FDF6EC] flex items-center justify-center text-2xl">+</div>
          <div class="text-sm font-semibold" style="color:#7A5C3A">Thêm nhân viên</div>
        </div>
      </div>
    </div>

    <!-- ROLES TAB -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="role in roles" :key="role.name" class="data-card">
        <div class="data-card-header">
          <div class="flex items-center gap-3">
            <iconify-icon :icon="role.icon" class="text-2xl text-[#7A5C3A]"></iconify-icon>
            <div>
              <div class="font-display font-bold text-base" style="color:#5C4428">{{ role.label }}</div>
              <div class="text-xs text-muted">
                {{ staffStore.staffList.filter(s => s.role === role.name).length }} nhân viên
              </div>
            </div>
          </div>
          <span class="badge" :class="`badge-${roleColor(role.name)}`">{{ role.level }}</span>
          <span class="badge badge-gray ml-1">{{ role.name }}</span>
        </div>
        <div class="p-4">
          <div class="text-xs font-bold text-muted uppercase tracking-wider mb-3">Quyền hạn</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="perm in role.permissions" :key="perm"
              class="text-xs px-2.5 py-1 rounded-lg font-medium"
              style="background:#FFFBF5;color:#7A5C3A;border:1px solid #FFE4D5"
            >{{ perm }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── DIALOG: THÊM / SỬA NHÂN VIÊN ─────────────────────────────────────── -->
    <el-dialog
      v-model="showStaffDialog"
      :title="isEditing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'"
      width="500px"
      @closed="resetForm"
    >
      <el-form :model="staffForm" label-position="top">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Họ và tên" required class="col-span-2">
            <el-input v-model="staffForm.name" placeholder="Nguyễn Văn A" />
          </el-form-item>
          <el-form-item label="Email" required>
            <el-input v-model="staffForm.email" placeholder="email@polycake.vn" :disabled="isEditing" />
          </el-form-item>
          <el-form-item label="Số điện thoại">
            <el-input v-model="staffForm.phone" placeholder="0901 234 567" />
          </el-form-item>
          <el-form-item label="Vai trò" required>
            <el-select v-model="staffForm.role" style="width:100%">
              <el-option v-for="r in roles" :key="r.name" :label="r.label" :value="r.name" />
            </el-select>
          </el-form-item>
          <!-- Chỉ hiện ô mật khẩu khi THÊM MỚI — BE sẽ tự gửi email first login -->
          <el-form-item v-if="!isEditing" label="Mật khẩu tạm thời">
            <el-input v-model="staffForm.password" type="password" placeholder="Để trống = BE tự tạo" show-password />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="showStaffDialog = false">Huỷ</el-button>
        <el-button
          type="primary"
          :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          :loading="staffStore.submitting"
          @click="submitStaffForm"
        >
          {{ isEditing ? 'Lưu thay đổi' : 'Thêm nhân viên' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- ── DIALOG: PHÂN CA ─────────────────────────────────────────────────────── -->
    <el-dialog v-model="showScheduleDialog" title="Phân ca làm việc" width="420px" @open="loadCaLamViec">
      <div v-if="loadingCa" class="flex justify-center py-6">
        <iconify-icon icon="ph:spinner-gap" class="text-3xl animate-spin text-[#7A5C3A]"></iconify-icon>
      </div>
      <el-form v-else :model="scheduleForm" label-position="top">
        <el-form-item label="Nhân viên">
          <el-input :value="scheduleForm.staffName" disabled />
        </el-form-item>
        <el-form-item label="Ngày làm việc" required>
          <el-date-picker
            v-model="scheduleForm.ngayLamViec"
            type="date"
            style="width:100%"
            placeholder="Chọn ngày"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDates"
          />
        </el-form-item>
        <el-form-item label="Ca làm việc" required>
          <el-select v-model="scheduleForm.caLamViecId" style="width:100%" placeholder="Chọn ca làm việc">
            <el-option
              v-for="ca in caLamViecList"
              :key="ca.id"
              :value="ca.id"
              :disabled="!ca.hoatDong"
            >
              <div class="flex items-center justify-between w-full">
                <span class="font-semibold">{{ ca.tenCa }}</span>
                <span class="text-xs text-gray-400 ml-3">
                  {{ formatCaTime(ca.gioBatDau) }} – {{ formatCaTime(ca.gioKetThuc) }}
                </span>
              </div>
            </el-option>
          </el-select>
          <p v-if="caLamViecList.length === 0 && !loadingCa" class="text-xs text-red-500 mt-1">
            Chưa có ca làm việc nào. Admin cần tạo ca trước.
          </p>
        </el-form-item>
        <el-form-item label="Ghi chú (tuỳ chọn)">
          <el-input v-model="scheduleForm.ghiChu" type="textarea" :rows="2" placeholder="Ghi chú thêm..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showScheduleDialog = false">Huỷ</el-button>
        <el-button
          type="primary"
          :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          :loading="submittingSchedule"
          :disabled="loadingCa || caLamViecList.length === 0"
          @click="submitSchedule"
        >Lưu phân ca</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, MoreFilled } from '@element-plus/icons-vue'
import { useStaffStore } from '@/stores/staffStore'
import { staffService } from '@/services/staffService'

// ── Store ────────────────────────────────────────────────────
// ────────────────
const staffStore = useStaffStore()

// ── UI state ─────────────────────────────────────────────────────────────────
const activeTab   = ref('staff')
const search      = ref('')
const filterRole  = ref('')

// ── Dialog: Thêm / Sửa nhân viên ─────────────────────────────────────────────
const showStaffDialog = ref(false)
const isEditing       = ref(false)
const editingId       = ref(null)
const staffForm       = ref({ name:'', email:'', phone:'', role:'', password:'' })

function openAddDialog() {
  isEditing.value = false
  editingId.value = null
  showStaffDialog.value = true
}

function openEditDialog(s) {
  isEditing.value = true
  editingId.value  = s.id
  staffForm.value  = { name: s.name, email: s.email, phone: s.phone, role: s.role, password: '' }
  showStaffDialog.value = true
}

function resetForm() {
  staffForm.value = { name:'', email:'', phone:'', role:'', password:'' }
  isEditing.value = false
  editingId.value = null
}

async function submitStaffForm() {
  if (!staffForm.value.name || !staffForm.value.role) {
    return ElMessage.warning('Vui lòng điền đầy đủ Họ tên và Vai trò')
  }

  if (isEditing.value) {
    // ── CẬP NHẬT ─────────────────────────────────────────────────────────────
    const res = await staffStore.updateStaff(editingId.value, staffForm.value)
    if (res.success) {
      ElMessage.success('Đã cập nhật thông tin nhân viên!')
      showStaffDialog.value = false
    } else {
      ElMessage.error(res.message)
    }
  } else {
    // ── TẠO MỚI ──────────────────────────────────────────────────────────────
    const res = await staffStore.createStaff(staffForm.value)
    if (res.success) {
      ElMessage.success('Đã thêm nhân viên! Email kích hoạt đã được gửi.')
      showStaffDialog.value = false
    } else {
      ElMessage.error(res.message)
    }
  }
}

// ── Dialog: Phân ca (load ca từ API) ──────────────────────────────────────────
const showScheduleDialog = ref(false)
const submittingSchedule = ref(false)
const loadingCa          = ref(false)
const caLamViecList      = ref([])

const scheduleForm = ref({
  staffId:      null,
  staffName:    '',
  ngayLamViec:  '',
  caLamViecId:  null,
  ghiChu:       ''
})

function openScheduleDialog(s) {
  scheduleForm.value = {
    staffId:     s.id,
    staffName:   s.name,
    ngayLamViec: '',
    caLamViecId: null,
    ghiChu:      ''
  }
  showScheduleDialog.value = true
  // loadCaLamViec() được gọi qua @open trên el-dialog
}

async function loadCaLamViec() {
  loadingCa.value = true
  try {
    const res = await staffService.getAllCaLamViec()
    caLamViecList.value = (res.data || []).filter(ca => ca.hoatDong !== false)
  } catch (err) {
    ElMessage.error('Không tải được danh sách ca làm việc. Vui lòng thử lại.')
    caLamViecList.value = []
  } finally {
    loadingCa.value = false
  }
}

async function submitSchedule() {
  if (!scheduleForm.value.ngayLamViec) {
    return ElMessage.warning('Vui lòng chọn ngày làm việc')
  }
  if (!scheduleForm.value.caLamViecId) {
    return ElMessage.warning('Vui lòng chọn ca làm việc')
  }
  if (!scheduleForm.value.staffId) {
    return ElMessage.error('Không xác định được nhân viên, vui lòng thử lại')
  }

  submittingSchedule.value = true
  try {
    await staffService.createSchedule({
      nhanVienId:  scheduleForm.value.staffId,
      caLamViecId: scheduleForm.value.caLamViecId,
      ngayLamViec: scheduleForm.value.ngayLamViec,
      ghiChu:      scheduleForm.value.ghiChu || null
    })
    ElMessage.success('Phân ca thành công!')
    showScheduleDialog.value = false
  } catch (err) {
    const msg = err.response?.data || err.response?.data?.message || 'Phân ca thất bại, thử lại sau.'
    ElMessage.error(typeof msg === 'string' ? msg : 'Phân ca thất bại, thử lại sau.')
  } finally {
    submittingSchedule.value = false
  }
}

function formatCaTime(t) {
  if (!t) return '--:--'
  if (Array.isArray(t)) return `${String(t[0]).padStart(2,'0')}:${String(t[1]).padStart(2,'0')}`
  return String(t).slice(0, 5)
}

function disablePastDates(date) {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

// ── Vô hiệu hoá ──────────────────────────────────────────────────────────────
async function confirmDeactivate(s) {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc muốn vô hiệu hoá tài khoản của <b>${s.name}</b>?`,
      'Xác nhận khoá tài khoản',
      { confirmButtonText: 'Vô hiệu hoá', cancelButtonText: 'Huỷ', type: 'warning', dangerouslyUseHTMLString: true }
    )
    const res = await staffStore.deactivateStaff(s.id)
    if (res.success) ElMessage.success('Đã vô hiệu hoá tài khoản.')
    else             ElMessage.error(res.message)
  } catch {
    // User nhấn Huỷ — không làm gì
  }
}

// ── Roles (tĩnh — không cần API) ─────────────────────────────────────────────
const roles = [
  {
    name: 'ROLE_ADMIN',
    label: 'Admin',
    icon: 'ph:crown-duotone',
    level: 'Cấp 1',
    permissions: ['Toàn quyền hệ thống', 'Quản lý nhân sự', 'Quản lý sản phẩm', 'Quản lý đơn hàng', 'Xem báo cáo', 'Phân quyền tài khoản']
  },
  {
    name: 'ROLE_NHAN_VIEN',
    label: 'Nhân viên',
    icon: 'ph:briefcase-duotone',
    level: 'Cấp 2',
    permissions: ['Quản lý sản phẩm', 'Quản lý đơn hàng', 'Bếp bánh', 'Giao hàng', 'Bán hàng tại quầy']
  },
  {
    name: 'ROLE_KHACH_HANG',
    label: 'Khách hàng',
    icon: 'ph:user-duotone',
    level: 'Cấp 3',
    permissions: ['Xem sản phẩm', 'Đặt hàng online', 'Xem lịch sử đơn hàng', 'Đánh giá sản phẩm']
  },
]

const roleColor = (role) => {
  const m = { 'ROLE_ADMIN': 'danger', 'ROLE_NHAN_VIEN': 'primary', 'ROLE_KHACH_HANG': 'success' }
  return m[role] || 'gray'
}

const roleLabel = (role) => {
  const r = roles.find(r => r.name === role)
  return r ? r.label : role
}

// ── Computed: lọc danh sách nhân viên ─────────────────────────────────────────
const filteredStaff = computed(() => {
  let list = staffStore.staffList
  if (search.value)     list = list.filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
  if (filterRole.value) list = list.filter(s => s.role === filterRole.value)
  return list
})

// ── Tải dữ liệu khi component mount ──────────────────────────────────────────
onMounted(() => {
  staffStore.fetchAll()
})
</script>