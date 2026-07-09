<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Hệ thống</p>
        <h1 class="text-3xl font-semibold text-slate-900">Phân quyền theo vai trò (RBAC)</h1>
        <p class="mt-2 text-sm text-slate-500">Cấu hình quyền truy cập từng chức năng cho mỗi vai trò trong hệ thống.</p>
      </div>
      <div class="flex items-center gap-3">
        <el-button class="rounded-xl" @click="resetChanges" :disabled="!dirty">
          <iconify-icon icon="ph:arrow-counter-clockwise" class="mr-2 text-lg" />
          Hoàn tác
        </el-button>
        <el-button
          type="primary"
          class="rounded-xl bg-gradient-to-r from-cake-500 to-orange-500 border-none shadow-sm shadow-cake-200"
          :loading="saving"
          @click="saveChanges"
        >
          <iconify-icon icon="ph:floppy-disk-duotone" class="mr-2 text-lg" />
          Lưu thay đổi
        </el-button>
      </div>
    </div>

    <!-- Role summary cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div v-for="role in roles" :key="role.name" class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl" :style="{ background: role.bg, color: role.color }">
            <iconify-icon :icon="role.icon" />
          </div>
          <span class="badge badge-gray">{{ countGranted(role.name) }}/{{ permissionCount }} quyền</span>
        </div>
        <h3 class="font-semibold text-slate-800">{{ role.label }}</h3>
        <p class="text-xs text-slate-400 mt-1">{{ role.description }}</p>
      </div>
    </div>

    <!-- Permission matrix -->
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
                  :disabled="role.name === 'ADMIN'"
                  @change="dirty = true"
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
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const saving = ref(false)
const dirty = ref(false)
const search = ref('')

const roles = [
  { name: 'ADMIN',      label: 'Quản trị viên', icon: 'ph:crown-simple-duotone', bg: '#FDF6EC', color: '#7A5C3A', description: 'Toàn quyền quản lý hệ thống' },
  { name: 'NHAN_VIEN',  label: 'Nhân viên',      icon: 'ph:users-three-duotone', bg: '#EFF6FF', color: '#3B82F6', description: 'Vận hành cửa hàng hằng ngày' },
  { name: 'KHACH_HANG', label: 'Khách hàng',     icon: 'ph:user-duotone',        bg: '#F0FDF4', color: '#22C55E', description: 'Người dùng mua hàng trên hệ thống' },
]

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

const permissionCount = permissionGroups.reduce((s, g) => s + g.items.length, 0)

// Ma trận mặc định (tĩnh) — sẽ đồng bộ với API phân quyền thật sau này
function defaultMatrix() {
  return {
    ADMIN: Object.fromEntries(permissionGroups.flatMap(g => g.items.map(p => [p.key, true]))),
    NHAN_VIEN: {
      product_view: true, product_manage: true,
      order_view: true, order_manage: true, order_cancel: false,
      staff_view: true, staff_manage: false, rbac_manage: false,
      report_view: true, system_manage: false,
    },
    KHACH_HANG: {
      product_view: true, product_manage: false,
      order_view: true, order_manage: false, order_cancel: false,
      staff_view: false, staff_manage: false, rbac_manage: false,
      report_view: false, system_manage: false,
    },
  }
}

const matrix = reactive(defaultMatrix())
let snapshot = JSON.stringify(matrix)

const filteredGroups = computed(() => {
  if (!search.value.trim()) return permissionGroups
  const q = search.value.toLowerCase()
  return permissionGroups
    .map(g => ({ ...g, items: g.items.filter(p => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) }))
    .filter(g => g.items.length > 0)
})

function countGranted(roleName) {
  return Object.values(matrix[roleName]).filter(Boolean).length
}

function resetChanges() {
  const saved = JSON.parse(snapshot)
  Object.keys(saved).forEach(role => { Object.assign(matrix[role], saved[role]) })
  dirty.value = false
  ElMessage.info('Đã hoàn tác các thay đổi chưa lưu')
}

function saveChanges() {
  saving.value = true
  setTimeout(() => {
    snapshot = JSON.stringify(matrix)
    dirty.value = false
    saving.value = false
    ElMessage.success('Đã lưu cấu hình phân quyền')
  }, 600)
}
</script>
