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
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:users-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng nhân viên</p>
          <p class="text-xl font-bold text-slate-800">24</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:money-wavy-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng quỹ lương</p>
          <p class="text-xl font-bold text-slate-800">142.5M</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:clock-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng giờ làm</p>
          <p class="text-xl font-bold text-slate-800">3,450h</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:check-circle-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Đã thanh toán</p>
          <p class="text-xl font-bold text-slate-800">18/24</p>
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
        <div class="flex gap-2">
           <el-select v-model="statusFilter" placeholder="Trạng thái" class="w-[150px]">
             <el-option label="Tất cả" value="" />
             <el-option label="Đã thanh toán" value="paid" />
             <el-option label="Chờ thanh toán" value="pending" />
           </el-select>
        </div>
      </div>
      <el-table :data="filteredPayrollData" style="width: 100%" class="custom-table" header-cell-class-name="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
        <el-table-column prop="empId" label="Mã NV" width="100" />
        <el-table-column label="Nhân viên" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar :size="36" :src="row.avatar" />
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ row.name }}</p>
                <p class="text-xs text-slate-500">{{ row.role }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Lương CB" min-width="120" align="right">
          <template #default="{ row }">
            <span class="text-sm">{{ formatCurrency(row.baseSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hours" label="Giờ làm" width="90" align="center">
          <template #default="{ row }">
            <span class="text-sm font-medium">{{ row.hours }}h</span>
          </template>
        </el-table-column>
        <el-table-column label="Thưởng" min-width="120" align="right">
          <template #default="{ row }">
            <span class="text-sm text-green-600">+{{ formatCurrency(row.bonus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Khấu trừ" min-width="120" align="right">
          <template #default="{ row }">
            <span class="text-sm text-red-500">-{{ formatCurrency(row.deduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tổng nhận" min-width="140" align="right">
          <template #default="{ row }">
            <span class="text-base font-bold text-cake-600">{{ formatCurrency(row.total) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="140" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'paid' ? 'success' : 'warning'"
              effect="light"
              class="rounded-full px-3"
            >
              {{ row.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán' }}
            </el-tag>
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
      <div class="p-4 border-t border-slate-100 flex justify-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :page-size="10"
        />
      </div>
    </el-card>

    <!-- Modal Chi tiết phiếu lương -->
    <el-dialog v-model="detailVisible" title="Chi tiết phiếu lương" width="500px" class="rounded-[24px]">
      <div v-if="selectedRow" class="space-y-4">
        <div class="flex items-center gap-4 pb-4 border-b border-slate-100">
           <el-avatar :size="50" :src="selectedRow.avatar" />
           <div>
             <h3 class="text-lg font-bold text-slate-800">{{ selectedRow.name }}</h3>
             <p class="text-sm text-slate-500">{{ selectedRow.role }} • {{ selectedRow.empId }}</p>
           </div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-500">Lương cơ bản</span><span class="font-medium">{{ formatCurrency(selectedRow.baseSalary) }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Số giờ làm việc</span><span class="font-medium">{{ selectedRow.hours }}h</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Thưởng (KPI, OT)</span><span class="font-medium text-green-600">+{{ formatCurrency(selectedRow.bonus) }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Khấu trừ (Đi trễ, Bảo hiểm)</span><span class="font-medium text-red-500">-{{ formatCurrency(selectedRow.deduction) }}</span></div>
        </div>
        <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span class="font-bold text-slate-800">Thực lãnh</span>
          <span class="text-2xl font-bold text-cake-600">{{ formatCurrency(selectedRow.total) }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false" class="rounded-xl">Đóng</el-button>
          <el-button type="primary" class="rounded-xl bg-cake-500 border-none" @click="printPayslip">In phiếu lương</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const monthFilter = ref('2024-05')
const searchQuery = ref('')
const statusFilter = ref('')
const detailVisible = ref(false)
const selectedRow = ref(null)

const mockPayrollData = [
  { id: 1, empId: 'NV001', name: 'Nguyễn Văn A', role: 'Thợ làm bánh', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', baseSalary: 8000000, hours: 208, bonus: 500000, deduction: 0, status: 'paid' },
  { id: 2, empId: 'NV002', name: 'Trần Thị B', role: 'Thu ngân', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', baseSalary: 6000000, hours: 190, bonus: 200000, deduction: 50000, status: 'paid' },
  { id: 3, empId: 'NV003', name: 'Lê Văn C', role: 'Shipper', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', baseSalary: 5000000, hours: 220, bonus: 1500000, deduction: 0, status: 'pending' },
  { id: 4, empId: 'NV004', name: 'Phạm Thị D', role: 'Quản lý cửa hàng', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', baseSalary: 12000000, hours: 208, bonus: 2000000, deduction: 0, status: 'paid' },
  { id: 5, empId: 'NV005', name: 'Hoàng Văn E', role: 'Thợ phụ', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', baseSalary: 5000000, hours: 160, bonus: 0, deduction: 200000, status: 'pending' },
].map(item => ({ ...item, total: item.baseSalary + item.bonus - item.deduction }))

const filteredPayrollData = computed(() => {
  return mockPayrollData.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value ? item.status === statusFilter.value : true
    return matchName && matchStatus
  })
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const exportExcel = () => {
  ElMessage.success('Đã xuất file bảng lương tháng ' + monthFilter.value)
}

const viewDetail = (row) => {
  selectedRow.value = row
  detailVisible.value = true
}

const printPayslip = () => {
  ElMessage.success(`Đang in phiếu lương cho ${selectedRow.value.name}`)
  detailVisible.value = false
}
</script>

<style scoped>
.custom-table :deep(th.el-table__cell) {
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
</style>
