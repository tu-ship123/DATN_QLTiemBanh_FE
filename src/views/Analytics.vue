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
          <div class="text-3xl font-bold" style="color:#7A5C3A">{{ kpi.monthlyRevenueText }}</div>
          <div class="text-xs text-muted mt-2">Tổng doanh thu các đơn trong tháng này</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:package-duotone" class="text-[#3B82F6]" /> Tổng đơn hàng</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">{{ kpi.totalOrders }}</div>
          <div class="text-xs text-muted mt-2">Trong tháng này</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:users-duotone" class="text-[#22C55E]" /> Khách hàng mua hàng</div>
          <div class="text-3xl font-bold" style="color:#22C55E">{{ kpi.customersThisMonth }}</div>
          <div class="text-xs text-muted mt-2">Khách hàng có đơn trong tháng</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2 flex items-center gap-1"><iconify-icon icon="ph:star-duotone" class="text-[#F59E0B]" /> Tỉ lệ hoàn thành</div>
          <div class="text-3xl font-bold" style="color:#F59E0B">{{ kpi.completionRate }}%</div>
          <div class="text-xs text-muted mt-2">{{ kpi.completedCount }} đơn hoàn thành/{{ kpi.totalOrders }}</div>
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
          <div v-if="topProducts.length === 0" class="text-sm text-muted text-center py-4">Chưa có dữ liệu</div>
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
          <h3 class="font-bold" style="color:#5C4428">Doanh thu theo danh mục</h3>
        </div>
        <div class="p-4 space-y-3">
          <div v-if="categories.length === 0" class="text-sm text-muted text-center py-4">Chưa có dữ liệu</div>
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
            <tr v-if="transactions.length === 0">
              <td colspan="5" class="p-6 text-center text-muted">Chưa có giao dịch nào</td>
            </tr>
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
import { ref, onMounted } from 'vue'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'

const topProducts = ref([])
const categories = ref([])
const transactions = ref([])
const kpi = ref({
  monthlyRevenueText: '0đ', totalOrders: 0, customersThisMonth: 0,
  completionRate: 0, completedCount: 0,
})

const STATUS_META = {
  CHO_XAC_NHAN:  { badge: 'info',    text: 'Chờ xác nhận' },
  DA_XAC_NHAN:   { badge: 'info',    text: 'Đã xác nhận' },
  DANG_CHUAN_BI: { badge: 'warning', text: 'Đang làm' },
  DANG_LAM:      { badge: 'warning', text: 'Đang làm' },
  SAN_SANG:      { badge: 'success', text: 'Sẵn sàng' },
  DANG_GIAO:     { badge: 'info',    text: 'Đang giao' },
  DA_GIAO:       { badge: 'success', text: 'Đã giao' },
  HOAN_THANH:    { badge: 'success', text: 'Hoàn thành' },
  DA_THANH_TOAN: { badge: 'success', text: 'Đã thanh toán' },
  DA_HUY:        { badge: 'danger',  text: 'Đã hủy' },
  DA_HOAN_TIEN:  { badge: 'danger',  text: 'Đã hoàn tiền' },
}
const COMPLETED_STATUSES = ['HOAN_THANH', 'DA_GIAO', 'DA_THANH_TOAN']
const ICONS = ['ph:cake-duotone', 'ph:cookie-duotone', 'ph:confetti-duotone', 'ph:candy-duotone', 'ph:rings-duotone']

function formatMoney(n) {
  return Number(n || 0).toLocaleString('vi-VN') + ' đ'
}

async function loadAnalytics() {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      orderService.getAllOrders(),
      productService.admin.getAll({ size: 1000 }).catch(() => ({ data: { content: [] } })),
    ])

    const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.content ?? [])
    const productList = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.content ?? [])
    const categoryByProduct = new Map(productList.map(p => [p.tenSanPham, p.tenDanhMuc || 'Khác']))

    const now = new Date()
    const monthOrders = allOrders.filter(o => {
      const d = new Date(o.ngayTao)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    // ── KPI ──
    const monthlyRevenue = monthOrders
      .filter(o => COMPLETED_STATUSES.includes(o.trangThai))
      .reduce((sum, o) => sum + (o.tongTien || 0), 0)
    const completedCount = monthOrders.filter(o => COMPLETED_STATUSES.includes(o.trangThai)).length
    const uniqueCustomers = new Set(monthOrders.map(o => o.emailNguoiDung)).size
    kpi.value = {
      monthlyRevenueText: formatMoney(monthlyRevenue),
      totalOrders: monthOrders.length,
      customersThisMonth: uniqueCustomers,
      completionRate: monthOrders.length ? Math.round((completedCount / monthOrders.length) * 100) : 0,
      completedCount,
    }

    // ── Top sản phẩm + Doanh thu theo danh mục (toàn bộ đơn) ──
    const productAgg = new Map()
    const categoryAgg = new Map()
    for (const o of allOrders) {
      for (const item of (o.items || [])) {
        const name = item.tenSanPham || 'Khác'
        const qty = item.soLuong || 0
        const revenue = qty * (item.giaBan || 0)

        const pCur = productAgg.get(name) || { name, qty: 0, revenue: 0 }
        pCur.qty += qty; pCur.revenue += revenue
        productAgg.set(name, pCur)

        const catName = categoryByProduct.get(name) || 'Khác'
        const cCur = categoryAgg.get(catName) || { name: catName, revenue: 0 }
        cCur.revenue += revenue
        categoryAgg.set(catName, cCur)
      }
    }

    const rankedProducts = [...productAgg.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)
    const maxQty = rankedProducts[0]?.qty || 1
    topProducts.value = rankedProducts.map((p, i) => ({
      icon: ICONS[i % ICONS.length], name: p.name,
      sales: `${p.qty} cái`, pct: Math.round((p.qty / maxQty) * 100),
    }))

    const rankedCategories = [...categoryAgg.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6)
    const totalCatRevenue = rankedCategories.reduce((s, c) => s + c.revenue, 0) || 1
    categories.value = rankedCategories.map((c, i) => ({
      icon: ICONS[i % ICONS.length], name: c.name,
      revenue: formatMoney(c.revenue),
      pct: Math.round((c.revenue / totalCatRevenue) * 100),
    }))

    // ── Giao dịch gần đây ──
    const sorted = [...allOrders].sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))
    transactions.value = sorted.slice(0, 8).map(o => {
      const meta = STATUS_META[o.trangThai] || { badge: 'info', text: o.trangThai }
      return {
        id: o.maDonHang || `#${o.id}`,
        customer: o.emailNguoiDung || '—',
        product: o.items?.[0]?.tenSanPham || '—',
        amount: formatMoney(o.tongTien),
        status: meta.badge, statusText: meta.text,
      }
    })
  } catch (err) {
    console.warn('Không load được dữ liệu phân tích:', err.message)
  }
}

onMounted(loadAnalytics)
</script>
