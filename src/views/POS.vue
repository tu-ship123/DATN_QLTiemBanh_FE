<template>
  <div class="flex h-screen bg-[#FFFBF5] overflow-hidden -m-6">

    <!-- LEFT: Danh sách sản phẩm -->
    <div class="flex-1 flex flex-col min-w-0 border-r border-[#EDE0CC]">
      <div class="bg-white px-5 py-4 border-b border-[#EDE0CC] shrink-0">
        <div class="flex items-center gap-3 bg-[#FDF8F2] rounded-xl px-4 py-2.5 mb-4 focus-within:ring-2 focus-within:ring-[#7A5C3A]/20">
          <iconify-icon icon="ph:magnifying-glass" class="text-gray-400 text-xl shrink-0"></iconify-icon>
          <input v-model="search" type="text" placeholder="Tìm tên bánh, mã sản phẩm..."
            class="bg-transparent outline-none w-full text-sm text-[#5C4428] placeholder-gray-400" />
          <button v-if="search" @click="search = ''" class="text-gray-400 hover:text-gray-600">
            <iconify-icon icon="ph:x" class="text-lg"></iconify-icon>
          </button>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            :class="activeTab === tab.key
              ? 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white shadow-md shadow-[#7A5C3A]/20'
              : 'bg-[#FDF8F2] text-[#5A6474] hover:bg-[#EDE0CC]'">
            {{ tab.label }} <span class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loadingProducts" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <iconify-icon icon="ph:spinner-gap" class="text-4xl animate-spin text-[#7A5C3A]"></iconify-icon>
          <p class="text-sm font-semibold">Đang tải sản phẩm...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="productError" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-red-400 p-6 text-center">
          <iconify-icon icon="ph:warning-circle-duotone" class="text-5xl"></iconify-icon>
          <p class="text-sm font-semibold">{{ productError }}</p>
          <button @click="loadProducts" class="mt-2 px-4 py-2 bg-[#7A5C3A] text-white rounded-xl text-sm font-bold hover:bg-[#d4583f] transition">
            Thử lại
          </button>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-5">
        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-300">
          <iconify-icon icon="ph:magnifying-glass" class="text-5xl mb-2"></iconify-icon>
          <p class="text-sm font-semibold">Không tìm thấy sản phẩm</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <button v-for="p in filteredProducts" :key="p.id" @click="addToCart(p)"
            :disabled="p.soLuongTon === 0"
            class="bg-white rounded-2xl border border-[#EDE0CC] p-3 text-left transition-all group relative"
            :class="p.soLuongTon === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-[#7A5C3A]/40 hover:shadow-md hover:-translate-y-0.5 active:scale-95'">
            <div v-if="p.soLuongTon === 0"
              class="absolute top-2 right-2 bg-red-100 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full">
              Hết
            </div>
            <div class="w-full aspect-square rounded-xl bg-[#FDF6EC] flex items-center justify-center mb-3 overflow-hidden group-hover:bg-[#FFE4DC] transition-colors">
              <img v-if="p.anhSanPham" :src="p.anhSanPham" :alt="p.tenSanPham"
                class="w-full h-full object-cover rounded-xl" @error="handleImgError($event)" />
              <iconify-icon v-else icon="ph:cake-duotone" class="text-4xl text-[#7A5C3A]"></iconify-icon>
            </div>
            <div class="text-xs font-black text-[#5C4428] truncate mb-0.5">{{ p.tenSanPham }}</div>
            <div class="text-xs font-bold text-[#7A5C3A]">{{ formatPrice(p.donGia) }}</div>
            <div class="text-[10px] text-gray-400 mt-0.5">Tồn: {{ p.soLuongTon }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT: Bill Panel -->
    <div class="w-[380px] shrink-0 bg-white flex flex-col">
      <div class="px-5 py-4 border-b border-[#EDE0CC] shrink-0">
        <div class="flex items-center justify-between mb-3">
          <div>
            <div class="font-display font-black text-base text-[#5C4428]">Đơn hiện tại</div>
            <div class="text-xs text-gray-400 mt-0.5">#POS-{{ orderNo }}</div>
          </div>
          <button @click="clearCart" class="text-xs font-bold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition flex items-center gap-1">
            <iconify-icon icon="ph:trash-duotone" class="text-sm"></iconify-icon> Xóa tất cả
          </button>
        </div>
        <!-- Email khách -->
        <div class="relative">
          <iconify-icon icon="ph:user-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></iconify-icon>
          <input
            v-model="emailKhach"
            type="email"
            placeholder="Email khách hàng (để trống = dùng email nhân viên)"
            class="w-full text-xs border border-[#EDE0CC] rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#7A5C3A] focus:ring-1 focus:ring-[#7A5C3A]/20"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-3">
        <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300 py-10">
          <iconify-icon icon="ph:shopping-cart-duotone" class="text-6xl mb-3"></iconify-icon>
          <p class="text-sm font-semibold">Chưa có món nào</p>
          <p class="text-xs mt-1">Chọn sản phẩm bên trái để thêm vào</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="item in cart" :key="item.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC] group">
            <div class="w-10 h-10 rounded-lg bg-[#FDF6EC] flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="item.anhSanPham" :src="item.anhSanPham" :alt="item.tenSanPham" class="w-full h-full object-cover" @error="handleImgError($event)" />
              <iconify-icon v-else icon="ph:cake-duotone" class="text-xl text-[#7A5C3A]"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-[#5C4428] truncate">{{ item.tenSanPham }}</div>
              <div class="text-xs text-[#7A5C3A] font-bold">{{ formatPrice(item.donGia) }}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button @click="decrease(item)" class="w-7 h-7 rounded-lg bg-white border border-[#EDE0CC] flex items-center justify-center text-gray-500 hover:border-[#7A5C3A] hover:text-[#7A5C3A] transition font-bold text-lg leading-none">-</button>
              <span class="w-6 text-center text-sm font-black text-[#5C4428]">{{ item.qty }}</span>
              <button @click="increase(item)"
                :disabled="item.qty >= item.soLuongTon"
                class="w-7 h-7 rounded-lg flex items-center justify-center transition font-bold text-lg leading-none"
                :class="item.qty >= item.soLuongTon ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#7A5C3A] text-white hover:bg-[#d4583f]'">+</button>
            </div>
            <button @click="removeItem(item)" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition ml-1">
              <iconify-icon icon="ph:x-circle-fill" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-[#EDE0CC] px-5 pt-4 pb-3 shrink-0 space-y-2">
        <div class="flex justify-between text-sm text-gray-500">
          <span>Tạm tính ({{ totalQty }} món)</span>
          <span class="font-semibold text-[#5C4428]">{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-base font-black text-[#5C4428] pt-2 border-t border-[#EDE0CC]">
          <span>Tổng cộng</span>
          <span class="text-[#7A5C3A] text-lg">{{ formatPrice(subtotal) }}</span>
        </div>
        <p class="text-[10px] text-gray-400 text-center italic">(Giá hiển thị theo BE, không cộng thêm VAT ở FE)</p>
      </div>

      <div class="px-5 pb-5 space-y-2 shrink-0">
        <button @click="openPayment('cash')" :disabled="cart.length === 0 || submitting"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          :class="cart.length === 0 || submitting ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white shadow-lg shadow-[#7A5C3A]/30 hover:-translate-y-0.5'">
          <iconify-icon icon="ph:money-duotone" class="text-xl"></iconify-icon>
          Thanh toán tiền mặt
        </button>
        <button @click="openPayment('qr')" :disabled="cart.length === 0 || submitting"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all border-2"
          :class="cart.length === 0 || submitting ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#7A5C3A] text-[#7A5C3A] hover:bg-[#FDF6EC]'">
          <iconify-icon icon="ph:qr-code-duotone" class="text-xl"></iconify-icon>
          VietQR / Chuyển khoản
        </button>
        <button @click="doPrintBill" :disabled="!lastReceipt"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          :class="!lastReceipt ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-[#5C4428] text-white hover:bg-[#2D3F56]'">
          <iconify-icon icon="ph:printer-duotone" class="text-xl"></iconify-icon>
          In hóa đơn nhiệt
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MODAL: Tiền mặt                                 -->
    <!-- ═══════════════════════════════════════════════ -->
    <el-dialog v-model="showCashModal" title="Thanh toán tiền mặt" width="420px" center align-center>
      <div class="space-y-4">
        <div class="text-center p-4 bg-[#FFFBF5] rounded-xl">
          <div class="text-sm text-gray-400 mb-1">Tổng tiền cần thanh toán</div>
          <div class="text-3xl font-black text-[#7A5C3A]">{{ formatPrice(subtotal) }}</div>
        </div>

        <div>
          <label class="text-sm font-bold text-[#5C4428] mb-2 block">Ghi chú đơn hàng</label>
          <el-input v-model="ghiChu" type="textarea" :rows="2" placeholder="Ghi chú (tuỳ chọn)..." />
        </div>

        <div>
          <label class="text-sm font-bold text-[#5C4428] mb-2 block">Tiền khách đưa</label>
          <el-input v-model="cashGiven" type="number" size="large" placeholder="Nhập số tiền..." @input="calcChange">
            <template #suffix>đ</template>
          </el-input>
        </div>

        <div v-if="cashGiven && change >= 0" class="flex justify-between items-center p-3 bg-green-50 rounded-xl">
          <span class="text-sm font-bold text-green-700">Tiền thối lại</span>
          <span class="text-lg font-black text-green-600">{{ formatPrice(change) }}</span>
        </div>
        <div v-else-if="cashGiven && change < 0" class="flex justify-between items-center p-3 bg-red-50 rounded-xl">
          <span class="text-sm font-bold text-red-500">Thiếu</span>
          <span class="text-lg font-black text-red-500">{{ formatPrice(Math.abs(change)) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCashModal = false" :disabled="submitting">Huỷ</el-button>
        <el-button type="primary"
          :disabled="change < 0 || !cashGiven || submitting"
          :loading="submitting"
          @click="submitOrder('TIEN_MAT')"
          style="background-color: #7A5C3A; border-color: #7A5C3A;">
          Xác nhận thanh toán
        </el-button>
      </template>
    </el-dialog>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MODAL: VietQR                                   -->
    <!-- ═══════════════════════════════════════════════ -->
    <el-dialog v-model="showQRModal" title="Thanh toán VietQR / Chuyển khoản" width="440px" center align-center :close-on-click-modal="!submitting">
      <div class="space-y-4">

        <!-- Bước 1: Nhập ghi chú, chưa tạo đơn -->
        <template v-if="!qrData && !submitting">
          <div>
            <label class="text-sm font-bold text-[#5C4428] mb-2 block">Ghi chú đơn hàng</label>
            <el-input v-model="ghiChu" type="textarea" :rows="2" placeholder="Ghi chú (tuỳ chọn)..." />
          </div>
          <div class="flex flex-col items-center gap-3 py-4">
            <div class="w-40 h-40 bg-[#FDF8F2] rounded-2xl flex items-center justify-center">
              <iconify-icon icon="ph:qr-code-duotone" class="text-7xl text-[#7A5C3A]/30"></iconify-icon>
            </div>
            <p class="text-sm text-gray-400 text-center">
              Nhấn <strong class="text-[#7A5C3A]">"Tạo mã QR"</strong> để gửi đơn lên server và nhận mã chuyển khoản.
            </p>
          </div>
        </template>

        <!-- Loading -->
        <div v-else-if="submitting" class="flex flex-col items-center gap-3 py-8">
          <iconify-icon icon="ph:spinner-gap" class="text-5xl animate-spin text-[#7A5C3A]"></iconify-icon>
          <p class="text-sm text-gray-500 font-semibold">Đang tạo đơn hàng &amp; mã QR...</p>
        </div>

        <!-- Bước 2: Hiển thị QR từ BE -->
        <div v-else-if="qrData" class="flex flex-col items-center gap-4">
          <div class="p-2 bg-white rounded-2xl shadow-md border border-[#EDE0CC]">
            <img :src="qrData.vietQrUrl" alt="VietQR" class="w-56 h-56 rounded-xl object-contain"
              @error="qrImgError = true" />
            <p v-if="qrImgError" class="text-xs text-red-400 text-center mt-2">Không tải được ảnh QR. Kiểm tra cấu hình ngân hàng BE.</p>
          </div>

          <div class="text-center p-3 bg-[#FFFBF5] rounded-xl w-full">
            <div class="text-2xl font-black text-[#7A5C3A]">{{ formatPrice(qrData.tongTien) }}</div>
            <div class="text-xs text-gray-500 mt-1 font-semibold">Mã đơn: HD-POS-{{ qrData.donHangId }}</div>
          </div>

          <div class="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl w-full justify-center">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0"></span>
            Đang chờ xác nhận thanh toán...
          </div>

          <p class="text-xs text-gray-400 text-center">
            Cho khách quét mã QR bên trên để chuyển khoản. Sau khi tiền về, nhấn
            <strong class="text-green-600">"Đã nhận tiền"</strong> để hoàn tất đơn.
          </p>
        </div>

      </div>
      <template #footer>
        <el-button @click="cancelQR" :disabled="submitting">Huỷ</el-button>
        <el-button v-if="!qrData" type="primary" :loading="submitting" @click="submitOrder('VIET_QR')"
          style="background-color: #7A5C3A; border-color: #7A5C3A;">
          <iconify-icon icon="ph:qr-code-duotone" class="mr-1 text-base"></iconify-icon>
          Tạo mã QR
        </el-button>
        <el-button v-else type="success" @click="confirmQRPaid">
          <iconify-icon icon="ph:check-circle-duotone" class="mr-1 text-base"></iconify-icon>
          Đã nhận tiền
        </el-button>
      </template>
    </el-dialog>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MODAL: Thành công                               -->
    <!-- ═══════════════════════════════════════════════ -->
    <el-dialog v-model="showSuccessModal" width="380px" center align-center :show-close="false">
      <div class="flex flex-col items-center gap-3 py-4">
        <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <iconify-icon icon="ph:check-circle-duotone" class="text-6xl text-green-500"></iconify-icon>
        </div>
        <div class="text-xl font-black text-[#5C4428]">Thanh toán thành công!</div>
        <div class="text-sm text-gray-400">
          Đơn <strong>HD-POS-{{ successData?.donHangId }}</strong> đã hoàn tất
        </div>
        <div class="text-2xl font-black text-[#7A5C3A]">{{ formatPrice(successData?.tongTien) }}</div>
        <div class="text-xs text-gray-500 bg-[#FFFBF5] px-4 py-2 rounded-xl">
          {{ successData?.phuongThuc === 'TIEN_MAT' ? '💵 Tiền mặt' : '📱 VietQR / Chuyển khoản' }}
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="doPrintBill" style="flex:1">
            <iconify-icon icon="ph:printer-duotone" class="mr-1"></iconify-icon>In hóa đơn
          </el-button>
          <el-button type="primary" @click="newOrder" style="background-color: #7A5C3A; border-color: #7A5C3A; flex:1">
            Tạo đơn mới
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import apiClient from '@/services/apiService'
import { productService } from '@/services/ProductService'

// ─── STATE ───────────────────────────────────────────────────────────────────
const allProducts     = ref([])
const loadingProducts = ref(false)
const productError    = ref(null)

const search     = ref('')
const activeTab  = ref('all')
const cart       = ref([])
const orderNo    = ref(Math.floor(Math.random() * 9000) + 1000)
const emailKhach = ref('')
const ghiChu     = ref('')

const showCashModal    = ref(false)
const showQRModal      = ref(false)
const showSuccessModal = ref(false)
const cashGiven        = ref('')
const change           = ref(0)
const submitting       = ref(false)
const qrData           = ref(null)       // Response từ API tạo đơn QR
const qrImgError       = ref(false)
const lastReceipt      = ref(null)       // receiptText từ BE để in sau
const successData      = ref(null)       // Dữ liệu modal thành công

// ─── TABS TỪ DANH MỤC THỰC ──────────────────────────────────────────────────
const categories = computed(() => {
  const map = new Map()
  allProducts.value.forEach(p => {
    if (p.danhMucId && p.tenDanhMuc) map.set(p.danhMucId, p.tenDanhMuc)
  })
  return Array.from(map.entries()).map(([id, label]) => ({ key: String(id), label }))
})

const tabs = computed(() => [
  { key: 'all', label: 'Tất cả', count: allProducts.value.length },
  ...categories.value.map(c => ({
    key: c.key,
    label: c.label,
    count: allProducts.value.filter(p => String(p.danhMucId) === c.key).length
  }))
])

// ─── LOAD SẢN PHẨM ──────────────────────────────────────────────────────────
async function loadProducts() {
  loadingProducts.value = true
  productError.value = null
  try {
    // GET /api/v1/products → chỉ trả DANG_BAN
    const res = await productService.getAllProducts()
    allProducts.value = res.data || []
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err)
    productError.value = err.response?.data?.message || 'Không thể tải danh sách sản phẩm!'
  } finally {
    loadingProducts.value = false
  }
}

onMounted(() => loadProducts())

// ─── FILTER SẢN PHẨM ────────────────────────────────────────────────────────
const filteredProducts = computed(() =>
  allProducts.value.filter(p => {
    const matchTab    = activeTab.value === 'all' || String(p.danhMucId) === activeTab.value
    const matchSearch = p.tenSanPham.toLowerCase().includes(search.value.toLowerCase())
    return matchTab && matchSearch
  })
)

// ─── GIỎ HÀNG ────────────────────────────────────────────────────────────────
const totalQty = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const subtotal = computed(() => cart.value.reduce((s, i) => s + Number(i.donGia) * i.qty, 0))

function addToCart(p) {
  if (p.soLuongTon === 0) return
  const existing = cart.value.find(i => i.id === p.id)
  if (existing) {
    if (existing.qty < p.soLuongTon) existing.qty++
    else ElMessage.warning(`"${p.tenSanPham}" chỉ còn ${p.soLuongTon} trong kho!`)
  } else {
    cart.value.push({ ...p, qty: 1 })
  }
}
function increase(item) {
  if (item.qty < item.soLuongTon) item.qty++
  else ElMessage.warning(`Chỉ còn ${item.soLuongTon} sản phẩm!`)
}
function decrease(item) { item.qty > 1 ? item.qty-- : removeItem(item) }
function removeItem(item) { cart.value = cart.value.filter(i => i.id !== item.id) }
function clearCart() { cart.value = []; ghiChu.value = ''; emailKhach.value = '' }

// ─── MỞ MODAL ────────────────────────────────────────────────────────────────
function openPayment(type) {
  if (!cart.value.length) return
  cashGiven.value = ''
  change.value = 0
  ghiChu.value = ''
  qrData.value = null
  qrImgError.value = false
  if (type === 'cash') showCashModal.value = true
  else showQRModal.value = true
}

function calcChange() {
  change.value = Number(cashGiven.value) - subtotal.value
}

function cancelQR() {
  if (submitting.value) return
  showQRModal.value = false
  qrData.value = null
}

// ─── GỌI API TẠO ĐƠN POS ────────────────────────────────────────────────────
// POST /api/v1/pos/orders  (cần Bearer Token của nhân viên)
// Request body: { emailKhachHang, ghiChu, items: [{sanPhamId, soLuong}] }
// Response:     { donHangId, tongTien, trangThai, nguonDon, vietQrUrl, receiptText }
async function submitOrder(phuongThuc) {
  submitting.value = true
  try {
    const payload = {
      emailKhachHang: emailKhach.value.trim() || null,
      ghiChu: ghiChu.value.trim() || null,
      items: cart.value.map(i => ({
        sanPhamId: i.id,
        soLuong: i.qty
      }))
    }

    const res = await apiClient.post('/api/v1/pos/orders', payload)
    const data = res.data  // PosOrderDto.Response

    // Lưu receiptText để in sau
    lastReceipt.value = data.receiptText

    if (phuongThuc === 'TIEN_MAT') {
      showCashModal.value = false
      successData.value = { ...data, phuongThuc }
      showSuccessModal.value = true
      // Làm mới tồn kho và xóa giỏ
      await loadProducts()
      cart.value = []
    } else {
      // VietQR: lưu kết quả để hiển thị mã QR, không đóng modal
      qrData.value = { ...data, phuongThuc }
    }

    ElMessage.success('Tạo đơn hàng thành công!')

  } catch (err) {
    console.error('Lỗi tạo đơn POS:', err)
    const msg = err.response?.data
    ElMessage.error(typeof msg === 'string' ? msg : (msg?.message || 'Tạo đơn hàng thất bại!'))
  } finally {
    submitting.value = false
  }
}

// ─── XÁC NHẬN ĐÃ NHẬN TIỀN QR ───────────────────────────────────────────────
function confirmQRPaid() {
  showQRModal.value = false
  successData.value = { ...qrData.value, phuongThuc: 'VIET_QR' }
  showSuccessModal.value = true
  loadProducts()
  cart.value = []
  qrData.value = null
}

// ─── ĐƠN MỚI ─────────────────────────────────────────────────────────────────
function newOrder() {
  showSuccessModal.value = false
  cart.value = []
  orderNo.value = Math.floor(Math.random() * 9000) + 1000
  cashGiven.value = ''
  change.value = 0
  ghiChu.value = ''
  emailKhach.value = ''
  successData.value = null
  // KHÔNG xóa lastReceipt để vẫn có thể in lại
}

// ─── IN HÓA ĐƠN NHIỆT ────────────────────────────────────────────────────────
function doPrintBill() {
  if (lastReceipt.value) {
    printReceiptText(lastReceipt.value)
  }
}

function printReceiptText(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const html = `
    <html><head>
      <title>Hóa đơn POS</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Courier New', monospace; font-size:12px; width:80mm; padding:4mm; white-space:pre; }
        @media print { @page { size:80mm auto; margin:0; } body { width:80mm; } }
      </style>
    </head><body>${escaped}</body></html>`
  const w = window.open('', '_blank', 'width=340,height=600')
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 300)
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function formatPrice(n) {
  return Number(n || 0).toLocaleString('vi-VN') + 'đ'
}
function handleImgError(e) {
  e.target.style.display = 'none'
}
</script>