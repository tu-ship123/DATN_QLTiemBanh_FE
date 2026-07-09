<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Hệ thống</p>
        <h1 class="text-3xl font-semibold text-slate-900">Giám sát hệ thống (Health Check)</h1>
        <p class="mt-2 text-sm text-slate-500">Theo dõi tài nguyên máy chủ, thời gian hoạt động và tình trạng các dịch vụ.</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Hệ thống đang hoạt động
        </span>
        <el-button
          class="rounded-xl bg-gradient-to-r from-cake-500 to-orange-500 border-none text-white shadow-sm shadow-cake-200"
          :loading="refreshing"
          @click="refreshData"
        >
          <iconify-icon icon="ph:arrows-clockwise-duotone" class="mr-2 text-lg" />
          Làm mới
        </el-button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:clock-clockwise-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Uptime</p>
          <p class="text-xl font-bold text-slate-800">{{ stats.uptimeText }}</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:cpu-duotone" />
        </div>
        <div class="flex-1">
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">CPU</p>
          <p class="text-xl font-bold text-slate-800">{{ stats.cpu }}%</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:memory-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">RAM đang dùng</p>
          <p class="text-xl font-bold text-slate-800">{{ stats.ram }}% <span class="text-sm font-normal text-slate-400">({{ stats.ramUsedText }})</span></p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:hard-drive-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Dung lượng ổ đĩa</p>
          <p class="text-xl font-bold text-slate-800">{{ stats.disk }}%</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <!-- RAM chart -->
      <el-card class="rounded-[28px] border border-slate-200 shadow-sm xl:col-span-2" body-class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-slate-800">Mức sử dụng RAM (24h gần nhất)</h3>
            <p class="text-xs text-slate-400 mt-0.5">Cập nhật lúc {{ stats.lastUpdated }}</p>
          </div>
          <span class="text-xs font-semibold text-slate-400">Đơn vị: %</span>
        </div>
        <div style="height:280px">
          <canvas ref="ramChartRef"></canvas>
        </div>
      </el-card>

      <!-- Service status -->
      <el-card class="rounded-[28px] border border-slate-200 shadow-sm" body-class="p-0">
        <div class="p-5 border-b border-slate-100">
          <h3 class="font-semibold text-slate-800">Trạng thái dịch vụ</h3>
        </div>
        <div class="divide-y divide-slate-100">
          <div v-for="s in services" :key="s.name" class="flex items-center justify-between px-5 py-3.5">
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                :class="s.status === 'up' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'"
              >
                <iconify-icon :icon="s.icon" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ s.name }}</p>
                <p class="text-xs text-slate-400">{{ s.latency }}ms phản hồi</p>
              </div>
            </div>
            <el-tag :type="s.status === 'up' ? 'success' : 'danger'" effect="light" round>
              {{ s.status === 'up' ? 'Online' : 'Offline' }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Uptime history -->
    <el-card class="mt-4 rounded-[28px] border border-slate-200 shadow-sm" body-class="p-0">
      <div class="p-5 border-b border-slate-100">
        <h3 class="font-semibold text-slate-800">Lịch sử uptime 14 ngày qua</h3>
      </div>
      <div class="p-5">
        <div class="flex items-end gap-1.5" style="height:90px">
          <el-tooltip
            v-for="d in uptimeHistory"
            :key="d.date"
            :content="`${d.date}: ${d.uptime}% uptime`"
            placement="top"
          >
            <div class="flex-1 rounded-md" :class="d.uptime >= 99.9 ? 'bg-green-400' : d.uptime >= 99 ? 'bg-yellow-400' : 'bg-red-400'" :style="{ height: (d.uptime - 90) * 9 + 'px' }"></div>
          </el-tooltip>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{{ uptimeHistory[0]?.date }}</span>
          <span>{{ uptimeHistory[uptimeHistory.length - 1]?.date }}</span>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import Chart from 'chart.js/auto'

const ramChartRef = ref(null)
let ramChart = null
const refreshing = ref(false)

const stats = ref({
  uptimeText: '32 ngày 14 giờ',
  cpu: 38,
  ram: 62,
  ramUsedText: '4.9GB / 8GB',
  disk: 47,
  lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
})

const services = ref([
  { name: 'API Backend',      icon: 'ph:plugs-connected-duotone', status: 'up', latency: 42 },
  { name: 'Cơ sở dữ liệu',    icon: 'ph:database-duotone',        status: 'up', latency: 18 },
  { name: 'Redis Cache',       icon: 'ph:lightning-duotone',       status: 'up', latency: 4 },
  { name: 'Lưu trữ file (S3)', icon: 'ph:cloud-duotone',           status: 'up', latency: 65 },
])

// Mock 24h RAM (%) — sẽ thay bằng dữ liệu thật từ API giám sát
function genRamSeries() {
  const labels = []
  const data = []
  for (let i = 23; i >= 0; i--) {
    const h = (new Date().getHours() - i + 24) % 24
    labels.push(`${h}h`)
    data.push(Math.round(45 + Math.random() * 30))
  }
  return { labels, data }
}

const uptimeHistory = ref(Array.from({ length: 14 }).map((_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (13 - i))
  const uptime = Math.random() > 0.85 ? Math.round((98 + Math.random() * 1.5) * 100) / 100 : 100
  return { date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), uptime }
}))

function renderRamChart() {
  if (!ramChartRef.value) return
  const { labels, data } = genRamSeries()
  ramChart?.destroy()
  ramChart = new Chart(ramChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'RAM sử dụng (%)',
        data,
        borderColor: '#fb923c',
        backgroundColor: 'rgba(251, 146, 60, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f97316',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff', titleColor: '#1f2937', bodyColor: '#1f2937',
          borderColor: '#e5e7eb', borderWidth: 1, padding: 10, displayColors: false,
          callbacks: { label: ctx => `${ctx.formattedValue}% RAM` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 8 } },
        y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
      },
    },
  })
}

let timer = null
function refreshData() {
  refreshing.value = true
  setTimeout(() => {
    stats.value.cpu = Math.round(25 + Math.random() * 40)
    stats.value.ram = Math.round(45 + Math.random() * 30)
    stats.value.lastUpdated = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    renderRamChart()
    refreshing.value = false
    ElMessage.success('Đã cập nhật số liệu hệ thống')
  }, 700)
}

onMounted(async () => {
  await nextTick()
  renderRamChart()
  timer = setInterval(() => { stats.value.lastUpdated = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }, 60000)
})

onBeforeUnmount(() => {
  ramChart?.destroy()
  if (timer) clearInterval(timer)
})
</script>
