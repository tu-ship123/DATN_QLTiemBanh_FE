<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-display font-black text-2xl text-[#1E2A3B]">Chấm công hôm nay</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ todayStr }} · Ca làm việc của bạn</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EDE8E3] shadow-sm">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-sm font-bold text-[#1E2A3B]">{{ currentTime }}</span>
      </div>
    </div>

    <!-- Loading toàn trang -->
    <div v-if="pageLoading" class="flex flex-col items-center justify-center py-24 gap-4">
      <iconify-icon icon="ph:spinner-gap" class="text-5xl animate-spin text-[#E8634A]"></iconify-icon>
      <p class="text-sm font-semibold text-gray-400">Đang tải ca làm việc...</p>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- ════════════════════════════════════ -->
      <!-- LEFT: Check-in / Check-out           -->
      <!-- ════════════════════════════════════ -->
      <div class="xl:col-span-2 flex flex-col gap-5">

        <!-- CHỌN CA (nếu có nhiều ca hôm nay) -->
        <div v-if="todayShifts.length === 0" class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm p-8 flex flex-col items-center gap-3">
          <iconify-icon icon="ph:calendar-x-duotone" class="text-6xl text-gray-300"></iconify-icon>
          <div class="text-lg font-black text-[#1E2A3B]">Hôm nay không có ca làm việc</div>
          <p class="text-sm text-gray-400 text-center">Bạn chưa được phân ca hôm nay.<br>Liên hệ quản lý nếu có nhầm lẫn.</p>
        </div>

        <!-- Có ca → Hiển thị -->
        <template v-else>
          <!-- Chọn ca nếu có nhiều ca -->
          <div v-if="todayShifts.length > 1" class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm p-4">
            <div class="text-sm font-bold text-[#1E2A3B] mb-3">
              <iconify-icon icon="ph:list-checks-duotone" class="mr-1 text-[#E8634A]"></iconify-icon>
              Bạn có {{ todayShifts.length }} ca hôm nay — chọn ca để chấm công:
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="s in todayShifts" :key="s.id"
                @click="selectedShift = s"
                class="px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2"
                :class="selectedShift?.id === s.id
                  ? 'bg-gradient-to-r from-[#E8634A] to-[#F07A5E] text-white border-transparent shadow-md'
                  : 'border-[#EDE8E3] text-[#5A6474] hover:border-[#E8634A]/40 bg-white'">
                {{ s.caLamViec.tenCa }}
                <span class="ml-1 text-[10px] opacity-70">{{ formatTime(s.caLamViec.gioBatDau) }}–{{ formatTime(s.caLamViec.gioKetThuc) }}</span>
                <!-- Badge trạng thái -->
                <span v-if="getChamCong(s)" class="ml-2 w-2 h-2 rounded-full inline-block"
                  :class="getChamCong(s)?.gioRa ? 'bg-gray-400' : 'bg-green-400'"></span>
              </button>
            </div>
          </div>

          <!-- Card ca làm việc đang chọn -->
          <div v-if="selectedShift" class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-[#EDE8E3] flex items-center justify-between">
              <div class="font-display font-bold text-base text-[#1E2A3B]">
                {{ selectedShift.caLamViec.tenCa }}
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold" :class="shiftStatusBadge.cls">
                {{ shiftStatusBadge.label }}
              </span>
            </div>

            <div class="p-6">
              <!-- Thông tin ca -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Ca</div>
                  <div class="text-lg font-black text-[#1E2A3B]">{{ selectedShift.caLamViec.tenCa }}</div>
                </div>
                <div class="text-center p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bắt đầu</div>
                  <div class="text-lg font-black text-[#1E2A3B]">{{ formatTime(selectedShift.caLamViec.gioBatDau) }}</div>
                </div>
                <div class="text-center p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3]">
                  <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Kết thúc</div>
                  <div class="text-lg font-black text-[#1E2A3B]">{{ formatTime(selectedShift.caLamViec.gioKetThuc) }}</div>
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
                    : 'bg-gradient-to-br from-[#E8634A] to-[#F07A5E] border-transparent text-white shadow-lg shadow-[#E8634A]/30 hover:-translate-y-1 hover:shadow-[#E8634A]/50 active:scale-95'"
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
                    : 'bg-gradient-to-br from-[#1E2A3B] to-[#2D3F56] border-transparent text-white shadow-lg hover:-translate-y-1 active:scale-95'"
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

              <!-- Thời gian làm việc / các chỉ số sau check-in -->
              <div v-if="activeChamCong" class="mt-5 space-y-3">
                <div class="p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3] flex items-center justify-between">
                  <div class="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <iconify-icon icon="ph:timer-duotone" class="text-[#E8634A] text-xl"></iconify-icon>
                    {{ activeChamCong.gioRa ? 'Tổng thời gian làm việc' : 'Đang làm việc' }}
                  </div>
                  <div class="font-black text-xl text-[#E8634A]">{{ workDuration }}</div>
                </div>

                <!-- Badge đi trễ -->
                <div v-if="activeChamCong.phutDiTre > 0"
                  class="p-3 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center gap-2 text-sm text-yellow-700 font-semibold">
                  <iconify-icon icon="ph:warning-duotone" class="text-xl text-yellow-500"></iconify-icon>
                  Bạn đã vào trễ <strong>{{ activeChamCong.phutDiTre }} phút</strong> so với giờ bắt đầu ca.
                </div>

                <!-- Badge về sớm -->
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
          <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
            <div class="px-6 py-4 border-b border-[#EDE8E3] flex items-center justify-between">
              <div class="font-display font-bold text-base text-[#1E2A3B]">Tất cả ca hôm nay</div>
              <button @click="loadTodayShifts" class="text-xs text-[#E8634A] font-bold hover:underline flex items-center gap-1">
                <iconify-icon icon="ph:arrows-clockwise" class="text-sm"></iconify-icon> Làm mới
              </button>
            </div>
            <div class="divide-y divide-[#F5F0ED]">
              <div v-for="s in todayShifts" :key="s.id"
                class="px-6 py-4 flex items-center justify-between hover:bg-[#FFF8F4] transition cursor-pointer"
                @click="selectedShift = s">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                    :class="selectedShift?.id === s.id ? 'bg-[#E8634A] text-white' : 'bg-[#F5F0ED] text-[#1E2A3B]'">
                    <iconify-icon icon="ph:clock-duotone" class="text-lg"></iconify-icon>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-[#1E2A3B]">{{ s.caLamViec.tenCa }}</div>
                    <div class="text-xs text-gray-400">
                      {{ formatTime(s.caLamViec.gioBatDau) }} – {{ formatTime(s.caLamViec.gioKetThuc) }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <div class="text-center hidden sm:block">
                    <div class="text-xs text-gray-400">Vào</div>
                    <div class="font-bold text-[#1E2A3B]">{{ getChamCong(s)?.gioVao ? formatDateTime(getChamCong(s).gioVao) : '--:--' }}</div>
                  </div>
                  <div class="text-center hidden sm:block">
                    <div class="text-xs text-gray-400">Ra</div>
                    <div class="font-bold text-[#1E2A3B]">{{ getChamCong(s)?.gioRa ? formatDateTime(getChamCong(s).gioRa) : '--:--' }}</div>
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
        <div v-if="activeChamCong" class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Chấm công hiện tại</div>
          </div>
          <div class="p-5 space-y-3">
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F4]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-lg">✅</div>
                <span class="text-sm font-semibold text-gray-600">Giờ vào</span>
              </div>
              <span class="font-black text-[#1E2A3B]">{{ formatDateTime(activeChamCong.gioVao) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F4]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">🏠</div>
                <span class="text-sm font-semibold text-gray-600">Giờ ra</span>
              </div>
              <span class="font-black text-[#1E2A3B]">{{ activeChamCong.gioRa ? formatDateTime(activeChamCong.gioRa) : '—' }}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F4]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-lg">⏰</div>
                <span class="text-sm font-semibold text-gray-600">Đi trễ</span>
              </div>
              <span class="font-black" :class="activeChamCong.phutDiTre > 0 ? 'text-yellow-600' : 'text-green-600'">
                {{ activeChamCong.phutDiTre > 0 ? `${activeChamCong.phutDiTre} phút` : 'Đúng giờ' }}
              </span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F4]">
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

        <!-- Thống kê tháng (hiển thị từ API hoặc placeholder) -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Tháng {{ currentMonth }}</div>
            <div class="text-xs text-gray-400 mt-0.5">Tổng kết chấm công</div>
          </div>
          <div class="p-5 space-y-3">
            <div v-for="stat in monthStats" :key="stat.label"
              class="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F4]">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg" :style="{ background: stat.bg }">
                  {{ stat.icon }}
                </div>
                <span class="text-sm font-semibold text-gray-600">{{ stat.label }}</span>
              </div>
              <span class="font-black text-[#1E2A3B]" :class="stat.valueClass">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <!-- Hướng dẫn nhanh -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Hướng dẫn chấm công</div>
          </div>
          <div class="p-5 space-y-3 text-sm text-gray-600">
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-[#FFF0EC] flex items-center justify-center shrink-0 text-[#E8634A] font-black text-xs">1</div>
              <p>Chọn ca làm việc hôm nay (nếu có nhiều ca).</p>
            </div>
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-[#FFF0EC] flex items-center justify-center shrink-0 text-[#E8634A] font-black text-xs">2</div>
              <p>Nhấn <strong class="text-[#E8634A]">Check-in mở ca</strong> khi bắt đầu làm việc.</p>
            </div>
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-[#FFF0EC] flex items-center justify-center shrink-0 text-[#E8634A] font-black text-xs">3</div>
              <p>Nhấn <strong class="text-[#1E2A3B]">Check-out đóng ca</strong> khi kết thúc làm việc.</p>
            </div>
            <div class="flex gap-3">
              <div class="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0 text-yellow-600 font-black text-xs">⚠</div>
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
        :class="toastType === 'success' ? 'bg-[#E8634A]' : toastType === 'warn' ? 'bg-yellow-500' : 'bg-red-500'">
        <iconify-icon :icon="toastType === 'success' ? 'ph:check-circle-duotone' : toastType === 'warn' ? 'ph:warning-duotone' : 'ph:x-circle-duotone'" class="text-xl shrink-0"></iconify-icon>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// ─── ĐỒNG HỒ ────────────────────────────────────────────────────────────────
const currentTime = ref('')
let timerInterval = null

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
onMounted(() => { updateTime(); timerInterval = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timerInterval))

const todayStr     = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const currentMonth = new Date().getMonth() + 1
const todayDate    = new Date().toISOString().split('T')[0] // yyyy-mm-dd

// ─── STATE ──────────────────────────────────────────────────────────────────
const pageLoading   = ref(false)
const actionLoading = ref(false)
const todayShifts   = ref([])    // Danh sách PhanCa hôm nay của nhân viên
const chamCongMap   = ref({})    // phanCaId → ChamCongResponse
const selectedShift = ref(null)

// Toast
const toastMsg  = ref('')
const toastType = ref('success')
function showToast(msg, type = 'success') {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

// ─── LOAD CA HÔM NAY ────────────────────────────────────────────────────────
// BE: GET /api/v1/admin/attendances  → admin only
// Nhân viên cần: lấy phanCa của mình theo ngày
// → Không có API riêng cho nhân viên lấy danh sách phân ca
//   → Dùng trick: POST /api/v1/staff/checkin với phanCaId sẽ báo lỗi nếu sai id
//   → Tuy nhiên BE có PhanCaRepository.findByNhanVienIdAndNgayLamViec
//   → Nhưng chưa có API expose ra ngoài
//
// Giải pháp thực tế nhất với BE hiện tại:
// Admin lấy được danh sách toàn bộ chấm công: GET /api/v1/admin/attendances
// Nhân viên tự nhập phanCaId (ID phân ca quản lý đã cấp) → check-in
//
// → FE sẽ: Cho nhân viên nhập phanCaId HOẶC Admin đã cấp sẵn
//   Sau check-in thành công, lưu lại để cho checkout
//
// NOTE: Đây là giới hạn của BE hiện tại (chưa có API lấy danh sách ca của nhân viên)
// TODO: BE cần thêm GET /api/v1/staff/my-schedules?date=today

async function loadTodayShifts() {
  // Vì BE chưa có API lấy lịch nhân viên, ta dùng localStorage để nhớ phanCaId
  // Sau khi check-in thành công, lưu chamCong vào local để tiếp tục checkout
  pageLoading.value = true
  try {
    // Nếu đã có dữ liệu cached trong session
    const cached = sessionStorage.getItem('pos_cham_cong_today')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.date === todayDate) {
        // Còn đúng ngày hôm nay
        todayShifts.value = parsed.shifts || []
        chamCongMap.value = parsed.chamCongMap || {}
        if (todayShifts.value.length > 0 && !selectedShift.value) {
          selectedShift.value = todayShifts.value[0]
        }
        return
      }
    }
    // Chưa có → khởi tạo trống, chờ nhân viên nhập phanCaId thủ công
    todayShifts.value = []
    chamCongMap.value = {}
  } finally {
    pageLoading.value = false
  }
}

function saveToSession() {
  sessionStorage.setItem('pos_cham_cong_today', JSON.stringify({
    date: todayDate,
    shifts: todayShifts.value,
    chamCongMap: chamCongMap.value
  }))
}

// ─── CA ĐANG ĐƯỢC CHỌN ──────────────────────────────────────────────────────
const activeChamCong = computed(() => {
  if (!selectedShift.value) return null
  return chamCongMap.value[selectedShift.value.id] || null
})

const shiftStatusBadge = computed(() => {
  if (!selectedShift.value) return { label: '', cls: '' }
  const cc = activeChamCong.value
  if (!cc) return { label: 'Chưa check-in', cls: 'bg-gray-100 text-gray-500' }
  if (cc.gioRa)  return { label: 'Đã đóng ca', cls: 'bg-gray-100 text-gray-600' }
  return { label: 'Đang làm việc', cls: 'bg-green-50 text-green-600' }
})

// ─── TÍNH GIỜ LÀM VIỆC ──────────────────────────────────────────────────────
const workDuration = computed(() => {
  const cc = activeChamCong.value
  if (!cc?.gioVao) return '0 phút'
  const start = new Date(cc.gioVao)
  const end   = cc.gioRa ? new Date(cc.gioRa) : new Date()
  const mins  = Math.floor((end - start) / 60000)
  if (mins < 60) return `${mins} phút`
  return `${Math.floor(mins / 60)} giờ ${mins % 60} phút`
})

// ─── HELPER: lấy chamCong của 1 phanCa ──────────────────────────────────────
function getChamCong(shift) {
  return chamCongMap.value[shift.id] || null
}

// ─── CHECK-IN ────────────────────────────────────────────────────────────────
// POST /api/v1/staff/checkin  body: { phanCaId }
async function handleCheckIn() {
  if (!selectedShift.value || activeChamCong.value || actionLoading.value) return
  actionLoading.value = true
  try {
    const res = await apiClient.post('/api/v1/staff/checkin', {
      phanCaId: selectedShift.value.id
    })
    const data = res.data  // ChamCongResponse
    chamCongMap.value = { ...chamCongMap.value, [selectedShift.value.id]: data }
    saveToSession()

    const msg = data.phutDiTre > 0
      ? `Check-in lúc ${formatDateTime(data.gioVao)} — Trễ ${data.phutDiTre} phút!`
      : `Check-in thành công lúc ${formatDateTime(data.gioVao)} — Đúng giờ! 🎉`
    showToast(msg, data.phutDiTre > 0 ? 'warn' : 'success')

  } catch (err) {
    const msg = err.response?.data || err.message || 'Check-in thất bại!'
    showToast(typeof msg === 'string' ? msg : 'Check-in thất bại!', 'error')
  } finally {
    actionLoading.value = false
  }
}

// ─── CHECK-OUT ───────────────────────────────────────────────────────────────
// POST /api/v1/staff/checkout/{phanCaId}
async function handleCheckOut() {
  if (!activeChamCong.value || activeChamCong.value.gioRa || actionLoading.value) return
  actionLoading.value = true
  try {
    const res = await apiClient.post(`/api/v1/staff/checkout/${selectedShift.value.id}`)
    const data = res.data  // ChamCongResponse
    chamCongMap.value = { ...chamCongMap.value, [selectedShift.value.id]: data }
    saveToSession()

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
  if (!cc)         return { label: 'Chưa vào', cls: 'bg-gray-100 text-gray-500' }
  if (cc.gioRa)    return { label: 'Đã đóng ca', cls: 'bg-blue-50 text-blue-600' }
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
  // t có thể là "07:00:00" hoặc [7, 0, 0]
  if (Array.isArray(t)) return `${String(t[0]).padStart(2,'0')}:${String(t[1]).padStart(2,'0')}`
  return String(t).slice(0, 5)
}

function formatDateTime(dt) {
  if (!dt) return '--:--'
  return new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

// ─── THỐNG KÊ THÁNG (placeholder — BE chưa có API riêng) ────────────────────
const monthStats = [
  { icon: '✅', label: 'Ca đã làm hôm nay', value: computed(() => Object.values(chamCongMap.value).filter(c => c.gioRa).length + ' ca').value, bg: '#F0FDF4', valueClass: 'text-green-600' },
  { icon: '⏰', label: 'Phút đi trễ hôm nay', value: computed(() => {
    const total = Object.values(chamCongMap.value).reduce((s, c) => s + (c.phutDiTre || 0), 0)
    return total > 0 ? `${total} phút` : 'Không có'
  }).value, bg: '#FFFBEB', valueClass: 'text-yellow-500' },
  { icon: '⏱️', label: 'Thời gian làm hôm nay', value: computed(() => workDuration.value).value, bg: '#EFF6FF', valueClass: 'text-blue-600' },
]

// ─── KHỞI TẠO ────────────────────────────────────────────────────────────────
// Vì BE chưa có API lấy danh sách ca theo nhân viên, ta cần nhân viên tự thêm phanCaId
// Hiển thị form nhập phanCaId nếu chưa có ca nào
const manualPhanCaId = ref('')
const addingShift    = ref(false)

async function addShiftById() {
  const id = Number(manualPhanCaId.value)
  if (!id) return
  // Kiểm tra đã có chưa
  if (todayShifts.value.find(s => s.id === id)) {
    showToast('Ca này đã có trong danh sách rồi!', 'warn')
    return
  }

  // Thử check-in để xem BE có nhận không
  // Hoặc đơn giản hơn: tạo mock shift entry để UI hiển thị
  // Thực tế cần thêm API: GET /api/v1/staff/schedules/today
  // Tạm thời: lưu phanCaId vào danh sách, khi check-in BE sẽ validate
  addingShift.value = true
  try {
    // Tạo placeholder shift — tên ca sẽ lấy từ response check-in
    const placeholderShift = {
      id,
      caLamViec: { tenCa: `Ca #${id}`, gioBatDau: '00:00', gioKetThuc: '23:59' },
      ngayLamViec: todayDate,
      trangThai: 'DA_LAP',
      ghiChu: null
    }
    todayShifts.value = [...todayShifts.value, placeholderShift]
    selectedShift.value = placeholderShift
    manualPhanCaId.value = ''
    saveToSession()
    showToast(`Đã thêm ca ID ${id}. Nhấn Check-in để xác nhận.`, 'success')
  } finally {
    addingShift.value = false
  }
}

function removeShift(shift) {
  todayShifts.value = todayShifts.value.filter(s => s.id !== shift.id)
  if (selectedShift.value?.id === shift.id) selectedShift.value = todayShifts.value[0] || null
  saveToSession()
}

onMounted(() => loadTodayShifts())
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>