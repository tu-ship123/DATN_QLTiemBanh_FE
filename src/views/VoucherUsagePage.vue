<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <button class="w-9 h-9 rounded-full bg-white border border-[#EDE0CC] flex items-center justify-center hover:bg-[#FFFBF5]" @click="router.back()">
        <iconify-icon icon="ph:arrow-left-bold" class="text-base" style="color:#5C4428" />
      </button>
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">Lịch Sử Sử Dụng Voucher</h1>
        <p class="text-sm text-gray-400 mt-0.5" v-if="voucher">
          Mã <span class="font-mono font-bold" style="color:#7A5C3A">{{ voucher.code }}</span> — {{ voucher.name }}
        </p>
      </div>
    </div>

    <!-- Tổng quan -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5" v-if="voucher">
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Đã sử dụng</div>
        <div class="text-2xl font-black" style="color:#5C4428">{{ danhSachSuDung.length }}/{{ voucher.limit }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Tổng tiền đã giảm</div>
        <div class="text-2xl font-black text-green-600">{{ formatVND(tongTienGiam) }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#EDE0CC] p-5">
        <div class="text-xs text-gray-400 mb-1">Trạng thái</div>
        <div class="text-lg font-black" :class="'text-' + (voucher.statusType === 'success' ? 'green-600' : 'gray-400')">
          {{ voucher.status }}
        </div>
      </div>
    </div>

    <!-- Bảng chi tiết lượt dùng -->
    <div class="data-card">
      <div class="p-4 border-b border-[#EDE0CC]">
        <div class="search-input" style="max-width:300px">
          <el-icon style="color:#B0A8A3"><Search /></el-icon>
          <input v-model="search" type="text" placeholder="Tìm theo tên/email khách hàng..." />
        </div>
      </div>

      <el-table :data="filteredList" v-loading="loading" style="width:100%" max-height="560">
        <el-table-column label="KHÁCH HÀNG" min-width="220">
          <template #default="{ row }">
            <div class="font-semibold text-sm" style="color:#5C4428">{{ row.tenKhachHang }}</div>
            <div class="text-xs text-muted">{{ row.email }}</div>
          </template>
        </el-table-column>

        <el-table-column label="MÃ ĐƠN HÀNG" width="140">
          <template #default="{ row }">
            <span class="font-mono text-sm">#{{ row.maDonHang }}</span>
          </template>
        </el-table-column>

        <el-table-column label="GIÁ TRỊ ĐƠN" width="140" align="right">
          <template #default="{ row }">{{ formatVND(row.giaTriDonHang) }}</template>
        </el-table-column>

        <el-table-column label="SỐ TIỀN GIẢM" width="140" align="right">
          <template #default="{ row }">
            <span class="font-bold text-green-600">-{{ formatVND(row.soTienGiam) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="THỜI GIAN DÙNG" width="180">
          <template #default="{ row }">{{ formatDateTime(row.thoiGianSuDung) }}</template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && filteredList.length === 0" class="p-8 text-center text-sm text-muted">
        Chưa có ai sử dụng mã voucher này.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import apiClient from '@/services/apiService'

/**
 * Trang xem chi tiết lượt sử dụng của 1 voucher: ai đã dùng, dùng cho đơn nào, khi nào.
 * LƯU Ý: endpoint /api/v1/admin/vouchers/{id}/usage là ĐỀ XUẤT — cần Backend xác nhận/tạo mới.
 */

const route = useRoute()
const router = useRouter()
const voucherId = route.params.id

const voucher = ref(null)
const danhSachSuDung = ref([])
const loading = ref(false)
const search = ref('')

const filteredList = computed(() => {
  if (!search.value) return danhSachSuDung.value
  const q = search.value.toLowerCase()
  return danhSachSuDung.value.filter(
    r => r.tenKhachHang?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q)
  )
})

const tongTienGiam = computed(() => danhSachSuDung.value.reduce((s, r) => s + (r.soTienGiam || 0), 0))

async function fetchData() {
  loading.value = true
  try {
    const { data } = await apiClient.get(`/api/v1/admin/vouchers/${voucherId}/usage`)
    voucher.value = data.voucher
    danhSachSuDung.value = data.lichSu || []
  } catch (err) {
    voucher.value = null
    danhSachSuDung.value = []
  } finally {
    loading.value = false
  }
}

function formatVND(n) {
  if (n == null) return '0đ'
  return Number(n).toLocaleString('vi-VN') + 'đ'
}
function formatDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(fetchData)
</script>
