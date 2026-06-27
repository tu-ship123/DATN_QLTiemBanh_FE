<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-display font-black text-2xl text-[#5C4428]">Chấm công hôm nay</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ todayStr }} · Ca làm việc của bạn</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EDE0CC] shadow-sm">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm font-bold text-[#5C4428]">{{ currentTime }}</span>
      </div>
    </div>

    <!-- Loading toàn trang -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center py-24 gap-4">
      <iconify-icon icon="ph:spinner-gap" class="text-5xl animate-spin text-[#7A5C3A]"></iconify-icon>
      <p class="text-sm font-semibold text-gray-400">Đang tải ca làm việc...</p>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- ════════════════════════════════════ -->
      <!-- LEFT: Check-in / Check-out           -->
      <!-- ════════════════════════════════════ -->
      <div class="xl:col-span-2 flex flex-col gap-5">

        <!-- Không có ca hôm nay -->
        <div v-if="todayShifts.length === 0" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm p-8 flex flex-col items-center gap-3">
          <iconify-icon icon="ph:calendar-x-duotone" class="text-6xl text-gray-300"></iconify-icon>
          <div class="text-lg font-black text-[#5C4428]">Hôm nay không có ca làm việc</div>
          <p class="text-sm text-gray-400 text-center">Bạn chưa được phân ca hôm nay.<br>Liên hệ quản lý nếu có nhầm lẫn.</p>
          <button @click="loadTodayShifts" class="mt-2 px-4 py-2 rounded-xl bg-[#FDF6EC] text-[#7A5C3A] text-sm font-bold hover:bg-[#7A5C3A] hover:text-white transition-all flex items-center gap-2">
            <iconify-icon icon="ph:arrows-clockwise" class="text-base"></iconify-icon> Tải lại
          </button>
        </div>

        <!-- Có ca → Hiển thị -->
        <template v-else>
          <!-- Chọn ca nếu có nhiều ca -->
          <div v-if="todayShifts.length > 1" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm p-4">
            <div class="text-sm font-bold text-[#5C4428] mb-3">
              <iconify-icon icon="ph:list-checks-duotone" class="mr-1 text-[#7A5C3A]"></iconify-icon>
              Bạn có {{ todayShifts.length }} ca hôm nay — chọn ca để chấm công:
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="s in todayShifts" :key="s.id"
                @click="selectedShift = s"
                class="px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2"
                :class="selectedShift?.id === s.id
                  ? 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white border-transparent shadow-md'
                  : 'border-[#EDE0CC] text-[#5A6474] hover:border-[#7A5C3A]/40 bg-white'">
                {{ s.tenCa }}
                <span class="ml-1 text-[10px] opacity-70">{{ formatTime(s.gioBatDau) }}–{{ formatTime(s.gioKetThuc) }}</span>
                <span v-if="getChamCong(s)" class="ml-2 w-2 h-2 rounded-full inline-block"
                  :class="getChamCong(s)?.gioRa ? 'bg-gray-400' : 'bg-green-400'"></span>
              </button>
            </div>
          </div>

          <!-- Card ca làm việc đang chọn -->
          <div v-if="selectedShift" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-[#EDE0CC] flex items-center justify-between">
              <div class="font-display font-bold text-base text-[#5C4428]">
                {{ selectedShift.tenCa }}
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold" :class="shiftStatusBadge.cls">
                {{ shiftStatusBadge.label }}
              </span>
            </div>

            <div class="p-6">
              <!-- Thông tin ca -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Ca</div>
                  <div class="text-lg font-black text-[#5C4428]">{{ selectedShift.tenCa }}</div>
                </div>
                <div class="text-center p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bắt đầu</div>
                  <div class="text-lg font-black text-[#5C4428]">{{ formatTime(selectedShift.gioBatDau) }}</div>
                </div>
                <div class="text-center p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Kết thúc</div>
                  <div class="text-lg font-black text-[#5C4428]">{{ formatTime(selectedShift.gioKetThuc) }}</div>
                </div>
              </div>

              <!-- Nút Check-in / Check-out -->
              <div class="flex flex-col sm:flex-row gap-4">
                <!-- CHECK-IN -->
                <button
                  class="flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-2xl font-black text-lg transition-all duration-200 border-2"
                  :disabled="!!activeChamCong || actionLoading"
                  :class="activeChamCong
                    ? 'bg-green-50 border-green-200 text-green-600 cursor-default'
                    : actionLoading
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-br from-[#7A5C3A] to-[#9A7650] border-transparent text-white shadow-lg shadow-[#7A5C3A]/30 hover:-translate-y-1 hover:shadow-[#7A5C3A]/50 active:scale-95'"
                  @click="handleCheckIn"
                >
                  <iconify-icon v-if="actionLoading && !activeChamCong" icon="ph:spinner-gap" class="text-4xl animate-spin"></iconify-icon>
                  <iconify-icon v-else :icon="activeChamCong ? 'ph:check-circle-duotone' : 'ph:sign-in-duotone'" class="text-4xl"></iconify-icon>
                  <span v-if="activeChamCong">
                    Đã Check-in lúc {{ formatDateTime(activeChamCong.gioVao) }}
                  </span>
                  <span v-else>Check-in mở ca</span>
                </button>

                <!-- CHECK-OUT -->
                <button
                  class="flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-2xl font-black text-lg transition-all duration-200 border-2"
                  :disabled="!activeChamCong || !!activeChamCong?.gioRa || actionLoading"
                  :class="activeChamCong?.gioRa
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-default'
                    : !activeChamCong || actionLoading
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-br from-[#5C4428] to-[#2D3F56] border-transparent text-white shadow-lg hover:-translate-y-1 active:scale-95'"
                  @click="handleCheckOut"
                >
                  <iconify-icon v-if="actionLoading && activeChamCong && !activeChamCong.gioRa" icon="ph:spinner-gap" class="text-4xl animate-spin"></iconify-icon>
                  <iconify-icon v-else :icon="activeChamCong?.gioRa ? 'ph:check-circle-duotone' : 'ph:sign-out-duotone'" class="text-4xl"></iconify-icon>
                  <span v-if="activeChamCong?.gioRa">
                    Đã Check-out lúc {{ formatDateTime(activeChamCong.gioRa) }}
                  </span>
                  <span v-else>Check-out đóng ca</span>
                </button>
              </div>

              <!-- Chỉ số sau check-in -->
              <div v-if="activeChamCong" class="mt-5 space-y-3">
                <div class="p-4 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC] flex items-center justify-between">
                  <div class="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <iconify-icon icon="ph:timer-duotone" class="text-[#7A5C3A] text-xl"></iconify-icon>
                    {{ activeChamCong.gioRa ? 'Tổng thời gian làm việc' : 'Đang làm việc' }}
                  </div>
                  <div class="font-black text-xl text-[#7A5C3A]">{{ workDuration }}</div>
                </div>
                <div v-if="activeChamCong.phutDiTre > 0"
                  class="p-3 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center gap-2 text-sm text-yellow-700 font-semibold">
                  <iconify-icon icon="ph:warning-duotone" class="text-xl text-yellow-500"></iconify-icon>
                  Bạn đã vào trễ <strong>{{ activeChamCong.phutDiTre }} phút</strong> so với giờ bắt đầu ca.
                </div>
                <div v-if="activeChamCong.trangThai === 'VE_SOM'"
                  class="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-2 text-sm text-orange-700 font-semibold">
                  <iconify-icon icon="ph:clock-countdown-duotone" class="text-xl text-orange-500"></iconify-icon>
                  Bạn đã check-out trước giờ kết thúc ca (về sớm).
                </div>
              </div>

              <!-- Ghi chú của ca -->
              <div v-if="selectedShift.ghiChu" class="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                <iconify-icon icon="ph:note-duotone" class="mr-1"></iconify-icon>
                {{ selectedShift.ghiChu }}
              </div>
            </div>
          </div>

          <!-- Lịch sử chấm công hôm nay (tất cả ca) -->
          <div class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm">
            <div class="px-6 py-4 border-b border-[#EDE0CC] flex items-center justify-between">
              <div class="font-display font-bold text-base text-[#5C4428]">Tất cả ca hôm nay</div>
              <button @click="loadTodayShifts" class="text-xs text-[#7A5C3A] font-bold hover:underline flex items-center gap-1">
                <iconify-icon icon="ph:arrows-clockwise" class="text-sm"></iconify-icon> Làm mới
              </button>
            </div>
            <div class="divide-y divide-[#FDF8F2]">
              <div v-for="s in todayShifts" :key="s.id"
                class="px-6 py-4 flex items-center justify-between hover:bg-[#FFFBF5] transition cursor-pointer"
                @click="selectedShift = s">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                    :class="selectedShift?.id === s.id ? 'bg-[#7A5C3A] text-white' : 'bg-[#FDF8F2] text-[#5C4428]'">
                    <iconify-icon icon="ph:clock-duotone" class="text-lg"></iconify-icon>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-[#5C4428]">{{ s.tenCa }}</div>
                    <div class="text-xs text-gray-400">{{ formatTime(s.gioBatDau) }} – {{ formatTime(s.gioKetThuc) }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <div class="text-center hidden sm:block">
                    <div class="text-xs text-gray-400">Vào</div>
                    <div class="font-bold text-[#5C4428]">{{ getChamCong(s)?.gioVao ? formatDateTime(getChamCong(s).gioVao) : '--:--' }}</div>
                  </div>
                  <div class="text-center hidden sm:block">
                    <div class="text-xs text-gray-400">Ra</div>
                    <div class="font-bold text-[#5C4428]">{{ getChamCong(s)?.gioRa ? formatDateTime(getChamCong(s).gioRa) : '--:--' }}</div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="getPhanCaBadge(s).cls">
                    {{ getPhanCaBadge(s).label }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ════════════════════════════════════ -->
      <!-- RIGHT: Thống kê + Thông tin          -->
      <!-- ════════════════════════════════════ -->
      <div class="flex flex-col gap-5">

        <!-- Tổng kết ca đang hoạt động -->
        <div v-if="activeChamCong" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE0CC]">
            <div class="font-display font-bold text-base text-[#5C4428]">Chấm công hiện tại</div>
          </div>
          <div class="p-5 space-y-3">
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-lg">✅</div>
                <span class="text-sm font-semibold text-gray-600">Giờ vào</span>
              </div>
              <span class="font-black text-[#5C4428]">{{ formatDateTime(activeChamCong.gioVao) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-[#FDF6EC] flex items-center justify-center text-lg text-[#7A5C3A]"><iconify-icon icon="ph:house-duotone"></iconify-icon></div>
                <span class="text-sm font-semibold text-gray-600">Giờ ra</span>
              </div>
              <span class="font-black text-[#5C4428]">{{ activeChamCong.gioRa ? formatDateTime(activeChamCong.gioRa) : '—' }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-lg">⏰</div>
                <span class="text-sm font-semibold text-gray-600">Đi trễ</span>
              </div>
              <span class="font-black" :class="activeChamCong.phutDiTre > 0 ? 'text-yellow-600' : 'text-green-600'">
                {{ activeChamCong.phutDiTre > 0 ? `${activeChamCong.phutDiTre} phút` : 'Đúng giờ' }}
              </span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-lg">📋</div>
                <span class="text-sm font-semibold text-gray-600">Trạng thái</span>
              </div>
              <span class="font-black px-2.5 py-1 rounded-full text-xs" :class="getTrangThaiBadge(activeChamCong.trangThai).cls">
                {{ getTrangThaiBadge(activeChamCong.trangThai).label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Thống kê hôm nay -->
        <div class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE0CC]">
            <div class="font-display font-bold text-base text-[#5C4428]">Tháng {{ currentMonth }}</div>
            <div class="text-xs text-gray-400 mt-0.5">Tổng kết chấm công</div>
          </div>
          <div class="p-5 space-y-3">
            <div v-for="stat in monthStats" :key="stat.label"
              class="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5]">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg text-[#7A5C3A]" :style="{ background: stat.bg }">
                  <iconify-icon :icon="stat.icon"></iconify-icon>
                </div>
                <span class="text-sm font-semibold text-gray-600">{{ stat.label }}</span>
              </div>
              <span class="font-black text-[#5C4428]" :class="stat.valueClass">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <!-- Hướng dẫn -->
        <div class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE0CC]">
            <div class="font-display font-bold text-base text-[#5C4428]">Hướng dẫn chấm công</div>
          </div>
          <div class="p-5 space-y-3 text-sm text-gray-600">
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-[#FDF6EC] flex items-center justify-center shrink-0 text-[#7A5C3A] font-black text-xs">1</div>
              <p>Hệ thống tự động load ca được phân cho bạn hôm nay.</p>
            </div>
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-[#FDF6EC] flex items-center justify-center shrink-0 text-[#7A5C3A] font-black text-xs">2</div>
              <p>Nhấn <strong class="text-[#7A5C3A]">Check-in mở ca</strong> khi bắt đầu làm việc.</p>
            </div>
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-[#FDF6EC] flex items-center justify-center shrink-0 text-[#7A5C3A] font-black text-xs">3</div>
              <p>Nhấn <strong class="text-[#5C4428]">Check-out đóng ca</strong> khi kết thúc làm việc.</p>
            </div>
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0 text-yellow-600"><iconify-icon icon="ph:warning-duotone"></iconify-icon></div>
              <p class="text-xs text-gray-400">Hệ thống tự tính đi trễ / về sớm so với giờ ca đã phân.</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toastMsg"
        class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2 max-w-xs"
        :class="toastType === 'success' ? 'bg-[#7A5C3A]' : toastType === 'warn' ? 'bg-yellow-500' : 'bg-red-500'">
        <iconify-icon :icon="toastType === 'success' ? 'ph:check-circle-duotone' : toastType === 'warn' ? 'ph:warning-duotone' : 'ph:x-circle-duotone'" class="text-xl shrink-0"></iconify-icon>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import apiClient from '@/services/apiService'

// ─── ĐỒNG HỒ ────────────────────────────────────────────────────────────────
const currentTime = ref('')
let timerInterval = null

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}
onMounted(() => { updateTime(); timerInterval = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timerInterval))

const todayStr     = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const currentMonth = new Date().getMonth() + 1
const todayDate    = new Date().toISOString().split('T')[0] // yyyy-mm-dd

// ─── STATE ──────────────────────────────────────────────────────────────────
const pageLoading   = ref(false)
const actionLoading = ref(false)

/**
 * todayShifts: danh sách PhanCaResponse từ GET /api/v1/staff/my-schedules
 * Mỗi item có: { id, tenCa, gioBatDau, gioKetThuc, ngayLamViec, trangThai, ghiChu, ... }
 */
const todayShifts   = ref([])
const chamCongMap   = ref({})   // phanCaId → ChamCongResponse
const selectedShift = ref(null)

// Toast
const toastMsg  = ref('')
const toastType = ref('success')
function showToast(msg, type = 'success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

// ─── LOAD CA HÔM NAY TỪ API ─────────────────────────────────────────────────
/**
 * Gọi GET /api/v1/staff/my-schedules?date=YYYY-MM-DD
 * BE trả về List<PhanCaResponse> — xem PhanCaResponse.java
 *
 * Mỗi item trả về:
 * {
 *   id, ngayLamViec, trangThai, ghiChu, ngayTao,
 *   caLamViecId, tenCa, gioBatDau, gioKetThuc,
 *   nhanVienId, tenNhanVien, emailNhanVien
 * }
 */
async function loadTodayShifts() {
  pageLoading.value = true
  try {
    const res = await apiClient.get('/api/v1/staff/my-schedules', {
      params: { date: todayDate }
    })
    const shifts = res.data || []

    // Lọc bỏ ca đã huỷ
    todayShifts.value = shifts.filter(s => s.trangThai !== 'DA_HUY')

    // Tự chọn ca đầu tiên nếu chưa có lựa chọn
    if (todayShifts.value.length > 0 && !selectedShift.value) {
      selectedShift.value = todayShifts.value[0]
    }

    // Reset selectedShift nếu ca cũ không còn trong list
    if (selectedShift.value) {
      const stillExists = todayShifts.value.find(s => s.id === selectedShift.value.id)
      if (!stillExists) selectedShift.value = todayShifts.value[0] || null
    }

  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data || 'Không thể tải lịch ca.'
    showToast(typeof msg === 'string' ? msg : 'Không thể tải lịch ca.', 'error')
  } finally {
    pageLoading.value = false
  }
}

// ─── CA ĐANG ĐƯỢC CHỌN ──────────────────────────────────────────────────────
const activeChamCong = computed(() => {
  if (!selectedShift.value) return null
  return chamCongMap.value[selectedShift.value.id] || null
})

const shiftStatusBadge = computed(() => {
  if (!selectedShift.value) return { label: '', cls: '' }
  const cc = activeChamCong.value
  if (!cc)       return { label: 'Chưa check-in', cls: 'bg-gray-100 text-gray-500' }
  if (cc.gioRa)  return { label: 'Đã đóng ca',   cls: 'bg-gray-100 text-gray-600' }
  return { label: 'Đang làm việc', cls: 'bg-green-50 text-green-600' }
})

const workDuration = computed(() => {
  const cc = activeChamCong.value
  if (!cc?.gioVao) return '0 phút'
  const start = new Date(cc.gioVao)
  const end   = cc.gioRa ? new Date(cc.gioRa) : new Date()
  const mins  = Math.floor((end - start) / 60000)
  if (mins < 60) return `${mins} phút`
  return `${Math.floor(mins / 60)} giờ ${mins % 60} phút`
})

function getChamCong(shift) {
  return chamCongMap.value[shift.id] || null
}

// ─── CHECK-IN ────────────────────────────────────────────────────────────────
async function handleCheckIn() {
  if (!selectedShift.value || activeChamCong.value || actionLoading.value) return
  actionLoading.value = true
  try {
    const res = await apiClient.post('/api/v1/staff/checkin', {
      phanCaId: selectedShift.value.id
    })
    const data = res.data // ChamCongResponse
    chamCongMap.value = { ...chamCongMap.value, [selectedShift.value.id]: data }

    const msg = data.phutDiTre > 0
      ? `Check-in lúc ${formatDateTime(data.gioVao)} — Trễ ${data.phutDiTre} phút!`
      : `Check-in thành công lúc ${formatDateTime(data.gioVao)} — Đúng giờ!`
    showToast(msg, data.phutDiTre > 0 ? 'warn' : 'success')

  } catch (err) {
    const msg = err.response?.data || err.message || 'Check-in thất bại!'
    showToast(typeof msg === 'string' ? msg : 'Check-in thất bại!', 'error')
  } finally {
    actionLoading.value = false
  }
}

// ─── CHECK-OUT ───────────────────────────────────────────────────────────────
async function handleCheckOut() {
  if (!activeChamCong.value || activeChamCong.value.gioRa || actionLoading.value) return
  actionLoading.value = true
  try {
    const res = await apiClient.post(`/api/v1/staff/checkout/${selectedShift.value.id}`)
    const data = res.data // ChamCongResponse
    chamCongMap.value = { ...chamCongMap.value, [selectedShift.value.id]: data }

    const msg = data.trangThai === 'VE_SOM'
      ? `Check-out lúc ${formatDateTime(data.gioRa)} — Về sớm hơn giờ kết thúc ca.`
      : `Check-out thành công lúc ${formatDateTime(data.gioRa)}. Cảm ơn bạn đã làm việc! 👋`
    showToast(msg, data.trangThai === 'VE_SOM' ? 'warn' : 'success')

  } catch (err) {
    const msg = err.response?.data || err.message || 'Check-out thất bại!'
    showToast(typeof msg === 'string' ? msg : 'Check-out thất bại!', 'error')
  } finally {
    actionLoading.value = false
  }
}

// ─── BADGE HELPERS ────────────────────────────────────────────────────────────
function getPhanCaBadge(shift) {
  const cc = getChamCong(shift)
  if (!cc)        return { label: 'Chưa vào',  cls: 'bg-gray-100 text-gray-500' }
  if (cc.gioRa)   return { label: 'Đã đóng ca', cls: 'bg-blue-50 text-blue-600' }
  return { label: 'Đang làm', cls: 'bg-green-50 text-green-600' }
}

function getTrangThaiBadge(tt) {
  const map = {
    DUNG_GIO: { label: 'Đúng giờ', cls: 'bg-green-50 text-green-600' },
    DI_TRE:   { label: 'Đi trễ',   cls: 'bg-yellow-50 text-yellow-600' },
    VE_SOM:   { label: 'Về sớm',   cls: 'bg-orange-50 text-orange-600' },
    VANG_MAT: { label: 'Vắng mặt', cls: 'bg-red-50 text-red-600' },
  }
  return map[tt] || { label: tt, cls: 'bg-gray-100 text-gray-600' }
}

// ─── FORMAT ───────────────────────────────────────────────────────────────────
function formatTime(t) {
  if (!t) return '--:--'
  // BE trả LocalTime dưới dạng array [H, M, S] hoặc string "HH:MM:SS"
  if (Array.isArray(t)) return `${String(t[0]).padStart(2, '0')}:${String(t[1]).padStart(2, '0')}`
  return String(t).slice(0, 5)
}

function formatDateTime(dt) {
  if (!dt) return '--:--'
  return new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

// ─── THỐNG KÊ ────────────────────────────────────────────────────────────────
const monthStats = computed(() => [
  {
    icon: 'ph:check-circle-duotone', label: 'Ca đã hoàn thành hôm nay',
    value: Object.values(chamCongMap.value).filter(c => c.gioRa).length + ' ca',
    bg: '#F0FDF4', valueClass: 'text-green-600'
  },
  {
    icon: 'ph:clock-duotone', label: 'Tổng phút đi trễ hôm nay',
    value: (() => {
      const total = Object.values(chamCongMap.value).reduce((s, c) => s + (c.phutDiTre || 0), 0)
      return total > 0 ? `${total} phút` : 'Không có'
    })(),
    bg: '#FFFBEB', valueClass: 'text-yellow-500'
  },
  {
    icon: 'ph:timer-duotone', label: 'Thời gian làm ca hiện tại',
    value: workDuration.value,
    bg: '#FDF6EC', valueClass: 'text-[#7A5C3A]'
  },
])

// ─── KHỞI TẠO ────────────────────────────────────────────────────────────────
onMounted(() => loadTodayShifts())
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>
