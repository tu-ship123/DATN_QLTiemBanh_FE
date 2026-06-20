<template>
  <div>
    <!-- Page Header -->
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

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">

      <!-- LEFT: Check-in / Check-out -->
      <div class="xl:col-span-2 flex flex-col gap-5">

        <!-- Ca hôm nay -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-[#EDE8E3] flex items-center justify-between">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Ca làm việc hôm nay</div>
            <span class="px-3 py-1 rounded-full text-xs font-bold"
              :class="shift.statusColor">{{ shift.statusLabel }}</span>
          </div>

          <div class="p-6">
            <!-- Shift Info -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3]">
                <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Ca</div>
                <div class="text-lg font-black text-[#1E2A3B]">{{ shift.name }}</div>
              </div>
              <div class="text-center p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3]">
                <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bắt đầu</div>
                <div class="text-lg font-black text-[#1E2A3B]">{{ shift.start }}</div>
              </div>
              <div class="text-center p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3]">
                <div class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Kết thúc</div>
                <div class="text-lg font-black text-[#1E2A3B]">{{ shift.end }}</div>
              </div>
            </div>

            <!-- Check-in / Check-out Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-2xl font-black text-lg transition-all duration-200 border-2"
                :class="checkedIn
                  ? 'bg-green-50 border-green-200 text-green-600 cursor-default'
                  : 'bg-gradient-to-br from-[#E8634A] to-[#F07A5E] border-transparent text-white shadow-lg shadow-[#E8634A]/30 hover:-translate-y-1 hover:shadow-[#E8634A]/50 active:scale-95'"
                :disabled="checkedIn"
                @click="handleCheckIn"
              >
                <iconify-icon :icon="checkedIn ? 'ph:check-circle-duotone' : 'ph:sign-in-duotone'" class="text-4xl"></iconify-icon>
                <span>{{ checkedIn ? `Đã Check-in lúc ${checkInTime}` : 'Check-in' }}</span>
              </button>

              <button
                class="flex-1 flex flex-col items-center justify-center gap-2 py-8 rounded-2xl font-black text-lg transition-all duration-200 border-2"
                :class="!checkedIn || checkedOut
                  ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#1E2A3B] to-[#2D3F56] border-transparent text-white shadow-lg hover:-translate-y-1 active:scale-95'"
                :disabled="!checkedIn || checkedOut"
                @click="handleCheckOut"
              >
                <iconify-icon :icon="checkedOut ? 'ph:check-circle-duotone' : 'ph:sign-out-duotone'" class="text-4xl"></iconify-icon>
                <span>{{ checkedOut ? `Đã Check-out lúc ${checkOutTime}` : 'Check-out' }}</span>
              </button>
            </div>

            <!-- Duration -->
            <div v-if="checkedIn" class="mt-5 p-4 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3] flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm font-semibold text-gray-500">
                <iconify-icon icon="ph:timer-duotone" class="text-[#E8634A] text-xl"></iconify-icon>
                {{ checkedOut ? 'Tổng thời gian làm việc' : 'Đang làm việc' }}
              </div>
              <div class="font-black text-xl text-[#E8634A]">{{ workDuration }}</div>
            </div>
          </div>
        </div>

        <!-- Lịch sử chấm công tuần này -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Lịch sử tuần này</div>
          </div>
          <div class="divide-y divide-[#F5F0ED]">
            <div v-for="log in weekLogs" :key="log.date"
              class="px-6 py-3 flex items-center justify-between hover:bg-[#FFF8F4] transition">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                  :class="log.isToday ? 'bg-[#E8634A] text-white' : 'bg-[#F5F0ED] text-[#1E2A3B]'">
                  {{ log.dayShort }}
                </div>
                <div>
                  <div class="text-sm font-bold text-[#1E2A3B]">{{ log.date }}</div>
                  <div class="text-xs text-gray-400">{{ log.shift }}</div>
                </div>
              </div>
              <div class="flex items-center gap-4 text-sm">
                <div class="text-center hidden sm:block">
                  <div class="text-xs text-gray-400">Vào</div>
                  <div class="font-bold text-[#1E2A3B]">{{ log.checkIn }}</div>
                </div>
                <div class="text-center hidden sm:block">
                  <div class="text-xs text-gray-400">Ra</div>
                  <div class="font-bold text-[#1E2A3B]">{{ log.checkOut }}</div>
                </div>
                <div class="text-center hidden sm:block">
                  <div class="text-xs text-gray-400">Giờ làm</div>
                  <div class="font-bold text-[#1E2A3B]">{{ log.hours }}</div>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="log.badgeClass">
                  {{ log.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Thống kê tháng -->
      <div class="flex flex-col gap-5">

        <!-- Tổng kết tháng -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Tháng {{ currentMonth }}</div>
            <div class="text-xs text-gray-400 mt-0.5">Tổng kết chấm công</div>
          </div>
          <div class="p-5 space-y-4">
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

        <!-- Đồng nghiệp hôm nay -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Đồng nghiệp hôm nay</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ colleagues.length }} người cùng ca</div>
          </div>
          <div class="p-4 space-y-2">
            <div v-for="c in colleagues" :key="c.name"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF8F4] transition">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                :style="{ background: c.color }">
                {{ c.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-[#1E2A3B] truncate">{{ c.name }}</div>
                <div class="text-xs text-gray-400">{{ c.role }}</div>
              </div>
              <span class="w-2 h-2 rounded-full flex-shrink-0" :class="c.online ? 'bg-green-400' : 'bg-gray-300'"></span>
            </div>
          </div>
        </div>

        <!-- Ghi chú ca -->
        <div class="bg-white rounded-2xl border border-[#EDE8E3] shadow-sm">
          <div class="px-6 py-4 border-b border-[#EDE8E3]">
            <div class="font-display font-bold text-base text-[#1E2A3B]">Ghi chú ca làm</div>
          </div>
          <div class="p-4">
            <textarea
              v-model="note"
              rows="4"
              placeholder="Nhập ghi chú cho ca hôm nay..."
              class="w-full text-sm text-[#1E2A3B] bg-[#FFF8F4] border border-[#EDE8E3] rounded-xl p-3 outline-none resize-none focus:border-[#E8634A] focus:ring-2 focus:ring-[#E8634A]/10 transition placeholder-gray-300"
            ></textarea>
            <button class="mt-2 w-full py-2 rounded-xl text-sm font-bold bg-[#FFF0EC] text-[#E8634A] hover:bg-[#E8634A] hover:text-white transition">
              Lưu ghi chú
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Toast thông báo -->
    <Transition name="toast">
      <div v-if="toastMsg"
        class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2"
        :class="toastType === 'in' ? 'bg-[#E8634A]' : 'bg-[#1E2A3B]'">
        <iconify-icon :icon="toastType === 'in' ? 'ph:sign-in-duotone' : 'ph:sign-out-duotone'" class="text-xl"></iconify-icon>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// --- THỜI GIAN THỰC ---
const currentTime = ref('')
const timer = ref(null)

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateTime()
  timer.value = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer.value))

const todayStr = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const currentMonth = new Date().getMonth() + 1

// --- CA LÀM VIỆC ---
const shift = {
  name: 'Ca Sáng',
  start: '07:00',
  end: '15:00',
  statusLabel: 'Đang diễn ra',
  statusColor: 'bg-green-50 text-green-600',
}

// --- CHECK-IN / CHECK-OUT ---
const checkedIn   = ref(false)
const checkedOut  = ref(false)
const checkInTime  = ref('')
const checkOutTime = ref('')
const toastMsg    = ref('')
const toastType   = ref('in')
const note        = ref('')

// Tính thời gian làm việc
const workDuration = computed(() => {
  if (!checkInTime.value) return '0 phút'
  const [inH, inM] = checkInTime.value.split(':').map(Number)
  const now = checkedOut.value
    ? checkOutTime.value.split(':').map(Number)
    : new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).split(':').map(Number)
  const mins = (now[0] - inH) * 60 + (now[1] - inM)
  if (mins < 60) return `${mins} phút`
  return `${Math.floor(mins / 60)} giờ ${mins % 60} phút`
})

