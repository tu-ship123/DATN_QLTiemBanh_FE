<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="rounded-[32px] bg-white p-6 shadow-sm border border-gray-100 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-black text-[#1E2A3B]">Đơn hàng của tôi</h1>
        <p class="text-sm text-gray-500 mt-1">Quản lý lịch sử mua hàng và theo dõi trạng thái chiếc bánh của bạn.</p>
      </div>
      <div class="hidden sm:block text-4xl">🛍️</div>
    </div>

    <!-- Trạng thái Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-[#E8634A] border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm font-semibold text-gray-500">Đang tải lịch sử đơn hàng...</p>
    </div>
    
    <!-- Trạng thái Trống (Chưa mua gì) -->
    <div v-else-if="orders.length === 0" class="rounded-[32px] bg-white p-12 text-center shadow-sm border border-gray-100">
      <div class="text-7xl mb-6">🛒</div>
      <h3 class="text-2xl font-black text-[#1E2A3B]">Bạn chưa có đơn hàng nào</h3>
      <p class="text-sm text-gray-500 mt-2 mb-8">Hãy dạo quanh cửa hàng và chọn cho mình chiếc bánh yêu thích nhé!</p>
      <button @click="$router.push('/shop/products')" class="rounded-full bg-[#E8634A] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8634A]/20 hover:bg-[#f27355] transition transform hover:-translate-y-1">
        Mua sắm ngay
      </button>
    </div>

    <!-- Danh sách đơn hàng -->
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="rounded-[28px] bg-white p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-5 transition hover:shadow-md hover:border-[#E8634A]/30">
        
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span class="text-xl font-black text-[#1E2A3B]">#{{ order.id }}</span>
            <span :class="getStatusBadgeClass(order.trangThai)" class="px-3 py-1 rounded-md text-[11px] uppercase font-bold tracking-wider">
              {{ translateStatus(order.trangThai) }}
            </span>
          </div>
          
          <div class="text-sm text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            <p>📅 <span class="font-medium">Ngày đặt:</span> {{ formatDate(order.ngayTao) }}</p>
            <p>📦 <span class="font-medium">Sản phẩm:</span> {{ order.items?.length || 0 }} món</p>
            <p>🚚 <span class="font-medium">Ngày nhận (Dự kiến):</span> {{ formatDate(order.ngayGiaoHang, false) }}</p>
          </div>
        </div>
        
        <div class="flex flex-col md:items-end gap-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
          <div class="text-left md:text-right">
            <p class="text-xs font-bold text-gray-400 uppercase">Tổng thanh toán</p>
            <span class="text-2xl font-black text-[#E8634A]">{{ formatCurrency(order.tongTien) }}</span>
          </div>
          <button @click="$router.push(`/orders/${order.id}`)" class="w-full md:w-auto px-6 py-2.5 rounded-full border-2 border-gray-100 text-sm font-semibold text-[#1E2A3B] hover:border-[#E8634A] hover:text-[#E8634A] transition bg-white text-center">
            Xem chi tiết
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderService } from '@/services/orderService' // Đảm bảo đường dẫn tới file API này là đúng
import { ElMessage } from 'element-plus'

const router = useRouter()
const orders = ref([])
const loading = ref(true)

// Hàm lấy dữ liệu đơn hàng từ Backend
const fetchMyOrders = async () => {
  try {
    loading.value = true
    const response = await orderService.getMyOrders()
    // Backend trả về mảng đơn hàng, ta gán vào biến orders (Đảo ngược để đơn mới nhất lên đầu)
    orders.value = response.data.reverse() 
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error)
    ElMessage.error('Không thể tải lịch sử đơn hàng lúc này.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMyOrders()
})

// Tiện ích Format Tiền
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// Tiện ích Format Ngày tháng
const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return 'Chưa cập nhật'
  const date = new Date(dateString)
  if (includeTime) {
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Dịch trạng thái từ Backend (Tiếng Anh/Enum) sang Tiếng Việt
const translateStatus = (status) => {
  const statusMap = {
    'CHO_XU_LY': 'Chờ xử lý',
    'DA_XAC_NHAN': 'Đã xác nhận',
    'DANG_LAM': 'Đang làm bánh',
    'SAN_SANG': 'Sẵn sàng giao',
    'DANG_GIAO': 'Đang giao hàng',
    'HOAN_THANH': 'Đã giao thành công',
    'DA_HUY': 'Đã hủy',
    'PAID': 'Đã thanh toán',
  }
  return statusMap[status] || status || 'Không rõ'
}

// Lấy màu sắc CSS tương ứng với trạng thái đơn hàng
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CHO_XU_LY': return 'bg-amber-100 text-amber-700'
    case 'DA_XAC_NHAN': return 'bg-blue-100 text-blue-700'
    case 'DANG_LAM': return 'bg-purple-100 text-purple-700'
    case 'SAN_SANG': return 'bg-cyan-100 text-cyan-700'
    case 'DANG_GIAO': return 'bg-indigo-100 text-indigo-700'
    case 'HOAN_THANH': return 'bg-emerald-100 text-emerald-700'
    case 'PAID': return 'bg-emerald-100 text-emerald-700'
    case 'DA_HUY': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>