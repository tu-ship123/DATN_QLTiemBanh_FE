<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Hệ thống</p>
        <h1 class="text-3xl font-semibold text-slate-900">Phân quyền theo vai trò (RBAC)</h1>
        <p class="mt-2 text-sm text-slate-500">Cấu hình quyền truy cập từng chức năng cho mỗi vai trò trong hệ thống.</p>
      </div>
      <div class="flex items-center gap-3">
        <el-tooltip content="Ma trận phân quyền chi tiết bên dưới hiện chỉ mang tính minh họa - hệ thống hiện tại chỉ hỗ trợ 3 quyền phẳng (ADMIN/NHAN_VIEN/KHACH_HANG), chưa lưu từng permission riêng lẻ." placement="top">
          <el-tag type="warning" effect="light" class="rounded-xl">Ma trận bên dưới: minh họa</el-tag>
        </el-tooltip>
      </div>
    </div>

    <!-- Role summary cards (dữ liệu thật từ BE) -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3" v-loading="loadingRoles">
      <div v-for="role in roles" :key="role.name" class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl" :style="{ background: role.bg, color: role.color }">
            <iconify-icon :icon="role.icon" />
          </div>
          <span class="badge badge-gray">{{ role.soLuongTaiKhoan ?? 0 }} tài khoản</span>
        </div>
        <h3 class="font-semibold text-slate-800">{{ role.label }}</h3>
        <p class="text-xs text-slate-400 mt-1">{{ role.moTa || role.description }}</p>
      </div>
    </div>

    <!-- Đổi quyền tài khoản (tính năng thật, hoạt động với BE) -->
    <el-card class="rounded-[28px] border border-slate-200 shadow-sm mb-6" body-class="p-0">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-semibold text-slate-800">Đổi quyền tài khoản</h3>
        <el-input v-model="userSearch" placeholder="Tìm theo tên/email..." clearable class="w-[240px]">
          <template #prefix><iconify-icon icon="ph:magnifying-glass" class="text-slate-400" /></template>
        </el-input>
      </div>
      <el-table :data="filteredUsers" v-loading="loadingUsers" max-height="400">
        <el-table-column prop="hoTen" label="Họ tên" min-width="160" />
        <el-table-column prop="email" label="Email" min-width="200" />
        <el-table-column label="Quyền hiện tại" width="220">
          <template #default="{ row }">
            <el-select v-model="row.quyen" size="small" style="width: 180px" @change="changeRole(row)">
              <el-option label="Khách hàng" value="KHACH_HANG" />
              <el-option label="Nhân viên" value="NHAN_VIEN" />
              <el-option label="Quản trị viên" value="ADMIN" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Permission matrix (MINH HỌA - chưa có API lưu chi tiết từng quyền) -->
    <el-card class="rounded-[28px] border border-slate-200 shadow-sm" body-class="p-0">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 class="font-semibold text-slate-800">Ma trận phân quyền</h3>
        <el-input v-model="search" placeholder="Tìm quyền..." clearable class="w-[220px]">
          <template #prefix><iconify-icon icon="ph:magnifying-glass" class="text-slate-400" /></template>
        </el-input>
      </div>

      <div v-for="group in filteredGroups" :key="group.name">
        <div class="px-5 py-2.5 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">{{ group.name }}</div>
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="perm in group.items" :key="perm.key" class="border-b border-slate-100 hover:bg-slate-50/60">
              <td class="px-5 py-3 w-1/2">
                <p class="font-medium text-slate-700">{{ perm.label }}</p>
                <p class="text-xs text-slate-400">{{ perm.desc }}</p>
              </td>
              <td v-for="role in roles" :key="role.name" class="px-3 py-3 text-center">
                <el-switch
                  v-model="matrix[role.name][perm.key]"
                  active-color="#fb923c"
                  inactive-color="#d1d5db"
                  disabled
                />
                <div class="text-[11px] text-slate-400 mt-1">{{ role.label }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredGroups.length === 0" class="p-8 text-center text-sm text-slate-400">
        Không tìm thấy quyền phù hợp
      </div>
    </el-card>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import apiClient from '@/services/apiService'

const search = ref('')
const userSearch = ref('')
const loadingRoles = ref(false)
const loadingUsers = ref(false)

const roleMeta = {
  ADMIN:      { label: 'Quản trị viên', icon: 'ph:crown-simple-duotone', bg: '#FDF6EC', color: '#7A5C3A' },
  NHAN_VIEN:  { label: 'Nhân viên',      icon: 'ph:users-three-duotone', bg: '#EFF6FF', color: '#3B82F6' },
  KHACH_HANG: { label: 'Khách hàng',     icon: 'ph:user-duotone',        bg: '#F0FDF4', color: '#22C55E' },
}

// roles: nạp từ GET /api/v1/admin/rbac/roles (số lượng tài khoản thật)
const roles = reactive([
  { name: 'ADMIN', ...roleMeta.ADMIN, soLuongTaiKhoan: 0, moTa: '' },
  { name: 'NHAN_VIEN', ...roleMeta.NHAN_VIEN, soLuongTaiKhoan: 0, moTa: '' },
  { name: 'KHACH_HANG', ...roleMeta.KHACH_HANG, soLuongTaiKhoan: 0, moTa: '' },
])

const users = ref([])

const filteredUsers = computed(() => {
  const q = userSearch.value.toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    (u.hoTen || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
  )
})

async function fetchRoles() {
  loadingRoles.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/rbac/roles')
    data.forEach(r => {
      const target = roles.find(x => x.name === r.quyen)
      if (target) {
        target.soLuongTaiKhoan = r.soLuongTaiKhoan
        target.moTa = r.moTa
      }
    })
  } catch {
    ElMessage.error('Không thể tải tổng quan phân quyền!')
  } finally {
    loadingRoles.value = false
  }
}