function showToast(msg, type) {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

function handleCheckIn() {
  if (checkedIn.value) return
  checkInTime.value = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  checkedIn.value = true
  showToast(`Check-in thành công lúc ${checkInTime.value}`, 'in')
}

function handleCheckOut() {
  if (!checkedIn.value || checkedOut.value) return
  checkOutTime.value = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  checkedOut.value = true
  showToast(`Check-out thành công lúc ${checkOutTime.value}`, 'out')
}

// --- DỮ LIỆU ẢO ---
const weekLogs = [
  { dayShort: 'T2', date: '16/06/2026', shift: 'Ca Sáng', checkIn: '07:02', checkOut: '15:05', hours: '8h03', status: 'Đúng giờ', badgeClass: 'bg-green-50 text-green-600', isToday: false },
  { dayShort: 'T3', date: '17/06/2026', shift: 'Ca Sáng', checkIn: '07:15', checkOut: '15:10', hours: '7h55', status: 'Trễ 15p', badgeClass: 'bg-yellow-50 text-yellow-600', isToday: false },
  { dayShort: 'T4', date: '18/06/2026', shift: 'Ca Chiều', checkIn: '13:00', checkOut: '21:02', hours: '8h02', status: 'Đúng giờ', badgeClass: 'bg-green-50 text-green-600', isToday: false },
  { dayShort: 'T5', date: '19/06/2026', shift: 'Ca Sáng', checkIn: checkedIn.value ? checkInTime.value : '--:--', checkOut: checkedOut.value ? checkOutTime.value : '--:--', hours: checkedIn.value ? workDuration.value : '--', status: checkedIn.value ? 'Đúng giờ' : 'Chưa vào', badgeClass: checkedIn.value ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400', isToday: true },
  { dayShort: 'T6', date: '20/06/2026', shift: 'Ca Sáng', checkIn: '--:--', checkOut: '--:--', hours: '--', status: 'Chưa đến', badgeClass: 'bg-gray-100 text-gray-400', isToday: false },
]

const monthStats = [
  { icon: '✅', label: 'Ngày đi làm', value: '15/22', bg: '#F0FDF4', valueClass: 'text-green-600' },
  { icon: '⏰', label: 'Đi trễ',      value: '2 lần', bg: '#FFFBEB', valueClass: 'text-yellow-500' },
  { icon: '❌', label: 'Vắng mặt',    value: '1 ngày', bg: '#FFF1F2', valueClass: 'text-red-500' },
  { icon: '⏱️', label: 'Tổng giờ làm', value: '118h', bg: '#EFF6FF', valueClass: 'text-blue-600' },
]

const colleagues = [
  { name: 'Trần Thị Hương', role: 'Thu ngân', initials: 'TH', color: '#E8634A', online: true },
  { name: 'Lê Minh Tú',    role: 'Phục vụ',  initials: 'LT', color: '#FBB830', online: true },
  { name: 'Phạm Anh Khoa', role: 'Bếp bánh', initials: 'PK', color: '#3B82F6', online: false },
  { name: 'Bùi Thị Lan',   role: 'Phục vụ',  initials: 'BL', color: '#8B5CF6', online: true },
]
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>