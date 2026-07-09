<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Báo cáo doanh thu</h1>
          <p class="text-sm text-muted">Doanh thu theo kênh bán và top sản phẩm bán chạy</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select v-model="rangeLabel" class="border border-[#EDE0CC] rounded-xl px-3 py-2 text-sm" style="color:#5C4428">
            <option>Tháng này</option>
            <option>3 tháng gần đây</option>
            <option>6 tháng</option>
            <option>Năm nay</option>
          </select>
          <button
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650)"
            :disabled="exporting"
            @click="exportExcel"
          >
            <iconify-icon icon="ph:file-xls-duotone" class="text-lg"></iconify-icon>
            {{ exporting ? 'Đang xuất...' : 'Xuất Excel' }}
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:coins-duotone" class="text-[#7A5C3A]"></iconify-icon> Tổng doanh thu</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">{{ kpi.totalRevenueText }}</div>
          <div class="text-xs text-muted mt-2">Tổng hợp tất cả các kênh</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:storefront-duotone" class="text-[#3B82F6]"></iconify-icon> Kênh đóng góp nhiều nhất</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">{{ kpi.topChannel }}</div>
          <div class="text-xs text-muted mt-2">{{ kpi.topChannelPct }}% tổng doanh thu</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:cake-duotone" class="text-[#22C55E]"></iconify-icon> Sản phẩm bán chạy nhất</div>
          <div class="text-lg font-bold truncate" style="color:#22C55E">{{ kpi.topProduct }}</div>
          <div class="text-xs text-muted mt-2">{{ kpi.topProductQty }} sản phẩm đã bán</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:receipt-duotone" class="text-[#F59E0B]"></iconify-icon> Giá trị đơn TB</div>
          <div class="text-3xl font-bold" style="color:#F59E0B">{{ kpi.avgOrderText }}</div>
          <div class="text-xs text-muted mt-2">Trên toàn bộ đơn hàng</div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-4">
      <!-- Pie chart: Doanh thu theo kênh -->
      <div class="data-card xl:col-span-2">
        <div class="data-card-header">
          <h3 class="font-bold" style="color:#5C4428">Doanh thu theo kênh</h3>
        </div>
        <div class="p-4">
          <div style="height:230px">
            <canvas ref="channelChartRef"></canvas>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="c in channelData" :key="c.name" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: c.color }"></span>
                <span style="color:#5C4428">{{ c.name }}</span>
              </div>
              <div class="text-right">
                <span class="font-semibold" style="color:#5C4428">{{ formatMoney(c.value) }}</span>
                <span class="text-muted ml-1">({{ c.pct }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bar chart: Top 10 sản phẩm -->
      <div class="data-card xl:col-span-3">
        <div class="data-card-header">
          <h3 class="font-bold" style="color:#5C4428">Top 10 sản phẩm bán chạy</h3>
          <span class="text-xs text-muted">Theo số lượng đã bán</span>
        </div>
        <div class="p-4" style="height:320px">
          <canvas ref="productChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Chi tiết doanh thu theo kênh (bảng, phục vụ xuất Excel) -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#5C4428">Chi tiết top 10 sản phẩm</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-[#FDF8F2]">
            <tr>
              <th class="text-left p-4 font-semibold text-muted">#</th>
              <th class="text-left p-4 font-semibold text-muted">Sản phẩm</th>
              <th class="text-left p-4 font-semibold text-muted">Danh mục</th>
              <th class="text-right p-4 font-semibold text-muted">Số lượng bán</th>
              <th class="text-right p-4 font-semibold text-muted">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in topProducts" :key="p.name" class="border-b border-[#FDF8F2] hover:bg-[#FFFBF5]">
              <td class="p-4 font-bold" style="color:#7A5C3A">{{ i + 1 }}</td>
              <td class="p-4 flex items-center gap-2" style="color:#5C4428">
                <iconify-icon :icon="p.icon" class="text-lg text-[#7A5C3A]"></iconify-icon>
                {{ p.name }}
              </td>
              <td class="p-4 text-muted">{{ p.category }}</td>
              <td class="p-4 text-right font-semibold" style="color:#5C4428">{{ p.qty }}</td>
              <td class="p-4 text-right font-bold" style="color:#7A5C3A">{{ formatMoney(p.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'

const rangeLabel = ref('Tháng này')
const exporting = ref(false)

const channelChartRef = ref(null)
const productChartRef = ref(null)
let channelChart = null
let productChart = null

// ── DỮ LIỆU TĨNH (mock) — sẽ thay bằng API sau ──
const channelData = ref([
  { name: 'Bán tại cửa hàng (POS)', value: 86000000, color: '#7A5C3A' },
  { name: 'Đặt hàng online (Web)',  value: 64500000, color: '#F59E0B' },
  { name: 'Ứng dụng di động',       value: 38200000, color: '#3B82F6' },
  { name: 'Đối tác giao hàng',      value: 21300000, color: '#22C55E' },
])

const topProducts = ref([
  { name: 'Bánh kem dâu tây',        category: 'Bánh kem',   qty: 328, revenue: 49200000, icon: 'ph:cake-duotone' },
  { name: 'Bánh su kem',             category: 'Bánh ngọt',  qty: 301, revenue: 21070000, icon: 'ph:cookie-duotone' },
  { name: 'Bánh mì bơ tỏi',          category: 'Bánh mặn',   qty: 276, revenue: 13800000, icon: 'ph:bread-duotone' },
  { name: 'Bánh kem chocolate',      category: 'Bánh kem',   qty: 254, revenue: 40640000, icon: 'ph:cake-duotone' },
  { name: 'Bánh trung thu thập cẩm', category: 'Bánh đặc biệt', qty: 231, revenue: 34650000, icon: 'ph:confetti-duotone' },
  { name: 'Bánh macaron set 6 cái',  category: 'Bánh ngọt',  qty: 219, revenue: 21900000, icon: 'ph:candy-duotone' },
  { name: 'Bánh cupcake vani',       category: 'Bánh ngọt',  qty: 198, revenue: 9900000,  icon: 'ph:cookie-duotone' },
  { name: 'Bánh kem hoa hồng',       category: 'Bánh kem',   qty: 176, revenue: 30800000, icon: 'ph:flower-duotone' },
  { name: 'Bánh mì que phô mai',     category: 'Bánh mặn',   qty: 165, revenue: 8250000,  icon: 'ph:bread-duotone' },
  { name: 'Bánh tart trái cây',      category: 'Bánh ngọt',  qty: 152, revenue: 15200000, icon: 'ph:cookie-duotone' },
])

const kpi = ref({
  totalRevenueText: '0đ',
  topChannel: '—', topChannelPct: 0,
  topProduct: '—', topProductQty: 0,
  avgOrderText: '0đ',
})

function formatMoney(n) {
  return Number(n || 0).toLocaleString('vi-VN') + ' đ'
}

function computeKpi() {
  const totalChannel = channelData.value.reduce((s, c) => s + c.value, 0) || 1
  channelData.value.forEach(c => { c.pct = Math.round((c.value / totalChannel) * 100) })
  const top = [...channelData.value].sort((a, b) => b.value - a.value)[0]
  const topP = topProducts.value[0]

  const totalOrdersMock = 612
  kpi.value = {
    totalRevenueText: formatMoney(totalChannel),
    topChannel: top?.name || '—',
    topChannelPct: top?.pct || 0,
    topProduct: topP?.name || '—',
    topProductQty: topP?.qty || 0,
    avgOrderText: formatMoney(Math.round(totalChannel / totalOrdersMock)),
  }
}

function renderChannelChart() {
  if (!channelChartRef.value) return
  channelChart?.destroy()
  channelChart = new Chart(channelChartRef.value, {
    type: 'doughnut',
    data: {
      labels: channelData.value.map(c => c.name),
      datasets: [{
        data: channelData.value.map(c => c.value),
        backgroundColor: channelData.value.map(c => c.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#5C4428',
          bodyColor: '#5C4428',
          borderColor: '#EDE0CC',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => `${ctx.label}: ${Number(ctx.parsed).toLocaleString('vi-VN')} đ`,
          },
        },
      },
    },
  })
}

function renderProductChart() {
  if (!productChartRef.value) return
  productChart?.destroy()
  productChart = new Chart(productChartRef.value, {
    type: 'bar',
    data: {
      labels: topProducts.value.map(p => p.name),
      datasets: [{
        label: 'Số lượng bán',
        data: topProducts.value.map(p => p.qty),
        backgroundColor: '#B8956A',
        hoverBackgroundColor: '#7A5C3A',
        borderRadius: 8,
        maxBarThickness: 28,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#5C4428',
          bodyColor: '#5C4428',
          borderColor: '#EDE0CC',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: ctx => `${Number(ctx.parsed.x).toLocaleString('vi-VN')} sản phẩm`,
          },
        },
      },
      scales: {
        x: { grid: { color: '#F5EFE3' }, ticks: { color: '#9A7650' } },
        y: { grid: { display: false }, ticks: { color: '#5C4428', font: { weight: 600 } } },
      },
    },
  })
}

// ── XUẤT EXCEL (dữ liệu tĩnh hiện tại) ──
async function exportExcel() {
  if (exporting.value) return
  exporting.value = true
  try {
    const channelRows = channelData.value.map(c => ({
      'Kênh bán': c.name,
      'Doanh thu (đ)': c.value,
      'Tỉ lệ (%)': c.pct,
    }))
    const productRows = topProducts.value.map((p, i) => ({
      'Hạng': i + 1,
      'Sản phẩm': p.name,
      'Danh mục': p.category,
      'Số lượng bán': p.qty,
      'Doanh thu (đ)': p.revenue,
    }))

    const wsChannel = XLSX.utils.json_to_sheet(channelRows)
    const wsProduct = XLSX.utils.json_to_sheet(productRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, wsChannel, 'Doanh thu theo kênh')
    XLSX.utils.book_append_sheet(wb, wsProduct, 'Top 10 sản phẩm')

    const ts = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
    XLSX.writeFile(wb, `bao-cao-doanh-thu-${ts}.xlsx`)

    ElMessage.success('Đã xuất báo cáo ra file Excel!')
  } catch (err) {
    ElMessage.error('Xuất file thất bại: ' + err.message)
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  computeKpi()
  await nextTick()
  renderChannelChart()
  renderProductChart()
})
</script>
