<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-black text-[#5C4428]">Danh mục</h1>
        <p class="text-sm text-gray-400 mt-0.5">Quản lý danh mục sản phẩm</p>
      </div>
      <button
        class="flex items-center gap-2 bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#7A5C3A]/30 hover:shadow-[#7A5C3A]/50 hover:-translate-y-0.5 transition-all"
        @click="openAddModal"
      >
        <iconify-icon icon="ph:plus-bold" class="text-base"></iconify-icon>
        Thêm danh mục
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="bg-white rounded-2xl p-4 animate-pulse">
        <div class="w-full h-32 bg-gray-100 rounded-xl mb-3"></div>
        <div class="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
        <div class="h-3 bg-gray-100 rounded w-full"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-20 h-20 rounded-2xl bg-[#FDF6EC] flex items-center justify-center mb-4">
        <iconify-icon icon="ph:tag-duotone" class="text-4xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <p class="text-lg font-bold text-[#5C4428] mb-1">Chưa có danh mục nào</p>
      <p class="text-sm text-gray-400">Bấm "Thêm danh mục" để tạo mới.</p>
    </div>

    <!-- Category Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-2xl border border-[#EDE0CC] overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-200 group"
      >
        <!-- Ảnh -->
        <div class="relative h-36 bg-[#FFFBF5] overflow-hidden">
          <img
            v-if="cat.anhDaiDien"
            :src="cat.anhDaiDien"
            :alt="cat.tenDanhMuc"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <iconify-icon icon="ph:image-duotone" class="text-4xl text-gray-300"></iconify-icon>
          </div>

          <!-- Trạng thái badge -->
          <span
            class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="cat.hoatDong ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"
          >
            {{ cat.hoatDong ? 'Hoạt động' : 'Ẩn' }}
          </span>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="font-bold text-[#5C4428] truncate mb-1">{{ cat.tenDanhMuc }}</h3>
          <p class="text-xs text-gray-400 line-clamp-2 min-h-[32px]">{{ cat.moTa || 'Chưa có mô tả' }}</p>

          <!-- Actions -->
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-[#FDF8F2]">
            <button
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#7A5C3A] bg-[#FDF6EC] hover:bg-[#FFE4DC] transition-colors"
              @click="openEditModal(cat)"
            >
              <iconify-icon icon="ph:pencil-simple-duotone"></iconify-icon>
              Sửa
            </button>
            <button
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
              @click="confirmDelete(cat)"
            >
              <iconify-icon icon="ph:trash-duotone"></iconify-icon>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MODAL THÊM / SỬA ===== -->
    <el-dialog
      v-model="modalVisible"
      :title="isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới'"
      width="480px"
      border-radius="16px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="space-y-1"
      >
        <el-form-item label="Tên danh mục" prop="tenDanhMuc">
          <el-input
            v-model="form.tenDanhMuc"
            placeholder="VD: Bánh sinh nhật"
            size="large"
          />
        </el-form-item>

        <el-form-item label="Mô tả" prop="moTa">
          <el-input
            v-model="form.moTa"
            type="textarea"
            :rows="3"
            placeholder="Mô tả ngắn về danh mục..."
          />
        </el-form-item>

        <el-form-item label="URL ảnh đại diện" prop="anhDaiDien">
          <el-input
            v-model="form.anhDaiDien"
            placeholder="https://..."
            size="large"
          />
          <!-- Preview ảnh -->
          <div v-if="form.anhDaiDien" class="mt-2">
            <img
              :src="form.anhDaiDien"
              class="h-24 w-full object-cover rounded-xl border border-[#EDE0CC]"
              @error="(e) => (e.target.style.display = 'none')"
            />
          </div>
        </el-form-item>

        <el-form-item label="Trạng thái">
          <el-switch
            v-model="form.hoatDong"
            active-text="Hoạt động"
            inactive-text="Ẩn"
            style="--el-switch-on-color: #7A5C3A"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <el-button size="large" @click="modalVisible = false">Hủy</el-button>
          <el-button
            size="large"
            type="primary"
            :loading="submitting"
            style="background: linear-gradient(135deg,#7A5C3A,#9A7650); border:none; border-radius:12px; font-weight:700"
            @click="submitForm"
          >
            {{ isEditing ? 'Lưu thay đổi' : 'Thêm danh mục' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryService } from '@/services/categoryService'

// ─── State ───────────────────────────────────────────────────────────────────
const categories   = ref([])
const loading      = ref(false)
const submitting   = ref(false)
const modalVisible = ref(false)
const isEditing    = ref(false)
const editingId    = ref(null)
const formRef      = ref(null)

const form = reactive({
  tenDanhMuc: '',
  moTa:       '',
  anhDaiDien: '',
  hoatDong:   true,
})

const rules = {
  tenDanhMuc: [{ required: true, message: 'Vui lòng nhập tên danh mục', trigger: 'blur' }],
}

// ─── API calls (dùng categoryService → apiClient → tự gắn token từ sessionStorage) ──

/** GET /api/v1/admin/categories */
async function fetchCategories() {
  loading.value = true
  try {
    const res = await categoryService.admin.getAll()
    const data = res.data
    categories.value = Array.isArray(data) ? data : (data.data ?? [])
  } catch (err) {
    ElMessage.error('Không thể tải danh sách danh mục!')
    console.error(err)
  } finally {
    loading.value = false
  }
}

/** POST /api/v1/admin/categories */
async function createCategory(payload) {
  const res = await categoryService.admin.create(payload)
  return res.data
}

/** PUT /api/v1/admin/categories/{id} */
async function updateCategory(id, payload) {
  const res = await categoryService.admin.update(id, payload)
  return res.data
}

/** DELETE /api/v1/admin/categories/{id} */
async function deleteCategory(id) {
  await categoryService.admin.delete(id)
}

// ─── Handlers ────────────────────────────────────────────────────────────────

function resetForm() {
  Object.assign(form, { tenDanhMuc: '', moTa: '', anhDaiDien: '', hoatDong: true })
  editingId.value = null
}

function openAddModal() {
  resetForm()
  isEditing.value = false
  modalVisible.value = true
}

function openEditModal(cat) {
  resetForm()
  isEditing.value = true
  editingId.value = cat.id
  Object.assign(form, {
    tenDanhMuc: cat.tenDanhMuc,
    moTa:       cat.moTa       || '',
    anhDaiDien: cat.anhDaiDien || '',
    hoatDong:   cat.hoatDong   ?? true,
  })
  modalVisible.value = true
}

async function submitForm() {
  await formRef.value.validate()
  submitting.value = true
  const payload = {
    tenDanhMuc: form.tenDanhMuc,
    moTa:       form.moTa,
    anhDaiDien: form.anhDaiDien,
    hoatDong:   form.hoatDong,
  }
  try {
    if (isEditing.value) {
      await updateCategory(editingId.value, payload)
      ElMessage.success('Cập nhật danh mục thành công!')
    } else {
      await createCategory(payload)
      ElMessage.success('Thêm danh mục thành công!')
    }
    modalVisible.value = false
    await fetchCategories()
  } catch (err) {
    ElMessage.error(isEditing.value ? 'Cập nhật thất bại!' : 'Thêm danh mục thất bại!')
    console.error(err)
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(cat) {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc muốn xóa danh mục "<b>${cat.tenDanhMuc}</b>"?`,
      'Xác nhận xóa',
      {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        confirmButtonClass: 'el-button--danger',
      }
    )
    await deleteCategory(cat.id)
    ElMessage.success('Đã xóa danh mục!')
    await fetchCategories()
  } catch {
    // người dùng bấm Hủy → không làm gì
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(fetchCategories)
</script>