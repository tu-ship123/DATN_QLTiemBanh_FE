<template>
  <div class="space-y-8">
    <div class="rounded-[32px] bg-white p-6 shadow-sm border border-[var(--color-border)]">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-black text-[#1E2A3B]">Giỏ hàng của bạn</h1>
          <p class="text-sm text-gray-500">Xem lại sản phẩm, cập nhật số lượng và tiến hành thanh toán nhanh chóng.</p>
        </div>
        <RouterLink to="/shop" class="inline-flex items-center rounded-full border border-[#E8634A] bg-[#FFF4EF] px-5 py-3 text-sm font-semibold text-[#E8634A] hover:bg-[#FFE8DB] transition">Tiếp tục mua sắm</RouterLink>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <div class="space-y-4">
        <div v-for="item in cartItems" :key="item.id" class="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center">
          <img :src="item.image" :alt="item.name" class="h-36 w-full max-w-[180px] rounded-3xl object-cover shadow-sm" />
          <div class="flex-1 space-y-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-xl font-semibold text-[#1E2A3B]">{{ item.name }}</h2>
                <p class="text-sm text-gray-500">{{ item.category }} · {{ item.size }}</p>
              </div>
              <div class="rounded-full bg-[#FEF3E2] px-4 py-2 text-sm font-semibold text-[#E8634A]">{{ item.status }}</div>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span>Giá: <span class="font-semibold text-[#1E2A3B]">{{ item.price }}</span></span>
              <span>Số lượng: <strong>{{ item.quantity }}</strong></span>
              <span>Ngày giao: <strong>{{ item.deliveryDate }}</strong></span>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <button class="rounded-2xl border border-[#E8634A] px-4 py-2 text-sm font-semibold text-[#E8634A] hover:bg-[#FFF4EF] transition">Chỉnh sửa</button>
              <button class="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-[#1E2A3B]">Tổng đơn hàng</h2>
          <div class="mt-6 space-y-3 text-sm text-gray-600">
            <div class="flex justify-between"><span>Giá sản phẩm</span><span>{{ itemTotal }}</span></div>
            <div class="flex justify-between"><span>Phí giao hàng</span><span>{{ shippingFee }}</span></div>
            <div class="flex justify-between"><span>Ưu đãi</span><span class="text-[#22C55E]">-{{ discount }}</span></div>
          </div>
          <div class="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-lg font-black text-[#1E2A3B]">
            <span>Thành tiền</span>
            <span>{{ total }}</span>
          </div>
          <button class="mt-6 w-full rounded-3xl bg-[#E8634A] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#E8634A]/20 hover:bg-[#f27355] transition">Thanh toán ngay</button>
        </div>
        <div class="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-[#1E2A3B]">Lời khuyên đặt bánh</h3>
          <ul class="mt-4 space-y-3 text-sm text-gray-600">
            <li>• Đặt trước ít nhất 2-3 ngày để nhận giao kịp thời.</li>
            <li>• Chọn hình ảnh rõ nét khi yêu cầu thiết kế 3D.</li>
            <li>• Ghi chú kèm theo yêu cầu trang trí nếu cần.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const cartItems = [
  {
    id: 1,
    name: 'Bánh sinh nhật 3D Custom',
    category: 'Bánh sinh nhật',
    size: '20cm',
    price: '2,500,000đ',
    quantity: 1,
    deliveryDate: '10/06/2026',
    status: 'Chờ xác nhận',
    image: 'https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Macaron hộp 24',
    category: 'Macaron',
    size: '24 cái',
    price: '480,000đ',
    quantity: 1,
    deliveryDate: '10/06/2026',
    status: 'Chuẩn bị',
    image: 'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=800&q=80'
  }
]

const itemTotal = '2,980,000đ'
const shippingFee = '30,000đ'
const discount = '0đ'
const total = '3,010,000đ'
</script>
