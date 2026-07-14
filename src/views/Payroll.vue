<template>
  <div class="payroll-page">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Nhân sự</p>
        <h1 class="text-3xl font-semibold text-slate-900">Quản lý lương thưởng</h1>
        <p class="mt-2 text-sm text-slate-500">Theo dõi bảng lương, tính công và phụ cấp cho nhân viên cửa hàng.</p>
      </div>
      <div class="flex items-center gap-3">
        <el-date-picker
          v-model="monthFilter"
          type="month"
          placeholder="Chọn tháng"
          format="MM/YYYY"
          value-format="YYYY-MM"
          class="w-[180px]"
        />
        <el-button
          type="primary"
          class="rounded-xl bg-gradient-to-r from-cake-500 to-orange-500 shadow-sm shadow-cake-200"
          @click="exportExcel"
        >
          <iconify-icon icon="ph:file-xls-duotone" class="mr-2 text-lg" />
          Xuất Excel
        </el-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:users-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng nhân viên</p>
          <p class="text-xl font-bold text-slate-800">{{ payrollData.length }}</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:money-wavy-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng quỹ lương</p>
          <p class="text-xl font-bold text-slate-800">{{ formatCurrency(tongQuyLuong) }}</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:clock-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng giờ làm</p>
          <p class="text-xl font-bold text-slate-800">{{ tongGioLam }}h</p>
        </div>
      </div>
    </div>

    <!-- Payroll Table -->
    <el-card class="rounded-[24px] border border-slate-200 shadow-sm" body-class="p-0">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <el-input
          v-model="searchQuery"
          placeholder="Tìm tên nhân viên..."
          class="w-[250px]"
          clearable
        >
          <template #prefix>
            <iconify-icon icon="ph:magnifying-glass" class="text-slate-400" />
          </template>
        </el-input>
      </div>
      <el-table :data="filteredPayrollData" v-loading="loading" style="width: 100%" class="custom-table" header-cell-class-name="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
        <el-table-column prop="nhanVienId" label="Mã NV" width="100" />
        <el-table-column label="Nhân viên" min-width="180">
          <template #default="{ row }">
            <p class="text-sm font-semibold text-slate-800">{{ row.tenNhanVien }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Lương CB" min-width="120" align="right">
          <template #default="{ row }">
            <span class="text-sm">{{ formatCurrency(row.luongCoBan) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Giờ làm" width="90" align="center">
          <template #default="{ row }">
            <span class="text-sm font-medium">{{ row.tongGioLam }}h</span>
          </template>
        </el-table-column>
        <el-table-column label="Phút trễ" width="100" align="center">
          <template #default="{ row }">
            <span class="text-sm" :class="row.tongPhutTre > 0 ? 'text-amber-500 font-medium' : 'text-slate-400'">{{ row.tongPhutTre }}p</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiền phạt" min-width="120" align="right">
          <template #default="{ row }">
            <span class="text-sm text-red-500">-{{ formatCurrency(row.tienPhat) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thực lãnh" min-width="140" align="right">
          <template #default="{ row }">
            <span class="text-base font-bold text-cake-600">{{ formatCurrency(row.luongThucLanh) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row)">
              Chi tiết
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!loading && payrollData.length === 0" class="p-8 text-center text-sm text-slate-400">
        Chưa có dữ liệu chấm công cho tháng đã chọn.
      </div>
    </el-card>

    <!-- Modal Chi tiết phiếu lương -->
    <el-dialog v-model="detailVisible" title="Chi tiết phiếu lương" width="500px" class="rounded-[24px]">
      <div v-if="selectedRow" class="space-y-4">
        <div class="pb-4 border-b border-slate-100">
           <h3 class="text-lg font-bold text-slate-800">{{ selectedRow.tenNhanVien }}</h3>
           <p class="text-sm text-slate-500">Mã NV: {{ selectedRow.nhanVienId }}</p>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-500">Lương cơ bản</span><span class="font-medium">{{ formatCurrency(selectedRow.luongCoBan) }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Tổng giờ làm việc</span><span class="font-medium">{{ selectedRow.tongGioLam }}h</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Tổng phút đi trễ</span><span class="font-medium">{{ selectedRow.tongPhutTre }} phút</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Tiền phạt đi trễ</span><span class="font-medium text-red-500">-{{ formatCurrency(selectedRow.tienPhat) }}</span></div>
        </div>
        <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span class="font-bold text-slate-800">Thực lãnh</span>
          <span class="text-2xl font-bold text-cake-600">{{ formatCurrency(selectedRow.luongThucLanh) }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false" class="rounded-xl">Đóng</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import apiClient from '@/services/apiService'

const monthFilter = ref(new Date().toISOString().slice(0, 7)) // 'YYYY-MM'
const searchQuery = ref('')
const detailVisible = ref(false)
const selectedRow = ref(null)
const loading = ref(false)
const payrollData = ref([])

const filteredPayrollData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return payrollData.value.filter(item => (item.tenNhanVien || '').toLowerCase().includes(q))
})

const tongQuyLuong = computed(() => payrollData.value.reduce((s, r) => s + (r.luongThucLanh || 0), 0))
const tongGioLam = computed(() => payrollData.value.reduce((s, r) => s + (r.tongGioLam || 0), 0))

async function fetchPayroll() {
  const [namStr, thangStr] = monthFilter.value.split('-')
  loading.value = true
  try {
    const { data } = await apiClient.get('/api/reports/luong', {
      params: { thang: Number(thangStr), nam: Number(namStr) }
    })
    payrollData.value = data || []
  } catch (err) {
    payrollData.value = []
    ElMessage.error('Không thể tải bảng lương tháng này!')
  } finally {
    loading.value = false
  }
}

watch(monthFilter, fetchPayroll)
onMounted(fetchPayroll)

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0)
}

const exportExcel = async () => {
  const [namStr, thangStr] = monthFilter.value.split('-')
  try {
    const response = await apiClient.get('/api/reports/luong/export-excel', {
      params: { thang: Number(thangStr), nam: Number(namStr) },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `BangLuong_T${thangStr}_${namStr}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    ElMessage.success('Đã xuất file bảng lương tháng ' + monthFilter.value)
  } catch {
    ElMessage.error('Xuất file thất bại!')
  }
}

const viewDetail = (row) => {
  selectedRow.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.custom-table :deep(th.el-table__cell) {
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
</style>
