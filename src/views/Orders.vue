<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#1E2A3B">Quản lý đơn hàng</h1>
        <p class="text-sm text-muted mt-0.5">Theo dõi và xử lý {{ orders.length }} đơn hàng</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" @click="exportExcel" :disabled="exporting">
          <el-icon :class="exporting ? 'animate-spin' : ''"><Download /></el-icon>
          {{ exporting ? 'Đang xuất...' : 'Xuất Excel' }}
        </button>
      </div>
    </div>

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

        <el-table-column label="ƯU TIÊN" width="90" align="center" v-if="false">
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
                  <el-dropdown-item command="override" divided>⚡ Ghi đè (Override)</el-dropdown-item>
                  <el-dropdown-item command="refund">💸 Hoàn tiền (Refund)</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <span style="color:#EF4444">🗑 Huỷ đơn + hoàn kho</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

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

    <el-dialog v-model="showDetail" :title="`Chi tiết đơn hàng ${selectedOrder?.id}`" width="660px">
      <div v-if="selectedOrder">
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

        <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100" v-if="selectedOrder.note">
          <div class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">📝 Ghi chú đặc biệt</div>
          <div class="text-sm text-amber-800">{{ selectedOrder.note }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetail = false">Đóng</el-button>
      </template>
    </el-dialog>

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

    <el-dialog v-model="showRefund" title="Xử lý hoàn tiền" width="450px">
      <div class="mb-5 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
        Đang xử lý hoàn tiền cho đơn hàng <strong class="text-[#E8634A]">{{ selectedOrder?.id }}</strong>.<br>
        Khách hàng: <strong>{{ selectedOrder?.customer }}</strong>
      </div>
      <el-form label-position="top">
        <el-form-item label="Số tiền hoàn (VNĐ)" required>
          <el-input v-model="refundData.amount" placeholder="Nhập số tiền..." />
        </el-form-item>
        <el-form-item label="Lý do hoàn tiền" required>
          <el-input v-model="refundData.reason" type="textarea" :rows="2" placeholder="VD: Khách hủy đơn, sai mẫu bánh..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRefund = false">Hủy</el-button>
        <el-button type="primary" :style="{ background:'#E8634A', borderColor:'#E8634A' }" @click="processRefund">
          Xác nhận hoàn tiền
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showOverride" title="Ghi đè hệ thống (Override)" width="450px">
      <div class="mb-5 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
        <strong>⚠️ Cảnh báo:</strong> Thao tác này sẽ ép buộc chuyển đổi trạng thái đơn <strong class="text-[#E8634A]">{{ selectedOrder?.id }}</strong>, bỏ qua quy trình thông thường.
      </div>
      <el-form label-position="top">
        <el-form-item label="Ép chuyển sang trạng thái" required>
          <el-select v-model="overrideData.status" class="w-full">
            <el-option label="Hoàn thành" value="Hoàn thành" />
            <el-option label="Đã giao" value="Đã giao" />
            <el-option label="Đã huỷ" value="Đã huỷ" />
          </el-select>
        </el-form-item>
        <el-form-item label="Mã PIN Admin" required>
          <el-input v-model="overrideData.pin" type="password" placeholder="Nhập mã PIN xác nhận..." show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showOverride = false">Hủy</el-button>
        <el-button type="danger" @click="processOverride">
          Thực thi Ghi đè
        </el-button>
      </template>
    </el-dialog>

    <!-- ── DIALOG: CHỈNH SỬA ĐƠN ──────────────────────────────────────────── -->
    <el-dialog v-model="showEdit" title="✏️ Chỉnh sửa đơn hàng" width="500px">
      <div v-if="selectedOrder" class="mb-4 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
        Đơn <strong class="text-[#E8634A]">{{ selectedOrder.id }}</strong> — {{ selectedOrder.customer }}
      </div>
      <el-form :model="editData" label-position="top">
        <el-form-item label="Địa chỉ giao hàng">
          <el-input v-model="editData.diaChiGiaoHang" placeholder="Số nhà, đường, phường, quận..." />
        </el-form-item>
        <el-form-item label="Số điện thoại">
          <el-input v-model="editData.soDienThoai" placeholder="0901 234 567" />
        </el-form-item>
        <el-form-item label="Ngày giao hàng">
          <el-date-picker v-model="editData.ngayGiaoHang" type="date" placeholder="Chọn ngày" style="width:100%" />
        </el-form-item>
        <el-form-item label="Ghi chú">
          <el-input v-model="editData.ghiChu" type="textarea" :rows="3"
            placeholder="Yêu cầu đặc biệt, màu sắc, chữ trên bánh..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEdit = false">Hủy</el-button>
        <el-button type="primary" :style="{ background:'#E8634A', borderColor:'#E8634A' }"
          :loading="saving" @click="saveEdit">
          Lưu thay đổi
        </el-button>
      </template>
    </el-dialog>

    <!-- ── DIALOG: ĐỔI TRẠNG THÁI ──────────────────────────────────────────── -->
    <el-dialog v-model="showStatus" title="🔄 Đổi trạng thái đơn hàng" width="420px">
      <div v-if="selectedOrder" class="mb-4 text-sm">
        <div class="bg-slate-50 px-3 py-2 rounded-lg mb-3">
          Đơn <strong class="text-[#E8634A]">{{ selectedOrder.id }}</strong> — hiện tại:
          <span class="badge ml-1" :class="`badge-${statusColor(selectedOrder.status)}`">
            {{ selectedOrder.status }}
          </span>
        </div>
        <div class="text-xs text-slate-400 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          💡 Chỉ được chuyển sang bước kế tiếp trong quy trình. Muốn bỏ qua bước hãy dùng <strong>Ghi đè</strong>.
        </div>
      </div>
      <el-form label-position="top">
        <el-form-item label="Chuyển sang trạng thái" required>
          <el-select v-model="statusData.trangThaiMoi" style="width:100%">
            <el-option label="✅ Đã xác nhận"   value="DA_XAC_NHAN" />
            <el-option label="🔧 Đang làm"      value="DANG_LAM" />
            <el-option label="📦 Sẵn sàng"      value="SAN_SANG" />
            <el-option label="🚴 Đang giao"     value="DANG_GIAO" />
            <el-option label="✅ Hoàn thành"    value="HOAN_THANH" />
            <el-option label="❌ Huỷ đơn"       value="DA_HUY" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="statusData.trangThaiMoi === 'DA_HUY'" label="Lý do huỷ" required>
          <el-input v-model="statusData.lyDoHuy" type="textarea" :rows="2" placeholder="Nhập lý do..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showStatus = false">Hủy</el-button>
        <el-button type="primary" :style="{ background:'#E8634A', borderColor:'#E8634A' }"
          :loading="saving" @click="saveStatus">
          Xác nhận chuyển
        </el-button>
      </template>
    </el-dialog>

    <!-- ── DIALOG: IN ĐƠN ──────────────────────────────────────────────────── -->
    <el-dialog v-model="showPrint" title="🖨️ Phiếu đơn hàng" width="560px">
      <div v-if="printLoading" class="flex justify-center py-10">
        <div class="w-8 h-8 border-4 border-[#E8634A] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="printData" id="print-area" class="text-sm text-slate-700 font-sans">
        <!-- Header phiếu -->
        <div class="text-center mb-5">
          <div class="text-lg font-black text-[#E8634A]">🎂 TIỆM BÁNH</div>
          <div class="text-xs text-slate-400 mt-0.5">Phiếu đơn hàng</div>
          <div class="text-xl font-black text-[#1E2A3B] mt-1">{{ printData.maDonHang }}</div>
          <div class="text-xs text-slate-400">Ngày tạo: {{ formatDateTime(printData.ngayTao) }}</div>
        </div>

        <hr class="border-dashed border-slate-300 mb-4" />

        <!-- Thông tin khách -->
        <div class="mb-4">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin khách hàng</div>
          <div class="grid grid-cols-2 gap-1 text-sm">
            <span class="text-slate-500">Họ tên:</span>       <span class="font-medium">{{ printData.tenKhachHang }}</span>
            <span class="text-slate-500">Email:</span>        <span>{{ printData.emailKhachHang }}</span>
            <span class="text-slate-500">Điện thoại:</span>   <span>{{ printData.sdtKhachHang || '—' }}</span>
            <span class="text-slate-500">Địa chỉ giao:</span> <span>{{ printData.diaChiGiaoHang || '—' }}</span>
            <span class="text-slate-500">Ngày giao:</span>    <span class="font-medium text-[#E8634A]">{{ printData.ngayGiaoHang || '—' }}</span>
          </div>
        </div>

        <!-- Sản phẩm -->
        <div class="mb-4">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sản phẩm</div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-xs text-slate-400">
                <th class="text-left pb-1">Tên sản phẩm</th>
                <th class="text-center pb-1">SL</th>
                <th class="text-right pb-1">Đơn giá</th>
                <th class="text-right pb-1">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in printData.items" :key="item.tenSanPham"
                class="border-b border-slate-100">
                <td class="py-1.5 font-medium text-[#1E2A3B]">{{ item.tenSanPham }}</td>
                <td class="py-1.5 text-center">{{ item.soLuong }}</td>
                <td class="py-1.5 text-right">{{ formatVND(item.donGia) }}</td>
                <td class="py-1.5 text-right font-semibold">{{ formatVND(item.thanhTien) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tổng tiền -->
        <div class="bg-slate-50 rounded-xl p-3 space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Tổng tiền hàng</span>
            <span class="font-semibold">{{ formatVND(printData.tongTien) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Đã cọc</span>
            <span class="text-green-600">- {{ formatVND(printData.soTienCoc) }}</span>
          </div>
          <div class="flex justify-between pt-1 border-t border-slate-200">
            <span class="font-bold text-[#1E2A3B]">Còn lại</span>
            <span class="font-black text-[#E8634A] text-base">{{ formatVND(printData.conLai) }}</span>
          </div>
        </div>

        <!-- Ghi chú -->
        <div v-if="printData.ghiChu" class="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div class="text-xs font-bold text-amber-700 mb-1">📝 Ghi chú</div>
          <div class="text-amber-800 whitespace-pre-line">{{ printData.ghiChu }}</div>
        </div>

        <!-- NV phụ trách -->
        <div v-if="printData.tenNhanVien" class="mt-3 text-xs text-slate-400 text-right">
          NV phụ trách: {{ printData.tenNhanVien }}
        </div>
      </div>
      <template #footer>
        <el-button @click="showPrint = false">Đóng</el-button>
        <el-button type="primary" :style="{ background:'#E8634A', borderColor:'#E8634A' }"
          @click="triggerBrowserPrint">
          🖨️ In ngay
        </el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Download, MoreFilled } from '@element-plus/icons-vue'
import { orderService } from '@/services/orderService'
import * as XLSX from 'xlsx'

// ── STATE ──────────────────────────────────────────────────────────────────────
const search = ref('')
const filterStatus = ref('')
const filterDate = ref(null)
const sortBy = ref('newest')
const page = ref(1)
const tableLoading = ref(false)
const exporting = ref(false)
const showDetail = ref(false)
const showAddOrder = ref(false)
const selectedOrder = ref(null)

// Refund & Override dialogs
const showRefund = ref(false)
const refundData = ref({ reason: '' })
const showOverride = ref(false)
const overrideData = ref({ trangThaiMoi: 'HOAN_THANH', lyDo: '' })

// Edit dialog
const showEdit = ref(false)
const editData = ref({ diaChiGiaoHang: '', soDienThoai: '', ngayGiaoHang: null, ghiChu: '' })

// Status dialog
const showStatus = ref(false)
const statusData = ref({ trangThaiMoi: '', lyDoHuy: '' })

// Print dialog
const showPrint = ref(false)
const printData = ref(null)
const printLoading = ref(false)

const saving = ref(false)

// Form tạo đơn mới (giữ nguyên — chưa có API tương ứng)
const newOrder = ref({ customer: '', phone: '', product: '', deliveryDate: null, deliveryTime: null, total: '', deposit: '', address: '', note: '', urgent: false })
const productList = ['Bánh sinh nhật 3D', 'Bánh cưới nhiều tầng', 'Cupcake set 12', 'Macaron hộp 24', 'Bánh mousse', 'Bánh tiramisu', 'Bánh crepe', 'Bánh su kem']

// Danh sách đơn hàng từ API
const orders = ref([])

// ── MAPPING helpers ────────────────────────────────────────────────────────────
// Map trạng thái BE → nhãn hiển thị (tiếng Việt)
const STATUS_LABEL = {
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_XAC_NHAN:  'Đã xác nhận',
  DANG_LAM:     'Đang sản xuất',
  SAN_SANG:     'Sẵn sàng',
  DANG_GIAO:    'Đang giao',
  HOAN_THANH:   'Hoàn thành',
  DA_HUY:       'Đã huỷ',
}

// Map trạng thái BE → key dùng cho bộ lọc / màu badge
const STATUS_KEY = {
  CHO_XAC_NHAN: 'new',
  DA_XAC_NHAN:  'new',
  DANG_LAM:     'production',
  SAN_SANG:     'production',
  DANG_GIAO:    'delivered',
  HOAN_THANH:   'done',
  DA_HUY:       'cancelled',
}

// Map filter value → trangThai BE (để truyền lên API)
const FILTER_MAP = {
  pending:    'CHO_XAC_NHAN',
  production: 'DANG_LAM',
  done:       'HOAN_THANH',
  delivered:  'DANG_GIAO',
  cancelled:  'DA_HUY',
}

// Màu avatar avatar ngẫu nhiên theo index
const AVATAR_COLORS = [
  { bg: '#FFF0EC', color: '#E8634A' },
  { bg: '#F0FDF4', color: '#22C55E' },
  { bg: '#EFF6FF', color: '#3B82F6' },
  { bg: '#F5F3FF', color: '#7C3AED' },
  { bg: '#FFFBEB', color: '#F59E0B' },
]

/**
 * Chuyển đổi 1 OrderDto.Response từ BE → row dùng được trong template hiện tại
 */
function mapOrder(dto, index = 0) {
  const ac = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const email = dto.emailNguoiDung || ''
  const initials = email.slice(0, 2).toUpperCase()
  const statusLabel = STATUS_LABEL[dto.trangThai] || dto.trangThai
  const statusKey   = STATUS_KEY[dto.trangThai]   || 'new'

  // Tên sản phẩm đầu tiên làm đại diện
  const firstItem = dto.items?.[0]
  const product = firstItem?.tenSanPham || '—'
  const variant = firstItem ? `x${firstItem.soLuong}` : ''

  // Format ngày giao
  const ngayGiao = dto.ngayGiaoHang ? new Date(dto.ngayGiaoHang) : null
  const deliveryDate = ngayGiao ? `${String(ngayGiao.getDate()).padStart(2,'0')}/${String(ngayGiao.getMonth()+1).padStart(2,'0')}` : '—'
  const deliveryTime = ngayGiao ? `${String(ngayGiao.getHours()).padStart(2,'0')}:${String(ngayGiao.getMinutes()).padStart(2,'0')}` : ''

  // Format tiền
  const formatVND = (n) => n != null ? n.toLocaleString('vi-VN') + 'đ' : '—'

  return {
    // ID gốc số nguyên (dùng cho gọi API)
    _id: dto.id,
    // Hiển thị
    id:           `HD-${dto.id}`,
    customer:     email,
    initials,
    avatarBg:     ac.bg,
    avatarColor:  ac.color,
    phone:        dto.soDienThoai || '',
    product,
    variant,
    deliveryDate,
    deliveryTime,
    total:        formatVND(dto.tongTien),
    deposit:      '',
    status:       statusLabel,
    statusKey,
    urgent:       false,
    address:      dto.diaChiGiaoHang || '',
    note:         dto.ghiChu || '',
    nguonDon:     dto.nguonDon || '',
    trangThai:    dto.trangThai,
    // Raw data để dùng khi cần
    _raw: dto,
  }
}

// ── FETCH: Lấy danh sách đơn hàng từ Admin API ────────────────────────────────
async function fetchOrders() {
  tableLoading.value = true
  try {
    // Xây dựng params lọc
    const params = {}
    if (filterStatus.value)  params.trangThai = FILTER_MAP[filterStatus.value] || filterStatus.value
    if (filterDate.value?.[0]) params.tuNgay  = new Date(filterDate.value[0]).toISOString()
    if (filterDate.value?.[1]) params.denNgay = new Date(filterDate.value[1]).toISOString()

    const res = await orderService.filterOrders(params)
    orders.value = (res.data || []).map(mapOrder)
  } catch (err) {
    console.error('Lỗi tải đơn hàng:', err)
    ElMessage.error('Không thể tải danh sách đơn hàng từ server!')
  } finally {
    tableLoading.value = false
  }
}

// Tự động fetch lại khi filter thay đổi
watch([filterStatus, filterDate], () => {
  page.value = 1
  fetchOrders()
})

onMounted(fetchOrders)

// ── COMPUTED ───────────────────────────────────────────────────────────────────
const orderStats = computed(() => [
  { icon: '📬', count: orders.value.filter(o => o.statusKey === 'new').length,        label: 'Chờ xác nhận' },
  { icon: '⚙️',  count: orders.value.filter(o => o.statusKey === 'production').length, label: 'Đang sản xuất' },
  { icon: '✅', count: orders.value.filter(o => o.statusKey === 'done').length,        label: 'Hoàn thành' },
  { icon: '🚚', count: orders.value.filter(o => o.statusKey === 'delivered').length,   label: 'Đã giao' },
])

const filteredOrders = computed(() => {
  let result = orders.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q)
    )
  }
  // Sắp xếp
  if (sortBy.value === 'newest') {
    result = [...result].reverse()
  }
  return result
})

const statusColor = (s) => {
  const m = { 'Chờ xác nhận': 'info', 'Đã xác nhận': 'info', 'Đang sản xuất': 'warning', 'Sẵn sàng': 'warning', 'Hoàn thành': 'success', 'Đang giao': 'primary', 'Đã huỷ': 'danger' }
  return m[s] || 'gray'
}

const statusStep = (s) => {
  const m = { 'Chờ xác nhận': 0, 'Đã xác nhận': 0, 'Đang sản xuất': 1, 'Sẵn sàng': 1, 'Hoàn thành': 2, 'Đang giao': 3 }
  return m[s] ?? 0
}

// ── ACTIONS ────────────────────────────────────────────────────────────────────
function openDetail(row) {
  selectedOrder.value = row
  showDetail.value = true
}

function handleRowAction(cmd, row) {
  selectedOrder.value = row
  if (cmd === 'view') {
    openDetail(row)
  } else if (cmd === 'edit') {
    editData.value = {
      diaChiGiaoHang: row.address || '',
      soDienThoai:    row.phone   || '',
      ngayGiaoHang:   null,
      ghiChu:         row.note    || '',
    }
    showEdit.value = true
  } else if (cmd === 'status') {
    statusData.value = { trangThaiMoi: '', lyDoHuy: '' }
    showStatus.value = true
  } else if (cmd === 'print') {
    openPrint(row)
  } else if (cmd === 'refund') {
    refundData.value = { reason: '' }
    showRefund.value = true
  } else if (cmd === 'override') {
    overrideData.value = { trangThaiMoi: 'HOAN_THANH', lyDo: '' }
    showOverride.value = true
  } else if (cmd === 'delete') {
    confirmCancelRollback(row)
  } else {
    ElMessage.info('Tính năng đang phát triển')
  }
}

// ── ADMIN API: Override trạng thái ────────────────────────────────────────────
async function processOverride() {
  if (!overrideData.value.trangThaiMoi) {
    return ElMessage.warning('Vui lòng chọn trạng thái muốn ép chuyển!')
  }
  try {
    const res = await orderService.overrideOrderStatus(
      selectedOrder.value._id,
      overrideData.value.trangThaiMoi,
      overrideData.value.lyDo
    )
    // Cập nhật lại row trong danh sách
    const updated = mapOrder(res.data)
    const idx = orders.value.findIndex(o => o._id === selectedOrder.value._id)
    if (idx !== -1) orders.value[idx] = updated

    showOverride.value = false
    ElMessage.success(`Ghi đè thành công đơn ${selectedOrder.value.id}!`)
    // Cập nhật modal chi tiết nếu đang mở
    if (showDetail.value) selectedOrder.value = updated
  } catch (err) {
    ElMessage.error(err.response?.data || 'Ghi đè thất bại!')
  }
}

// ── ADMIN API: Hoàn tiền ──────────────────────────────────────────────────────
async function processRefund() {
  if (!refundData.value.reason) {
    return ElMessage.warning('Vui lòng nhập lý do hoàn tiền!')
  }
  try {
    const res = await orderService.refundOrder(
      selectedOrder.value._id,
      refundData.value.reason
    )
    const updated = mapOrder(res.data)
    const idx = orders.value.findIndex(o => o._id === selectedOrder.value._id)
    if (idx !== -1) orders.value[idx] = updated

    showRefund.value = false
    ElMessage.success(`Hoàn tiền đơn ${selectedOrder.value.id} thành công!`)
    if (showDetail.value) selectedOrder.value = updated
  } catch (err) {
    ElMessage.error(err.response?.data || 'Hoàn tiền thất bại!')
  }
}

// ── ADMIN API: Hủy đơn + rollback kho ────────────────────────────────────────
async function confirmCancelRollback(row) {
  try {
    const { value: lyDo } = await ElMessageBox.prompt(
      `Nhập lý do huỷ đơn <strong>${row.id}</strong>. Kho hàng sẽ được hoàn trả tự động.`,
      'Huỷ đơn bắt buộc (Admin)',
      {
        confirmButtonText: 'Xác nhận huỷ',
        cancelButtonText: 'Đóng',
        inputPlaceholder: 'Lý do huỷ...',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    )

    await orderService.cancelAndRollback(row._id, lyDo || 'Admin huỷ')
    await fetchOrders()   // reload toàn bộ để đồng bộ
    ElMessage.success(`Đã huỷ đơn ${row.id} và hoàn kho thành công!`)
  } catch (err) {
    if (err === 'cancel') return
    ElMessage.error(err.response?.data || 'Huỷ đơn thất bại!')
  }
}

// ── Tạo đơn mới (mock — chưa có Admin Create Order API) ──────────────────────
function saveOrder() {
  if (!newOrder.value.customer || !newOrder.value.product) {
    return ElMessage.warning('Vui lòng điền đầy đủ thông tin')
  }
  ElMessage.info('Chức năng tạo đơn qua Admin API đang phát triển')
  showAddOrder.value = false
}

// ── CHỈNH SỬA ĐƠN ─────────────────────────────────────────────────────────────
async function saveEdit() {
  saving.value = true
  try {
    // Chỉ gửi các trường đã thực sự có giá trị
    const payload = {}
    if (editData.value.diaChiGiaoHang.trim()) payload.diaChiGiaoHang = editData.value.diaChiGiaoHang.trim()
    if (editData.value.soDienThoai.trim())    payload.soDienThoai    = editData.value.soDienThoai.trim()
    if (editData.value.ghiChu.trim())         payload.ghiChu         = editData.value.ghiChu.trim()
    if (editData.value.ngayGiaoHang)          payload.ngayGiaoHang   = editData.value.ngayGiaoHang

    const res = await orderService.updateOrderInfo(selectedOrder.value._id, payload)
    const updated = mapOrder(res.data)
    const idx = orders.value.findIndex(o => o._id === selectedOrder.value._id)
    if (idx !== -1) orders.value[idx] = updated
    if (showDetail.value) selectedOrder.value = updated

    showEdit.value = false
    ElMessage.success(`Đã cập nhật đơn ${selectedOrder.value.id}!`)
  } catch (err) {
    ElMessage.error(err.response?.data || 'Cập nhật thất bại!')
  } finally {
    saving.value = false
  }
}

// ── ĐỔI TRẠNG THÁI ─────────────────────────────────────────────────────────────
async function saveStatus() {
  if (!statusData.value.trangThaiMoi) return ElMessage.warning('Vui lòng chọn trạng thái!')
  if (statusData.value.trangThaiMoi === 'DA_HUY' && !statusData.value.lyDoHuy)
    return ElMessage.warning('Vui lòng nhập lý do huỷ!')

  saving.value = true
  try {
    const res = await orderService.changeOrderStatus(
      selectedOrder.value._id,
      statusData.value.trangThaiMoi,
      statusData.value.lyDoHuy || undefined
    )
    const updated = mapOrder(res.data)
    const idx = orders.value.findIndex(o => o._id === selectedOrder.value._id)
    if (idx !== -1) orders.value[idx] = updated
    if (showDetail.value) selectedOrder.value = updated

    showStatus.value = false
    ElMessage.success(`Đã chuyển trạng thái đơn ${selectedOrder.value.id}!`)
  } catch (err) {
    ElMessage.error(err.response?.data || 'Đổi trạng thái thất bại!')
  } finally {
    saving.value = false
  }
}

// ── IN ĐƠN ─────────────────────────────────────────────────────────────────────
async function openPrint(row) {
  showPrint.value = true
  printLoading.value = true
  printData.value = null
  try {
    const res = await orderService.getPrintData(row._id)
    printData.value = res.data
  } catch (err) {
    ElMessage.error('Không thể tải dữ liệu in đơn!')
    showPrint.value = false
  } finally {
    printLoading.value = false
  }
}

function triggerBrowserPrint() {
  // Ẩn mọi thứ, chỉ in phần #print-area
  const style = document.createElement('style')
  style.id = '__print_style__'
  style.innerHTML = `@media print { body * { visibility: hidden !important; }
    #print-area, #print-area * { visibility: visible !important; }
    #print-area { position: fixed; top: 0; left: 0; width: 100%; } }`
  document.head.appendChild(style)
  window.print()
  setTimeout(() => document.getElementById('__print_style__')?.remove(), 1000)
}

// ── HELPERS HIỂN THỊ ───────────────────────────────────────────────────────────
function formatVND(n) {
  return n != null ? n.toLocaleString('vi-VN') + 'đ' : '—'
}

function formatDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
}

// ── XUẤT EXCEL ────────────────────────────────────────────────────────────────
async function exportExcel() {
  if (exporting.value) return
  exporting.value = true
  try {
    // Lấy toàn bộ đơn hàng (không lọc) để xuất đầy đủ
    const res = await orderService.filterOrders({})
    const data = res.data || []

    // Map sang hàng Excel dễ đọc
    const rows = data.map((dto) => ({
      'Mã đơn':         `HD-${dto.id}`,
      'Email khách':    dto.emailNguoiDung || '',
      'Số điện thoại':  dto.soDienThoai || '',
      'Địa chỉ':        dto.diaChiGiaoHang || '',
      'Trạng thái':     STATUS_LABEL[dto.trangThai] || dto.trangThai,
      'Nguồn đơn':      dto.nguonDon || '',
      'Sản phẩm':       dto.items?.map(i => `${i.tenSanPham} x${i.soLuong}`).join('; ') || '',
      'Tổng tiền (đ)':  dto.tongTien ?? 0,
      'Ngày tạo':       dto.ngayTao ? new Date(dto.ngayTao).toLocaleString('vi-VN') : '',
      'Ngày giao':      dto.ngayGiaoHang ? new Date(dto.ngayGiaoHang).toLocaleString('vi-VN') : '',
      'Ghi chú':        dto.ghiChu || '',
    }))

    const ws = XLSX.utils.json_to_sheet(rows)

    // Tự động căn độ rộng cột
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...rows.map(r => String(r[key] ?? '').length)) + 2
    }))
    ws['!cols'] = colWidths

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Đơn hàng')

    // Tên file có timestamp
    const ts = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
    XLSX.writeFile(wb, `don-hang-${ts}.xlsx`)

    ElMessage.success(`Đã xuất ${rows.length} đơn hàng ra file Excel!`)
  } catch (err) {
    console.error('Lỗi xuất Excel:', err)
    ElMessage.error('Xuất Excel thất bại!')
  } finally {
    exporting.value = false
  }
}
</script>