<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#1E2A3B">Quản lý đơn hàng</h1>
        <p class="text-sm text-muted mt-0.5">Theo dõi và xử lý {{ orders.length }} đơn hàng</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" @click="exportExcel">
          <el-icon><Download /></el-icon> Xuất Excel
        </button>
        <button class="btn-primary" @click="showAddOrder = true">
          <el-icon><Plus /></el-icon> Đơn mới
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div v-for="s in orderStats" :key="s.label"
           class="bg-white rounded-2xl p-4 border border-[var(--color-border)] flex items-center gap-3">
        <span class="text-2xl">{{ s.icon }}</span>
        <div>
          <div class="font-display font-black text-xl" style="color:#1E2A3B">{{ s.count }}</div>
          <div class="text-xs text-muted">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="data-card mb-4">
      <div class="p-4 flex flex-wrap gap-3 items-center">
        <div class="search-input flex-1" style="min-width:220px">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm theo mã đơn, khách hàng, sản phẩm..." />
        </div>
        <el-select v-model="filterStatus" placeholder="Tất cả trạng thái" clearable style="width:180px;--el-input-border-radius:12px">
          <el-option label="Tất cả" value="" />
          <el-option label="Chờ xác nhận" value="pending" />
          <el-option label="Đang sản xuất" value="production" />
          <el-option label="Hoàn thành" value="done" />
          <el-option label="Đã giao" value="delivered" />
          <el-option label="Huỷ" value="cancelled" />
        </el-select>
        <el-date-picker v-model="filterDate" type="daterange" range-separator="→" start-placeholder="Từ ngày" end-placeholder="Đến ngày" style="width:260px" />
        <el-select v-model="sortBy" style="width:160px;--el-input-border-radius:12px">
          <el-option label="Mới nhất" value="newest" />
          <el-option label="Giá trị cao" value="highest" />
          <el-option label="Sắp giao" value="deadline" />
        </el-select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="data-card">
      <el-table
        :data="filteredOrders"
        style="width:100%"
        row-class-name="cursor-pointer"
        @row-click="openDetail"
        v-loading="tableLoading"
      >
        <el-table-column type="selection" width="48" />

        <el-table-column label="MÃ ĐƠN" width="110">
          <template #default="{ row }">
            <span class="font-bold text-sm" style="color:#E8634A">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="KHÁCH HÀNG" min-width="160">
          <template #default="{ row }">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                   :style="{ background: row.avatarBg, color: row.avatarColor }">{{ row.initials }}</div>
              <div>
                <div class="text-sm font-semibold" style="color:#1E2A3B">{{ row.customer }}</div>
                <div class="text-xs text-muted">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="SẢN PHẨM" min-width="180">
          <template #default="{ row }">
            <div class="text-sm font-medium" style="color:#1E2A3B">{{ row.product }}</div>
            <div class="text-xs text-muted">{{ row.variant }}</div>
          </template>
        </el-table-column>

        <el-table-column label="NGÀY NHẬN" width="120">
          <template #default="{ row }">
            <div class="text-sm" style="color:#1E2A3B">{{ row.deliveryDate }}</div>
            <div class="text-xs text-muted">{{ row.deliveryTime }}</div>
          </template>
        </el-table-column>

        <el-table-column label="GIÁ TRỊ" width="130">
          <template #default="{ row }">
            <div class="text-sm font-bold" style="color:#1E2A3B">{{ row.total }}</div>
            <div class="text-xs text-muted">{{ row.deposit ? 'Đặt cọc: ' + row.deposit : '' }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="TRẠNG THÁI" width="140" align="center">
          <template #default="{ row }">
            <span class="badge" :class="`badge-${statusColor(row.status)}`">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="ƯU TIÊN" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.urgent" type="danger" size="small" round>Khẩn</el-tag>
            <span v-else class="text-xs text-muted">Thường</span>
          </template>
        </el-table-column>

        <el-table-column label="" width="80" align="center">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="cmd => handleRowAction(cmd, row)" @click.stop>
              <button class="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition">
                <el-icon><MoreFilled /></el-icon>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">👁 Xem chi tiết</el-dropdown-item>
                  <el-dropdown-item command="edit">✏️ Chỉnh sửa</el-dropdown-item>
                  <el-dropdown-item command="status">🔄 Đổi trạng thái</el-dropdown-item>
                  <el-dropdown-item command="print">🖨️ In đơn</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <span style="color:#EF4444">🗑 Xoá đơn</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <span class="text-sm text-muted">Hiển thị {{ filteredOrders.length }} / {{ orders.length }} đơn hàng</span>
        <el-pagination
          v-model:current-page="page"
          :page-size="10"
          :total="orders.length"
          layout="prev, pager, next"
          background
        />
      </div>
    </div>

    <!-- ===== ORDER DETAIL DIALOG ===== -->
    <el-dialog v-model="showDetail" :title="`Chi tiết đơn hàng ${selectedOrder?.id}`" width="660px">
      <div v-if="selectedOrder">
        <!-- Status Steps -->
        <el-steps :active="statusStep(selectedOrder.status)" align-center class="mb-6">
          <el-step title="Tiếp nhận" icon="DocumentChecked" />
          <el-step title="Sản xuất" icon="Tools" />
          <el-step title="Hoàn thành" icon="SuccessFilled" />
          <el-step title="Đã giao" icon="Van" />
        </el-steps>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-[#FFF8F4] rounded-2xl p-4">
            <div class="text-xs font-bold text-muted uppercase tracking-wider mb-3">Khách hàng</div>
            <div class="font-semibold" style="color:#1E2A3B">{{ selectedOrder.customer }}</div>
            <div class="text-sm text-muted mt-1">📞 {{ selectedOrder.phone }}</div>
            <div class="text-sm text-muted mt-0.5">📍 {{ selectedOrder.address }}</div>
          </div>
          <div class="bg-[#FFF8F4] rounded-2xl p-4">
            <div class="text-xs font-bold text-muted uppercase tracking-wider mb-3">Thông tin đơn</div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-muted">Sản phẩm</span>
              <span class="font-semibold" style="color:#1E2A3B">{{ selectedOrder.product }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-muted">Ngày nhận</span>
              <span class="font-semibold" style="color:#1E2A3B">{{ selectedOrder.deliveryDate }} {{ selectedOrder.deliveryTime }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted">Tổng tiền</span>
              <span class="font-bold text-base" style="color:#E8634A">{{ selectedOrder.total }}</span>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100" v-if="selectedOrder.note">
          <div class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">📝 Ghi chú đặc biệt</div>
          <div class="text-sm text-amber-800">{{ selectedOrder.note }}</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <el-button @click="showDetail = false">Đóng</el-button>
          <div class="flex gap-2">
            <el-button type="warning" plain>🖨️ In đơn</el-button>
            <el-button type="primary" :style="{ background: '#E8634A', borderColor: '#E8634A' }">
              ✏️ Chỉnh sửa
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- ===== ADD ORDER DIALOG ===== -->
    <el-dialog v-model="showAddOrder" title="Tạo đơn hàng mới" width="600px">
      <el-form :model="newOrder" label-position="top">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tên khách hàng" required>
            <el-input v-model="newOrder.customer" placeholder="Nguyễn Văn A" />
          </el-form-item>
          <el-form-item label="Số điện thoại" required>
            <el-input v-model="newOrder.phone" placeholder="0901 234 567" />
          </el-form-item>
        </div>
        <el-form-item label="Sản phẩm" required>
          <el-select v-model="newOrder.product" placeholder="Chọn sản phẩm" style="width:100%">
            <el-option v-for="p in productList" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Ngày nhận hàng" required>
            <el-date-picker v-model="newOrder.deliveryDate" type="date" placeholder="Chọn ngày" style="width:100%" />
          </el-form-item>
          <el-form-item label="Giờ nhận">
            <el-time-picker v-model="newOrder.deliveryTime" format="HH:mm" placeholder="Chọn giờ" style="width:100%" />
          </el-form-item>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Tổng tiền (đ)" required>
            <el-input v-model="newOrder.total" placeholder="1,000,000" />
          </el-form-item>
          <el-form-item label="Đặt cọc (đ)">
            <el-input v-model="newOrder.deposit" placeholder="500,000" />
          </el-form-item>
        </div>
        <el-form-item label="Địa chỉ giao hàng">
          <el-input v-model="newOrder.address" placeholder="Số nhà, đường, phường, quận..." />
        </el-form-item>
        <el-form-item label="Ghi chú đặc biệt">
          <el-input v-model="newOrder.note" type="textarea" :rows="3" placeholder="Yêu cầu về màu sắc, chữ trên bánh, dị ứng thực phẩm..." />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="newOrder.urgent" label="⚡ Đơn hàng khẩn cấp" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddOrder = false">Huỷ</el-button>
        <el-button type="primary" :style="{ background:'#E8634A', borderColor:'#E8634A' }" @click="saveOrder">
          Tạo đơn hàng
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Download, MoreFilled } from '@element-plus/icons-vue'

const search = ref(''), filterStatus = ref(''), filterDate = ref(null), sortBy = ref('newest')
const page = ref(1), tableLoading = ref(false)
const showDetail = ref(false), showAddOrder = ref(false)
const selectedOrder = ref(null)

const newOrder = ref({ customer:'', phone:'', product:'', deliveryDate:null, deliveryTime:null, total:'', deposit:'', address:'', note:'', urgent:false })

const productList = ['Bánh sinh nhật 3D','Bánh cưới nhiều tầng','Cupcake set 12','Macaron hộp 24','Bánh mousse','Bánh tiramisu','Bánh crepe','Bánh su kem']

const orders = ref([
  { id:'#DH2045', customer:'Nguyễn Khoa',  initials:'NK', avatarBg:'#FFF0EC', avatarColor:'#E8634A', phone:'0901 234 567', product:'Bánh 3D Custom – Mèo Shiba', variant:'Fondant, 20cm', deliveryDate:'08/06', deliveryTime:'14:00', total:'2,500,000đ', deposit:'1,000,000đ', status:'Đang sản xuất', statusKey:'production', urgent:true,  address:'123 Nguyễn Huệ, Q1', note:'Chữ: Happy Birthday Bé Cam' },
  { id:'#DH2044', customer:'Trần Hương',   initials:'TH', avatarBg:'#F0FDF4', avatarColor:'#22C55E', phone:'0912 345 678', product:'Bánh sinh nhật 3 tầng',        variant:'Kem tươi, 25cm', deliveryDate:'08/06', deliveryTime:'15:30', total:'1,800,000đ', deposit:'500,000đ',   status:'Hoàn thành',    statusKey:'done',       urgent:false, address:'45 Lê Lợi, Q1', note:'' },
  { id:'#DH2043', customer:'Lê Minh',      initials:'LM', avatarBg:'#EFF6FF', avatarColor:'#3B82F6', phone:'0923 456 789', product:'Bánh cưới kem tươi',            variant:'5 tầng, fondant', deliveryDate:'09/06', deliveryTime:'10:00', total:'4,200,000đ', deposit:'2,000,000đ', status:'Chờ nhận',      statusKey:'pending',    urgent:false, address:'78 Trần Hưng Đạo, Q5', note:'Màu hồng pastel, hoa cưới' },
  { id:'#DH2042', customer:'Phạm Thu',     initials:'PT', avatarBg:'#F5F3FF', avatarColor:'#7C3AED', phone:'0934 567 890', product:'Cupcake set 12 cái',            variant:'Kem bơ mix',     deliveryDate:'08/06', deliveryTime:'16:00', total:'350,000đ',   deposit:'150,000đ',   status:'Đang sản xuất', statusKey:'production', urgent:false, address:'22 Nguyễn Trãi, Q5', note:'6 vị socola, 6 vị vani' },
  { id:'#DH2041', customer:'Bùi Lan',      initials:'BL', avatarBg:'#FFFBEB', avatarColor:'#F59E0B', phone:'0945 678 901', product:'Bánh mousse chanh leo',         variant:'Khuôn tròn 18cm', deliveryDate:'07/06', deliveryTime:'09:00', total:'520,000đ',   deposit:'200,000đ',   status:'Đã giao',       statusKey:'delivered',  urgent:false, address:'30 Nguyễn Du, Q1',   note:'' },
  { id:'#DH2040', customer:'Cao Tú',       initials:'CT', avatarBg:'#FFF0EC', avatarColor:'#E8634A', phone:'0956 789 012', product:'Macaron hỗn hợp hộp 24',       variant:'12 hương vị',    deliveryDate:'07/06', deliveryTime:'14:00', total:'480,000đ',   deposit:'200,000đ',   status:'Đã giao',       statusKey:'delivered',  urgent:false, address:'55 Cách Mạng Tháng 8, Q3', note:'' },
  { id:'#DH2039', customer:'Vũ Hà',        initials:'VH', avatarBg:'#F0FDF4', avatarColor:'#22C55E', phone:'0967 890 123', product:'Bánh tiramisu',                 variant:'Khay 30x20cm',   deliveryDate:'10/06', deliveryTime:'11:00', total:'380,000đ',   deposit:'0',          status:'Chờ xác nhận',  statusKey:'new',        urgent:false, address:'18 Hoàng Diệu, Q4',  note:'Thêm cà phê mạnh hơn' },
  { id:'#DH2038', customer:'Đỗ Hải',       initials:'DH', avatarBg:'#FFF4F1', avatarColor:'#E8634A', phone:'0978 901 234', product:'Bánh crepe 20 lớp',            variant:'Kem trứng, dâu',  deliveryDate:'06/06', deliveryTime:'10:00', total:'290,000đ',   deposit:'0',          status:'Đã huỷ',        statusKey:'cancelled',  urgent:false, address:'', note:'' },
])

const orderStats = computed(() => [
  { icon:'📬', count: orders.value.filter(o=>o.statusKey==='new').length,        label:'Chờ xác nhận' },
  { icon:'⚙️', count: orders.value.filter(o=>o.statusKey==='production').length,  label:'Đang sản xuất' },
  { icon:'✅', count: orders.value.filter(o=>o.statusKey==='done').length,        label:'Hoàn thành' },
  { icon:'🚚', count: orders.value.filter(o=>o.statusKey==='delivered').length,   label:'Đã giao' },
])

const filteredOrders = computed(() => {
  let result = orders.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q))
  }
  if (filterStatus.value) {
    const map = { pending:'Chờ nhận', production:'Đang sản xuất', done:'Hoàn thành', delivered:'Đã giao', cancelled:'Đã huỷ' }
    result = result.filter(o => o.status === map[filterStatus.value])
  }
  return result
})

