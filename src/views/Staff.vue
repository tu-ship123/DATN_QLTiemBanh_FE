<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#1E2A3B">Nhân sự & Phân quyền</h1>
        <p class="text-sm text-muted mt-0.5">{{ staff.length }} nhân viên · {{ roles.length }} vai trò</p>
      </div>
      <button class="btn-primary" @click="showAddStaff = true">
        <el-icon><Plus /></el-icon> Thêm nhân viên
      </button>
    </div>

    <el-tabs v-model="activeTab" class="mb-6">
      <el-tab-pane label="👥 Danh sách nhân viên" name="staff" />
      <el-tab-pane label="🔑 Phân quyền & Vai trò" name="roles" />
    </el-tabs>

    <!-- STAFF TAB -->
    <div v-if="activeTab === 'staff'">
      <div class="flex gap-3 mb-4">
        <div class="search-input flex-1">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm nhân viên..." />
        </div>
        <el-select v-model="filterRole" placeholder="Tất cả vai trò" clearable style="width:160px">
          <el-option v-for="r in roles" :key="r.name" :label="r.name" :value="r.name" />
        </el-select>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="s in filteredStaff" :key="s.id"
             class="bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:shadow-md transition group">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0"
                 :style="{ background: s.avatarBg, color: s.avatarColor }">{{ s.initials }}</div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold" style="color:#1E2A3B">{{ s.name }}</div>
              <div class="text-xs text-muted mt-0.5">{{ s.email }}</div>
              <span class="badge mt-1.5" :class="`badge-${roleColor(s.role)}`">{{ s.role }}</span>
            </div>
            <el-dropdown trigger="click">
              <button class="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
                <el-icon><MoreFilled /></el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>✏️ Chỉnh sửa</el-dropdown-item>
                  <el-dropdown-item>🔑 Đổi mật khẩu</el-dropdown-item>
                  <el-dropdown-item>🔄 Đổi vai trò</el-dropdown-item>
                  <el-dropdown-item divided><span style="color:#EF4444">🚫 Vô hiệu hoá</span></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-[#FFF8F4] rounded-xl p-2">
              <div class="font-bold text-sm" style="color:#1E2A3B">{{ s.ordersHandled }}</div>
              <div class="text-xs text-muted">Đơn xử lý</div>
            </div>
            <div class="bg-[#FFF8F4] rounded-xl p-2">
              <div class="font-bold text-sm" style="color:#1E2A3B">{{ s.performance }}%</div>
              <div class="text-xs text-muted">Hiệu suất</div>
            </div>
            <div class="bg-[#FFF8F4] rounded-xl p-2">
              <div class="font-bold text-sm" :style="{ color: s.active ? '#22C55E' : '#EF4444' }">{{ s.active ? 'Làm việc' : 'Nghỉ phép' }}</div>
              <div class="text-xs text-muted">Trạng thái</div>
            </div>
          </div>
          <div class="mt-3 text-xs text-muted flex items-center gap-1.5">
            <span>📞 {{ s.phone }}</span>
            <span>·</span>
            <span>🗓 Từ {{ s.joinDate }}</span>
          </div>
        </div>

        <!-- Add new -->
        <div class="bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#E8634A] hover:bg-[#FFF8F4] transition min-h-[200px]"
             @click="showAddStaff = true">
          <div class="w-12 h-12 rounded-2xl bg-[#FFF0EC] flex items-center justify-center text-2xl">+</div>
          <div class="text-sm font-semibold" style="color:#E8634A">Thêm nhân viên</div>
        </div>
      </div>
    </div>

    <!-- ROLES TAB -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="role in roles" :key="role.name"
           class="data-card">
        <div class="data-card-header">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ role.icon }}</span>
            <div>
              <div class="font-display font-bold text-base" style="color:#1E2A3B">{{ role.name }}</div>
              <div class="text-xs text-muted">{{ staff.filter(s=>s.role===role.name).length }} nhân viên</div>
            </div>
          </div>
          <span class="badge" :class="`badge-${roleColor(role.name)}`">{{ role.level }}</span>
        </div>
        <div class="p-4">
          <div class="text-xs font-bold text-muted uppercase tracking-wider mb-3">Quyền hạn</div>
          <div class="flex flex-wrap gap-2">
            <span v-for="perm in role.permissions" :key="perm" class="text-xs px-2.5 py-1 rounded-lg font-medium" style="background:#FFF8F4;color:#E8634A;border:1px solid #FFE4D5">{{ perm }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD STAFF DIALOG -->
    <el-dialog v-model="showAddStaff" title="Thêm nhân viên mới" width="500px">
      <el-form :model="staffForm" label-position="top">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Họ và tên" required class="col-span-2">
            <el-input v-model="staffForm.name" placeholder="Nguyễn Văn A" />
          </el-form-item>
          <el-form-item label="Email" required>
            <el-input v-model="staffForm.email" placeholder="email@polycake.vn" />
          </el-form-item>
          <el-form-item label="Số điện thoại">
            <el-input v-model="staffForm.phone" placeholder="0901 234 567" />
          </el-form-item>
          <el-form-item label="Vai trò" required>
            <el-select v-model="staffForm.role" style="width:100%">
              <el-option v-for="r in roles" :key="r.name" :label="r.name" :value="r.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="Mật khẩu tạm thời">
            <el-input v-model="staffForm.password" type="password" placeholder="••••••" show-password />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="showAddStaff = false">Huỷ</el-button>
        <el-button type="primary" :style="{background:'#E8634A',borderColor:'#E8634A'}" @click="saveStaff">Thêm nhân viên</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, MoreFilled } from '@element-plus/icons-vue'

