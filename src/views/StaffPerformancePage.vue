<template>
  <div>
    <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">Hiệu Suất Nhân Viên</h1>
        <p class="text-sm text-gray-400 mt-0.5">Xếp hạng theo số đơn xử lý và doanh thu mang lại</p>
      </div>
      <div class="flex items-center gap-2">
        <el-date-picker
          v-model="dateRange" type="daterange" size="default"
          range-separator="-" start-placeholder="Từ ngày" end-placeholder="Đến ngày"
          format="DD/MM/YYYY" value-format="YYYY-MM-DD"
          @change="fetchData" style="width:260px"
        />
        <button class="btn-secondary" @click="fetchData" :disabled="loading">
          <iconify-icon :icon="loading ? 'ph:spinner-gap' : 'ph:arrows-clockwise-duotone'"
            :class="loading ? 'animate-spin' : ''" class="text-base mr-1" />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Tổng quan -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Tổng nhân viên</div>
        <div class="text-2xl font-black" style="color:#5C4428">{{ danhSach.length }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Tổng đơn đã xử lý</div>
        <div class="text-2xl font-black text-blue-500">{{ tongDon }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Tổng doanh thu</div>
        <div class="text-2xl font-black text-green-600">{{ formatVND(tongDoanhThu) }}</div>
      </div>
    </div>

    <!-- Bảng xếp hạng -->
    <div class="data-card">
      <el-table :data="danhSach" v-loading="loading" style="width:100%"
        :default-sort="{ prop: 'doanhThu', order: 'descending' }">
        <el-table-column label="#" width="56" align="center">
          <template #default="{ $index }">
            <span class="font-black" :class="$index < 3 ? 'text-amber-500' : 'text-gray-300'">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="NHÂN VIÊN" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                :style="{ background: row.avatarBg, color: row.avatarColor }">
                {{ row.initials }}
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-sm truncate" style="color:#5C4428">{{ row.name }}</div>
                <div class="text-xs text-muted truncate">{{ row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="ordersHandled" label="SỐ ĐƠN" width="110" align="center" sortable />

        <el-table-column prop="doanhThu" label="DOANH THU" width="160" align="right" sortable>
          <template #default="{ row }">
            <span class="font-bold" style="color:#5C4428">{{ formatVND(row.doanhThu) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="HIỆU SUẤT" width="160" align="center">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-progress :percentage="Math.min(row.performance, 100)" :stroke-width="8"
                :color="row.performance >= 80 ? '#22C55E' : row.performance >= 50 ? '#F59E0B' : '#EF4444'"
                style="flex:1" :show-text="false" />
              <span class="text-xs font-bold" style="color:#5C4428">{{ row.performance }}%</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="TRẠNG THÁI" width="110" align="center">
          <template #default="{ row }">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold"
              :class="row.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'">
              {{ row.active ? 'Đang làm' : 'Nghỉ' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/services/apiService'

/**
 * Bảng hiệu suất nhân viên cho Admin: số đơn xử lý + doanh thu mang lại, có thể lọc theo khoảng ngày.
 * Endpoint: GET /api/v1/admin/staff/hieu-suat?tuNgay=YYYY-MM-DD&denNgay=YYYY-MM-DD
 */

const danhSach = ref([])
const loading = ref(false)
const dateRange = ref([])

const tongDon = computed(() => danhSach.value.reduce((s, r) => s + (r.ordersHandled || 0), 0))
const tongDoanhThu = computed(() => danhSach.value.reduce((s, r) => s + (r.doanhThu || 0), 0))

async function fetchData() {
  loading.value = true
  try {
    const params = {}
    if (dateRange.value?.length === 2) {
      params.tuNgay = dateRange.value[0]
      params.denNgay = dateRange.value[1]
    }
    const { data } = await apiClient.get('/api/v1/admin/staff/hieu-suat', { params })
    danhSach.value = (data || []).map(normalize).sort((a, b) => b.doanhThu - a.doanhThu)
  } catch (err) {
    danhSach.value = []
  } finally {
    loading.value = false
  }
}

const PALETTE = [
  { bg: 'linear-gradient(135deg,#7A5C3A,#FBB830)', color: '#FFF' },
  { bg: '#EFF6FF', color: '#3B82F6' },
  { bg: '#F0FDF4', color: '#22C55E' },
  { bg: '#F5F3FF', color: '#7C3AED' },
  { bg: '#FFFBEB', color: '#F59E0B' },
  { bg: '#FFF0F5', color: '#EC4899' },
]
function normalize(s) {
  const name = s.hoTen ?? s.name ?? ''
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(-2).toUpperCase()
  const palette = PALETTE[(s.id ?? 0) % PALETTE.length]
  return {
    id: s.id,
    name,
    email: s.email ?? '',
    active: s.hoatDong ?? s.active ?? true,
    ordersHandled: s.soLuongDonXuLy ?? s.ordersHandled ?? 0,
    doanhThu: s.doanhThu ?? s.doanhThuMangLai ?? 0,
    performance: s.hieuSuat ?? s.performance ?? 0,
    initials,
    avatarBg: palette.bg,
    avatarColor: palette.color,
  }
}

function formatVND(n) {
  if (n == null) return '0đ'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}

onMounted(fetchData)
</script>
