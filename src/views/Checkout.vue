<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="rounded-[32px] bg-white p-6 shadow-sm border border-gray-100 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-black text-[#1E2A3B]">Thông tin thanh toán</h1>
        <p class="text-sm text-gray-500 mt-1">Vui lòng nhập đầy đủ địa chỉ nhận bánh và chọn hình thức thanh toán.</p>
      </div>
      <button @click="$router.push('/cart')" class="hidden sm:inline-flex items-center justify-center rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition">
        ✕ Hủy & Quay lại
      </button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[2fr_1.2fr]">
      <div class="space-y-6">
        <div class="rounded-[28px] bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 class="text-xl font-bold text-[#1E2A3B] flex items-center gap-2">📍 Thông tin nhận hàng</h2>
          
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-600 uppercase">Tên người nhận</label>
              <input v-model="form.tenNguoiNhan" type="text" placeholder="Nguyễn Ngọc Tú" class="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#E8634A]" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-600 uppercase">Số điện thoại</label>
              <input v-model="form.soDienThoai" type="text" placeholder="090xxxxxxx" class="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#E8634A]" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-600 uppercase">Ngày nhận bánh (Dự kiến)</label>
            <input v-model="form.ngayGiaoHang" :min="minDate" type="date" class="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#E8634A]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-600 uppercase">Địa chỉ giao hàng</label>
            <input v-model="form.diaChiGiaoHang" type="text" placeholder="Số nhà, tên đường, phường/xã, quận/huyện" class="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#E8634A]" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-600 uppercase">Ghi chú đơn hàng (Nếu có)</label>
            <textarea v-model="form.ghiChu" rows="3" placeholder="Ví dụ: Ghi chữ Chúc mừng sinh nhật lên bánh, giao đúng 4h chiều..." class="w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-[#E8634A]"></textarea>
          </div>
        </div>

        <div class="rounded-[28px] bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 class="text-xl font-bold text-[#1E2A3B] flex items-center gap-2">💳 Phương thức thanh toán</h2>
          
          <div class="grid gap-4 sm:grid-cols-2">
            <div 
              @click="form.phuongThucThanhToan = 'COD'"
              :class="form.phuongThucThanhToan === 'COD' ? 'border-[#E8634A] bg-[#FFF4EF]' : 'border-gray-200 hover:border-[#E8634A]'"
              class="rounded-2xl border p-4 cursor-pointer transition-all flex items-center gap-4"
            >
              <div class="text-2xl">💵</div>
              <div>
                <h4 class="font-bold text-[#1E2A3B]">Thanh toán khi nhận hàng (COD)</h4>
                <p class="text-xs text-gray-500">Trả tiền mặt khi Shipper giao bánh</p>
              </div>
            </div>

            <div 
              @click="form.phuongThucThanhToan = 'SEPAY'"
              :class="form.phuongThucThanhToan === 'SEPAY' ? 'border-[#E8634A] bg-[#FFF4EF]' : 'border-gray-200 hover:border-[#E8634A]'"
              class="rounded-2xl border p-4 cursor-pointer transition-all flex items-center gap-4"
            >
              <div class="text-2xl">📱</div>
              <div>
                <h4 class="font-bold text-[#1E2A3B]">Chuyển khoản QR</h4>
                <p class="text-xs text-gray-500">Quét mã QR qua app Ngân hàng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm h-fit sticky top-6">
        <h2 class="text-xl font-bold text-[#1E2A3B] mb-4">Đơn hàng của bạn</h2>
        
        <div class="divide-y divide-gray-100 max-h-60 overflow-y-auto mb-4 pr-2">
          <div v-for="item in cartStore.items" :key="item.id" class="py-3 flex justify-between items-center text-sm">
            <div class="flex-1 pr-4">
              <p class="font-semibold text-[#1E2A3B] line-clamp-1">{{ item.tenSanPham }}</p>
              <p class="text-xs text-gray-400">SL: {{ item.soLuong }}</p>
            </div>
            <span class="font-bold text-gray-700">{{ formatCurrency(item.thanhTien) }}</span>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600">
          <div class="flex justify-between">
            <span>Tổng tiền hàng</span>
            <span class="font-semibold text-[#1E2A3B]">{{ formatCurrency(cartStore.tongTienHang) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Phí giao hàng</span>
            <span class="font-semibold text-[#1E2A3B]">{{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}</span>
          </div>
          <div class="flex justify-between border-t border-dashed pt-3 text-base font-black text-[#1E2A3B]">
            <span>Tổng thanh toán</span>
            <span class="text-[#E8634A] text-xl">{{ formatCurrency(cartStore.tongThanhToan) }}</span>
          </div>
        </div>

        <button 
          @click="handleDatHang" 
          :disabled="loading"
          class="mt-6 w-full rounded-3xl bg-[#E8634A] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-[#E8634A]/20 hover:bg-[#f27355] transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          <span v-if="loading">⏳ Đang xử lý đơn...</span>
          <span v-else>🚀 Xác nhận đặt hàng</span>
        </button>

        <button 
          @click="$router.push('/cart')" 
          :disabled="loading"
          class="mt-3 w-full rounded-3xl bg-white border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition disabled:opacity-50"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    </div>

    <div v-if="showQrModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl text-center space-y-4 relative animate-fade-in">
        <h3 class="text-xl font-black text-[#1E2A3B]">Quét mã QR để thanh toán</h3>
        <p class="text-xs text-gray-500">Hệ thống sẽ tự động chuyển trang sau khi nhận được tiền (Thường mất 5-10s)</p>
        
        <div class="bg-gray-50 p-4 rounded-2xl inline-block shadow-inner border border-gray-100">
          <img :src="qrImageUrl" alt="Mã QR Thanh Toán SePay" class="w-64 h-64 mx-auto object-contain rounded-xl" />
        </div>

        <div class="bg-amber-50 rounded-2xl p-3 text-xs text-amber-700 font-medium text-left space-y-1 border border-amber-100">
          <p>📌 <strong>Nội dung bắt buộc:</strong> <span class="bg-amber-200 px-1.5 py-0.5 rounded text-amber-900 font-bold">{{ sePayMemo }}</span></p>
          <p>⚠️ Vui lòng không tự ý sửa nội dung chuyển khoản để SePay tự quét đơn.</p>
        </div>

        <div class="flex items-center justify-center gap-2 text-sm font-semibold text-[#E8634A] animate-pulse">
          <span class="inline-block w-2 h-2 rounded-full bg-[#E8634A]"></span>
          Đang chờ bạn chuyển khoản...
        </div>

        <button @click="huyTheoDoiQr" class="text-xs text-gray-400 hover:text-gray-600 underline transition block mx-auto">
          Hủy giao dịch & Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { orderService } from '@/services/orderService'
import { ElMessage } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const showQrModal = ref(false)
const qrImageUrl = ref('')
const sePayMemo = ref('')
let checkOrderInterval = null

const form = ref({
  tenNguoiNhan: '',
  soDienThoai: '',
  diaChiGiaoHang: '',
  ngayGiaoHang: '', 
  ghiChu: '',
  phuongThucThanhToan: 'COD' 
})

// Tự động tính toán ngày hôm nay để chặn khách chọn ngày trong quá khứ
const minDate = computed(() => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

const BANK_CONFIG = {
  bankId: 'MB',            
  accountNo: '0123456789', 
  accountName: 'NGUYEN NGOC TU' 
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// Xử lý logic khi bấm Đặt Hàng
// Xử lý logic khi bấm Đặt Hàng
const handleDatHang = async () => {
  if (!form.value.tenNguoiNhan || !form.value.soDienThoai || !form.value.diaChiGiaoHang || !form.value.ngayGiaoHang) {
    ElMessage.warning('Vui lòng điền đầy đủ thông tin giao nhận và ngày nhận bánh nhé!')
    return
  }

  // MỚI: Trích xuất và map lại giỏ hàng cho đúng chuẩn Backend OrderItemRequest DTO
  const danhSachSanPham = cartStore.items.map(item => {
    return {
      sanPhamId: item.id || item.sanPhamId, // Tùy thuộc vào store của bạn lưu ID tên là gì
      soLuong: item.soLuong,
      donGia: item.gia || (item.thanhTien / item.soLuong) // Lấy giá 1 sản phẩm
    }
  })

  if (danhSachSanPham.length === 0) {
    ElMessage.error('Giỏ hàng của bạn đang trống!')
    return
  }

  // MỚI: Đóng gói lại Payload trước khi gửi đi
  const payload = {
    diaChiGiaoHang: form.value.diaChiGiaoHang,
    soDienThoai: form.value.soDienThoai,
    ngayGiaoHang: form.value.ngayGiaoHang,
    // Ghép Tên Người Nhận vào Ghi chú (Vì Backend của bạn không có trường Tên)
    ghiChu: `Người nhận: ${form.value.tenNguoiNhan}. ${form.value.ghiChu}`, 
    items: danhSachSanPham // <--- NHÉT MẢNG SẢN PHẨM VÀO ĐÂY
  }

  loading.value = true
  try {
    // Truyền cục 'payload' vào thay vì 'form.value'
    const response = await orderService.createOrder(payload)
    const newOrder = response.data 

    if (form.value.phuongThucThanhToan === 'COD') {
      ElMessage.success('Đặt hàng thành công! Đơn hàng được chọn thanh toán COD.')
      await cartStore.xoaToanBo() 
      router.push(`/orders/${newOrder.id}`)
      
    } else if (form.value.phuongThucThanhToan === 'SEPAY') {
      sePayMemo.value = `DH${newOrder.id}`
      qrImageUrl.value = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${cartStore.tongThanhToan}&addInfo=${sePayMemo.value}&accountName=${BANK_CONFIG.accountName}`
      showQrModal.value = true 
      batDauTheoDoiDonHang(newOrder.id)
    }

  } catch (error) {
    console.error('Lỗi đặt hàng:', error)
    ElMessage.error(error.response?.data || 'Đặt hàng thất bại, vui lòng kiểm tra lại hệ thống.')
  } finally {
    loading.value = false
  }
}

const batDauTheoDoiDonHang = (orderId) => {
  checkOrderInterval = setInterval(async () => {
    try {
      const response = await orderService.getOrderById(orderId)
      const orderStatus = response.data.trangThai 

      if (orderStatus === 'PAID' || orderStatus === 'DA_THANH_TOAN' || orderStatus === 'CHO_XU_LY') {
        clearInterval(checkOrderInterval)
        showQrModal.value = false
        ElMessage.success('Hệ thống SePay đã nhận được tiền! Cảm ơn bạn.')
        await cartStore.xoaToanBo() 
        router.push(`/orders/${orderId}`)
      }
    } catch (err) {
      console.warn('Đang quét kiểm tra hóa đơn...', err)
    }
  }, 3000) 
}

const huyTheoDoiQr = () => {
  if (checkOrderInterval) clearInterval(checkOrderInterval)
  showQrModal.value = false
  ElMessage.info('Đã đóng biểu mẫu QR. Bạn có thể kiểm tra lại trạng thái ở lịch sử đơn hàng.')
  router.push('/orders') 
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>