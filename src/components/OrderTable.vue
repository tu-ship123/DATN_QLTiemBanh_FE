<template>
  <el-card class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">Danh sách đơn hàng</h2>
        <p class="mt-2 text-sm text-slate-500">Quản lý đơn hàng mới nhất và trạng thái sản xuất.</p>
      </div>
      <el-button type="primary" class="rounded-3xl bg-gradient-to-r from-cake-500 to-orange-500 text-white" @click="openCreateDialog">
        Tạo đơn mới
      </el-button>
    </div>

    <el-table :data="filteredOrders" stripe border size="medium" class="w-full" :row-class-name="tableRowClass">
      <el-table-column prop="orderId" label="Mã đơn" width="130" />
      <el-table-column prop="customer" label="Khách hàng" min-width="180" />
      <el-table-column prop="product" label="Sản phẩm" min-width="220" />
      <el-table-column prop="date" label="Ngày" width="140" />
      <el-table-column label="Trạng thái" width="150">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" class="rounded-full px-3 py-1 text-sm">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Giá trị" width="140">
        <template #default="{ row }">
          <span class="font-semibold text-slate-900">{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Hành động" width="260">
        <template #default="{ row }">
          <div class="flex flex-wrap items-center gap-2">
            <el-button type="info" size="mini" @click="openDetailDialog(row)">Chi tiết</el-button>
            <el-button type="primary" size="mini" @click="openEditDialog(row)">Sửa</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">Xóa</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model:visible="orderDialogVisible"
      :title="dialogTitle"
      width="560px"
      center
    >
      <el-form :model="orderForm" label-width="120px" class="space-y-4">
        <el-form-item label="Mã đơn">
          <el-input v-model="orderForm.orderId" placeholder="#DHxxxx" />
        </el-form-item>
        <el-form-item label="Khách hàng">
          <el-input v-model="orderForm.customer" placeholder="Tên khách hàng" />
        </el-form-item>
        <el-form-item label="Sản phẩm">
          <el-input v-model="orderForm.product" placeholder="Tên sản phẩm" />
        </el-form-item>
        <el-form-item label="Ngày">
          <el-input v-model="orderForm.date" placeholder="dd/mm/yyyy" />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="orderForm.status" placeholder="Chọn trạng thái">
            <el-option v-for="status in statusOptions" :key="status" :label="status" :value="status" />
          </el-select>
        </el-form-item>
        <el-form-item label="Giá trị">
          <el-input v-model="orderForm.amount" placeholder="4,200,000đ" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="orderDialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveOrder">Lưu</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model:visible="orderDetailVisible" title="Chi tiết đơn hàng" width="580px" center>
      <div class="space-y-4 text-sm text-slate-700">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-slate-900">Mã đơn</p>
            <p>{{ selectedOrder.orderId }}</p>
          </div>
          <div>
            <p class="font-semibold text-slate-900">Trạng thái</p>
            <el-tag :type="statusTagType(selectedOrder.status)" class="rounded-full px-3 py-1 text-sm">
              {{ selectedOrder.status }}
            </el-tag>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-slate-900">Khách hàng</p>
            <p>{{ selectedOrder.customer }}</p>
          </div>
          <div>
            <p class="font-semibold text-slate-900">Sản phẩm</p>
            <p>{{ selectedOrder.product }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-slate-900">Ngày</p>
            <p>{{ selectedOrder.date }}</p>
          </div>
          <div>
            <p class="font-semibold text-slate-900">Giá trị</p>
            <p>{{ selectedOrder.amount }}</p>
          </div>
        </div>

        <div>
          <p class="font-semibold text-slate-900">Ghi chú</p>
          <p class="text-slate-500">{{ selectedOrder.note || 'Không có ghi chú bổ sung.' }}</p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <el-button type="primary" @click="orderDetailVisible = false">Đóng</el-button>
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

const orders = reactive([]);
const orderDialogVisible = ref(false);
const editingId = ref(null);
const orderDetailVisible = ref(false);

const selectedOrder = reactive({
  orderId: '',
  customer: '',
  product: '',
  date: '',
  status: '',
  amount: '',
  note: ''
});

const orderForm = reactive({
  id: null,
  orderId: '',
  customer: '',
  product: '',
  date: '',
  status: 'Chờ nhận',
  amount: ''
});

const statusOptions = ['Chờ nhận', 'Sản xuất', 'Hoàn thành', 'Đã giao'];

const dialogTitle = computed(() => (editingId.value ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'));

const resetForm = () => {
  editingId.value = null;
  orderForm.id = null;
  orderForm.orderId = '';
  orderForm.customer = '';
  orderForm.product = '';
  orderForm.date = '';
  orderForm.status = 'Chờ nhận';
  orderForm.amount = '';
};

const filteredOrders = computed(() => {
  if (!searchQuery?.value) return orders;
  const query = searchQuery.value.toLowerCase();
  return orders.filter(order =>
    [order.orderId, order.customer, order.product].some(value => value.toLowerCase().includes(query))
  );
});

const openDetailDialog = row => {
  selectedOrder.orderId = row.orderId;
  selectedOrder.customer = row.customer;
  selectedOrder.product = row.product;
  selectedOrder.date = row.date;
  selectedOrder.status = row.status;
  selectedOrder.amount = row.amount;
  selectedOrder.note = row.note || 'Không có ghi chú bổ sung.';
  orderDetailVisible.value = true;
};

const openCreateDialog = () => {
  resetForm();
  orderDialogVisible.value = true;
};

const openEditDialog = row => {
  editingId.value = row.id;
  orderForm.id = row.id;
  orderForm.orderId = row.orderId;
  orderForm.customer = row.customer;
  orderForm.product = row.product;
  orderForm.date = row.date;
  orderForm.status = row.status;
  orderForm.amount = row.amount;
  orderDialogVisible.value = true;
};

const saveOrder = async () => {
  if (!orderForm.orderId || !orderForm.customer || !orderForm.product) {
    ElMessage({ message: 'Vui lòng điền đầy đủ thông tin đơn hàng', type: 'warning' });
    return;
  }

  if (editingId.value) {
    const updated = await updateResource('orders', editingId.value, { ...orderForm });
    const index = orders.findIndex(item => item.id === updated.id);
    if (index !== -1) {
      orders[index] = updated;
    }
    ElMessage({ message: 'Cập nhật đơn hàng thành công', type: 'success' });
  } else {
    const created = await createResource('orders', { ...orderForm });
    orders.push(created);
    ElMessage({ message: 'Thêm đơn hàng mới thành công', type: 'success' });
  }

  orderDialogVisible.value = false;
  resetForm();
};

const handleDelete = row => {
  ElMessageBox.confirm(`Bạn có chắc muốn xóa ${row.orderId}?`, 'Xác nhận', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Huỷ',
    type: 'warning'
  })
    .then(async () => {
      await deleteResource('orders', row.id);
      const index = orders.findIndex(item => item.id === row.id);
      if (index !== -1) orders.splice(index, 1);
      ElMessage({ message: `Đã xóa ${row.orderId}`, type: 'success' });
    })
    .catch(() => {
      ElMessage({ message: 'Đã huỷ', type: 'info' });
    });
};

const statusTagType = status => {
  switch (status) {
    case 'Hoàn thành':
      return 'success';
    case 'Sản xuất':
      return 'warning';
    case 'Chờ nhận':
      return 'info';
    case 'Đã giao':
      return 'success';
    default:
      return 'info';
  }
};

const tableRowClass = ({ rowIndex }) => (rowIndex % 2 === 0 ? 'bg-slate-50' : '');

const loadOrders = async () => {
  const data = await fetchResource('orders');
  orders.splice(0, orders.length, ...data);
};

onMounted(() => {
  pageActions.openOrderModal = openCreateDialog;
  loadOrders();
});

defineExpose({ openCreateDialog });
</script>
