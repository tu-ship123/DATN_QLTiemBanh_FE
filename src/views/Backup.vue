<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Hệ thống</p>
        <h1 class="text-3xl font-semibold text-slate-900">Sao lưu & Phục hồi</h1>
        <p class="mt-2 text-sm text-slate-500">Quản lý các bản sao lưu cơ sở dữ liệu để đảm bảo an toàn thông tin.</p>
      </div>
      <el-button
        type="primary"
        class="rounded-xl bg-gradient-to-r from-cake-500 to-orange-500 px-6 py-3 shadow-sm shadow-cake-200 border-none"
        @click="createBackup"
        :loading="isCreating"
      >
        <iconify-icon icon="ph:database-duotone" class="mr-2 text-lg" />
        Tạo bản sao lưu mới
      </el-button>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:hard-drives-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng số bản sao lưu</p>
          <p class="text-xl font-bold text-slate-800">{{ backups.length }}</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:calendar-check-duotone" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Lần sao lưu gần nhất</p>
          <p class="text-xl font-bold text-slate-800">Hôm nay</p>
        </div>
      </div>
      <div class="rounded-[20px] bg-white p-5 border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-2xl">
          <iconify-icon icon="ph:cloud-check-duotone" />
        </div>
        <div>
           <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Dung lượng sử dụng</p>
           <p class="text-xl font-bold text-slate-800">24.5 MB</p>
        </div>
      </div>
    </div>

    <el-card class="rounded-[28px] border border-slate-200 shadow-sm" body-class="p-0">
      <div class="p-5 border-b border-slate-100">
        <h3 class="font-semibold text-slate-800">Danh sách bản sao lưu</h3>
      </div>
      
      <el-table :data="backups" style="width: 100%" class="custom-table" header-cell-class-name="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
        <el-table-column prop="name" label="Tên file" min-width="250">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <iconify-icon icon="ph:file-sql-duotone" class="text-2xl text-slate-400" />
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ row.name }}</p>
                <p class="text-xs text-slate-500">Người tạo: {{ row.author }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Thời gian tạo" width="180" />
        <el-table-column prop="size" label="Kích thước" width="120" align="right" />
        <el-table-column label="Trạng thái" width="130" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'Thành công' ? 'success' : 'danger'"
              effect="light"
              class="rounded-full px-3"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="220" align="center" fixed="right">
          <template #default="{ row, $index }">
            <div class="flex items-center justify-center gap-2">
              <el-tooltip content="Tải xuống" placement="top">
                <el-button size="small" circle @click="downloadBackup(row)">
                  <iconify-icon icon="ph:download-simple" class="text-slate-600" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="Phục hồi dữ liệu" placement="top">
                <el-button size="small" type="warning" circle @click="restoreBackup(row)">
                  <iconify-icon icon="ph:clock-counter-clockwise" class="text-orange-500" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="Xóa" placement="top">
                <el-button size="small" type="danger" circle @click="deleteBackup($index)">
                  <iconify-icon icon="ph:trash" class="text-red-500" />
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-4 border-t border-slate-100 flex justify-end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="backups.length"
          :page-size="10"
        />
      </div>
    </el-card>

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const isCreating = ref(false)

const backups = ref([
  { name: 'backup_20240520_1430.sql', author: 'Hệ thống tự động', date: '20/05/2024 14:30', size: '12.4 MB', status: 'Thành công' },
  { name: 'backup_20240519_1800.sql', author: 'Super Admin', date: '19/05/2024 18:00', size: '12.1 MB', status: 'Thành công' },
  { name: 'backup_20240518_1430.sql', author: 'Hệ thống tự động', date: '18/05/2024 14:30', size: '11.8 MB', status: 'Thành công' },
  { name: 'backup_20240517_1430.sql', author: 'Hệ thống tự động', date: '17/05/2024 14:30', size: '11.5 MB', status: 'Thành công' },
])

const createBackup = () => {
  isCreating.value = true
  setTimeout(() => {
    backups.value.unshift({
      name: `backup_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_${new Date().toTimeString().slice(0,5).replace(':','')}.sql`,
      author: 'Super Admin',
      date: new Date().toLocaleString('vi-VN'),
      size: '12.5 MB',
      status: 'Thành công'
    })
    isCreating.value = false
    ElMessage.success('Đã tạo bản sao lưu mới thành công')
  }, 1500)
}

const downloadBackup = (row) => {
  ElMessage.success(`Đang tải xuống: ${row.name}`)
}

const restoreBackup = (row) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn phục hồi hệ thống về bản sao lưu <b>${row.name}</b>? Toàn bộ dữ liệu hiện tại sẽ bị ghi đè!`,
    'Cảnh báo phục hồi',
    {
      confirmButtonText: 'Phục hồi ngay',
      cancelButtonText: 'Hủy',
      type: 'warning',
      dangerouslyUseHTMLString: true,
    }
  ).then(() => {
    ElMessage.success('Hệ thống đang được phục hồi...')
  }).catch(() => {})
}

const deleteBackup = (index) => {
  ElMessageBox.confirm(
    'Bản sao lưu này sẽ bị xóa vĩnh viễn. Tiếp tục?',
    'Xóa bản sao lưu',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'danger',
    }
  ).then(() => {
    backups.value.splice(index, 1)
    ElMessage.success('Đã xóa bản sao lưu')
  }).catch(() => {})
}
</script>

<style scoped>
.custom-table :deep(th.el-table__cell) {
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
</style>
