<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="rounded-[32px] bg-white p-6 shadow-sm border border-[var(--color-border)]">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-black text-[#1E2A3B]">Giỏ hàng của bạn</h1>
          <p class="text-sm text-gray-500">Xem lại sản phẩm, cập nhật số lượng và tiến hành thanh toán nhanh chóng.</p>
        </div>
        <RouterLink
          to="/shop"
          class="inline-flex items-center rounded-full border border-[#E8634A] bg-[#FFF4EF] px-5 py-3 text-sm font-semibold text-[#E8634A] hover:bg-[#FFE8DB] transition"
        >
          Tiếp tục mua sắm
        </RouterLink>
      </div>
    </div>

    <!-- Chưa đăng nhập -->
    <div v-if="!isAuthenticated" class="rounded-[28px] bg-white border border-[var(--color-border)] p-16 text-center shadow-sm">
      <p class="text-5xl mb-4">🛒</p>
      <h2 class="text-xl font-bold text-[#1E2A3B] mb-2">Bạn chưa đăng nhập</h2>
      <p class="text-sm text-gray-500 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
      <RouterLink
        to="/login"
        class="inline-block rounded-3xl bg-[#E8634A] px-8 py-3 text-sm font-semibold text-white hover:bg-[#f27355] transition"
      >
        Đăng nhập ngay
      </RouterLink>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="cartStore.loading && !cartStore.gioHang" class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <div class="space-y-4">
        <div v-for="i in 2" :key="i" class="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-sm animate-pulse flex gap-4">
          <div class="h-36 w-[180px] rounded-3xl bg-gray-200 flex-shrink-0"></div>
          <div class="flex-1 space-y-3 pt-2">
            <div class="h-5 bg-gray-200 rounded w-1/2"></div>
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
            <div class="h-4 bg-gray-100 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div class="rounded-[28px] bg-gray-100 h-64 animate-pulse"></div>
    </div>

    <!-- Giỏ hàng trống -->
    <div
      v-else-if="!cartStore.loading && cartStore.items.length === 0"
      class="rounded-[28px] bg-white border border-[var(--color-border)] p-16 text-center shadow-sm"
    >
      <p class="text-6xl mb-4">🎂</p>
      <h2 class="text-xl font-bold text-[#1E2A3B] mb-2">Giỏ hàng trống</h2>
      <p class="text-sm text-gray-500 mb-6">Hãy khám phá cửa hàng và thêm những chiếc bánh yêu thích nhé!</p>
      <RouterLink
        to="/shop"
        class="inline-block rounded-3xl bg-[#E8634A] px-8 py-3 text-sm font-semibold text-white hover:bg-[#f27355] transition"
      >
        Khám phá cửa hàng
      </RouterLink>
    </div>

    <!-- Có sản phẩm trong giỏ -->
    <div v-else class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">

      <!-- Danh sách sản phẩm -->
      <div class="space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <!-- Ảnh sản phẩm -->
          <img
            :src="item.anhSanPham || defaultImage"
            :alt="item.tenSanPham"
            class="h-36 w-full max-w-[180px] rounded-3xl object-cover shadow-sm flex-shrink-0"
            @error="e => e.target.src = defaultImage"
          />

          <!-- Thông tin sản phẩm -->
          <div class="flex-1 space-y-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 class="text-xl font-semibold text-[#1E2A3B]">{{ item.tenSanPham }}</h2>
                <p class="text-sm text-gray-500">{{ item.tenDanhMuc || 'Bánh ngọt' }}</p>
              </div>
              <div class="text-base font-bold text-[#E8634A] whitespace-nowrap">
                {{ formatCurrency(item.thanhTien) }}
              </div>
            </div>

            <!-- Giá & số lượng -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>Đơn giá: <span class="font-semibold text-[#1E2A3B]">{{ formatCurrency(item.donGia) }}</span></span>

              <!-- Bộ điều chỉnh số lượng -->
              <div class="flex items-center gap-2">
                <span class="text-gray-500">Số lượng:</span>
                <div class="flex items-center gap-1 rounded-2xl border border-gray-200 px-2 py-1">
                  <button
                    @click="giamSoLuong(item)"
                    class="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-lg font-bold text-gray-600"
                    :disabled="cartStore.loading"
                  >−</button>
                  <span class="min-w-[28px] text-center font-semibold text-[#1E2A3B]">{{ item.soLuong }}</span>
                  <button
                    @click="tangSoLuong(item)"
                    class="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-lg font-bold text-gray-600"
                    :disabled="cartStore.loading"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap items-center gap-3">
              <button
                @click="xacNhanXoa(item)"
                class="rounded-2xl border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                :disabled="cartStore.loading"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="space-y-4">
        <div class="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm sticky top-6">
          <h2 class="text-xl font-bold text-[#1E2A3B]">Tổng đơn hàng</h2>
          <div class="mt-6 space-y-3 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Giá sản phẩm ({{ cartStore.tongSoLuong }} món)</span>
              <span class="font-semibold text-[#1E2A3B]">{{ formatCurrency(cartStore.tongTienHang) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span :class="cartStore.phiShip === 0 ? 'text-green-500 font-semibold' : 'font-semibold text-[#1E2A3B]'">
                {{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}
              </span>
            </div>
            <p v-if="cartStore.phiShip > 0" class="text-xs text-orange-500">
              🎁 Đặt thêm {{ formatCurrency(500000 - cartStore.tongTienHang) }} để miễn phí ship!
            </p>
          </div>
          <div class="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-lg font-black text-[#1E2A3B]">
            <span>Thành tiền</span>
            <span class="text-[#E8634A]">{{ formatCurrency(cartStore.tongThanhToan) }}</span>
          </div>
          <button
            @click="thanhToan"
            class="mt-6 w-full rounded-3xl bg-[#E8634A] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#E8634A]/20 hover:bg-[#f27355] transition disabled:opacity-60"
            :disabled="cartStore.loading || cartStore.items.length === 0"
          >
            Thanh toán ngay
          </button>
          <button
            @click="xoaToanBo"
            class="mt-3 w-full rounded-3xl border border-gray-200 px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 transition"
            :disabled="cartStore.loading"
          >
            Xóa toàn bộ giỏ
          </button>
        </div>

        <!-- Lời khuyên -->
        <div class="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-[#1E2A3B]">Lời khuyên đặt bánh</h3>
          <ul class="mt-4 space-y-3 text-sm text-gray-600">
            <li>• Đặt trước ít nhất 2–3 ngày để nhận giao kịp thời.</li>
            <li>• Chọn hình ảnh rõ nét khi yêu cầu thiết kế 3D.</li>
            <li>• Ghi chú kèm theo yêu cầu trang trí nếu cần.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Toast thông báo -->
    <transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl',
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isAuthenticated = authStore.isAuthenticated

const defaultImage = 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80'

// ─── Toast ───────────────────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ─── Format tiền VND ─────────────────────────────────────────────────────────
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(value)
    .replace('₫', 'đ')
}

// ─── Tăng / Giảm số lượng ────────────────────────────────────────────────────
const tangSoLuong = async (item) => {
  await cartStore.capNhatSoLuong(item.id, item.soLuong + 1)
  if (cartStore.error) showToast(cartStore.error, 'error')
}

const giamSoLuong = async (item) => {
  if (item.soLuong <= 1) {
    xacNhanXoa(item)
    return
  }
  await cartStore.capNhatSoLuong(item.id, item.soLuong - 1)
  if (cartStore.error) showToast(cartStore.error, 'error')
}

// ─── Xóa sản phẩm ────────────────────────────────────────────────────────────
const xacNhanXoa = async (item) => {
  if (!confirm(`Bỏ "${item.tenSanPham}" khỏi giỏ hàng?`)) return
  await cartStore.xoaItem(item.id)
  if (cartStore.error) {
    showToast(cartStore.error, 'error')
  } else {
    showToast('Đã xóa sản phẩm khỏi giỏ hàng!')
  }
}

// ─── Xóa toàn bộ ─────────────────────────────────────────────────────────────
const xoaToanBo = async () => {
  if (!confirm('Xóa toàn bộ giỏ hàng?')) return
  await cartStore.xoaToanBo()
  if (cartStore.error) {
    showToast(cartStore.error, 'error')
  } else {
    showToast('Đã xóa toàn bộ giỏ hàng!')
  }
}

// ─── Thanh toán ──────────────────────────────────────────────────────────────
const thanhToan = () => {
  // Chuyển sang trang đặt hàng, truyền dữ liệu giỏ qua state
  router.push({ name: 'Checkout' })
}

// ─── Khởi tạo ────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (authStore.isAuthenticated && authStore.isKhachHang) {
    await cartStore.fetchGioHang()
    if (cartStore.error) showToast(cartStore.error, 'error')
  }
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>