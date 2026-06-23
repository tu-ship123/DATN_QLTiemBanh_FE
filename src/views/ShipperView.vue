<template>
  <div class="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#F0F9FF] p-4 flex flex-col gap-4">

    <!-- ── HEADER ──────────────────────────────────────────────── -->
    <div class="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-3xl p-5 text-white shadow-lg shadow-blue-200">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-blue-200 text-xs font-bold uppercase tracking-wider mb-0.5">Hệ thống giao hàng</p>
          <h1 class="text-2xl font-black">🚴 Shipper Dashboard</h1>
          <p class="text-blue-100 text-sm mt-0.5">{{ totalDelivering }} đơn đang cần giao</p>
        </div>
        <button @click="fetchOrders" :disabled="loading"
          class="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all">
          <svg :class="loading ? 'animate-spin' : ''" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-3 gap-3 mt-4">
        <div class="bg-white/15 rounded-2xl p-3 text-center">
          <div class="text-2xl font-black">{{ totalDelivering }}</div>
          <div class="text-[10px] text-blue-100 font-bold uppercase">Đang giao</div>
        </div>
        <div class="bg-white/15 rounded-2xl p-3 text-center">
          <div class="text-2xl font-black">{{ todayCompleted }}</div>
          <div class="text-[10px] text-blue-100 font-bold uppercase">Hôm nay xong</div>
        </div>
        <div class="bg-white/15 rounded-2xl p-3 text-center">
          <div class="text-2xl font-black">{{ formatRevenue(totalRevenue) }}</div>
          <div class="text-[10px] text-blue-100 font-bold uppercase">Tổng COD</div>
        </div>
      </div>
    </div>

    <!-- ── TABS ────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl p-1 flex border border-slate-100 shadow-sm">
      <button @click="activeTab = 'DANG_GIAO'"
        :class="activeTab === 'DANG_GIAO'
          ? 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white shadow-md'
          : 'text-slate-500 hover:text-slate-700'"
        class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
        🚴 Đang giao
        <span :class="activeTab === 'DANG_GIAO' ? 'bg-white/30' : 'bg-slate-100'"
          class="text-xs px-2 py-0.5 rounded-full font-black">{{ totalDelivering }}</span>
      </button>
      <button @click="activeTab = 'HOAN_THANH'"
        :class="activeTab === 'HOAN_THANH'
          ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-md'
          : 'text-slate-500 hover:text-slate-700'"
        class="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
        ✅ Đã giao xong
        <span :class="activeTab === 'HOAN_THANH' ? 'bg-white/30' : 'bg-slate-100'"
          class="text-xs px-2 py-0.5 rounded-full font-black">{{ todayCompleted }}</span>
      </button>
    </div>

    <!-- ── LOADING ─────────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- ── EMPTY STATE ─────────────────────────────────────────── -->
    <div v-else-if="visibleOrders.length === 0"
      class="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100">
      <div class="text-6xl mb-4">{{ activeTab === 'DANG_GIAO' ? '📭' : '🎉' }}</div>
      <h3 class="font-black text-[#1E2A3B] text-lg">
        {{ activeTab === 'DANG_GIAO' ? 'Chưa có đơn nào cần giao' : 'Chưa có đơn nào hoàn thành hôm nay' }}
      </h3>
      <p class="text-sm text-slate-400 mt-1">
        {{ activeTab === 'DANG_GIAO' ? 'Tiệm bánh sẽ chuyển đơn khi bánh sẵn sàng.' : 'Hãy hoàn thành các đơn đang giao nhé!' }}
      </p>
    </div>

    <!-- ── ORDER CARDS ─────────────────────────────────────────── -->
    <div v-else class="flex flex-col gap-3">
      <div v-for="order in visibleOrders" :key="order.id"
        class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">

        <!-- Card top bar -->
        <div :class="activeTab === 'DANG_GIAO' ? 'from-[#3B82F6] to-[#6366F1]' : 'from-emerald-500 to-green-400'"
          class="bg-gradient-to-r px-5 py-3 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 rounded-xl px-3 py-1">
              <span class="text-white font-black text-sm">HD-{{ order.id }}</span>
            </div>
            <span class="text-white/80 text-xs font-medium">{{ formatTime(order.ngayTao) }}</span>
          </div>
          <span class="text-white text-sm font-black">{{ formatCurrency(order.tongTien) }}</span>
        </div>

        <!-- Card body -->
        <div class="p-5 space-y-3">

          <!-- Address (primary info for shipper) -->
          <div class="flex items-start gap-3 bg-blue-50 rounded-2xl p-3.5">
            <div class="text-2xl flex-shrink-0">📍</div>
            <div>
              <p class="text-xs font-bold text-blue-600 uppercase tracking-wide mb-0.5">Địa chỉ giao</p>
              <p class="text-sm font-semibold text-[#1E2A3B]">{{ order.diaChiGiaoHang || 'Chưa có địa chỉ' }}</p>
            </div>
          </div>

          <!-- Customer & items -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-slate-50 rounded-2xl p-3">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Khách hàng</p>
              <p class="text-xs font-semibold text-[#1E2A3B] truncate">{{ order.emailNguoiDung }}</p>
              <p v-if="order.soDienThoai" class="text-xs text-blue-600 font-semibold mt-0.5">📞 {{ order.soDienThoai }}</p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-3">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Hàng hóa</p>
              <p class="text-xs font-semibold text-[#1E2A3B]">{{ order.items?.length || 0 }} loại bánh</p>
              <p class="text-[11px] text-slate-400 mt-0.5 truncate">
                {{ order.items?.map(i => i.tenSanPham).join(', ') }}
              </p>
            </div>
          </div>

          <!-- Expected delivery date -->
          <div v-if="order.ngayGiaoHang" class="flex items-center gap-2 text-sm">
            <span class="text-amber-500">⏰</span>
            <span class="text-slate-500 text-xs">Giao trước:</span>
            <span class="text-xs font-bold text-amber-600">{{ formatDate(order.ngayGiaoHang, false) }}</span>
          </div>

          <!-- Note -->
          <div v-if="order.ghiChu" class="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            📝 {{ order.ghiChu }}
          </div>

          <!-- ACTION BUTTONS -->
          <div v-if="activeTab === 'DANG_GIAO'" class="flex gap-2 pt-1">
            <!-- Open map -->
            <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.diaChiGiaoHang || '')}`"
              target="_blank"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-all text-center">
              🗺️ Xem bản đồ
            </a>
            <!-- Confirm delivered -->
            <button @click="confirmDelivered(order)" :disabled="updating === order.id"
              class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:opacity-90 transition-all disabled:opacity-60 shadow-md shadow-emerald-200">
              <span v-if="updating === order.id" class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
              ✅ Đã giao xong
            </button>
          </div>

          <!-- Completed badge -->
          <div v-else class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p class="text-sm font-bold text-emerald-600">🎉 Đã giao thành công</p>
            <p v-if="order.thoiDiemGiao" class="text-xs text-emerald-500 mt-0.5">
              Lúc {{ formatTime(order.thoiDiemGiao) }}
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- ── CONFIRM DELIVERED MODAL ─────────────────────────────── -->
    <div v-if="showConfirmModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showConfirmModal = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-black text-[#1E2A3B] mb-2">Xác nhận đã giao?</h3>
        <p class="text-sm text-slate-500 mb-2">
          Đơn <strong class="text-blue-600">HD-{{ confirmTarget?.id }}</strong> sẽ chuyển sang <strong class="text-emerald-600">Hoàn thành</strong>.
        </p>
        <div class="bg-slate-50 rounded-2xl p-3 mb-5 text-sm text-left">
          <p class="text-slate-500">📍 {{ confirmTarget?.diaChiGiaoHang }}</p>
          <p class="font-bold text-[#1E2A3B] mt-1">💰 {{ formatCurrency(confirmTarget?.tongTien) }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="showConfirmModal = false"
            class="flex-1 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-500 hover:bg-slate-50">
            Chưa giao
          </button>
          <button @click="doDelivered" :disabled="!!updating"
            class="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:opacity-90 shadow-lg shadow-emerald-200 disabled:opacity-50">
            Đã giao rồi ✅
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show"
        :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] text-white px-6 py-3 rounded-2xl shadow-xl font-semibold text-sm whitespace-nowrap">
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import apiClient from '@/services/apiService'

// ── STATE ─────────────────────────────────────────────────────────────────────
const orders            = ref([])
const loading           = ref(false)
const updating          = ref(null)
const activeTab         = ref('DANG_GIAO')
const showConfirmModal  = ref(false)
const confirmTarget     = ref(null)
const toast             = ref({ show: false, type: '', message: '' })
let   autoRefreshTimer  = null

// ── COMPUTED ─────────────────────────────────────────────────────────────────
const deliveringOrders = computed(() =>
  orders.value.filter(o => o.trangThai === 'DANG_GIAO')
)

const completedOrders = computed(() => {
  const today = new Date().toDateString()
  return orders.value.filter(o => {
    if (o.trangThai !== 'HOAN_THANH') return false
    // Nếu có thoiDiemGiao thì lọc theo ngày hôm nay
    if (o.thoiDiemGiao) return new Date(o.thoiDiemGiao).toDateString() === today
    if (o.ngayCapNhat)  return new Date(o.ngayCapNhat).toDateString() === today
    return true
  })
})

const visibleOrders = computed(() =>
  activeTab.value === 'DANG_GIAO' ? deliveringOrders.value : completedOrders.value
)

const totalDelivering = computed(() => deliveringOrders.value.length)
const todayCompleted  = computed(() => completedOrders.value.length)
const totalRevenue    = computed(() =>
  deliveringOrders.value.reduce((sum, o) => sum + (o.tongTien || 0), 0)
)

// ── METHODS ───────────────────────────────────────────────────────────────────
async function fetchOrders() {
  loading.value = true
  try {
    const res = await apiClient.get('/api/v1/orders')
    orders.value = res.data
  } catch (e) {
    showToast('error', 'Không thể tải đơn hàng')
  } finally {
    loading.value = false
  }
}

function confirmDelivered(order) {
  confirmTarget.value = order
  showConfirmModal.value = true
}

async function doDelivered() {
  if (!confirmTarget.value) return
  updating.value = confirmTarget.value.id
  try {
    await apiClient.put(`/api/v1/orders/${confirmTarget.value.id}/process`, {
      trangThai: 'HOAN_THANH'
    })
    showToast('success', `🎉 HD-${confirmTarget.value.id} đã giao xong!`)
    showConfirmModal.value = false
    await fetchOrders()
  } catch (e) {
    showToast('error', e.response?.data || 'Cập nhật thất bại')
  } finally {
    updating.value = null
  }
}

function showToast(type, message) {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)

const formatRevenue = (val) => {
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M'
  if (val >= 1_000)     return (val / 1_000).toFixed(0) + 'K'
  return String(val)
}

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
  // Auto-refresh mỗi 20 giây
  autoRefreshTimer = setInterval(fetchOrders, 20_000)
})

onBeforeUnmount(() => {
  clearInterval(autoRefreshTimer)
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>