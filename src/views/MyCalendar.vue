<template>
  <div>
    <!-- ===== HEADER ===== -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="font-display font-black text-2xl text-[#5C4428]">Lịch làm việc của tôi</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ periodLabel }}</p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Toggle Tuần / Tháng -->
        <div class="flex bg-[#FDF8F2] rounded-xl p-1 border border-[#EDE0CC]">
          <button v-for="m in viewModes" :key="m.key"
            @click="viewMode = m.key"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            :class="viewMode === m.key ? 'bg-[#7A5C3A] text-white shadow-md' : 'text-[#7A5C3A] hover:bg-[#EDE0CC]/50'">
            {{ m.label }}
          </button>
        </div>

        <!-- Điều hướng -->
        <div class="flex items-center gap-1 bg-white rounded-xl border border-[#EDE0CC] shadow-sm p-1">
          <button @click="goPrev" class="w-9 h-9 rounded-lg flex items-center justify-center text-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors">
            <iconify-icon icon="ph:caret-left-bold" class="text-lg"></iconify-icon>
          </button>
          <button @click="goToday" class="px-3 py-2 rounded-lg text-sm font-bold text-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors">
            Hôm nay
          </button>
          <button @click="goNext" class="w-9 h-9 rounded-lg flex items-center justify-center text-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors">
            <iconify-icon icon="ph:caret-right-bold" class="text-lg"></iconify-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== THỐNG KÊ NHANH ===== -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div v-for="s in periodStats" :key="s.label"
        class="rounded-2xl p-4 border border-[#EDE0CC] shadow-sm" :style="{ background: s.bg }">
        <div class="flex items-center gap-2 mb-1.5">
          <iconify-icon :icon="s.icon" class="text-lg" :style="{ color: s.color }"></iconify-icon>
          <span class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ s.label }}</span>
        </div>
        <div class="text-xl font-black" :style="{ color: s.color }">{{ s.value }}</div>
      </div>
    </div>

    <!-- ===== LEGEND MÀU CA ===== -->
    <div class="flex items-center flex-wrap gap-3 mb-5 bg-white rounded-2xl border border-[#EDE0CC] shadow-sm px-4 py-3">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-wide mr-1">Chú thích:</span>
      <div v-for="ca in caTypeList" :key="ca.key" class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: ca.color }"></span>
        <span class="text-xs font-semibold text-[#5C4428]">{{ ca.label }}</span>
        <span class="text-[11px] text-gray-400">({{ ca.time }})</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-gray-300 bg-white"></span>
        <span class="text-xs font-semibold text-gray-400">Chưa phân ca</span>
      </div>
    </div>

    <!-- ===== VIEW: TUẦN ===== -->
    <div v-if="viewMode === 'tuan'" class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm overflow-hidden">
      <div class="grid grid-cols-7 divide-x divide-[#F1E7D8]">
        <div v-for="day in weekDays" :key="day.iso"
          class="min-h-[220px] flex flex-col cursor-pointer transition-colors hover:bg-[#FFFBF5]"
          @click="openDayDetail(day)">
          <div class="px-3 py-3 border-b border-[#F1E7D8] text-center sticky top-0 bg-white z-10"
            :class="day.isToday ? 'bg-[#FDF6EC]' : ''">
            <div class="text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ day.weekdayLabel }}</div>
            <div class="text-lg font-black mt-0.5"
              :class="day.isToday ? 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#7A5C3A] text-white' : 'text-[#5C4428]'">
              {{ day.dateNum }}
            </div>
          </div>
          <div class="flex-1 p-2 flex flex-col gap-1.5">
            <div v-if="day.shifts.length === 0" class="flex-1 flex items-center justify-center">
              <span class="text-[11px] text-gray-300 font-semibold">Nghỉ</span>
            </div>
            <div v-for="s in day.shifts" :key="s.key"
              class="rounded-xl px-2.5 py-2 text-left"
              :style="{ background: s.bg }">
              <div class="text-[12px] font-bold" :style="{ color: s.text }">{{ s.label }}</div>
              <div class="text-[10.5px] font-semibold opacity-80" :style="{ color: s.text }">{{ s.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== VIEW: THÁNG ===== -->
    <div v-else class="bg-white rounded-2xl border border-[#EDE0CC] shadow-sm overflow-hidden">
      <div class="grid grid-cols-7 border-b border-[#F1E7D8]">
        <div v-for="w in weekdayHeaders" :key="w"
          class="py-3 text-center text-[11px] font-bold uppercase tracking-wide text-gray-400">
          {{ w }}
        </div>
      </div>
      <div class="grid grid-cols-7">
        <div v-for="(day, idx) in monthDays" :key="idx"
          class="min-h-[104px] p-2 border-b border-r border-[#F1E7D8] flex flex-col gap-1 cursor-pointer transition-colors hover:bg-[#FFFBF5]"
          :class="[idx % 7 === 6 ? 'border-r-0' : '', !day.inCurrentMonth ? 'bg-[#FCFAF7]' : '']"
          @click="day.inCurrentMonth && openDayDetail(day)">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold"
              :class="!day.inCurrentMonth ? 'text-gray-300' : day.isToday ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7A5C3A] text-white text-xs' : 'text-[#5C4428]'">
              {{ day.dateNum }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <div v-for="s in day.shifts.slice(0, 2)" :key="s.key"
              class="rounded-md px-1.5 py-1 text-[10px] font-bold truncate"
              :style="{ background: s.bg, color: s.text }">
              {{ s.label }}
            </div>
            <div v-if="day.shifts.length > 2" class="text-[10px] font-bold text-[#9A7650] pl-1">
              +{{ day.shifts.length - 2 }} ca khác
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL CHI TIẾT NGÀY ===== -->
    <Transition name="fade">
      <div v-if="selectedDay" class="fixed inset-0 z-50 flex items-center justify-center px-4" @click.self="selectedDay = null">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-pop">
          <div class="px-6 py-5 border-b border-[#EDE0CC] flex items-center justify-between"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">
            <div>
              <div class="text-white/70 text-xs font-semibold uppercase tracking-wide">{{ selectedDay.weekdayFullLabel }}</div>
              <div class="text-white text-xl font-black">{{ selectedDay.fullDateLabel }}</div>
            </div>
            <button @click="selectedDay = null" class="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
              <iconify-icon icon="ph:x-bold" class="text-base"></iconify-icon>
            </button>
          </div>

          <div class="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            <div v-if="selectedDay.shifts.length === 0" class="text-center py-8">
              <iconify-icon icon="ph:coffee-duotone" class="text-5xl text-gray-300 mb-2"></iconify-icon>
              <p class="text-sm font-semibold text-gray-400">Bạn không có ca làm việc trong ngày này.</p>
            </div>

            <div v-for="s in selectedDay.shifts" :key="s.key"
              class="rounded-2xl border p-4 flex items-start gap-3"
              :style="{ background: s.bg, borderColor: s.color + '55' }">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ background: s.color }">
                <iconify-icon icon="ph:clock-duotone" class="text-lg text-white"></iconify-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-black" :style="{ color: s.text }">{{ s.label }}</p>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70" :style="{ color: s.text }">
                    {{ s.trangThai }}
                  </span>
                </div>
                <p class="text-xs font-semibold mt-0.5" :style="{ color: s.text }">{{ s.time }}</p>
                <p v-if="s.ghiChu" class="text-xs mt-1.5 opacity-80" :style="{ color: s.text }">
                  <iconify-icon icon="ph:note-duotone" class="mr-1"></iconify-icon>{{ s.ghiChu }}
                </p>
              </div>
            </div>
          </div>

          <div class="px-6 pb-6">
            <button @click="selectedDay = null"
              class="w-full py-3 rounded-2xl text-sm font-bold border border-[#EDE0CC] text-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
// import { staffService } from '@/services/StaffService' // TODO: bật lại khi nối API thật (getMySchedulesInRange)

// ─── Loại ca & màu sắc phân biệt ─────────────────────────────────────────────
const CA_TYPES = {
  SANG:  { key: 'SANG',  label: 'Ca Sáng',  time: '06:00 - 12:00', color: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
  CHIEU: { key: 'CHIEU', label: 'Ca Chiều', time: '12:00 - 18:00', color: '#3B82F6', bg: '#DBEAFE', text: '#1E40AF' },
  TOI:   { key: 'TOI',   label: 'Ca Tối',   time: '18:00 - 22:00', color: '#8B5CF6', bg: '#EDE9FE', text: '#5B21B6' },
}
const caTypeList = Object.values(CA_TYPES)

const weekdayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const weekdayFullNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

// ─── Trạng thái điều khiển ────────────────────────────────────────────────────
const viewModes = [
  { key: 'tuan', label: 'Tuần' },
  { key: 'thang', label: 'Tháng' },
]
const viewMode = ref('tuan')
const refDate = ref(new Date())
const selectedDay = ref(null)

function goPrev() {
  const d = new Date(refDate.value)
  if (viewMode.value === 'tuan') d.setDate(d.getDate() - 7)
  else d.setMonth(d.getMonth() - 1)
  refDate.value = d
}
function goNext() {
  const d = new Date(refDate.value)
  if (viewMode.value === 'tuan') d.setDate(d.getDate() + 7)
  else d.setMonth(d.getMonth() + 1)
  refDate.value = d
}
function goToday() {
  refDate.value = new Date()
}

// ─── Sinh dữ liệu lịch ca giả lập (tĩnh, seed theo ngày để không đổi khi re-render) ─
const scheduleCache = reactive({})

function isoOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Seed đơn giản dựa trên ngày để lịch cố định, không nhảy lung tung mỗi lần render
function seededPattern(dateObj) {
  const seed = dateObj.getFullYear() * 372 + (dateObj.getMonth() + 1) * 31 + dateObj.getDate()
  return seed % 6 // 0..5
}

function buildShiftsForDate(dateObj) {
  const iso = isoOf(dateObj)
  if (scheduleCache[iso]) return scheduleCache[iso]

  const dow = dateObj.getDay() // 0 = CN
  const pattern = seededPattern(dateObj)
  let list = []

  if (dow === 1) {
    // Thứ Hai: nghỉ định kỳ
    list = []
  } else if (pattern === 0) {
    list = [CA_TYPES.SANG]
  } else if (pattern === 1) {
    list = [CA_TYPES.CHIEU]
  } else if (pattern === 2) {
    list = [CA_TYPES.TOI]
  } else if (pattern === 3) {
    list = [CA_TYPES.SANG, CA_TYPES.CHIEU]
  } else if (pattern === 4) {
    list = [CA_TYPES.CHIEU, CA_TYPES.TOI]
  } else {
    list = []
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cmp = new Date(dateObj); cmp.setHours(0, 0, 0, 0)

  const shifts = list.map((ca, i) => ({
    ...ca,
    key: `${iso}-${ca.key}`,
    trangThai: cmp < today ? 'Đã hoàn thành' : (cmp.getTime() === today.getTime() ? 'Hôm nay' : 'Sắp tới'),
    ghiChu: i === 0 && pattern === 3 ? 'Hỗ trợ chuẩn bị đơn sự kiện buổi sáng.' : '',
  }))

  scheduleCache[iso] = shifts
  return shifts
}

// ─── Tuần hiện tại ────────────────────────────────────────────────────────────
function startOfWeek(d) {
  const date = new Date(d)
  const day = date.getDay() // 0 CN .. 6 T7
  const diff = (day === 0 ? -6 : 1) - day // đưa về Thứ Hai
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

const weekDays = computed(() => {
  const start = startOfWeek(refDate.value)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({
      iso: isoOf(d),
      date: d,
      dateNum: d.getDate(),
      weekdayLabel: weekdayHeaders[i],
      weekdayFullLabel: weekdayFullNames[d.getDay()],
      fullDateLabel: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      isToday: d.getTime() === today.getTime(),
      shifts: buildShiftsForDate(d),
    })
  }
  return days
})

// ─── Tháng hiện tại (lưới 6 tuần) ─────────────────────────────────────────────
const monthDays = computed(() => {
  const year = refDate.value.getFullYear()
  const month = refDate.value.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const gridStart = startOfWeek(firstOfMonth)
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    days.push({
      iso: isoOf(d),
      date: d,
      dateNum: d.getDate(),
      inCurrentMonth: d.getMonth() === month,
      weekdayFullLabel: weekdayFullNames[d.getDay()],
      fullDateLabel: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      isToday: d.getTime() === today.getTime(),
      shifts: buildShiftsForDate(d),
    })
  }
  return days
})

function openDayDetail(day) {
  selectedDay.value = day
}

// ─── Nhãn khoảng thời gian đang xem ───────────────────────────────────────────
const periodLabel = computed(() => {
  if (viewMode.value === 'tuan') {
    const days = weekDays.value
    const from = days[0].date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    const to = days[6].date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    return `Tuần từ ${from} đến ${to}`
  }
  return refDate.value.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
})

// ─── Thống kê nhanh theo khoảng đang xem ──────────────────────────────────────
const periodStats = computed(() => {
  const list = viewMode.value === 'tuan'
    ? weekDays.value
    : monthDays.value.filter(d => d.inCurrentMonth)

  const allShifts = list.flatMap(d => d.shifts)
  const totalCa = allShifts.length
  const totalGio = allShifts.reduce((sum, s) => {
    const [hStart] = s.time.split(' - ')
    const [hEnd] = s.time.split(' - ').slice(1)
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
    return sum + (toMin(hEnd) - toMin(hStart)) / 60
  }, 0)
  const ngayNghi = list.filter(d => d.shifts.length === 0).length
  const daHoanThanh = allShifts.filter(s => s.trangThai === 'Đã hoàn thành').length

  return [
    { label: 'Tổng số ca', value: `${totalCa} ca`, icon: 'ph:calendar-check-duotone', color: '#7A5C3A', bg: '#FDF6EC' },
    { label: 'Tổng giờ dự kiến', value: `${totalGio}h`, icon: 'ph:timer-duotone', color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Ca đã hoàn thành', value: `${daHoanThanh} ca`, icon: 'ph:check-circle-duotone', color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Ngày nghỉ', value: `${ngayNghi} ngày`, icon: 'ph:coffee-duotone', color: '#9A7650', bg: '#FFFBF5' },
  ]
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-pop { animation: pop .22s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes pop { from { opacity: 0; transform: scale(.94) translateY(8px); } to { opacity: 1; transform: none; } }
</style>
