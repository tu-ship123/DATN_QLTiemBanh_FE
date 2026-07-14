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
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <p class="text-xl font-bold text-slate-800">{{ backups[0] ? backups[0].date : '—' }}</p>
        </div>
      </div>
    </div>

    <el-alert
      type="info"
      show-icon
      :closable="false"
      class="mb-4 rounded-xl"
      title="Hệ thống tự động backup lúc 2:00 sáng mỗi ngày. Bấm 'Tạo bản sao lưu mới' để backup thủ công ngay."
    />

    <el-card class="rounded-[28px] border border-slate-200 shadow-sm" body-class="p-0">
      <div class="p-5 border-b border-slate-100">
        <h3 class="font-semibold text-slate-800">Lịch sử sao lưu</h3>
      </div>

      <el-table :data="backups" v-loading="loading" style="width: 100%" class="custom-table" header-cell-class-name="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
        <el-table-column label="Tên file" min-width="280">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <iconify-icon icon="ph:file-sql-duotone" class="text-2xl text-slate-400" />
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ row.name }}</p>
                <p class="text-xs text-slate-500">Người thực hiện: {{ row.author }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="Thời gian" width="180" />
        <el-table-column label="Trạng thái" width="140" align="center">
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
      </el-table>
      <div v-if="!loading && backups.length === 0" class="p-8 text-center text-sm text-slate-400">
        Chưa có bản sao lưu nào.
      </div>
    </el-card>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import apiClient from '@/services/apiService'

const isCreating = ref(false)
const loading = ref(false)
const backups = ref([])

function mapLog(log) {
  // giaTriMoi có dạng "THANH_CONG|ten_file.bak" hoặc "THAT_BAI|lý do lỗi"
  const [ketQua, chiTiet] = (log.giaTriMoi || '').split('|')
  return {
    name: ketQua === 'THANH_CONG' ? chiTiet : `(lỗi) ${chiTiet || 'Không rõ nguyên nhân'}`,
    author: log.nguoiDung ? log.nguoiDung.hoTen : 'Hệ thống tự động',
    date: log.ngayTao ? new Date(log.ngayTao).toLocaleString('vi-VN') : '',
    status: ketQua === 'THANH_CONG' ? 'Thành công' : 'Thất bại',
  }
}

async function fetchHistory() {
  loading.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/backup/history')
    backups.value = (data || []).map(mapLog)
  } catch {
    ElMessage.error('Không thể tải lịch sử sao lưu!')
  } finally {
    loading.value = false
  }
}

const createBackup = async () => {
  isCreating.value = true
  try {
    const { data } = await apiClient.post('/api/v1/admin/backup/run')
    backups.value.unshift(mapLog(data))
    if (data.giaTriMoi?.startsWith('THANH_CONG')) {
      ElMessage.success('Đã tạo bản sao lưu mới thành công')
    } else {
      ElMessage.error('Backup thất bại, xem chi tiết trong bảng bên dưới')
    }
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || 'Không thể tạo bản sao lưu!')
  } finally {
    isCreating.value = false
  }
}

onMounted(fetchHistory)
</script>

<style scoped>
.custom-table :deep(th.el-table__cell) {
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
</style>
