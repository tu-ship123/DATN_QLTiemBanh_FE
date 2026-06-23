<template>
  <div class="min-h-screen bg-[#FFF8F4] p-5 flex flex-col gap-5">

    <!-- ── HEADER ────────────────────────────────────────────── -->
    <div class="flex flex-wrap justify-between items-end gap-3">
      <div>
        <h1 class="text-2xl font-black text-[#1E2A3B] tracking-tight">🎂 Quản lý Đơn – Tiệm Bánh</h1>
        <p class="text-sm text-slate-500 mt-0.5">Nhận đơn → Sản xuất → Sẵn sàng → Chuyển Shipper</p>
      </div>
      <button @click="fetchOrders" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:border-[#E8634A] hover:text-[#E8634A] transition-all disabled:opacity-50">
        <svg :class="loading ? 'animate-spin' : ''" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Làm mới
      </button>
    </div>

    <!-- ── STATS CARDS ────────────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div v-for="s in stats" :key="s.key"
        @click="activeTab = s.key"
        :class="[
          'rounded-2xl p-4 border-2 cursor-pointer transition-all',
          activeTab === s.key
            ? 'bg-[#E8634A] border-[#E8634A] text-white shadow-lg shadow-[#E8634A]/20'
            : 'bg-white border-[#EDE8E3] hover:border-[#E8634A]/50'
        ]">
        <div class="text-xl mb-1">{{ s.icon }}</div>
        <div :class="activeTab === s.key ? 'text-white/80' : 'text-slate-400'"
          class="text-[10px] font-bold uppercase tracking-wider">{{ s.label }}</div>
        <div :class="activeTab === s.key ? 'text-white' : 'text-[#1E2A3B]'"
          class="text-2xl font-black mt-0.5">{{ s.count }}</div>
      </div>
    </div>

    <!-- ── KANBAN BOARD ────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-[#E8634A] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div v-for="col in columns" :key="col.status"
        class="bg-white rounded-2xl border border-[#EDE8E3] overflow-hidden flex flex-col">

        <!-- Column header -->
        <div :class="col.headerClass" class="px-4 py-3 flex items-center justify-between">
          <span class="font-bold text-sm flex items-center gap-2">
            <span>{{ col.icon }}</span> {{ col.title }}
          </span>
          <span class="text-xs font-black px-2 py-0.5 rounded-full bg-white/30">
            {{ ordersByStatus(col.status).length }}
          </span>
        </div>

        <!-- Cards -->
        <div class="flex flex-col gap-3 p-3 flex-1 min-h-[200px]">
          <div v-if="ordersByStatus(col.status).length === 0"
            class="flex-1 flex items-center justify-center text-slate-300 text-sm font-medium py-8">
            Không có đơn
          </div>

          <div v-for="order in ordersByStatus(col.status)" :key="order.id"
            class="rounded-xl border border-[#EDE8E3] p-3.5 bg-white shadow-sm hover:shadow-md hover:border-[#E8634A]/30 transition-all cursor-pointer"
            @click="openDetail(order)">

            <!-- Order ID + time -->
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm font-black text-[#E8634A]">HD-{{ order.id }}</span>
              <span class="text-[10px] text-slate-400 font-medium">{{ formatTime(order.ngayTao) }}</span>
            </div>

            <!-- Customer -->
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-[#E8634A] to-[#FBB830] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {{ initials(order.emailNguoiDung) }}
              </div>
              <span class="text-xs text-slate-600 truncate font-medium">{{ order.emailNguoiDung }}</span>
            </div>

            <!-- Items preview -->
            <div class="text-[11px] text-slate-500 mb-3 line-clamp-2">
              🎂 {{ order.items?.map(i => i.tenSanPham).join(', ') || 'Không có sản phẩm' }}
            </div>

            <!-- Total -->
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-slate-400">Tổng tiền</span>
              <span class="text-sm font-black text-[#1E2A3B]">{{ formatCurrency(order.tongTien) }}</span>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2">
              <!-- Next step button -->
              <button v-if="col.nextStatus && col.nextStatus !== 'DANG_GIAO'"
                @click.stop="quickUpdate(order, col.nextStatus)"
                :disabled="updating === order.id"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-[#E8634A] text-white hover:bg-[#f27355] transition-all disabled:opacity-60">
                {{ col.nextLabel }}
              </button>

              <!-- Chuyển Shipper button (SAN_SANG → DANG_GIAO) -->
              <button v-if="col.status === 'SAN_SANG'"
                @click.stop="confirmHandToShipper(order)"
                :disabled="updating === order.id"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:opacity-90 transition-all disabled:opacity-60">
                🚴 Giao Shipper
              </button>

              <!-- Cancel button -->
              <button v-if="col.status === 'CHO_XAC_NHAN'"
                @click.stop="confirmCancel(order)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ORDER DETAIL MODAL ──────────────────────────────────── -->
    <div v-if="showDetail && selectedOrder"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showDetail = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        <!-- Modal header -->
        <div class="bg-gradient-to-r from-[#E8634A] to-[#FBB830] px-6 py-5 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-black text-white">HD-{{ selectedOrder.id }}</h2>
            <p class="text-white/80 text-sm">{{ formatDate(selectedOrder.ngayTao) }}</p>
          </div>
          <button @click="showDetail = false" class="text-white/80 hover:text-white text-2xl font-light">✕</button>
        </div>

        <!-- Modal body -->
        <div class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">

          <!-- Status badge -->
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-500">Trạng thái:</span>
            <span :class="getBadgeClass(selectedOrder.trangThai)"
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {{ getStatusLabel(selectedOrder.trangThai) }}
            </span>
          </div>

          <!-- Customer info -->
          <div class="bg-slate-50 rounded-2xl p-4 space-y-2">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin khách hàng</p>
            <p class="text-sm text-slate-700">📧 {{ selectedOrder.emailNguoiDung }}</p>
            <p v-if="selectedOrder.soDienThoai" class="text-sm text-slate-700">📞 {{ selectedOrder.soDienThoai }}</p>
            <p v-if="selectedOrder.diaChiGiaoHang" class="text-sm text-slate-700">📍 {{ selectedOrder.diaChiGiaoHang }}</p>
            <p v-if="selectedOrder.ngayGiaoHang" class="text-sm text-slate-700">📅 Giao dự kiến: {{ formatDate(selectedOrder.ngayGiaoHang, false) }}</p>
          </div>

          <!-- Items -->
          <div class="space-y-2">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Sản phẩm</p>
            <div v-for="item in selectedOrder.items" :key="item.sanPhamId"
              class="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
              <div>
                <p class="text-sm font-semibold text-[#1E2A3B]">{{ item.tenSanPham }}</p>
                <p class="text-xs text-slate-400">x{{ item.soLuong }} × {{ formatCurrency(item.giaBan) }}</p>
              </div>
              <p class="text-sm font-bold text-[#E8634A]">{{ formatCurrency(item.giaBan * item.soLuong) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center pt-2 border-t border-slate-100">
            <span class="font-bold text-slate-600">Tổng cộng</span>
            <span class="text-xl font-black text-[#E8634A]">{{ formatCurrency(selectedOrder.tongTien) }}</span>
          </div>

          <!-- Note -->
          <div v-if="selectedOrder.ghiChu" class="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p class="text-xs font-bold text-amber-600 mb-1">📝 Ghi chú</p>
            <p class="text-sm text-amber-800">{{ selectedOrder.ghiChu }}</p>
          </div>
        </div>

        <!-- Modal footer actions -->
        <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button v-if="selectedOrder.trangThai === 'CHO_XAC_NHAN'"
            @click="updateStatus('DA_XAC_NHAN')" :disabled="updating === selectedOrder.id"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-green-500 text-white hover:bg-green-600 transition-all disabled:opacity-60">
            ✅ Xác nhận đơn
          </button>
          <button v-if="selectedOrder.trangThai === 'DA_XAC_NHAN'"
            @click="updateStatus('DANG_LAM')" :disabled="updating === selectedOrder.id"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all disabled:opacity-60">
            🔧 Bắt đầu làm
          </button>
          <button v-if="selectedOrder.trangThai === 'DANG_LAM'"
            @click="updateStatus('SAN_SANG')" :disabled="updating === selectedOrder.id"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-purple-500 text-white hover:bg-purple-600 transition-all disabled:opacity-60">
            📦 Bánh sẵn sàng
          </button>
          <button v-if="selectedOrder.trangThai === 'SAN_SANG'"
            @click="confirmHandToShipper(selectedOrder)" :disabled="updating === selectedOrder.id"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:opacity-90 transition-all disabled:opacity-60">
            🚴 Giao cho Shipper
          </button>
          <button v-if="['CHO_XAC_NHAN','DA_XAC_NHAN'].includes(selectedOrder.trangThai)"
            @click="confirmCancel(selectedOrder)" :disabled="updating === selectedOrder.id"
            class="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all">
            Hủy đơn
          </button>
        </div>
      </div>
    </div>

    <!-- ── CANCEL MODAL ────────────────────────────────────────── -->
    <div v-if="showCancelModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      @click.self="showCancelModal = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-lg font-black text-[#1E2A3B] mb-1">Hủy đơn HD-{{ cancelTarget?.id }}</h3>
        <p class="text-sm text-slate-500 mb-4">Nhập lý do hủy để tiệm lưu lại.</p>
        <textarea v-model="cancelReason" rows="3" placeholder="VD: Khách yêu cầu hủy, hết nguyên liệu..."
          class="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#E8634A] resize-none mb-4"></textarea>
        <div class="flex gap-3">
          <button @click="showCancelModal = false"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 hover:bg-slate-50">
            Không hủy
          </button>
          <button @click="doCancel" :disabled="!cancelReason.trim() || !!updating"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50">
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>

    <!-- ── HAND TO SHIPPER MODAL ───────────────────────────────── -->
    <div v-if="showShipperModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      @click.self="showShipperModal = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <div class="text-center mb-5">
          <div class="text-5xl mb-3">🚴‍♂️</div>
          <h3 class="text-lg font-black text-[#1E2A3B]">Giao đơn cho Shipper?</h3>
          <p class="text-sm text-slate-500 mt-1">
            Đơn <strong class="text-[#E8634A]">HD-{{ shipperTarget?.id }}</strong> sẽ chuyển sang trạng thái <strong>Đang giao hàng</strong>.
          </p>
        </div>
        <div class="bg-blue-50 rounded-2xl p-4 mb-4 text-sm text-blue-700">
          📍 Địa chỉ: <strong>{{ shipperTarget?.diaChiGiaoHang || 'Chưa có địa chỉ' }}</strong>
        </div>
        <div class="flex gap-3">
          <button @click="showShipperModal = false"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-500">
            Chưa giao
          </button>
          <button @click="doHandToShipper" :disabled="!!updating"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:opacity-90 transition-all disabled:opacity-50">
            Xác nhận giao
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="toast.show"
        :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
        class="fixed bottom-6 right-6 z-[100] text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2">
        <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import apiClient from '@/services/apiService'

// ── STATE ─────────────────────────────────────────────────────────────────────
const orders         = ref([])
const loading        = ref(false)
const updating       = ref(null)    // id đơn đang update
const activeTab      = ref('')
const showDetail     = ref(false)
const selectedOrder  = ref(null)
const showCancelModal  = ref(false)
const cancelTarget     = ref(null)
const cancelReason     = ref('')
const showShipperModal = ref(false)
const shipperTarget    = ref(null)
const toast            = ref({ show: false, type: '', message: '' })
let   autoRefreshTimer = null

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const columns = [
  { status: 'CHO_XAC_NHAN', title: 'Chờ xác nhận',  icon: '⏳', nextStatus: 'DA_XAC_NHAN',  nextLabel: '✅ Xác nhận',    headerClass: 'bg-amber-50 text-amber-700 border-b border-amber-100' },
  { status: 'DA_XAC_NHAN',  title: 'Đã xác nhận',   icon: '✅', nextStatus: 'DANG_LAM',      nextLabel: '🔧 Bắt đầu làm', headerClass: 'bg-blue-50 text-blue-700 border-b border-blue-100' },
  { status: 'DANG_LAM',     title: 'Đang sản xuất', icon: '🔧', nextStatus: 'SAN_SANG',      nextLabel: '📦 Sẵn sàng',    headerClass: 'bg-purple-50 text-purple-700 border-b border-purple-100' },
  { status: 'SAN_SANG',     title: 'Sẵn sàng giao', icon: '📦', nextStatus: 'DANG_GIAO',     nextLabel: '',               headerClass: 'bg-green-50 text-green-700 border-b border-green-100' },
]

const statusMap = {
  CHO_XAC_NHAN: '⏳ Chờ xác nhận',
  DA_XAC_NHAN:  '✅ Đã xác nhận',
  DANG_LAM:     '🔧 Đang sản xuất',
  SAN_SANG:     '📦 Sẵn sàng giao',
  DANG_GIAO:    '🚴 Đang giao hàng',
  HOAN_THANH:   '🎉 Hoàn thành',
  DA_HUY:       '❌ Đã hủy',
}

const badgeClass = {
  CHO_XAC_NHAN: 'bg-amber-100 text-amber-700',
  DA_XAC_NHAN:  'bg-blue-100 text-blue-700',
  DANG_LAM:     'bg-purple-100 text-purple-700',
  SAN_SANG:     'bg-green-100 text-green-700',
  DANG_GIAO:    'bg-indigo-100 text-indigo-700',
  HOAN_THANH:   'bg-emerald-100 text-emerald-700',
  DA_HUY:       'bg-red-100 text-red-500',
}

// ── COMPUTED ─────────────────────────────────────────────────────────────────
const filteredOrders = computed(() =>
  activeTab.value ? orders.value.filter(o => o.trangThai === activeTab.value) : orders.value
)

const stats = computed(() => {
  const all = orders.value
  return [
    { key: '', icon: '📋', label: 'Tất cả',       count: all.length },
    { key: 'CHO_XAC_NHAN', icon: '⏳', label: 'Chờ xác nhận', count: all.filter(o => o.trangThai === 'CHO_XAC_NHAN').length },
    { key: 'DA_XAC_NHAN',  icon: '✅', label: 'Đã xác nhận',  count: all.filter(o => o.trangThai === 'DA_XAC_NHAN').length },
    { key: 'DANG_LAM',     icon: '🔧', label: 'Đang làm',     count: all.filter(o => o.trangThai === 'DANG_LAM').length },
    { key: 'SAN_SANG',     icon: '📦', label: 'Sẵn sàng',     count: all.filter(o => o.trangThai === 'SAN_SANG').length },
    { key: 'HOAN_THANH',   icon: '🎉', label: 'Hoàn thành',   count: all.filter(o => o.trangThai === 'HOAN_THANH').length },
  ]
})

// ── METHODS ───────────────────────────────────────────────────────────────────
const ordersByStatus = (status) =>
  orders.value.filter(o => o.trangThai === status)

async function fetchOrders() {
  loading.value = true
  try {
    const res = await apiClient.get('/api/v1/orders')
    orders.value = res.data
  } catch (e) {
    showToast('error', 'Không thể tải danh sách đơn hàng')
  } finally {
    loading.value = false
  }
}

async function quickUpdate(order, status) {
  if (updating.value) return
  updating.value = order.id
  try {
    await apiClient.put(`/api/v1/orders/${order.id}/process`, { trangThai: status })
    showToast('success', `HD-${order.id} → ${statusMap[status]}`)
    await fetchOrders()
  } catch (e) {
    showToast('error', e.response?.data || 'Cập nhật thất bại')
  } finally {
    updating.value = null
  }
}

async function updateStatus(status) {
  if (!selectedOrder.value) return
  await quickUpdate(selectedOrder.value, status)
  // refresh selectedOrder
  const updated = orders.value.find(o => o.id === selectedOrder.value.id)
  if (updated) selectedOrder.value = updated
  else showDetail.value = false
}

function openDetail(order) {
  selectedOrder.value = order
  showDetail.value = true
}

function confirmCancel(order) {
  cancelTarget.value = order
  cancelReason.value = ''
  showCancelModal.value = true
  showDetail.value = false
}

async function doCancel() {
  if (!cancelReason.value.trim()) return
  updating.value = cancelTarget.value.id
  try {
    await apiClient.put(`/api/v1/orders/${cancelTarget.value.id}/process`, {
      trangThai: 'DA_HUY',
      lyDoHuy: cancelReason.value.trim()
    })
    showToast('success', `Đã hủy đơn HD-${cancelTarget.value.id}`)
    showCancelModal.value = false
    await fetchOrders()
  } catch (e) {
    showToast('error', e.response?.data || 'Hủy đơn thất bại')
  } finally {
    updating.value = null
  }
}

function confirmHandToShipper(order) {
  shipperTarget.value = order
  showShipperModal.value = true
  showDetail.value = false
}

async function doHandToShipper() {
  if (!shipperTarget.value) return
  updating.value = shipperTarget.value.id
  try {
    await apiClient.put(`/api/v1/orders/${shipperTarget.value.id}/process`, { trangThai: 'DANG_GIAO' })
    showToast('success', `🚴 HD-${shipperTarget.value.id} đã giao cho Shipper!`)
    showShipperModal.value = false
    await fetchOrders()
  } catch (e) {
    showToast('error', e.response?.data || 'Thất bại khi chuyển Shipper')
  } finally {
    updating.value = null
  }
}

function showToast(type, message) {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const initials = (email) => (email || '?').slice(0, 2).toUpperCase()
const getStatusLabel = (s) => statusMap[s] || s
const getBadgeClass  = (s) => badgeClass[s] || 'bg-slate-100 text-slate-500'

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

const formatDate = (val, withTime = true) => {
  if (!val) return '—'
  const d = new Date(val)
  return withTime
    ? d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('vi-VN')
}

const formatTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

// ── LIFECYCLE ─────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchOrders()
  // Auto-refresh mỗi 30 giây để nhận đơn mới
  autoRefreshTimer = setInterval(fetchOrders, 30_000)
})

onBeforeUnmount(() => {
  clearInterval(autoRefreshTimer)
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>