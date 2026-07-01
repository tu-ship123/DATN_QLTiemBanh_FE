<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in">

    <!-- Header -->
    <div class="rounded-[24px] p-6 bg-white border border-[#EDE0CC] shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);box-shadow:0 4px 16px rgba(122,92,58,0.2);">
            <iconify-icon icon="ph:credit-card-duotone" class="text-2xl" style="color:#FFFFFF;"></iconify-icon>
          </div>
          <div>
            <h1 style="font-family:'Playfair Display',serif;font-size:26px;font-weight:950;color:#3D2A1A;letter-spacing:1px;margin:0;">
              Thanh toán đơn hàng
            </h1>
            <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7A5C3A;margin:4px 0 0;">
              Nhập thông tin giao nhận và chọn phương thức thanh toán.
            </p>
          </div>
        </div>
        <button @click="$router.push('/shop/cart')"
          class="text-xs font-bold text-[#7A5C3A] hover:underline font-sans px-4 py-2 bg-[#FDF6EC] rounded-xl border border-[#EDE0CC] hover:bg-[#EDE0CC] transition-colors">
          ← Quay lại giỏ hàng
        </button>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div class="space-y-5">

        <!-- Thông tin nhận hàng -->
        <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#5C4428] flex items-center gap-2 mb-5">
            <span class="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center font-sans"
              style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">1</span>
            Thông tin nhận hàng
          </h2>

          <div class="grid sm:grid-cols-2 gap-4 font-sans">
            <div class="space-y-1">
              <label class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide">Tên người nhận</label>
              <input v-model="form.tenNguoiNhan" type="text" placeholder="Nguyễn Ngọc Tú"
                class="w-full rounded-2xl border border-[#EDE0CC] bg-[#FDF6EC] px-4 py-3.5 text-xs text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all placeholder:text-[#A68B5C]" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide">Số điện thoại</label>
              <input v-model="form.soDienThoai" type="text" placeholder="090xxxxxxx"
                class="w-full rounded-2xl border border-[#EDE0CC] bg-[#FDF6EC] px-4 py-3.5 text-xs text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all placeholder:text-[#A68B5C]" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide">Ngày nhận bánh (Dự kiến)</label>
              <input v-model="form.ngayGiaoHang" :min="minDate" type="date"
                class="w-full rounded-2xl border border-[#EDE0CC] bg-[#FDF6EC] px-4 py-3.5 text-xs text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide">Địa chỉ giao hàng</label>
              <input v-model="form.diaChiGiaoHang" type="text" placeholder="Số nhà, tên đường..."
                class="w-full rounded-2xl border border-[#EDE0CC] bg-[#FDF6EC] px-4 py-3.5 text-xs text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all placeholder:text-[#A68B5C]" />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide">Ghi chú đơn hàng (Nếu có)</label>
              <textarea v-model="form.ghiChu" rows="2" placeholder="Ví dụ: Ghi chữ Chúc mừng sinh nhật..."
                class="w-full rounded-2xl border border-[#EDE0CC] bg-[#FDF6EC] px-4 py-3.5 text-xs text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all placeholder:text-[#A68B5C]"></textarea>
            </div>
          </div>
        </div>

        <!-- Phương thức thanh toán -->
        <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#5C4428] flex items-center gap-2 mb-5">
            <span class="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center font-sans"
              style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">2</span>
            Phương thức thanh toán
          </h2>

          <div class="space-y-3 font-sans">
            <!-- SePay -->
            <label class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
              :class="form.phuongThucThanhToan === 'SEPAY' ? 'border-[#7A5C3A] bg-[#FDF6EC]' : 'border-[#EDE0CC] bg-white hover:border-[#9A7650]/40'">
              <input type="radio" value="SEPAY" v-model="form.phuongThucThanhToan" class="sr-only" />
              <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                :class="form.phuongThucThanhToan === 'SEPAY' ? 'border-[#7A5C3A]' : 'border-gray-300'">
                <div v-if="form.phuongThucThanhToan === 'SEPAY'" class="w-2.5 h-2.5 rounded-full bg-[#7A5C3A]"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="w-10 h-10 rounded-xl bg-[#FDF6EC] border border-[#EDE0CC] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <iconify-icon icon="ph:bank-duotone" class="text-xl text-[#7A5C3A]"></iconify-icon>
                  </div>
                  <div>
                    <p class="font-bold text-[#5C4428] text-sm">Chuyển khoản QR (SePay)</p>
                    <p class="text-xs text-[#A68B5C] font-medium">Tự động xác nhận đơn hàng ngay lập tức</p>
                  </div>
                  <span class="ml-auto rounded-lg bg-[#FDF6EC] border border-[#EDE0CC] text-[#7A5C3A] text-[10px] font-black uppercase tracking-wider px-2 py-0.5">Khuyên dùng</span>
                </div>
              </div>
            </label>

            <!-- COD -->
            <label class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
              :class="form.phuongThucThanhToan === 'COD' ? 'border-[#7A5C3A] bg-[#FDF6EC]' : 'border-[#EDE0CC] bg-white hover:border-[#9A7650]/40'">
              <input type="radio" value="COD" v-model="form.phuongThucThanhToan" class="sr-only" />
              <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                :class="form.phuongThucThanhToan === 'COD' ? 'border-[#7A5C3A]' : 'border-gray-300'">
                <div v-if="form.phuongThucThanhToan === 'COD'" class="w-2.5 h-2.5 rounded-full bg-[#7A5C3A]"></div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="w-10 h-10 rounded-xl bg-[#FDF6EC] border border-[#EDE0CC] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <iconify-icon icon="ph:money-duotone" class="text-xl text-[#7A5C3A]"></iconify-icon>
                  </div>
                  <div>
                    <p class="font-bold text-[#5C4428] text-sm">COD – Thanh toán khi nhận hàng</p>
                    <p class="text-xs text-[#A68B5C] font-medium">Trả tiền mặt hoặc chuyển khoản cho shipper</p>
                  </div>
                </div>
                <Transition name="expand">
                  <div v-if="form.phuongThucThanhToan === 'COD'" class="mt-4 rounded-2xl bg-[#FDF6EC] border border-[#EDE0CC] p-4 text-xs">
                    <div class="flex items-start gap-3">
                      <iconify-icon icon="ph:info-duotone" class="text-[#7A5C3A] text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                      <div class="text-[#5C4428] space-y-1.5 font-bold">
                        <p class="flex items-center gap-2">
                          <iconify-icon icon="ph:check-circle-duotone" class="text-[#7A5C3A]"></iconify-icon>
                          Thanh toán tiện lợi khi giao bánh.
                        </p>
                        <p class="flex items-center gap-2">
                          <iconify-icon icon="ph:warning-duotone" class="text-amber-500"></iconify-icon>
                          Chỉ áp dụng cho đơn hàng dưới <strong class="text-[#7A5C3A]">5.000.000đ</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </label>
          </div>
        </div>

        <!-- Xem lại đơn hàng -->
        <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#5C4428] flex items-center gap-2 mb-4">
            <span class="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center font-sans"
              style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">3</span>
            Xem lại đơn hàng của bạn
          </h2>
          <div class="space-y-3 font-sans">
            <div v-for="item in cartStore.items" :key="item.id"
              class="flex items-center gap-4 p-3 bg-[#FDF6EC] border border-[#EDE0CC] rounded-2xl hover:bg-[#F5ECD8] transition-colors duration-200">
              <img :src="item.anhSanPham || defaultImage" :alt="item.tenSanPham"
                class="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm"
                @error="e => e.target.src = defaultImage" />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#5C4428] truncate">{{ item.tenSanPham }}</p>
                <p class="text-xs text-[#A68B5C] font-medium">SL: x{{ item.soLuong }}</p>
              </div>
              <p class="font-black text-sm text-[#7A5C3A] whitespace-nowrap">{{ formatCurrency(item.thanhTien) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar hóa đơn -->
      <div class="space-y-5">
        <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6 sticky top-24 font-sans">
          <h3 class="text-base font-bold text-[#5C4428] mb-5 flex items-center gap-2 border-b border-[#EDE0CC] pb-3">
            <iconify-icon icon="ph:receipt-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
            Hóa đơn thanh toán
          </h3>

          <div class="space-y-3.5 text-xs font-medium text-[#9A7650]">
            <div class="flex justify-between">
              <span>Tạm tính ({{ cartStore.items.length }} bánh)</span>
              <span class="font-bold text-[#5C4428]">{{ formatCurrency(cartStore.tongTienHang) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span class="font-bold text-[#5C4428]">{{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}</span>
            </div>
            <div class="h-px bg-[#EDE0CC] my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-[#5C4428]">Tổng thanh toán</span>
              <span class="text-2xl font-black text-[#7A5C3A]">{{ formatCurrency(cartStore.tongThanhToan) }}</span>
            </div>
          </div>

          <div class="mt-5 rounded-2xl p-3 bg-[#FDF6EC] border border-[#EDE0CC] flex items-center gap-2.5 text-xs font-bold">
            <iconify-icon :icon="form.phuongThucThanhToan === 'SEPAY' ? 'ph:bank-duotone' : 'ph:money-duotone'"
              class="text-lg flex-shrink-0 text-[#7A5C3A]"></iconify-icon>
            <span class="text-[#7A5C3A]">
              {{ form.phuongThucThanhToan === 'SEPAY' ? 'Thanh toán SePay QR' : 'Thanh toán COD khi nhận' }}
            </span>
          </div>

          <button
            @click="handleDatHang"
            :disabled="loading || cartStore.items.length === 0"
            class="chocopine-btn-primary mt-5 w-full px-5 py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait disabled:translate-y-0"
          >
            <iconify-icon v-if="!loading" icon="ph:lock-duotone" class="text-sm"></iconify-icon>
            <svg v-else class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"></circle>
              <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? 'Đang xử lý đơn hàng...' : 'Xác nhận & Đặt hàng' }}
          </button>

          <p class="mt-4 text-center text-[10px] text-gray-400 font-medium">
            <iconify-icon icon="ph:shield-check-fill" class="mr-1 text-green-600 text-xs"></iconify-icon>
            Bảo mật thanh toán chuẩn SSL 256-bit
          </p>
        </div>
      </div>
    </div>

    <!-- ===== MODAL QR SEPAY ===== -->
    <Transition name="modal">
      <div v-if="showQrModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-[#EDE0CC] animate-fade-in font-sans relative">
          <button @click="huyTheoDoiQr"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#FDF6EC] text-[#7A5C3A] hover:bg-[#EDE0CC] transition-colors">✕</button>
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">
            <iconify-icon icon="ph:qr-code-duotone" class="text-3xl text-white"></iconify-icon>
          </div>
          <h3 class="text-xl font-black text-[#3D2A1A]">Quét mã QR để thanh toán</h3>
          <div class="flex items-center justify-center gap-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-white bg-[#7A5C3A] px-2 py-0.5 rounded-lg">SePay</span>
            <span class="text-xs text-[#A68B5C] font-medium">Xác nhận tự động qua hệ thống SePay</span>
          </div>
          <p class="text-xs text-[#A68B5C] font-medium px-4">Hệ thống sẽ tự động chuyển trang sau khi nhận được tiền (Thường mất 5-10s)</p>
          <div class="bg-[#FDF6EC] p-4 rounded-2xl inline-block shadow-inner border border-[#EDE0CC]">
            <img :src="qrImageUrl" alt="Mã QR Thanh Toán SePay" class="w-64 h-64 mx-auto object-contain rounded-xl bg-white p-2" />
          </div>
          <div class="bg-[#FDF6EC] rounded-2xl p-4 text-xs text-[#5C4428] font-medium text-left space-y-2 border border-[#EDE0CC]">
            <p>📌 <strong>Nội dung bắt buộc:</strong>
              <span class="bg-white border border-[#EDE0CC] px-2 py-1 rounded text-[#7A5C3A] font-black text-sm ml-1">{{ sePayMemo }}</span>
            </p>
            <p class="text-[11px] italic flex items-center gap-1.5">
              <iconify-icon icon="ph:warning-duotone" class="text-amber-500 shrink-0"></iconify-icon>
              Vui lòng không tự ý sửa nội dung chuyển khoản để SePay tự quét đơn.
            </p>
          </div>
          <div class="flex items-center justify-center gap-2 text-sm font-bold text-[#7A5C3A] animate-pulse pt-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#7A5C3A]"></span>
            Đang chờ bạn chuyển khoản...
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== MODAL THÀNH CÔNG (COD) ===== -->
    <Transition name="modal">
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl text-center space-y-5 border border-[#EDE0CC] animate-fade-in font-sans">
          <!-- Icon check -->
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">
            <iconify-icon icon="ph:check-bold" class="text-4xl text-white"></iconify-icon>
          </div>
          <div>
            <h3 class="text-2xl font-black text-[#3D2A1A]">Đặt hàng thành công!</h3>
            <p class="text-sm text-[#9A7650] mt-2 font-medium">
              Đơn hàng của bạn đã được ghi nhận.<br>Chúng tôi sẽ liên hệ xác nhận sớm nhất.
            </p>
          </div>
          <div class="bg-[#FDF6EC] rounded-2xl p-4 text-xs text-[#5C4428] border border-[#EDE0CC] text-left space-y-2">
            <p class="flex justify-between"><span class="text-[#A68B5C] font-bold">Người nhận:</span> <span class="font-bold">{{ form.tenNguoiNhan }}</span></p>
            <p class="flex justify-between"><span class="text-[#A68B5C] font-bold">Số điện thoại:</span> <span class="font-bold">{{ form.soDienThoai }}</span></p>
            <p class="flex justify-between"><span class="text-[#A68B5C] font-bold">Tổng tiền:</span> <span class="font-black text-[#7A5C3A]">{{ formatCurrency(cartStore.tongThanhToan) }}</span></p>
            <p class="flex justify-between"><span class="text-[#A68B5C] font-bold">Thanh toán:</span> <span class="font-bold">COD khi nhận hàng</span></p>
          </div>
          <div class="flex items-center gap-2 text-xs text-[#A68B5C] justify-center">
            <svg class="w-4 h-4 animate-spin text-[#7A5C3A]" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Đang chuyển sang lịch sử đơn hàng...
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== TOAST ===== -->
    <Transition name="toast">
      <div v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-white text-xs font-bold font-sans"
        :class="toast.type === 'success' ? 'bg-[#7A5C3A]' : toast.type === 'error' ? 'bg-red-500' : 'bg-amber-500'">
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:warning-circle-fill'" class="text-lg"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/orderService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const showQrModal = ref(false)
const showSuccessModal = ref(false)
const qrImageUrl = ref('')
const sePayMemo = ref('')
let checkOrderInterval = null

const defaultImage = 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80'

// ===== HELPERS =====
const getTodayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const parseJwt = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
  } catch { return {} }
}

// ===== FORM =====
const form = ref({
  tenNguoiNhan: '',
  soDienThoai: '',
  diaChiGiaoHang: '',
  ngayGiaoHang: getTodayString(),
  ghiChu: '',
  phuongThucThanhToan: 'SEPAY'
})

// ===== AUTO-FILL từ user / token =====
onMounted(() => {
  const user = authStore.user
  if (user?.hoTen)        form.value.tenNguoiNhan    = user.hoTen
  if (user?.soDienThoai)  form.value.soDienThoai     = user.soDienThoai
  if (user?.diaChi)       form.value.diaChiGiaoHang  = user.diaChi

  // Fallback: decode JWT nếu store chưa có profile đầy đủ
  const token = authStore.accessToken
  if (token) {
    const decoded = parseJwt(token)
    if (!form.value.tenNguoiNhan   && decoded.hoTen)        form.value.tenNguoiNhan   = decoded.hoTen
    if (!form.value.soDienThoai    && decoded.soDienThoai)  form.value.soDienThoai    = decoded.soDienThoai
    if (!form.value.diaChiGiaoHang && decoded.diaChi)       form.value.diaChiGiaoHang = decoded.diaChi
  }
})

const minDate = computed(() => getTodayString())

const BANK_CONFIG = { bank: 'MBBank', accountNo: '0353292517' }

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// ===== ĐẶT HÀNG =====
const handleDatHang = async () => {
  if (!authStore.isAuthenticated) {
    showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error')
    setTimeout(() => router.push({ path: '/login', query: { redirect: '/shop/checkout' } }), 1500)
    return
  }

  if (!form.value.tenNguoiNhan || !form.value.soDienThoai || !form.value.diaChiGiaoHang || !form.value.ngayGiaoHang) {
    showToast('Vui lòng điền đầy đủ thông tin giao nhận nhé!', 'error')
    return
  }

  // ✅ Dùng đúng sanPhamId (không phải id của cart item)
  const danhSachSanPham = cartStore.items.map(item => ({
    sanPhamId: item.sanPhamId,
    soLuong: item.soLuong,
    donGia: Number(item.donGia) || Number(item.thanhTien) / item.soLuong,
    thietKeBanhJson: item.thietKeBanhJson || null
  }))

  if (danhSachSanPham.length === 0) {
    showToast('Giỏ hàng của bạn đang trống!', 'error')
    return
  }

  const payload = {
    diaChiGiaoHang: form.value.diaChiGiaoHang,
    soDienThoai: form.value.soDienThoai,
    ngayGiaoHang: form.value.ngayGiaoHang,
    ghiChu: `Người nhận: ${form.value.tenNguoiNhan}. ${form.value.ghiChu}`.trim(),
    items: danhSachSanPham
  }

  loading.value = true
  try {
    const response = await orderService.createOrder(payload)
    const newOrder = response.data

    if (form.value.phuongThucThanhToan === 'COD') {
      await cartStore.xoaToanBo()
      // Hiện modal thành công → tự redirect sau 2.5s
      showSuccessModal.value = true
      setTimeout(() => {
        showSuccessModal.value = false
        router.push('/shop/orders')
      }, 2500)

    } else if (form.value.phuongThucThanhToan === 'SEPAY') {
      sePayMemo.value = `DH${newOrder.id}`
      qrImageUrl.value = `https://qr.sepay.vn/img?acc=${BANK_CONFIG.accountNo}&bank=${BANK_CONFIG.bank}&amount=${cartStore.tongThanhToan}&des=${encodeURIComponent(sePayMemo.value)}`
      showQrModal.value = true
      batDauTheoDoiDonHang(newOrder.id)
    }

  } catch (error) {
    console.error('Lỗi đặt hàng:', error)
    const status = error.response?.status
    if (status === 401) {
      showToast('Phiên đăng nhập đã hết hạn. Đang chuyển về trang đăng nhập...', 'error')
      setTimeout(() => router.push({ path: '/login', query: { redirect: '/shop/checkout' } }), 1500)
    } else if (status === 403) {
      showToast('Tài khoản không có quyền đặt hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.', 'error')
    } else {
      const msg = error.response?.data?.message || error.response?.data || 'Đặt hàng thất bại, vui lòng thử lại.'
      showToast(msg, 'error')
    }
  } finally {
    loading.value = false
  }
}

// ===== SEPAY POLLING =====
const batDauTheoDoiDonHang = (orderId) => {
  checkOrderInterval = setInterval(async () => {
    try {
      const response = await orderService.getOrderById(orderId)
      if (response.data.trangThai === 'DA_XAC_NHAN') {
        clearInterval(checkOrderInterval)
        showQrModal.value = false
        await cartStore.xoaToanBo()
        // Hiện modal thành công rồi redirect
        showSuccessModal.value = true
        setTimeout(() => {
          showSuccessModal.value = false
          router.push('/shop/orders')
        }, 2500)
      }
    } catch (err) {
      console.warn('Đang chờ xác nhận thanh toán...', err)
    }
  }, 3000)
}

const huyTheoDoiQr = () => {
  if (checkOrderInterval) clearInterval(checkOrderInterval)
  showQrModal.value = false
  showToast('Đã đóng QR. Bạn có thể thanh toán sau trong lịch sử đơn hàng.', 'info')
  router.push('/shop/orders')
}

onBeforeUnmount(() => {
  if (checkOrderInterval) clearInterval(checkOrderInterval)
})

// ===== TOAST =====
const toast = ref({ show: false, msg: '', type: 'info' })
let toastTimer = null
const showToast = (msg, type = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, msg, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 200px; }

.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.modal-enter-from > div, .modal-leave-to > div { transform: scale(0.85) translateY(20px); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px) scale(0.96); }

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>