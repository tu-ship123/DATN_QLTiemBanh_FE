<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Phân tích Kinh Doanh</h1>
          <p class="text-sm text-muted">Báo cáo và biểu đồ chi tiết về hoạt động bán hàng</p>
        </div>
        <div class="flex gap-2">
          <select class="border border-[#EDE0CC] rounded-xl px-3 py-2 text-sm" style="color:#5C4428">
            <option>Tháng này</option>
            <option>3 tháng gần đây</option>
            <option>6 tháng</option>
            <option>Năm nay</option>
          </select>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:coins-duotone" class="text-[#7A5C3A]"></iconify-icon> Doanh thu tháng</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">128,5M đ</div>
          <div class="text-xs text-green-600 mt-2">↑ 24.5% so tháng trước</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:package-duotone" class="text-[#3B82F6]" /> Tổng đơn hàng</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">284</div>
          <div class="text-xs text-green-600 mt-2">↑ 12 đơn so với ngày hôm qua</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:users-duotone" class="text-[#22C55E]" /> Khách hàng mới</div>
          <div class="text-3xl font-bold" style="color:#22C55E">47</div>
          <div class="text-xs text-muted mt-2">Tăng từ các quảng cáo</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:star-duotone" class="text-[#F59E0B]" /> Tỉ lệ hoàn thành</div>
          <div class="text-3xl font-bold" style="color:#F59E0B">94.8%</div>
          <div class="text-xs text-muted mt-2">98 đơn hoàn thành/104</div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <!-- Top Products -->
      <div class="data-card">
        <div class="data-card-header">
          <h3 class="font-bold" style="color:#5C4428">Sản phẩm bán chạy nhất</h3>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(p, i) in topProducts" :key="i" class="flex items-center gap-3">
            <span class="font-bold text-sm text-muted">{{ i + 1 }}</span>
            <iconify-icon :icon="p.icon" class="text-xl text-[#7A5C3A]"></iconify-icon>
            <div class="flex-1">
              <div class="text-sm font-semibold" style="color:#5C4428">{{ p.name }}</div>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: p.pct + '%', background: '#7A5C3A' }"></div>
                </div>
                <span class="text-xs text-muted font-semibold">{{ p.sales }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue by Category -->
      <div class="data-card">
        <div class="data-card-header">
          <h3 class="font-bold" style="color:#5C4428">Doanh thu theo loại bánh</h3>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(c, i) in categories" :key="i" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <iconify-icon :icon="c.icon" class="text-lg text-[#7A5C3A]"></iconify-icon>
              <span class="text-sm font-semibold" style="color:#5C4428">{{ c.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold" style="color:#5C4428">{{ c.revenue }}</div>
              <div class="text-xs text-muted">{{ c.pct }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#5C4428">Giao dịch gần đây</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-[#FDF8F2]">
            <tr>
              <th class="text-left p-4 font-semibold text-muted">Đơn hàng</th>
              <th class="text-left p-4 font-semibold text-muted">Khách hàng</th>
              <th class="text-left p-4 font-semibold text-muted">Sản phẩm</th>
              <th class="text-right p-4 font-semibold text-muted">Số tiền</th>
              <th class="text-center p-4 font-semibold text-muted">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id" class="border-b border-[#FDF8F2] hover:bg-[#FFFBF5]">
              <td class="p-4 font-bold" style="color:#7A5C3A">{{ t.id }}</td>
              <td class="p-4" style="color:#5C4428">{{ t.customer }}</td>
              <td class="p-4 text-muted">{{ t.product }}</td>
              <td class="p-4 text-right font-semibold" style="color:#5C4428">{{ t.amount }}</td>
              <td class="p-4 text-center"><span class="badge" :class="'badge-' + t.status">{{ t.statusText }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
const topProducts = [
  { icon: 'ph:cake-duotone', name: 'Bánh sinh nhật 3D', sales: '245 cái', pct: 100 },
  { icon: 'ph:cookie-duotone', name: 'Cupcake nhiều màu', sales: '198 cái', pct: 81 },
  { icon: 'ph:confetti-duotone', name: 'Bánh mousse', sales: '156 cái', pct: 64 },
  { icon: 'ph:candy-duotone', name: 'Macaron hộp', sales: '128 cái', pct: 52 },
]

const categories = [
  { icon: 'ph:cake-duotone', name: 'Bánh sinh nhật', revenue: '62M đ', pct: 48 },
  { icon: 'ph:rings-duotone', name: 'Bánh cưới', revenue: '38M đ', pct: 30 },
  { icon: 'ph:cookie-duotone', name: 'Cupcake/Macaron', revenue: '18M đ', pct: 14 },
  { icon: 'ph:confetti-duotone', name: 'Bánh theo đơn', revenue: '10.5M đ', pct: 8 },
]

const transactions = [
  { id: '#DH2050', customer: 'Nguyễn Khoa', product: 'Bánh 3D Mèo Shiba', amount: '2,500,000 đ', status: 'success', statusText: 'Hoàn thành' },
  { id: '#DH2049', customer: 'Trần Hương', product: 'Bánh sinh nhật 3 tầng', amount: '1,800,000 đ', status: 'success', statusText: 'Hoàn thành' },
  { id: '#DH2048', customer: 'Phạm Thu', product: 'Cupcake set 12', amount: '450,000 đ', status: 'warning', statusText: 'Đang làm' },
  { id: '#DH2047', customer: 'Lê Minh', product: 'Bánh cưới kem tươi', amount: '4,200,000 đ', status: 'info', statusText: 'Chờ nhận' },
  { id: '#DH2046', customer: 'Cao Lan', product: 'Macaron hộp 24', amount: '520,000 đ', status: 'success', statusText: 'Hoàn thành' },
]
</script>
