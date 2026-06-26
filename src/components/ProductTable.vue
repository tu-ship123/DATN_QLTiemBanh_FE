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
        <div class="flex gap-2">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            :class="activeTab === tab.key
              ? 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white shadow-md shadow-[#7A5C3A]/20'
              : 'bg-[#FDF8F2] text-[#5A6474] hover:bg-[#EDE0CC]'">
            {{ tab.label }} <span class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-5">
        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-300">
          <iconify-icon icon="ph:magnifying-glass" class="text-5xl mb-2"></iconify-icon>
          <p class="text-sm font-semibold">Không tìm thấy sản phẩm</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <button v-for="p in filteredProducts" :key="p.id" @click="addToCart(p)"
            class="bg-white rounded-2xl border border-[#EDE0CC] p-3 text-left transition-all hover:border-[#7A5C3A]/40 hover:shadow-md hover:-translate-y-0.5 active:scale-95 group">
            <div class="w-full aspect-square rounded-xl bg-[#FDF6EC] flex items-center justify-center text-4xl mb-3 group-hover:bg-[#FFE4DC] transition-colors">
              <iconify-icon :icon="p.icon" class="text-xl text-[#7A5C3A]"></iconify-icon>
            </div>
            <div class="text-xs font-black text-[#5C4428] truncate mb-1">{{ p.name }}</div>
            <div class="text-xs font-bold text-[#7A5C3A]">{{ formatPrice(p.price) }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT: Bill Panel -->
    <div class="w-[360px] shrink-0 bg-white flex flex-col">
      <div class="px-5 py-4 border-b border-[#EDE0CC] flex items-center justify-between shrink-0">
        <div>
          <div class="font-display font-black text-base text-[#5C4428]">Đơn hiện tại</div>
          <div class="text-xs text-gray-400 mt-0.5">#POS-{{ orderNo }}</div>
        </div>
        <button @click="clearCart" class="text-xs font-bold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
          Xóa tất cả
        </button>
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
            <div class="w-10 h-10 rounded-lg bg-[#FDF6EC] flex items-center justify-center text-xl shrink-0 text-[#7A5C3A]"><iconify-icon :icon="item.icon"></iconify-icon></div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-[#5C4428] truncate">{{ item.name }}</div>
              <div class="text-xs text-[#7A5C3A] font-bold">{{ formatPrice(item.price) }}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button @click="decrease(item)" class="w-7 h-7 rounded-lg bg-white border border-[#EDE0CC] flex items-center justify-center text-gray-500 hover:border-[#7A5C3A] hover:text-[#7A5C3A] transition font-bold text-lg leading-none">-</button>
              <span class="w-6 text-center text-sm font-black text-[#5C4428]">{{ item.qty }}</span>
              <button @click="increase(item)" class="w-7 h-7 rounded-lg bg-[#7A5C3A] flex items-center justify-center text-white hover:bg-[#d4583f] transition font-bold text-lg leading-none">+</button>
            </div>
            <button @click="removeItem(item)" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition ml-1">
              <iconify-icon icon="ph:x-circle-fill" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-[#EDE0CC] px-5 pt-4 pb-3 shrink-0 space-y-2">
        <div class="flex justify-between text-sm text-gray-500">
          <span>Tam tinh ({{ totalQty }} mon)</span>
          <span class="font-semibold text-[#5C4428]">{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span>Giam gia</span>
          <span class="font-semibold text-green-600">- {{ formatPrice(discount) }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span>VAT (8%)</span>
          <span class="font-semibold text-[#5C4428]">{{ formatPrice(vat) }}</span>
        </div>
        <div class="flex justify-between text-base font-black text-[#5C4428] pt-2 border-t border-[#EDE0CC]">
          <span>Tong cong</span>
          <span class="text-[#7A5C3A] text-lg">{{ formatPrice(total) }}</span>
        </div>
      </div>

      <div class="px-5 pb-5 space-y-2 shrink-0">
        <button @click="openPayment('cash')" :disabled="cart.length === 0"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          :class="cart.length === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white shadow-lg shadow-[#7A5C3A]/30 hover:-translate-y-0.5'">
          <iconify-icon icon="ph:money-duotone" class="text-xl"></iconify-icon>
          Thanh toan tien mat
        </button>
        <button @click="openPayment('qr')" :disabled="cart.length === 0"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all border-2"
          :class="cart.length === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#7A5C3A] text-[#7A5C3A] hover:bg-[#FDF6EC]'">
          <iconify-icon icon="ph:qr-code-duotone" class="text-xl"></iconify-icon>
          VietQR / Chuyen khoan
        </button>
        <button @click="printBill" :disabled="cart.length === 0"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          :class="cart.length === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-[#5C4428] text-white hover:bg-[#2D3F56]'">
          <iconify-icon icon="ph:printer-duotone" class="text-xl"></iconify-icon>
          In hoa don nhiet
        </button>
      </div>
    </div>

    <!-- MODAL: Tien mat -->
    <el-dialog v-model="showCashModal" title="Thanh toan tien mat" width="400px" center align-center>
      <div class="space-y-4">
        <div class="text-center p-4 bg-[#FFFBF5] rounded-xl">
          <div class="text-sm text-gray-400 mb-1">Tong tien can thanh toan</div>
          <div class="text-3xl font-black text-[#7A5C3A]">{{ formatPrice(total) }}</div>
        </div>
        <div>
          <label class="text-sm font-bold text-[#5C4428] mb-2 block">Tien khach dua</label>
          <el-input v-model="cashGiven" type="number" size="large" placeholder="Nhap so tien..." @input="calcChange">
            <template #suffix>d</template>
          </el-input>
        </div>
        <div v-if="change >= 0 && cashGiven" class="flex justify-between items-center p-3 bg-green-50 rounded-xl">
          <span class="text-sm font-bold text-green-700">Tien thoi lai</span>
          <span class="text-lg font-black text-green-600">{{ formatPrice(change) }}</span>
        </div>
        <div v-else-if="cashGiven && change < 0" class="flex justify-between items-center p-3 bg-red-50 rounded-xl">
          <span class="text-sm font-bold text-red-500">Thieu</span>
          <span class="text-lg font-black text-red-500">{{ formatPrice(Math.abs(change)) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCashModal = false">Huy</el-button>
        <el-button type="primary" :disabled="change < 0 || !cashGiven" @click="confirmPayment"
          style="background-color: #7A5C3A; border-color: #7A5C3A;">
          Xac nhan thanh toan
        </el-button>
      </template>
    </el-dialog>

    <!-- MODAL: VietQR -->
    <el-dialog v-model="showQRModal" title="Thanh toan VietQR" width="380px" center align-center>
      <div class="flex flex-col items-center gap-4">
        <div class="w-52 h-52 bg-[#5C4428] rounded-2xl flex items-center justify-center p-4">
          <div class="w-full h-full border-4 border-white rounded-xl flex items-center justify-center">
            <iconify-icon icon="ph:qr-code" class="text-white text-8xl"></iconify-icon>
          </div>
        </div>
        <div class="text-center p-3 bg-[#FFFBF5] rounded-xl w-full">
          <div class="text-2xl font-black text-[#7A5C3A]">{{ formatPrice(total) }}</div>
          <div class="text-xs text-gray-400 mt-1">MB Bank · 0123456789 · POLYCAKE</div>
        </div>
        <div class="flex items-center gap-2 text-sm text-green-600 font-semibold">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Dang cho xac nhan thanh toan...
        </div>
      </div>
      <template #footer>
        <el-button @click="showQRModal = false">Huy</el-button>
        <el-button type="primary" @click="confirmPayment" style="background-color: #7A5C3A; border-color: #7A5C3A;">
          Xac nhan da nhan tien
        </el-button>
      </template>
    </el-dialog>

    <!-- MODAL: Thanh cong -->
    <el-dialog v-model="showSuccessModal" width="360px" center align-center :show-close="false">
      <div class="flex flex-col items-center gap-3 py-4">
        <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <iconify-icon icon="ph:check-circle-duotone" class="text-6xl text-green-500"></iconify-icon>
        </div>
        <div class="text-xl font-black text-[#5C4428]">Thanh toan thanh cong!</div>
        <div class="text-sm text-gray-400">Don #POS-{{ orderNo }} da hoan tat</div>
        <div class="text-2xl font-black text-[#7A5C3A]">{{ formatPrice(total) }}</div>
      </div>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="printBill" style="flex:1">
            <iconify-icon icon="ph:printer-duotone" class="mr-1"></iconify-icon>In hoa don
          </el-button>
          <el-button type="primary" @click="newOrder" style="background-color: #7A5C3A; border-color: #7A5C3A; flex:1">
            Tao don moi
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const allProducts = [
  { id: 1,  name: 'Banh sinh nhat 3D',    icon: 'ph:cake-duotone', price: 350000,  category: 'banh' },
  { id: 2,  name: 'Banh mousse chanh leo', icon: 'ph:confetti-duotone', price: 120000,  category: 'banh' },
  { id: 3,  name: 'Cupcake dau tay',       icon: 'ph:cookie-duotone', price: 35000,   category: 'banh' },
  { id: 4,  name: 'Banh cuoi cao cap',     icon: 'ph:rings-duotone', price: 1500000, category: 'banh' },
  { id: 5,  name: 'Macaron hon hop',       icon: 'ph:candy-duotone', price: 25000,   category: 'banh' },
  { id: 6,  name: 'Banh tiramisu',         icon: 'ph:coffee-duotone', price: 95000,   category: 'banh' },
  { id: 7,  name: 'Banh red velvet',       icon: 'ph:heart-duotone', price: 280000,  category: 'banh' },
  { id: 8,  name: 'Banh flan caramen',     icon: 'ph:bowl-food-duotone', price: 45000,   category: 'banh' },
  { id: 9,  name: 'Banh su kem',           icon: 'ph:cookie-duotone', price: 20000,   category: 'banh' },
  { id: 10, name: 'Croissant bo',          icon: 'ph:bread-duotone', price: 30000,   category: 'banh' },
  { id: 11, name: 'Nen sinh nhat (set)',   icon: 'ph:candle-duotone', price: 15000,   category: 'phukien' },
  { id: 12, name: 'Hop banh cao cap',      icon: 'ph:package-duotone', price: 25000,   category: 'phukien' },
  { id: 13, name: 'Ruy bang trang tri',    icon: 'ph:ribbon-duotone', price: 10000,   category: 'phukien' },
  { id: 14, name: 'Tui giay Chocopine',     icon: 'ph:shopping-bag-duotone', price: 8000,    category: 'phukien' },
  { id: 15, name: 'The loi chuc',          icon: 'ph:envelope-duotone', price: 5000,    category: 'phukien' },
]

const tabs = [
  { key: 'all',     label: 'Tat ca',   count: allProducts.length },
  { key: 'banh',    label: 'Banh',     count: allProducts.filter(p => p.category === 'banh').length },
  { key: 'phukien', label: 'Phu kien', count: allProducts.filter(p => p.category === 'phukien').length },
]

const search    = ref('')
const activeTab = ref('all')
const cart      = ref([])
const orderNo   = ref(Math.floor(Math.random() * 9000) + 1000)

const showCashModal    = ref(false)
const showQRModal      = ref(false)
const showSuccessModal = ref(false)
const cashGiven        = ref('')
const change           = ref(0)

const filteredProducts = computed(() =>
  allProducts.filter(p => {
    const matchTab    = activeTab.value === 'all' || p.category === activeTab.value
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    return matchTab && matchSearch
  })
)

const totalQty = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const subtotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))
const discount = computed(() => 0)
const vat      = computed(() => Math.round(subtotal.value * 0.08))
const total    = computed(() => subtotal.value - discount.value + vat.value)

function addToCart(p) {
  const existing = cart.value.find(i => i.id === p.id)
  if (existing) existing.qty++
  else cart.value.push({ ...p, qty: 1 })
}
function increase(item) { item.qty++ }
function decrease(item) { item.qty > 1 ? item.qty-- : removeItem(item) }
function removeItem(item) { cart.value = cart.value.filter(i => i.id !== item.id) }
function clearCart() { cart.value = [] }

function openPayment(type) {
  if (!cart.value.length) return
  cashGiven.value = ''
  change.value = 0
  if (type === 'cash') showCashModal.value = true
  else showQRModal.value = true
}
function calcChange() { change.value = Number(cashGiven.value) - total.value }
function confirmPayment() {
  showCashModal.value    = false
  showQRModal.value      = false
  showSuccessModal.value = true
}
function newOrder() {
  showSuccessModal.value = false
  cart.value      = []
  orderNo.value   = Math.floor(Math.random() * 9000) + 1000
  cashGiven.value = ''
  change.value    = 0
}

function printBill() {
  if (!cart.value.length) return
  const now = new Date().toLocaleString('vi-VN')

  let itemRows = ''
  cart.value.forEach(item => {
    itemRows += `
      <div style="margin-bottom:4px;">
        <div style="font-weight:bold;">${item.name}</div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:#444;">
          <span>${formatPrice(item.price)} x ${item.qty}</span>
          <span style="font-weight:bold;">${formatPrice(item.price * item.qty)}</span>
        </div>
      </div>`
  })

  const html = `
    <html>
    <head>
      <title>Hoa don #POS-${orderNo.value}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: monospace; font-size:12px; width:80mm; margin: 0 auto; padding:4mm; }
        .divider { border-top: 1px dashed #000; margin: 6px 0; }
        @media print {
          @page { size: 80mm auto; margin: 0; }
          body { width: 80mm; margin: 0 auto; }
        }
      </style>
    </head>
    <body>
      <div style="text-align:center; margin-bottom:8px;">
        <div style="font-size:18px; font-weight:900; letter-spacing:3px;">POLYCAKE</div>
        <div style="font-size:10px;">Tiem banh ngot cao cap</div>
        <div style="font-size:10px;">123 Duong Nguyen Van A, Q.1, TP.HCM</div>
        <div style="font-size:10px;">DT: 0901 234 567</div>
      </div>
      <div class="divider"></div>
      <div style="text-align:center; margin-bottom:6px;">
        <div style="font-size:14px; font-weight:900;">HOA DON BAN HANG</div>
        <div style="font-size:10px;">Ma don: #POS-${orderNo.value}</div>
        <div style="font-size:10px;">${now}</div>
        <div style="font-size:10px;">Thu ngan: Nguyen Van A</div>
      </div>
      <div class="divider"></div>
      <div style="margin-bottom:6px;">
        <div style="display:flex; font-weight:bold; font-size:10px; margin-bottom:4px; border-bottom:1px solid #ccc; padding-bottom:3px;">
          <span style="flex:1">San pham</span>
          <span>Thanh tien</span>
        </div>
        ${itemRows}
      </div>
      <div class="divider"></div>
      <div style="font-size:11px; margin-bottom:6px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>Tam tinh:</span><span>${formatPrice(subtotal.value)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>Giam gia:</span><span>-${formatPrice(discount.value)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span>VAT (8%):</span><span>${formatPrice(vat.value)}</span>
        </div>
      </div>
      <div class="divider"></div>
      <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:900; margin-bottom:8px;">
        <span>TONG CONG:</span><span>${formatPrice(total.value)}</span>
      </div>
      <div class="divider"></div>
      <div style="text-align:center; margin-top:8px; font-size:10px;">
        <div>Cam on quy khach da tin dung!</div>
        <div>Hen gap lai tai Chocopine!</div>
        <div style="margin-top:4px; color:#666;">www.polycake.vn</div>
      </div>
    </body>
    </html>`

  const w = window.open('', '_blank', 'width=340,height=600')
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 300)
}

function formatPrice(n) {
  return Number(n).toLocaleString('vi-VN') + 'd'
}
</script>