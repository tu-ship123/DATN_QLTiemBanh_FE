<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in blossom-theme">

    <!-- ===== TIÊU ĐỀ ===== -->
    <div class="p-6" style="border-radius:24px;background:#FFFFFF;border:1px solid #FDD8EE;">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg,#EC4899,#F472B6);box-shadow:0 4px 16px rgba(236,72,153,0.2);">
            <iconify-icon icon="ph:package-duotone" class="text-2xl" style="color:#FFFFFF;"></iconify-icon>
          </div>
          <div>
            <h1 style="font-family:'Playfair Display',serif;font-size:26px;font-weight:950;color:#3D1A2C;letter-spacing:1px;margin:0;">Theo dõi đơn hàng</h1>
            <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;margin:4px 0 0;">Theo dõi chi tiết tiến độ chuẩn bị và giao bánh thời gian thực.</p>
          </div>
        </div>

        <!-- Chuông thông báo -->
        <div class="relative font-sans">
          <button
            @click="toggleNotifications"
            class="relative w-11 h-11 rounded-2xl border border-[#FDD8EE] bg-white hover:bg-[#FFF0F7] hover:border-[#EC4899] transition-all flex items-center justify-center shadow-sm"
          >
            <iconify-icon icon="ph:bell-duotone" class="text-xl text-[#3D1A2C]"></iconify-icon>
            <span v-if="unreadCount > 0" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#EC4899] text-white text-[10px] font-black flex items-center justify-center shadow">
              {{ unreadCount }}
            </span>
          </button>

          <!-- Dropdown thông báo -->
          <Transition name="dropdown">
            <div v-if="showNotif" class="absolute right-0 top-14 w-80 rounded-[20px] bg-white border border-[#FDD8EE] shadow-2xl z-50 overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#FFF0F7]">
                <span class="font-bold text-[#3D1A2C] text-sm">Thông báo mới</span>
                <button @click="markAllRead" class="text-xs font-semibold text-[#EC4899] hover:underline">Đã đọc tất cả</button>
              </div>
              <div class="max-h-80 overflow-y-auto divide-y divide-[#FFF0F7]">
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  @click="readNotif(notif)"
                  class="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-[#FFF0F7]"
                  :class="notif.read ? 'opacity-60' : ''"
                >
                  <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" :class="notifIconBg(notif.type)">
                    <iconify-icon :icon="notifIcon(notif.type)" class="text-lg" :class="notifIconColor(notif.type)"></iconify-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-[#3D1A2C] leading-snug">{{ notif.title }}</p>
                    <p class="text-[11px] text-[#7C3D5C] mt-0.5 line-clamp-2 leading-relaxed">{{ notif.body }}</p>
                    <p class="text-[10px] text-[#B07090] mt-1 font-medium">{{ notif.time }}</p>
                  </div>
                  <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-[#EC4899] mt-1.5 flex-shrink-0"></span>
                </div>
              </div>
              <div class="px-5 py-3 bg-[#FFF5FA] border-t border-[#FDD8EE]">
                <button class="w-full text-xs text-center font-bold text-[#EC4899] hover:underline">Xem tất cả thông báo</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- ===== TÌM ĐƠN HÀNG ===== -->
    <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6 font-sans">
      <h2 class="text-base font-bold text-[#3D1A2C] mb-4 flex items-center gap-2">
        <iconify-icon icon="ph:magnifying-glass-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
        Tra cứu mã đơn hàng
      </h2>
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <iconify-icon icon="ph:hash" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
          <input
            v-model="searchCode"
            type="text"
            placeholder="Nhập mã đơn hàng của bạn (VD: DH001)"
            @keyup.enter="searchOrder"
            class="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] text-sm text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]"
          />
        </div>
        <button
          @click="searchOrder"
          class="rounded-2xl bg-[#EC4899] px-6 py-3 text-xs font-bold text-white hover:bg-[#D12E7B] transition-colors shadow-sm shadow-[#EC4899]/15 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <iconify-icon icon="ph:magnifying-glass" class="text-base"></iconify-icon>
          Tra cứu đơn
        </button>
      </div>
      <!-- Gợi ý mã -->
      <div class="mt-3 flex flex-wrap gap-2 items-center">
        <span class="text-xs text-[#B07090]">Gợi ý đơn hàng có sẵn:</span>
        <button
          @click="searchCode = 'DH001'; searchOrder()"
          class="rounded-full border border-dashed border-[#EC4899]/40 bg-[#FFF0F7] px-3.5 py-1 text-xs font-bold text-[#EC4899] hover:bg-[#FFF0F7] transition-colors"
        >DH001</button>
        <button
          @click="searchCode = 'DH002'; searchOrder()"
          class="rounded-full border border-dashed border-[#EC4899]/40 bg-[#FFF0F7] px-3.5 py-1 text-xs font-bold text-[#EC4899] hover:bg-[#FFF0F7] transition-colors"
        >DH002</button>
        <button
          @click="searchCode = 'DH003'; searchOrder()"
          class="rounded-full border border-dashed border-[#EC4899]/40 bg-[#FFF0F7] px-3.5 py-1 text-xs font-bold text-[#EC4899] hover:bg-[#FFF0F7] transition-colors"
        >DH003</button>
      </div>
    </div>

    <!-- ===== CHI TIẾT ĐƠN HÀNG ===== -->
    <div v-if="activeOrder" class="grid gap-6 xl:grid-cols-[1fr_360px]">

      <!-- Cột trái: Timeline + Sản phẩm -->
      <div class="space-y-5">

        <!-- Thông tin đơn hàng -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <div class="flex items-center gap-2.5 flex-wrap">
                <span class="text-2xl font-black text-[#3D1A2C]">#{{ activeOrder.code }}</span>
                <span class="rounded-xl px-3 py-1 text-[11px] font-bold" :class="orderStatusClass(activeOrder.status)">
                  {{ activeOrder.status }}
                </span>
              </div>
              <p class="text-xs text-[#B07090] font-medium font-sans mt-1">Đặt lúc {{ activeOrder.createdAt }}</p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-2xl font-black text-[#EC4899]">{{ formatPrice(activeOrder.total) }}</p>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wider font-sans">Tổng thanh toán</p>
            </div>
          </div>

          <!-- Thông tin người nhận -->
          <div class="grid sm:grid-cols-2 gap-4 bg-[#FFF0F7] border border-[#FDD8EE] rounded-2xl p-4 text-xs font-sans">
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Người nhận bánh</p>
              <p class="font-bold text-[#3D1A2C]">{{ activeOrder.customer.name }}</p>
              <p class="text-gray-500">{{ activeOrder.customer.phone }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Địa chỉ giao bánh</p>
              <p class="font-semibold text-[#3D1A2C] leading-relaxed">{{ activeOrder.customer.address }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Ngày giao dự kiến</p>
              <p class="font-bold text-[#EC4899]">{{ activeOrder.deliveryDate }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Hình thức thanh toán</p>
              <p class="font-semibold text-[#3D1A2C]">{{ activeOrder.paymentMethod }}</p>
            </div>
          </div>
        </div>

        <!-- Timeline trạng thái -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h3 class="text-base font-bold text-[#3D1A2C] mb-6 flex items-center gap-2">
            <iconify-icon icon="ph:clock-countdown-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
            Tiến trình đơn hàng
          </h3>
          <div class="space-y-0 font-sans">
            <div
              v-for="(step, idx) in activeOrder.timeline"
              :key="idx"
              class="flex gap-4 relative"
            >
              <!-- Đường nối dọc -->
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all"
                  :class="step.done
                    ? 'bg-gradient-to-br from-[#EC4899] to-[#F472B6] shadow-md shadow-[#EC4899]/15'
                    : step.active
                    ? 'bg-white border-2 border-[#EC4899] shadow-md shadow-[#EC4899]/10'
                    : 'bg-[#FFF5FA] border-2 border-[#FDD8EE]'"
                >
                  <iconify-icon
                    :icon="step.icon"
                    class="text-lg"
                    :class="step.done ? 'text-white' : step.active ? 'text-[#EC4899]' : 'text-[#B07090]'"
                  ></iconify-icon>
                </div>
                <div v-if="idx < activeOrder.timeline.length - 1" class="w-0.5 h-12 mt-1" :class="step.done ? 'bg-[#EC4899]/30' : 'bg-[#FDD8EE]'"></div>
              </div>

              <!-- Nội dung bước -->
              <div class="flex-1 pb-12" :class="idx === activeOrder.timeline.length - 1 ? 'pb-0' : ''">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-bold text-sm" :class="step.done || step.active ? 'text-[#3D1A2C]' : 'text-[#B07090]'">{{ step.label }}</p>
                    <p class="text-xs text-[#7C3D5C] mt-1 font-medium leading-relaxed">{{ step.desc }}</p>
                  </div>
                  <span v-if="step.time" class="text-xs text-[#B07090] font-bold whitespace-nowrap flex-shrink-0 mt-0.5">{{ step.time }}</span>
                </div>
                <div v-if="step.active" class="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-[#FFF0F7] border border-[#EC4899]/20 px-3 py-1 text-[10px] font-black text-[#EC4899] uppercase tracking-wider">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-pulse"></span>
                  Đang tiến hành
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Danh sách sản phẩm trong đơn -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h3 class="text-base font-bold text-[#3D1A2C] mb-4 flex items-center gap-2">
            <iconify-icon icon="ph:shopping-bag-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
            Bánh ngọt trong đơn
          </h3>
          <div class="space-y-3 font-sans">
            <div v-for="item in activeOrder.items" :key="item.id" class="flex items-center gap-4 p-3 rounded-2xl bg-[#FFFFFF] border border-[#FDD8EE] hover:bg-[#FFF0F7] transition-colors">
              <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#3D1A2C] truncate">{{ item.name }}</p>
                <p class="text-xs text-[#B07090] font-medium">{{ item.size }} · x{{ item.quantity }}</p>
              </div>
              <p class="font-black text-sm text-[#EC4899] whitespace-nowrap">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: Tóm tắt + Hành động -->
      <div class="space-y-5 font-sans">

        <!-- Tóm tắt thanh toán -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h3 class="text-base font-bold text-[#3D1A2C] mb-4 flex items-center gap-2 border-b border-[#FDD8EE] pb-3">
            <iconify-icon icon="ph:receipt-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
            Chi tiết hóa đơn
          </h3>
          <div class="space-y-3.5 text-xs font-medium text-[#7C3D5C]">
            <div class="flex justify-between">
              <span>Giá tạm tính</span>
              <span class="font-bold text-[#3D1A2C]">{{ formatPrice(activeOrder.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span class="font-bold text-[#3D1A2C]">{{ formatPrice(activeOrder.shipping) }}</span>
            </div>
            <div v-if="activeOrder.discount > 0" class="flex justify-between text-green-600">
              <span>Ưu đãi giảm giá</span>
              <span class="font-bold">-{{ formatPrice(activeOrder.discount) }}</span>
            </div>
            <div class="h-px bg-[#FFF0F7] my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-[#3D1A2C]">Thành tiền</span>
              <span class="text-lg font-black text-[#EC4899]">{{ formatPrice(activeOrder.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Hành động -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6 space-y-3">
          <h3 class="text-xs font-bold text-[#EC4899] uppercase tracking-wider mb-4">Thao tác đơn hàng</h3>
          <button
            v-if="activeOrder.canCancel"
            @click="cancelOrder"
            class="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <iconify-icon icon="ph:x-circle-bold" class="text-sm"></iconify-icon>
            Hủy đơn hàng này
          </button>
          <button class="w-full rounded-2xl border border-[#FDD8EE] bg-[#FFF5FA] px-4 py-3 text-xs font-bold text-[#7C3D5C] hover:bg-[#FFF0F7] hover:text-[#EC4899] hover:border-[#EC4899]/20 transition-colors flex items-center justify-center gap-2">
            <iconify-icon icon="ph:chat-circle-duotone" class="text-base text-[#B07090]"></iconify-icon>
            Nhắn tin hỗ trợ
          </button>
          <RouterLink
            to="/shop/products"
            class="w-full rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#D12E7B] px-4 py-3.5 text-xs font-bold text-white hover:shadow-md hover:shadow-[#EC4899]/20 transition-all flex items-center justify-center gap-2"
          >
            <iconify-icon icon="ph:storefront-duotone" class="text-base"></iconify-icon>
            Mua thêm sản phẩm khác
          </RouterLink>
        </div>

        <!-- Danh sách tất cả đơn hàng đã mua -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h3 class="text-base font-bold text-[#3D1A2C] mb-4 flex items-center gap-2 border-b border-[#FDD8EE] pb-3">
            <iconify-icon icon="ph:list-bullets-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
            Lịch sử mua bánh
          </h3>
          <div class="space-y-2.5">
            <button
              v-for="order in mockOrders"
              :key="order.code"
              @click="activeOrder = order"
              class="w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left duration-200"
              :class="activeOrder.code === order.code
                ? 'border-[#EC4899] bg-[#FFF0F7] shadow-sm'
                : 'border-[#FDD8EE] bg-[#FFFFFF] hover:bg-[#FFF0F7]'"
            >
              <div>
                <p class="text-sm font-bold text-[#3D1A2C]">#{{ order.code }}</p>
                <p class="text-[10px] text-[#B07090] font-semibold mt-0.5">{{ order.createdAt }}</p>
              </div>
              <span class="rounded-lg px-2.5 py-1 text-[10px] font-bold" :class="orderStatusClass(order.status)">{{ order.status }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Không có đơn hàng -->
    <div v-else-if="searched" class="rounded-[24px] border border-dashed border-[#FDD8EE] bg-white p-16 text-center font-sans">
      <div class="w-16 h-16 rounded-2xl bg-[#FFF0F7] flex items-center justify-center mx-auto mb-4">
        <iconify-icon icon="ph:package-duotone" class="text-3xl text-[#EC4899]"></iconify-icon>
      </div>
      <h3 class="text-lg font-bold text-[#3D1A2C] mb-1">Không tìm thấy đơn hàng</h3>
      <p class="text-xs text-[#7C3D5C]">Mã đơn hàng <strong>{{ searchCode }}</strong> không tồn tại trên hệ thống.</p>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-white text-xs font-bold font-sans"
        :class="toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-[#3D1A2C]'"
      >
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:info-fill'" class="text-lg"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'

// ===== DỮ LIỆU MOCK =====
const mockOrders = [
  {
    code: 'DH001',
    status: 'Đang giao',
    createdAt: '18/06/2026 09:30',
    deliveryDate: '22/06/2026',
    paymentMethod: 'Chuyển khoản SePay',
    total: 3010000, subtotal: 2980000, shipping: 30000, discount: 0,
    canCancel: false,
    customer: { name: 'Nguyễn Khoa', phone: '0901 234 567', address: '123 Lê Lợi, Q.1, TP.HCM' },
    items: [
      { id: 1, name: 'Bánh sinh nhật 3D Custom', size: '20cm', quantity: 1, price: 2500000, image: 'https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=400&q=80' },
      { id: 2, name: 'Macaron hộp 24', size: '24 cái', quantity: 1, price: 480000, image: 'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=400&q=80' }
    ],
    timeline: [
      { label: 'Đặt hàng thành công', desc: 'Đơn hàng đã được ghi nhận', icon: 'ph:check-circle-duotone', done: true, active: false, time: '09:30 18/06' },
      { label: 'Xác nhận đơn hàng', desc: 'Tiệm bánh đã xác nhận đơn', icon: 'ph:seal-check-duotone', done: true, active: false, time: '10:15 18/06' },
      { label: 'Đang sản xuất', desc: 'Bánh đang được chuẩn bị trong lò', icon: 'ph:cooking-pot-duotone', done: true, active: false, time: '14:00 18/06' },
      { label: 'Sẵn sàng giao', desc: 'Đơn hàng đã đóng gói sẵn sàng', icon: 'ph:package-duotone', done: true, active: false, time: '08:00 20/06' },
      { label: 'Đang giao hàng', desc: 'Shipper đang trên đường giao tới bạn', icon: 'ph:motorcycle-duotone', done: false, active: true, time: '' },
      { label: 'Đã giao hàng', desc: 'Khách hàng nhận hàng và kiểm tra thành công', icon: 'ph:house-duotone', done: false, active: false, time: '' }
    ]
  },
  {
    code: 'DH002',
    status: 'Đang sản xuất',
    createdAt: '19/06/2026 14:00',
    deliveryDate: '22/06/2026',
    paymentMethod: 'COD (Thu khi nhận)',
    total: 700000, subtotal: 700000, shipping: 0, discount: 0,
    canCancel: true,
    customer: { name: 'Nguyễn Khoa', phone: '0901 234 567', address: '123 Lê Lợi, Q.1, TP.HCM' },
    items: [
      { id: 1, name: 'Cupcake Set 12 mix', size: '12 cái', quantity: 2, price: 350000, image: 'https://images.unsplash.com/photo-1520186994236-a332a9a6da5b?auto=format&fit=crop&w=400&q=80' }
    ],
    timeline: [
      { label: 'Đặt hàng thành công', desc: 'Đơn hàng đã được ghi nhận', icon: 'ph:check-circle-duotone', done: true, active: false, time: '14:00 19/06' },
      { label: 'Xác nhận đơn hàng', desc: 'Tiệm bánh đã xác nhận đơn', icon: 'ph:seal-check-duotone', done: true, active: false, time: '14:30 19/06' },
      { label: 'Đang sản xuất', desc: 'Bánh đang được chuẩn bị trong lò', icon: 'ph:cooking-pot-duotone', done: false, active: true, time: '' },
      { label: 'Sẵn sàng giao', desc: 'Đơn hàng đã đóng gói sẵn sàng', icon: 'ph:package-duotone', done: false, active: false, time: '' },
      { label: 'Đang giao hàng', desc: 'Shipper đang trên đường giao tới bạn', icon: 'ph:motorcycle-duotone', done: false, active: false, time: '' },
      { label: 'Đã giao hàng', desc: 'Khách hàng nhận hàng và kiểm tra thành công', icon: 'ph:house-duotone', done: false, active: false, time: '' }
    ]
  },
  {
    code: 'DH003',
    status: 'Đã giao',
    createdAt: '10/06/2026 10:00',
    deliveryDate: '13/06/2026',
    paymentMethod: 'Chuyển khoản SePay',
    total: 520000, subtotal: 520000, shipping: 0, discount: 0,
    canCancel: false,
    customer: { name: 'Nguyễn Khoa', phone: '0901 234 567', address: '123 Lê Lợi, Q.1, TP.HCM' },
    items: [
      { id: 1, name: 'Bánh mousse chanh leo', size: '16cm', quantity: 1, price: 520000, image: 'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?auto=format&fit=crop&w=400&q=80' }
    ],
    timeline: [
      { label: 'Đặt hàng thành công', desc: 'Đơn hàng đã được ghi nhận', icon: 'ph:check-circle-duotone', done: true, active: false, time: '10:00 10/06' },
      { label: 'Xác nhận đơn hàng', desc: 'Tiệm bánh đã xác nhận đơn', icon: 'ph:seal-check-duotone', done: true, active: false, time: '10:30 10/06' },
      { label: 'Đang sản xuất', desc: 'Bánh đang được chuẩn bị trong lò', icon: 'ph:cooking-pot-duotone', done: true, active: false, time: '09:00 12/06' },
      { label: 'Sẵn sàng giao', desc: 'Đơn hàng đã đóng gói sẵn sàng', icon: 'ph:package-duotone', done: true, active: false, time: '08:00 13/06' },
      { label: 'Đang giao hàng', desc: 'Shipper đang trên đường giao tới bạn', icon: 'ph:motorcycle-duotone', done: true, active: false, time: '09:00 13/06' },
      { label: 'Đã giao hàng', desc: 'Khách hàng nhận hàng và kiểm tra thành công', icon: 'ph:house-duotone', done: true, active: false, time: '10:45 13/06' }
    ]
  }
]

// ===== STATE =====
const searchCode = ref('')
const searched = ref(false)
const activeOrder = ref(mockOrders[0])
const showNotif = ref(false)

// ===== THÔNG BÁO =====
const notifications = ref([
  { id: 1, type: 'delivery', title: 'Đơn #DH001 đang được giao', body: 'Shipper đang trên đường đến địa chỉ của bạn. Dự kiến 30 phút nữa.', time: '10 phút trước', read: false },
  { id: 2, type: 'confirm', title: 'Đơn #DH002 đã được xác nhận', body: 'Tiệm bánh đã xác nhận đơn hàng của bạn và bắt đầu sản xuất.', time: '2 giờ trước', read: false },
  { id: 3, type: 'promo', title: 'Ưu đãi cuối tuần 🎉', body: 'Nhập WEEKEND15 để được giảm 15% cho đơn hàng tiếp theo!', time: '1 ngày trước', read: true },
  { id: 4, type: 'done', title: 'Đơn #DH003 đã giao thành công', body: 'Bạn đã nhận hàng thành công. Hãy đánh giá sản phẩm nhé!', time: '7 ngày trước', read: true }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toggleNotifications = () => { showNotif.value = !showNotif.value }
const markAllRead = () => { notifications.value.forEach(n => n.read = true) }
const readNotif = (notif) => { notif.read = true }

// Đóng dropdown khi click ngoài
const closeDropdown = (e) => {
  if (!e.target.closest('.relative')) showNotif.value = false
}
onMounted(() => document.addEventListener('click', closeDropdown))
onBeforeUnmount(() => document.removeEventListener('click', closeDropdown))

// ===== TÌM ĐƠN =====
const searchOrder = () => {
  searched.value = true
  const found = mockOrders.find(o => o.code.toUpperCase() === searchCode.value.trim().toUpperCase())
  activeOrder.value = found || null
  if (!found) showToast('Không tìm thấy mã đơn hàng này', 'error')
}

// ===== HUỶ ĐƠN =====
const cancelOrder = () => {
  if (!activeOrder.value) return
  activeOrder.value.status = 'Đã huỷ'
  activeOrder.value.canCancel = false
  showToast('Đã huỷ đơn hàng thành công', 'success')
}

// ===== HELPERS =====
const formatPrice = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const orderStatusClass = (status) => ({
  'Chờ xác nhận':  'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Đã xác nhận':   'bg-blue-50 text-blue-700 border border-blue-200',
  'Đang sản xuất': 'bg-[#FFF5FA] text-[#EC4899] border border-[#FDD8EE]',
  'Đang giao':     'bg-purple-50 text-purple-700 border border-purple-200',
  'Đã giao':       'bg-green-50 text-green-700 border border-green-200',
  'Đã huỷ':        'bg-red-50 text-red-600 border border-red-200',
}[status] || 'bg-gray-50 text-gray-600 border border-gray-200')

const notifIcon = (type) => ({
  delivery: 'ph:motorcycle-duotone',
  confirm:  'ph:seal-check-duotone',
  promo:    'ph:tag-duotone',
  done:     'ph:check-circle-duotone',
}[type] || 'ph:bell-duotone')

const notifIconBg = (type) => ({
  delivery: 'bg-purple-50',
  confirm:  'bg-blue-50',
  promo:    'bg-[#FFF5FA]',
  done:     'bg-green-50',
}[type] || 'bg-gray-50')

const notifIconColor = (type) => ({
  delivery: 'text-purple-500',
  confirm:  'text-blue-500',
  promo:    'text-[#EC4899]',
  done:     'text-green-500',
}[type] || 'text-gray-400')

// ===== TOAST =====
const toast = ref({ show: false, msg: '', type: 'info' })
let toastTimer = null
const showToast = (msg, type = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, msg, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
