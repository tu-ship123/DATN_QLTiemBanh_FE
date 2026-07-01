<template>
  <div class="p-6 bg-[#FFFBF5] min-h-screen flex flex-col gap-5">

    <!-- HEADER -->
    <div class="flex flex-wrap justify-between items-end gap-4 shrink-0">
      <div>
        <h1 class="text-2xl font-black text-[#5C4428] font-display">Quản lý Đơn Hàng</h1>
        <p class="text-sm text-slate-500 mt-1">Xem, xử lý và cập nhật trạng thái đơn hàng</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="viewMode = 'table'"
          :class="viewMode === 'table' ? 'bg-[#7A5C3A] text-white shadow-md shadow-[#7A5C3A]/30' : 'bg-white text-slate-500 border border-slate-200'"
          class="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
        >
          <el-icon><List /></el-icon> Danh sách
        </button>
        <button
          @click="viewMode = 'kanban'"
          :class="viewMode === 'kanban' ? 'bg-[#7A5C3A] text-white shadow-md shadow-[#7A5C3A]/30' : 'bg-white text-slate-500 border border-slate-200'"
          class="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
        >
          <el-icon><Grid /></el-icon> Kanban
        </button>
        <button @click="fetchOrders" class="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-500 border border-slate-200 hover:border-[#7A5C3A]/50 hover:text-[#7A5C3A] flex items-center gap-2 transition-all">
          <el-icon :class="loading ? 'animate-spin' : ''"><Refresh /></el-icon> Làm mới
        </button>
      </div>
    </div>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
      <div v-for="s in statusStats" :key="s.key"
        @click="filterStatus = filterStatus === s.key ? '' : s.key; fetchOrders()"
        :class="filterStatus === s.key ? 'border-[#7A5C3A] shadow-md shadow-[#7A5C3A]/10' : 'border-[#EDE0CC]'"
        class="bg-white rounded-2xl p-4 border cursor-pointer hover:border-[#7A5C3A]/50 transition-all group"
      >
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xl text-[#7A5C3A]"><iconify-icon :icon="s.icon"></iconify-icon></span>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ s.label }}</span>
        </div>
        <div class="text-2xl font-black text-[#5C4428]">{{ s.count }}</div>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="bg-white rounded-2xl border border-[#EDE0CC] p-4 flex flex-wrap gap-3 items-center shrink-0">
      <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] focus-within:border-[#7A5C3A] transition-all">
        <el-icon class="text-slate-400"><Search /></el-icon>
        <input
          v-model="searchText"
          @input="onSearch"
          type="text"
          placeholder="Tìm mã đơn, khách hàng, email..."
          class="bg-transparent border-none outline-none w-full text-sm text-[#5C4428] placeholder-slate-400"
        />
      </div>
      <el-select v-model="filterStatus" @change="fetchOrders" placeholder="Tất cả trạng thái" clearable style="width:180px">
        <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
      </el-select>
      <el-select v-model="filterNguon" @change="fetchOrders" placeholder="Nguồn đơn" clearable style="width:140px">
        <el-option label="Online" value="ONLINE" />
        <el-option label="POS" value="POS" />
      </el-select>
      <el-date-picker
        v-model="filterDateRange"
        @change="fetchOrders"
        type="daterange"
        range-separator="→"
        start-placeholder="Từ ngày"
        end-placeholder="Đến ngày"
        style="width:260px"
        value-format="YYYY-MM-DDTHH:mm:ss"
      />
    </div>

    <!-- TABLE VIEW -->
    <div v-if="viewMode === 'table'" class="bg-white rounded-2xl border border-[#EDE0CC] overflow-hidden flex-1">
      <el-table
        :data="filteredOrders"
        v-loading="loading"
        style="width:100%"
        row-class-name="cursor-pointer hover:bg-[#FFFBF5]"
        @row-click="openDetail"
        empty-text="Chưa có đơn hàng nào"
      >
        <el-table-column label="MÃ ĐƠN" width="110">
          <template #default="{ row }">
            <span class="text-sm font-black text-[#7A5C3A]">HD-{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="KHÁCH HÀNG" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-2.5 py-1">
              <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7A5C3A] to-[#FBB830] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {{ getInitials(row.emailNguoiDung) }}
              </div>
              <div>
                <div class="text-sm font-semibold text-[#5C4428]">{{ row.emailNguoiDung }}</div>
                <div class="text-xs text-slate-400">{{ formatCurrency(row.tongTien) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="SẢN PHẨM" min-width="180">
          <template #default="{ row }">
            <div v-if="row.items && row.items.length > 0">
              <div class="text-sm font-medium text-[#5C4428] truncate max-w-[160px]">{{ row.items[0].tenSanPham }}</div>
              <div class="text-xs text-slate-400" v-if="row.items.length > 1">+{{ row.items.length - 1 }} sản phẩm khác</div>
            </div>
            <span v-else class="text-xs text-slate-400">—</span>
          </template>
        </el-table-column>

        <el-table-column label="NGUỒN" width="90" align="center">
          <template #default="{ row }">
            <span :class="row.nguonDon === 'POS' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
              class="text-xs font-bold px-2 py-1 rounded-lg">
              {{ row.nguonDon || 'ONLINE' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="NGÀY GIAO" width="130">
          <template #default="{ row }">
            <div class="text-sm text-[#5C4428]">{{ formatDate(row.ngayGiaoHang) }}</div>
          </template>
        </el-table-column>

        <el-table-column label="TRẠNG THÁI" width="155" align="center">
          <template #default="{ row }">
            <span class="text-xs font-bold px-2.5 py-1.5 rounded-xl" :class="getStatusClass(row.trangThai)">
              {{ getStatusLabel(row.trangThai) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="" width="120" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-1" @click.stop>
              <button
                @click.stop="openDetail(row)"
                class="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#FDF6EC] hover:text-[#7A5C3A] text-slate-400 flex items-center justify-center transition-colors"
                title="Xem chi tiết"
              >
                <el-icon><View /></el-icon>
              </button>
              <el-dropdown trigger="click" @command="cmd => handleAction(cmd, row)">
                <button class="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors">
                  <el-icon><MoreFilled /></el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="DA_XAC_NHAN"><iconify-icon icon="ph:check-circle-duotone" class="mr-1" /> Xác nhận đơn</el-dropdown-item>
                    <el-dropdown-item command="DANG_LAM"><iconify-icon icon="ph:wrench-duotone" class="mr-1" /> Đang sản xuất</el-dropdown-item>
                    <el-dropdown-item command="SAN_SANG"><iconify-icon icon="ph:package-duotone" class="mr-1" /> Sẵn sàng giao</el-dropdown-item>
                    <el-dropdown-item command="DANG_GIAO"><iconify-icon icon="ph:motorcycle-duotone" class="mr-1" /> Đang giao hàng</el-dropdown-item>
                    <el-dropdown-item command="HOAN_THANH"><iconify-icon icon="ph:check-fat-duotone" class="mr-1" /> Hoàn thành</el-dropdown-item>
                    <el-dropdown-item command="print-production"><iconify-icon icon="ph:factory-duotone" class="mr-1" /> In phiếu xuất xưởng</el-dropdown-item>
                    <el-dropdown-item command="DA_HUY" divided>
                      <span class="text-red-500 flex items-center gap-1"><iconify-icon icon="ph:x-circle-duotone" /> Hủy đơn</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="px-4 py-3 border-t border-[#EDE0CC] flex items-center justify-between">
        <span class="text-sm text-slate-400">{{ filteredOrders.length }} đơn hàng</span>
      </div>
    </div>

    <!-- KANBAN VIEW -->
    <div v-if="viewMode === 'kanban'" class="flex gap-5 overflow-x-auto pb-4 flex-1 custom-scrollbar items-start">
      <div
        v-for="col in kanbanColumns"
        :key="col.id"
        class="flex-shrink-0 w-[320px] flex flex-col max-h-[calc(100vh-260px)]"
      >
        <div class="flex justify-between items-center mb-3 px-1 shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-base text-[#7A5C3A]"><iconify-icon :icon="col.icon"></iconify-icon></span>
            <h3 class="font-bold text-[#5C4428] text-[14px] uppercase tracking-wide">{{ col.title }}</h3>
            <span class="bg-[#7A5C3A] text-white text-[11px] font-black px-2 py-0.5 rounded-full">
              {{ getKanbanCards(col.id).length }}
            </span>
          </div>
        </div>

        <div class="bg-slate-100/50 border border-[#EDE0CC] rounded-2xl p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          <template v-if="getKanbanCards(col.id).length > 0">
            <div
              v-for="order in getKanbanCards(col.id)"
              :key="order.id"
              @click="openDetail(order)"
              class="bg-white border border-[#EDE0CC] p-4 rounded-xl shadow-sm cursor-pointer hover:border-[#7A5C3A]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div class="flex justify-between items-start mb-2.5">
                <span class="text-xs font-black text-[#7A5C3A] bg-[#FDF6EC] px-2 py-1 rounded-md">HD-{{ order.id }}</span>
                <span class="text-[10px] font-bold px-2 py-1 rounded-lg" :class="order.nguonDon === 'POS' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'">
                  {{ order.nguonDon || 'ONLINE' }}
                </span>
              </div>
              <div class="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <el-icon><User /></el-icon>
                <span class="truncate">{{ order.emailNguoiDung }}</span>
              </div>
              <div v-if="order.items && order.items.length > 0" class="text-sm font-semibold text-[#5C4428] mb-2 truncate">
                {{ order.items[0].tenSanPham }}
              </div>
              <div class="pt-2.5 border-t border-slate-100 flex justify-between items-center">
                <span class="text-xs font-bold text-[#7A5C3A]">{{ formatCurrency(order.tongTien) }}</span>
                <div class="flex gap-1">
                  <button
                    v-if="getNextStatus(col.id)"
                    @click.stop="quickUpdateStatus(order, getNextStatus(col.id))"
                    class="text-xs bg-[#7A5C3A] text-white px-2 py-1 rounded-lg hover:bg-[#d4543c] transition-colors font-semibold"
                    :title="'Chuyển sang: ' + getStatusLabel(getNextStatus(col.id))"
                  >
                    → Tiếp
                  </button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[120px]">
            <el-icon class="text-3xl mb-2"><Box /></el-icon>
            <p class="text-xs font-medium">Chưa có đơn hàng</p>
          </div>
        </div>
      </div>
    </div>

    <!-- DETAIL DIALOG -->
    <el-dialog v-model="showDetail" :title="`Chi tiết đơn hàng HD-${selectedOrder?.id}`" width="620px" class="rounded-2xl" destroy-on-close>
      <div v-if="selectedOrder" class="space-y-4">
        <!-- Stepper trạng thái -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <el-steps :active="getStatusStep(selectedOrder.trangThai)" align-center size="small" finish-status="success">
            <el-step title="Tiếp nhận" />
            <el-step title="Xác nhận" />
            <el-step title="Sản xuất" />
            <el-step title="Sẵn sàng" />
            <el-step title="Đang giao" />
            <el-step title="Hoàn thành" />
          </el-steps>
        </div>

        <!-- Info 2 cột -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-[#FFFBF5] rounded-2xl p-4 border border-[#EDE0CC]">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin đơn</p>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-slate-500">Mã đơn</span><span class="font-bold text-[#7A5C3A]">HD-{{ selectedOrder.id }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Nguồn đơn</span><span class="font-semibold">{{ selectedOrder.nguonDon || 'ONLINE' }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Tổng tiền</span><span class="font-bold text-[#5C4428]">{{ formatCurrency(selectedOrder.tongTien) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Ngày tạo</span><span>{{ formatDate(selectedOrder.ngayTao) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Ngày giao</span><span>{{ formatDate(selectedOrder.ngayGiaoHang) }}</span></div>
            </div>
          </div>
          <div class="bg-[#FFFBF5] rounded-2xl p-4 border border-[#EDE0CC]">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Khách hàng</p>
            <div class="space-y-2 text-sm">
              <div class="font-semibold text-[#5C4428]">{{ selectedOrder.emailNguoiDung }}</div>
              <div class="text-slate-500">{{ selectedOrder.diaChiGiaoHang || '—' }}</div>
              <div v-if="selectedOrder.tenNhanVienPhuTrach" class="mt-2 pt-2 border-t border-slate-200">
                <span class="text-xs text-slate-400">Nhân viên:</span>
                <span class="font-semibold ml-1">{{ selectedOrder.tenNhanVienPhuTrach }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ghi chú -->
        <div v-if="selectedOrder.ghiChu" class="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <p class="text-xs font-bold text-amber-600 uppercase mb-2 flex items-center gap-1"><el-icon><Warning /></el-icon> Ghi chú đặc biệt</p>
          <p class="text-sm text-amber-900">{{ selectedOrder.ghiChu }}</p>
        </div>

        <!-- Lý do hủy -->
        <div v-if="selectedOrder.lyDoHuy" class="bg-red-50 p-4 rounded-xl border border-red-100">
          <p class="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-1">
            <iconify-icon icon="ph:x-circle-duotone" /> Lý do hủy
          </p>
          <p class="text-sm text-red-800">{{ selectedOrder.lyDoHuy }}</p>
        </div>

        <!-- Danh sách sản phẩm -->
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sản phẩm đặt</p>
          <div class="space-y-2">
            <div v-for="item in selectedOrder.items" :key="item.sanPhamId"
              class="flex justify-between items-center bg-white border border-[#EDE0CC] rounded-xl px-4 py-3">
              <div>
                <div class="text-sm font-semibold text-[#5C4428]">{{ item.tenSanPham }}</div>
                <div class="text-xs text-slate-400">x{{ item.soLuong }}</div>
              </div>
              <span class="font-bold text-[#7A5C3A] text-sm">{{ formatCurrency(item.giaBan * item.soLuong) }}</span>
            </div>
          </div>
        </div>

        <!-- Cập nhật trạng thái -->
        <div class="bg-white rounded-2xl border border-[#EDE0CC] p-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cập nhật trạng thái</p>
          <div class="flex gap-2 flex-wrap">
            <el-select v-model="newStatus" placeholder="Chọn trạng thái mới" style="flex:1; min-width:180px">
              <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
            </el-select>
            <el-input v-if="newStatus === 'DA_HUY'" v-model="cancelReason" placeholder="Nhập lý do hủy..." style="flex:1; min-width:180px" />
            <button
              @click="submitStatusUpdate"
              :disabled="!newStatus || updating"
              class="px-5 py-2 bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white rounded-xl font-bold text-sm shadow-md shadow-[#7A5C3A]/30 hover:shadow-[#7A5C3A]/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="updating"><el-icon class="animate-spin"><Refresh /></el-icon></span>
              <span v-else>Cập nhật</span>
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showDetail = false" class="rounded-xl">Đóng</el-button>
      </template>
    </el-dialog>

    <!-- ── DIALOG: IN PHIẾU XUẤT XƯỞNG ──────────────────────────────────────── -->
    <el-dialog v-model="showPrintProduction" title="Phiếu xuất xưởng" width="560px">
      <div v-if="printLoading" class="flex justify-center py-10">
        <div class="w-8 h-8 border-4 border-[#7A5C3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="printData" id="print-production-area" class="text-sm text-slate-700 font-sans p-2">
        <div class="text-center mb-5">
          <div class="text-lg font-black text-[#7A5C3A] brand-print" style="font-family:'Great Vibes',cursive;font-size:1.5rem;">Chocopine</div>
          <div class="text-xs text-slate-400 mt-0.5 font-bold tracking-wider">PHIẾU XUẤT XƯỞNG / SẢN XUẤT</div>
          <div class="text-xl font-black text-[#5C4428] mt-1">{{ printData.maDonHang }}</div>
          <div class="text-base text-red-600 font-bold mt-2 bg-red-50 p-2 rounded inline-block" v-if="printData.ngayGiaoHang">NGÀY GIAO: {{ printData.ngayGiaoHang }}</div>
        </div>

        <hr class="border-dashed border-slate-300 mb-4" />

        <div class="mb-4">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin liên hệ (Tuỳ chọn)</div>
          <div class="grid grid-cols-2 gap-1 text-sm">
            <span class="text-slate-500">Khách hàng:</span>       <span class="font-medium">{{ printData.tenKhachHang }}</span>
            <span class="text-slate-500">Điện thoại:</span>       <span class="font-medium">{{ printData.sdtKhachHang || '—' }}</span>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sản phẩm cần làm</div>
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-300 text-xs text-slate-500 uppercase">
                <th class="text-left pb-2 pt-1">Tên sản phẩm</th>
                <th class="text-center pb-2 pt-1 w-24">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in printData.items" :key="item.tenSanPham"
                class="border-b border-slate-200">
                <td class="py-3 font-bold text-[#5C4428] text-base">{{ item.tenSanPham }}</td>
                <td class="py-3 text-center font-black text-lg">{{ item.soLuong }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="printData.ghiChu" class="mt-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          <div class="text-sm font-black text-amber-800 mb-2 flex items-center gap-1 uppercase">
            <iconify-icon icon="ph:warning-circle-duotone" class="text-lg" /> LƯU Ý ĐẶC BIỆT
          </div>
          <div class="text-amber-900 whitespace-pre-line font-bold text-base">{{ printData.ghiChu }}</div>
        </div>

        <div v-if="printData.tenNhanVien" class="mt-6 text-xs text-slate-400 text-right italic">
          Người in: {{ printData.tenNhanVien }} - {{ new Date().toLocaleString('vi-VN') }}
        </div>
      </div>
      <template #footer>
        <el-button @click="showPrintProduction = false">Đóng</el-button>
        <el-button type="primary" :style="{ background:'#7A5C3A', borderColor:'#7A5C3A' }"
          @click="triggerBrowserPrintProduction">
          <iconify-icon icon="ph:printer-duotone" class="mr-1"></iconify-icon> In phiếu xuất xưởng
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { List, Grid, Refresh, Search, View, MoreFilled, User, Warning, Box } from '@element-plus/icons-vue'
import apiClient from '@/services/apiService'

// ─── STATE ───────────────────────────────────────────────────────────────────
const viewMode    = ref('table')
const loading     = ref(false)
const updating    = ref(false)
const orders      = ref([])
const searchText  = ref('')
const filterStatus = ref('')
const filterNguon  = ref('')
const filterDateRange = ref(null)
const showDetail  = ref(false)
const selectedOrder = ref(null)
const newStatus   = ref('')
const cancelReason = ref('')
const showPrintProduction = ref(false)
const printData = ref(null)
const printLoading = ref(false)
let searchTimer   = null

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const statusOptions = [
  { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
  { value: 'DA_XAC_NHAN',  label: 'Đã xác nhận' },
  { value: 'DANG_LAM',     label: 'Đang sản xuất' },
  { value: 'SAN_SANG',     label: 'Sẵn sàng giao' },
  { value: 'DANG_GIAO',    label: 'Đang giao hàng' },
  { value: 'HOAN_THANH',   label: 'Hoàn thành' },
  { value: 'DA_HUY',       label: 'Đã hủy' },
]

const statusFlow = ['CHO_XAC_NHAN','DA_XAC_NHAN','DANG_LAM','SAN_SANG','DANG_GIAO','HOAN_THANH']

const kanbanColumns = [
  { id: 'CHO_XAC_NHAN', title: 'Chờ xác nhận', icon: 'ph:clock-countdown-duotone' },
  { id: 'DA_XAC_NHAN',  title: 'Đã xác nhận',  icon: 'ph:seal-check-duotone' },
  { id: 'DANG_LAM',     title: 'Đang sản xuất', icon: 'ph:wrench-duotone' },
  { id: 'SAN_SANG',     title: 'Sẵn sàng giao', icon: 'ph:package-duotone' },
  { id: 'DANG_GIAO',    title: 'Đang giao',      icon: 'ph:motorcycle-duotone' },
  { id: 'HOAN_THANH',   title: 'Hoàn thành',     icon: 'ph:check-circle-duotone' },
]

// ─── COMPUTED ────────────────────────────────────────────────────────────────
const filteredOrders = computed(() => {
  if (!searchText.value) return orders.value
  const q = searchText.value.toLowerCase()
  return orders.value.filter(o =>
    String(o.id).includes(q) ||
    (o.emailNguoiDung || '').toLowerCase().includes(q) ||
    (o.items || []).some(i => (i.tenSanPham || '').toLowerCase().includes(q))
  )
})

const statusStats = computed(() => {
  const all = orders.value
  return [
    { key: '', icon: 'ph:list-bullets-duotone', label: 'Tất cả',      count: all.length },
    { key: 'CHO_XAC_NHAN', icon: 'ph:clock-countdown-duotone', label: 'Chờ xử lý',  count: all.filter(o => o.trangThai === 'CHO_XAC_NHAN').length },
    { key: 'DANG_LAM',     icon: 'ph:wrench-duotone', label: 'Đang làm',   count: all.filter(o => o.trangThai === 'DANG_LAM').length },
    { key: 'SAN_SANG',     icon: 'ph:package-duotone', label: 'Sẵn sàng',   count: all.filter(o => o.trangThai === 'SAN_SANG').length },
    { key: 'HOAN_THANH',   icon: 'ph:check-circle-duotone', label: 'Hoàn thành', count: all.filter(o => o.trangThai === 'HOAN_THANH').length },
  ]
})

// ─── METHODS ─────────────────────────────────────────────────────────────────
async function fetchOrders() {
  loading.value = true
  try {
    const params = {}
    if (filterStatus.value) params.trangThai = filterStatus.value
    if (filterNguon.value)  params.nguonDon  = filterNguon.value
    if (filterDateRange.value && filterDateRange.value[0]) {
      params.tuNgay  = filterDateRange.value[0]
      params.denNgay = filterDateRange.value[1]
    }
    // Nhân viên dùng endpoint chung (ADMIN + NHAN_VIEN đều được)
    const res = await apiClient.get('/api/v1/orders', { params })
    orders.value = res.data || []
  } catch (err) {
    // Fallback: nếu endpoint admin filter bị từ chối thì dùng endpoint cơ bản
    try {
      const res = await apiClient.get('/api/v1/orders')
      let data = res.data || []
      if (filterStatus.value) data = data.filter(o => o.trangThai === filterStatus.value)
      if (filterNguon.value)  data = data.filter(o => (o.nguonDon || 'ONLINE') === filterNguon.value)
      orders.value = data
    } catch (e) {
      ElMessage.error('Không thể tải danh sách đơn hàng')
    }
  } finally {
    loading.value = false
  }
}

async function submitStatusUpdate() {
  if (!newStatus.value || !selectedOrder.value) return
  if (newStatus.value === 'DA_HUY' && !cancelReason.value.trim()) {
    ElMessage.warning('Vui lòng nhập lý do hủy!')
    return
  }
  try {
    await ElMessageBox.confirm(
      `Cập nhật đơn HD-${selectedOrder.value.id} sang "${getStatusLabel(newStatus.value)}"?`,
      'Xác nhận',
      { confirmButtonText: 'Cập nhật', cancelButtonText: 'Hủy', type: 'warning' }
    )
  } catch { return }

  updating.value = true
  try {
    const payload = {
      trangThai: newStatus.value,
      lyDoHuy: newStatus.value === 'DA_HUY' ? cancelReason.value : undefined
    }
    await apiClient.put(`/api/v1/orders/${selectedOrder.value.id}/process`, payload)
    ElMessage.success('Đã cập nhật trạng thái thành công!')
    showDetail.value = false
    newStatus.value = ''
    cancelReason.value = ''
    await fetchOrders()
  } catch (err) {
    ElMessage.error(err.response?.data || 'Cập nhật thất bại')
  } finally {
    updating.value = false
  }
}

async function quickUpdateStatus(order, status) {
  try {
    await apiClient.put(`/api/v1/orders/${order.id}/process`, { trangThai: status })
    ElMessage.success(`Đã chuyển HD-${order.id} → ${getStatusLabel(status)}`)
    await fetchOrders()
  } catch (err) {
    ElMessage.error(err.response?.data || 'Cập nhật thất bại')
  }
}

function handleAction(status, row) {
  if (status === 'DA_HUY') {
    openDetail(row)
    newStatus.value = 'DA_HUY'
  } else if (status === 'print-production') {
    openPrintProduction(row)
  } else {
    quickUpdateStatus(row, status)
  }
}

async function openPrintProduction(row) {
  showPrintProduction.value = true
  printLoading.value = true
  printData.value = null
  try {
    const res = await apiClient.get(`/api/v1/admin/orders/${row.id}/print`)
    printData.value = res.data
  } catch (err) {
    ElMessage.error('Không thể tải dữ liệu in phiếu!')
    showPrintProduction.value = false
  } finally {
    printLoading.value = false
  }
}

function triggerBrowserPrintProduction() {
  const style = document.createElement('style')
  style.id = '__print_style__'
  style.innerHTML = `@media print { body * { visibility: hidden !important; }
    #print-production-area, #print-production-area * { visibility: visible !important; }
    #print-production-area { position: absolute; left: 0; top: 0; width: 100%; } }`
  document.head.appendChild(style)
  window.print()
  setTimeout(() => document.getElementById('__print_style__')?.remove(), 1000)
}

function openDetail(row) {
  selectedOrder.value = row
  newStatus.value = ''
  cancelReason.value = ''
  showDetail.value = true
}

function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {}, 300)
}

function getKanbanCards(colId) {
  return orders.value.filter(o => o.trangThai === colId)
}

function getNextStatus(currentId) {
  const idx = statusFlow.indexOf(currentId)
  return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null
}

function getStatusStep(status) {
  const steps = ['CHO_XAC_NHAN','DA_XAC_NHAN','DANG_LAM','SAN_SANG','DANG_GIAO','HOAN_THANH']
  return steps.indexOf(status)
}

function getStatusLabel(val) {
  const map = {
    CHO_XAC_NHAN: 'Chờ xác nhận',
    DA_XAC_NHAN:  'Đã xác nhận',
    DANG_LAM:     'Đang sản xuất',
    SAN_SANG:     'Sẵn sàng giao',
    DANG_GIAO:    'Đang giao hàng',
    HOAN_THANH:   'Hoàn thành',
    DA_HUY:       'Đã hủy',
    DA_HOAN_TIEN: 'Đã hoàn tiền',
  }
  return map[val] || val
}

function getStatusClass(val) {
  const map = {
    CHO_XAC_NHAN: 'bg-yellow-100 text-yellow-700',
    DA_XAC_NHAN:  'bg-blue-100 text-blue-700',
    DANG_LAM:     'bg-orange-100 text-orange-700',
    SAN_SANG:     'bg-cyan-100 text-cyan-700',
    DANG_GIAO:    'bg-indigo-100 text-indigo-700',
    HOAN_THANH:   'bg-emerald-100 text-emerald-700',
    DA_HUY:       'bg-red-100 text-red-600',
    DA_HOAN_TIEN: 'bg-purple-100 text-purple-600',
  }
  return map[val] || 'bg-slate-100 text-slate-600'
}

function formatCurrency(val) {
  if (!val && val !== 0) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('vi-VN')
}

function getInitials(email) {
  if (!email) return 'KH'
  return email.slice(0, 2).toUpperCase()
}

// ─── LIFECYCLE ────────────────────────────────────────────────────────────────
onMounted(fetchOrders)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
</style>
