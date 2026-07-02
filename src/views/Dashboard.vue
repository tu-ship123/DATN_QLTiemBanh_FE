<template>
  <div>
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="font-display font-black text-2xl" style="color:#5C4428">Tổng quan hôm nay</h1>
      <p class="text-sm text-muted mt-0.5">{{ today }} · Cập nhật lúc {{ updateTime }}</p>
    </div>

    <!-- ===== STAT CARDS ===== -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.key"
        class="stat-card group"
      >
        <!-- icon + trend -->
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            :style="{ background: stat.bgColor }"
          ><iconify-icon :icon="stat.icon" class="text-xl text-[#7A5C3A]"></iconify-icon></div>
          <span
            class="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full"
            :class="stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'"
          >
            {{ stat.trendUp ? '↑' : '↓' }} {{ stat.trend }}
          </span>
        </div>
        <div class="font-display font-black text-2xl mb-0.5" style="color:#5C4428">{{ stat.value }}</div>
        <div class="text-sm text-muted">{{ stat.label }}</div>
        <div class="mt-3 text-xs text-muted">so với hôm qua</div>
      </div>
    </div>

    <!-- ===== CHARTS + RECENT ORDERS ROW ===== -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
      <!-- Revenue Chart -->
      <div class="data-card xl:col-span-2">
        <div class="data-card-header">
          <div>
            <div class="font-display font-bold text-base" style="color:#5C4428">Phân tích doanh thu</div>
            <div class="text-xs text-muted mt-0.5">Năm 2026 · Tất cả sản phẩm</div>
          </div>
          <div class="flex gap-1">
            <button
              v-for="p in ['Tháng', 'Quý', 'Năm']"
              :key="p"
              class="text-xs px-3 py-1.5 rounded-xl font-semibold transition"
              :class="period === p
                ? 'text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'"
              :style="period === p ? 'background:linear-gradient(135deg,#7A5C3A,#9A7650)' : ''"
              @click="period = p; updateChart()"
            >{{ p }}</button>
          </div>
        </div>
        <div class="p-4" style="height:270px">
          <canvas id="revenue-chart"></canvas>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="data-card">
        <div class="data-card-header">
          <div class="font-display font-bold text-base" style="color:#5C4428">Hoạt động gần đây</div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-xs font-semibold text-green-600">Trực tiếp</span>
          </div>
        </div>
        <div class="divide-y divide-[#FDF8F2] overflow-y-auto" style="max-height:248px">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="px-4 py-3 hover:bg-[#FFFBF5] transition cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                :style="{ background: order.avatarBg, color: order.avatarColor }"
              >{{ order.initials }}</div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <span class="text-sm font-semibold" style="color:#5C4428">{{ order.id }}</span>
                  <span class="badge" :class="`badge-${order.statusColor}`">{{ order.status }}</span>
                </div>
                <div class="text-xs text-muted truncate">{{ order.product }}</div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="text-sm font-bold" style="color:#7A5C3A">{{ order.amount }}</div>
                <div class="text-xs text-muted">{{ order.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-3 border-t border-[var(--color-border)]">
          <RouterLink to="/orders" class="btn-secondary w-full justify-center text-center text-sm py-2">
            Xem tất cả đơn hàng →
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- ===== QUICK ACTIONS ===== -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      <!-- Messages -->
      <RouterLink to="/messages" class="action-card group cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition">
            <iconify-icon icon="ph:chat-teardrop-dots-duotone" class="text-2xl" style="color:#3B82F6" />
          </div>
          <span class="badge-primary">3</span>
        </div>
        <h3 class="font-bold text-sm mb-1" style="color:#5C4428">Tin nhắn</h3>
        <p class="text-xs text-muted">Quản lý liên hệ khách hàng</p>
        <div class="text-xs font-semibold mt-3" style="color:#7A5C3A">Xem chi tiết →</div>
      </RouterLink>

      <!-- Analytics -->
      <RouterLink to="/analytics" class="action-card group cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
            <iconify-icon icon="ph:chart-line-up-duotone" class="text-2xl" style="color:#7C3AED" />
          </div>
        </div>
        <h3 class="font-bold text-sm mb-1" style="color:#5C4428">Phân tích</h3>
        <p class="text-xs text-muted">Báo cáo doanh số</p>
        <div class="text-xs font-semibold mt-3" style="color:#7A5C3A">Xem chi tiết →</div>
      </RouterLink>

      <!-- Inventory -->
      <RouterLink to="/inventory" class="action-card group cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition">
            <iconify-icon icon="ph:package-duotone" class="text-2xl" style="color:#D97706" />
          </div>
        </div>
        <h3 class="font-bold text-sm mb-1" style="color:#5C4428">Kho hàng</h3>
        <p class="text-xs text-muted">Quản lý tồn kho</p>
        <div class="text-xs font-semibold mt-3" style="color:#7A5C3A">Xem chi tiết →</div>
      </RouterLink>

      <!-- Promotions -->
      <RouterLink to="/vouchers" class="action-card group cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition">
            <iconify-icon icon="ph:ticket-duotone" class="text-2xl" style="color:#EC4899" />
          </div>
        </div>
        <h3 class="font-bold text-sm mb-1" style="color:#5C4428">Khuyến mãi</h3>
        <p class="text-xs text-muted">Voucher & Ưu đãi</p>
        <div class="text-xs font-semibold mt-3" style="color:#7A5C3A">Xem chi tiết →</div>
      </RouterLink>
    </div>

    <!-- ===== BOTTOM ROW ===== -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Top Products -->
      <div class="data-card">
        <div class="data-card-header">
          <div class="font-display font-bold text-base" style="color:#5C4428">Sản phẩm bán chạy</div>
          <RouterLink to="/products" class="text-xs font-semibold" style="color:#7A5C3A">Xem thêm</RouterLink>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(p, i) in topProducts" :key="p.name" class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black"
              :style="i === 0 ? 'background:#FDF6EC;color:#7A5C3A' : 'background:#F5F5F5;color:#9CA3AF'"
            >#{{ i + 1 }}</span>
            <span class="text-xl text-[#7A5C3A]"><iconify-icon :icon="p.icon"></iconify-icon></span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold truncate" style="color:#5C4428">{{ p.name }}</div>
              <div class="flex items-center gap-2 mt-0.5">
                <div class="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: p.pct + '%', background: 'linear-gradient(90deg,#7A5C3A,#FBB830)' }"></div>
                </div>
                <span class="text-xs text-muted flex-shrink-0">{{ p.qty }}</span>
              </div>
            </div>
            <span class="text-sm font-bold" style="color:#5C4428; white-space:nowrap">{{ p.revenue }}</span>
          </div>
        </div>
      </div>

      <!-- Today's Production -->
      <div class="data-card xl:col-span-2">
        <div class="data-card-header">
          <div>
            <div class="font-display font-bold text-base" style="color:#5C4428">Lịch sản xuất hôm nay</div>
            <div class="text-xs text-muted mt-0.5">{{ productionOrders.length }} đơn đang xử lý</div>
          </div>
          <RouterLink to="/orders" class="text-xs font-semibold" style="color:#7A5C3A">Xem chi tiết</RouterLink>
        </div>
        <div class="p-4">
          <el-table :data="productionOrders" style="width:100%" :show-header="true" row-class-name="hover:bg-[#FFFBF5]">
            <el-table-column label="ĐƠN HÀNG" width="120">
              <template #default="{ row }">
                <span class="font-bold text-sm" style="color:#7A5C3A">{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SẢN PHẨM">
              <template #default="{ row }">
                <div class="text-sm font-medium" style="color:#5C4428">{{ row.product }}</div>
                <div class="text-xs text-muted">{{ row.customer }}</div>
              </template>
            </el-table-column>
            <el-table-column label="THỜI GIAN" width="100">
              <template #default="{ row }">
                <span class="text-sm" style="color:#5C4428">{{ row.deadline }}</span>
              </template>
            </el-table-column>
            <el-table-column label="TIẾN ĐỘ" width="130">
              <template #default="{ row }">
                <div class="flex items-center gap-2">
                  <el-progress
                    :percentage="row.progress"
                    :stroke-width="6"
                    :show-text="false"
                    :color="row.progress >= 80 ? '#22C55E' : row.progress >= 40 ? '#FBB830' : '#7A5C3A'"
                    style="flex:1"
                  />
                  <span class="text-xs font-semibold" style="color:#5C4428">{{ row.progress }}%</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="TRẠNG THÁI" width="120" align="center">
              <template #default="{ row }">
                <span class="badge" :class="`badge-${row.color}`">{{ row.status }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Chart from 'chart.js/auto'
import { dashboardService } from '../services/dashboardService'
import { orderService } from '../services/orderService'

const today = new Date().toLocaleDateString('vi-VN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
const updateTime = ref(new Date().toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' }))
const period = ref('Tháng')
const isLoading = ref(true)

const stats = ref([
  { key:'revenue', icon:'ph:coins-duotone', label:'Doanh thu hôm nay', value:'--', trend:'--', trendUp:true,  bgColor:'#FDF6EC' },
  { key:'orders',  icon:'ph:package-duotone', label:'Đơn hàng mới',      value:'--', trend:'--', trendUp:true,  bgColor:'#FDF8F2' },
  { key:'prod',    icon:'ph:clock-countdown-duotone', label:'Đang sản xuất',     value:'--', trend:'--', trendUp:false, bgColor:'#FFFBEB' },
  { key:'rating',  icon:'ph:user-duotone', label:'Khách mới',          value:'--', trend:'--', trendUp:true,  bgColor:'#F0FDF4' },
])

// Nạp từ API thật trong loadRecentAndProduction() / loadTopProducts()
const recentOrders = ref([])
const topProducts = ref([])
const productionOrders = ref([])

// Trạng thái -> nhãn tiếng Việt + màu badge dùng chung
const STATUS_META = {
  CHO_XAC_NHAN:   { label: 'Chờ xác nhận', color: 'info'    },
  DA_XAC_NHAN:    { label: 'Đã xác nhận',  color: 'info'    },
  DANG_CHUAN_BI:  { label: 'Sản xuất',     color: 'warning' },
  DANG_LAM:       { label: 'Sản xuất',     color: 'warning' },
  SAN_SANG:       { label: 'Sẵn sàng',     color: 'success' },
  DANG_GIAO:      { label: 'Đang giao',    color: 'info'    },
  DA_GIAO:        { label: 'Đã giao',      color: 'success' },
  HOAN_THANH:     { label: 'Hoàn thành',   color: 'success' },
  DA_THANH_TOAN:  { label: 'Đã thanh toán',color: 'success' },
  DA_HUY:         { label: 'Đã hủy',       color: 'danger'  },
  DA_HOAN_TIEN:   { label: 'Đã hoàn tiền', color: 'danger'  },
}

const AVATAR_COLORS = [
  { bg: '#FDF6EC', color: '#7A5C3A' }, { bg: '#F0FDF4', color: '#22C55E' },
  { bg: '#EFF6FF', color: '#3B82F6' }, { bg: '#F5F3FF', color: '#7C3AED' },
]

function initials(name = '') {
  const parts = String(name).trim().split(/\s+/)
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '?').slice(0, 2)).toUpperCase()
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  return `${Math.floor(hrs / 24)} ngày trước`
}

let revenueChart = null
const monthData    = ref([42,55,48,65,72,68,85,78,92,86,98,105].map(v => v * 1_000_000))
const quarterData  = ref([145_000_000, 201_000_000, 256_000_000, 312_000_000])
const yearData     = ref([890_000_000, 1_020_000_000, 1_150_000_000])
const monthLabels  = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']
const quarterLabels = ['Q1','Q2','Q3','Q4']
const yearLabels    = ['2022','2023','2024']

function buildChartData() {
  if (period.value === 'Tháng') return { labels: monthLabels,   data: monthData.value }
  if (period.value === 'Quý')   return { labels: quarterLabels, data: quarterData.value }
  return { labels: yearLabels, data: yearData.value }
}

function updateChart() {
  if (!revenueChart) return
  const { labels, data } = buildChartData()
  revenueChart.data.labels = labels
  revenueChart.data.datasets[0].data = data
  revenueChart.update()
}

// ── KPI: tongDoanhThu, tongDon, khachMoi, tangTruongDoanhThu, tangTruongDon ──
async function loadKPI() {
  try {
    const res = await dashboardService.getKPI()
    const d = res.data
    stats.value = [
      {
        key: 'revenue', icon: 'ph:coins-duotone', label: 'Doanh thu hôm nay',
        value: d.tongDoanhThu != null ? Number(d.tongDoanhThu).toLocaleString('vi-VN') + 'đ' : '0đ',
        trend: d.tangTruongDoanhThu != null ? `${d.tangTruongDoanhThu > 0 ? '+' : ''}${d.tangTruongDoanhThu}%` : '0%',
        trendUp: (d.tangTruongDoanhThu ?? 0) >= 0, bgColor: '#FDF6EC',
      },
      {
        key: 'orders', icon: 'ph:package-duotone', label: 'Đơn hàng mới',
        value: d.tongDon ?? 0,
        trend: d.tangTruongDon != null ? `${d.tangTruongDon > 0 ? '+' : ''}${d.tangTruongDon}%` : '0%',
        trendUp: (d.tangTruongDon ?? 0) >= 0, bgColor: '#EFF6FF',
      },
      {
        key: 'prod', icon: 'ph:clock-countdown-duotone', label: 'Đang sản xuất',
        value: '--', trend: '--', trendUp: false, bgColor: '#FFFBEB',
      },
      {
        key: 'customers', icon: 'ph:user-duotone', label: 'Khách mới',
        value: d.khachMoi ?? 0, trend: '--', trendUp: true, bgColor: '#F0FDF4',
      },
    ]
  } catch (err) {
    console.warn('Không load được KPI:', err.message)
  }
}

// ── Revenue: [{ date: 'YYYY-MM-DD', revenue: number }] ───────────────────────
async function loadRevenue() {
  try {
    const res = await dashboardService.getRevenue()
    const arr = res.data
    if (Array.isArray(arr) && arr.length > 0) {
      const labels = arr.map(item => {
        const d = new Date(item.date)
        return `T${d.getMonth() + 1}`
      })
      const data = arr.map(item => Number(item.revenue) || 0)
      monthData.value = data
      if (revenueChart) {
        revenueChart.data.labels = labels
        revenueChart.data.datasets[0].data = data
        revenueChart.update()
      }
    }
  } catch (err) {
    console.warn('Không load được doanh thu:', err.message)
  }
}

function initChart() {
  const ctx = document.getElementById('revenue-chart')?.getContext('2d')
  if (!ctx) return
  const { labels, data } = buildChartData()
  const grad = ctx.createLinearGradient(0, 0, 0, 260)
  grad.addColorStop(0, 'rgba(232,99,74,0.18)')
  grad.addColorStop(1, 'rgba(232,99,74,0.0)')
  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Doanh thu', data,
        borderColor: '#7A5C3A', backgroundColor: grad,
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointRadius: 4, pointBackgroundColor: '#7A5C3A',
        pointBorderColor: '#fff', pointBorderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#5C4428',
          titleFont: { family: 'Nunito', weight: '700' },
          bodyFont: { family: 'Be Vietnam Pro' },
          padding: 12, cornerRadius: 12,
          callbacks: { label: context => `${Number(context.parsed.y).toLocaleString('vi-VN')} đ` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Be Vietnam Pro', size: 11 }, color: '#B0A8A3' } },
        y: { grid: { color: '#F5EFEa', lineWidth: 1 }, ticks: { font: { family: 'Be Vietnam Pro', size: 11 }, color: '#B0A8A3', callback: v => Number(v).toLocaleString('vi-VN') + ' đ' } }
      }
    }
  })
}

// ── Đơn hàng gần đây + đang sản xuất + top sản phẩm (từ /api/v1/orders) ─────
const PROGRESS_BY_STATUS = {
  CHO_XAC_NHAN: 10, DA_XAC_NHAN: 25, DANG_CHUAN_BI: 50, DANG_LAM: 60,
  SAN_SANG: 90, DANG_GIAO: 95, DA_GIAO: 100, HOAN_THANH: 100, DA_THANH_TOAN: 100,
}

async function loadOrdersData() {
  try {
    const res = await orderService.getAllOrders()
    const orders = Array.isArray(res.data) ? res.data : (res.data?.content ?? [])

    // Sắp xếp mới nhất trước
    const sorted = [...orders].sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))

    // Hoạt động gần đây (5 đơn mới nhất)
    recentOrders.value = sorted.slice(0, 5).map((o, i) => {
      const meta = STATUS_META[o.trangThai] || { label: o.trangThai, color: 'info' }
      const colorSet = AVATAR_COLORS[i % AVATAR_COLORS.length]
      const firstItem = o.items?.[0]?.tenSanPham || '—'
      return {
        id: o.maDonHang || `#${o.id}`,
        product: firstItem + (o.items?.length > 1 ? ` +${o.items.length - 1}` : ''),
        initials: initials(o.emailNguoiDung),
        avatarBg: colorSet.bg, avatarColor: colorSet.color,
        status: meta.label, statusColor: meta.color,
        amount: Number(o.tongTien || 0).toLocaleString('vi-VN') + 'đ',
        time: timeAgo(o.ngayTao),
      }
    })

    // Đơn đang trong quá trình sản xuất hôm nay
    const inProduction = sorted.filter(o => ['DA_XAC_NHAN', 'DANG_CHUAN_BI', 'DANG_LAM', 'SAN_SANG'].includes(o.trangThai))
    productionOrders.value = inProduction.slice(0, 6).map(o => {
      const meta = STATUS_META[o.trangThai] || { label: o.trangThai, color: 'info' }
      return {
        id: o.maDonHang || `#${o.id}`,
        product: o.items?.[0]?.tenSanPham || '—',
        customer: o.emailNguoiDung || '—',
        deadline: o.ngayGiaoHang ? new Date(o.ngayGiaoHang).toLocaleDateString('vi-VN') : '—',
        progress: PROGRESS_BY_STATUS[o.trangThai] ?? 0,
        status: meta.label,
        color: meta.color,
      }
    })

    // Top sản phẩm bán chạy — tổng hợp số lượng & doanh thu từ toàn bộ đơn
    const agg = new Map()
    for (const o of orders) {
      for (const item of (o.items || [])) {
        const key = item.tenSanPham || 'Khác'
        const cur = agg.get(key) || { name: key, qty: 0, revenue: 0 }
        cur.qty += item.soLuong || 0
        cur.revenue += (item.soLuong || 0) * (item.giaBan || 0)
        agg.set(key, cur)
      }
    }
    const rankedProducts = [...agg.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    const maxRevenue = rankedProducts[0]?.revenue || 1
    topProducts.value = rankedProducts.map(p => ({
      name: p.name,
      icon: 'ph:cake-duotone',
      qty: `${p.qty} cái`,
      revenue: (p.revenue >= 1_000_000 ? (p.revenue / 1_000_000).toFixed(1) + 'M đ' : Number(p.revenue).toLocaleString('vi-VN') + 'đ'),
      pct: Math.round((p.revenue / maxRevenue) * 100),
    }))
  } catch (err) {
    console.warn('Không load được dữ liệu đơn hàng:', err.message)
  }
}

onMounted(async () => {
  initChart()
  isLoading.value = true
  await Promise.all([loadKPI(), loadRevenue(), loadOrdersData()])
  isLoading.value = false
})
</script>