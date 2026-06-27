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
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl group-hover:bg-blue-100 transition">
            💬
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
          <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl group-hover:bg-purple-100 transition">
            📈
          </div>
        </div>
        <h3 class="font-bold text-sm mb-1" style="color:#5C4428">Phân tích</h3>
        <p class="text-xs text-muted">Báo cáo doanh số</p>
        <div class="text-xs font-semibold mt-3" style="color:#7A5C3A">Xem chi tiết →</div>
      </RouterLink>

      <!-- Inventory -->
      <RouterLink to="/inventory" class="action-card group cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-2xl group-hover:bg-yellow-100 transition">
            📦
          </div>
        </div>
        <h3 class="font-bold text-sm mb-1" style="color:#5C4428">Kho hàng</h3>
        <p class="text-xs text-muted">Quản lý tồn kho</p>
        <div class="text-xs font-semibold mt-3" style="color:#7A5C3A">Xem chi tiết →</div>
      </RouterLink>

      <!-- Promotions -->
      <RouterLink to="/vouchers" class="action-card group cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-2xl group-hover:bg-pink-100 transition">
            🎫
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

const recentOrders = [
  { id:'#DH2045', product:'Bánh 3D Custom – Mèo Shiba', initials:'NK', avatarBg:'#FDF6EC', avatarColor:'#7A5C3A', status:'Sản xuất',   statusColor:'warning', amount:'2,500,000đ', time:'2 phút trước' },
  { id:'#DH2044', product:'Bánh sinh nhật 3 tầng',      initials:'TH', avatarBg:'#F0FDF4', avatarColor:'#22C55E', status:'Hoàn thành', statusColor:'success', amount:'1,800,000đ', time:'18 phút trước' },
  { id:'#DH2043', product:'Bánh cưới kem tươi',         initials:'LM', avatarBg:'#EFF6FF', avatarColor:'#3B82F6', status:'Chờ nhận',   statusColor:'info',    amount:'4,200,000đ', time:'45 phút trước' },
  { id:'#DH2042', product:'Cupcake set 12 cái',         initials:'PT', avatarBg:'#F5F3FF', avatarColor:'#7C3AED', status:'Sản xuất',   statusColor:'warning', amount:'350,000đ',   time:'1 giờ trước' },
  { id:'#DH2041', product:'Bánh mousse chanh leo',      initials:'BL', avatarBg:'#FDF6EC', avatarColor:'#7A5C3A', status:'Hoàn thành', statusColor:'success', amount:'520,000đ',   time:'2 giờ trước' },
]

const topProducts = [
  { name:'Bánh sinh nhật 3D',     icon:'ph:cake-duotone', qty:'128 cái', revenue:'64M đ',   pct:100 },
  { name:'Cupcake nhiều màu',     icon:'ph:cookie-duotone', qty:'96 cái',  revenue:'28.8M đ', pct:75  },
  { name:'Bánh mousse chanh leo', icon:'ph:confetti-duotone', qty:'72 cái',  revenue:'37.4M đ', pct:56  },
  { name:'Macaron hỗn hợp',      icon:'ph:candy-duotone', qty:'64 hộp',  revenue:'16M đ',   pct:50  },
  { name:'Bánh cưới cao cấp',    icon:'ph:rings-duotone', qty:'18 cái',  revenue:'90M đ',   pct:14  },
]

const productionOrders = [
  { id:'#DH2045', product:'Bánh 3D Mèo Shiba',  customer:'Nguyễn Khoa', deadline:'14:00', progress:60,  status:'Đang làm',   color:'warning' },
  { id:'#DH2042', product:'Cupcake set 12',      customer:'Phạm Thu',    deadline:'15:30', progress:30,  status:'Chuẩn bị',   color:'info'    },
  { id:'#DH2048', product:'Bánh cưới 5 tầng',   customer:'Lê Minh',     deadline:'17:00', progress:90,  status:'Hoàn thiện', color:'success' },
  { id:'#DH2050', product:'Bánh mousse dâu',     customer:'Cao Lan',     deadline:'11:00', progress:100, status:'Xong',       color:'success' },
  { id:'#DH2047', product:'Macaron hộp 24',      customer:'Bùi Lan',     deadline:'16:00', progress:15,  status:'Chờ',        color:'gray'    },
]

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

onMounted(async () => {
  initChart()
  isLoading.value = true
  await Promise.all([loadKPI(), loadRevenue()])
  isLoading.value = false
})
</script>