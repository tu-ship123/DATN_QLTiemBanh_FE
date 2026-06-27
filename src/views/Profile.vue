<template>
  <div class="space-y-8 max-w-5xl mx-auto px-4 md:px-8 py-10 animate-fade-in chocopine-page">

    <!-- ===== HEADER ===== -->
    <div class="p-6 rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center"
             style="background:linear-gradient(135deg,#7A5C3A,#9A7650);box-shadow:0 4px 16px rgba(122,92,58,0.2);">
          <iconify-icon icon="ph:user-circle-duotone" class="text-3xl" style="color:#FFFFFF;"></iconify-icon>
        </div>
        <div>
          <h1 class="chocopine-title" style="font-size:24px;text-align:left;margin:0;">Hồ sơ của tôi</h1>
          <p class="chocopine-desc" style="text-align:left;margin:4px 0 0;font-size:13px;">
            {{ authStore.user?.email }}
          </p>
        </div>
      </div>
    </div>

    <!-- ===== TABS ===== -->
    <div class="flex gap-2 bg-[#FDF8F2] rounded-2xl p-1.5 border border-[#EDE0CC]">
      <button v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
        :class="activeTab === tab.key
          ? 'bg-[#7A5C3A] text-white shadow-md'
          : 'text-[#7A5C3A] hover:bg-[#EDE0CC]/50'">
        <iconify-icon :icon="tab.icon" class="text-base"></iconify-icon>
        {{ tab.label }}
      </button>
    </div>

    <!-- ===== TAB: THÔNG TIN ===== -->
    <div v-if="activeTab === 'info'" class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6 space-y-5">
      <h2 class="text-base font-bold text-[#5C4428]">Thông tin cơ bản</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Họ và tên</label>
          <input v-model="form.hoTen" type="text"
            class="w-full px-4 py-3 rounded-xl border border-[#EDE0CC] bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all" />
        </div>
        <div>
          <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Email</label>
          <input :value="authStore.user?.email" disabled type="email"
            class="w-full px-4 py-3 rounded-xl border border-[#EDE0CC] bg-gray-50 text-sm text-gray-400 outline-none cursor-not-allowed" />
        </div>
        <div>
          <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Số điện thoại</label>
          <input v-model="form.soDienThoai" type="text"
            class="w-full px-4 py-3 rounded-xl border border-[#EDE0CC] bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all" />
        </div>
      </div>

      <div class="pt-2">
        <button @click="luuThongTin"
          class="chocopine-btn-primary px-8 py-3 text-sm">
          <iconify-icon icon="ph:floppy-disk-duotone" class="text-base mr-1"></iconify-icon>
          Lưu thay đổi
        </button>
      </div>
    </div>

    <!-- ===== TAB: ĐIỂM THƯỞNG ===== -->
    <div v-if="activeTab === 'diem'" class="space-y-5">

      <!-- Tổng điểm -->
      <div class="rounded-[24px] p-6 text-white shadow-lg"
           style="background:linear-gradient(135deg,#7A5C3A 0%,#9A7650 100%);">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80 font-medium mb-1">Điểm tích lũy của bạn</p>
            <div class="flex items-end gap-2">
              <span class="text-5xl font-black tracking-tight">{{ tongDiem }}</span>
              <span class="text-lg opacity-70 mb-1">điểm</span>
            </div>
            <p class="text-xs opacity-60 mt-2">Cứ 10.000đ chi tiêu = 1 điểm · Đánh giá sản phẩm = +5 điểm</p>
          </div>
          <iconify-icon icon="ph:star-duotone" class="text-7xl opacity-20"></iconify-icon>
        </div>
      </div>

      <!-- Lịch sử giao dịch điểm -->
      <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-[#FDF6EC] flex items-center gap-2">
          <iconify-icon icon="ph:clock-countdown-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
          <h2 class="text-sm font-bold text-[#5C4428]">Lịch sử điểm</h2>
        </div>

        <div v-if="loadingDiem" class="text-center py-10">
          <div class="inline-block animate-spin w-6 h-6 border-4 border-[#7A5C3A] border-t-transparent rounded-full"></div>
        </div>

        <div v-else-if="lichSuDiem.length === 0" class="text-center py-10 text-sm text-[#A68B5C]">
          Chưa có giao dịch điểm nào.
        </div>

        <div v-else class="divide-y divide-[#FDF6EC]">
          <div v-for="gd in lichSuDiem" :key="gd.id"
            class="flex items-center gap-4 px-6 py-4">
            <div class="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
                 :class="gd.diemThayDoi > 0 ? 'bg-green-50' : 'bg-red-50'">
              <iconify-icon :icon="gd.diemThayDoi > 0 ? 'ph:plus-circle-duotone' : 'ph:minus-circle-duotone'"
                class="text-xl" :class="gd.diemThayDoi > 0 ? 'text-green-500' : 'text-red-400'"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-[#5C4428]">{{ gd.moTa }}</p>
              <p class="text-xs text-[#A68B5C] mt-0.5">{{ formatDate(gd.ngayTao) }}</p>
            </div>
            <span class="text-base font-black"
              :class="gd.diemThayDoi > 0 ? 'text-green-600' : 'text-red-500'">
              {{ gd.diemThayDoi > 0 ? '+' : '' }}{{ gd.diemThayDoi }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TAB: VOUCHER ===== -->
    <div v-if="activeTab === 'voucher'" class="space-y-5">

      <!-- Đổi điểm lấy voucher -->
      <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-[#FDF6EC] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <iconify-icon icon="ph:swap-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
            <h2 class="text-sm font-bold text-[#5C4428]">Đổi điểm lấy voucher</h2>
          </div>
          <span class="text-xs bg-[#FDF6EC] text-[#7A5C3A] font-bold px-3 py-1 rounded-full border border-[#EDE0CC]">
            Bạn có {{ tongDiem }} điểm
          </span>
        </div>

        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="goi in danhSachGoi" :key="goi.id"
            class="rounded-2xl border-2 p-4 transition-all cursor-pointer hover:shadow-md"
            :class="tongDiem >= goi.diemCanDung
              ? 'border-[#EDE0CC] hover:border-[#7A5C3A] bg-[#FDF8F2]'
              : 'border-dashed border-[#EDE0CC] bg-gray-50 opacity-60 cursor-not-allowed'">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-[#7A5C3A]/10">
                <iconify-icon icon="ph:ticket-duotone" class="text-xl text-[#7A5C3A]"></iconify-icon>
              </div>
              <span class="text-xs font-bold text-[#7A5C3A] bg-[#7A5C3A]/10 px-2 py-1 rounded-full">
                {{ goi.diemCanDung }} điểm
              </span>
            </div>
            <p class="text-sm font-bold text-[#5C4428] mb-1">
              {{ goi.loaiGiamGia === 'PHAN_TRAM' ? `Giảm ${goi.giaTriGiam}%` : `Giảm ${formatTien(goi.giaTriGiam)}` }}
            </p>
            <p class="text-xs text-[#9A7650]">
              {{ goi.maCode }}
              <span v-if="goi.donHangToiThieu > 0"> · Đơn từ {{ formatTien(goi.donHangToiThieu) }}</span>
            </p>
            <button
              v-if="tongDiem >= goi.diemCanDung"
              @click="doiDiem(goi)"
              :disabled="doiDiemLoading"
              class="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-[#7A5C3A] text-white hover:bg-[#6B4E2E] transition-colors disabled:opacity-60">
              <iconify-icon icon="ph:gift-duotone" class="mr-1"></iconify-icon>
              Đổi ngay
            </button>
            <button v-else disabled
              class="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-gray-200 text-gray-400 cursor-not-allowed">
              Chưa đủ điểm
            </button>
          </div>
        </div>
      </div>

      <!-- Danh sách voucher đã có -->
      <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-[#FDF6EC] flex items-center gap-2">
          <iconify-icon icon="ph:ticket-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
          <h2 class="text-sm font-bold text-[#5C4428]">Voucher của tôi</h2>
          <span class="ml-auto text-xs bg-[#7A5C3A] text-white px-2.5 py-0.5 rounded-full font-bold">
            {{ voucherConHieuLuc }} còn dùng được
          </span>
        </div>

        <div v-if="loadingVoucher" class="text-center py-10">
          <div class="inline-block animate-spin w-6 h-6 border-4 border-[#7A5C3A] border-t-transparent rounded-full"></div>
        </div>

        <div v-else-if="danhSachVoucher.length === 0" class="text-center py-10 text-sm text-[#A68B5C]">
          Bạn chưa có voucher nào. Hãy đổi điểm để nhận voucher!
        </div>

        <div v-else class="divide-y divide-[#FDF6EC]">
          <div v-for="v in danhSachVoucher" :key="v.id"
            class="px-6 py-4 flex items-center gap-4"
            :class="!v.conHieuLuc ? 'opacity-50' : ''">
            <div class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
                 :class="v.conHieuLuc ? 'bg-[#7A5C3A]/10' : 'bg-gray-100'">
              <iconify-icon icon="ph:ticket-duotone" class="text-2xl"
                :class="v.conHieuLuc ? 'text-[#7A5C3A]' : 'text-gray-400'"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-[#5C4428]">{{ v.tenVoucher }}</p>
              <p class="text-xs text-[#A68B5C] mt-0.5">
                Hết hạn: {{ formatDate(v.ngayHetHan) }}
                <span v-if="v.diemSuDung"> · Đổi {{ v.diemSuDung }} điểm</span>
              </p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full"
              :class="{
                'bg-green-100 text-green-700': v.trangThai === 'CHUA_SU_DUNG' && v.conHieuLuc,
                'bg-gray-100 text-gray-500': v.trangThai === 'DA_SU_DUNG',
                'bg-red-50 text-red-400': v.trangThai === 'HET_HAN' || (v.trangThai === 'CHUA_SU_DUNG' && !v.conHieuLuc),
              }">
              {{ labelTrangThaiVoucher(v) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-xs"
        :class="toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#7A5C3A] text-white'">
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-duotone' : 'ph:warning-circle-duotone'" class="text-lg flex-shrink-0"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/services/apiService'

const authStore = useAuthStore()

const tabs = [
  { key: 'info',    label: 'Thông tin',     icon: 'ph:user-duotone' },
  { key: 'diem',    label: 'Điểm thưởng',   icon: 'ph:star-duotone' },
  { key: 'voucher', label: 'Voucher',        icon: 'ph:ticket-duotone' },
]
const activeTab = ref('voucher')  // Mặc định mở tab voucher

// ─── Form thông tin ───────────────────────────────────────────────────────────
const form = ref({ hoTen: '', soDienThoai: '' })

// ─── Điểm thưởng ─────────────────────────────────────────────────────────────
const tongDiem = ref(0)
const lichSuDiem = ref([])
const loadingDiem = ref(false)
const danhSachGoi = ref([])
const doiDiemLoading = ref(false)

// ─── Voucher ──────────────────────────────────────────────────────────────────
const danhSachVoucher = ref([])
const loadingVoucher = ref(false)

const voucherConHieuLuc = computed(() => danhSachVoucher.value.filter(v => v.conHieuLuc).length)

// ─── Toast ────────────────────────────────────────────────────────────────────
const toast = ref({ show: false, msg: '', type: 'info' })
let toastTimer = null
const showToast = (msg, type = 'info') => {
  toast.value = { show: true, msg, type }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.value.show = false, 3500)
}

// ─── Load dữ liệu ────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([layDiem(), layVoucher(), layGoiDoi()])
})

async function layDiem() {
  loadingDiem.value = true
  try {
    const res = await apiClient.get('/api/v1/loyalty/diem')
    tongDiem.value = res.data.tongDiem || 0
    lichSuDiem.value = res.data.lichSu || []
  } catch (e) {
    console.error('Lỗi lấy điểm:', e)
  } finally {
    loadingDiem.value = false
  }
}

async function layVoucher() {
  loadingVoucher.value = true
  try {
    const res = await apiClient.get('/api/v1/loyalty/voucher')
    danhSachVoucher.value = res.data || []
  } catch (e) {
    console.error('Lỗi lấy voucher:', e)
  } finally {
    loadingVoucher.value = false
  }
}

async function layGoiDoi() {
  try {
    const res = await apiClient.get('/api/v1/loyalty/voucher/goi')
    danhSachGoi.value = res.data || []
  } catch (e) {
    console.error('Lỗi lấy gói đổi:', e)
  }
}

async function doiDiem(goi) {
  const label = goi.loaiGiamGia === 'PHAN_TRAM'
    ? `Giảm ${goi.giaTriGiam}%`
    : `Giảm ${formatTien(goi.giaTriGiam)}`
  if (!confirm(`Đổi ${goi.diemCanDung} điểm để nhận: "${label}"?`)) return
  doiDiemLoading.value = true
  try {
    await apiClient.post('/api/v1/loyalty/voucher/doi-diem', { maGoiVoucher: goi.maCode })
    showToast(`🎉 Đổi thành công! Voucher "${label}" đã được thêm vào ví.`, 'success')
    await Promise.all([layDiem(), layVoucher()])
  } catch (e) {
    showToast(e.response?.data || 'Đổi điểm thất bại!', 'error')
  } finally {
    doiDiemLoading.value = false
  }
}

async function luuThongTin() {
  showToast('Tính năng cập nhật thông tin đang phát triển.', 'info')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTien(val) {
  if (val == null) return ''
  return new Intl.NumberFormat('vi-VN').format(val) + 'đ'
}

function labelTrangThaiVoucher(v) {
  if (v.trangThai === 'DA_SU_DUNG') return 'Đã dùng'
  if (!v.conHieuLuc) return 'Hết hạn'
  return 'Còn dùng được'
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn .4s ease both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }

.chocopine-btn-primary {
  background: linear-gradient(135deg, #7A5C3A, #9A7650);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chocopine-btn-primary:hover { background: linear-gradient(135deg, #6B4E2E, #7A5C3A); box-shadow: 0 6px 20px rgba(122,92,58,.25); }
.chocopine-title { font-weight: 800; color: #3D2B1A; }
.chocopine-desc { color: #9A7650; }
</style>