<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in blossom-theme">

    <!-- ===== TIÊU ĐỀ ===== -->
    <div class="p-6" style="border-radius:24px;background:#FFFFFF;border:1px solid #FDD8EE;">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg,#EC4899,#F472B6);box-shadow:0 4px 16px rgba(236,72,153,0.2);">
          <iconify-icon icon="ph:credit-card-duotone" class="text-2xl" style="color:#FFFFFF;"></iconify-icon>
        </div>
        <div>
          <h1 style="font-family:'Playfair Display',serif;font-size:26px;font-weight:950;color:#3D1A2C;letter-spacing:1px;margin:0;">Thanh toán đơn hàng</h1>
          <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;margin:4px 0 0;">Chọn phương thức và hoàn tất các thủ tục đặt bánh.</p>
        </div>
      </div>
    </div>

    <!-- ===== NỘI DUNG CHÍNH ===== -->
    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">

      <!-- ===== CỘT TRÁI ===== -->
      <div class="space-y-5">

        <!-- BƯỚC 1: Xác nhận thông tin giao hàng -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-base font-bold text-[#3D1A2C] flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white text-xs font-black flex items-center justify-center font-sans">1</span>
              Thông tin nhận hàng
            </h2>
            <button class="text-xs font-bold text-[#EC4899] hover:underline font-sans">Chỉnh sửa</button>
          </div>

          <div class="grid sm:grid-cols-2 gap-4 text-xs bg-[#FFF0F7] border border-[#FDD8EE] rounded-2xl p-4 font-sans">
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Người nhận</p>
              <p class="font-bold text-[#3D1A2C]">{{ orderInfo.name }}</p>
              <p class="text-gray-500">{{ orderInfo.phone }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Địa chỉ giao bánh</p>
              <p class="font-semibold text-[#3D1A2C] leading-relaxed">{{ orderInfo.address }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Ngày giao bánh</p>
              <p class="font-bold text-[#EC4899]">{{ orderInfo.deliveryDate }}</p>
            </div>
            <div>
              <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide mb-1">Khung giờ giao</p>
              <p class="font-semibold text-[#3D1A2C]">{{ orderInfo.timeSlot }}</p>
            </div>
          </div>
        </div>

        <!-- BƯỚC 2: Phương thức thanh toán -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#3D1A2C] flex items-center gap-2 mb-5">
            <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white text-xs font-black flex items-center justify-center font-sans">2</span>
            Phương thức thanh toán
          </h2>

          <div class="space-y-3 font-sans">
            <!-- SePay -->
            <label
              class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
              :class="paymentMethod === 'sepay' ? 'border-[#EC4899] bg-[#FFF0F7]' : 'border-[#FDD8EE] bg-white hover:border-[#EC4899]/30'"
            >
              <input type="radio" value="sepay" v-model="paymentMethod" class="sr-only" />
              <div
                class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                :class="paymentMethod === 'sepay' ? 'border-[#EC4899]' : 'border-gray-300'"
              >
                <div v-if="paymentMethod === 'sepay'" class="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="w-10 h-10 rounded-xl bg-[#FFF5FA] border border-[#FDD8EE] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <iconify-icon icon="ph:bank-duotone" class="text-xl text-[#EC4899]"></iconify-icon>
                  </div>
                  <div>
                    <p class="font-bold text-[#3D1A2C] text-sm">Chuyển khoản SePay</p>
                    <p class="text-xs text-[#B07090] font-medium">Tự động xác nhận trong 1 giây qua mã QR</p>
                  </div>
                  <span class="ml-auto rounded-lg bg-[#FFF5FA] border border-[#F59E0B] text-[#EC4899] text-[10px] font-black uppercase tracking-wider px-2 py-0.5">Khuyên dùng</span>
                </div>

                <!-- QR SePay khi chọn -->
                <Transition name="expand">
                  <div v-if="paymentMethod === 'sepay'" class="mt-5 pt-4 border-t border-[#FDD8EE] space-y-4">
                    <div class="flex flex-col sm:flex-row gap-6 items-start">
                      <!-- QR Code -->
                      <div class="flex flex-col items-center gap-2 mx-auto sm:mx-0">
                        <div class="w-48 h-48 rounded-2xl border-4 border-white shadow-md bg-white p-2 flex items-center justify-center">
                          <div class="w-full h-full bg-gradient-to-br from-[#EC4899] to-[#831843] rounded-xl flex items-center justify-center relative overflow-hidden">
                            <!-- Mock QR pattern -->
                            <div class="grid grid-cols-7 gap-0.5 p-2">
                              <div v-for="i in 49" :key="i"
                                class="w-4 h-4 rounded-[1px]"
                                :class="qrPattern[i % qrPattern.length] ? 'bg-white' : 'bg-transparent'"
                              ></div>
                            </div>
                            <div class="absolute inset-0 flex items-center justify-center">
                              <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow">
                                <iconify-icon icon="ph:storefront-duotone" class="text-[#EC4899] text-xl"></iconify-icon>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wider">Quét bằng ứng dụng ngân hàng</p>
                        <div class="flex items-center gap-1.5">
                          <span v-if="!qrExpired" class="text-xs text-green-600 font-bold flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Tạo lại mã sau: {{ qrCountdown }}s
                          </span>
                          <span v-else class="text-xs text-red-500 font-bold">QR đã hết hạn</span>
                        </div>
                        <button v-if="qrExpired" @click="resetQR" class="text-xs font-bold text-[#EC4899] hover:underline">Tạo lại mã QR</button>
                      </div>

                      <!-- Thông tin chuyển khoản -->
                      <div class="flex-1 space-y-3 text-xs w-full">
                        <p class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide">Thông tin chuyển khoản</p>
                        <div class="space-y-2.5 bg-[#FFF0F7] border border-[#FDD8EE] rounded-2xl p-4">
                          <div v-for="item in bankInfo" :key="item.label" class="flex items-center justify-between gap-3">
                            <span class="text-[#7C3D5C] font-medium">{{ item.label }}</span>
                            <div class="flex items-center gap-2">
                              <span class="font-bold text-[#3D1A2C]">{{ item.value }}</span>
                              <button @click="copyText(item.value)" class="w-6 h-6 rounded-lg bg-white border border-[#FDD8EE] hover:border-[#EC4899] hover:text-[#EC4899] transition-colors flex items-center justify-center text-[#B07090]">
                                <iconify-icon icon="ph:copy" class="text-[10px]"></iconify-icon>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="rounded-xl bg-[#FFF5FA] border border-[#FDD8EE] p-3 text-[11px] text-[#F59E0B] font-bold flex items-start gap-2">
                          <iconify-icon icon="ph:warning-duotone" class="text-sm mt-0.5"></iconify-icon>
                          <span>Vui lòng không sửa nội dung chuyển khoản để hệ thống tự động xác nhận đơn hàng sau 1 giây.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </label>

            <!-- COD -->
            <label
              class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
              :class="paymentMethod === 'cod' ? 'border-[#EC4899] bg-[#FFF0F7]' : 'border-[#FDD8EE] bg-white hover:border-[#EC4899]/30'"
            >
              <input type="radio" value="cod" v-model="paymentMethod" class="sr-only" />
              <div
                class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                :class="paymentMethod === 'cod' ? 'border-[#EC4899]' : 'border-gray-300'"
              >
                <div v-if="paymentMethod === 'cod'" class="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="w-10 h-10 rounded-xl bg-[#FFF5FA] border border-[#FDD8EE] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <iconify-icon icon="ph:money-duotone" class="text-xl text-[#EC4899]"></iconify-icon>
                  </div>
                  <div>
                    <p class="font-bold text-[#3D1A2C] text-sm">COD – Thanh toán khi nhận hàng</p>
                    <p class="text-xs text-[#B07090] font-medium">Trả tiền mặt hoặc quét mã QR khi nhận bánh</p>
                  </div>
                </div>

                <Transition name="expand">
                  <div v-if="paymentMethod === 'cod'" class="mt-4 rounded-2xl bg-[#FFF5FA] border border-[#FDD8EE] p-4 text-xs">
                    <div class="flex items-start gap-3">
                      <iconify-icon icon="ph:info-duotone" class="text-[#EC4899] text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                      <div class="text-[#7C3D5C] space-y-1.5 font-bold">
                        <p>✓ Không cần thanh toán trước.</p>
                        <p>✓ Thanh toán tiện lợi khi giao bánh.</p>
                        <p>⚠ Áp dụng phí thu hộ COD: <strong class="text-[#EC4899]">{{ formatPrice(10000) }}</strong>.</p>
                        <p>⚠ Chỉ áp dụng cho đơn hàng có tổng trị giá dưới <strong class="text-[#EC4899]">5.000.000đ</strong>.</p>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </label>
          </div>
        </div>

        <!-- BƯỚC 3: Xem lại đơn hàng -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#3D1A2C] flex items-center gap-2 mb-4">
            <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white text-xs font-black flex items-center justify-center font-sans">3</span>
            Xem lại đơn hàng của bạn
          </h2>
          <div class="space-y-3 font-sans">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 p-3 bg-[#FFF5FA] border border-[#FDD8EE] rounded-2xl hover:bg-[#FFF0F7] transition-colors duration-200">
              <img :src="item.image" :alt="item.name" class="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm" />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#3D1A2C] truncate">{{ item.name }}</p>
                <p class="text-xs text-[#B07090] font-medium">{{ item.size }} · x{{ item.quantity }}</p>
              </div>
              <p class="font-black text-sm text-[#EC4899] whitespace-nowrap">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== CỘT PHẢI: Tóm tắt & Xác nhận ===== -->
      <div class="space-y-5">

        <!-- Tóm tắt đơn hàng -->
        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6 sticky top-24 font-sans">
          <h3 class="text-base font-bold text-[#3D1A2C] mb-5 flex items-center gap-2 border-b border-[#FFF0F7] pb-3">
            <iconify-icon icon="ph:receipt-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
            Hóa đơn thanh toán
          </h3>

          <div class="space-y-3.5 text-xs font-medium text-gray-500">
            <div class="flex justify-between">
              <span>Tạm tính ({{ cartItems.length }} bánh)</span>
              <span class="font-bold text-[#3D1A2C]">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí vận chuyển</span>
              <span class="font-bold text-[#3D1A2C]">{{ formatPrice(shippingFee) }}</span>
            </div>
            <div v-if="paymentMethod === 'cod'" class="flex justify-between text-[#EC4899]">
              <span>Phí thu hộ COD</span>
              <span class="font-bold">+ {{ formatPrice(10000) }}</span>
            </div>
            <div v-if="discount > 0" class="flex justify-between text-green-600">
              <span>Mã giảm giá</span>
              <span class="font-bold">-{{ formatPrice(discount) }}</span>
            </div>
            <div class="h-px bg-[#FFF0F7] my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-[#3D1A2C]">Tổng thanh toán</span>
              <span class="text-2xl font-black text-[#EC4899]">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Phương thức đã chọn -->
          <div class="mt-5 rounded-2xl p-3 border flex items-center gap-2.5 text-xs font-bold"
            :class="paymentMethod === 'sepay' ? 'bg-[#FFF0F7] border-[#FDD8EE]' : 'bg-[#FFF5FA] border-[#FDD8EE]'">
            <iconify-icon
              :icon="paymentMethod === 'sepay' ? 'ph:bank-duotone' : 'ph:money-duotone'"
              class="text-lg flex-shrink-0"
              :class="paymentMethod === 'sepay' ? 'text-[#EC4899]' : 'text-[#EC4899]'"
            ></iconify-icon>
            <span class="text-[#EC4899]">
              {{ paymentMethod === 'sepay' ? 'Thanh toán SePay QR' : 'Thanh toán COD khi nhận' }}
            </span>
          </div>

          <!-- Nút xác nhận -->
          <button
            @click="confirmPayment"
            :disabled="isProcessing"
            class="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#D12E7B] px-5 py-4 text-xs font-bold text-white shadow-md shadow-[#EC4899]/15 hover:shadow-[#EC4899]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-75 disabled:cursor-wait disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            <iconify-icon v-if="!isProcessing" icon="ph:lock-duotone" class="text-sm"></iconify-icon>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"></circle>
              <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ isProcessing ? 'Đang xử lý đơn hàng...' : 'Xác nhận & Đặt hàng' }}
          </button>

          <p class="mt-4 text-center text-[10px] text-gray-400 font-medium">
            <iconify-icon icon="ph:shield-check-fill" class="mr-1 text-green-600 text-xs"></iconify-icon>
            Bảo mật thanh toán chuẩn SSL 256-bit
          </p>
        </div>
      </div>
    </div>

    <!-- ===== MODAL ĐẶT HÀNG THÀNH CÔNG ===== -->
    <Transition name="modal">
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showSuccess = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-[28px] shadow-2xl p-8 max-w-md w-full text-center border border-[#FDD8EE] animate-fade-in font-sans">
          <!-- Checkmark animation -->
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/25">
            <iconify-icon icon="ph:check-bold" class="text-3xl text-white"></iconify-icon>
          </div>
          <h2 class="text-2xl font-black text-[#3D1A2C] tracking-tight">Đặt hàng thành công! 🎉</h2>
          <p class="text-gray-400 text-xs mt-1">Mã đơn hàng của bạn:</p>
          
          <div class="inline-flex items-center gap-3 bg-[#FFF0F7] border border-[#FDD8EE] rounded-xl px-4 py-2 mt-2 mb-5">
            <span class="text-lg font-black text-[#EC4899]">#DH{{ newOrderCode }}</span>
            <button @click="copyText('DH' + newOrderCode)" class="text-[#B07090] hover:text-[#EC4899] transition-colors flex items-center">
              <iconify-icon icon="ph:copy" class="text-sm"></iconify-icon>
            </button>
          </div>
          
          <p class="text-xs text-[#7C3D5C] leading-relaxed mb-6 font-sans">
            {{ paymentMethod === 'sepay'
              ? 'Đơn hàng đã được ghi nhận. Vui lòng hoàn tất chuyển khoản theo mã QR để hệ thống tự động xác nhận chế biến.'
              : 'Đơn hàng đã được tiếp nhận. Đội ngũ thợ bánh sẽ liên hệ để xác nhận và shipper sẽ giao tới bạn.' }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <RouterLink
              to="/shop/order-tracking"
              class="flex-1 rounded-xl bg-[#EC4899] px-4 py-3.5 text-xs font-bold text-white hover:bg-[#D12E7B] hover:shadow-lg hover:shadow-[#EC4899]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <iconify-icon icon="ph:package-duotone" class="text-sm"></iconify-icon>
              Theo dõi đơn hàng
            </RouterLink>
            <RouterLink
              to="/shop/products"
              class="flex-1 rounded-xl border border-[#FDD8EE] bg-[#FFF5FA] px-4 py-3.5 text-xs font-bold text-[#7C3D5C] hover:bg-[#FFF0F7] hover:text-[#EC4899] transition-all flex items-center justify-center gap-1.5"
            >
              <iconify-icon icon="ph:storefront-duotone" class="text-sm"></iconify-icon>
              Tiếp tục mua bánh
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-white text-xs font-bold font-sans"
        :class="toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-[#3D1A2C]'"
      >
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" class="text-lg"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'

// ===== THÔNG TIN GIAO HÀNG (lấy từ Cart) =====
const orderInfo = ref({
  name: 'Nguyễn Khoa',
  phone: '0901 234 567',
  address: '123 Lê Lợi, Q.1, TP.HCM',
  deliveryDate: '22/06/2026',
  timeSlot: '09:00 – 11:00'
})

// ===== SẢN PHẨM (mock từ Cart) =====
const cartItems = ref([
  { id: 1, name: 'Bánh sinh nhật 3D Custom', size: '20cm', quantity: 1, price: 2500000, image: 'https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Macaron hộp 24', size: '24 cái', quantity: 2, price: 480000, image: 'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Cupcake Set 12 mix', size: '12 cái', quantity: 1, price: 350000, image: 'https://images.unsplash.com/photo-1520186994236-a332a9a6da5b?auto=format&fit=crop&w=400&q=80' }
])

// ===== THANH TOÁN =====
const paymentMethod = ref('sepay')
const discount = ref(0)

const subtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.quantity, 0))
const shippingFee = computed(() => subtotal.value >= 3000000 ? 0 : 30000)
const codFee = computed(() => paymentMethod.value === 'cod' ? 10000 : 0)
const total = computed(() => subtotal.value + shippingFee.value + codFee.value - discount.value)

// ===== THÔNG TIN NGÂN HÀNG SEPAY =====
const bankInfo = [
  { label: 'Ngân hàng thụ hưởng', value: 'Vietcombank' },
  { label: 'Số tài khoản', value: '1234 5678 9012' },
  { label: 'Tên tài khoản', value: 'TIEM BANH POLYCAKE' },
  { label: 'Số tiền chuyển khoản', value: '3,540,000đ' },
  { label: 'Nội dung chuyển khoản', value: 'DH' + Date.now().toString().slice(-6) }
]

const copyText = (text) => {
  navigator.clipboard?.writeText(text)
  showToast('Đã sao chép vào bộ nhớ tạm!', 'success')
}

// ===== QR COUNTDOWN =====
const qrCountdown = ref(180)
const qrExpired = ref(false)
let qrTimer = null

const startQRTimer = () => {
  qrCountdown.value = 180
  qrExpired.value = false
  clearInterval(qrTimer)
  qrTimer = setInterval(() => {
    if (qrCountdown.value <= 0) {
      qrExpired.value = true
      clearInterval(qrTimer)
    } else {
      qrCountdown.value--
    }
  }, 1000)
}
const resetQR = () => startQRTimer()

onMounted(() => startQRTimer())
onBeforeUnmount(() => clearInterval(qrTimer))

// Mock QR pattern
const qrPattern = [1,0,1,1,0,1,0,1,0,1,1,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,1,1,0,1,0,1,0,1,0,0,1,1,0,1,0,0,1,0,1,1,0,1,0]

// ===== XỬ LÝ ĐẶT HÀNG =====
const isProcessing = ref(false)
const showSuccess = ref(false)
const newOrderCode = ref('')

const confirmPayment = async () => {
  isProcessing.value = true
  await new Promise(r => setTimeout(r, 2000)) // giả lập gọi API
  isProcessing.value = false
  newOrderCode.value = Date.now().toString().slice(-6)
  showSuccess.value = true
}

// ===== TOAST =====
const toast = ref({ show: false, msg: '', type: 'info' })
let toastTimer = null
const showToast = (msg, type = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, msg, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

const formatPrice = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
</script>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div:last-child, .modal-leave-active > div:last-child {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child {
  transform: scale(0.85) translateY(20px);
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
</style>