async function fetchUsers() {
  loadingUsers.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/rbac/users')
    users.value = data || []
  } catch {
    ElMessage.error('Không thể tải danh sách tài khoản!')
  } finally {
    loadingUsers.value = false
  }
}

async function changeRole(row) {
  try {
    await apiClient.put(`/api/v1/admin/rbac/users/${row.id}/role`, { quyen: row.quyen })
    ElMessage.success(`Đã đổi quyền của ${row.hoTen} thành ${roleMeta[row.quyen]?.label || row.quyen}`)
    fetchRoles()
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || err?.response?.data || 'Đổi quyền thất bại!')
    fetchUsers() // rollback lựa chọn trên UI nếu API từ chối (VD: tự hạ quyền chính mình)
  }
}

onMounted(() => {
  fetchRoles()
  fetchUsers()
})

// ── Ma trận phân quyền chi tiết bên dưới: MINH HỌA, chưa có API lưu thật ──
const permissionGroups = [
  {
    name: 'Sản phẩm & Danh mục',
    items: [
      { key: 'product_view',   label: 'Xem sản phẩm',        desc: 'Xem danh sách và chi tiết sản phẩm' },
      { key: 'product_manage', label: 'Quản lý sản phẩm',    desc: 'Thêm, sửa, xóa sản phẩm và danh mục' },
    ],
  },
  {
    name: 'Đơn hàng',
    items: [
      { key: 'order_view',   label: 'Xem đơn hàng',       desc: 'Xem danh sách và chi tiết đơn hàng' },
      { key: 'order_manage', label: 'Xử lý đơn hàng',     desc: 'Xác nhận, cập nhật trạng thái đơn hàng' },
      { key: 'order_cancel', label: 'Hủy / hoàn tiền',    desc: 'Hủy đơn hoặc thực hiện hoàn tiền' },
    ],
  },
  {
    name: 'Nhân sự & Phân quyền',
    items: [
      { key: 'staff_view',   label: 'Xem nhân sự',        desc: 'Xem danh sách nhân viên và vai trò' },
      { key: 'staff_manage', label: 'Quản lý nhân sự',    desc: 'Thêm, sửa, khóa tài khoản nhân viên' },
      { key: 'rbac_manage',  label: 'Phân quyền hệ thống', desc: 'Chỉnh sửa ma trận phân quyền RBAC' },
    ],
  },
  {
    name: 'Báo cáo & Hệ thống',
    items: [
      { key: 'report_view',  label: 'Xem báo cáo',         desc: 'Xem báo cáo doanh thu, thống kê' },
      { key: 'system_manage', label: 'Cấu hình hệ thống',  desc: 'Sao lưu, webhook, giám sát hệ thống' },
    ],
  },
]

// Ma trận mặc định phản ánh ĐÚNG những gì code đang enforce qua SecurityConfig/@PreAuthorize
// (không lưu được, chỉ hiển thị tham khảo)
const matrix = reactive({
  ADMIN: Object.fromEntries(permissionGroups.flatMap(g => g.items.map(p => [p.key, true]))),
  NHAN_VIEN: {
    product_view: true, product_manage: true,
    order_view: true, order_manage: true, order_cancel: false,
    staff_view: true, staff_manage: false, rbac_manage: false,
    report_view: false, system_manage: false,
  },
  KHACH_HANG: {
    product_view: true, product_manage: false,
    order_view: true, order_manage: false, order_cancel: false,
    staff_view: false, staff_manage: false, rbac_manage: false,
    report_view: false, system_manage: false,
  },
})

const filteredGroups = computed(() => {
  if (!search.value.trim()) return permissionGroups
  const q = search.value.toLowerCase()
  return permissionGroups
    .map(g => ({ ...g, items: g.items.filter(p => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) }))
    .filter(g => g.items.length > 0)
})
</script>
