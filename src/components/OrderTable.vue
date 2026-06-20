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
      <el-table-column label="Hành động" width="360">
        <template #default="{ row }">
          <div class="flex flex-wrap items-center gap-2">
            <el-button type="info" size="mini" @click="openDetailDialog(row)">Chi tiết</el-button>
            <el-button type="primary" size="mini" @click="openEditDialog(row)">Sửa</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">Xóa</el-button>
            <el-button type="warning" size="mini" plain @click="openRefundDialog(row)">Hoàn tiền</el-button>
            <el-button type="danger" size="mini" plain @click="openOverrideDialog(row)">Ghi đè</el-button>
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

    <el-dialog v-model:visible="showRefund" title="Xử lý hoàn tiền" width="450px" center>
      <div class="mb-5 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
        Đang xử lý hoàn tiền cho đơn hàng <strong class="text-orange-500">{{ currentActionRow?.orderId }}</strong>.<br>
        Khách hàng: <strong>{{ currentActionRow?.customer }}</strong>
      </div>
      <el-form label-position="top">
        <el-form-item label="Số tiền hoàn (VNĐ)" required>
          <el-input v-model="refundData.amount" placeholder="Nhập số tiền..." />
        </el-form-item>
        <el-form-item label="Lý do hoàn tiền" required>
          <el-input v-model="refundData.reason" type="textarea" :rows="2" placeholder="VD: Khách hủy đơn, sai mẫu bánh..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="showRefund = false">Hủy</el-button>
          <el-button type="primary" @click="processRefund">Xác nhận hoàn tiền</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model:visible="showOverride" title="Ghi đè hệ thống (Override)" width="450px" center>
      <div class="mb-5 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
        <strong>⚠️ Cảnh báo:</strong> Thao tác này sẽ ép buộc chuyển đổi trạng thái, bỏ qua quy trình thông thường cho đơn <strong class="text-red-700">{{ currentActionRow?.orderId }}</strong>.
      </div>
      <el-form label-position="top">
        <el-form-item label="Ép chuyển sang trạng thái" required>
          <el-select v-model="overrideData.status" class="w-full" placeholder="Chọn trạng thái">
            <el-option label="Hoàn thành" value="Hoàn thành" />
            <el-option label="Đã giao" value="Đã giao" />
            <el-option label="Đã huỷ" value="Đã huỷ" />
          </el-select>
        </el-form-item>
        <el-form-item label="Mã PIN Admin" required>
          <el-input v-model="overrideData.pin" type="password" placeholder="Nhập mã PIN xác nhận..." show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="showOverride = false">Hủy</el-button>
          <el-button type="danger" @click="processOverride">Thực thi Ghi đè</el-button>
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

// Các state phục vụ cho Refund và Override (Mới thêm)
const showRefund = ref(false);
const refundData = ref({ amount: '', reason: '' });
const showOverride = ref(false);
const overrideData = ref({ status: 'Hoàn thành', pin: '' });
const currentActionRow = ref(null);

const statusOptions = ['Chờ nhận', 'Sản xuất', 'Hoàn thành', 'Đã giao', 'Đã huỷ'];

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

// Hàm mở Modal Hoàn tiền (Mới thêm)
const openRefundDialog = row => {
  currentActionRow.value = row;
  refundData.value.amount = row.amount; 
  refundData.value.reason = '';
  showRefund.value = true;
};

// Hàm xử lý Hoàn tiền (Mới thêm)
const processRefund = () => {
  if (!refundData.value.amount || !refundData.value.reason) {
    ElMessage.warning('Vui lòng nhập đủ thông tin hoàn tiền!');
    return;
  }
  
  const index = orders.findIndex(item => item.id === currentActionRow.value.id);
  if (index !== -1) {
    orders[index].status = 'Đã huỷ';
    orders[index].note = `[Đã hoàn tiền: ${refundData.value.amount}] Lý do: ${refundData.value.reason}`;
  }
  
  showRefund.value = false;
  ElMessage.success(`Đã hoàn tất lệnh trả tiền cho đơn ${currentActionRow.value.orderId}`);
};

// Hàm mở Modal Ghi đè (Mới thêm)
const openOverrideDialog = row => {
  currentActionRow.value = row;
  overrideData.value.status = 'Hoàn thành';
  overrideData.value.pin = '';
  showOverride.value = true;
};

// Hàm xử lý Ghi đè (Mới thêm)
const processOverride = () => {
  if (overrideData.value.pin !== '1234') { // Mock PIN
    ElMessage.error('Mã PIN xác thực không hợp lệ!');
    return;
  }
  
  const index = orders.findIndex(item => item.id === currentActionRow.value.id);
  if (index !== -1) {
    orders[index].status = overrideData.value.status;
    orders[index].note = `[SYSTEM OVERRIDE] Trạng thái được ép chuyển thành: ${overrideData.value.status}`;
  }
  
  showOverride.value = false;
  ElMessage.success(`Ghi đè thành công đơn ${currentActionRow.value.orderId}`);
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
    case 'Đã huỷ':
      return 'danger';
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