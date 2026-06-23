<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in blossom-theme">

    <div class="rounded-[24px] p-8" style="background:#FFFFFF; border:1px solid #FDD8EE;">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#EC4899;letter-spacing:3px;text-transform:uppercase;">Giỏ Hàng</span>
          <h1 style="font-family:'Playfair Display',serif;font-size:32px;font-weight:950;color:#3D1A2C;letter-spacing:1px;margin:4px 0 0;">Của Bạn</h1>
          <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;margin-top:4px;">Xem lại các sản phẩm thơm ngon đã chọn và hoàn tất đơn hàng.</p>
        </div>
        <RouterLink to="/shop/products"
          style="display:inline-flex;align-items:center;gap:8px;border:1px solid #FDD8EE;border-radius:14px;padding:10px 20px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;color:#EC4899;text-decoration:none;letter-spacing:1px;transition:all 0.2s;background:#FFF0F7;"
          onmouseenter="this.style.background='#EC4899';this.style.color='#FFFFFF';this.style.borderColor='#EC4899';"
          onmouseleave="this.style.background='#FFF0F7';this.style.color='#EC4899';this.style.borderColor='#FDD8EE';"
        >
          ← Tiếp tục mua sắm
        </RouterLink>
      </div>
    </div>

    <div v-if="!isAuthenticated" class="rounded-[24px] p-16 text-center shadow-sm" style="background:#FFFFFF; border:1px solid #FDD8EE;">
      <p class="text-5xl mb-4">🛒</p>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#3D1A2C;letter-spacing:1px;" class="mb-2">Bạn chưa đăng nhập</h2>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#7C3D5C;" class="mb-8">Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
      <RouterLink to="/login"
        style="display:inline-block;border-radius:14px;background:linear-gradient(135deg,#EC4899,#F472B6);padding:14px 32px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.5px;transition:all 0.2s;box-shadow:0 4px 20px rgba(236,72,153,0.25);"
        onmouseenter="this.style.boxShadow='0 6px 28px rgba(236,72,153,0.4)';this.style.transform='translateY(-2px)'"
        onmouseleave="this.style.boxShadow='0 4px 20px rgba(236,72,153,0.25)';this.style.transform='translateY(0)'"
      >
        Đăng nhập ngay
      </RouterLink>
    </div>

    <div v-else-if="cartStore.loading && !cartStore.gioHang" class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <div class="space-y-4">
        <div v-for="i in 2" :key="i" class="rounded-[24px] p-6 animate-pulse flex gap-4" style="background:#FFFFFF; border:1px solid #FDD8EE;">
          <div class="h-32 w-[160px] rounded-2xl bg-pink-50 flex-shrink-0"></div>
          <div class="flex-1 space-y-3 pt-2">
            <div class="h-5 bg-pink-100 rounded w-1/2"></div>
            <div class="h-4 bg-pink-50 rounded w-1/3"></div>
            <div class="h-4 bg-pink-50 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div class="rounded-[24px] bg-pink-50 h-64 animate-pulse border border-[#FDD8EE]"></div>
    </div>

    <div v-else-if="!cartStore.loading && cartStore.items.length === 0" class="rounded-[24px] p-16 text-center shadow-sm" style="background:#FFFFFF; border:1px solid #FDD8EE;">
      <p class="text-6xl mb-4">🎂</p>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#3D1A2C;letter-spacing:1px;" class="mb-2">Giỏ hàng trống</h2>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#7C3D5C;" class="mb-8">Hãy khám phá cửa hàng và thêm những chiếc bánh yêu thích nhé!</p>
      <RouterLink to="/shop"
        style="display:inline-block;border-radius:14px;background:linear-gradient(135deg,#EC4899,#F472B6);padding:14px 32px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.5px;transition:all 0.2s;box-shadow:0 4px 20px rgba(236,72,153,0.25);"
        onmouseenter="this.style.boxShadow='0 6px 28px rgba(236,72,153,0.4)';this.style.transform='translateY(-2px)'"
        onmouseleave="this.style.boxShadow='0 4px 20px rgba(236,72,153,0.25)';this.style.transform='translateY(0)'"
      >
        Khám phá cửa hàng
      </RouterLink>
    </div>

    <div v-else class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <div class="space-y-4">
        <div v-for="item in cartStore.items" :key="item.id"
          class="flex flex-col gap-5 sm:flex-row sm:items-center p-6 transition-all duration-200"
          style="border-radius:20px; background:#FFFFFF; border:1px solid #FDD8EE;"
          onmouseenter="this.style.borderColor='#F9A8D4';this.style.boxShadow='0 8px 24px rgba(236,72,153,0.05)';"
          onmouseleave="this.style.borderColor='#FDD8EE';this.style.boxShadow='none';"
        >
          <img
            :src="item.anhSanPham || defaultImage"
            :alt="item.tenSanPham"
            class="h-32 w-full max-w-[160px] object-cover flex-shrink-0" 
            style="border-radius:16px;border:1px solid #FDD8EE;"
            @error="e => e.target.src = defaultImage"
          />

          <div class="flex-1 space-y-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:#3D1A2C;letter-spacing:0.5px;">{{ item.tenSanPham }}</h2>
                <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;margin-top:2px;">{{ item.tenDanhMuc || 'Bánh ngọt' }}</p>
              </div>
              <div style="border-radius:10px;background:#FFF0F7;border:1px solid #FDD8EE;padding:6px 14px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:800;color:#EC4899;white-space:nowrap;align-self:flex-start;">
                {{ formatCurrency(item.thanhTien) }}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-2" style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;">
              <span>Đơn giá: <strong style="color:#3D1A2C;font-weight:700;">{{ formatCurrency(item.donGia) }}</strong></span>
              
              <div class="flex items-center gap-2">
                <span>Số lượng:</span>
                <div class="flex items-center gap-1" style="border-radius:20px; border:1px solid #FDD8EE; background:#FFF0F7; padding:2px 4px;">
                  <button
                    @click="giamSoLuong(item)"
                    :disabled="cartStore.loading"
                    class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F9A8D4] hover:text-white transition-colors text-lg font-bold text-[#EC4899] disabled:opacity-50"
                  >−</button>
                  <span class="min-w-[28px] text-center font-bold text-[#3D1A2C] text-sm">{{ item.soLuong }}</span>
                  <button
                    @click="tangSoLuong(item)"
                    :disabled="cartStore.loading"
                    class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F9A8D4] hover:text-white transition-colors text-lg font-bold text-[#EC4899] disabled:opacity-50"
                  >+</button>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button
                @click="xacNhanXoa(item)"
                :disabled="cartStore.loading"
                style="border-radius:10px;border:1px solid #FDD8EE;padding:7px 16px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#B07090;background:transparent;cursor:pointer;transition:all 0.2s;"
                onmouseenter="this.style.color='#E11D48';this.style.borderColor='#E11D48';this.style.background='#FFF0F7';"
                onmouseleave="this.style.color='#B07090';this.style.borderColor='#FDD8EE';this.style.background='transparent';"
              >Xóa khỏi giỏ</button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="p-6 space-y-5 sticky top-6" style="border-radius:20px;background:#FFFFFF;border:1px solid #FDD8EE;">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:#3D1A2C;letter-spacing:1px;padding-bottom:12px;border-bottom:1px solid #FFF0F7;">Tổng Đơn Hàng</h2>
          <div class="space-y-3" style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;">
            <div class="flex justify-between">
              <span>Giá sản phẩm ({{ cartStore.tongSoLuong }} món)</span>
              <span style="font-weight:700;color:#3D1A2C;">{{ formatCurrency(cartStore.tongTienHang) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span :style="cartStore.phiShip === 0 ? 'font-weight:700;color:#10B981;' : 'font-weight:700;color:#3D1A2C;'">
                {{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}
              </span>
            </div>
            <p v-if="cartStore.phiShip > 0" class="text-xs" style="color:#F59E0B; font-weight:600;">
              🎁 Đặt thêm {{ formatCurrency(500000 - cartStore.tongTienHang) }} để miễn phí ship!
            </p>
          </div>
          
          <div class="flex items-center justify-between pt-4" style="border-top:1px solid #FFF0F7;">
            <span style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:800;color:#7C3D5C;">Thành tiền</span>
            <span style="font-family:'Playfair Display',serif;font-size:24px;font-weight:950;color:#EC4899;">{{ formatCurrency(cartStore.tongThanhToan) }}</span>
          </div>

          <button
            @click="thanhToan"
            :disabled="cartStore.loading || cartStore.items.length === 0"
            class="block w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
            style="border:none;border-radius:14px;background:linear-gradient(135deg,#EC4899,#F472B6);padding:14px 20px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;cursor:pointer;letter-spacing:0.5px;transition:all 0.2s;box-shadow:0 4px 20px rgba(236,72,153,0.25);"
            onmouseenter="if(!this.disabled) {this.style.boxShadow='0 6px 28px rgba(236,72,153,0.4)';this.style.transform='translateY(-1px)'}"
            onmouseleave="if(!this.disabled) {this.style.boxShadow='0 4px 20px rgba(236,72,153,0.25)';this.style.transform='translateY(0)'}"
          >
            Tiến hành thanh toán →
          </button>

          <button
            @click="xoaToanBo"
            :disabled="cartStore.loading"
            class="block w-full text-center disabled:opacity-60"
            style="border-radius:14px;border:1px solid #FDD8EE;background:transparent;padding:12px 20px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#B07090;cursor:pointer;transition:all 0.2s;"
            onmouseenter="if(!this.disabled) {this.style.background='#FFF0F7';this.style.color='#E11D48';this.style.borderColor='#F9A8D4'}"
            onmouseleave="if(!this.disabled) {this.style.background='transparent';this.style.color='#B07090';this.style.borderColor='#FDD8EE'}"
          >
            Xóa toàn bộ giỏ
          </button>
        </div>

        <div class="p-6" style="border-radius:20px;background:#FFFFFF;border:1px dashed #FDD8EE;">
          <h3 style="font-family:'Playfair Display',serif;font-size:13px;font-weight:900;color:#EC4899;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Mẹo đặt bánh</h3>
          <ul class="space-y-2.5" style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;line-height:1.6;">
            <li class="flex items-start gap-2">
              <span style="color:#EC4899;flex-shrink:0;">◆</span>
              <span>Nên đặt trước <strong style="color:#3D1A2C;">2–3 ngày</strong> với bánh Custom 3D phức tạp.</span>
            </li>
            <li class="flex items-start gap-2">
              <span style="color:#EC4899;flex-shrink:0;">◆</span>
              <span>Chọn hình ảnh rõ nét khi yêu cầu thiết kế bánh.</span>
            </li>
            <li class="flex items-start gap-2">
              <span style="color:#EC4899;flex-shrink:0;">◆</span>
              <span>Ghi chú dị ứng thực phẩm (nếu có) khi thanh toán.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-xl flex items-center gap-3',
          toast.type === 'success' ? 'bg-[#10B981]' : 'bg-[#E11D48]'
        ]"
        style="font-family:'DM Sans',sans-serif; letter-spacing:0.5px;"
      >
        <span class="text-lg">{{ toast.type === 'success' ? '✓' : '⚠' }}</span>
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
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>