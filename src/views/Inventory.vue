<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#1E2A3B">Quản Lý Kho Hàng</h1>
          <p class="text-sm text-muted">Theo dõi tồn kho, nguyên liệu và sản phẩm</p>
        </div>
        <button class="btn-primary">📥 Nhập hàng</button>
      </div>
    </div>

    <!-- Inventory Stats -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng SKU</div>
          <div class="text-3xl font-bold" style="color:#E8634A">42</div>
          <div class="text-xs text-muted mt-2">Đang kinh doanh</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Hàng sắp hết</div>
          <div class="text-3xl font-bold" style="color:#EF4444">8</div>
          <div class="text-xs text-red-600 mt-2">Cần nhập thêm</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Giá trị kho</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">45.8M đ</div>
          <div class="text-xs text-muted mt-2">Nguyên liệu + SP</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Độ quay kho</div>
          <div class="text-3xl font-bold" style="color:#22C55E">18 lần</div>
          <div class="text-xs text-muted mt-2">Mỗi tháng</div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="data-card">
      <div class="data-card-header">
        <h3 class="font-bold" style="color:#1E2A3B">Chi tiết tồn kho</h3>
        <input type="text" placeholder="Tìm sản phẩm..." class="search-input" style="min-width:200px;height:36px;font-size:13px"/>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-[#F5F0ED] bg-[#FAFAF9]">
            <tr>
              <th class="text-left p-4 font-semibold text-muted">Sản phẩm</th>
              <th class="text-center p-4 font-semibold text-muted">Tồn kho</th>
              <th class="text-center p-4 font-semibold text-muted">Tối thiểu</th>
              <th class="text-center p-4 font-semibold text-muted">Tối đa</th>
              <th class="text-right p-4 font-semibold text-muted">Giá vốn</th>
              <th class="text-center p-4 font-semibold text-muted">Trạng thái</th>
              <th class="text-center p-4 font-semibold text-muted">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inventoryItems" :key="item.id" class="border-b border-[#F5F0ED] hover:bg-[#FFF8F4]">
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ item.emoji }}</span>
                  <div>
                    <div class="font-semibold" style="color:#1E2A3B">{{ item.name }}</div>
                    <div class="text-xs text-muted">{{ item.sku }}</div>
                  </div>
                </div>
              </td>
              <td class="p-4 text-center">
                <span class="font-bold" style="color:#1E2A3B">{{ item.current }}</span>
              </td>
              <td class="p-4 text-center text-muted">{{ item.min }}</td>
              <td class="p-4 text-center text-muted">{{ item.max }}</td>
              <td class="p-4 text-right font-semibold" style="color:#1E2A3B">{{ item.cost }}</td>
              <td class="p-4 text-center">
                <span class="badge" :class="'badge-' + item.statusType">{{ item.status }}</span>
              </td>
              <td class="p-4 text-center">
                <button class="text-xs px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50">Sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Low Stock Alert -->
    <div class="data-card border-red-200 bg-red-50">
      <div class="data-card-header border-red-200">
        <h3 class="font-bold text-red-900">⚠️ Cảnh báo hàng sắp hết</h3>
      </div>
      <div class="p-4 space-y-2">
        <div v-for="alert in lowStockItems" :key="alert.id" class="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
          <div class="flex items-center gap-2">
            <span class="text-lg">{{ alert.emoji }}</span>
            <div>
              <div class="font-semibold text-sm" style="color:#1E2A3B">{{ alert.name }}</div>
              <div class="text-xs text-muted">Còn {{ alert.current }}/{{ alert.min }} (tối thiểu)</div>
            </div>
          </div>
          <button class="btn-primary text-xs px-3 py-1">Nhập hàng</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const inventoryItems = [
  { id: 1, emoji: '🎂', name: 'Bánh sinh nhật 3 tầng', sku: 'SKU001', current: 24, min: 10, max: 50, cost: '12,600,000 đ', status: 'Đủ', statusType: 'success' },
  { id: 2, emoji: '🧁', name: 'Cupcake Vanilla', sku: 'SKU002', current: 85, min: 50, max: 100, cost: '4,250,000 đ', status: 'Tốt', statusType: 'success' },
  { id: 3, emoji: '🍰', name: 'Bánh mousse chanh leo', sku: 'SKU003', current: 5, min: 15, max: 40, cost: '1,500,000 đ', status: 'Hết', statusType: 'danger' },
  { id: 4, emoji: '🍬', name: 'Macaron hộp 24', sku: 'SKU004', current: 12, min: 20, max: 60, cost: '2,880,000 đ', status: 'Ít', statusType: 'warning' },
  { id: 5, emoji: '💍', name: 'Bánh cưới cao cấp', sku: 'SKU005', current: 8, min: 5, max: 20, cost: '8,000,000 đ', status: 'Đủ', statusType: 'success' },
  { id: 6, emoji: '🎨', name: 'Sữa đặc (lít)', sku: 'MAT001', current: 3, min: 5, max: 20, cost: '900,000 đ', status: 'Ít', statusType: 'warning' },
  { id: 7, emoji: '🥛', name: 'Bơ tươi (kg)', sku: 'MAT002', current: 6, min: 8, max: 25, cost: '2,700,000 đ', status: 'Ít', statusType: 'warning' },
  { id: 8, emoji: '🌾', name: 'Bột mì (kg)', sku: 'MAT003', current: 18, min: 10, max: 40, cost: '1,080,000 đ', status: 'Đủ', statusType: 'success' },
]

const lowStockItems = [
  { id: 1, emoji: '🍰', name: 'Bánh mousse chanh leo', current: 5, min: 15 },
  { id: 2, emoji: '🎨', name: 'Sữa đặc (lít)', current: 3, min: 5 },
  { id: 3, emoji: '🥛', name: 'Bơ tươi (kg)', current: 6, min: 8 },
]
</script>
