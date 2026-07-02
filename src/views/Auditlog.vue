<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6">
      <p class="text-sm uppercase tracking-[.24em] text-cake-500">Cài đặt</p>
      <h1 class="text-3xl font-semibold text-slate-900">Nhật ký hoạt động</h1>
      <p class="mt-2 text-sm text-slate-500">Theo dõi toàn bộ thay đổi trong hệ thống. Nhấp vào một dòng để xem chi tiết khác biệt dữ liệu cũ và mới.</p>
      <el-alert v-if="loadError" :title="loadError" type="warning" show-icon class="mt-3" />
    </div>

    <el-card class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <!-- Bộ lọc -->
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <el-input
            v-model="searchKeyword"
            placeholder="Tìm theo người dùng hoặc đối tượng..."
            clearable
            class="max-w-xs"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="actionFilter" placeholder="Tất cả hành động" clearable class="w-44">
            <el-option label="Tạo mới" value="create" />
            <el-option label="Cập nhật" value="update" />
            <el-option label="Xóa" value="delete" />
          </el-select>
        </div>
        <p class="text-sm text-slate-400">{{ filteredLogs.length }} hoạt động</p>
      </div>

      <!-- Bảng danh sách -->
      <el-table
        :data="paginatedLogs"
        class="audit-table cursor-pointer rounded-2xl"
        @row-click="openDiff"
      >
        <el-table-column label="Thời gian" width="170">
          <template #default="{ row }">
            <span class="text-sm text-slate-600">{{ row.timestamp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Người thực hiện" width="190">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-avatar :size="28" class="bg-cake-100 text-cake-600">{{ initials(row.user.name) }}</el-avatar>
              <span class="text-sm text-slate-700">{{ row.user.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Hành động" width="130">
          <template #default="{ row }">
            <el-tag :type="actionTagType(row.action)" effect="light" round>{{ actionLabel(row.action) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="Đối tượng">
          <template #default="{ row }">
            <span class="text-sm text-slate-700">{{ row.target }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="130" align="right">
          <template #default="{ row }">
            <el-button text type="primary" @click.stop="openDiff(row)">Xem chi tiết</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="filteredLogs.length === 0" class="py-12 text-center text-sm text-slate-400">
        Không tìm thấy hoạt động nào phù hợp.
      </div>

      <!-- Phân trang -->
      <div class="mt-4 flex justify-end" v-if="filteredLogs.length > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredLogs.length"
          layout="prev, pager, next"
          background
        />
      </div>
    </el-card>

    <!-- Dialog xem diff JSON cũ/mới -->
    <el-dialog v-model="diffDialogVisible" width="640px" class="rounded-2xl" title="Chi tiết thay đổi">
      <template v-if="selectedLog">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span class="font-medium text-slate-700">{{ selectedLog.target }}</span>
          <div class="flex items-center gap-3">
            <el-tag :type="actionTagType(selectedLog.action)" effect="light" round>{{ actionLabel(selectedLog.action) }}</el-tag>
            <span>{{ selectedLog.timestamp }} · {{ selectedLog.user.name }}</span>
          </div>
        </div>

        <div class="overflow-hidden rounded-2xl border border-slate-200">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-4 py-2.5 text-left font-medium">Trường</th>
                <th class="px-4 py-2.5 text-left font-medium">Giá trị cũ</th>
                <th class="px-4 py-2.5 text-left font-medium">Giá trị mới</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in diffRows" :key="row.key" class="border-t border-slate-100">
                <td class="px-4 py-2.5 font-medium text-slate-700 align-top">{{ row.key }}</td>
                <td class="px-4 py-2.5 align-top" :class="diffCellClass(row.status, 'old')">{{ formatValue(row.oldVal) }}</td>
                <td class="px-4 py-2.5 align-top" :class="diffCellClass(row.status, 'new')">{{ formatValue(row.newVal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex gap-4 text-xs text-slate-400">
          <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-red-200"></span>Đã xóa / thay đổi</span>
          <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-green-200"></span>Mới thêm / cập nhật</span>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { auditLogService } from '../services/auditLogService';

const auditLogs = ref([]);
const isLoading = ref(true);
const loadError = ref('');

// hanhDong bên BE: "UPDATE" | "DELETE" | "SOFT_DELETE" (API chỉ trả 3 loại này,
// không có "CREATE" — xem AuditLogController.getSensitiveLogs()).
const ACTION_MAP = { UPDATE: 'update', DELETE: 'delete', SOFT_DELETE: 'delete' };

function safeParseJson(str) {
  if (!str) return null;
  try { return JSON.parse(str); } catch { return { value: str }; }
}

async function loadAuditLogs() {
  isLoading.value = true;
  loadError.value = '';
  try {
    const res = await auditLogService.getSensitiveLogs();
    const rows = Array.isArray(res.data) ? res.data : [];
    auditLogs.value = rows.map((log) => ({
      id: log.id,
      timestamp: log.ngayTao ? log.ngayTao.replace('T', ' ').slice(0, 16) : '—',
      user: { name: log.nguoiDung?.hoTen || 'Hệ thống' },
      action: ACTION_MAP[log.hanhDong] || 'update',
      target: `${log.tenBang || 'Bản ghi'} #${log.banGhiId ?? ''}`,
      oldValue: safeParseJson(log.giaTriCu),
      newValue: safeParseJson(log.giaTriMoi),
    }));
  } catch (err) {
    console.warn('Không load được nhật ký hệ thống:', err.message);
    loadError.value = 'Không thể tải nhật ký hoạt động từ server.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadAuditLogs);

const searchKeyword = ref('');
const actionFilter = ref('');
const currentPage = ref(1);
const pageSize = 5;

const filteredLogs = computed(() =>
  auditLogs.value.filter((log) => {
    const matchAction = actionFilter.value ? log.action === actionFilter.value : true;
    const keyword = searchKeyword.value.trim().toLowerCase();
    const matchKeyword = keyword
      ? log.user.name.toLowerCase().includes(keyword) || log.target.toLowerCase().includes(keyword)
      : true;
    return matchAction && matchKeyword;
  })
);

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredLogs.value.slice(start, start + pageSize);
});

const actionTagType = (action) => ({ create: 'success', update: 'warning', delete: 'danger' }[action] || 'info');
const actionLabel = (action) => ({ create: 'Tạo mới', update: 'Cập nhật', delete: 'Xóa' }[action] || action);

const initials = (name) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

// Diff dialog
const diffDialogVisible = ref(false);
const selectedLog = ref(null);

const openDiff = (row) => {
  selectedLog.value = row;
  diffDialogVisible.value = true;
};

const diffRows = computed(() => {
  if (!selectedLog.value) return [];
  const { oldValue, newValue } = selectedLog.value;
  const keys = new Set([...Object.keys(oldValue || {}), ...Object.keys(newValue || {})]);

  return Array.from(keys).map((key) => {
    const oldVal = oldValue ? oldValue[key] : undefined;
    const newVal = newValue ? newValue[key] : undefined;

    let status = 'unchanged';
    if (oldValue === null) status = 'added';
    else if (newValue === null) status = 'removed';
    else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) status = 'changed';

    return { key, oldVal, newVal, status };
  });
});

const formatValue = (val) => {
  if (val === undefined) return '—';
  if (val === null) return 'null';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const diffCellClass = (status, side) => {
  if (side === 'old') {
    if (status === 'changed' || status === 'removed') return 'bg-red-50 text-red-600 line-through';
    if (status === 'added') return 'text-slate-300';
    return 'text-slate-600';
  }
  // side === 'new'
  if (status === 'changed' || status === 'added') return 'bg-green-50 text-green-600 font-medium';
  if (status === 'removed') return 'text-slate-300';
  return 'text-slate-600';
};
</script>

<style scoped>
.audit-table :deep(.el-table__row) {
  cursor: pointer;
}
</style>