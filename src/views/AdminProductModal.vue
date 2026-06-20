<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'"
    width="640px"
    @close="resetForm"
  >
    <el-form :model="form" label-position="top">
      <div class="grid grid-cols-2 gap-4">
        <!-- Upload ảnh -->
        <el-form-item label="Ảnh sản phẩm" class="col-span-2">
          <div class="flex items-center gap-4">
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-dashed border-gray-300 flex items-center justify-center shrink-0">
              <img v-if="form.image && !isPlaceholder" :src="form.image" class="w-full h-full object-cover" alt="Xem trước ảnh sản phẩm" />
              <span v-else class="text-gray-300 text-3xl">🎂</span>
            </div>
            <div class="flex flex-col gap-2">
              <label class="btn-secondary cursor-pointer inline-flex items-center gap-1.5 text-sm px-3 py-1.5 w-fit">
                <el-icon><Upload /></el-icon> Tải ảnh lên
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
              <button
                v-if="form.image && !isPlaceholder"
                type="button"
                class="text-xs text-red-400 hover:text-red-500 text-left w-fit"
                @click="removeImage"
              >
                Xóa ảnh
              </button>
              <p class="text-xs text-muted">PNG, JPG tối đa 5MB · ảnh đang lưu tạm trên trình duyệt (mock, chưa nối API upload thật)</p>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Tên sản phẩm" required class="col-span-2">
          <el-input v-model="form.name" placeholder="VD: Bánh sinh nhật 3D Custom" />
        </el-form-item>
        <el-form-item label="Danh mục" required>
          <el-select v-model="form.category" style="width:100%">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="Giá bán (đ)" required>
          <el-input v-model="form.price" placeholder="500,000" />
        </el-form-item>
        <el-form-item label="Giá gốc (đ)">
          <el-input v-model="form.originalPrice" placeholder="Để trống nếu không có khuyến mãi" />
        </el-form-item>
        <el-form-item label="Thời gian làm (giờ)">
          <el-input-number v-model="form.makeTime" :min="1" :max="72" style="width:100%" />
        </el-form-item>
        <el-form-item label="Mô tả" class="col-span-2">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Mô tả chi tiết về sản phẩm..." />
        </el-form-item>
        <el-form-item label="Thành phần / Nguyên liệu" class="col-span-2">
          <el-input v-model="form.ingredients" placeholder="Bột mì, trứng, đường, kem tươi..." />
        </el-form-item>
        <el-form-item class="col-span-2">
          <div class="flex gap-6">
            <el-checkbox v-model="form.active" label="Đang bán" />
            <el-checkbox v-model="form.isBestseller" label="🔥 Gắn nhãn Bán chạy" />
            <el-checkbox v-model="form.canCustomize" label="Cho phép tuỳ chỉnh" />
          </div>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="emit('update:visible', false)">Huỷ</el-button>
      <el-button type="primary" :style="{ background: '#E8634A', borderColor: '#E8634A' }" @click="handleSave">
        {{ editingProduct ? 'Cập nhật' : 'Thêm sản phẩm' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  editingProduct: { type: Object, default: null }
})
const emit = defineEmits(['update:visible', 'save'])

const defaultProductImage = '/cake-placeholder.svg'
const categoryOptions = ['Bánh sinh nhật', 'Bánh cưới', 'Cupcake', 'Mousse', 'Macaron', 'Bánh kem']

const emptyForm = () => ({
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  makeTime: 4,
  description: '',
  ingredients: '',
  active: true,
  isBestseller: false,
  canCustomize: false,
  image: defaultProductImage
})

const form = ref(emptyForm())
const isPlaceholder = computed(() => form.value.image === defaultProductImage)

// Mỗi khi dialog mở, nạp lại data: sửa thì lấy từ editingProduct, thêm mới thì form trống.
watch(
  () => props.visible,
  (val) => {
    if (val) {
      form.value = props.editingProduct ? { ...emptyForm(), ...props.editingProduct } : emptyForm()
    }
  }
)

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('Vui lòng chọn file ảnh')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('Ảnh tối đa 5MB')
    return
  }
  // Mock: đọc file thành base64 để preview ngay, chưa upload lên server/storage thật.
  // Khi đấu API: đổi đoạn này thành gọi service upload, rồi gán URL trả về cho form.image.
  const reader = new FileReader()
  reader.onload = () => {
    form.value.image = reader.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function removeImage() {
  form.value.image = defaultProductImage
}

function resetForm() {
  form.value = emptyForm()
}

function handleSave() {
  if (!form.value.name || !form.value.price) {
    ElMessage.warning('Vui lòng điền tên và giá')
    return
  }
  emit('save', { ...form.value })
}
</script>