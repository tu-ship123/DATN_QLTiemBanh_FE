<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in">

    <!-- ===== HEADER ===== -->
    <div class="rounded-[24px] p-8 bg-white border border-[#EDE0CC] shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);box-shadow:0 4px 16px rgba(122,92,58,0.2);">
            <iconify-icon icon="ph:shopping-cart-duotone" class="text-2xl text-white"></iconify-icon>
          </div>
          <div>
            <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#9A7650;letter-spacing:3px;text-transform:uppercase;">Giỏ Hàng</span>
            <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:950;color:#3D2A1A;letter-spacing:1px;margin:2px 0 0;">Của Bạn</h1>
            <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#9A7650;margin-top:2px;">Xem lại các sản phẩm thơm ngon đã chọn và hoàn tất đơn hàng.</p>
          </div>
        </div>
        <RouterLink to="/shop/products" class="chocopine-btn-secondary px-5 py-2.5 inline-flex items-center gap-2 no-underline">
          ← Tiếp tục mua sắm
        </RouterLink>
      </div>
    </div>

    <!-- ===== CHƯA ĐĂNG NHẬP ===== -->
    <div v-if="!isAuthenticated" class="rounded-[24px] p-16 text-center bg-white border border-[#EDE0CC] shadow-sm">
      <div class="w-20 h-20 rounded-2xl bg-[#FDF6EC] border border-[#EDE0CC] flex items-center justify-center mx-auto mb-5">
        <iconify-icon icon="ph:shopping-cart-duotone" class="text-5xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#3D2A1A;letter-spacing:1px;" class="mb-2">Bạn chưa đăng nhập</h2>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#9A7650;" class="mb-8">Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
      <RouterLink to="/login" class="chocopine-btn-primary px-8 py-3.5 inline-block no-underline">
        Đăng nhập ngay
      </RouterLink>
    </div>

    <!-- ===== SKELETON LOADING ===== -->
    <div v-else-if="cartStore.loading && !cartStore.gioHang" class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <div class="space-y-4">
        <div v-for="i in 2" :key="i" class="rounded-[24px] p-6 animate-pulse flex gap-4 bg-white border border-[#EDE0CC]">
          <div class="h-32 w-[160px] rounded-2xl bg-[#F5ECD8] flex-shrink-0"></div>
          <div class="flex-1 space-y-3 pt-2">
            <div class="h-5 bg-[#EDE0CC] rounded-xl w-1/2"></div>
            <div class="h-4 bg-[#F5ECD8] rounded-xl w-1/3"></div>
            <div class="h-4 bg-[#F5ECD8] rounded-xl w-1/4"></div>
          </div>
        </div>
      </div>
      <div class="rounded-[24px] bg-[#FDF6EC] h-64 animate-pulse border border-[#EDE0CC]"></div>
    </div>

    <!-- ===== GIỎ TRỐNG ===== -->
    <div v-else-if="!cartStore.loading && cartStore.items.length === 0"
      class="rounded-[24px] p-16 text-center bg-white border border-[#EDE0CC] shadow-sm">
      <div class="w-24 h-24 rounded-2xl bg-[#FDF6EC] border border-[#EDE0CC] flex items-center justify-center mx-auto mb-5">
        <iconify-icon icon="ph:cake-duotone" class="text-6xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#3D2A1A;letter-spacing:1px;" class="mb-2">Giỏ hàng trống</h2>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#9A7650;" class="mb-8">Hãy khám phá cửa hàng và thêm những chiếc bánh yêu thích nhé!</p>
      <RouterLink to="/shop" class="chocopine-btn-primary px-8 py-3.5 inline-block no-underline">
        Khám phá cửa hàng
      </RouterLink>
    </div>

    <!-- ===== NỘI DUNG GIỎ HÀNG ===== -->
    <div v-else class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">

      <!-- Danh sách sản phẩm -->
      <div class="space-y-4">
        <div
          v-for="item in cartStore.items" :key="item.id"
          class="flex flex-col gap-5 sm:flex-row sm:items-center p-6 bg-white border border-[#EDE0CC] rounded-[20px] transition-all duration-200 hover:border-[#C4A882] hover:shadow-[0_8px_24px_rgba(122,92,58,0.08)]"
        >
          <img
            :src="item.anhSanPham || defaultImage"
            :alt="item.tenSanPham"
            class="h-32 w-full max-w-[160px] object-cover flex-shrink-0 rounded-[16px] border border-[#EDE0CC]"
            @error="e => e.target.src = defaultImage"
          />

          <div class="flex-1 space-y-3 font-sans">
            <!-- Tên + Thành tiền -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 style="font-family:'Playfair Display',serif;font-size:17px;font-weight:900;color:#3D2A1A;letter-spacing:0.5px;">
                  {{ item.tenSanPham }}
                </h2>
                <p class="text-xs text-[#A68B5C] mt-0.5 font-medium">{{ item.tenDanhMuc || 'Bánh ngọt' }}</p>
              </div>
              <div class="rounded-xl bg-[#FDF6EC] border border-[#EDE0CC] px-3 py-1.5 text-sm font-black text-[#7A5C3A] whitespace-nowrap self-start">
                {{ formatCurrency(item.thanhTien) }}
              </div>
            </div>

            <!-- Đơn giá + Số lượng -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#9A7650]">
              <span>Đơn giá: <strong class="text-[#5C4428] font-bold">{{ formatCurrency(item.donGia) }}</strong></span>

              <div class="flex items-center gap-2">
                <span>Số lượng:</span>
                <div class="flex items-center gap-1 rounded-full border border-[#EDE0CC] bg-[#FDF6EC] px-1 py-0.5">
                  <button
                    @click="giamSoLuong(item)"
                    :disabled="cartStore.loading"
                    class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#7A5C3A] hover:text-white transition-colors text-base font-bold text-[#7A5C3A] disabled:opacity-40"
                  >−</button>
                  <span class="min-w-[28px] text-center font-bold text-[#3D2A1A] text-sm">{{ item.soLuong }}</span>
                  <button
                    @click="tangSoLuong(item)"
                    :disabled="cartStore.loading"
                    class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#7A5C3A] hover:text-white transition-colors text-base font-bold text-[#7A5C3A] disabled:opacity-40"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Nút xóa -->
            <div class="pt-1">
              <button
                @click="xacNhanXoa(item)"
                :disabled="cartStore.loading"
                class="text-[11px] font-bold text-[#A68B5C] border border-[#EDE0CC] rounded-xl px-4 py-1.5 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all disabled:opacity-40"
              >
                <iconify-icon icon="ph:trash-duotone" class="mr-1"></iconify-icon>
                Xóa khỏi giỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar tổng đơn -->
      <div class="space-y-4">
        <div class="p-6 space-y-5 sticky top-6 bg-white border border-[#EDE0CC] rounded-[20px] shadow-sm">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:#3D2A1A;letter-spacing:1px;"
            class="pb-3 border-b border-[#EDE0CC]">
            Tổng Đơn Hàng
          </h2>

          <div class="space-y-3 text-xs font-sans text-[#9A7650]">
            <div class="flex justify-between">
              <span>Giá sản phẩm ({{ cartStore.tongSoLuong }} món)</span>
              <span class="font-bold text-[#5C4428]">{{ formatCurrency(cartStore.tongTienHang) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span :class="cartStore.phiShip === 0 ? 'font-bold text-green-600' : 'font-bold text-[#5C4428]'">
                {{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}
              </span>
            </div>
            <div v-if="cartStore.phiShip > 0"
              class="flex items-center gap-2 text-amber-600 font-semibold bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <iconify-icon icon="ph:gift-duotone" class="text-base shrink-0"></iconify-icon>
              Thêm {{ formatCurrency(500000 - cartStore.tongTienHang) }} để miễn phí ship!
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-[#EDE0CC]">
            <span class="text-sm font-bold text-[#5C4428] font-sans">Thành tiền</span>
            <span style="font-family:'Playfair Display',serif;font-size:24px;font-weight:950;color:#7A5C3A;">
              {{ formatCurrency(cartStore.tongThanhToan) }}
            </span>
          </div>

          <button
            @click="thanhToan"
            :disabled="cartStore.loading || cartStore.items.length === 0"
            class="chocopine-btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            <iconify-icon icon="ph:lock-duotone" class="text-sm"></iconify-icon>
            Tiến hành thanh toán
          </button>

          <button
            @click="xoaToanBo"
            :disabled="cartStore.loading"
            class="w-full py-3 text-xs font-bold text-[#A68B5C] border border-[#EDE0CC] rounded-xl hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all disabled:opacity-40 font-sans"
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        <!-- Mẹo đặt bánh -->
        <div class="p-6 bg-[#FDF6EC] border border-dashed border-[#C4A882] rounded-[20px]">
          <h3 class="text-xs font-black text-[#7A5C3A] uppercase tracking-widest mb-4 flex items-center gap-2">
            <iconify-icon icon="ph:lightbulb-duotone" class="text-base"></iconify-icon>
            Mẹo đặt bánh
          </h3>
          <ul class="space-y-2.5 text-xs text-[#9A7650] font-sans leading-relaxed">
            <li class="flex items-start gap-2">
              <span class="text-[#7A5C3A] flex-shrink-0 mt-0.5">◆</span>
              <span>Nên đặt trước <strong class="text-[#5C4428]">2–3 ngày</strong> với bánh Custom 3D phức tạp.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#7A5C3A] flex-shrink-0 mt-0.5">◆</span>
              <span>Chọn hình ảnh rõ nét khi yêu cầu thiết kế bánh in.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#7A5C3A] flex-shrink-0 mt-0.5">◆</span>
              <span>Ghi chú dị ứng thực phẩm (nếu có) trong phần ghi chú đơn hàng.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== TOAST ===== -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 rounded-2xl px-6 py-3.5 text-xs font-bold text-white shadow-xl flex items-center gap-3 font-sans"
        :class="toast.type === 'success' ? 'bg-[#7A5C3A]' : 'bg-red-500'"
      >
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:warning-fill'" class="text-lg"></iconify-icon>
        {{ toast.message }}
      </div>
    </Transition>

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

// ─── Format tiền ─────────────────────────────────────────────────────────────
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// ─── Tăng / Giảm số lượng ────────────────────────────────────────────────────
const tangSoLuong = async (item) => {
  await cartStore.capNhatSoLuong(item.id, item.soLuong + 1)
  if (cartStore.error) showToast(cartStore.error, 'error')
}

const giamSoLuong = async (item) => {
  if (item.soLuong <= 1) { xacNhanXoa(item); return }
  await cartStore.capNhatSoLuong(item.id, item.soLuong - 1)
  if (cartStore.error) showToast(cartStore.error, 'error')
}

// ─── Xóa sản phẩm ────────────────────────────────────────────────────────────
const xacNhanXoa = async (item) => {
  if (!confirm(`Bỏ "${item.tenSanPham}" khỏi giỏ hàng?`)) return
  await cartStore.xoaItem(item.id)
  if (cartStore.error) showToast(cartStore.error, 'error')
  else showToast('Đã xóa sản phẩm khỏi giỏ hàng!')
}

// ─── Xóa toàn bộ ─────────────────────────────────────────────────────────────
const xoaToanBo = async () => {
  if (!confirm('Xóa toàn bộ giỏ hàng?')) return
  await cartStore.xoaToanBo()
  if (cartStore.error) showToast(cartStore.error, 'error')
  else showToast('Đã xóa toàn bộ giỏ hàng!')
}

// ─── Thanh toán ──────────────────────────────────────────────────────────────
const thanhToan = () => {
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
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>