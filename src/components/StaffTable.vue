<template>
  <el-card class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">Nhân sự & Phân quyền</h2>
        <p class="mt-2 text-sm text-slate-500">Quản lý nhân viên, vai trò và trạng thái truy cập.</p>
      </div>
      <el-button type="primary" class="rounded-3xl bg-gradient-to-r from-cake-500 to-orange-500 text-white" @click="openCreateDialog">
        Thêm nhân viên
      </el-button>
    </div>

    <el-table :data="filteredStaff" stripe border size="medium" class="w-full" :row-class-name="tableRowClass">
      <el-table-column prop="name" label="Họ tên" min-width="200" />
      <el-table-column prop="role" label="Vai trò" width="180" />
      <el-table-column prop="email" label="Email" min-width="220" />
      <el-table-column prop="phone" label="Số điện thoại" width="150" />
      <el-table-column label="Trạng thái" width="160">
        <template #default="{ row }">
          <el-switch v-model="row.active" active-color="#fb923c" inactive-color="#d1d5db" />
        </template>
      </el-table-column>
      <el-table-column label="Hành động" width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-button type="primary" size="mini" @click="openEditDialog(row)">Sửa</el-button>
            <el-button type="danger" size="mini" @click="handleRemove(row)">Xóa</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model:visible="staffDialogVisible" :title="dialogTitle" width="560px" center>
      <el-form :model="staffForm" label-width="120px" class="space-y-4">
        <el-form-item label="Họ tên">
          <el-input v-model="staffForm.name" placeholder="Tên nhân viên" />
        </el-form-item>
        <el-form-item label="Vai trò">
          <el-input v-model="staffForm.role" placeholder="Vai trò" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="staffForm.email" placeholder="email@polycake.com" />
        </el-form-item>
        <el-form-item label="Số điện thoại">
          <el-input v-model="staffForm.phone" placeholder="090 123 4567" />
        </el-form-item>
        <el-form-item label="Kích hoạt">
          <el-switch v-model="staffForm.active" active-color="#fb923c" inactive-color="#d1d5db" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="staffDialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveStaff">Lưu</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { computed, defineExpose, inject, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createResource, deleteResource, fetchResource, updateResource } from '../services/apiService';

const searchQuery = inject('searchQuery');
const pageActions = inject('pageActions');

const staffList = reactive([]);
const staffDialogVisible = ref(false);
const editingStaffId = ref(null);

const staffForm = reactive({ id: null, name: '', role: '', email: '', phone: '', active: true });

const dialogTitle = computed(() => (editingStaffId.value ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'));

const resetForm = () => {
  editingStaffId.value = null;
  staffForm.id = null;
  staffForm.name = '';
  staffForm.role = '';
  staffForm.email = '';
  staffForm.phone = '';
  staffForm.active = true;
};

const filteredStaff = computed(() => {
  if (!searchQuery?.value) return staffList;
  const query = searchQuery.value.toLowerCase();
  return staffList.filter(user =>
    [user.name, user.role, user.email].some(field => field.toLowerCase().includes(query))
  );
});

const openCreateDialog = () => {
  resetForm();
  staffDialogVisible.value = true;
};

const openEditDialog = row => {
  editingStaffId.value = row.id;
  staffForm.id = row.id;
  staffForm.name = row.name;
  staffForm.role = row.role;
  staffForm.email = row.email;
  staffForm.phone = row.phone;
  staffForm.active = row.active;
  staffDialogVisible.value = true;
};

const saveStaff = async () => {
  if (!staffForm.name || !staffForm.role || !staffForm.email) {
    ElMessage({ message: 'Vui lòng điền đầy đủ thông tin nhân sự', type: 'warning' });
    return;
  }

  if (editingStaffId.value) {
    const updated = await updateResource('staff', editingStaffId.value, { ...staffForm });
    const index = staffList.findIndex(item => item.id === updated.id);
    if (index !== -1) staffList[index] = updated;
    ElMessage({ message: 'Cập nhật nhân viên thành công', type: 'success' });
  } else {
    const created = await createResource('staff', { ...staffForm });
    staffList.push(created);
    ElMessage({ message: 'Thêm nhân viên mới thành công', type: 'success' });
  }

  staffDialogVisible.value = false;
  resetForm();
};

const handleRemove = row => {
  ElMessageBox.confirm(`Xóa thành viên ${row.name}?`, 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Huỷ',
    type: 'warning'
  })
    .then(async () => {
      await deleteResource('staff', row.id);
      const index = staffList.findIndex(item => item.id === row.id);
      if (index !== -1) staffList.splice(index, 1);
      ElMessage({ message: `Đã xóa ${row.name}`, type: 'success' });
    })
    .catch(() => {
      ElMessage({ message: 'Huỷ thao tác', type: 'info' });
    });
};

const tableRowClass = ({ rowIndex }) => (rowIndex % 2 === 0 ? 'bg-slate-50' : '');

const loadStaff = async () => {
  const data = await fetchResource('staff');
  staffList.splice(0, staffList.length, ...data);
};

onMounted(() => {
  pageActions.openStaffModal = openCreateDialog;
  loadStaff();
});

defineExpose({ openCreateDialog });
</script>
