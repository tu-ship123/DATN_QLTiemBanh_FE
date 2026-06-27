<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="rounded-[32px] bg-white p-6 shadow-sm border border-gray-100 text-center">
      <div class="w-16 h-16 rounded-2xl bg-[#FDF6EC] flex items-center justify-center mx-auto mb-4">
        <iconify-icon icon="ph:receipt-duotone" class="text-4xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h1 class="text-3xl font-black text-[#5C4428]">Chi tiết đơn hàng</h1>
      <p class="text-sm text-gray-500 mt-2">Mã đơn hàng: #{{ orderId }}</p>
      
      <div class="mt-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <p class="text-gray-600">Giao diện chi tiết đơn hàng và trạng thái thanh toán sẽ được hiển thị ở đây.</p>
      </div>

      <button @click="$router.push('/shop')" class="mt-6 inline-flex items-center rounded-full bg-[#7A5C3A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6B4E2E] transition">
        Quay lại cửa hàng
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// Lấy ID đơn hàng từ trên URL (ví dụ: /orders/123 -> orderId = 123)
const orderId = computed(() => route.params.id)
</script>