const activeTab = ref('staff'), search = ref(''), filterRole = ref('')
const showAddStaff = ref(false)
const staffForm = ref({ name:'', email:'', phone:'', role:'', password:'' })

const roles = [
  { name:'Super Admin',  icon:'👑', level:'Cấp 1', permissions:['Tất cả quyền','Quản lý hệ thống','Phân quyền','Báo cáo tài chính','Xoá dữ liệu'] },
  { name:'Quản lý',      icon:'💼', level:'Cấp 2', permissions:['Đơn hàng','Sản phẩm','Nhân viên','Kho','Báo cáo','Voucher'] },
  { name:'Thu ngân',     icon:'💰', level:'Cấp 3', permissions:['Xem đơn','Tạo đơn','Thanh toán','Xuất hoá đơn'] },
  { name:'Thợ làm bánh', icon:'👨‍🍳', level:'Cấp 3', permissions:['Xem đơn cần làm','Cập nhật tiến độ','Kho nguyên liệu'] },
  { name:'Giao hàng',    icon:'🚚', level:'Cấp 4', permissions:['Xem đơn cần giao','Xác nhận giao','Chụp ảnh giao hàng'] },
  { name:'Marketing',    icon:'📣', level:'Cấp 3', permissions:['Voucher','Khuyến mãi','Đánh giá','Tin nhắn KH'] },
]

const staff = ref([
  { id:1, name:'Trần Hương',   initials:'TH', email:'huong.tran@polycake.vn',  phone:'0901 111 222', role:'Super Admin',  avatarBg:'linear-gradient(135deg,#E8634A,#FBB830)', avatarColor:'#FFF', ordersHandled:142, performance:98, active:true,  joinDate:'03/2022' },
  { id:2, name:'Nguyễn Khoa',  initials:'NK', email:'khoa.ng@polycake.vn',      phone:'0912 222 333', role:'Quản lý',      avatarBg:'#EFF6FF',  avatarColor:'#3B82F6', ordersHandled:98,  performance:95, active:true,  joinDate:'06/2022' },
  { id:3, name:'Lê Minh Anh',  initials:'MA', email:'minhanh@polycake.vn',      phone:'0923 333 444', role:'Thợ làm bánh', avatarBg:'#F0FDF4',  avatarColor:'#22C55E', ordersHandled:210, performance:92, active:true,  joinDate:'01/2023' },
  { id:4, name:'Phạm Thu',     initials:'PT', email:'thu.pham@polycake.vn',     phone:'0934 444 555', role:'Thu ngân',     avatarBg:'#F5F3FF',  avatarColor:'#7C3AED', ordersHandled:78,  performance:90, active:true,  joinDate:'08/2023' },
  { id:5, name:'Bùi Hoàng Lan',initials:'HL', email:'lan.bui@polycake.vn',      phone:'0945 555 666', role:'Giao hàng',    avatarBg:'#FFFBEB',  avatarColor:'#F59E0B', ordersHandled:65,  performance:88, active:true,  joinDate:'10/2023' },
  { id:6, name:'Đặng Thảo',    initials:'DT', email:'thao.dang@polycake.vn',    phone:'0956 666 777', role:'Marketing',    avatarBg:'#FFF0F5',  avatarColor:'#EC4899', ordersHandled:0,   performance:85, active:false, joinDate:'02/2024' },
])

const filteredStaff = computed(() => {
  let r = staff.value
  if (search.value) r = r.filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
  if (filterRole.value) r = r.filter(s => s.role === filterRole.value)
  return r
})

const roleColor = (role) => {
  const m = {'Super Admin':'danger','Quản lý':'primary','Thu ngân':'success','Thợ làm bánh':'warning','Giao hàng':'info','Marketing':'purple'}
  return m[role] || 'gray'
}

function saveStaff() {
  if (!staffForm.value.name || !staffForm.value.role) return ElMessage.warning('Vui lòng điền đầy đủ thông tin')
  const name = staffForm.value.name
  staff.value.push({ ...staffForm.value, id: Date.now(), initials: name.split(' ').map(w=>w[0]).join('').slice(-2).toUpperCase(), avatarBg:'#FFF0EC', avatarColor:'#E8634A', ordersHandled:0, performance:0, active:true, joinDate: new Date().toLocaleDateString('vi-VN', { month:'2-digit', year:'numeric' }) })
  showAddStaff.value = false
  staffForm.value = { name:'', email:'', phone:'', role:'', password:'' }
  ElMessage.success('Đã thêm nhân viên thành công!')
}
</script>