const statusColor = (s) => {
  const m = { 'Chờ xác nhận':'info','Chờ nhận':'info','Đang sản xuất':'warning','Hoàn thành':'success','Đã giao':'primary','Đã huỷ':'danger' }
  return m[s] || 'gray'
}

const statusStep = (s) => {
  const m = { 'Chờ xác nhận':0,'Chờ nhận':0,'Đang sản xuất':1,'Hoàn thành':2,'Đã giao':3 }
  return m[s] ?? 0
}

function openDetail(row) { selectedOrder.value = row; showDetail.value = true }

function handleRowAction(cmd, row) {
  if (cmd === 'view') openDetail(row)
  else if (cmd === 'delete') {
    ElMessageBox.confirm(`Xoá đơn ${row.id}?`, 'Xác nhận', { type:'warning' })
      .then(() => { orders.value = orders.value.filter(o => o.id !== row.id); ElMessage.success('Đã xoá đơn hàng') })
      .catch(() => {})
  } else ElMessage.info('Tính năng đang phát triển')
}

function saveOrder() {
  if (!newOrder.value.customer || !newOrder.value.product) return ElMessage.warning('Vui lòng điền đầy đủ thông tin')
  const id = '#DH' + (2046 + Math.floor(Math.random() * 100))
  orders.value.unshift({ ...newOrder.value, id, initials: newOrder.value.customer.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(), avatarBg:'#FFF0EC', avatarColor:'#E8634A', statusKey:'new', status:'Chờ xác nhận' })
  showAddOrder.value = false
  newOrder.value = { customer:'', phone:'', product:'', deliveryDate:null, deliveryTime:null, total:'', deposit:'', address:'', note:'', urgent:false }
  ElMessage.success('Tạo đơn hàng thành công! 🎉')
}

function exportExcel() { ElMessage.info('Đang xuất file...') }
</script>