<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-display font-black text-2xl text-[#5C4428]">Kết Ca – Báo Cáo Ca Làm Việc</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ todayStr }} · Tổng hợp doanh thu &amp; in báo cáo ca</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EDE0CC] shadow-sm">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm font-bold text-[#5C4428]">{{ currentTime }}</span>
      </div>
    </div>

    <!-- Loading page -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center py-24 gap-4">
      <iconify-icon icon="ph:spinner-gap" class="text-5xl animate-spin text-[#7A5C3A]" />
      <p class="text-sm font-semibold text-gray-400">Đang tải ca làm việc...</p>
    </div>

    <div v-else>
      <!-- Chọn ca -->
      <div v-if="todayShifts.length === 0"
        class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm p-12 flex flex-col items-center gap-4">
        <iconify-icon icon="ph:calendar-x-duotone" class="text-6xl text-gray-300" />
        <div class="text-lg font-black text-[#5C4428]">Hôm nay không có ca làm việc</div>
        <p class="text-sm text-gray-400 text-center">Bạn chưa được phân ca hoặc chưa check-in ca nào.<br>Chỉ có thể kết ca sau khi đã check-in.</p>
        <button @click="loadShifts"
          class="px-5 py-2.5 rounded-xl bg-[#FDF6EC] text-[#7A5C3A] text-sm font-bold hover:bg-[#7A5C3A] hover:text-white transition-all flex items-center gap-2">
          <iconify-icon icon="ph:arrows-clockwise" class="text-base" /> Tải lại
        </button>
      </div>

      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <!-- LEFT: Chọn ca + Kết ca -->
        <div class="xl:col-span-2 flex flex-col gap-5">

          <!-- Chọn ca (nếu nhiều ca) -->
          <div v-if="todayShifts.length > 1" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm p-4">
            <div class="text-sm font-bold text-[#5C4428] mb-3">
              <iconify-icon icon="ph:list-checks-duotone" class="mr-1 text-[#7A5C3A]" />
              Bạn có {{ todayShifts.length }} ca hôm nay — chọn ca để kết:
            </div>
            <div class="flex gap-2 flex-wrap">
              <button v-for="s in todayShifts" :key="s.id" @click="selectShift(s)"
                class="px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2"
                :class="selectedShift?.id === s.id
                  ? 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white border-transparent shadow-md'
                  : 'border-[#EDE0CC] text-[#5A6474] hover:border-[#7A5C3A]/40 bg-white'">
                {{ s.tenCa }}
                <span class="ml-1.5 text-[10px] opacity-70">{{ formatTime(s.gioBatDau) }}–{{ formatTime(s.gioKetThuc) }}</span>
                <span v-if="s._report" class="ml-1 w-2 h-2 inline-block rounded-full"
                  :class="s._report.loaiBaoCao === 'Z_REPORT' ? 'bg-gray-400' : 'bg-amber-400'" />
              </button>
            </div>
          </div>

          <!-- Card ca đang chọn -->
          <div v-if="selectedShift" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm overflow-hidden">
            <!-- Thông tin ca -->
            <div class="px-6 py-4 border-b border-[#EDE0CC] flex items-center justify-between">
              <div class="font-display font-bold text-base text-[#5C4428]">{{ selectedShift.tenCa }}</div>
              <span class="px-3 py-1 rounded-full text-xs font-bold"
                :class="shiftBadge.cls">{{ shiftBadge.label }}</span>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bắt đầu</div>
                  <div class="text-lg font-black text-[#5C4428]">{{ formatTime(selectedShift.gioBatDau) }}</div>
                </div>
                <div class="text-center p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Kết thúc</div>
                  <div class="text-lg font-black text-[#5C4428]">{{ formatTime(selectedShift.gioKetThuc) }}</div>
                </div>
                <div class="text-center p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Ngày</div>
                  <div class="text-lg font-black text-[#5C4428]">{{ selectedShift.ngayLamViec }}</div>
                </div>
              </div>

              <!-- Z-Report đã kết => Hiển thị kết quả + Không cho kết lại -->
              <div v-if="selectedShift._report?.loaiBaoCao === 'Z_REPORT'"
                class="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3 mb-6">
                <iconify-icon icon="ph:lock-duotone" class="text-3xl text-gray-400 shrink-0" />
                <div>
                  <div class="font-bold text-gray-600">Ca đã được kết chính thức (Z-Report)</div>
                  <div class="text-xs text-gray-400 mt-0.5">Lúc {{ formatDateTime(selectedShift._report.thoiDiemKetCa) }}</div>
                </div>
              </div>

              <!-- Các nút kết ca -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <!-- X-Report -->
                <button
                  class="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl font-black text-base transition-all duration-200 border-2 relative overflow-hidden"
                  :disabled="!canReport || actionLoading"
                  :class="!canReport || actionLoading
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400 hover:-translate-y-0.5'"
                  @click="doKetCa('X_REPORT')">
                  <iconify-icon v-if="actionLoading && pendingType === 'X_REPORT'" icon="ph:spinner-gap" class="text-4xl animate-spin" />
                  <iconify-icon v-else icon="ph:chart-bar-duotone" class="text-4xl" />
                  <div>
                    <div>X-Report</div>
                    <div class="text-xs font-normal mt-0.5 opacity-70">Báo cáo giữa ca (xem tạm)</div>
                  </div>
                  <div v-if="selectedShift._report?.loaiBaoCao === 'X_REPORT'"
                    class="absolute top-2 right-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full">
                    Đã tạo
                  </div>
                </button>

                <!-- Z-Report -->
                <button
                  class="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl font-black text-base transition-all duration-200 border-2 relative"
                  :disabled="!canReport || actionLoading"
                  :class="!canReport || actionLoading
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-br from-[#7A5C3A] to-[#9A7650] border-transparent text-white shadow-lg shadow-[#7A5C3A]/30 hover:-translate-y-1'"
                  @click="confirmZReport">
                  <iconify-icon v-if="actionLoading && pendingType === 'Z_REPORT'" icon="ph:spinner-gap" class="text-4xl animate-spin" />
                  <iconify-icon v-else icon="ph:flag-checkered-duotone" class="text-4xl" />
                  <div>
                    <div>Z-Report</div>
                    <div class="text-xs font-normal mt-0.5 opacity-80">Kết ca chính thức (1 lần)</div>
                  </div>
                </button>
              </div>

              <!-- Ghi chú -->
              <div v-if="selectedShift._report?.loaiBaoCao !== 'Z_REPORT'">
                <label class="text-sm font-bold text-[#5C4428] block mb-2">Ghi chú kết ca (tuỳ chọn)</label>
                <el-input v-model="ghiChu" type="textarea" :rows="2" placeholder="Ghi chú của nhân viên khi kết ca..." />
              </div>

              <!-- Hướng dẫn -->
              <div v-if="!canReport" class="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
                <iconify-icon icon="ph:info-duotone" class="text-xl shrink-0" />
                Bạn cần <strong class="mx-1">Check-in</strong> ca này trước khi có thể kết ca. Vào trang <strong>Chấm công</strong> để check-in.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Báo cáo + In -->
        <div class="flex flex-col gap-5">

          <!-- Kết quả báo cáo -->
          <div v-if="currentReport" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-[#EDE0CC]">
              <div class="font-display font-bold text-base text-[#5C4428] flex items-center gap-2">
                <iconify-icon icon="ph:receipt-duotone" class="text-[#7A5C3A] text-xl" />
                {{ currentReport.loaiBaoCaoLabel }}
              </div>
              <div class="text-xs text-gray-400 mt-0.5">Lúc {{ formatDateTime(currentReport.thoiDiemKetCa) }}</div>
            </div>
            <div class="p-5 space-y-3">
              <!-- Tổng đơn -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5]">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-[#FDF6EC] flex items-center justify-center">
                    <iconify-icon icon="ph:receipt-duotone" class="text-[#7A5C3A]" />
                  </div>
                  <span class="text-sm font-semibold text-gray-600">Tổng số đơn</span>
                </div>
                <span class="font-black text-[#5C4428]">{{ currentReport.tongSoDon }} đơn</span>
              </div>

              <!-- Tiền mặt -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-green-50">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <iconify-icon icon="ph:money-duotone" class="text-green-600" />
                  </div>
                  <span class="text-sm font-semibold text-gray-600">Tiền mặt</span>
                </div>
                <span class="font-black text-green-600">{{ formatVND(currentReport.doanhThuTienMat) }}</span>
              </div>

              <!-- SePay / QR -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <iconify-icon icon="ph:qr-code-duotone" class="text-blue-600" />
                  </div>
                  <span class="text-sm font-semibold text-gray-600">VietQR / Chuyển khoản</span>
                </div>
                <span class="font-black text-blue-600">{{ formatVND(currentReport.doanhThuSepay) }}</span>
              </div>

              <!-- Khác -->
              <div v-if="currentReport.doanhThuKhac" class="flex items-center justify-between p-3 rounded-xl bg-purple-50">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <iconify-icon icon="ph:dots-three-circle-duotone" class="text-purple-600" />
                  </div>
                  <span class="text-sm font-semibold text-gray-600">Khác</span>
                </div>
                <span class="font-black text-purple-600">{{ formatVND(currentReport.doanhThuKhac) }}</span>
              </div>

              <!-- Tổng doanh thu -->
              <div class="flex items-center justify-between p-4 rounded-xl"
                style="background:linear-gradient(135deg,#7A5C3A 0%,#9A7650 100%)">
                <span class="text-white font-bold text-sm">Tổng doanh thu ca</span>
                <span class="text-white font-black text-xl">{{ formatVND(currentReport.tongDoanhThu) }}</span>
              </div>

              <!-- Ghi chú kết ca -->
              <div v-if="currentReport.ghiChuKetCa" class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
                <iconify-icon icon="ph:note-duotone" class="mr-1" />
                {{ currentReport.ghiChuKetCa }}
              </div>
            </div>

            <!-- Nút in -->
            <div class="px-5 pb-5">
              <button @click="printReport"
                class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all bg-[#1E2A3B] text-white hover:bg-[#2D3F56]">
                <iconify-icon icon="ph:printer-duotone" class="text-xl" />
                In báo cáo ca ({{ currentReport.loaiBaoCao === 'X_REPORT' ? 'X-Report' : 'Z-Report' }})
              </button>
            </div>
          </div>

          <!-- Hướng dẫn khi chưa có báo cáo -->
          <div v-else class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm p-6">
            <div class="font-display font-bold text-base text-[#5C4428] mb-4">Hướng dẫn kết ca</div>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 font-black text-xs">1</div>
                <p>Chọn ca làm việc cần kết (chỉ ca đã check-in mới có thể kết).</p>
              </div>
              <div class="flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 font-black text-xs">2</div>
                <p><strong class="text-amber-600">X-Report</strong>: Xem doanh thu tạm giữa ca, ca vẫn tiếp tục. Có thể tạo nhiều lần.</p>
              </div>
              <div class="flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-[#FDF6EC] flex items-center justify-center shrink-0 text-[#7A5C3A] font-black text-xs">3</div>
                <p><strong class="text-[#7A5C3A]">Z-Report</strong>: Kết ca chính thức, ghi doanh thu, đóng ca. <strong>Chỉ thực hiện 1 lần!</strong></p>
              </div>
              <div class="flex gap-3">
                <div class="w-7 h-7 rounded-lg bg-[#FDF6EC] flex items-center justify-center shrink-0 text-[#7A5C3A] font-black text-xs">4</div>
                <p>Nhấn <strong>In báo cáo</strong> để in Z-Report nộp cho quản lý.</p>
              </div>
            </div>
          </div>

          <!-- Lịch sử báo cáo hôm nay -->
          <div v-if="todayShifts.filter(s => s._report).length > 0"
            class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-[#EDE0CC]">
              <div class="font-display font-bold text-sm text-[#5C4428]">Lịch sử kết ca hôm nay</div>
            </div>
            <div class="divide-y divide-[#FDF8F2]">
              <div v-for="s in todayShifts.filter(s => s._report)" :key="s.id"
                class="px-5 py-3 flex items-center justify-between hover:bg-[#FFFBF5] cursor-pointer transition"
                @click="selectShift(s)">
                <div>
                  <div class="text-sm font-bold text-[#5C4428]">{{ s.tenCa }}</div>
                  <div class="text-xs text-gray-400">{{ formatTime(s.gioBatDau) }} – {{ formatTime(s.gioKetThuc) }}</div>
                </div>
                <div class="text-right">
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                    :class="s._report.loaiBaoCao === 'Z_REPORT' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-600'">
                    {{ s._report.loaiBaoCao === 'Z_REPORT' ? 'Z-Report' : 'X-Report' }}
                  </span>
                  <div class="text-xs text-gray-400 mt-0.5">{{ formatVND(s._report.tongDoanhThu) }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastMsg"
        class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2 max-w-sm"
        :class="toastType === 'success' ? 'bg-[#7A5C3A]' : toastType === 'warn' ? 'bg-yellow-500' : 'bg-red-500'">
        <iconify-icon :icon="toastType === 'success' ? 'ph:check-circle-duotone' : toastType === 'warn' ? 'ph:warning-duotone' : 'ph:x-circle-duotone'" class="text-xl shrink-0" />
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import apiClient from '@/services/apiService'

// ── ĐỒNG HỒ ─────────────────────────────────────────────────────
const currentTime = ref('')
let timerInterval = null
function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
onMounted(() => { updateTime(); timerInterval = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timerInterval))

const todayStr  = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const todayDate = new Date().toISOString().split('T')[0]

// ── STATE ────────────────────────────────────────────────────────
const pageLoading   = ref(false)
const actionLoading = ref(false)
const pendingType   = ref('')

const todayShifts   = ref([])   // PhanCaResponse (đã check-in)
const selectedShift = ref(null)
const ghiChu        = ref('')

// Toast
const toastMsg  = ref('')
const toastType = ref('success')
function showToast(msg, type = 'success') {
  toastMsg.value  = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

// ── COMPUTED ─────────────────────────────────────────────────────
const currentReport = computed(() => selectedShift.value?._report || null)

const canReport = computed(() => {
  // Chỉ kết ca khi phân ca đã có trạng thái XAC_NHAN (đã check-in)
  // và chưa kết Z-Report
  if (!selectedShift.value) return false
  return selectedShift.value.trangThai === 'XAC_NHAN'
})

const shiftBadge = computed(() => {
  const s = selectedShift.value
  if (!s) return { label: '', cls: '' }
  const r = s._report
  if (r?.loaiBaoCao === 'Z_REPORT') return { label: 'Đã kết ca (Z)', cls: 'bg-gray-100 text-gray-600' }
  if (r?.loaiBaoCao === 'X_REPORT') return { label: 'X-Report tạm', cls: 'bg-amber-50 text-amber-600' }
  if (s.trangThai === 'XAC_NHAN')   return { label: 'Đang làm việc', cls: 'bg-green-50 text-green-600' }
  return { label: 'Chưa check-in', cls: 'bg-gray-100 text-gray-500' }
})

// ── LOAD CA HÔM NAY ──────────────────────────────────────────────
async function loadShifts() {
  pageLoading.value = true
  try {
    // Lấy danh sách phân ca hôm nay
    const res = await apiClient.get('/api/v1/staff/my-schedules', { params: { date: todayDate } })
    const shifts = (res.data || []).filter(s => s.trangThai !== 'DA_HUY')

    // Với mỗi ca, thử load báo cáo kết ca nếu có
    for (const shift of shifts) {
      try {
        const rpt = await apiClient.get(`/api/v1/staff/ket-ca/${shift.id}`)
        shift._report = rpt.data || null
      } catch {
        shift._report = null
      }
    }

    todayShifts.value = shifts

    // Tự chọn ca đầu tiên
    if (shifts.length > 0 && !selectedShift.value) {
      selectedShift.value = shifts[0]
    } else if (selectedShift.value) {
      // Cập nhật lại shift đang chọn
      const updated = shifts.find(s => s.id === selectedShift.value.id)
      if (updated) selectedShift.value = updated
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data || 'Không thể tải lịch ca.'
    showToast(typeof msg === 'string' ? msg : 'Không thể tải lịch ca.', 'error')
  } finally {
    pageLoading.value = false
  }
}

function selectShift(s) {
  selectedShift.value = s
  ghiChu.value = ''
}

// ── KẾT CA (X / Z) ──────────────────────────────────────────────
async function doKetCa(loaiBaoCao) {
  if (!selectedShift.value || actionLoading.value) return
  actionLoading.value = true
  pendingType.value   = loaiBaoCao
  try {
    const payload = {
      phanCaId:    selectedShift.value.id,
      loaiBaoCao,
      ghiChu:      ghiChu.value.trim() || null
    }
    const res = await apiClient.post('/api/v1/staff/ket-ca', payload)
    const report = res.data

    // Gắn report vào shift
    selectedShift.value._report = report
    const idx = todayShifts.value.findIndex(s => s.id === selectedShift.value.id)
    if (idx !== -1) todayShifts.value[idx]._report = report

    // Nếu Z-Report → cập nhật trangThai
    if (loaiBaoCao === 'Z_REPORT') {
      selectedShift.value.trangThai = 'DA_KET_CA'
      if (idx !== -1) todayShifts.value[idx].trangThai = 'DA_KET_CA'
    }

    const label = loaiBaoCao === 'X_REPORT' ? 'X-Report (báo cáo giữa ca)' : 'Z-Report (kết ca chính thức)'
    showToast(`✅ Đã tạo ${label} thành công!`)
  } catch (err) {
    const msg = err.response?.data || err.message || 'Kết ca thất bại!'
    showToast(typeof msg === 'string' ? msg : 'Kết ca thất bại!', 'error')
  } finally {
    actionLoading.value = false
    pendingType.value   = ''
  }
}

async function confirmZReport() {
  try {
    await ElMessageBox.confirm(
      'Z-Report sẽ <strong>kết ca chính thức</strong> và ghi nhận doanh thu. ' +
      'Thao tác này <strong>chỉ thực hiện được 1 lần</strong> và không thể hoàn tác.<br><br>' +
      'Bạn có chắc muốn kết ca?',
      'Xác nhận kết ca (Z-Report)',
      {
        confirmButtonText: '✅ Kết ca ngay',
        cancelButtonText: 'Hủy',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        confirmButtonStyle: 'background:#7A5C3A;border-color:#7A5C3A'
      }
    )
    await doKetCa('Z_REPORT')
  } catch {
    // User nhấn Hủy
  }
}

// ── IN BÁO CÁO CA ────────────────────────────────────────────────
function printReport() {
  const r = currentReport.value
  const s = selectedShift.value
  if (!r || !s) return

  const isZ = r.loaiBaoCao === 'Z_REPORT'

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <title>Báo cáo ca – ${s.tenCa}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 5mm; color: #1a1a1a; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .sep { border-top: 1px dashed #888; margin: 6px 0; }
    .sep-solid { border-top: 2px solid #1a1a1a; margin: 6px 0; }
    .row { display: flex; justify-content: space-between; padding: 2px 0; }
    .row .lbl { color: #555; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-weight: bold; font-size: 14px; }
    .badge { display: inline-block; padding: 2px 8px; border: 2px solid #1a1a1a; border-radius: 4px; font-weight: bold; font-size: 13px; margin: 4px 0; }
    .mt8 { margin-top: 8px; }
    .note { font-size: 10px; color: #666; margin-top: 6px; }
    @media print { @page { size: 80mm auto; margin: 0; } body { width: 80mm; } }
  </style>
</head>
<body>
  <div class="center">
    <div class="bold" style="font-size:18px;letter-spacing:2px;">CHOCOPINE</div>
    <div style="font-size:10px;color:#555">Tiệm Bánh Chất Lượng Cao</div>
    <div class="sep-solid mt8"></div>
    <div class="bold" style="font-size:14px;">${isZ ? '★ Z-REPORT – KẾT CA CHÍNH THỨC ★' : '── X-REPORT – BÁO CÁO GIỮA CA ──'}</div>
    <div class="sep"></div>
  </div>

  <div class="mt8">
    <div class="row"><span class="lbl">Ca làm việc:</span> <span class="bold">${s.tenCa}</span></div>
    <div class="row"><span class="lbl">Ngày:</span> <span>${s.ngayLamViec}</span></div>
    <div class="row"><span class="lbl">Giờ ca:</span> <span>${formatTime(s.gioBatDau)} – ${formatTime(s.gioKetThuc)}</span></div>
    <div class="row"><span class="lbl">Thời điểm ${isZ ? 'kết ca' : 'báo cáo'}:</span> <span>${formatDateTimePrint(r.thoiDiemKetCa)}</span></div>
  </div>

  <div class="sep"></div>

  <div class="bold center" style="font-size:11px;letter-spacing:1px">TỔNG HỢP DOANH THU</div>
  <div class="sep"></div>

  <div>
    <div class="row"><span class="lbl">Tổng số đơn:</span> <span class="bold">${r.tongSoDon} đơn</span></div>
    <div class="row"><span class="lbl">Tiền mặt:</span> <span>${formatVND(r.doanhThuTienMat)}</span></div>
    <div class="row"><span class="lbl">VietQR / Chuyển khoản:</span> <span>${formatVND(r.doanhThuSepay)}</span></div>
    ${r.doanhThuKhac ? `<div class="row"><span class="lbl">Khác:</span> <span>${formatVND(r.doanhThuKhac)}</span></div>` : ''}
  </div>

  <div class="sep-solid"></div>
  <div class="total-row">
    <span>TỔNG DOANH THU CA</span>
    <span>${formatVND(r.tongDoanhThu)}</span>
  </div>
  <div class="sep-solid"></div>

  ${r.ghiChuKetCa ? `<div class="mt8"><span class="lbl bold">Ghi chú NV:</span> ${r.ghiChuKetCa}</div>` : ''}

  <div class="sep mt8"></div>
  <div class="center note">
    ${isZ
      ? '<div class="badge">★ ĐÃ KẾT CA CHÍNH THỨC ★</div>'
      : '<div class="badge">BÁO CÁO TẠM – CA VẪN TIẾP TỤC</div>'
    }
    <br>In lúc: ${new Date().toLocaleString('vi-VN')}
    <br><br>Xin cảm ơn!
  </div>
</body>
</html>`

  const w = window.open('', '_blank', 'width=360,height=700')
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 400)
}

// ── FORMAT ───────────────────────────────────────────────────────
function formatTime(t) {
  if (!t) return '--:--'
  if (Array.isArray(t)) return `${String(t[0]).padStart(2,'0')}:${String(t[1]).padStart(2,'0')}`
  return String(t).slice(0, 5)
}
function formatDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatDateTimePrint(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN')
}
function formatVND(n) {
  if (n == null) return '0đ'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}

// ── INIT ─────────────────────────────────────────────────────────
onMounted(() => loadShifts())
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>
