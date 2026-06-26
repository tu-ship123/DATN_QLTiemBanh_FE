<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in blossom-theme">

    <div class="p-6" style="border-radius:24px;background:#FFFFFF;border:1px solid #FDD8EE;">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg,#EC4899,#F472B6);box-shadow:0 4px 16px rgba(236,72,153,0.2);">
            <iconify-icon icon="ph:credit-card-duotone" class="text-2xl" style="color:#FFFFFF;"></iconify-icon>
          </div>
          <div>
            <h1 style="font-family:'Playfair Display',serif;font-size:26px;font-weight:950;color:#3D1A2C;letter-spacing:1px;margin:0;">Thanh toán đơn hàng</h1>
            <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;margin:4px 0 0;">Nhập thông tin giao nhận và chọn phương thức thanh toán.</p>
          </div>
        </div>
        <button @click="$router.push('/shop/cart')" class="text-xs font-bold text-[#EC4899] hover:underline font-sans px-4 py-2 bg-[#FFF0F7] rounded-xl border border-[#FDD8EE] hover:bg-[#FDD8EE] transition-colors">
          ✕ Hủy & Quay lại giỏ hàng
        </button>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_380px]">

      <div class="space-y-5">

        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-base font-bold text-[#3D1A2C] flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white text-xs font-black flex items-center justify-center font-sans">1</span>
              Thông tin nhận hàng
            </h2>
          </div>

          <div class="grid sm:grid-cols-2 gap-4 font-sans">
            <div class="space-y-1">
              <label class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide">Tên người nhận</label>
              <input v-model="form.tenNguoiNhan" type="text" placeholder="Nguyễn Ngọc Tú" class="w-full rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide">Số điện thoại</label>
              <input v-model="form.soDienThoai" type="text" placeholder="090xxxxxxx" class="w-full rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide">Ngày nhận bánh (Dự kiến)</label>
              <input v-model="form.ngayGiaoHang" :min="minDate" type="date" class="w-full rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all text-[#B07090]" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide">Địa chỉ giao hàng</label>
              <input v-model="form.diaChiGiaoHang" type="text" placeholder="Số nhà, tên đường..." class="w-full rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]" />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <label class="text-[10px] text-[#B07090] font-bold uppercase tracking-wide">Ghi chú đơn hàng (Nếu có)</label>
              <textarea v-model="form.ghiChu" rows="2" placeholder="Ví dụ: Ghi chữ Chúc mừng sinh nhật..." class="w-full rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]"></textarea>
            </div>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#3D1A2C] flex items-center gap-2 mb-5">
            <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white text-xs font-black flex items-center justify-center font-sans">2</span>
            Phương thức thanh toán
          </h2>

          <div class="space-y-3 font-sans">
            <label
              class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
              :class="form.phuongThucThanhToan === 'SEPAY' ? 'border-[#EC4899] bg-[#FFF0F7]' : 'border-[#FDD8EE] bg-white hover:border-[#EC4899]/30'"
            >
              <input type="radio" value="SEPAY" v-model="form.phuongThucThanhToan" class="sr-only" />
              <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all" :class="form.phuongThucThanhToan === 'SEPAY' ? 'border-[#EC4899]' : 'border-gray-300'">
                <div v-if="form.phuongThucThanhToan === 'SEPAY'" class="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="w-10 h-10 rounded-xl bg-[#FFF5FA] border border-[#FDD8EE] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <iconify-icon icon="ph:bank-duotone" class="text-xl text-[#EC4899]"></iconify-icon>
                  </div>
                  <div>
                    <p class="font-bold text-[#3D1A2C] text-sm">Chuyển khoản QR (SePay)</p>
                    <p class="text-xs text-[#B07090] font-medium">Tự động xác nhận đơn hàng ngay lập tức</p>
                  </div>
                  <span class="ml-auto rounded-lg bg-[#FFF5FA] border border-[#F59E0B] text-[#EC4899] text-[10px] font-black uppercase tracking-wider px-2 py-0.5">Khuyên dùng</span>
                </div>
              </div>
            </label>

            <label
              class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
              :class="form.phuongThucThanhToan === 'COD' ? 'border-[#EC4899] bg-[#FFF0F7]' : 'border-[#FDD8EE] bg-white hover:border-[#EC4899]/30'"
            >
              <input type="radio" value="COD" v-model="form.phuongThucThanhToan" class="sr-only" />
              <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all" :class="form.phuongThucThanhToan === 'COD' ? 'border-[#EC4899]' : 'border-gray-300'">
                <div v-if="form.phuongThucThanhToan === 'COD'" class="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="w-10 h-10 rounded-xl bg-[#FFF5FA] border border-[#FDD8EE] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <iconify-icon icon="ph:money-duotone" class="text-xl text-[#EC4899]"></iconify-icon>
                  </div>
                  <div>
                    <p class="font-bold text-[#3D1A2C] text-sm">COD – Thanh toán khi nhận hàng</p>
                    <p class="text-xs text-[#B07090] font-medium">Trả tiền mặt hoặc chuyển khoản cho shipper</p>
                  </div>
                </div>
                <Transition name="expand">
                  <div v-if="form.phuongThucThanhToan === 'COD'" class="mt-4 rounded-2xl bg-[#FFF5FA] border border-[#FDD8EE] p-4 text-xs">
                    <div class="flex items-start gap-3">
                      <iconify-icon icon="ph:info-duotone" class="text-[#EC4899] text-lg flex-shrink-0 mt-0.5"></iconify-icon>
                      <div class="text-[#7C3D5C] space-y-1.5 font-bold">
                        <p class="flex items-center gap-2"><iconify-icon icon="ph:check-circle-duotone" class="text-[#7A5C3A]"></iconify-icon> Thanh toán tiện lợi khi giao bánh.</p>
                        <p class="flex items-center gap-2"><iconify-icon icon="ph:warning-duotone" class="text-amber-500"></iconify-icon> Chỉ áp dụng cho đơn hàng có tổng trị giá dưới <strong class="text-[#EC4899]">5.000.000đ</strong>.</p>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </label>
          </div>
        </div>

        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6">
          <h2 class="text-base font-bold text-[#3D1A2C] flex items-center gap-2 mb-4">
            <span class="w-6 h-6 rounded-full bg-[#EC4899] text-white text-xs font-black flex items-center justify-center font-sans">3</span>
            Xem lại đơn hàng của bạn
          </h2>
          <div class="space-y-3 font-sans">
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4 p-3 bg-[#FFF5FA] border border-[#FDD8EE] rounded-2xl hover:bg-[#FFF0F7] transition-colors duration-200">
              <img :src="item.anhSanPham || defaultImage" :alt="item.tenSanPham" class="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm" @error="e => e.target.src = defaultImage" />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#3D1A2C] truncate">{{ item.tenSanPham }}</p>
                <p class="text-xs text-[#B07090] font-medium">SL: x{{ item.soLuong }}</p>
              </div>
              <p class="font-black text-sm text-[#EC4899] whitespace-nowrap">{{ formatCurrency(item.thanhTien) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-5">

        <div class="rounded-[24px] bg-white border border-[#FDD8EE] shadow-sm p-6 sticky top-24 font-sans">
          <h3 class="text-base font-bold text-[#3D1A2C] mb-5 flex items-center gap-2 border-b border-[#FFF0F7] pb-3">
            <iconify-icon icon="ph:receipt-duotone" class="text-[#EC4899] text-lg"></iconify-icon>
            Hóa đơn thanh toán
          </h3>

          <div class="space-y-3.5 text-xs font-medium text-[#7C3D5C]">
            <div class="flex justify-between">
              <span>Tạm tính ({{ cartStore.items.length }} bánh)</span>
              <span class="font-bold text-[#3D1A2C]">{{ formatCurrency(cartStore.tongTienHang) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span class="font-bold text-[#3D1A2C]">{{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}</span>
            </div>
            <div class="h-px bg-[#FFF0F7] my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-[#3D1A2C]">Tổng thanh toán</span>
              <span class="text-2xl font-black text-[#EC4899]">{{ formatCurrency(cartStore.tongThanhToan) }}</span>
            </div>
          </div>

          <div class="mt-5 rounded-2xl p-3 border flex items-center gap-2.5 text-xs font-bold"
            :class="form.phuongThucThanhToan === 'SEPAY' ? 'bg-[#FFF0F7] border-[#FDD8EE]' : 'bg-[#FFF5FA] border-[#FDD8EE]'">
            <iconify-icon
              :icon="form.phuongThucThanhToan === 'SEPAY' ? 'ph:bank-duotone' : 'ph:money-duotone'"
              class="text-lg flex-shrink-0 text-[#EC4899]"
            ></iconify-icon>
            <span class="text-[#EC4899]">
              {{ form.phuongThucThanhToan === 'SEPAY' ? 'Thanh toán SePay QR' : 'Thanh toán COD khi nhận' }}
            </span>
          </div>

          <button
            @click="handleDatHang"
            :disabled="loading || cartStore.items.length === 0"
            class="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#D12E7B] px-5 py-4 text-xs font-bold text-white shadow-md shadow-[#EC4899]/15 hover:shadow-[#EC4899]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-75 disabled:cursor-wait disabled:translate-y-0 flex items-center justify-center gap-2"
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

    <Transition name="modal">
      <div v-if="showQrModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-[#FDD8EE] animate-fade-in font-sans relative">
          <button @click="huyTheoDoiQr" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF0F7] text-[#EC4899] hover:bg-[#FDD8EE] transition-colors">
            ✕
          </button>
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#831843] flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#EC4899]/25">
            <iconify-icon icon="ph:qr-code-duotone" class="text-3xl text-white"></iconify-icon>
          </div>
          <h3 class="text-xl font-black text-[#3D1A2C]">Quét mã QR để thanh toán</h3>
          <div class="flex items-center justify-center gap-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-white bg-[#EC4899] px-2 py-0.5 rounded-lg">SePay</span>
            <span class="text-xs text-[#B07090] font-medium">Xác nhận tự động qua hệ thống SePay</span>
          </div>
          <p class="text-xs text-[#B07090] font-medium px-4">Hệ thống sẽ tự động chuyển trang sau khi nhận được tiền (Thường mất 5-10s)</p>
          
          <div class="bg-[#FFF0F7] p-4 rounded-2xl inline-block shadow-inner border border-[#FDD8EE]">
            <img :src="qrImageUrl" alt="Mã QR Thanh Toán SePay" class="w-64 h-64 mx-auto object-contain rounded-xl bg-white p-2" />
          </div>

          <div class="bg-[#FFF5FA] rounded-2xl p-4 text-xs text-[#7C3D5C] font-medium text-left space-y-2 border border-[#FDD8EE]">
            <p>📌 <strong>Nội dung bắt buộc:</strong> <span class="bg-white border border-[#FDD8EE] px-2 py-1 rounded text-[#EC4899] font-black text-sm ml-1">{{ sePayMemo }}</span></p>
            <p class="text-[11px] italic flex items-center gap-1.5"><iconify-icon icon="ph:warning-duotone" class="text-amber-500 shrink-0"></iconify-icon> Vui lòng không tự ý sửa nội dung chuyển khoản để SePay tự quét đơn.</p>
          </div>

          <div class="flex items-center justify-center gap-2 text-sm font-bold text-[#EC4899] animate-pulse pt-2">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#EC4899]"></span>
            Đang chờ bạn chuyển khoản...
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-white text-xs font-bold font-sans"
        :class="toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'"
      >
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:warning-circle-fill'" class="text-lg"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/orderService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const showQrModal = ref(false)
const qrImageUrl = ref('')
const sePayMemo = ref('')
let checkOrderInterval = null

const defaultImage = 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80'

const form = ref({
  tenNguoiNhan: '',
  soDienThoai: '',
  diaChiGiaoHang: '',
  ngayGiaoHang: '',
  ghiChu: '',
  phuongThucThanhToan: 'SEPAY'
})

const minDate = computed(() => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

const BANK_CONFIG = {
  bank: 'MBBank',
  accountNo: '0353292517',
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// ===== XỬ LÝ LOGIC ĐẶT HÀNG =====
const handleDatHang = async () => {
  // Kiểm tra đăng nhập trước (guard phòng trường hợp session hết hạn giữa chừng)
  if (!authStore.isAuthenticated) {
    showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error')
    setTimeout(() => router.push({ path: '/login', query: { redirect: '/shop/checkout' } }), 1500)
    return
  }

  if (!form.value.tenNguoiNhan || !form.value.soDienThoai || !form.value.diaChiGiaoHang || !form.value.ngayGiaoHang) {
    showToast('Vui lòng điền đầy đủ thông tin giao nhận nhé!', 'error')
    return
  }

  const danhSachSanPham = cartStore.items.map(item => ({
    sanPhamId: item.id || item.sanPhamId,
    soLuong: item.soLuong,
    donGia: item.gia || (item.thanhTien / item.soLuong)
  }))

  if (danhSachSanPham.length === 0) {
    showToast('Giỏ hàng của bạn đang trống!', 'error')
    return
  }

  const payload = {
    diaChiGiaoHang: form.value.diaChiGiaoHang,
    soDienThoai: form.value.soDienThoai,
    ngayGiaoHang: form.value.ngayGiaoHang,
    ghiChu: `Người nhận: ${form.value.tenNguoiNhan}. ${form.value.ghiChu}`,
    items: danhSachSanPham
  }

  loading.value = true
  try {
    const response = await orderService.createOrder(payload)
    const newOrder = response.data

    if (form.value.phuongThucThanhToan === 'COD') {
      showToast('Đặt hàng thành công! (Thanh toán COD)', 'success')
      await cartStore.xoaToanBo()
      router.push(`/orders/${newOrder.id}`)

    } else if (form.value.phuongThucThanhToan === 'SEPAY') {
      sePayMemo.value = `DH${newOrder.id}`
      qrImageUrl.value = `https://qr.sepay.vn/img?acc=${BANK_CONFIG.accountNo}&bank=${BANK_CONFIG.bank}&amount=${cartStore.tongThanhToan}&des=${encodeURIComponent(sePayMemo.value)}`
      showQrModal.value = true
      batDauTheoDoiDonHang(newOrder.id)
    }

  } catch (error) {
    console.error('Lỗi đặt hàng:', error)
    const status = error.response?.status
    // Phân biệt lỗi rõ ràng cho user
    if (status === 401) {
      showToast('Phiên đăng nhập đã hết hạn. Đang chuyển về trang đăng nhập...', 'error')
      setTimeout(() => router.push({ path: '/login', query: { redirect: '/shop/checkout' } }), 1500)
    } else if (status === 403) {
      showToast('Tài khoản không có quyền đặt hàng. Vui lòng đăng nhập lại bằng tài khoản khách hàng.', 'error')
    } else {
      const msg = error.response?.data?.message || error.response?.data || 'Đặt hàng thất bại, vui lòng thử lại.'
      showToast(msg, 'error')
    }
  } finally {
    loading.value = false
  }
}

// ===== QUÉT KIỂM TRA ĐƠN HÀNG SEPAY =====
const batDauTheoDoiDonHang = (orderId) => {
  checkOrderInterval = setInterval(async () => {
    try {
      const response = await orderService.getOrderById(orderId)
      const orderStatus = response.data.trangThai

      // SePay webhook sẽ cập nhật đơn sang DA_XAC_NHAN khi nhận tiền thành công
      if (orderStatus === 'DA_XAC_NHAN') {
        clearInterval(checkOrderInterval)
        showQrModal.value = false
        showToast('Thanh toán thành công! SePay đã xác nhận. Cảm ơn bạn!', 'success')
        await cartStore.xoaToanBo()
        router.push(`/orders/${orderId}`)
      }
    } catch (err) {
      console.warn('Đang chờ xác nhận thanh toán...', err)
    }
  }, 3000)
}

const huyTheoDoiQr = () => {
  if (checkOrderInterval) clearInterval(checkOrderInterval)
  showQrModal.value = false
  showToast('Đã đóng biểu mẫu QR. Bạn có thể thanh toán sau trong chi tiết đơn.', 'info')
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
  max-height: 200px;
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