<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#1E2A3B">Khuyến Mãi & Voucher</h1>
          <p class="text-sm text-muted">Quản lý mã giảm giá, chương trình ưu đãi</p>
        </div>
        <button class="btn-primary">🎉 Tạo khuyến mãi</button>
      </div>
    </div>

    <!-- Promo Stats -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Voucher hoạt động</div>
          <div class="text-3xl font-bold" style="color:#E8634A">12</div>
          <div class="text-xs text-muted mt-2">3 sắp hết hạn</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Lượt sử dụng</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">287</div>
          <div class="text-xs text-green-600 mt-2">↑ 48 hôm nay</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tiền giảm</div>
          <div class="text-3xl font-bold" style="color:#22C55E">18.5M đ</div>
          <div class="text-xs text-muted mt-2">Tháng này</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Conversion</div>
          <div class="text-3xl font-bold" style="color:#F59E0B">32.4%</div>
          <div class="text-xs text-muted mt-2">Tỉ lệ sử dụng</div>
        </div>
      </div>
    </div>

    <!-- Vouchers List -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#1E2A3B">Danh sách voucher</h3>
        <div class="flex gap-2">
          <select class="border border-[#EDE8E3] rounded-xl px-3 py-2 text-xs" style="color:#1E2A3B">
            <option>Tất cả</option>
            <option>Đang hoạt động</option>
            <option>Sắp hết hạn</option>
            <option>Đã kết thúc</option>
          </select>
        </div>
      </div>
      <div class="space-y-2 p-4">
        <div v-for="voucher in vouchers" :key="voucher.id" class="border border-[#EDE8E3] rounded-lg p-4 hover:bg-[#FFF8F4] transition">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold" :style="{ background: voucher.bg }">
                {{ voucher.emoji }}
              </div>
              <div>
                <h4 class="font-bold" style="color:#1E2A3B">{{ voucher.name }}</h4>
                <p class="text-sm text-muted">{{ voucher.description }}</p>
              </div>
            </div>
            <span class="badge" :class="'badge-' + voucher.statusType">{{ voucher.status }}</span>
          </div>
          
          <div class="grid grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-[#F5F0ED]">
            <div>
              <div class="text-muted text-xs">Mã voucher</div>
              <div class="font-mono font-bold" style="color:#E8634A">{{ voucher.code }}</div>
            </div>
            <div>
              <div class="text-muted text-xs">Giảm giá</div>
              <div class="font-bold" style="color:#1E2A3B">{{ voucher.discount }}</div>
            </div>
            <div>
              <div class="text-muted text-xs">Sử dụng</div>
              <div class="font-bold" style="color:#1E2A3B">{{ voucher.used }}/{{ voucher.limit }}</div>
            </div>
            <div class="text-right">
              <div class="text-muted text-xs">Hết hạn</div>
              <div class="font-bold" style="color:#1E2A3B">{{ voucher.expiry }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Campaigns -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#1E2A3B">🚀 Chiến dịch khuyến mãi</h3>
      </div>
      <div class="space-y-3 p-4">
        <div v-for="campaign in campaigns" :key="campaign.id" class="border border-[#EDE8E3] rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-sm" style="color:#1E2A3B">{{ campaign.name }}</h4>
            <span class="text-xs font-semibold" style="color:#E8634A">{{ campaign.period }}</span>
          </div>
          <p class="text-xs text-muted mb-3">{{ campaign.description }}</p>
          <div class="flex items-center justify-between text-xs">
            <div class="text-muted">Tiến độ</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-2 rounded-full bg-gray-100 w-32 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#E8634A] to-[#FBB830]" :style="{ width: campaign.progress + '%' }"></div>
              </div>
              <span class="font-semibold">{{ campaign.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const vouchers = [
  { 
    id: 1, emoji: '🎂', bg: '#FFF0EC', name: 'Giảm 20% Bánh sinh nhật', 
    description: 'Áp dụng cho tất cả bánh sinh nhật', 
    code: 'SINH20', status: 'Hoạt động', statusType: 'success',
    discount: '-20%', used: 128, limit: 200, expiry: '15/06/2026'
  },
  { 
    id: 2, emoji: '🧁', bg: '#EFF6FF', name: 'Giảm 15% Cupcake & Macaron', 
    description: 'Mua từ 12 cái trở lên', 
    code: 'CUPCAKE15', status: 'Hoạt động', statusType: 'success',
    discount: '-15%', used: 95, limit: 150, expiry: '20/06/2026'
  },
  { 
    id: 3, emoji: '💍', bg: '#F5F3FF', name: 'Giảm 10% Bánh cưới', 
    description: 'Dành cho khách hàng VIP', 
    code: 'WEDDING10', status: 'Sắp hết', statusType: 'warning',
    discount: '-10%', used: 198, limit: 200, expiry: '10/06/2026'
  },
  { 
    id: 4, emoji: '🎉', bg: '#FEF3C7', name: 'Miễn phí ship + Giảm 5%', 
    description: 'Đơn hàng từ 500k', 
    code: 'FREESHIP5', status: 'Hoạt động', statusType: 'success',
    discount: '-5% +Ship', used: 287, limit: 500, expiry: '25/06/2026'
  },
]

const campaigns = [
  { 
    id: 1, name: 'Khuyến mãi Tháng 6', period: '01-30/06/2026', 
    description: 'Chiến dịch khuyến mãi tổng hợp cho tất cả loại bánh',
    progress: 65
  },
  { 
    id: 2, name: 'Flash Sale Cuối Tuần', period: '08-09/06/2026', 
    description: 'Giảm giá sâu cho cuối tuần, chạy quảng cáo',
    progress: 85
  },
]
</script>
