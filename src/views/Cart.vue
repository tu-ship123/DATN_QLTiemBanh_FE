<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in blossom-theme">

    <!-- Tiêu đề giỏ hàng -->
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

    <!-- Danh sách sản phẩm và Tóm tắt -->
    <div class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <!-- Cột trái: sản phẩm trong giỏ -->
      <div class="space-y-4">
        <div v-for="item in cartItems" :key="item.id"
          class="flex flex-col gap-5 sm:flex-row sm:items-center p-6 transition-all duration-200 cart-item-card"
          style="border-radius:20px; background:#FFFFFF; border:1px solid #FDD8EE;"
          onmouseenter="this.style.borderColor='#F9A8D4';this.style.boxShadow='0 8px 24px rgba(236,72,153,0.05)';"
          onmouseleave="this.style.borderColor='#FDD8EE';this.style.boxShadow='none';"
        >
          <img :src="item.image" :alt="item.name" class="h-32 w-full max-w-[160px] object-cover flex-shrink-0" style="border-radius:16px;border:1px solid #FDD8EE;" />
          <div class="flex-1 space-y-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 style="font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#3D1A2C;letter-spacing:0.5px;">{{ item.name }}</h2>
                <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;margin-top:2px;">{{ item.category }} · Size: {{ item.size }}</p>
              </div>
              <div style="border-radius:10px;background:#FFF0F7;border:1px solid #FDD8EE;padding:4px 12px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#EC4899;white-space:nowrap;align-self:flex-start;">{{ item.status }}</div>
            </div>

            <div class="flex flex-wrap items-center gap-x-5 gap-y-2" style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;">
              <span>Đơn giá: <strong style="color:#3D1A2C;font-weight:700;">{{ item.price }}</strong></span>
              <span>Số lượng: <strong style="color:#3D1A2C;font-weight:700;">{{ item.quantity }}</strong></span>
              <span>Ngày giao: <strong style="color:#EC4899;font-weight:700;">{{ item.deliveryDate }}</strong></span>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-1">
              <button
                style="border-radius:10px;border:1px solid #FDD8EE;padding:7px 16px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#EC4899;background:#FFF0F7;cursor:pointer;transition:all 0.2s;"
                onmouseenter="this.style.background='#EC4899';this.style.color='#FFFFFF';this.style.borderColor='#EC4899';"
                onmouseleave="this.style.background='#FFF0F7';this.style.color='#EC4899';this.style.borderColor='#FDD8EE';"
              >Chỉnh sửa yêu cầu</button>
              <button
                style="border-radius:10px;border:1px solid #FDD8EE;padding:7px 16px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#B07090;background:transparent;cursor:pointer;transition:all 0.2s;"
                onmouseenter="this.style.color='#E11D48';this.style.borderColor='#E11D48';this.style.background='#FFF0F7';"
                onmouseleave="this.style.color='#B07090';this.style.borderColor='#FDD8EE';this.style.background='transparent';"
              >Xóa khỏi giỏ</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: tóm tắt thanh toán -->
      <div class="space-y-4">
        <div class="p-6 space-y-5" style="border-radius:20px;background:#FFFFFF;border:1px solid #FDD8EE;">
          <h2 style="font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#3D1A2C;letter-spacing:1px;padding-bottom:12px;border-bottom:1px solid #FFF0F7;">Tổng Đơn Hàng</h2>
          <div class="space-y-3" style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;">
            <div class="flex justify-between"><span>Giá tạm tính</span><span style="font-weight:700;color:#3D1A2C;">{{ itemTotal }}</span></div>
            <div class="flex justify-between"><span>Phí giao hàng</span><span style="font-weight:700;color:#3D1A2C;">{{ shippingFee }}</span></div>
            <div class="flex justify-between"><span>Ưu đãi voucher</span><span style="font-weight:700;color:#10B981;">-{{ discount }}</span></div>
          </div>
          <div class="flex items-center justify-between pt-4" style="border-top:1px solid #FFF0F7;">
            <span style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#7C3D5C;">Thành tiền</span>
            <span style="font-family:'Playfair Display',serif;font-size:22px;font-weight:950;color:#EC4899;">{{ total }}</span>
          </div>

          <RouterLink to="/shop/payment"
            class="block w-full text-center"
            style="border-radius:14px;background:linear-gradient(135deg,#EC4899,#F472B6);padding:14px 20px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.5px;transition:all 0.2s;box-shadow:0 4px 20px rgba(236,72,153,0.25);"
            onmouseenter="this.style.boxShadow='0 6px 28px rgba(236,72,153,0.4)';this.style.transform='translateY(-1px)'"
            onmouseleave="this.style.boxShadow='0 4px 20px rgba(236,72,153,0.25)';this.style.transform='translateY(0)'"
          >
            Tiến hành thanh toán →
          </RouterLink>
        </div>

        <!-- Tip card -->
        <div class="p-6" style="border-radius:20px;background:#FFFFFF;border:1px dashed #FDD8EE;">
          <h3 style="font-family:'Playfair Display',serif;font-size:12px;font-weight:900;color:#EC4899;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Mẹo đặt bánh</h3>
          <ul class="space-y-2.5" style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;line-height:1.6;">
            <li class="flex items-start gap-2">
              <span style="color:#EC4899;flex-shrink:0;">◆</span>
              <span>Nên đặt trước <strong style="color:#3D1A2C;">2–3 ngày</strong> với bánh Custom 3D phức tạp.</span>
            </li>
            <li class="flex items-start gap-2">
              <span style="color:#EC4899;flex-shrink:0;">◆</span>
              <span>Tải lên ảnh mẫu rõ nét để chúng tôi làm chuẩn xác nhất.</span>
            </li>
            <li class="flex items-start gap-2">
              <span style="color:#EC4899;flex-shrink:0;">◆</span>
              <span>Ghi chú dị ứng thực phẩm nếu có trong phần đặt hàng.</span>
            </li>
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
    deliveryDate: '22/06/2026',
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
    deliveryDate: '22/06/2026',
    status: 'Chuẩn bị',
    image: 'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=800&q=80'
  }
]

const itemTotal = '2,980,000đ'
const shippingFee = '30,000đ'
const discount = '0đ'
const total = '3,010,000đ'
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
