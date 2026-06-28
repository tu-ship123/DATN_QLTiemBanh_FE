<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'"
    width="640px"
    @close="resetForm"
  >
    <el-form :model="form" label-position="top" v-loading="saving">
      <div class="grid grid-cols-2 gap-4">

        <!-- Ảnh sản phẩm -->
        <el-form-item label="Ảnh sản phẩm" class="col-span-2">
          <div class="flex items-center gap-4 w-full">
            <!-- Preview -->
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-dashed border-gray-300 flex items-center justify-center shrink-0">
              <img v-if="form.anhSanPham && !isPlaceholder" :src="form.anhSanPham"
                class="w-full h-full object-cover" alt="Xem trước ảnh"
                @error="form.anhSanPham = defaultImage" />
              <span v-else class="text-gray-300 text-3xl">
                <iconify-icon icon="ph:cake-duotone"></iconify-icon>
              </span>
            </div>

            <div class="flex flex-col gap-2 flex-1">
              <!-- Tab chọn kiểu ảnh -->
              <div class="flex gap-2">
                <button type="button" @click="imageMode = 'upload'"
                  class="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all"
                  :class="imageMode === 'upload'
                    ? 'bg-[#7A5C3A] text-white border-[#7A5C3A]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">
                  📁 Tải ảnh lên
                </button>
                <button type="button" @click="imageMode = 'url'"
                  class="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all"
                  :class="imageMode === 'url'
                    ? 'bg-[#7A5C3A] text-white border-[#7A5C3A]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">
                  🔗 Nhập URL
                </button>
              </div>

              <!-- Upload file -->
              <template v-if="imageMode === 'upload'">
                <label class="btn-secondary cursor-pointer inline-flex items-center gap-1.5 text-sm px-3 py-1.5 w-fit">
                  <el-icon><Upload /></el-icon> Chọn ảnh từ máy
                  <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                </label>
                <p class="text-xs text-muted">PNG, JPG tối đa 5MB</p>
              </template>

              <!-- Nhập URL -->
              <template v-if="imageMode === 'url'">
                <el-input
                  v-model="form.anhSanPham"
                  placeholder="https://example.com/banh.jpg"
                  size="small"
                  clearable
                />
                <p class="text-xs text-muted">Dán link ảnh từ internet</p>
              </template>

              <!-- Xóa ảnh -->
              <button v-if="form.anhSanPham && !isPlaceholder" type="button"
                class="text-xs text-red-400 hover:text-red-500 text-left w-fit"
                @click="form.anhSanPham = defaultImage">
                Xóa ảnh
              </button>
            </div>
          </div>
        </el-form-item>

        <!-- Tên sản phẩm -->
        <el-form-item label="Tên sản phẩm *" class="col-span-2">
          <el-input v-model="form.tenSanPham" placeholder="VD: Bánh sinh nhật 3D Custom" />
        </el-form-item>

        <!-- Danh mục -->
        <el-form-item label="Danh mục *">
          <el-select v-model="form.danhMucId" style="width:100%" placeholder="Chọn danh mục">
            <el-option
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :label="cat.tenDanhMuc"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <!-- Giá bán -->
        <el-form-item label="Giá bán (đ) *">
          <el-input v-model.number="form.donGia" type="number" placeholder="500000" :min="0" />
        </el-form-item>

        <!-- Số lượng tồn -->
        <el-form-item label="Số lượng tồn">
          <el-input-number v-model="form.soLuongTon" :min="0" style="width:100%" />
        </el-form-item>

        <!-- Mô tả -->
        <el-form-item label="Mô tả" class="col-span-2">
          <el-input v-model="form.moTa" type="textarea" :rows="3" placeholder="Mô tả chi tiết sản phẩm..." />
        </el-form-item>

        <!-- Trạng thái -->
        <el-form-item class="col-span-2">
          <div class="flex gap-6">
            <el-checkbox v-model="form.trangThaiActive" label="Đang bán" />
            <el-checkbox v-model="form.isBestseller" label="🔥 Gắn nhãn Bán chạy" />
            <el-checkbox v-model="form.choPhepTuyChinh" label="Cho phép tuỳ chỉnh" />
          </div>
        </el-form-item>

      </div>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)" :disabled="saving">Huỷ</el-button>
      <el-button
        type="primary"
        :style="{ background: '#7A5C3A', borderColor: '#7A5C3A' }"
        :loading="saving"
        @click="handleSave"
      >
        {{ editingProduct ? 'Cập nhật' : 'Thêm sản phẩm' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { productService } from '../services/productService'
import { useCategoryStore } from '../stores/categoryStore'

const props = defineProps({
  visible:        { type: Boolean, default: false },
  editingProduct: { type: Object,  default: null  }
})
const emit = defineEmits(['update:visible', 'save'])

const categoryStore = useCategoryStore()
const saving    = ref(false)
const imageMode = ref('upload') // 'upload' | 'url'

if (!categoryStore.categories.length) {
  categoryStore.fetchAdminCategories()
}

const defaultImage = 'https://placehold.co/400x300?text=Polycake'

const emptyForm = () => ({
  tenSanPham:      '',
  danhMucId:       null,
  donGia:          0,
  soLuongTon:      0,
  moTa:            '',
  anhSanPham:      defaultImage,
  trangThaiActive: true,
  isBestseller:    false,
  choPhepTuyChinh: false,
})

const form = ref(emptyForm())

const isPlaceholder = computed(() =>
  !form.value.anhSanPham || form.value.anhSanPham === defaultImage
)

// Hàm đổ data vào form
function fillForm(p) {
  form.value = {
    tenSanPham:      p.tenSanPham      || '',
    danhMucId:       p.danhMucId       || null,
    donGia:          p.donGia          || 0,
    soLuongTon:      p.soLuongTon      || 0,
    moTa:            p.moTa            || '',
    anhSanPham:      p.anhSanPham      || defaultImage,
    trangThaiActive: p.trangThai === 'DANG_BAN',
    isBestseller:    p.isBestseller    || false,
    choPhepTuyChinh: p.choPhepTuyChinh || false,
  }
  imageMode.value = (p.anhSanPham && p.anhSanPham.startsWith('http') && p.anhSanPham !== defaultImage)
    ? 'url' : 'upload'
}

// Fill form ngay khi component mount (v-if tạo lại component mỗi lần mở)
onMounted(() => {
  if (props.editingProduct) {
    fillForm(props.editingProduct)
  } else {
    form.value      = emptyForm()
    imageMode.value = 'upload'
  }
})

// Watch visible: fallback khi dùng v-show
watch(() => props.visible, (val) => {
  if (!val) return
  if (props.editingProduct) {
    fillForm(props.editingProduct)
  } else {
    form.value      = emptyForm()
    imageMode.value = 'upload'
  }
})

// Watch editingProduct: trường hợp visible đã true, chỉ đổi sản phẩm cần sửa
watch(() => props.editingProduct, (p) => {
  if (!props.visible) return
  if (p) {
    fillForm(p)
  } else {
    form.value      = emptyForm()
    imageMode.value = 'upload'
  }
})

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { ElMessage.warning('Vui lòng chọn file ảnh'); return }
  if (file.size > 5 * 1024 * 1024)    { ElMessage.warning('Ảnh tối đa 5MB'); return }
  const reader = new FileReader()
  reader.onload = () => { form.value.anhSanPham = reader.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function resetForm() {
  form.value      = emptyForm()
  imageMode.value = 'upload'
}

function buildPayload() {
  return {
    tenSanPham:      form.value.tenSanPham,
    danhMucId:       form.value.danhMucId,
    donGia:          Number(form.value.donGia),
    soLuongTon:      Number(form.value.soLuongTon),
    moTa:            form.value.moTa,
    anhSanPham:      isPlaceholder.value ? null : form.value.anhSanPham,
    trangThai:       form.value.trangThaiActive ? 'DANG_BAN' : 'TAM_AN',
    isBestseller:    form.value.isBestseller,
    choPhepTuyChinh: form.value.choPhepTuyChinh,
  }
}

async function handleSave() {
  if (!form.value.tenSanPham?.trim()) {
    ElMessage.warning('Vui lòng nhập tên sản phẩm'); return
  }
  if (!form.value.donGia || form.value.donGia <= 0) {
    ElMessage.warning('Vui lòng nhập giá bán hợp lệ'); return
  }
  if (!form.value.danhMucId) {
    ElMessage.warning('Vui lòng chọn danh mục'); return
  }

  saving.value = true
  try {
    const payload = buildPayload()
    if (props.editingProduct) {
      await productService.admin.update(props.editingProduct.id, payload)
      ElMessage.success('Cập nhật sản phẩm thành công!')
    } else {
      await productService.admin.create(payload)
      ElMessage.success('Thêm sản phẩm thành công!')
    }
    emit('save')
    emit('update:visible', false)
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại!'
    ElMessage.error(typeof msg === 'string' ? msg : 'Lỗi khi lưu sản phẩm')
  } finally {
    saving.value = false
  }
}
</script>