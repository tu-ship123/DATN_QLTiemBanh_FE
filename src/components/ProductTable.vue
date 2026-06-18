<template>
  <el-card class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900">Danh sách sản phẩm</h2>
        <p class="mt-2 text-sm text-slate-500">Quản lý sản phẩm bánh, tồn kho và danh mục.</p>
      </div>
      <el-button type="primary" class="rounded-3xl bg-gradient-to-r from-cake-500 to-orange-500 text-white" @click="openCreateDialog">
        Thêm sản phẩm
      </el-button>
    </div>

    <el-table :data="filteredProducts" stripe border size="medium" class="w-full" :row-class-name="tableRowClass">
      <el-table-column prop="name" label="Sản phẩm" min-width="220" />
      <el-table-column prop="category" label="Danh mục" width="150" />
      <el-table-column prop="stock" label="Tồn kho" width="120" />
      <el-table-column prop="price" label="Giá bán" width="140" />
      <el-table-column label="Trạng thái" width="150">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" class="rounded-full px-3 py-1 text-sm">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Hành động" width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-button type="primary" size="mini" @click="openEditDialog(row)">Sửa</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">Xóa</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model:visible="productDialogVisible" :title="dialogTitle" width="560px" center>
      <el-form :model="productForm" label-width="120px" class="space-y-4">
        <el-form-item label="Tên sản phẩm">
          <el-input v-model="productForm.name" placeholder="Tên sản phẩm" />
        </el-form-item>
        <el-form-item label="Danh mục">
          <el-input v-model="productForm.category" placeholder="Danh mục" />
        </el-form-item>
        <el-form-item label="Tồn kho">
          <el-input-number v-model="productForm.stock" :min="0" class="w-full" />
        </el-form-item>
        <el-form-item label="Giá bán">
          <el-input v-model="productForm.price" placeholder="520,000đ" />
        </el-form-item>
        <el-form-item label="Trạng thái">
          <el-select v-model="productForm.status" placeholder="Chọn trạng thái">
            <el-option v-for="option in statusOptions" :key="option" :label="option" :value="option" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="productDialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="saveProduct">Lưu</el-button>
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

const products = reactive([]);
const productDialogVisible = ref(false);
const editingProductId = ref(null);
const statusOptions = ['Còn hàng', 'Ít hàng', 'Hết hàng'];

const productForm = reactive({ id: null, name: '', category: '', stock: 0, price: '', status: 'Còn hàng' });

const dialogTitle = computed(() => (editingProductId.value ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'));

const resetForm = () => {
  editingProductId.value = null;
  productForm.id = null;
  productForm.name = '';
  productForm.category = '';
  productForm.stock = 0;
  productForm.price = '';
  productForm.status = 'Còn hàng';
};

const filteredProducts = computed(() => {
  if (!searchQuery?.value) return products;
  const query = searchQuery.value.toLowerCase();
  return products.filter(product =>
    [product.name, product.category, product.price].some(field => field.toLowerCase().includes(query))
  );
});

const openCreateDialog = () => {
  resetForm();
  productDialogVisible.value = true;
};

const openEditDialog = row => {
  editingProductId.value = row.id;
  productForm.id = row.id;
  productForm.name = row.name;
  productForm.category = row.category;
  productForm.stock = row.stock;
  productForm.price = row.price;
  productForm.status = row.status;
  productDialogVisible.value = true;
};

const saveProduct = async () => {
  if (!productForm.name || !productForm.category || !productForm.price) {
    ElMessage({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm', type: 'warning' });
    return;
  }

  if (editingProductId.value) {
    const updated = await updateResource('products', editingProductId.value, { ...productForm });
    const index = products.findIndex(item => item.id === updated.id);
    if (index !== -1) products[index] = updated;
    ElMessage({ message: 'Cập nhật sản phẩm thành công', type: 'success' });
  } else {
    const created = await createResource('products', { ...productForm });
    products.push(created);
    ElMessage({ message: 'Thêm sản phẩm mới thành công', type: 'success' });
  }

  productDialogVisible.value = false;
  resetForm();
};

const handleDelete = row => {
  ElMessageBox.confirm(`Bạn có chắc muốn xóa ${row.name}?`, 'Xác nhận xoá', {
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Huỷ',
    type: 'warning'
  })
    .then(async () => {
      await deleteResource('products', row.id);
      const index = products.findIndex(item => item.id === row.id);
      if (index !== -1) products.splice(index, 1);
      ElMessage({ message: `Đã xóa ${row.name}`, type: 'success' });
    })
    .catch(() => {
      ElMessage({ message: 'Huỷ thao tác', type: 'info' });
    });
};

const statusType = status => {
  switch (status) {
    case 'Còn hàng':
      return 'success';
    case 'Ít hàng':
      return 'warning';
    case 'Hết hàng':
      return 'danger';
    default:
      return 'info';
  }
};

const tableRowClass = ({ rowIndex }) => (rowIndex % 2 === 0 ? 'bg-slate-50' : '');

const loadProducts = async () => {
  const data = await fetchResource('products');
  products.splice(0, products.length, ...data);
};

onMounted(() => {
  pageActions.openProductModal = openCreateDialog;
  loadProducts();
});

defineExpose({ openCreateDialog });
</script>
